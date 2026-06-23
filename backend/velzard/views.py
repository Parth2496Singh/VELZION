import os
import uuid
import requests
import datetime
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny 
import yaml

from .models import ProductionDeployment
from .serializers import ProductionDeploymentSerializer

class ProductionDeploymentViewSet(viewsets.ModelViewSet):
    serializer_class = ProductionDeploymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_anonymous:
            return ProductionDeployment.objects.all()
        return ProductionDeployment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def verify_contract(self, request, pk=None):
        deployment = self.get_object()
        user_token = request.user.github_access_token

        if not user_token:
            return Response({"error": "GitHub access token missing. Please re-authenticate."}, status=401)

        repo_name = deployment.github_repo_url.replace("https://github.com/", "")
        github_url = f"https://api.github.com/repos/{repo_name}/contents/velzion.yaml"
        headers = {
            "Authorization": f"Bearer {user_token}",
            "Accept": "application/vnd.github.v3+json"
        }

        response = requests.get(github_url, headers=headers)

        if response.status_code == 200:
            import base64
            content_b64 = response.json().get('content', '')
            try:
                yaml_content = base64.b64decode(content_b64).decode('utf-8')
                parsed_yaml = yaml.safe_load(yaml_content)
                deployment.config_snapshot = parsed_yaml
                deployment.save()
            except Exception as e:
                print("Failed to parse YAML snapshot:", e)

            return Response({"message": "Contract Verified! Ready for deployment.", "verified": True}, status=200)
        else:
            return Response({"error": "velzion.yaml not found in the repository root.", "verified": False}, status=404)

    @action(detail=True, methods=['post'])
    def trigger_deploy(self, request, pk=None):
        deployment = self.get_object()
        
        if not deployment.config_snapshot:
             return Response({"error": "Cannot deploy. Contract not verified."}, status=400)

        deployment.status = 'PROVISIONING'
        deployment.save()

        n8n_url = os.environ.get('N8N_VELZARD_WEBHOOK', 'http://n8n:5678/webhook/velzard-deploy')
        payload = {
            "action": "deploy",
            "deployment_id": str(deployment.id),
            "repo_full_name": deployment.github_repo_url,
            "branch": deployment.branch,
            "instance_type": deployment.instance_type,
            "volume_size": deployment.volume_size,
        }
        
        try:
            requests.post(n8n_url, json=payload, timeout=5)
        except Exception as e:
            print(f"Warning: n8n webhook failed: {e}")

        return Response({"message": "Deployment orchestrated. Booting production servers."}, status=200)

    @action(detail=True, methods=['post'])
    def destroy_cluster(self, request, pk=None):
        deployment = self.get_object()
        
        if deployment.status in ["DESTROYING", "DESTROYED"]:
            return Response({"error": "Deployment is already terminating or destroyed."}, status=400)

        deployment.status = 'DESTROYING'
        deployment.save()

        n8n_url = os.environ.get('N8N_VELZARD_WEBHOOK', 'http://n8n:5678/webhook/velzard-deploy')
        payload = {
            "action": "destroy",
            "deployment_id": str(deployment.id),
            "repo_full_name": deployment.github_repo_url, 
            "branch": deployment.branch,
            "instance_type": deployment.instance_type,
            "volume_size": deployment.volume_size,
        }
        
        try:
            requests.post(n8n_url, json=payload, timeout=5)
        except Exception as e:
            deployment.status = 'RUNNING'
            deployment.save()
            return Response({"error": f"Failed to reach orchestration engine: {e}"}, status=500)

        return Response({"message": "Teardown initiated. Cluster is being destroyed."}, status=200)

    @action(detail=True, methods=['patch'], permission_classes=[AllowAny])
    def webhook_update(self, request, pk=None):
        secret = request.headers.get('x-velzion-secret')
        expected_secret = os.environ.get('N8N_WEBHOOK_SECRET', 'L0JFLBRiyyWiCatJeju2IHXOm-yQUFuhSzjflv8q_a8SgeDP9SoKNeRmyE_xyCre5lZ0TpREAdxbK37q84IjfA')
        
        if secret != expected_secret:
            return Response({"error": "Unauthorized webhook signature."}, status=403)

        deployment = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in ['DELETED', 'DESTROYED']:
            deployment.delete()
            return Response({"message": "Deployment record wiped from matrix."}, status=200)

        aws_instance_id = request.data.get('aws_instance_id')
        elastic_ip = request.data.get('elastic_ip')

        if not new_status and aws_instance_id and elastic_ip:
            new_status = 'RUNNING'

        if new_status == 'RUNNING' and deployment.status != 'RUNNING':
            deployment.ascended_at = timezone.now()

        deployment.status = new_status or deployment.status
        deployment.aws_instance_id = request.data.get('aws_instance_id', deployment.aws_instance_id)
        deployment.elastic_ip = request.data.get('elastic_ip', deployment.elastic_ip)
        deployment.save()

        return Response({"message": "Deployment state synced with AWS."}, status=200)

