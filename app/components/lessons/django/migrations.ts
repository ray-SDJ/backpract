import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Django Migrations",
  description:
    "Learn how to manage database schema changes using Django's migration system. Understand how to create, apply, and troubleshoot migrations.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>Migrations are Django's way of tracking changes to your database schema over time.</p>

    <h2>Creating Migrations</h2>
    
    <pre class="code-block">
      <code>
# After changing models, create migration
python manage.py makemigrations

# Create empty migration (for data migrations)
python manage.py makemigrations --empty myapp

# Create migration with custom name
python manage.py makemigrations myapp --name add_status_field
      </code>
    </pre>

    <h2>Applying Migrations</h2>
    
    <pre class="code-block">
      <code>
# Apply all pending migrations
python manage.py migrate

# Apply specific app migrations
python manage.py migrate myapp

# Apply up to specific migration
python manage.py migrate myapp 0003

# Show migration status
python manage.py showmigrations

# Show SQL for migration
python manage.py sqlmigrate myapp 0001
      </code>
    </pre>

    <h2>Data Migrations</h2>
    
    <pre class="code-block">
      <code>
# migrations/0004_populate_slug.py
from django.db import migrations

def populate_slug(apps, schema_editor):
    Post = apps.get_model('blog', 'Post')
    for post in Post.objects.all():
        if not post.slug:
            post.slug = post.title.lower().replace(' ', '-')
            post.save()

def reverse_populate_slug(apps, schema_editor):
    Post = apps.get_model('blog', 'Post')
    Post.objects.all().update(slug='')

class Migration(migrations.Migration):
    dependencies = [
        ('blog', '0003_add_slug_field'),
    ]
    
    operations = [
        migrations.RunPython(populate_slug, reverse_populate_slug),
    ]
      </code>
    </pre>

    <h2>Common Migration Operations</h2>
    
    <pre class="code-block">
      <code>
from django.db import migrations, models

class Migration(migrations.Migration):
    operations = [
        # Add field
        migrations.AddField(
            model_name='post',
            name='views',
            field=models.IntegerField(default=0),
        ),
        
        # Remove field
        migrations.RemoveField(
            model_name='post',
            name='old_field',
        ),
        
        # Rename field
        migrations.RenameField(
            model_name='post',
            old_name='author_name',
            new_name='author',
        ),
        
        # Alter field
        migrations.AlterField(
            model_name='post',
            name='title',
            field=models.CharField(max_length=300),
        ),
        
        # Create model
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(primary_key=True)),
                ('text', models.TextField()),
            ],
        ),
        
        # Delete model
        migrations.DeleteModel(name='OldModel'),
    ]
      </code>
    </pre>

    <h2>Rolling Back Migrations</h2>
    
    <pre class="code-block">
      <code>
# Rollback to previous migration
python manage.py migrate myapp 0002

# Rollback all migrations for an app
python manage.py migrate myapp zero

# Show unapplied migrations
python manage.py showmigrations --plan
      </code>
    </pre>

    <h2>Squashing Migrations</h2>
    
    <pre class="code-block">
      <code>
# Combine multiple migrations into one
python manage.py squashmigrations myapp 0001 0005

# After testing, delete old migrations and update squashed migration
      </code>
    </pre>

    <div class="tip-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-2">💡 Best Practices</h4>
      <ul class="space-y-1">
        <li>Always create migrations after model changes</li>
        <li>Review generated migrations before applying</li>
        <li>Test migrations on development database first</li>
        <li>Never edit applied migrations (create new ones instead)</li>
        <li>Use data migrations for populating fields</li>
        <li>Commit migrations to version control</li>
      </ul>
    </div>
  </div>`,

  objectives: [
    "Create and apply database migrations",
    "Write data migrations for complex changes",
    "Rollback migrations when needed",
    "Understand migration dependencies",
  ],

  practiceInstructions: [
    "Add a new field to a model",
    "Create a migration for the change",
    "Apply the migration to the database",
  ],

  starterCode: `# models.py
class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    # TODO: Add a new field 'status' (CharField with choices)
    # Choices: 'draft', 'published', 'archived'
    # Default: 'draft'

# Commands to run:
# TODO: Create migration
# TODO: Apply migration
# TODO: View migration SQL`,

  solution: `# models.py
class Article(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )

# Commands to run:
# 1. Create migration
python manage.py makemigrations

# 2. View SQL that will be executed (optional)
python manage.py sqlmigrate blog 0002

# 3. Apply migration
python manage.py migrate

# 4. Verify migration was applied
python manage.py showmigrations blog`,

  hints: [
    "Run makemigrations after changing models",
    "Run migrate to apply changes to database",
    "Use sqlmigrate to preview SQL",
    "Use showmigrations to check status",
    "Migrations are stored in app/migrations/ directory",
  ],
};

export default lessonData;
