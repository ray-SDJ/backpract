import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Python & Flask Performance Optimization",
  description:
    "Master performance optimization techniques for Python and Flask applications including caching, database optimization, profiling, and best practices.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <h1 class="text-3xl font-bold mb-6">Python & Flask Performance Optimization</h1>
    
    <p class="mb-4">Learn essential techniques to optimize Python and Flask applications for maximum performance, scalability, and efficiency.</p>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🚀 Caching Strategies</h2>
    
    <h3 class="text-xl font-semibold mt-6 mb-3">Redis Caching</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
# Install Redis
pip install redis Flask-Caching

from flask import Flask
from flask_caching import Cache
import redis

app = Flask(__name__)

# Configure caching
app.config['CACHE_TYPE'] = 'redis'
app.config['CACHE_REDIS_URL'] = 'redis://localhost:6379/0'
app.config['CACHE_DEFAULT_TIMEOUT'] = 300  # 5 minutes

cache = Cache(app)

# Cache function results
@cache.cached(timeout=60, key_prefix='all_users')
def get_all_users():
    """Cached for 60 seconds"""
    users = User.query.all()
    return [user.to_dict() for user in users]

# Cache view function
@app.route('/api/users')
@cache.cached(timeout=60, query_string=True)
def users_list():
    """Cache varies by query string"""
    page = request.args.get('page', 1, type=int)
    users = get_all_users()
    return jsonify({'users': users})

# Cache with dynamic key
@app.route('/api/users/<int:user_id>')
@cache.cached(timeout=300, key_prefix='user_detail')
def user_detail(user_id):
    """Cached per user"""
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

# Manual cache operations
def invalidate_user_cache(user_id):
    """Clear cache when user is updated"""
    cache.delete(f'user_detail_{user_id}')
    cache.delete('all_users')

# Memoization for expensive computations
@cache.memoize(timeout=3600)
def calculate_statistics(user_id, date_range):
    """Cache based on function arguments"""
    # Expensive calculation
    return compute_user_stats(user_id, date_range)
      </code>
    </pre>

    <h3 class="text-xl font-semibold mt-6 mb-3">In-Memory Caching with functools</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
from functools import lru_cache, cache
from datetime import datetime, timedelta

# LRU Cache for function results (maxsize=128 by default)
@lru_cache(maxsize=256)
def fibonacci(n):
    """Cached Fibonacci calculation"""
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Unbounded cache (Python 3.9+)
@cache
def get_config_value(key):
    """Cache configuration values"""
    return load_config_from_file()[key]

# Cache with TTL using custom decorator
def timed_cache(seconds=60):
    def decorator(func):
        cache_data = {}
        cache_time = {}
        
        def wrapper(*args):
            now = datetime.now()
            if args in cache_data:
                if now - cache_time[args] < timedelta(seconds=seconds):
                    return cache_data[args]
            
            result = func(*args)
            cache_data[args] = result
            cache_time[args] = now
            return result
        
        return wrapper
    return decorator

@timed_cache(seconds=300)
def fetch_external_api(endpoint):
    """Cache API responses for 5 minutes"""
    return requests.get(endpoint).json()
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🗄️ Database Optimization</h2>
    
    <h3 class="text-xl font-semibold mt-6 mb-3">Query Optimization</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
from sqlalchemy import func
from sqlalchemy.orm import joinedload, selectinload, contains_eager

# BAD: N+1 Query Problem
def get_posts_bad():
    posts = Post.query.all()
    for post in posts:
        print(post.author.username)  # Triggers new query for each post!
    return posts

# GOOD: Eager loading with joinedload (single query with JOIN)
def get_posts_good():
    posts = Post.query.options(
        joinedload(Post.author),
        joinedload(Post.tags)
    ).all()
    return posts

# GOOD: Selective loading with selectinload (2 queries total)
def get_posts_selective():
    posts = Post.query.options(
        selectinload(Post.author),
        selectinload(Post.comments)
    ).all()
    return posts

# Load only needed columns
def get_user_names():
    """More efficient than loading full User objects"""
    return db.session.query(User.id, User.username).all()

