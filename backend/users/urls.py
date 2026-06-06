from django.urls import path
from .views import GitHubLoginURLView, GitHubCallbackView

urlpatterns = [
    path('login/url/', GitHubLoginURLView.as_view(), name='github_login_url'),
    path('callback/', GitHubCallbackView.as_view(), name='github_callback'),
]