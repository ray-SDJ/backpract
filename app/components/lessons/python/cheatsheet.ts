import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Python Cheat Sheet - Complete Reference",
  description:
    "Comprehensive cheat sheet covering Python string methods, list operations, dictionaries, sets, and Flask/Django backend methods.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <p>A complete reference guide for Python covering essential language methods and backend-specific operations.</p>

    <h2>📝 String Methods</h2>
    
    <div class="code-block">
      <pre><code>text = "Hello World"

# Case Conversion
text.upper()           # "HELLO WORLD"
text.lower()           # "hello world"
text.capitalize()      # "Hello world"
text.title()          # "Hello World"
text.swapcase()       # "hELLO wORLD"

# Search & Replace
text.find("World")    # 6 (returns -1 if not found)
text.index("World")   # 6 (raises ValueError if not found)
text.count("l")       # 3
text.replace("World", "Python")  # "Hello Python"
text.startswith("Hello")  # True
text.endswith("World")    # True

# Splitting & Joining
text.split()          # ["Hello", "World"]
text.split("o")       # ["Hell", " W", "rld"]
"-".join(["a", "b", "c"])  # "a-b-c"

# Trimming & Padding
text.strip()          # Remove whitespace from both ends
text.lstrip()         # Remove from left
text.rstrip()         # Remove from right
text.center(20, "*")  # "****Hello World*****"
text.ljust(20, "-")   # "Hello World---------"
text.rjust(20, "-")   # "---------Hello World"
text.zfill(15)        # "0000Hello World"

# Checking Content
text.isalpha()        # False (has space)
text.isdigit()        # False
text.isalnum()        # False
text.isspace()        # False
text.islower()        # False
text.isupper()        # False

# Formatting
name = "Alice"
age = 30
f"Name: {name}, Age: {age}"  # f-strings (Python 3.6+)
"Name: {}, Age: {}".format(name, age)
"Name: %s, Age: %d" % (name, age)  # old-style</code></pre>
    </div>

    <h2>📋 List Methods</h2>
    
    <div class="code-block">
      <pre><code>nums = [1, 2, 3, 4, 5]

# Adding Elements
nums.append(6)        # [1, 2, 3, 4, 5, 6]
nums.insert(0, 0)     # [0, 1, 2, 3, 4, 5, 6]
nums.extend([7, 8])   # [0, 1, 2, 3, 4, 5, 6, 7, 8]

# Removing Elements
nums.remove(0)        # Remove first occurrence of 0
nums.pop()           # Remove and return last element
nums.pop(0)          # Remove and return element at index 0
nums.clear()         # Remove all elements

# Searching
nums = [1, 2, 3, 2, 1]
nums.index(2)        # 1 (first occurrence)
nums.count(2)        # 2

# Sorting & Reversing
nums.sort()          # Sort in place
nums.sort(reverse=True)  # Sort descending
sorted(nums)         # Return new sorted list
nums.reverse()       # Reverse in place
reversed(nums)       # Return reverse iterator

# List Comprehension
squares = [x**2 for x in range(10)]  # [0, 1, 4, 9, 16, ...]
evens = [x for x in range(10) if x % 2 == 0]  # [0, 2, 4, 6, 8]

# Slicing
nums[1:3]           # Elements from index 1 to 2
nums[:3]            # First 3 elements
nums[3:]            # From index 3 to end
nums[-1]            # Last element
nums[::2]           # Every 2nd element
nums[::-1]          # Reverse list

# Other Operations
len(nums)           # Length
max(nums)           # Maximum value
min(nums)           # Minimum value
sum(nums)           # Sum of all elements
any([True, False])  # True if any element is True
all([True, True])   # True if all elements are True</code></pre>
    </div>

    <h2>📚 Dictionary Methods</h2>
    
    <div class="code-block">
      <pre><code>user = {"name": "Alice", "age": 30, "city": "NYC"}

# Accessing Values
user["name"]              # "Alice"
user.get("name")          # "Alice"
user.get("email", "N/A")  # "N/A" (default if not found)

# Adding/Updating
user["email"] = "alice@email.com"
user.update({"age": 31, "country": "USA"})

# Removing
user.pop("city")          # Remove and return value
user.popitem()           # Remove and return last (key, value) pair
del user["age"]          # Delete key
user.clear()             # Remove all items

# Checking Keys
"name" in user           # True
"email" not in user      # False
user.keys()              # dict_keys(['name', 'age', 'city'])
user.values()            # dict_values(['Alice', 30, 'NYC'])
user.items()             # dict_items([('name', 'Alice'), ...])

# Iteration
for key in user:
    print(key, user[key])

for key, value in user.items():
    print(f"{key}: {value}")

# Dictionary Comprehension
squares = {x: x**2 for x in range(5)}  # {0: 0, 1: 1, 2: 4, ...}

# Merging Dictionaries (Python 3.9+)
dict1 = {"a": 1}
dict2 = {"b": 2}
merged = dict1 | dict2   # {"a": 1, "b": 2}