# Use pagination
def get_posts_paginated(page=1, per_page=20):
    """Don't load all records at once"""
    return Post.query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

# Optimize with indexes
class User(db.Model):
    username = db.Column(db.String(80), index=True)  # Single column index
    email = db.Column(db.String(120), index=True)
    created_at = db.Column(db.DateTime, index=True)
    
    # Composite index for common query patterns
    __table_args__ = (
        db.Index('idx_user_email_active', 'email', 'is_active'),
    )

# Bulk operations
def bulk_insert_users(users_data):
    """More efficient than individual inserts"""
    db.session.bulk_insert_mappings(User, users_data)
    db.session.commit()

# Use database aggregation instead of Python
def get_post_stats():
    """Let database do the work"""
    return db.session.query(
        func.count(Post.id).label('total'),
        func.avg(Post.view_count).label('avg_views'),
        func.max(Post.created_at).label('latest')
    ).first()
      </code>
    </pre>

    <h3 class="text-xl font-semibold mt-6 mb-3">Connection Pooling</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
# Configure SQLAlchemy connection pool
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_size': 10,        # Maximum connections in pool
    'pool_recycle': 3600,   # Recycle connections after 1 hour
    'pool_pre_ping': True,  # Verify connections before using
    'max_overflow': 20,     # Extra connections beyond pool_size
    'pool_timeout': 30      # Wait time for connection
}

# Use context managers for connections
from contextlib import contextmanager

@contextmanager
def get_db_connection():
    """Ensure connection is properly closed"""
    connection = db.engine.connect()
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">⚡ Code Optimization</h2>
    
    <h3 class="text-xl font-semibold mt-6 mb-3">List Comprehensions vs Loops</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
# SLOW: Regular loop
result = []
for i in range(1000):
    if i % 2 == 0:
        result.append(i ** 2)

# FAST: List comprehension (2x faster)
result = [i ** 2 for i in range(1000) if i % 2 == 0]

# FASTEST: Generator for large datasets (memory efficient)
result = (i ** 2 for i in range(1000000) if i % 2 == 0)

# Use built-in functions
# SLOW
total = 0
for num in numbers:
    total += num

# FAST
total = sum(numbers)

# Use map/filter for transformations
# SLOW
squares = [x ** 2 for x in numbers]

# FAST (for large datasets)
squares = list(map(lambda x: x ** 2, numbers))
      </code>
    </pre>

    <h3 class="text-xl font-semibold mt-6 mb-3">String Operations</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
# SLOW: String concatenation in loop
result = ""
for s in strings:
    result += s  # Creates new string each time!

# FAST: Use join
result = "".join(strings)

# SLOW: Multiple string replacements
text = text.replace("foo", "bar")
text = text.replace("baz", "qux")
text = text.replace("hello", "world")

# FAST: Use translate or regex
import re
replacements = {"foo": "bar", "baz": "qux", "hello": "world"}
pattern = re.compile("|".join(map(re.escape, replacements.keys())))
text = pattern.sub(lambda m: replacements[m.group(0)], text)

# Use f-strings (fastest string formatting)
# SLOW
message = "Hello, " + name + "! You are " + str(age) + " years old."

# FAST
message = f"Hello, {name}! You are {age} years old."
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🔧 Flask-Specific Optimizations</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
from flask import Flask, g, request
from werkzeug.middleware.profiler import ProfilerMiddleware
import gzip

# 1. Enable response compression
from flask_compress import Compress

app = Flask(__name__)
Compress(app)  # Automatically compresses responses

# 2. Use lazy loading for database
app.config['SQLALCHEMY_ECHO'] = False  # Disable SQL logging in production

# 3. Optimize JSON encoding
import orjson

@app.route('/api/data')
def get_data():
    data = get_large_dataset()
    return orjson.dumps(data), 200, {'Content-Type': 'application/json'}

# 4. Connection pooling per request
@app.before_request
def before_request():
    g.db = get_db_connection()

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

# 5. Use CDN for static files
app.config['CDN_DOMAIN'] = 'cdn.example.com'
app.config['CDN_HTTPS'] = True

# 6. Implement rate limiting
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="redis://localhost:6379"
)

