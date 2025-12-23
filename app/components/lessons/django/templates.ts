import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Django Templates",
  description:
    "Learn how to create dynamic HTML templates using Django's templating engine. Master template tags, filters, and template inheritance.",
  difficulty: "Beginner",
  content: `<div class="lesson-content">
    <p>Django's template system allows you to generate HTML dynamically by separating presentation from business logic.</p>

    <h2>Template Basics</h2>
    
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
    
    {% if user.is_authenticated %}
        <p>Welcome, {{ user.username }}!</p>
    {% else %}
        <p>Please log in.</p>
    {% endif %}
    
    <ul>
    {% for post in posts %}
        <li>{{ post.title }} - {{ post.created_at|date:"Y-m-d" }}</li>
    {% empty %}
        <li>No posts yet.</li>
    {% endfor %}
    </ul>
</body>
</html>
      </code>
    </pre>

    <h2>Template Inheritance</h2>
    
    <pre class="code-block">
      <code>
<!-- templates/base.html -->
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}My Site{% endblock %}</title>
</head>
<body>
    <nav>
        <a href="/">Home</a>
        <a href="/about/">About</a>
    </nav>
    
    {% block content %}{% endblock %}
    
    <footer>
        <p>&copy; 2024 My Site</p>
    </footer>
</body>
</html>

<!-- templates/blog/home.html -->
{% extends 'base.html' %}

{% block title %}Home - {{ block.super }}{% endblock %}

{% block content %}
    <h1>Welcome!</h1>
    <p>This content replaces the content block.</p>
{% endblock %}
      </code>
    </pre>

    <h2>Template Filters</h2>
    
    <pre class="code-block">
      <code>
{{ value|lower }}              <!-- Convert to lowercase -->
{{ value|upper }}              <!-- Convert to uppercase -->
{{ value|title }}              <!-- Title Case -->
{{ value|length }}             <!-- Length of string/list -->
{{ value|default:"N/A" }}      <!-- Default if falsy -->
{{ text|truncatewords:30 }}    <!-- Truncate to 30 words -->
{{ date|date:"Y-m-d" }}        <!-- Format date -->
{{ price|floatformat:2 }}      <!-- 2 decimal places -->
{{ html|safe }}                <!-- Mark as safe HTML -->
      </code>
    </pre>

    <h2>Template Tags</h2>
    
    <pre class="code-block">
      <code>
{% url 'blog:post_detail' post.id %}  <!-- Reverse URL lookup -->
{% static 'css/style.css' %}          <!-- Static files -->
{% csrf_token %}                      <!-- CSRF protection -->
{% now "Y-m-d H:i" %}                <!-- Current date/time -->
{% include 'partials/header.html' %}  <!-- Include template -->
      </code>
    </pre>
  </div>`,

  objectives: [
    "Create Django templates with dynamic content",
    "Use template variables, tags, and filters",
    "Implement template inheritance",
    "Handle conditional logic and loops in templates",
  ],

  practiceInstructions: [
    "Create a base template with a header and content block",
    "Create a child template that extends the base",
    "Display a list of items using a for loop",
    "Use at least one template filter",
  ],

  starterCode: `<!-- templates/base.html -->
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}{% endblock %}</title>
</head>
<body>
    <!-- TODO: Add header -->
    {% block content %}{% endblock %}
</body>
</html>

<!-- templates/items.html -->
<!-- TODO: Extend base.html -->
<!-- TODO: Add title block -->
<!-- TODO: Loop through items and display them -->`,

  solution: `<!-- templates/base.html -->
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}My Site{% endblock %}</title>
</head>
<body>
    <header>
        <h1>My Django Site</h1>
        <nav>
            <a href="/">Home</a>
        </nav>
    </header>
    
    <main>
        {% block content %}{% endblock %}
    </main>
    
    <footer>
        <p>&copy; 2024</p>
    </footer>
</body>
</html>

<!-- templates/items.html -->
{% extends 'base.html' %}

{% block title %}Items{% endblock %}

{% block content %}
    <h2>Item List</h2>
    <ul>
    {% for item in items %}
        <li>Item name and price displayed here</li>
    {% empty %}
        <li>No items available.</li>
    {% endfor %}
    </ul>
{% endblock %}`,

  hints: [
    "Use {% extends 'base.html' %} at the top of child templates",
    "Use {% block blockname %} to define overridable sections",
    "Use {{ variable }} to output variables",
    "Use {% for item in items %} and {% endfor %} for loops",
    "Filters are applied with the pipe character: {{ value|filter }}",
  ],
};

export default lessonData;
