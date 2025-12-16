import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "GraphQL APIs with Django",
  description:
    "Master GraphQL with Django - learn how to build type-safe, flexible APIs using Graphene-Django with queries, mutations, and advanced features.",
  difficulty: "Intermediate",
  objectives: [
    "Understand GraphQL fundamentals and how it differs from REST",
    "Set up Graphene-Django for GraphQL support",
    "Define GraphQL schemas with Django models",
    "Implement queries and mutations with Django ORM",
    "Work with GraphQL clients and authentication",
    "Implement filtering, pagination, and subscriptions",
    "Handle errors and implement best practices",
  ],
  practiceInstructions: [
    "Install graphene-django and configure settings",
    "Create Django models for User and Post",
    "Define GraphQL ObjectTypes using Graphene",
    "Create Query class with resolvers",
    "Create Mutation class for CRUD operations",
    "Configure GraphQL URL endpoint",
    "Test your GraphQL API with GraphiQL interface",
  ],
  hints: [
    "Use DjangoObjectType to automatically create GraphQL types from models",
    "Remember to add graphene_django to INSTALLED_APPS",
    "Use graphql_jwt for authentication in GraphQL",
    "The relay framework provides cursor-based pagination",
    "GraphiQL interface is available at /graphql by default",
  ],
  content: `<div class="lesson-content">
    <p>GraphQL with Django provides a powerful, type-safe API layer over your Django models. Learn how to use Graphene-Django to build flexible GraphQL APIs that integrate seamlessly with Django's ORM and authentication system.</p>

    <h2>Why GraphQL with Django?</h2>
    
    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🚀 GraphQL + Django Benefits</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Django ORM Integration:</strong> Automatic query optimization and relationship loading</li>
        <li><strong>Type Safety:</strong> GraphQL schema matches Django models</li>
        <li><strong>Single Endpoint:</strong> One URL for all operations</li>
        <li><strong>Authentication:</strong> Built-in support for Django auth and JWT</li>
        <li><strong>Admin Integration:</strong> Works alongside Django admin</li>
      </ul>
    </div>

    <h2>Setting Up Graphene-Django</h2>
    
    <p>Install and configure GraphQL for Django:</p>

    <pre class="code-block">
      <code>
# Install Graphene-Django
# pip install graphene-django django-graphql-jwt
# graphene-django = GraphQL framework for Django
# django-graphql-jwt = JWT authentication for GraphQL

# settings.py
# Add graphene_django to INSTALLED_APPS
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'graphene_django',  # Add this
    'myapp',  # Your app
]

# Configure Graphene settings
# GRAPHENE = Dictionary configuring GraphQL behavior
GRAPHENE = {
    'SCHEMA': 'myapp.schema.schema',  # Path to your schema
    'MIDDLEWARE': [
        'graphql_jwt.middleware.JSONWebTokenMiddleware',  # JWT auth
    ],
}

# Configure GraphQL JWT
# GRAPHQL_JWT = JWT token configuration
GRAPHQL_JWT = {
    'JWT_VERIFY_EXPIRATION': True,
    'JWT_EXPIRATION_DELTA': timedelta(minutes=60),  # Token expires in 60 min
    'JWT_REFRESH_EXPIRATION_DELTA': timedelta(days=7),  # Refresh token 7 days
}

# models.py
# Create Django models (standard Django ORM)
from django.db import models
from django.contrib.auth.models import User

# Post model with foreign key to User
class Post(models.Model):
    # title = CharField (required text field)
    title = models.CharField(max_length=200)
    # content = TextField (longer text)
    content = models.TextField()
    # published = Boolean with default False
    published = models.BooleanField(default=False)
    # author = ForeignKey linking to User model
    # on_delete=CASCADE = Delete posts when user deleted
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    # created_at = Auto-set timestamp on creation
    created_at = models.DateTimeField(auto_now_add=True)
    # updated_at = Auto-update timestamp on save
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        # ordering = Default sort order for queries
        ordering = ['-created_at']  # Newest first
    
    def __str__(self):
        # String representation for admin
        return self.title

# Comment model for posts
class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'Comment by {self.author.username} on {self.post.title}'
      </code>
    </pre>

    <h2>Defining GraphQL Schema</h2>
    
    <p>Create GraphQL types and schema with Graphene:</p>

    <pre class="code-block">
      <code>
# schema.py
import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth.models import User
from .models import Post, Comment
from graphql_jwt.decorators import login_required

# UserType - GraphQL type from Django User model
# DjangoObjectType = Automatically creates GraphQL type from Django model
class UserType(DjangoObjectType):
    class Meta:
        model = User  # Link to Django User model
        # fields = Specify which fields to expose
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'posts')
        # Automatically includes relationships (posts via related_name)

# PostType - GraphQL type from Post model
class PostType(DjangoObjectType):
    class Meta:
        model = Post
        fields = ('id', 'title', 'content', 'published', 'author', 'comments', 'created_at', 'updated_at')
        # author and comments are automatically resolved via ForeignKey

# CommentType - GraphQL type from Comment model
class CommentType(DjangoObjectType):
    class Meta:
        model = Comment
        fields = ('id', 'post', 'author', 'text', 'created_at')

# Query class - Define all read operations
class Query(graphene.ObjectType):
    # all_users = Field returning list of users
    # List(UserType) = GraphQL list of UserType objects
    all_users = graphene.List(UserType)
    
    # user = Field returning single user
    # graphene.ID = GraphQL ID type (required parameter)
    user = graphene.Field(UserType, id=graphene.ID(required=True))
    
    # all_posts with optional filtering
    # published = Optional Boolean parameter for filtering
    all_posts = graphene.List(
        PostType,
        published=graphene.Boolean(),
        author_id=graphene.ID()
    )
    
    post = graphene.Field(PostType, id=graphene.ID(required=True))
    
    # Search posts by keyword
    search_posts = graphene.List(PostType, keyword=graphene.String(required=True))
    
    # Resolver for all_users
    # resolve_all_users = Method handling query
    # info = GraphQL execution context
    def resolve_all_users(self, info):
        # User.objects.all() = Django ORM query
        # Returns QuerySet of all users
        return User.objects.all()
    
    # Resolver for single user
    def resolve_user(self, info, id):
        try:
            # User.objects.get() = Get single object by ID
            return User.objects.get(pk=id)
        except User.DoesNotExist:
            # Return None if user not found
            # GraphQL will return null in response
            return None
    
    # Resolver with filtering
    def resolve_all_posts(self, info, published=None, author_id=None):
        # Start with all posts
        queryset = Post.objects.all()
        
        # Filter by published status if provided
        if published is not None:
            # queryset.filter() = Django ORM filter
            queryset = queryset.filter(published=published)
        
        # Filter by author if provided
        if author_id is not None:
            queryset = queryset.filter(author_id=author_id)
        
        # Optimize queries - select related author
        # select_related() = SQL JOIN to reduce queries
        return queryset.select_related('author')
    
    def resolve_post(self, info, id):
        try:
            return Post.objects.get(pk=id)
        except Post.DoesNotExist:
            return None
    
    def resolve_search_posts(self, info, keyword):
        # Q objects for complex queries
        from django.db.models import Q
        
        # Q(title__icontains=keyword) = Case-insensitive contains
        # | = OR operator for Q objects
        return Post.objects.filter(
            Q(title__icontains=keyword) | Q(content__icontains=keyword)
        ).select_related('author')

# Mutations for write operations
# CreatePost mutation - Create new post
class CreatePost(graphene.Mutation):
    # Arguments class defines input parameters
    class Arguments:
        title = graphene.String(required=True)
        content = graphene.String(required=True)
        published = graphene.Boolean()
    
    # Return type - the created post
    post = graphene.Field(PostType)
    # ok = Success/failure boolean
    ok = graphene.Boolean()
    
    # mutate = Method handling mutation logic
    # @login_required = Decorator requiring authentication
    @login_required
    def mutate(self, info, title, content, published=False):
        # info.context.user = Current authenticated user from JWT
        user = info.context.user
        
        # Create new Post instance
        # Post.objects.create() = Django ORM create
        post = Post.objects.create(
            title=title,
            content=content,
            published=published,
            author=user  # Set current user as author
        )
        
        # Return mutation result
        return CreatePost(post=post, ok=True)

# UpdatePost mutation - Update existing post
class UpdatePost(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        title = graphene.String()
        content = graphene.String()
        published = graphene.Boolean()
    
    post = graphene.Field(PostType)
    ok = graphene.Boolean()
    
    @login_required
    def mutate(self, info, id, title=None, content=None, published=None):
        try:
            # Get post by ID
            post = Post.objects.get(pk=id)
            
            # Check authorization - only author can update
            if post.author != info.context.user:
                raise Exception('Not authorized to update this post')
            
            # Update fields if provided
            if title is not None:
                post.title = title
            if content is not None:
                post.content = content
            if published is not None:
                post.published = published
            
            # post.save() = Save changes to database
            post.save()
            
            return UpdatePost(post=post, ok=True)
        except Post.DoesNotExist:
            raise Exception('Post not found')

# DeletePost mutation
class DeletePost(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
    
    ok = graphene.Boolean()
    
    @login_required
    def mutate(self, info, id):
        try:
            post = Post.objects.get(pk=id)
            
            # Check authorization
            if post.author != info.context.user:
                raise Exception('Not authorized to delete this post')
            
            # post.delete() = Remove from database
            post.delete()
            
            return DeletePost(ok=True)
        except Post.DoesNotExist:
            raise Exception('Post not found')

# CreateComment mutation
class CreateComment(graphene.Mutation):
    class Arguments:
        post_id = graphene.ID(required=True)
        text = graphene.String(required=True)
    
    comment = graphene.Field(CommentType)
    ok = graphene.Boolean()
    
    @login_required
    def mutate(self, info, post_id, text):
        try:
            post = Post.objects.get(pk=post_id)
            
            comment = Comment.objects.create(
                post=post,
                author=info.context.user,
                text=text
            )
            
            return CreateComment(comment=comment, ok=True)
        except Post.DoesNotExist:
            raise Exception('Post not found')

# Mutation class - Register all mutations
class Mutation(graphene.ObjectType):
    # Field() creates mutation field in schema
    create_post = CreatePost.Field()
    update_post = UpdatePost.Field()
    delete_post = DeletePost.Field()
    create_comment = CreateComment.Field()
    
    # JWT authentication mutations
    # ObtainJSONWebToken = Login mutation (get token)
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    # VerifyToken = Verify token is valid
    verify_token = graphql_jwt.Verify.Field()
    # RefreshToken = Get new token using refresh token
    refresh_token = graphql_jwt.Refresh.Field()

# Create schema with Query and Mutation
# schema = Main GraphQL schema object
schema = graphene.Schema(query=Query, mutation=Mutation)
      </code>
    </pre>

    <h2>Configure URLs</h2>
    
    <p>Add GraphQL endpoint to Django URLs:</p>

    <pre class="code-block">
      <code>
# urls.py
from django.contrib import admin
from django.urls import path
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt

# urlpatterns = List of URL routes
urlpatterns = [
    path('admin/', admin.site.urls),
    
    # GraphQL endpoint
    # csrf_exempt() = Disable CSRF for GraphQL (handles auth differently)
    # GraphQLView.as_view() = GraphQL request handler
    # graphiql=True = Enable GraphiQL interface (dev only)
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True))),
]

# For production, disable GraphiQL:
# path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=False))),
      </code>
    </pre>

    <h2>Making GraphQL Queries</h2>
    
    <p>Query examples for Django GraphQL API:</p>

    <pre class="code-block">
      <code>
# Example 1: Get all users with their posts
{
  allUsers {
    id
    username
    email
    posts {
      id
      title
      published
    }
  }
}

# Example 2: Get single user by ID
query GetUser($id: ID!) {
  user(id: $id) {
    id
    username
    email
    firstName
    lastName
    posts {
      id
      title
      content
      createdAt
    }
  }
}

# Variables:
{
  "id": "1"
}

# Example 3: Filter posts by published status
query GetPublishedPosts {
  allPosts(published: true) {
    id
    title
    content
    author {
      username
      email
    }
    comments {
      id
      text
      author {
        username
      }
    }
  }
}

# Example 4: Search posts
query SearchPosts($keyword: String!) {
  searchPosts(keyword: $keyword) {
    id
    title
    content
    author {
      username
    }
    createdAt
  }
}

# Variables:
{
  "keyword": "django"
}
      </code>
    </pre>

    <h2>GraphQL Mutations</h2>
    
    <p>Mutations for creating and updating data:</p>

    <pre class="code-block">
      <code>
# Example 1: Login and get JWT token
mutation Login {
  tokenAuth(username: "john", password: "password123") {
    token
    payload
    refreshToken
  }
}

# Response includes token to use in Authorization header:
{
  "data": {
    "tokenAuth": {
      "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
      "payload": {
        "username": "john",
        "exp": 1234567890
      },
      "refreshToken": "..."
    }
  }
}

# Example 2: Create post (requires authentication)
# Add token to HTTP header:
# Authorization: JWT eyJ0eXAiOiJKV1QiLCJhbGc...

mutation CreatePost {
  createPost(
    title: "My Django Post"
    content: "GraphQL with Django is powerful!"
    published: true
  ) {
    ok
    post {
      id
      title
      content
      author {
        username
      }
      createdAt
    }
  }
}

# Example 3: Update post
mutation UpdatePost($id: ID!, $title: String, $published: Boolean) {
  updatePost(id: $id, title: $title, published: $published) {
    ok
    post {
      id
      title
      published
      updatedAt
    }
  }
}

# Variables:
{
  "id": "1",
  "title": "Updated Title",
  "published": true
}

# Example 4: Create comment
mutation CreateComment($postId: ID!, $text: String!) {
  createComment(postId: $postId, text: $text) {
    ok
    comment {
      id
      text
      author {
        username
      }
      post {
        title
      }
    }
  }
}

# Example 5: Delete post
mutation DeletePost($id: ID!) {
  deletePost(id: $id) {
    ok
  }
}
      </code>
    </pre>

    <h2>Client Integration</h2>
    
    <p>Using Django GraphQL API from frontend:</p>

    <pre class="code-block">
      <code>
# Python client example
import requests

# GraphQL endpoint URL
GRAPHQL_URL = 'http://localhost:8000/graphql/'

# Login to get token
def login(username, password):
    query = '''
    mutation Login($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password) {
            token
            refreshToken
        }
    }
    '''
    
    variables = {
        'username': username,
        'password': password
    }
    
    # requests.post() = Send HTTP POST request
    response = requests.post(
        GRAPHQL_URL,
        json={'query': query, 'variables': variables}
    )
    
    data = response.json()
    return data['data']['tokenAuth']['token']

# Query with authentication
def get_my_posts(token):
    query = '''
    query {
        allPosts {
            id
            title
            content
            author {
                username
            }
        }
    }
    '''
    
    # Add JWT token to Authorization header
    headers = {
        'Authorization': f'JWT {token}'
    }
    
    response = requests.post(
        GRAPHQL_URL,
        json={'query': query},
        headers=headers
    )
    
    return response.json()

# Create post with mutation
def create_post(token, title, content):
    mutation = '''
    mutation CreatePost($title: String!, $content: String!, $published: Boolean) {
        createPost(title: $title, content: $content, published: $published) {
            ok
            post {
                id
                title
            }
        }
    }
    '''
    
    variables = {
        'title': title,
        'content': content,
        'published': True
    }
    
    headers = {
        'Authorization': f'JWT {token}'
    }
    
    response = requests.post(
        GRAPHQL_URL,
        json={'query': mutation, 'variables': variables},
        headers=headers
    )
    
    return response.json()

# Usage
token = login('john', 'password123')
posts = get_my_posts(token)
print(posts)

new_post = create_post(token, 'New Post', 'Content here')
print(new_post)
      </code>
    </pre>

    <h2>Advanced Features</h2>
    
    <p>Filtering, pagination, and optimization:</p>

    <pre class="code-block">
      <code>
# Relay pagination with Graphene
from graphene import relay
from graphene_django.filter import DjangoFilterBackend

# PostNode with Relay support
class PostNode(DjangoObjectType):
    class Meta:
        model = Post
        # relay.Node = Enable Relay specification
        interfaces = (relay.Node,)
        # filter_fields = Enable filtering
        filter_fields = {
            'title': ['exact', 'icontains'],
            'published': ['exact'],
            'author__username': ['exact', 'icontains'],
        }

# Query with pagination
class Query(graphene.ObjectType):
    # relay.ConnectionField = Paginated field
    all_posts = DjangoFilterConnectionField(PostNode)
    
    # Automatic cursor-based pagination
    # Supports: first, last, after, before parameters

# Query example with pagination:
query GetPosts($first: Int, $after: String) {
  allPosts(first: $first, after: $after, published: true) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        id
        title
        author {
          username
        }
      }
    }
  }
}

# Optimizing queries with select_related and prefetch_related
class Query(graphene.ObjectType):
    all_posts = graphene.List(PostType)
    
    def resolve_all_posts(self, info):
        # select_related() for ForeignKey (author)
        # prefetch_related() for reverse ForeignKey (comments)
        return Post.objects.select_related('author').prefetch_related('comments')

# Custom permissions
from graphql_jwt.decorators import permission_required

class CreatePost(graphene.Mutation):
    # ... arguments ...
    
    @login_required
    @permission_required('myapp.add_post')  # Django permission
    def mutate(self, info, title, content):
        # Only users with add_post permission can create
        post = Post.objects.create(
            title=title,
            content=content,
            author=info.context.user
        )
        return CreatePost(post=post, ok=True)

# Subscriptions with Django Channels
# pip install channels channels-redis graphene-subscriptions
# Requires WebSocket support

from graphene_subscriptions.events import CREATED

class Subscription(graphene.ObjectType):
    post_created = graphene.Field(PostType)
    
    def resolve_post_created(root, info):
        return root.filter(
            lambda event:
                event.operation == CREATED and
                isinstance(event.instance, Post)
        ).map(lambda event: event.instance)
      </code>
    </pre>

    <div class="practice-box bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
      <h3 class="font-semibold text-green-900 mb-4">🎯 Practice Exercise</h3>
      <p class="mb-4">Create a complete Django GraphQL API with:</p>
      <ul class="list-disc pl-6 space-y-2">
        <li>Django models: User (built-in), Post, Comment</li>
        <li>GraphQL types using DjangoObjectType</li>
        <li>Queries: allUsers, user(id), allPosts, searchPosts</li>
        <li>Mutations: createPost, updatePost, deletePost, createComment</li>
        <li>JWT authentication with login mutation</li>
        <li>Authorization checks (only author can update/delete)</li>
        <li>Test with GraphiQL at /graphql</li>
      </ul>
    </div>

    <div class="tip-box bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
      <h4 class="font-semibold text-yellow-900 mb-2">💡 Key Takeaways</h4>
      <ul class="list-disc pl-6 space-y-1 text-sm">
        <li>Graphene-Django seamlessly integrates GraphQL with Django ORM</li>
        <li>DjangoObjectType automatically creates GraphQL types from models</li>
        <li>Use select_related() and prefetch_related() to optimize queries</li>
        <li>JWT tokens provide stateless authentication for GraphQL</li>
        <li>Relay specification enables cursor-based pagination</li>
        <li>@login_required and permission decorators handle authorization</li>
        <li>GraphiQL provides interactive API documentation and testing</li>
        <li>Django Channels enables GraphQL subscriptions via WebSocket</li>
      </ul>
    </div>
  </div>`,

  starterCode: `# Install: pip install graphene-django django-graphql-jwt

# schema.py
import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth.models import User
from .models import Post

# Define your GraphQL types and schema here

class Query(graphene.ObjectType):
    # Add your queries here
    pass

class Mutation(graphene.ObjectType):
    # Add your mutations here
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)`,

  solution: `# models.py
from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    published = models.BooleanField(default=False)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']

# schema.py
import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth.models import User
from .models import Post
from graphql_jwt.decorators import login_required
import graphql_jwt

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'posts')

class PostType(DjangoObjectType):
    class Meta:
        model = Post
        fields = '__all__'

class Query(graphene.ObjectType):
    all_users = graphene.List(UserType)
    all_posts = graphene.List(PostType, published=graphene.Boolean())
    
    def resolve_all_users(self, info):
        return User.objects.all()
    
    def resolve_all_posts(self, info, published=None):
        queryset = Post.objects.select_related('author')
        if published is not None:
            queryset = queryset.filter(published=published)
        return queryset

class CreatePost(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        content = graphene.String(required=True)
        published = graphene.Boolean()
    
    post = graphene.Field(PostType)
    ok = graphene.Boolean()
    
    @login_required
    def mutate(self, info, title, content, published=False):
        post = Post.objects.create(
            title=title,
            content=content,
            published=published,
            author=info.context.user
        )
        return CreatePost(post=post, ok=True)

class Mutation(graphene.ObjectType):
    create_post = CreatePost.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)

# urls.py
from django.urls import path
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True))),
]`,

  validationCriteria: {
    requiredIncludes: [
      "graphene",
      "DjangoObjectType",
      "schema",
      "Query",
      "Mutation",
      "Field",
    ],
    requiredPatterns: [
      /class\s+\w+Type\(DjangoObjectType\)/,
      /class\s+Query\(graphene\.ObjectType\)/,
      /def\s+resolve_/,
    ],
    minLines: 15,
  },
};
