import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Django Models & ORM",
  description:
    "Learn how to define database models and use Django's powerful ORM (Object-Relational Mapping) to interact with databases without writing SQL.",
  difficulty: "Beginner",
  content: `<div class="lesson-content">
    <p>Django's ORM allows you to work with databases using Python classes instead of SQL. Each model represents a database table, and model instances represent rows.</p>

    <h2>What is a Model?</h2>
    
    <p>A model is a Python class that defines the structure of your database table. It includes:</p>
    <ul>
      <li>Field types (CharField, IntegerField, DateField, etc.)</li>
      <li>Field options (max_length, default, null, blank)</li>
      <li>Relationships between models (ForeignKey, ManyToMany)</li>
      <li>Methods for business logic</li>
    </ul>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🎯 Why Use ORM?</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Database Agnostic:</strong> Switch databases without rewriting queries</li>
        <li><strong>Security:</strong> Automatic protection against SQL injection</li>
        <li><strong>Pythonic:</strong> Write Python code instead of SQL</li>
        <li><strong>Migrations:</strong> Track database schema changes</li>
      </ul>
    </div>

    <h2>Creating Your First Model</h2>
    
    <pre class="code-block">
      <code>
# blog/models.py
from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    # CharField = text field with max length
    # max_length = maximum number of characters (required for CharField)
    title = models.CharField(max_length=200)
    
    # TextField = unlimited text (for long content)
    content = models.TextField()
    
    # DateTimeField = date and time
    # auto_now_add = automatically set to current time when created
    created_at = models.DateTimeField(auto_now_add=True)
    
    # auto_now = update to current time on every save
    updated_at = models.DateTimeField(auto_now=True)
    
    # ForeignKey = many-to-one relationship
    # Each post belongs to one user (author)
    # on_delete=CASCADE = delete posts when user is deleted
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # BooleanField = true/false
    # default = value if not specified
    published = models.BooleanField(default=False)
    
    # Optional field (can be empty)
    # null=True = allow NULL in database
    # blank=True = allow empty in forms
    slug = models.SlugField(max_length=200, null=True, blank=True)
    
    # String representation of model (for admin, shell, etc.)
    def __str__(self):
        return self.title
    
    # Custom method
    def get_excerpt(self):
        return self.content[:100] + "..." if len(self.content) > 100 else self.content
    
    class Meta:
        # Metadata for the model
        ordering = ['-created_at']  # Order by newest first
        verbose_name = 'Blog Post'
        verbose_name_plural = 'Blog Posts'
      </code>
    </pre>

    <h2>Common Field Types</h2>
    
    <pre class="code-block">
      <code>
from django.db import models

class ExampleModel(models.Model):
    # Text fields
    name = models.CharField(max_length=100)  # Short text
    description = models.TextField()  # Long text
    email = models.EmailField()  # Email validation
    url = models.URLField()  # URL validation
    slug = models.SlugField()  # URL-friendly text
    
    # Number fields
    age = models.IntegerField()  # Whole numbers
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Money
    rating = models.FloatField()  # Decimal numbers
    
    # Date/Time fields
    birth_date = models.DateField()  # Date only
    appointment = models.DateTimeField()  # Date + time
    duration = models.DurationField()  # Time period
    
    # Boolean
    is_active = models.BooleanField(default=True)
    
    # Files
    profile_pic = models.ImageField(upload_to='profiles/')
    document = models.FileField(upload_to='documents/')
    
    # Choices
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
      </code>
    </pre>

    <h2>Model Relationships</h2>
    
    <pre class="code-block">
      <code>
# One-to-Many (ForeignKey)
class Author(models.Model):
    name = models.CharField(max_length=100)

class Book(models.Model):
    title = models.CharField(max_length=200)
    # Each book has one author
    # One author can have many books
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    # related_name = access books from author: author.books.all()
    # Without it: author.book_set.all()

# Many-to-Many
class Student(models.Model):
    name = models.CharField(max_length=100)
    # Each student can take many courses
    # Each course can have many students
    courses = models.ManyToManyField('Course')

class Course(models.Model):
    name = models.CharField(max_length=100)
    # Access students: course.student_set.all()

# One-to-One
class User(models.Model):
    username = models.CharField(max_length=100)

class Profile(models.Model):
    # Each user has one profile
    # Each profile belongs to one user
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField()
    # Access: user.profile or profile.user
      </code>
    </pre>

    <h2>Querying the Database (ORM)</h2>
    
    <pre class="code-block">
      <code>
# Create
post = Post.objects.create(
    title="My First Post",
    content="Hello World!",
    author=user,
    published=True
)

# Or create and save separately
post = Post(title="Another Post", content="Content here")
post.save()

# Read (Retrieve)
all_posts = Post.objects.all()  # Get all posts
published = Post.objects.filter(published=True)  # Filter
first_post = Post.objects.first()  # Get first
last_post = Post.objects.last()  # Get last
post = Post.objects.get(id=1)  # Get one (raises error if not found)

# Chaining filters
recent_posts = Post.objects.filter(
    published=True
).order_by('-created_at')[:10]  # 10 most recent published posts

# Field lookups
posts = Post.objects.filter(title__contains='Django')  # Title contains "Django"
posts = Post.objects.filter(created_at__gte='2024-01-01')  # Created after date
posts = Post.objects.filter(author__username='john')  # Relationship lookup

# Update
post = Post.objects.get(id=1)
post.title = "Updated Title"
post.save()

# Bulk update
Post.objects.filter(published=False).update(published=True)

# Delete
post = Post.objects.get(id=1)
post.delete()

# Bulk delete
Post.objects.filter(created_at__lt='2020-01-01').delete()

# Count
count = Post.objects.filter(published=True).count()

# Exists
has_posts = Post.objects.filter(author=user).exists()
      </code>
    </pre>

    <h2>Migrations</h2>
    
    <p>After creating or modifying models, create and apply migrations:</p>

    <pre class="code-block">
      <code>
# Create migration files (tracks model changes)
python manage.py makemigrations

# Apply migrations to database
python manage.py migrate

# View SQL that will be executed
python manage.py sqlmigrate blog 0001

# Show migration status
python manage.py showmigrations
      </code>
    </pre>

    <div class="tip-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-2">💡 Best Practices</h4>
      <ul class="space-y-1">
        <li>Always use get_object_or_404() in views instead of get()</li>
        <li>Add __str__() method to all models for better debugging</li>
        <li>Use select_related() and prefetch_related() to optimize queries</li>
        <li>Keep business logic in models, not views</li>
        <li>Run makemigrations and migrate after every model change</li>
      </ul>
    </div>
  </div>`,

  objectives: [
    "Understand Django models and ORM concepts",
    "Define model classes with various field types",
    "Create relationships between models (ForeignKey, ManyToMany)",
    "Query the database using Django's ORM",
    "Create and apply database migrations",
  ],

  practiceInstructions: [
    "Create a Book model with title, author, publication_date, and price fields",
    "Add a __str__() method that returns the book title",
    "Use appropriate field types for each attribute",
    "Include a Meta class to order books by publication date (newest first)",
  ],

  starterCode: `# models.py
from django.db import models

class Book(models.Model):
    # TODO: Add fields
    # title: CharField with max_length=200
    # author: CharField with max_length=100
    # publication_date: DateField
    # price: DecimalField with max_digits=6, decimal_places=2
    
    # TODO: Add __str__ method
    
    # TODO: Add Meta class with ordering
    pass`,

  solution: `# models.py
from django.db import models

class Book(models.Model):
    """
    Model representing a book
    """
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    publication_date = models.DateField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    
    def __str__(self):
        """
        String representation of the book
        """
        return self.title
    
    class Meta:
        """
        Metadata for the model
        """
        ordering = ['-publication_date']  # Newest first
        verbose_name = 'Book'
        verbose_name_plural = 'Books'

# After creating the model, run:
# python manage.py makemigrations
# python manage.py migrate`,

  hints: [
    "Import models from django.db",
    "Use CharField for text fields (requires max_length)",
    "Use DateField for dates",
    "Use DecimalField for prices (max_digits includes decimal places)",
    "The __str__ method should return a string",
    "In Meta class, use a list with '-' prefix for descending order",
  ],
};

export default lessonData;