# The OTLP Telemetry Ingestion Engine
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def telemetry(self, request, pk=None):
        secret = request.headers.get('x-velzion-secret')
        if secret != os.environ.get('N8N_WEBHOOK_SECRET', 'L0JFLBRiyyWiCatJeju2IHXOm-yQUFuhSzjflv8q_a8SgeDP9SoKNeRmyE_xyCre5lZ0TpREAdxbK37q84IjfA'):
            return Response({"error": "Unauthorized telemetry source."}, status=403)

        deployment = self.get_object()
        raw_data = request.data
        
        cpu_ns_total = 0.0 # 🚀 NEW: Tracking raw CPU time
        ram_bytes_total = 0.0
        system_ram_limit_bytes = 0.0 
        active_containers = set()

        try:
            resource_metrics = raw_data.get("resourceMetrics", [])
            for rm in resource_metrics:
                attributes = rm.get("resource", {}).get("attributes", [])
                for attr in attributes:
                    if attr.get("key") == "container.name":
                        active_containers.add(attr.get("value", {}).get("stringValue", "unknown"))

                scope_metrics = rm.get("scopeMetrics", [])
                for sm in scope_metrics:
                    metrics = sm.get("metrics", [])
                    for metric in metrics:
                        name = metric.get("name", "")
                        
                        datapoints = []
                        if "gauge" in metric:
                            datapoints = metric["gauge"].get("dataPoints", [])
                        elif "sum" in metric:
                            datapoints = metric["sum"].get("dataPoints", [])

                        if not datapoints: continue
                        
                        val = float(datapoints[0].get("asDouble", datapoints[0].get("asInt", 0)))

                        if name == "container.cpu.usage.total":
                            # 🚀 FIXED: Accumulate the true raw nanoseconds
                            cpu_ns_total += val
                            
                        if name == "container.memory.usage.total":
                            ram_bytes_total += val
                            
                        if name == "container.memory.usage.limit":
                            if val > system_ram_limit_bytes:
                                system_ram_limit_bytes = val

        except Exception as e:
            print(f"OTLP Parsing Warning: {e}")

        # --- RAM MATH (Dynamic & Accurate) ---
        if system_ram_limit_bytes > 0:
            ram_val = min((ram_bytes_total / system_ram_limit_bytes) * 100, 99.9)
        else:
            ram_val = min((ram_bytes_total / (2048.0 * 1024 * 1024)) * 100, 99.9)

        # --- CPU MATH (The Real Odometer Delta) ---
        last_cpu_ns = cpu_ns_total
        
        # 1. Reach into the database and grab the nanoseconds from 10 seconds ago
        if deployment.telemetry_history:
            last_cpu_ns = deployment.telemetry_history[-1].get("raw_cpu_ns", cpu_ns_total)
            
        # 2. Calculate the difference
        delta_ns = cpu_ns_total - last_cpu_ns
        
        # 3. OTel sends data every 10 seconds (10,000,000,000 nanoseconds).
        # A t3.small has 2 vCPUs, meaning the max possible compute time in a 10s window is 20,000,000,000 ns.
        # We divide the delta by the total capacity of the server to get 0-100%.
        if delta_ns > 0:
            cpu_val = min((delta_ns / 20_000_000_000.0) * 100, 99.9)
        else:
            cpu_val = 0.5 # Idle baseline

        container_list = []
        for c in active_containers:
            if "velzion-telemetry" not in c:
                container_list.append({
                    "ID": str(uuid.uuid4())[:8],
                    "Names": c.replace("/", ""), 
                    "State": "Up",
                    "Ports": "Internal/Gateway Network"
                })

        current_time = datetime.datetime.now().strftime("%H:%M:%S")
        new_metric = {
            "time": current_time,
            "cpu": round(cpu_val, 2), 
            "ram": round(ram_val, 2),
            "raw_cpu_ns": cpu_ns_total # 🚀 SECRET: Save current nanoseconds for the next math cycle!
        }
        
        current_history = deployment.telemetry_history
        current_history.append(new_metric)
        
        deployment.telemetry_history = current_history[-15:]
        
        if container_list:
            deployment.container_status = container_list
            
        deployment.save()

        return Response({"status": "OTLP Ingestion Successful"}, status=200)