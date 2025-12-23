import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "JWT Authentication",
  description:
    "Learn how to implement JSON Web Token (JWT) authentication for stateless API authentication in Django REST Framework.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <p>JWT provides a secure way to authenticate API requests without server-side sessions.</p>

    <h2>Installation</h2>
    
    <pre class="code-block">
      <code>
pip install djangorestframework-simplejwt

# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}
      </code>
    </pre>

    <h2>URL Configuration</h2>
    
    <pre class="code-block">
      <code>
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
      </code>
    </pre>

    <h2>Using JWT in Requests</h2>
    
    <pre class="code-block">
      <code>
# Obtain token
POST /api/token/
{
    "username": "john",
    "password": "secret"
}

# Response
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGci...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGci..."
}

# Use token in requests
GET /api/posts/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGci...
      </code>
    </pre>

    <h2>Custom JWT Claims</h2>
    
    <pre class="code-block">
      <code>
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        return token
      </code>
    </pre>
  </div>`,

  objectives: [
    "Understand JWT authentication",
    "Configure djangorestframework-simplejwt",
    "Implement token-based authentication",
    "Add custom claims to JWT tokens",
  ],

  practiceInstructions: [
    "Configure JWT authentication in settings",
    "Create token obtain and refresh endpoints",
    "Protect a view with JWT authentication",
  ],

  starterCode: `# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        # TODO: Add JWTAuthentication
    ],
}

# urls.py
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # TODO: Add token endpoints
]`,

  solution: `# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

# urls.py
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Protected view
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({'message': f'Hello, {request.user.username}!'})`,

  hints: [
    "Install djangorestframework-simplejwt package",
    "Add JWTAuthentication to DEFAULT_AUTHENTICATION_CLASSES",
    "Use TokenObtainPairView for login",
    "Use TokenRefreshView to refresh tokens",
    "Include 'Authorization: Bearer <token>' header in requests",
  ],
};

export default lessonData;