# Copy
user.copy()              # Shallow copy
import copy
copy.deepcopy(user)      # Deep copy</code></pre>
    </div>

    <h2>🎯 Set Methods</h2>
    
    <div class="code-block">
      <pre><code>nums = {1, 2, 3, 4, 5}

# Adding/Removing
nums.add(6)              # Add single element
nums.update([7, 8, 9])   # Add multiple elements
nums.remove(1)           # Remove (raises KeyError if not found)
nums.discard(1)          # Remove (no error if not found)
nums.pop()              # Remove and return arbitrary element
nums.clear()            # Remove all elements

# Set Operations
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

a.union(b)              # {1, 2, 3, 4, 5, 6} or a | b
a.intersection(b)       # {3, 4} or a & b
a.difference(b)         # {1, 2} or a - b
a.symmetric_difference(b)  # {1, 2, 5, 6} or a ^ b

# Subset/Superset
a.issubset(b)           # False
a.issuperset(b)         # False
a.isdisjoint(b)         # False (have common elements)

# Set Comprehension
evens = {x for x in range(10) if x % 2 == 0}</code></pre>
    </div>

    <h2>🌐 Flask Backend Methods</h2>
    
    <div class="code-block">
      <pre><code>from flask import Flask, request, jsonify, session, make_response
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# Route Decorators
@app.route('/api/users', methods=['GET', 'POST'])
@app.route('/api/users/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])

# Request Object
request.method           # GET, POST, PUT, DELETE
request.args.get('page')  # Query parameters (?page=1)
request.form.get('username')  # Form data
request.json            # JSON payload
request.headers.get('Authorization')
request.cookies.get('session_id')
request.files.get('photo')  # File uploads
request.remote_addr     # Client IP address
request.url            # Full URL
request.path           # URL path

# Response Methods
return jsonify({"message": "Success"}), 200
return make_response(jsonify(data), 201)
return redirect('/login')
return send_file('photo.jpg')
return send_from_directory('uploads', filename)

# Session Management
session['user_id'] = user.id
session.get('user_id')
session.pop('user_id', None)
session.clear()

# Error Handling
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# Before/After Request
@app.before_request
def before_request():
    # Runs before each request
    pass

@app.after_request
def after_request(response):
    # Runs after each request
    return response

# Password Hashing
hashed = generate_password_hash('password123')
is_valid = check_password_hash(hashed, 'password123')

# Flask-CORS
from flask_cors import CORS
CORS(app)  # Enable CORS for all routes

# Flask-JWT-Extended
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

access_token = create_access_token(identity=user.id)

@app.route('/protected')
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    return jsonify(logged_in_as=current_user_id)</code></pre>
    </div>

    <h2>🚀 Django Backend Methods</h2>
    
    <div class="code-block">
      <pre><code>from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator

# View Decorators
@require_http_methods(["GET", "POST"])
@login_required
def my_view(request):
    pass

# Request Object
request.method           # GET, POST, PUT, DELETE
request.GET.get('page')  # Query parameters
request.POST.get('username')  # Form data
request.body            # Raw request body
request.JSON            # Parsed JSON (with middleware)
request.headers.get('Authorization')
request.COOKIES.get('sessionid')
request.FILES.get('photo')
request.user           # Current authenticated user

# Response Methods
JsonResponse({"status": "success"}, status=200)
HttpResponse("Hello", content_type="text/plain")
redirect('/dashboard/')
render(request, 'template.html', context)

# ORM Query Methods
from myapp.models import User

# Retrieve
User.objects.all()
User.objects.filter(age__gte=18)
User.objects.exclude(status='inactive')
User.objects.get(id=1)  # Single object
User.objects.first()
User.objects.last()
User.objects.count()
User.objects.exists()

# Create
user = User.objects.create(username='alice', email='alice@email.com')
user = User(username='bob')
user.save()

# Update
User.objects.filter(id=1).update(age=31)
user = User.objects.get(id=1)
user.age = 32
user.save()

# Delete
User.objects.filter(id=1).delete()
user.delete()

# Filtering
User.objects.filter(age__gt=18)      # Greater than
User.objects.filter(age__gte=18)     # Greater than or equal
User.objects.filter(age__lt=65)      # Less than
User.objects.filter(age__lte=65)     # Less than or equal
User.objects.filter(name__icontains='alice')  # Case-insensitive contains
User.objects.filter(name__startswith='A')
User.objects.filter(created_at__year=2024)

# Ordering
User.objects.order_by('age')
User.objects.order_by('-age')  # Descending

# Aggregation
from django.db.models import Count, Avg, Sum, Max, Min

User.objects.aggregate(Avg('age'))
User.objects.aggregate(total=Count('id'))

# Pagination
users = User.objects.all()
paginator = Paginator(users, 10)  # 10 per page
page_obj = paginator.get_page(request.GET.get('page'))

# Authentication
user = authenticate(username='alice', password='password123')
if user:
    login(request, user)

logout(request)

# Signals
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def user_saved(sender, instance, created, **kwargs):
    if created:
        print(f"New user created: {instance.username}")</code></pre>
    </div>

    <h2>🔧 File Operations</h2>
    
    <div class="code-block">
      <pre><code># Reading Files
with open('file.txt', 'r') as f:
    content = f.read()           # Read entire file
    content = f.readline()       # Read one line
    lines = f.readlines()        # Read all lines as list

# Writing Files
with open('file.txt', 'w') as f:
    f.write('Hello World\\n')
    f.writelines(['Line 1\\n', 'Line 2\\n'])

# Appending
with open('file.txt', 'a') as f:
    f.write('New line\\n')

# JSON
import json
data = json.loads('{"name": "Alice"}')  # Parse JSON string
json_str = json.dumps({"name": "Alice"})  # Convert to JSON string

with open('data.json', 'r') as f:
    data = json.load(f)  # Load from file

with open('data.json', 'w') as f:
    json.dump(data, f, indent=2)  # Write to file

# CSV
import csv
with open('data.csv', 'r') as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)

