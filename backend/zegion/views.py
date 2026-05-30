from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.conf import settings
from .models import Project, EphemeralEnvironment
from .serializers import ProjectSerializer, EphemeralEnvironmentSerializer

# --- REACT DASHBOARD ENDPOINTS ---
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class EphemeralEnvironmentViewSet(viewsets.ModelViewSet):
    queryset = EphemeralEnvironment.objects.all()
    serializer_class = EphemeralEnvironmentSerializer


# --- N8N DYNAMIC LOOKUP ENDPOINT ---
@api_view(['GET'])
@permission_classes([AllowAny])
def lookup_tenant_arn(request):
    """
    n8n hits this endpoint with a repo_url to find out which AWS account to deploy into.
    """
    repo_url = request.GET.get('repo_url')
    if not repo_url:
        return Response({'error': 'Missing repo_url parameter'}, status=400)
    
    try:
        project = Project.objects.get(github_repo_url=repo_url)
        return Response({
            'client_role_arn': project.aws_role_arn,
            'status': 'FOUND'
        }, status=200)
    except Project.DoesNotExist:
        return Response({'error': 'No integration found for this repository'}, status=404)


# --- N8N / GITHUB WEBHOOK STATE MACHINE ---
@api_view(['POST'])
@permission_classes([AllowAny])
def github_webhook(request):
    received_secret = request.headers.get('x-velzion-secret')
    actual_secret = "L0JFLBRiyyWiCatJeju2IHXOm-yQUFuhSzjflv8q_a8SgeDP9SoKNeRmyE_xyCre5lZ0TpREAdxbK37q84IjfA"
    
    if received_secret != actual_secret:
        return Response({
            "error": "Unauthorized", 
            "received": received_secret, 
            "expected": actual_secret
        }, status=403)
        
    # FIX: Removed the early 'return Response(Success)' here so the code below actually executes!

    data = request.data
    
    # 2. Defensive Extraction
    repo_url = data.get('repo_url')
    raw_pr_number = data.get('pr_number')
    action_status = data.get('status', 'PROVISIONING')
    instance_id = data.get('instance_id')
    dns_prefix = data.get('dns_prefix')

    if not repo_url or not raw_pr_number:
        return Response(
            {"error": "Missing critical fields: repo_url and pr_number required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        pr_number = int(raw_pr_number)
    except (ValueError, TypeError):
        return Response({"error": "pr_number must be an integer."}, status=status.HTTP_400_BAD_REQUEST)

    # 3. Atomic Project Lookup (Using your real default ARN for testing)
    project, _ = Project.objects.get_or_create(
        github_repo_url=repo_url,
        defaults={
            'aws_role_arn': 'arn:aws:iam::815090125753:role/VelzionExecutionRole',
            'vpc_id': 'vpc-default-mvp'
        }
    )

    # 4. Optimized Sync (Atomic update_or_create)
    update_data = {'status': action_status}
    if instance_id: update_data['instance_id'] = instance_id
    if dns_prefix: update_data['dns_prefix'] = dns_prefix

    environment, _ = EphemeralEnvironment.objects.update_or_create(
        project=project,
        pr_number=pr_number,
        defaults=update_data
    )

    return Response({
        "message": "State machine synchronized successfully.",
        "environment": EphemeralEnvironmentSerializer(environment).data
    }, status=status.HTTP_200_OK)