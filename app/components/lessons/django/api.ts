import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Building REST APIs with Django REST Framework",
  description:
    "Learn how to build powerful REST APIs using Django REST Framework (DRF). Understand serializers, viewsets, and API routing.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>Django REST Framework (DRF) is a powerful toolkit for building Web APIs in Django.</p>

    <h2>Installation</h2>
    
    <pre class="code-block">
      <code>
pip install djangorestframework

# settings.py
INSTALLED_APPS = [
    ...
    'rest_framework',
]
      </code>
    </pre>

    <h2>Creating a Simple API</h2>
    
    <pre class="code-block">
      <code>
# serializers.py
from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'created_at']
        read_only_fields = ['id', 'created_at']

# views.py
from rest_framework import viewsets
from .models import Post
from .serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

# urls.py
from rest_framework.routers import DefaultRouter
from .views import PostViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet)

urlpatterns = router.urls
      </code>
    </pre>

    <h2>API Endpoints Created</h2>
    
    <ul>
      <li>GET /posts/ - List all posts</li>
      <li>POST /posts/ - Create a new post</li>
      <li>GET /posts/{id}/ - Retrieve a specific post</li>
      <li>PUT /posts/{id}/ - Update a post</li>
      <li>DELETE /posts/{id}/ - Delete a post</li>
    </ul>
  </div>`,

  objectives: [
    "Install and configure Django REST Framework",
    "Create serializers for models",
    "Build API views using viewsets",
    "Configure URL routing for APIs",
  ],

  practiceInstructions: [
    "Create a ModelSerializer for a Book model",
    "Create a ViewSet for the Book model",
    "Register the ViewSet with a router",
  ],

  starterCode: `# serializers.py
from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    # TODO: Configure Meta class
    pass

# views.py
from rest_framework import viewsets
# TODO: Import BookSerializer

class BookViewSet(viewsets.ModelViewSet):
    # TODO: Set queryset and serializer_class
    pass`,

  solution: `# serializers.py
from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'publication_date', 'price']
        read_only_fields = ['id']

# views.py
from rest_framework import viewsets
from .models import Book
from .serializers import BookSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

# urls.py
from rest_framework.routers import DefaultRouter
from .views import BookViewSet

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')

urlpatterns = router.urls`,

  hints: [
    "ModelSerializer automatically creates fields from the model",
    "ViewSet combines list, create, retrieve, update, and destroy actions",
    "DefaultRouter creates URL patterns automatically",
    "queryset defines which objects are available through the API",
  ],
};

export default lessonData;
