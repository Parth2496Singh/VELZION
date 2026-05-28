import requests
import threading
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Project

def send_n8n_trigger(project_id, repo_url, role_arn):
    # CHANGED: Use localhost since Django is native on the host
    n8n_url = "http://127.0.0.1:5678/webhook/zegion-pr" 
    payload = {
        "project_id": str(project_id),
        "repo_url": repo_url,
        "aws_role_arn": role_arn,
        "pr_number": 1,
        "status": "PROVISIONING"
    }
    try:
        response = requests.post(n8n_url, json=payload, timeout=5)
        # CRITICAL: Print the actual response code from n8n
        print(f"📡 n8n Gateway Response Code: {response.status_code}")
        print(f"📡 n8n Gateway Response Body: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"⚠️ Outbound automation hook failed to connect: {e}")

@receiver(post_save, sender=Project)
def trigger_infrastructure_pipeline(sender, instance, created, **kwargs):
    if created:
        print(f"⚡ Project Row Created in Postgres. Spinning background orchestration worker thread...")
        # Execute asynchronously so the React frontend form doesn't hang waiting for n8n/AWS
        threading.Thread(
            target=send_n8n_trigger,
            args=(instance.id, instance.github_repo_url, instance.aws_role_arn)
        ).start()