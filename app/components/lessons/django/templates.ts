import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Django Templates",
  description:
    "Learn how to create dynamic HTML templates using Django's templating engine. Master template tags, filters, and template inheritance.",
  difficulty: "Beginner",
  content: `<div class="lesson-content">
    <h2>What Are Django Templates?</h2>
    <p>Django templates are text files (usually HTML) that use Django Template Language (DTL) to generate dynamic content. Templates separate the presentation layer from business logic, making your code more maintainable.</p>
    
    <p><strong>Key Concepts:</strong></p>
    <ul>
      <li><strong>Template Engine:</strong> Django has its own built-in templating engine (not EJS or Jinja2, though similar)</li>
      <li><strong>Variables:</strong> Use <code>{{ variable }}</code> to output dynamic content</li>
      <li><strong>Tags:</strong> Use <code>{% tag %}</code> for logic like loops, conditionals, and inheritance</li>
      <li><strong>Filters:</strong> Use <code>{{ value|filter }}</code> to modify variable output</li>
    </ul>

    <h2>Setting Up Templates</h2>
    
    <p>First, configure your templates directory in <code>settings.py</code>:</p>
    
    <pre class="code-block">
      <code>
# settings.py
import os

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],  # Project-level templates
        'APP_DIRS': True,  # Look for templates in each app's templates/ folder
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
      </code>
    </pre>

    <p>Create a templates directory in your project or app:</p>
    <pre class="code-block">
      <code>
myproject/
    templates/
        base.html
    blog/
        templates/
            blog/
                home.html
                post_detail.html
      </code>
    </pre>

    <h2>Rendering Templates from Views</h2>
    
    <p>Use the <code>render()</code> function to render templates with context data:</p>
    
    <pre class="code-block">
      <code>
# views.py
from django.shortcuts import render
from .models import Post

def home_view(request):
    """Render the home page with posts"""
    posts = Post.objects.all()
    context = {
        'title': 'My Blog',
        'heading': 'Welcome to My Blog',
        'posts': posts,
        'user': request.user,
    }
    # render(request, template_name, context)
    return render(request, 'blog/home.html', context)

def post_detail_view(request, post_id):
    """Render a single post"""
    post = Post.objects.get(id=post_id)
    return render(request, 'blog/post_detail.html', {'post': post})
      </code>
    </pre>

    <h2>Template Variables & Syntax</h2>
    
    <pre class="code-block">
      <code>
<!-- templates/blog/home.html -->
<!DOCTYPE html>
<html>
<head>
    <title>{{ title }}</title>
</head>
<body>
    <h1>{{ heading }}</h1>
    <p>{{ message }}</p>
    
    <!-- Conditional statements -->
    {% if user.is_authenticated %}
        <p>Welcome, {{ user.username }}!</p>
    {% else %}
        <p>Please log in.</p>
    {% endif %}
    
    <!-- Looping through data -->
    <ul>
    {% for post in posts %}
        <li>
            <h3>{{ post.title }}</h3>
            <p>{{ post.content|truncatewords:20 }}</p>
            <small>Posted on {{ post.created_at|date:"F d, Y" }}</small>
        </li>
    {% empty %}
        <li>No posts yet.</li>
    {% endfor %}
    </ul>
</body>
</html>
      </code>
    </pre>

    <h2>Template Inheritance (DRY Principle)</h2>
    
    <p>Create a base template that other templates extend to avoid repeating code:</p>
    
    <pre class="code-block">
      <code>
<!-- templates/base.html -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}My Site{% endblock %}</title>
    {% load static %}
    <link rel="stylesheet" href="{% static 'css/style.css' %}">
</head>
<body>
    <nav>
        <a href="{% url 'home' %}">Home</a>
        <a href="{% url 'about' %}">About</a>
        {% if user.is_authenticated %}
            <a href="{% url 'logout' %}">Logout</a>
        {% else %}
            <a href="{% url 'login' %}">Login</a>
        {% endif %}
    </nav>
    
    <main>
        {% block content %}{% endblock %}
    </main>
    
    <footer>
        <p>&copy; 2024 My Site</p>
    </footer>
</body>
</html>
      </code>
    </pre>

    <pre class="code-block">
      <code>
<!-- templates/blog/home.html -->
{% extends 'base.html' %}

{% block title %}Home - {{ block.super }}{% endblock %}

{% block content %}
    <h1>Welcome to My Blog!</h1>
    
    {% for post in posts %}
        <article>
            <h2>{{ post.title }}</h2>
            <p>{{ post.content|safe }}</p>
            <a href="{% url 'post_detail' post.id %}">Read more</a>
        </article>
    {% endfor %}
{% endblock %}
      </code>
    </pre>

    <h2>Template Filters (Data Formatting)</h2>
    
    <pre class="code-block">
      <code>
<!-- String filters -->
{{ name|lower }}                    <!-- "john" -->
{{ name|upper }}                    <!-- "JOHN" -->
{{ name|title }}                    <!-- "John Doe" -->
{{ text|truncatewords:30 }}         <!-- First 30 words... -->
{{ text|truncatechars:50 }}         <!-- First 50 chars... -->

<!-- Number filters -->
{{ price|floatformat:2 }}           <!-- 19.99 -->
{{ number|add:5 }}                  <!-- Add 5 to number -->

<!-- Date filters -->
{{ date|date:"Y-m-d" }}             <!-- 2024-03-15 -->
{{ date|date:"F d, Y" }}            <!-- March 15, 2024 -->
{{ date|time:"H:i" }}               <!-- 14:30 -->

<!-- List filters -->
{{ items|length }}                  <!-- Number of items -->
{{ items|first }}                   <!-- First item -->
{{ items|last }}                    <!-- Last item -->
{{ items|join:", " }}               <!-- Join with comma -->

<!-- Safety filters -->
{{ html_content|safe }}             <!-- Render HTML without escaping -->
{{ user_input|escape }}             <!-- Escape HTML (default) -->
{{ value|default:"N/A" }}           <!-- Show "N/A" if value is falsy -->
      </code>
    </pre>

    <h2>Common Template Tags</h2>
    
    <pre class="code-block">
      <code>
<!-- URL routing -->
{% url 'blog:post_detail' post.id %}    <!-- Reverse URL by name -->
{% url 'profile' user.id %}

<!-- Static files (CSS, JS, images) -->
{% load static %}
<link rel="stylesheet" href="{% static 'css/style.css' %}">
<img src="{% static 'images/logo.png' %}" alt="Logo">

<!-- Forms and CSRF -->
<form method="post">
    {% csrf_token %}  <!-- REQUIRED for POST forms -->
    {{ form.as_p }}
    <button type="submit">Submit</button>
</form>

<!-- Including other templates -->
{% include 'partials/header.html' %}
{% include 'partials/footer.html' %}

<!-- Comments -->
{% comment %}
    This won't be rendered
{% endcomment %}
{# Single line comment #}

<!-- Current date/time -->
{% now "Y-m-d H:i" %}

<!-- With tag (assign to variable) -->
{% with total=items.count %}
    There are {{ total }} items.
{% endwith %}
      </code>
    </pre>

    <h2>Passing Context to Templates</h2>
    
    <pre class="code-block">
      <code>
# views.py
from django.shortcuts import render, get_object_or_404
from .models import Post, Category

def blog_home(request):
    """Pass multiple variables to template"""
    context = {
        'posts': Post.objects.all().order_by('-created_at'),
        'categories': Category.objects.all(),
        'featured_post': Post.objects.filter(featured=True).first(),
        'total_posts': Post.objects.count(),
    }
    return render(request, 'blog/home.html', context)

# Alternative: pass variables directly
def about_view(request):
    return render(request, 'about.html', {
        'title': 'About Us',
        'team_size': 10,
    })
      </code>
    </pre>

    <h2>Template Best Practices</h2>
    
    <ul>
      <li><strong>Never put business logic in templates</strong> - Keep templates simple, do logic in views</li>
      <li><strong>Use template inheritance</strong> - Create a base template and extend it</li>
      <li><strong>Organize templates by app</strong> - Use <code>app_name/templates/app_name/</code> structure</li>
      <li><strong>Always use {% csrf_token %}</strong> in POST forms for security</li>
      <li><strong>Use {% static %}</strong> for static files, never hardcode paths</li>
      <li><strong>Escape user input</strong> - Django does this by default, use <code>|safe</code> only when needed</li>
      <li><strong>Use {% url %}</strong> instead of hardcoding URLs</li>
    </ul>
  </div>`,

  objectives: [
    "Understand what Django templates are and how they differ from other template engines",
    "Set up template directories and configuration in Django",
    "Render templates from views with context data",
    "Use template variables, tags, and filters effectively",
    "Implement template inheritance with base templates",
    "Handle conditional logic and loops in templates",
    "Work with static files and URLs in templates",
  ],

  practiceInstructions: [
    "Configure templates in settings.py",
    "Create a view function that passes context data to a template",
    "Create a base template with header, navigation, and footer",
    "Create a child template that extends the base template",
    "Display a list of items using a for loop with {% empty %}",
    "Use at least three different template filters",
    "Include {% csrf_token %} in a form",
  ],

  starterCode: `# settings.py
# TODO: Configure TEMPLATES with DIRS pointing to templates folder

# views.py
from django.shortcuts import render

# TODO: Create a view function called 'item_list'
# TODO: Create a context dictionary with: title, items (list), user
# TODO: Return render() with 'items/list.html' template

# urls.py
from django.urls import path
from . import views

urlpatterns = [
    # TODO: Add URL pattern for item_list view
]

<!-- templates/base.html -->
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}{% endblock %}</title>
</head>
<body>
    <!-- TODO: Add navigation -->
    {% block content %}{% endblock %}
    <!-- TODO: Add footer -->
</body>
</html>

<!-- templates/items/list.html -->
<!-- TODO: Extend base.html -->
<!-- TODO: Set title block -->
<!-- TODO: In content block, loop through items and display them -->
<!-- TODO: Use at least one filter on item display -->`,

  solution: `# settings.py
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# views.py
from django.shortcuts import render

def item_list(request):
    """Display list of items"""
    context = {
        'title': 'Item List',
        'items': [
            {'name': 'Laptop', 'price': 999.99, 'stock': 15},
            {'name': 'Phone', 'price': 599.99, 'stock': 30},
            {'name': 'Tablet', 'price': 399.99, 'stock': 20},
        ],
        'user': request.user,
    }
    return render(request, 'items/list.html', context)

# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('items/', views.item_list, name='item_list'),
]

<!-- templates/base.html -->
{% load static %}
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}My Site{% endblock %}</title>
    <link rel="stylesheet" href="{% static 'css/style.css' %}">
</head>
<body>
    <nav>
        <a href="{% url 'home' %}">Home</a>
        <a href="{% url 'item_list' %}">Items</a>
        {% if user.is_authenticated %}
            <span>Hello, {{ user.username }}</span>
        {% endif %}
    </nav>
    
    <main>
        {% block content %}{% endblock %}
    </main>
    
    <footer>
        <p>&copy; 2024 My Django Site</p>
    </footer>
</body>
</html>

<!-- templates/items/list.html -->
{% extends 'base.html' %}

{% block title %}{{ title }} - {{ block.super }}{% endblock %}

{% block content %}
    <h1>{{ title }}</h1>
    
    <div class="item-list">
        {% for item in items %}
            <div class="item-card">
                <h3>{{ item.name|title }}</h3>
                <p class="price">\${{ item.price|floatformat:2 }}</p>
                <p class="stock">
                    {% if item.stock > 10 %}
                        In Stock: {{ item.stock }} units
                    {% elif item.stock > 0 %}
                        Low Stock: {{ item.stock }} units
                    {% else %}
                        Out of Stock
                    {% endif %}
                </p>
            </div>
        {% empty %}
            <p>No items available.</p>
        {% endfor %}
    </div>
    
    <p>Total items: {{ items|length }}</p>
{% endblock %}`,

  hints: [
    "Django uses its own template engine (DTL), not EJS - that's for Node.js",
    "Always configure TEMPLATES in settings.py with DIRS pointing to your templates folder",
    "Use render(request, 'template_name.html', context) in views to render templates",
    "Use {% extends 'base.html' %} at the very top of child templates",
    "Use {% block blockname %} in base template and override in child templates",
    "Variables: {{ variable }}, Tags: {% tag %}, Filters: {{ value|filter }}",
    "{% load static %} must be at the top to use {% static %} tag",
    "Always include {% csrf_token %} in POST forms for security",
    "Use {% empty %} with {% for %} loops to handle empty lists",
    "Context is a dictionary passed from views to templates",
  ],
};

export default lessonData;
