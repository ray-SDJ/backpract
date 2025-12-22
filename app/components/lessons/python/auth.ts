import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Flask JWT Authentication & Security",
  description:
    "Implement secure JWT-based authentication in Flask with password hashing, token management, and protected routes.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>Learn how to implement a complete authentication system in Flask using JWT tokens, secure password hashing, and authorization middleware.</p>

    <h2>Installing Required Packages</h2>
    
    <p>First, install the necessary authentication packages:</p>

    <pre class="code-block">
      <code>
# Install authentication dependencies
pip install Flask-JWT-Extended
pip install werkzeug
pip install PyJWT
pip install bcrypt

# Or add to requirements.txt
Flask==3.0.0
Flask-JWT-Extended==4.5.3
PyJWT==2.8.0
bcrypt==4.1.2
werkzeug==3.0.1
      </code>
    </pre>

    <h2>User Model with Password Hashing</h2>
    
    <p>Create a User model with secure password handling:</p>

    <pre class="code-block">
      <code>
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    def set_password(self, password):
        """Hash and set user password"""
        self.password_hash = generate_password_hash(
            password, 
            method='pbkdf2:sha256',
            salt_length=16
        )
    
    def check_password(self, password):
        """Verify password against hash"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user to dictionary (excluding password)"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
    
    def __repr__(self):
        return f'&lt;User {self.username}&gt;'
      </code>
    </pre>

    <h2>Flask-JWT-Extended Configuration</h2>
    
    <p>Configure JWT authentication in your Flask app:</p>

    <pre class="code-block">
      <code>
from flask import Flask
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os

app = Flask(__name__)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']
app.config['JWT_COOKIE_SECURE'] = True  # Set to True in production with HTTPS
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['JWT_COOKIE_SAMESITE'] = 'Lax'

# Initialize JWT Manager
jwt = JWTManager(app)

# JWT Error Handlers
@jwt.unauthorized_loader
def unauthorized_callback(callback):
    return {
        'error': 'Missing Authorization Header',
        'message': 'Request does not contain an access token'
    }, 401

@jwt.invalid_token_loader
def invalid_token_callback(callback):
    return {
        'error': 'Invalid Token',
        'message': 'Signature verification failed'
    }, 401

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return {
        'error': 'Token Expired',
        'message': 'The token has expired'
    }, 401

@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    return {
        'error': 'Token Revoked',
        'message': 'The token has been revoked'
    }, 401

# Additional claims
@jwt.additional_claims_loader
def add_claims_to_jwt(identity):
    user = User.query.get(identity)
    return {
        'role': user.role,
        'email': user.email,
        'username': user.username
    }
      </code>
    </pre>

    <h2>User Registration Endpoint</h2>
    
    <p>Create a secure user registration endpoint:</p>

    <pre class="code-block">
      <code>
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
import re

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def validate_password(password):
    """Validate password strength"""
    if len(password) &lt; 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one digit"
    return True, "Password is valid"

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        username = data['username'].strip()
        email = data['email'].strip().lower()
        password = data['password']
        
        # Validate email format
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password strength
        is_valid, message = validate_password(password)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Check if username already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 409
        
        # Check if email already exists
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 409
        
        # Create new user
        user = User(username=username, email=email)
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500
      </code>
    </pre>

    <h2>Login Endpoint with JWT</h2>
    
    <p>Implement user login with JWT token generation:</p>

    <pre class="code-block">
      <code>
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from datetime import datetime

@auth_bp.route('/login', methods=['POST'])
def login():
    """Authenticate user and return JWT tokens"""
    try:
        data = request.get_json()
        
        # Validate credentials
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password required'}), 400
        
        email = data['email'].strip().lower()
        password = data['password']
        
        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        # Verify user exists and password is correct
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Check if user is active
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 403
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Create JWT tokens
        access_token = create_access_token(
            identity=user.id,
            additional_claims={'role': user.role, 'username': user.username}
        )
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token using refresh token"""
    try:
        identity = get_jwt_identity()
        
        # Verify user still exists and is active
        user = User.query.get(identity)
        if not user or not user.is_active:
            return jsonify({'error': 'Invalid user'}), 401
        
        # Create new access token
        access_token = create_access_token(
            identity=identity,
            additional_claims={'role': user.role, 'username': user.username}
        )
        
        return jsonify({
            'access_token': access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Token refresh failed', 'details': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user (client should delete tokens)"""
    # In a production app, you might want to blacklist the token
    return jsonify({'message': 'Logout successful'}), 200
      </code>
    </pre>

    <h2>Protected Routes</h2>
    
    <p>Use JWT decorators to protect your API endpoints:</p>

    <pre class="code-block">
      <code>
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from functools import wraps

# Get current user profile
@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'user': user.to_dict()
    }), 200

# Update user profile
@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update current user profile"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    # Update allowed fields
    if 'username' in data:
        username = data['username'].strip()
        if User.query.filter(User.username == username, User.id != user_id).first():
            return jsonify({'error': 'Username already taken'}), 409
        user.username = username
    
    if 'email' in data:
        email = data['email'].strip().lower()
        if User.query.filter(User.email == email, User.id != user_id).first():
            return jsonify({'error': 'Email already registered'}), 409
        user.email = email
    
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'user': user.to_dict()
    }), 200

