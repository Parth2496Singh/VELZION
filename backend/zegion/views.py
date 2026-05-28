from rest_framework import viewsets, status
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Project, EphemeralEnvironment
from .serializers import ProjectSerializer, EphemeralEnvironmentSerializer

# --- REACT DASHBOARD ENDPOINTS ---
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class EphemeralEnvironmentViewSet(viewsets.ModelViewSet):
    queryset = EphemeralEnvironment.objects.all()
    serializer_class = EphemeralEnvironmentSerializer


# --- N8N / GITHUB WEBHOOK STATE MACHINE ---
@api_view(['POST'])
def github_webhook(request):
    data = request.data
    print("🚀 Processing Zegion Pipeline Data:", data)

    # Extract core parameters from the incoming webhook payload
    repo_url = data.get('repo_url')
    raw_pr_number = data.get('pr_number')
    action_status = data.get('status', 'PROVISIONING')
    instance_id = data.get('instance_id', '')
    dns_prefix = data.get('dns_prefix', '')

    if not repo_url or not raw_pr_number:
        return Response(
            {"error": "Missing critical fields: repo_url and pr_number are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Convert PR number to integer to match PostgreSQL/SQLite field types explicitly
    try:
        pr_number = int(raw_pr_number)
    except (ValueError, TypeError):
        return Response(
            {"error": "Invalid pr_number format. Must be an integer."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # 1. Look up the project or create a fallback for the demo flow
    project, created = Project.objects.get_or_create(
        github_repo_url=repo_url,
        defaults={
            'aws_role_arn': 'arn:aws:iam::123456789012:role/ZegionOrchestrator',
            'vpc_id': 'vpc-default-mvp'
        }
    )

    # 2. Update or Create the Ephemeral Environment state row
    environment, env_created = EphemeralEnvironment.objects.get_or_create(
        project=project,
        pr_number=pr_number,
        defaults={
            'status': action_status,
            'instance_id': instance_id, 
            'dns_prefix': dns_prefix    
        }
    )

    # 3. If it already existed, force an overwrite of the new coordinates
    if not env_created:
        environment.status = action_status
        if instance_id:
            environment.instance_id = instance_id
        if dns_prefix:
            environment.dns_prefix = dns_prefix
        environment.save()

    return Response({
        "message": "State machine synchronized successfully.",
        "environment": EphemeralEnvironmentSerializer(environment).data
    }, status=status.HTTP_200_OK)