import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Database Optimization",
  description:
    "Learn how to optimize Django database queries for better performance using select_related, prefetch_related, and query optimization techniques.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <p>Database query optimization is crucial for building fast, scalable Django applications.</p>

    <h2>The N+1 Query Problem</h2>
    
    <pre class="code-block">
      <code>
# BAD: N+1 queries (1 + N where N = number of posts)
posts = Post.objects.all()
for post in posts:
    print(post.author.name)  # Hits database for each post!

# GOOD: 2 queries total (1 for posts, 1 for authors)
posts = Post.objects.select_related('author').all()
for post in posts:
    print(post.author.name)  # No additional query!
      </code>
    </pre>

    <h2>select_related (ForeignKey, OneToOne)</h2>
    
    <pre class="code-block">
      <code>
# For ForeignKey and OneToOneField relationships
# Uses SQL JOIN to fetch related objects in single query

# Single foreign key
posts = Post.objects.select_related('author').all()

# Multiple foreign keys
posts = Post.objects.select_related('author', 'category').all()

# Chained relationships
comments = Comment.objects.select_related('post__author').all()
      </code>
    </pre>

    <h2>prefetch_related (ManyToMany, Reverse ForeignKey)</h2>
    
    <pre class="code-block">
      <code>
# For ManyToManyField and reverse ForeignKey relationships
# Uses separate query with IN clause

# Get posts with their tags
posts = Post.objects.prefetch_related('tags').all()
for post in posts:
    for tag in post.tags.all():  # No additional query
        print(tag.name)

# Get authors with their posts
authors = Author.objects.prefetch_related('post_set').all()
for author in authors:
    for post in author.post_set.all():  # No additional query
        print(post.title)

# Combine both
posts = Post.objects.select_related('author').prefetch_related('tags').all()
      </code>
    </pre>

    <h2>Query Optimization Techniques</h2>
    
    <pre class="code-block">
      <code>
# Only fetch needed fields
Post.objects.only('id', 'title')  # Only these fields
Post.objects.defer('content')  # All except these

# Count without loading objects
Post.objects.filter(published=True).count()

# Check existence without loading
Post.objects.filter(author=user).exists()

# Aggregate queries
from django.db.models import Count, Avg, Sum

Post.objects.aggregate(
    total=Count('id'),
    avg_views=Avg('views'),
    total_likes=Sum('likes')
)

# Annotate (add calculated field to each object)
posts = Post.objects.annotate(
    comment_count=Count('comments')
)
for post in posts:
    print(f"{post.title}: {post.comment_count} comments")
      </code>
    </pre>

    <h2>Bulk Operations</h2>
    
    <pre class="code-block">
      <code>
# Bulk create (single query)
posts = [
    Post(title=f'Post {i}', content='Content')
    for i in range(100)
]
Post.objects.bulk_create(posts)

# Bulk update (single query)
posts = Post.objects.filter(published=False)
posts.update(published=True)

# Bulk delete
Post.objects.filter(created_at__lt='2020-01-01').delete()
      </code>
    </pre>

    <h2>Database Indexes</h2>
    
    <pre class="code-block">
      <code>
class Post(models.Model):
    title = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(unique=True)  # Automatically indexed
    
    class Meta:
        indexes = [
            models.Index(fields=['author', 'created_at']),
            models.Index(fields=['-created_at']),  # For ORDER BY
        ]
      </code>
    </pre>

    <div class="tip-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-2">💡 Best Practices</h4>
      <ul class="space-y-1">
        <li>Use select_related() for ForeignKey and OneToOne</li>
        <li>Use prefetch_related() for ManyToMany and reverse ForeignKey</li>
        <li>Use only() and defer() to limit fetched fields</li>
        <li>Use exists() instead of count() > 0</li>
        <li>Add indexes on frequently queried fields</li>
        <li>Use bulk operations for creating/updating multiple objects</li>
      </ul>
    </div>
  </div>`,

  objectives: [
    "Understand and solve the N+1 query problem",
    "Use select_related and prefetch_related effectively",
    "Optimize queries with only, defer, and aggregation",
    "Implement bulk operations for better performance",
    "Add database indexes for frequently queried fields",
  ],

  practiceInstructions: [
    "Optimize a query that fetches posts with their authors",
    "Use select_related to reduce database queries",
    "Add prefetch_related for tags (ManyToMany)",
  ],

  starterCode: `from django.db import models

# Optimize these queries:

# Query 1: Posts with authors (N+1 problem)
posts = Post.objects.all()
for post in posts:
    print(post.author.name)  # TODO: Optimize with select_related

# Query 2: Posts with tags (N+1 problem)
posts = Post.objects.all()
for post in posts:
    for tag in post.tags.all():  # TODO: Optimize with prefetch_related
        print(tag.name)

# Query 3: Combined optimization
# TODO: Get posts with authors and tags in optimal queries`,

  solution: `from django.db import models

# Optimized queries:

# Query 1: Posts with authors (2 queries total using JOIN)
posts = Post.objects.select_related('author').all()
for post in posts:
    print(post.author.name)  # No additional query

# Query 2: Posts with tags (2 queries total using IN)
posts = Post.objects.prefetch_related('tags').all()
for post in posts:
    for tag in post.tags.all():  # No additional query
        print(tag.name)

# Query 3: Combined optimization (3 queries total)
posts = Post.objects.select_related('author').prefetch_related('tags').all()
for post in posts:
    print(f"Title: {post.title}")
    print(f"Author: {post.author.name}")  # No query
    print(f"Tags: {', '.join(tag.name for tag in post.tags.all())}")  # No query

# Additional optimizations
# Only fetch needed fields
posts = Post.objects.select_related('author').only('title', 'author__name')

# Count efficiently
post_count = Post.objects.count()  # Better than len(Post.objects.all())

# Check existence
has_posts = Post.objects.exists()  # Better than Post.objects.count() > 0`,

  hints: [
    "Use select_related() for ForeignKey relationships (SQL JOIN)",
    "Use prefetch_related() for ManyToMany relationships (separate query)",
    "Chain select_related() and prefetch_related() when needed",
    "The Django Debug Toolbar helps visualize queries",
  ],
};

export default lessonData;
