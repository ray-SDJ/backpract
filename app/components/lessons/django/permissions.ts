import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Permissions & Authorization",
  description:
    "Learn how to implement fine-grained permissions and authorization in Django and Django REST Framework.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>Django provides a comprehensive permissions system to control who can access what resources.</p>

    <h2>Django Permissions</h2>
    
    <pre class="code-block">
      <code>
from django.contrib.auth.decorators import permission_required

@permission_required('blog.add_post')
def create_post(request):
    # Only users with 'add_post' permission can access
    pass

# Check permissions in views
if request.user.has_perm('blog.change_post'):
    # User can edit posts
    pass

# Custom permissions in models
class Post(models.Model):
    title = models.CharField(max_length=200)
    
    class Meta:
        permissions = [
            ('can_publish', 'Can publish posts'),
            ('can_feature', 'Can feature posts'),
        ]
      </code>
    </pre>

    <h2>DRF Permissions</h2>
    
    <pre class="code-block">
      <code>
from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read permissions for everyone
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions only for author
        return obj.author == request.user

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
      </code>
    </pre>

    <h2>Built-in DRF Permissions</h2>
    
    <ul>
      <li><code>AllowAny</code> - Allow unrestricted access</li>
      <li><code>IsAuthenticated</code> - Require authentication</li>
      <li><code>IsAdminUser</code> - Only admin users</li>
      <li><code>IsAuthenticatedOrReadOnly</code> - Authenticated for write, anyone for read</li>
    </ul>
  </div>`,

  objectives: [
    "Understand Django's permission system",
    "Create custom permissions",
    "Implement object-level permissions",
    "Use DRF permission classes",
  ],

  practiceInstructions: [
    "Create a custom permission class",
    "Check if user is the owner of an object",
    "Allow read-only access for non-owners",
  ],

  starterCode: `from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    # TODO: Implement has_object_permission
    # Allow read for everyone (SAFE_METHODS)
    # Allow write only if obj.owner == request.user
    pass`,

  solution: `from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners to edit objects
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions (GET, HEAD, OPTIONS) for anyone
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for owner
        return obj.owner == request.user

# Use in ViewSet
class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]`,

  hints: [
    "Inherit from permissions.BasePermission",
    "Implement has_object_permission method",
    "SAFE_METHODS includes GET, HEAD, OPTIONS",
    "Return True to allow, False to deny",
  ],
};

export default lessonData;
