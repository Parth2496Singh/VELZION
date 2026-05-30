import os
import requests
from django.contrib.auth import login
from rest_framework.views import APIView
from rest_framework.response import Response
# NEW: Import AllowAny
from rest_framework.permissions import AllowAny 
from .models import UserProfile

class GitHubLoginURLView(APIView):
    permission_classes = [AllowAny] # Good practice to leave this open too
    def get(self, request):
        client_id = os.environ.get('GITHUB_CLIENT_ID')
        redirect_uri = f"{os.environ.get('FRONTEND_URL')}/auth/callback"
        
        url = f"https://github.com/login/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&scope=read:user,user:email,repo"
        return Response({"login_url": url})

class GitHubCallbackView(APIView):
    # NEW: Drop the CSRF and Auth shields for this specific endpoint
    authentication_classes = [] 
    permission_classes = [AllowAny] 

    def post(self, request):
        code = request.data.get('code')
        
        # Exchange code for access token
        token_response = requests.post(
            'https://github.com/login/oauth/access_token',
            headers={'Accept': 'application/json'},
            data={
                'client_id': os.environ.get('GITHUB_CLIENT_ID'),
                'client_secret': os.environ.get('GITHUB_CLIENT_SECRET'),
                'code': code,
            }
        )
        access_token = token_response.json().get('access_token')

        if not access_token:
            return Response({"error": "Failed to get access token"}, status=400)

        # Get GitHub profile
        user_response = requests.get(
            'https://api.github.com/user',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        github_user = user_response.json()

        # Create or Log in user
        user, created = UserProfile.objects.get_or_create(
            github_id=github_user['id'],
            defaults={
                'username': github_user['login'],
                'avatar_url': github_user.get('avatar_url', ''),
                'github_access_token': access_token
            }
        )
        
        if not created:
            user.github_access_token = access_token
            user.save()

        login(request, user)

        return Response({
            "message": "Login successful",
            "username": user.username,
            "avatar": user.avatar_url
        })