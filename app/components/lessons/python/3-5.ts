import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Flask Blueprints",
  description:
    "Learn how to organize Flask applications using blueprints for better code structure and modularity.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <p>In this lesson, you'll learn how to organize Flask applications using blueprints, which allow you to structure your code into smaller, reusable modules for better organization and maintainability.</p>

    <h2>What are Flask Blueprints?</h2>
    
    <p>Blueprints are a way to organize your Flask application into smaller, reusable modules. They help you:</p>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🏗️ Blueprint Benefits</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Structure large applications:</strong> Break monolithic apps into manageable pieces</li>
        <li><strong>Reuse functionality:</strong> Share modules across different projects</li>
        <li><strong>Separate concerns:</strong> Authentication, API, admin panels as separate modules</li>
        <li><strong>Enable team collaboration:</strong> Different developers work on different blueprints</li>
      </ul>
    </div>

    <h2>Creating Your First Blueprint</h2>
    
    <p>Let's create an authentication blueprint to handle user registration and login:</p>

    <pre class="code-block">
      <code>
# auth/routes.py
from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from models import User, db

# Create blueprint with URL prefix
auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    # Validate input
    if not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Username and password required'}), 400
    
    # Check if user exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 409
    
    # Create new user
    user = User(
        username=data['username'],
        email=data['email'],
        password=generate_password_hash(data['password'])
    )
    
    try:
        db.session.add(user)
        db.session.commit()
        return jsonify({
            'message': 'User registered successfully',
            'user_id': user.id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Authenticate user login"""
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password, data['password']):
        session['user_id'] = user.id
        session['username'] = user.username
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict()
        })
    
    return jsonify({'error': 'Invalid credentials'}), 401
      </code>
    </pre>

    <h2>Registering Blueprints</h2>
    
    <p>Register blueprints with your Flask application using the application factory pattern:</p>

    <pre class="code-block">
      <code>
# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config

db = SQLAlchemy()

def create_app(config_class=Config):
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    
    # Import and register blueprints
    from app.auth.routes import auth_bp
    from app.api.routes import api_bp
    from app.admin.routes import admin_bp
    
    # Register blueprints with the app
    app.register_blueprint(auth_bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(admin_bp)
    
    return app
      </code>
    </pre>

    <h2>Blueprint Directory Structure</h2>
    
    <p>Organize your application with this recommended structure:</p>

    <pre class="code-block">
      <code>
app/
├── __init__.py              # Application factory
├── models.py                # Database models
├── config.py                # Configuration
├── auth/                    # Authentication blueprint
│   ├── __init__.py
│   ├── routes.py           # Auth routes
│   └── decorators.py       # Auth decorators
├── api/                     # API blueprint
│   ├── __init__.py
│   ├── routes.py           # API routes
│   └── serializers.py      # Data serialization
├── admin/                   # Admin blueprint
│   ├── __init__.py
│   ├── routes.py           # Admin routes
│   └── utils.py            # Admin utilities
└── templates/               # Template files
    ├── auth/
    ├── admin/
    └── base.html
      </code>
    </pre>

    <h2>API Blueprint Example</h2>
    
    <p>Create a dedicated API blueprint for RESTful endpoints:</p>

    <pre class="code-block">
      <code>
# api/routes.py
from flask import Blueprint, request, jsonify
from app.models import User, Post, db

api_bp = Blueprint('api', __name__, url_prefix='/api/v1')

@api_bp.route('/users', methods=['GET'])
def get_users():
    """Get all users with pagination"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    users = User.query.paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'users': [user.to_dict() for user in users.items],
        'total': users.total,
        'pages': users.pages,
        'current_page': page
    })

@api_bp.route('/posts', methods=['POST'])
def create_post():
    """Create new post"""
    data = request.get_json()
    
    post = Post(
        title=data['title'],
        content=data['content'],
        user_id=data['user_id']
    )
    
    try:
        db.session.add(post)
        db.session.commit()
        return jsonify({
            'message': 'Post created successfully',
            'post': post.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Post creation failed'}), 500

# Blueprint-specific error handlers
@api_bp.errorhandler(404)
def api_not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@api_bp.errorhandler(500)
def api_internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500
      </code>
    </pre>

    <div class="explanation-box bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-yellow-900 mb-3">🎯 Blueprint Best Practices</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Use meaningful prefixes:</strong> /api/v1, /admin, /auth for clear organization</li>
        <li><strong>Keep blueprints focused:</strong> Each blueprint should handle one area of functionality</li>
        <li><strong>Use blueprint-specific error handlers:</strong> Handle errors appropriately for each context</li>
        <li><strong>Organize by feature:</strong> Group related routes, models, and templates together</li>
      </ul>
    </div>

    <div class="quick-test bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-2">💡 Quick Test</h4>
      <p class="text-sm text-green-800">
        Create a blog application with separate blueprints for authentication, blog posts, and admin functionality. 
        Implement proper URL prefixes, error handling, and organize templates by blueprint.
      </p>
    </div>
  </div>`,
  objectives: [
    "Understand the purpose and benefits of Flask blueprints",
    "Create and organize blueprints for different application modules",
    "Register blueprints with the main Flask application",
    "Implement blueprint-specific error handlers and templates",
    "Apply best practices for large Flask application organization",
  ],
  practiceInstructions: [
    "Create separate blueprints for authentication, API, and admin functionality",
    "Organize your project files using the recommended blueprint structure",
    "Implement the application factory pattern with blueprint registration",
    "Add blueprint-specific error handlers for different contexts",
    "Build a complete modular application using multiple blueprints",
    "Test URL generation and routing between different blueprints",
  ],
  hints: [
    "Use url_prefix parameter to organize routes under specific paths",
    "Import blueprints only where you register them to avoid circular imports",
    "Each blueprint can have its own templates and static folders",
    "Use blueprint-specific decorators for common functionality",
    "Plan your blueprint structure before starting development",
    "Keep related functionality grouped together in each blueprint",
  ],
  solution: `# auth/routes.py
from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User, db

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username exists'}), 409
    
    user = User(
        username=data['username'],
        email=data['email'],
        password=generate_password_hash(data['password'])
    )
    
    try:
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User registered'}), 201
    except Exception:
        db.session.rollback()
        return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password, data['password']):
        session['user_id'] = user.id
        return jsonify({'message': 'Login successful'})
    
    return jsonify({'error': 'Invalid credentials'}), 401

# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'your-secret-key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    
    db.init_app(app)
    
    from app.auth.routes import auth_bp
    app.register_blueprint(auth_bp)
    
    return app`,
};