@app.route('/api/expensive')
@limiter.limit("10 per minute")
def expensive_endpoint():
    return heavy_computation()

# 7. Background tasks with Celery
from celery import Celery

celery = Celery(app.name, broker='redis://localhost:6379/0')

@celery.task
def send_email_async(recipient, subject, body):
    """Run in background worker"""
    send_email(recipient, subject, body)

@app.route('/api/signup', methods=['POST'])
def signup():
    user = create_user(request.json)
    send_email_async.delay(user.email, "Welcome!", "Thanks for signing up!")
    return jsonify({'message': 'User created'}), 201
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">📊 Profiling & Monitoring</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
import cProfile
import pstats
from io import StringIO
import time
from functools import wraps

# Time function execution
def timing_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

@timing_decorator
def slow_function():
    time.sleep(1)
    return "Done"

# Profile function
def profile_function(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        profiler = cProfile.Profile()
        profiler.enable()
        result = func(*args, **kwargs)
        profiler.disable()
        
        s = StringIO()
        ps = pstats.Stats(profiler, stream=s).sort_stats('cumulative')
        ps.print_stats(10)  # Top 10 functions
        print(s.getvalue())
        return result
    return wrapper

# Line profiler for detailed analysis
# pip install line_profiler
# Usage: kernprof -l -v script.py
@profile  # Line profiler decorator
def analyze_line_by_line():
    data = [i ** 2 for i in range(10000)]
    filtered = [x for x in data if x % 2 == 0]
    return sum(filtered)

# Memory profiling
# pip install memory_profiler
from memory_profiler import profile as memory_profile

@memory_profile
def memory_intensive():
    big_list = [i for i in range(1000000)]
    return sum(big_list)

# Flask request timing middleware
@app.before_request
def start_timer():
    g.start_time = time.perf_counter()

@app.after_request
def log_request_time(response):
    if hasattr(g, 'start_time'):
        elapsed = time.perf_counter() - g.start_time
        response.headers['X-Request-Time'] = str(elapsed)
        if elapsed > 1.0:  # Log slow requests
            app.logger.warning(f"Slow request: {request.path} took {elapsed:.2f}s")
    return response
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🌐 API Optimization</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
# Implement pagination
@app.route('/api/posts')
def get_posts():
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    
    posts = Post.query.paginate(page=page, per_page=per_page)
    
    return jsonify({
        'data': [p.to_dict() for p in posts.items],
        'meta': {
            'total': posts.total,
            'page': page,
            'per_page': per_page,
            'pages': posts.pages
        }
    })

# Field selection (sparse fieldsets)
@app.route('/api/users/<int:user_id>')
def get_user(user_id):
    fields = request.args.get('fields', '').split(',')
    user = User.query.get_or_404(user_id)
    
    if fields and fields[0]:  # Return only requested fields
        return jsonify({k: v for k, v in user.to_dict().items() if k in fields})
    
    return jsonify(user.to_dict())

# Batch endpoints
@app.route('/api/users/batch', methods=['POST'])
def get_users_batch():
    """Get multiple users in one request"""
    user_ids = request.json.get('user_ids', [])
    users = User.query.filter(User.id.in_(user_ids)).all()
    return jsonify({'users': [u.to_dict() for u in users]})

# ETag for conditional requests
from hashlib import md5

@app.route('/api/resource/<int:id>')
def get_resource(id):
    resource = Resource.query.get_or_404(id)
    data = resource.to_dict()
    
    # Generate ETag
    etag = md5(str(data).encode()).hexdigest()
    
    # Check If-None-Match header
    if request.headers.get('If-None-Match') == etag:
        return '', 304  # Not Modified
    
    response = jsonify(data)
    response.headers['ETag'] = etag
    response.headers['Cache-Control'] = 'max-age=300'  # 5 minutes
    return response
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">💡 Best Practices</h2>
    
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-yellow-900 mb-3">✅ Optimization Checklist</h4>
      <ul class="text-yellow-800 space-y-2">
        <li>• <strong>Use caching:</strong> Redis for shared state, LRU cache for pure functions</li>
        <li>• <strong>Optimize queries:</strong> Eager loading, indexes, limit columns</li>
        <li>• <strong>Connection pooling:</strong> Configure pool size for your workload</li>
        <li>• <strong>List comprehensions:</strong> Faster than loops for transformations</li>
        <li>• <strong>Generators:</strong> Use for large datasets to save memory</li>
        <li>• <strong>Async tasks:</strong> Move slow operations to background workers</li>
        <li>• <strong>Pagination:</strong> Never load all records at once</li>
        <li>• <strong>Compression:</strong> Enable gzip for API responses</li>
        <li>• <strong>Profile first:</strong> Measure before optimizing</li>
        <li>• <strong>Monitor production:</strong> Track slow queries and endpoints</li>
      </ul>
    </div>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🚀 Production Deployment</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
# Use Gunicorn with multiple workers
# gunicorn --workers 4 --threads 2 --worker-class gthread app:app

# Configure for production
import os

class ProductionConfig:
    DEBUG = False
    TESTING = False
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 10,
        'pool_recycle': 3600,
        'pool_pre_ping': True
    }
    
    # Caching
    CACHE_TYPE = 'redis'
    CACHE_REDIS_URL = os.getenv('REDIS_URL')
    
    # Security
    SECRET_KEY = os.getenv('SECRET_KEY')
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    
    # Performance
    SEND_FILE_MAX_AGE_DEFAULT = 31536000  # 1 year for static files

