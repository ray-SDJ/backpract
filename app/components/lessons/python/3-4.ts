import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Flask Database Integration",
  description:
    "Learn how to integrate databases with Flask using SQLAlchemy ORM for data persistence.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>In this lesson, you'll learn how to integrate databases with Flask using SQLAlchemy, a powerful ORM that lets you work with databases using Python objects.</p>

    <h2>Setting Up SQLAlchemy</h2>
    
    <p>First, install and configure Flask-SQLAlchemy:</p>

    <pre class="code-block">
      <code>
pip install flask-sqlalchemy
      </code>
    </pre>

    <pre class="code-block">
      <code>
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL', 
    'sqlite:///app.db'  # Default: SQLite file
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db = SQLAlchemy(app)
      </code>
    </pre>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">💡 Database Configuration</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>SQLALCHEMY_DATABASE_URI:</strong> Connection string for your database</li>
        <li><strong>sqlite:///app.db:</strong> Creates a local SQLite file for development</li>
        <li><strong>SQLALCHEMY_TRACK_MODIFICATIONS:</strong> Set to False to save memory</li>
        <li><strong>db.SQLAlchemy(app):</strong> Initialize SQLAlchemy with Flask app</li>
      </ul>
    </div>

    <h2>Defining Models</h2>
    
    <p>Models are Python classes that represent database tables:</p>

    <pre class="code-block">
      <code>
class User(db.Model):
    """User model - represents users table"""
    
    # Columns
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    posts = db.relationship('Post', backref='author', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'&lt;User {self.username}&gt;'
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active
        }

class Post(db.Model):
    """Post model - represents posts table"""
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign key
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    def __repr__(self):
        return f'&lt;Post {self.title}&gt;'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'created_at': self.created_at.isoformat(),
            'author': self.author.username
        }
      </code>
    </pre>

    <h2>Database Operations (CRUD)</h2>
    
    <p>Create, Read, Update, and Delete operations with SQLAlchemy:</p>

    <pre class="code-block">
      <code>
# CREATE - Adding new records
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    
    # Create new user instance
    user = User(
        username=data['username'],
        email=data['email'],
        password=generate_password_hash(data['password'])
    )
    
    try:
        # Add to session and commit to database
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User created successfully',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Username or email already exists'}), 400

# READ - Querying records
@app.route('/api/users', methods=['GET'])
def get_users():
    # Get all users
    users = User.query.all()
    
    # With filtering
    active_users = User.query.filter_by(is_active=True).all()
    
    # With pagination
    page = request.args.get('page', 1, type=int)
    users_paginated = User.query.paginate(
        page=page, per_page=10, error_out=False
    )
    
    return jsonify({
        'users': [user.to_dict() for user in users_paginated.items],
        'total': users_paginated.total,
        'pages': users_paginated.pages,
        'current_page': page
    })

# UPDATE - Modifying records
@app.route('/api/users/&lt;int:user_id&gt;', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    # Update fields
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'User updated successfully',
            'user': user.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Update failed'}), 400

# DELETE - Removing records
@app.route('/api/users/&lt;int:user_id&gt;', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Delete failed'}), 400
      </code>
    </pre>

    <h2>Database Migrations</h2>
    
    <p>Use Flask-Migrate to handle database schema changes:</p>

    <pre class="code-block">
      <code>
pip install flask-migrate

# migrations.py
from flask_migrate import Migrate

migrate = Migrate(app, db)

# Terminal commands:
# Initialize migrations
flask db init

# Create migration
flask db migrate -m "Add user and post tables"

# Apply migration
flask db upgrade
      </code>
    </pre>

    <div class="explanation-box bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-yellow-900 mb-3">⚠️ Database Best Practices</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Always use transactions:</strong> Wrap related operations in try/except with rollback</li>
        <li><strong>Use migrations:</strong> Never modify database schema directly in production</li>
        <li><strong>Index frequently queried columns:</strong> Add db.Index for performance</li>
        <li><strong>Validate before committing:</strong> Check constraints and business rules</li>
      </ul>
    </div>

    <div class="quick-test bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-2">💡 Quick Test</h4>
      <p class="text-sm text-green-800">
        Create a complete blog system with User and Post models. Implement all CRUD operations 
        and test the relationship between users and their posts. Add proper error handling for all database operations.
      </p>
    </div>
  </div>`,
  objectives: [
    "Understand SQLAlchemy ORM concepts and database integration",
    "Learn to define database models with relationships",
    "Master CRUD operations with proper error handling",
    "Implement database migrations for schema management",
    "Apply best practices for database operations in Flask",
  ],
  practiceInstructions: [
    "Set up a Flask application with SQLAlchemy database integration",
    "Create User and Post models with proper relationships",
    "Implement all CRUD operations with transaction handling",
    "Add database migrations using Flask-Migrate",
    "Test all operations with proper error handling",
    "Build a complete blog system with users and posts",
  ],
  hints: [
    "Use try/except blocks with db.session.rollback() for error handling",
    "Always validate input data before database operations",
    "Remember to use Flask-Migrate for schema changes",
    "Test relationships between models thoroughly",
    "Use pagination for large datasets",
    "Implement proper indexes for frequently queried columns",
  ],
  solution: `from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash
from datetime import datetime
import os

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL', 
    'sqlite:///blog.db'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    posts = db.relationship('Post', backref='author', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active
        }

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'created_at': self.created_at.isoformat(),
            'author': self.author.username
        }

# Routes
@app.route('/api/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        user = User(
            username=data['username'],
            email=data['email'],
            password=generate_password_hash(data['password'])
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User created', 'user': user.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'User creation failed'}), 400

@app.route('/api/users', methods=['GET'])
def get_users():
    page = request.args.get('page', 1, type=int)
    users = User.query.paginate(page=page, per_page=10, error_out=False)
    return jsonify({
        'users': [user.to_dict() for user in users.items],
        'total': users.total,
        'pages': users.pages
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)`,
};
