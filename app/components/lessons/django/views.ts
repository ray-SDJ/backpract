import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Views & URL Routing",
  description:
    "Learn how to create views and map URLs in Django. Understand the request-response cycle and build dynamic web pages.",
  difficulty: "Beginner",
  content: `<div class="lesson-content">
    <p>Views are the heart of Django applications - they process requests and return responses. Let's learn how to create views and connect them to URLs.</p>

    <h2>What are Views?</h2>
    
    <p>In Django, a view is a Python function or class that:</p>
    <ol>
      <li>Receives a web request (HTTP request object)</li>
      <li>Processes the request (queries database, performs logic)</li>
      <li>Returns a web response (HTML, JSON, redirect, etc.)</li>
    </ol>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🎯 Types of Views</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Function-Based Views (FBV):</strong> Simple Python functions</li>
        <li><strong>Class-Based Views (CBV):</strong> Object-oriented approach with reusable code</li>
        <li><strong>Generic Views:</strong> Pre-built views for common patterns (list, detail, create, update, delete)</li>
      </ul>
    </div>

    <h2>Creating a Simple Function-Based View</h2>
    
    <pre class="code-block">
      <code>
# blog/views.py
from django.http import HttpResponse
from django.shortcuts import render

# Simple view that returns plain text
def hello_world(request):
    # request = HttpRequest object containing request data
    # Contains: method (GET/POST), headers, user info, etc.
    return HttpResponse("Hello, Django World!")

# View that returns HTML
def home(request):
    # render() = shortcut function
    # Takes request, template name, and context (data)
    # Returns HttpResponse with rendered HTML
    context = {
        'title': 'Welcome',
        'message': 'Hello from Django!'
    }
    return render(request, 'blog/home.html', context)

# View with dynamic data
def post_detail(request, post_id):
    # post_id = captured from URL (e.g., /posts/5/)
    # In real app, you'd fetch from database
    context = {
        'post_id': post_id,
        'title': f'Post #{post_id}',
        'content': 'This is a sample post.'
    }
    return render(request, 'blog/post_detail.html', context)
      </code>
    </pre>

    <h2>URL Routing</h2>
    
    <p>URLs connect web addresses to views. Django uses URLconf (URL configuration) to map URL patterns to views.</p>

    <pre class="code-block">
      <code>
# blog/urls.py (app-level URLs)
from django.urls import path
from . import views

# app_name = namespace for URL names
# Prevents conflicts between apps with same URL names
app_name = 'blog'

urlpatterns = [
    # path(route, view, name)
    # route = URL pattern (string or regex)
    # view = view function to call
    # name = unique identifier for reverse URL lookup
    
    path('', views.home, name='home'),
    # URL: /blog/ → calls views.home()
    
    path('hello/', views.hello_world, name='hello'),
    # URL: /blog/hello/ → calls views.hello_world()
    
    # Dynamic URL with parameter
    # <int:post_id> = captures integer, passes as post_id argument
    path('posts/<int:post_id>/', views.post_detail, name='post_detail'),
    # URL: /blog/posts/5/ → calls views.post_detail(request, post_id=5)
    
    # String parameter
    path('author/<str:username>/', views.author_posts, name='author_posts'),
    # URL: /blog/author/john/ → calls views.author_posts(request, username='john')
]
      </code>
    </pre>

    <pre class="code-block">
      <code>
# myproject/urls.py (project-level URLs)
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Includes all URLs from blog app
    # Prefix 'blog/' means all blog URLs start with /blog/
    path('blog/', include('blog.urls')),
]
      </code>
    </pre>

    <h2>Class-Based Views</h2>
    
    <pre class="code-block">
      <code>
# blog/views.py
from django.views import View
from django.views.generic import ListView, DetailView
from .models import Post

# Basic class-based view
class PostListView(View):
    # Handles different HTTP methods
    def get(self, request):
        posts = Post.objects.all()
        return render(request, 'blog/post_list.html', {'posts': posts})
    
    def post(self, request):
        # Handle POST requests
        pass

# Generic ListView (better approach)
class PostListView(ListView):
    model = Post  # Model to query
    template_name = 'blog/post_list.html'  # Template to render
    context_object_name = 'posts'  # Variable name in template
    paginate_by = 10  # Show 10 posts per page
    
    # Optional: customize queryset
    def get_queryset(self):
        return Post.objects.filter(published=True).order_by('-created_at')

# Generic DetailView
class PostDetailView(DetailView):
    model = Post
    template_name = 'blog/post_detail.html'
    context_object_name = 'post'
    
# URLs for class-based views
# blog/urls.py
urlpatterns = [
    path('posts/', PostListView.as_view(), name='post_list'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post_detail'),
]
      </code>
    </pre>

    <h2>Handling Different HTTP Methods</h2>
    
    <pre class="code-block">
      <code>
from django.shortcuts import redirect, get_object_or_404

def create_post(request):
    if request.method == 'POST':
        # Handle form submission
        title = request.POST.get('title')
        content = request.POST.get('content')
        
        # Create new post
        post = Post.objects.create(
            title=title,
            content=content,
            author=request.user
        )
        
        # Redirect to post detail page
        return redirect('blog:post_detail', post_id=post.id)
    else:
        # Show empty form (GET request)
        return render(request, 'blog/create_post.html')

def delete_post(request, post_id):
    # get_object_or_404 = get object or return 404 error
    post = get_object_or_404(Post, id=post_id)
    
    if request.method == 'POST':
        post.delete()
        return redirect('blog:home')
    
    return render(request, 'blog/confirm_delete.html', {'post': post})
      </code>
    </pre>

    <div class="tip-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-2">💡 Best Practices</h4>
      <ul class="space-y-1">
        <li>Use function-based views for simple logic, class-based views for complex patterns</li>
        <li>Always name your URLs for easy reverse lookup</li>
        <li>Use get_object_or_404() instead of get() for better error handling</li>
        <li>Keep views thin - move business logic to models or separate modules</li>
        <li>Use generic views to avoid repetitive code</li>
      </ul>
    </div>
  </div>`,

  objectives: [
    "Understand Django's request-response cycle",
    "Create function-based and class-based views",
    "Configure URL patterns and routing",
    "Handle dynamic URLs with parameters",
    "Work with different HTTP methods (GET, POST)",
    "Use Django's generic views for common patterns",
  ],

  practiceInstructions: [
    "Create a view function that accepts a name parameter from the URL",
    "Return an HttpResponse with a personalized greeting",
    "Use proper URL routing to capture the name parameter",
    "Handle the case when no name is provided",
  ],

  starterCode: `# views.py
from django.http import HttpResponse
from django.shortcuts import render

def greet_user(request, name):
    # TODO: Create a personalized greeting
    # Return an HttpResponse with "Hello, {name}! Welcome to Django!"
    pass

# urls.py (add this to your URLconf)
from django.urls import path
from . import views

urlpatterns = [
    # TODO: Add URL pattern to capture name parameter
    # Pattern should be: greet/<str:name>/
    # Example: /greet/John/ should call greet_user with name="John"
]`,

  solution: `# views.py
from django.http import HttpResponse
from django.shortcuts import render

def greet_user(request, name):
    """
    View that greets a user by name
    """
    # Create personalized message
    message = f"Hello, {name}! Welcome to Django!"
    
    # Return HTTP response with message
    return HttpResponse(message)

# Alternative: render with template
def greet_user_template(request, name):
    context = {
        'name': name,
        'greeting': f'Hello, {name}!'
    }
    return render(request, 'greet.html', context)

# urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Capture string parameter 'name' from URL
    path('greet/<str:name>/', views.greet_user, name='greet_user'),
    
    # With template version
    path('greet-template/<str:name>/', views.greet_user_template, name='greet_template'),
    
    # Optional: default greeting if no name provided
    path('greet/', views.default_greet, name='default_greet'),
]

# Additional: default greeting view
def default_greet(request):
    return HttpResponse("Hello, Guest! Welcome to Django!")`,

  hints: [
    "Use the 'name' parameter that's passed to your view function",
    "The HttpResponse class takes a string as its argument",
    "In urls.py, use <str:name> to capture a string parameter from the URL",
    "The path() function takes: route, view function, and optional name",
    "Remember to import the views module in your urls.py file",
  ],
};

export default lessonData;