# Change password
@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    # Validate required fields
    if not all(k in data for k in ['current_password', 'new_password']):
        return jsonify({'error': 'Current and new password required'}), 400
    
    # Verify current password
    if not user.check_password(data['current_password']):
        return jsonify({'error': 'Current password is incorrect'}), 401
    
    # Validate new password
    is_valid, message = validate_password(data['new_password'])
    if not is_valid:
        return jsonify({'error': message}), 400
    
    # Update password
    user.set_password(data['new_password'])
    db.session.commit()
    
    return jsonify({'message': 'Password changed successfully'}), 200
      </code>
    </pre>

    <h2>Role-Based Authorization</h2>
    
    <p>Implement role-based access control:</p>

    <pre class="code-block">
      <code>
from functools import wraps
from flask import jsonify

def role_required(*allowed_roles):
    """Decorator to check user role"""
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            user_role = claims.get('role', 'user')
            
            if user_role not in allowed_roles:
                return jsonify({
                    'error': 'Insufficient permissions',
                    'message': f'This endpoint requires one of: {", ".join(allowed_roles)}'
                }), 403
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator

# Admin-only endpoint
@auth_bp.route('/admin/users', methods=['GET'])
@role_required('admin')
def get_all_users():
    """Get all users (admin only)"""
    users = User.query.all()
    return jsonify({
        'users': [user.to_dict() for user in users]
    }), 200

# Admin or moderator endpoint
@auth_bp.route('/admin/users/&lt;int:user_id&gt;/deactivate', methods=['POST'])
@role_required('admin', 'moderator')
def deactivate_user(user_id):
    """Deactivate a user (admin/moderator only)"""
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    user.is_active = False
    db.session.commit()
    
    return jsonify({
        'message': 'User deactivated successfully',
        'user': user.to_dict()
    }), 200
      </code>
    </pre>

    <h2>Token Blacklisting (Optional)</h2>
    
    <p>Implement token blacklisting for logout functionality:</p>

    <pre class="code-block">
      <code>
from datetime import datetime

# Simple in-memory blacklist (use Redis in production)
token_blacklist = set()

class TokenBlacklist(db.Model):
    __tablename__ = 'token_blacklist'
    
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, unique=True, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    @staticmethod
    def is_token_revoked(jwt_payload):
        jti = jwt_payload['jti']
        return TokenBlacklist.query.filter_by(jti=jti).first() is not None
    
    @staticmethod
    def revoke_token(jti):
        blacklisted_token = TokenBlacklist(jti=jti)
        db.session.add(blacklisted_token)
        db.session.commit()

# Configure JWT to check blacklist
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    return TokenBlacklist.is_token_revoked(jwt_payload)

# Updated logout endpoint
@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout_with_blacklist():
    """Logout user and blacklist token"""
    jti = get_jwt()['jti']
    TokenBlacklist.revoke_token(jti)
    return jsonify({'message': 'Successfully logged out'}), 200
      </code>
    </pre>

    <h2>Security Best Practices</h2>
    
    <div class="explanation-list">
      <ul>
        <li><strong>Environment Variables:</strong> Store JWT_SECRET_KEY in environment variables, never in code</li>
        <li><strong>HTTPS Only:</strong> Always use HTTPS in production for secure token transmission</li>
        <li><strong>Password Hashing:</strong> Use werkzeug's pbkdf2:sha256 or bcrypt for password hashing</li>
        <li><strong>Token Expiration:</strong> Set reasonable expiration times (1 hour for access, 30 days for refresh)</li>
        <li><strong>Input Validation:</strong> Always validate and sanitize user input</li>
        <li><strong>Rate Limiting:</strong> Implement rate limiting on auth endpoints to prevent brute force</li>
        <li><strong>CSRF Protection:</strong> Enable CSRF protection when using cookies</li>
        <li><strong>Token Blacklisting:</strong> Use Redis for production token blacklisting</li>
      </ul>
    </div>

    <h2>Testing Authentication</h2>
    
    <p>Test your authentication endpoints:</p>

    <pre class="code-block">
      <code>
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'

# Access protected route
curl -X GET http://localhost:5000/api/auth/profile \\
  -H "Authorization: Bearer &lt;your-access-token&gt;"

# Refresh token
curl -X POST http://localhost:5000/api/auth/refresh \\
  -H "Authorization: Bearer &lt;your-refresh-token&gt;"
      </code>
    </pre>
  </div>`,
  objectives: [
    "Implement JWT-based authentication in Flask",
    "Create secure user registration and login endpoints",
    "Use password hashing with werkzeug security",
    "Protect routes with JWT decorators",
    "Implement role-based authorization",
  ],
  practiceInstructions: [
    "Install Flask-JWT-Extended and configure JWT settings",
    "Create User model with password hashing methods",
    "Implement registration endpoint with password validation",
    "Create login endpoint that generates JWT tokens",
    "Add protected routes using @jwt_required decorator",
    "Implement role-based access control decorator",
  ],
  hints: [
    "Use environment variables for JWT_SECRET_KEY",
    "Always hash passwords before storing in database",
    "Include user role in JWT additional claims",
    "Implement token refresh mechanism for better UX",
    "Use token blacklisting with Redis in production",
  ],
  solution: `# Protected route with role-based authorization
from flask_jwt_extended import jwt_required, get_jwt

@app.route('/api/admin/dashboard')
@jwt_required()
def admin_dashboard():
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return {'error': 'Admin access required'}, 403
    
    return {'message': 'Welcome to admin dashboard'}, 200`,
};