# Pickle (Python objects)
import pickle
with open('data.pkl', 'wb') as f:
    pickle.dump(data, f)

with open('data.pkl', 'rb') as f:
    data = pickle.load(f)</code></pre>
    </div>

    <h2>⏰ Date & Time</h2>
    
    <div class="code-block">
      <pre><code>from datetime import datetime, date, time, timedelta

# Current date/time
now = datetime.now()
today = date.today()

# Creating dates
dt = datetime(2024, 12, 25, 10, 30, 0)
d = date(2024, 12, 25)

# Formatting
dt.strftime('%Y-%m-%d %H:%M:%S')  # "2024-12-25 10:30:00"
dt.strftime('%B %d, %Y')          # "December 25, 2024"

# Parsing
dt = datetime.strptime('2024-12-25', '%Y-%m-%d')

# Arithmetic
tomorrow = today + timedelta(days=1)
next_week = today + timedelta(weeks=1)
an_hour_ago = now - timedelta(hours=1)

# Components
dt.year, dt.month, dt.day
dt.hour, dt.minute, dt.second
dt.weekday()  # 0 = Monday

# Timezone-aware (recommended)
from datetime import timezone
utc_now = datetime.now(timezone.utc)</code></pre>
    </div>

    <h2>🔍 Regular Expressions</h2>
    
    <div class="code-block">
      <pre><code>import re

# Search
match = re.search(r'\\d+', 'Price: 100')  # Find first number
if match:
    print(match.group())  # "100"

# Find all
numbers = re.findall(r'\\d+', 'Price: 100, Tax: 20')  # ['100', '20']

# Replace
result = re.sub(r'\\d+', 'X', 'Price: 100')  # "Price: X"

# Split
parts = re.split(r'[,;]', 'a,b;c')  # ['a', 'b', 'c']

# Match (from start)
if re.match(r'^Hello', 'Hello World'):
    print("Starts with Hello")

# Common Patterns
r'\\d'      # Digit
r'\\w'      # Word character
r'\\s'      # Whitespace
r'.'       # Any character
r'*'       # 0 or more
r'+'       # 1 or more
r'?'       # 0 or 1
r'{3}'     # Exactly 3
r'{2,5}'   # 2 to 5
r'[a-z]'   # Character class
r'^'       # Start of string
r'$'       # End of string</code></pre>
    </div>

    <h2>💡 Best Practices</h2>
    
    <div class="explanation-list">
      <ul>
        <li><strong>Use list comprehensions:</strong> More Pythonic and often faster than loops</li>
        <li><strong>Context managers:</strong> Always use 'with' for file operations</li>
        <li><strong>F-strings:</strong> Preferred for string formatting (Python 3.6+)</li>
        <li><strong>Type hints:</strong> Use type annotations for better code documentation</li>
        <li><strong>Virtual environments:</strong> Always use venv or virtualenv for projects</li>
        <li><strong>Exception handling:</strong> Use specific exceptions, avoid bare except</li>
        <li><strong>PEP 8:</strong> Follow Python style guide for consistent code</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Master Python string manipulation methods",
    "Understand list, dict, and set operations",
    "Learn Flask and Django backend methods",
    "Work with files, dates, and regular expressions",
    "Apply Python best practices",
  ],
  practiceInstructions: [
    "Practice string methods on various text inputs",
    "Manipulate lists using different methods and comprehensions",
    "Create and modify dictionaries with various operations",
    "Implement Flask routes using request and response methods",
    "Use Django ORM for database queries",
  ],
  hints: [
    "String methods don't modify the original string (strings are immutable)",
    "List methods like append() and sort() modify the list in place",
    "Use get() for dictionaries to avoid KeyError",
    "Flask's jsonify() automatically sets content-type header",
    "Django ORM methods are chainable for complex queries",
  ],
  solution: `# String manipulation
text = "hello world"
print(text.upper())  # "HELLO WORLD"
print(text.title())  # "Hello World"
print(text.split())  # ["hello", "world"]

# List operations
nums = [1, 2, 3]
nums.append(4)
squares = [x**2 for x in nums]

# Dictionary operations
user = {"name": "Alice", "age": 30}
user.update({"email": "alice@example.com"})

# Flask route
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.json
    return jsonify({"message": "User created"}), 201

# Django ORM
users = User.objects.filter(age__gte=18).order_by('-created_at')[:10]`,
};
