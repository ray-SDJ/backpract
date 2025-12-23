import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "ViewSets & Routers",
  description:
    "Learn how to use ViewSets and Routers in Django REST Framework to create RESTful APIs with minimal code.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>ViewSets and Routers automate URL routing and reduce boilerplate code for common API patterns.</p>

    <h2>ViewSet Types</h2>
    
    <pre class="code-block">
      <code>
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

# ModelViewSet - Full CRUD operations
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    
    # Custom action
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        post = self.get_object()
        post.published = True
        post.save()
        return Response({'status': 'published'})
    
    # List action (applies to collection)
    @action(detail=False, methods=['get'])
    def recent(self, request):
        recent_posts = Post.objects.order_by('-created_at')[:10]
        serializer = self.get_serializer(recent_posts, many=True)
        return Response(serializer.data)

# ReadOnlyModelViewSet - List and retrieve only
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
      </code>
    </pre>

    <h2>Router Configuration</h2>
    
    <pre class="code-block">
      <code>
from rest_framework.routers import DefaultRouter, SimpleRouter

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'categories', CategoryViewSet)

# URLs generated:
# GET    /posts/           - list
# POST   /posts/           - create
# GET    /posts/{id}/      - retrieve
# PUT    /posts/{id}/      - update
# PATCH  /posts/{id}/      - partial_update
# DELETE /posts/{id}/      - destroy
# POST   /posts/{id}/publish/  - custom action
# GET    /posts/recent/    - custom list action

urlpatterns = [
    path('api/', include(router.urls)),
]
      </code>
    </pre>
  </div>`,

  objectives: [
    "Understand different ViewSet types",
    "Create custom actions with @action decorator",
    "Configure routers for automatic URL generation",
  ],

  practiceInstructions: [
    "Create a ModelViewSet for a model",
    "Add a custom action to mark items as featured",
    "Register the ViewSet with a router",
  ],

  starterCode: `from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    # TODO: Add custom action 'feature'
    # Should set featured=True on the product
    # Should work on detail (single product)`,

  solution: `from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    @action(detail=True, methods=['post'])
    def feature(self, request, pk=None):
        product = self.get_object()
        product.featured = True
        product.save()
        serializer = self.get_serializer(product)
        return Response(serializer.data)

# urls.py
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'products', ProductViewSet)

urlpatterns = router.urls`,

  hints: [
    "Use @action decorator for custom actions",
    "detail=True for single object, detail=False for collections",
    "Use self.get_object() to get the current object",
    "Return Response with serialized data",
  ],
};

export default lessonData;
