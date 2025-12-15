import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Introduction to Django",
  description:
    "Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. Learn the basics and create your first Django app.",
  difficulty: "Beginner",
  content: `<div class="lesson-content">
    <p>Welcome to Django development! Django is a batteries-included Python framework that follows the Model-View-Template (MVT) pattern.</p>

    <h2>What is Django?</h2>
    
    <p>Django is a high-level Python web framework designed for building robust web applications quickly. Unlike Flask (minimalist), Django comes with everything you need built-in: authentication, database ORM, admin panel, and more.</p>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🎯 Django Philosophy</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Don't Repeat Yourself (DRY):</strong> Reuse code instead of duplicating it</li>
        <li><strong>Batteries Included:</strong> Everything you need comes built-in</li>
        <li><strong>MTV Pattern:</strong> Model (data), Template (HTML), View (logic)</li>
        <li><strong>Security First:</strong> Protection against SQL injection, XSS, CSRF by default</li>
      </ul>
    </div>

    <div class="feature-list">
      <h3>Key Features:</h3>
      <ul>
        <li><strong>ORM (Object-Relational Mapping):</strong> Write Python instead of SQL</li>
        <li><strong>Admin Panel:</strong> Auto-generated admin interface for managing data</li>
        <li><strong>Authentication:</strong> Built-in user management system</li>
        <li><strong>URL Routing:</strong> Clean, readable URL patterns</li>
        <li><strong>Forms:</strong> Automatic form validation and rendering</li>
        <li><strong>Templates:</strong> Built-in templating engine</li>
        <li><strong>Migrations:</strong> Database schema version control</li>
      </ul>
    </div>

    <h2>Installation and Setup</h2>
    
    <p>Let's install Django and create your first project:</p>

    <pre class="code-block">
      <code>
# Create a virtual environment
# Virtual environment = isolated Python installation
# Prevents package conflicts between projects
python -m venv django_env

# Activate virtual environment
# On Windows:
django_env\\Scripts\\activate
# On macOS/Linux:
source django_env/bin/activate

# Install Django
# pip = Python package manager (like npm for JavaScript)
pip install Django

# Check Django version
# Should show something like "Django 5.0.0"
django-admin --version
      </code>
    </pre>

    <h2>Creating Your First Django Project</h2>
    
    <p>Django projects contain multiple apps. Think of a project as the entire website, and apps as individual features:</p>

    <pre class="code-block">
      <code>
# Create a new Django project
# django-admin = command-line utility for Django
# startproject = creates project structure (settings, urls, wsgi)
# myproject = name of your project (choose any name)
django-admin startproject myproject

# Navigate into project directory
cd myproject

# Create an app within the project
# App = reusable component (blog, shop, users, etc.)
# python manage.py = runs Django management commands
# startapp = creates app structure (models, views, tests)
python manage.py startapp blog

# Project structure created:
# myproject/
#   ├── manage.py           ← Command-line tool for managing project
#   ├── myproject/          ← Project configuration directory
#   │   ├── __init__.py     ← Makes directory a Python package
#   │   ├── settings.py     ← All project settings (database, apps, etc.)
#   │   ├── urls.py         ← URL routing (maps URLs to views)
#   │   ├── asgi.py         ← Async server interface (for WebSockets)
#   │   └── wsgi.py         ← Web server interface (for deployment)
#   └── blog/               ← Your app directory
#       ├── __init__.py
#       ├── admin.py        ← Register models for admin panel
#       ├── apps.py         ← App configuration
#       ├── models.py       ← Database models (ORM)
#       ├── tests.py        ← Unit tests
#       ├── views.py        ← View functions (request handlers)
#       └── migrations/     ← Database migration files
      </code>
    </pre>

    <div class="explanation-box bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-purple-900 mb-3">📂 Project vs App</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Project:</strong> The entire website (e.g., "E-commerce site")</li>
        <li><strong>Apps:</strong> Reusable components (e.g., "blog", "shop", "users")</li>
        <li><strong>Why separate?</strong> Apps can be reused in other projects</li>
        <li><strong>Example:</strong> Your "users" app could work in any project</li>
      </ul>
    </div>

    <h2>Configure Your App</h2>
    
    <p>Register your app in settings.py so Django knows it exists:</p>

    <pre class="code-block">
      <code>
# myproject/settings.py

# INSTALLED_APPS = list of all apps Django should load
# Django comes with built-in apps (admin, auth, sessions, etc.)
INSTALLED_APPS = [
    # Built-in Django apps:
    'django.contrib.admin',       # Admin panel
    'django.contrib.auth',        # Authentication system
    'django.contrib.contenttypes', # Content type framework
    'django.contrib.sessions',    # Session management
    'django.contrib.messages',    # Messaging framework
    'django.contrib.staticfiles', # Static file management
    
    # Your custom apps:
    'blog',  # Add your app here! Django will now recognize it
]

# Database configuration
# Django uses SQLite by default (file-based database)
# Good for development, use PostgreSQL/MySQL for production
DATABASES = {
    'default': {
        # ENGINE = database backend to use
        'ENGINE': 'django.db.backends.sqlite3',
        
        # NAME = database file location
        # BASE_DIR = project root directory
        # db.sqlite3 = database filename
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Language and timezone settings
# en-us = English (United States)
LANGUAGE_CODE = 'en-us'

# UTC = Coordinated Universal Time (no timezone offset)
# Django stores dates in UTC, converts to local time on display
TIME_ZONE = 'UTC'
      </code>
    </pre>

    <h2>Create Your First View</h2>
    
    <p>Views are functions that handle requests and return responses:</p>

    <pre class="code-block">
      <code>
# blog/views.py

# HttpResponse = basic response object (returns text/HTML)
# render = renders template with context data (more powerful)
from django.http import HttpResponse
from django.shortcuts import render

# View function = takes request, returns response
# def = define function in Python
# request = HttpRequest object (contains method, headers, body, etc.)
def index(request):
    # request.method = HTTP method (GET, POST, PUT, DELETE)
    # request.GET = query parameters (?name=value)
    # request.POST = form data
    # request.headers = HTTP headers
    
    # HttpResponse() = create response object
    # First argument = response content (string)
    # Returns HTTP 200 OK with text/html content
    return HttpResponse("Hello from Django! This is your first view.")

# View with template rendering
# context = dictionary of data passed to template
def home(request):
    # context = data available in template
    # Like Express: res.render('home', { title: 'Home', posts: [...] })
    context = {
        'title': 'Welcome to Django',  # {{ title }} in template
        'message': 'Building web apps is easy!',  # {{ message }} in template
    }
    
    # render() takes 3 arguments:
    # 1. request object
    # 2. template path (looks in app/templates/)
    # 3. context dictionary (optional)
    # Returns HttpResponse with rendered HTML
    return render(request, 'blog/home.html', context)
      </code>
    </pre>

    <h2>Configure URLs</h2>
    
    <p>Map URLs to your views:</p>

    <pre class="code-block">
      <code>
# blog/urls.py (create this file)

# path() = function to define URL pattern
# URLPattern = maps URL to view function
from django.urls import path
from . import views  # Import views from current app (. = current directory)

# app_name = namespace for URLs (prevents naming conflicts)
# Use in templates: {% url 'blog:index' %}
app_name = 'blog'

# urlpatterns = list of URL patterns Django checks
# Django checks patterns in order, uses first match
urlpatterns = [
    # path() arguments:
    # 1. URL pattern ('' = root of app, 'posts/' = /posts/)
    # 2. View function to call
    # 3. name = identifier for reverse URL lookup
    
    # Example: http://localhost:8000/blog/ → views.index()
    path('', views.index, name='index'),
    
    # Example: http://localhost:8000/blog/home/ → views.home()
    path('home/', views.home, name='home'),
]
      </code>
    </pre>

    <pre class="code-block">
      <code>
# myproject/urls.py (main URL configuration)

# include() = includes URL patterns from another app
# Keeps URLs organized by app
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Admin panel at http://localhost:8000/admin/
    # Django's built-in admin interface
    path('admin/', admin.site.urls),
    
    # Include blog app URLs at /blog/
    # All blog URLs will be prefixed with 'blog/'
    # Example: 'blog/' + '' = http://localhost:8000/blog/
    # Example: 'blog/' + 'home/' = http://localhost:8000/blog/home/
    path('blog/', include('blog.urls')),
]
      </code>
    </pre>

    <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-3">🔗 URL Routing Flow</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>1. Request arrives:</strong> User visits http://localhost:8000/blog/</li>
        <li><strong>2. Check main urls.py:</strong> Finds 'blog/' pattern</li>
        <li><strong>3. Include blog urls:</strong> Looks in blog/urls.py</li>
        <li><strong>4. Match pattern:</strong> Finds '' pattern (empty string)</li>
        <li><strong>5. Call view:</strong> Executes views.index(request)</li>
        <li><strong>6. Return response:</strong> Sends HTML/JSON back to user</li>
      </ul>
    </div>

    <h2>Run the Development Server</h2>
    
    <p>Start Django's built-in development server:</p>

    <pre class="code-block">
      <code>
# Run database migrations
# Migrations = SQL commands to create/update database tables
# Django creates tables for admin, auth, sessions, etc.
python manage.py migrate

# Output:
# Operations to perform:
#   Apply all migrations: admin, auth, contenttypes, sessions
# Running migrations:
#   Applying contenttypes.0001_initial... OK
#   Applying auth.0001_initial... OK
#   ...

# Create superuser for admin panel
# Superuser = admin account with full permissions
# You'll be prompted for username, email, and password
python manage.py createsuperuser

# Start development server
# Runs on http://127.0.0.1:8000/ by default
# Auto-reloads when you change code (like Flask debug mode)
python manage.py runserver

# Run on different port:
python manage.py runserver 8080

# Run on different IP (allow external connections):
python manage.py runserver 0.0.0.0:8000

# Server output:
# Watching for file changes with StatReloader
# Performing system checks...
# System check identified no issues (0 silenced).
# December 15, 2025 - 15:30:45
# Django version 5.0, using settings 'myproject.settings'
# Starting development server at http://127.0.0.1:8000/
# Quit the server with CONTROL-C.
      </code>
    </pre>

    <div class="explanation-box bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-orange-900 mb-3">⚠️ Development Server Warning</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Only for development:</strong> DO NOT use in production!</li>
        <li><strong>Not secure:</strong> Lacks security features of production servers</li>
        <li><strong>Not performant:</strong> Can't handle high traffic</li>
        <li><strong>Production servers:</strong> Use Gunicorn, uWSGI, or Nginx</li>
      </ul>
    </div>

    <h2>Visit Your App</h2>
    
    <p>Open your browser and test these URLs:</p>

    <ul>
      <li><strong>http://127.0.0.1:8000/blog/</strong> - Your index view</li>
      <li><strong>http://127.0.0.1:8000/admin/</strong> - Django admin panel</li>
    </ul>

    <h2>Django Admin Panel</h2>
    
    <p>One of Django's killer features is the auto-generated admin interface:</p>

    <pre class="code-block">
      <code>
# blog/admin.py

# Import admin module and your models
from django.contrib import admin
from .models import Post  # We'll create Post model in next lesson

# Register your models with admin
# This creates admin interface for managing Posts
# admin.site.register() = add model to admin panel
# After registration, you can create/edit/delete Posts through admin
admin.site.register(Post)

# Advanced admin customization:
# ModelAdmin = customizes how model appears in admin
class PostAdmin(admin.ModelAdmin):
    # list_display = columns to show in list view
    list_display = ('title', 'author', 'created_at', 'published')
    
    # list_filter = add filters in sidebar
    list_filter = ('published', 'created_at')
    
    # search_fields = enable search box
    search_fields = ('title', 'content')
    
    # prepopulated_fields = auto-fill fields
    # Slug will auto-fill based on title (e.g., "My Post" → "my-post")
    prepopulated_fields = {'slug': ('title',)}

# Register with custom admin class
admin.site.register(Post, PostAdmin)
      </code>
    </pre>

    <h2>Django Project Structure Best Practices</h2>
    
    <div class="feature-list">
      <h3>Organizing Your Project:</h3>
      <ul>
        <li><strong>One app = one feature:</strong> Keep apps focused and reusable</li>
        <li><strong>Keep apps independent:</strong> Apps shouldn't depend on each other</li>
        <li><strong>Use settings modules:</strong> Separate settings for dev/prod</li>
        <li><strong>Environment variables:</strong> Store secrets in .env file</li>
        <li><strong>Version control:</strong> Use .gitignore for db.sqlite3 and .env</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Understand Django's MTV (Model-View-Template) architecture",
    "Create and configure a Django project and app",
    "Write view functions to handle HTTP requests",
    "Configure URL routing to map URLs to views",
    "Use Django's admin panel for data management",
  ],
  practiceInstructions: [
    "Install Django and create a new project named 'portfolio'",
    "Create an app called 'projects' within your portfolio project",
    "Register the 'projects' app in settings.py INSTALLED_APPS",
    "Create a view function that returns 'Welcome to my Portfolio'",
    "Configure URLs to map /projects/ to your view",
    "Run the development server and visit your view in the browser",
  ],
  hints: [
    "Use 'django-admin startproject portfolio' to create the project",
    "Use 'python manage.py startapp projects' to create the app",
    "Don't forget to add 'projects' to INSTALLED_APPS in settings.py",
    "Create blog/urls.py and include it in the main urls.py",
    "Run 'python manage.py migrate' before starting the server",
  ],
  solution: `# Create project
django-admin startproject portfolio
cd portfolio

# Create app
python manage.py startapp projects

# projects/views.py
from django.http import HttpResponse

def index(request):
    return HttpResponse("Welcome to my Portfolio")

# projects/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
]

# portfolio/urls.py
from django.urls import path, include

urlpatterns = [
    path('projects/', include('projects.urls')),
]

# Add 'projects' to INSTALLED_APPS in settings.py
# Run: python manage.py migrate
# Run: python manage.py runserver`,
};

export default lessonData;