app.config.from_object(ProductionConfig)

# Use reverse proxy (Nginx) for:
# - Static file serving
# - SSL termination
# - Load balancing
# - Caching
      </code>
    </pre>
  </div>`,
  objectives: [
    "Implement Redis caching for Flask applications",
    "Optimize database queries with eager loading and indexes",
    "Use list comprehensions and generators for better performance",
    "Profile and monitor application performance",
    "Implement pagination and API optimizations",
    "Configure production settings for maximum efficiency",
  ],
  practiceInstructions: [
    "Set up Redis caching for a frequently accessed endpoint",
    "Identify and fix N+1 query problems using joinedload",
    "Add database indexes to commonly queried fields",
    "Replace loops with list comprehensions",
    "Implement request timing middleware",
    "Configure Gunicorn for production deployment",
  ],
  hints: [
    "Use cache.cached() for view functions and cache.memoize() for regular functions",
    "Always use joinedload() or selectinload() to avoid N+1 queries",
    "Profile before optimizing - measure to find actual bottlenecks",
    "Generators save memory but list comprehensions are faster for small datasets",
    "Connection pooling prevents creating new connections on every request",
    "Background tasks (Celery) keep your API responses fast",
  ],
  solution: `# Complete optimization example

from flask import Flask, jsonify, request, g
from flask_caching import Cache
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import joinedload
import time

app = Flask(__name__)

# Configure caching
app.config['CACHE_TYPE'] = 'redis'
app.config['CACHE_REDIS_URL'] = 'redis://localhost:6379/0'
cache = Cache(app)

# Configure database with connection pooling
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_size': 10,
    'pool_recycle': 3600,
    'pool_pre_ping': True
}
db = SQLAlchemy(app)

# Timing middleware
@app.before_request
def start_timer():
    g.start_time = time.perf_counter()

@app.after_request
def log_time(response):
    if hasattr(g, 'start_time'):
        elapsed = time.perf_counter() - g.start_time
        response.headers['X-Request-Time'] = str(elapsed)
    return response

# Optimized endpoint with caching
@app.route('/api/posts')
@cache.cached(timeout=60, query_string=True)
def get_posts():
    page = request.args.get('page', 1, type=int)
    
    # Eager loading to avoid N+1
    posts = Post.query.options(
        joinedload(Post.author),
        joinedload(Post.tags)
    ).paginate(page=page, per_page=20)
    
    return jsonify({
        'data': [p.to_dict() for p in posts.items],
        'meta': {'total': posts.total, 'page': page}
    })

# Use list comprehension
def process_data(numbers):
    return [x ** 2 for x in numbers if x % 2 == 0]

if __name__ == '__main__':
    app.run()`,
};
