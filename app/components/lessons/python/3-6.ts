import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Flask Testing",
  description:
    "Learn how to write comprehensive tests for Flask applications using pytest and Flask's testing utilities.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <p>In this lesson, you'll learn how to write comprehensive tests for your Flask applications to ensure reliability, catch bugs early, and maintain code quality throughout development.</p>

    <h2>Setting Up Flask Testing</h2>
    
    <p>First, install the necessary testing dependencies:</p>

    <pre class="code-block">
      <code>
pip install pytest pytest-flask pytest-cov flask-testing
      </code>
    </pre>

    <p>Create a testing configuration and fixtures:</p>

    <pre class="code-block">
      <code>
# conftest.py - pytest configuration and fixtures
import pytest
from app import create_app, db
from app.models import User

@pytest.fixture
def app():
    """Create application for testing"""
    app = create_app('testing')  # Use testing configuration
    
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    """Create test client"""
    return app.test_client()

@pytest.fixture
def runner(app):
    """Create test CLI runner"""
    return app.test_cli_runner()
      </code>
    </pre>

    <h2>Testing Configuration</h2>
    
    <p>Set up a separate configuration for testing:</p>

    <pre class="code-block">
      <code>
# config.py
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # In-memory database
    WTF_CSRF_ENABLED = False  # Disable CSRF for testing
    LOGIN_DISABLED = False

# config_map for easy access
config = {
    'development': Config,
    'testing': TestingConfig,
    'production': Config  # Add production config as needed
}
      </code>
    </pre>

    <h2>Unit Testing Routes</h2>
    
    <p>Test your Flask routes and endpoints:</p>

    <pre class="code-block">
      <code>
# tests/test_auth.py
import pytest
from app.models import User

class TestAuthRoutes:
    """Test authentication routes"""
    
    def test_user_registration_success(self, client):
        """Test successful user registration"""
        response = client.post('/auth/register', json={
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'securepass123'
        })
        
        assert response.status_code == 201
        data = response.get_json()
        assert data['message'] == 'User registered successfully'
        assert 'user_id' in data
    
    def test_user_login_success(self, client):
        """Test successful login"""
        # Register user first
        client.post('/auth/register', json={
            'username': 'loginuser',
            'email': 'login@example.com',
            'password': 'loginpass123'
        })
        
        # Test login
        response = client.post('/auth/login', json={
            'username': 'loginuser',
            'password': 'loginpass123'
        })
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['message'] == 'Login successful'
    
    def test_user_login_invalid_credentials(self, client):
        """Test login with invalid credentials"""
        response = client.post('/auth/login', json={
            'username': 'nonexistent',
            'password': 'wrongpass'
        })
        
        assert response.status_code == 401
        data = response.get_json()
        assert 'Invalid credentials' in data['error']
      </code>
    </pre>

    <h2>Testing Database Models</h2>
    
    <p>Write unit tests for your database models:</p>

    <pre class="code-block">
      <code>
# tests/test_models.py
import pytest
from datetime import datetime
from app.models import User, Post

class TestUserModel:
    """Test User model functionality"""
    
    def test_user_creation(self, app):
        """Test creating a new user"""
        with app.app_context():
            user = User(
                username='testuser',
                email='test@example.com',
                password='hashed_password'
            )
            
            assert user.username == 'testuser'
            assert user.email == 'test@example.com'
            assert user.is_active is True  # Default value
            assert isinstance(user.created_at, datetime)
    
    def test_user_to_dict(self, app):
        """Test user serialization"""
        with app.app_context():
            user = User(
                username='serialuser',
                email='serial@example.com',
                password='hashed_password'
            )
            
            user_dict = user.to_dict()
            
            assert user_dict['username'] == 'serialuser'
            assert user_dict['email'] == 'serial@example.com'
            assert 'password' not in user_dict  # Password should be excluded
            assert 'created_at' in user_dict
      </code>
    </pre>

    <h2>API Testing</h2>
    
    <p>Test your API endpoints thoroughly:</p>

    <pre class="code-block">
      <code>
# tests/test_api.py
import pytest
from app.models import User, Post

class TestAPIEndpoints:
    """Test API endpoints"""
    
    def test_get_users_paginated(self, client):
        """Test paginated user listing"""
        # Create test users
        for i in range(5):
            client.post('/auth/register', json={
                'username': f'user{i}',
                'email': f'user{i}@example.com',
                'password': 'pass123'
            })
        
        # Test first page
        response = client.get('/api/v1/users?page=1&per_page=3')
        assert response.status_code == 200
        
        data = response.get_json()
        assert len(data['users']) == 3
        assert data['total'] == 5
    
    def test_create_post_authenticated(self, client):
        """Test creating post with authentication"""
        # Register and login user
        client.post('/auth/register', json={
            'username': 'author',
            'email': 'author@example.com',
            'password': 'authorpass'
        })
        
        login_response = client.post('/auth/login', json={
            'username': 'author',
            'password': 'authorpass'
        })
        
        # Create post
        response = client.post('/api/v1/posts', json={
            'title': 'API Test Post',
            'content': 'Content from API test'
        })
        
        assert response.status_code == 201
        data = response.get_json()
        assert data['message'] == 'Post created successfully'
    
    def test_api_error_handling(self, client):
        """Test API error responses"""
        # Test 404 for non-existent resource
        response = client.get('/api/v1/users/99999')
        assert response.status_code == 404
        
        data = response.get_json()
        assert 'not found' in data['error'].lower()
      </code>
    </pre>

    <h2>Testing with Coverage</h2>
    
    <p>Measure test coverage to ensure comprehensive testing:</p>

    <pre class="code-block">
      <code>
# pytest.ini
[tool:pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = 
    --cov=app
    --cov-report=html
    --cov-report=term-missing
    --cov-fail-under=80

# Run tests with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py -v

# Run with verbose output
pytest -v --tb=short
      </code>
    </pre>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🧪 Testing Best Practices</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Use fixtures:</strong> Set up reusable test data and configurations</li>
        <li><strong>Test edge cases:</strong> Invalid inputs, empty data, boundary conditions</li>
        <li><strong>Mock external services:</strong> Don't rely on external APIs in tests</li>
        <li><strong>Keep tests isolated:</strong> Each test should be independent</li>
      </ul>
    </div>

    <div class="quick-test bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-2">💡 Quick Test</h4>
      <p class="text-sm text-green-800">
        Create a comprehensive test suite for a blog application. Include tests for user authentication, 
        post creation/editing, API endpoints, and database models. Aim for at least 80% test coverage.
      </p>
    </div>
  </div>`,
  objectives: [
    "Set up Flask testing environment with pytest and fixtures",
    "Write unit tests for routes, models, and API endpoints",
    "Implement test coverage measurement and reporting",
    "Test authentication and authorization functionality",
    "Apply testing best practices for maintainable test suites",
  ],
  practiceInstructions: [
    "Install pytest, pytest-flask, and pytest-cov for testing",
    "Create conftest.py with app and client fixtures",
    "Write tests for all authentication routes (register, login, logout)",
    "Test database models and their methods",
    "Create API endpoint tests with different scenarios",
    "Measure and improve test coverage to at least 80%",
  ],
  hints: [
    "Use in-memory SQLite database for fast test execution",
    "Create separate test configuration to avoid affecting development data",
    "Use parametrized tests to test multiple input scenarios efficiently",
    "Mock external services and APIs to keep tests isolated",
    "Test both success and error cases for complete coverage",
    "Use descriptive test names that explain what is being tested",
  ],
  solution: `# conftest.py
import pytest
from app import create_app, db

@pytest.fixture
def app():
    app = create_app('testing')
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

# tests/test_auth.py
def test_user_registration(client):
    response = client.post('/auth/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'testpass123'
    })
    
    assert response.status_code == 201
    data = response.get_json()
    assert data['message'] == 'User registered successfully'

def test_user_login(client):
    # Register user first
    client.post('/auth/register', json={
        'username': 'logintest',
        'email': 'login@example.com',
        'password': 'loginpass'
    })
    
    # Test login
    response = client.post('/auth/login', json={
        'username': 'logintest',
        'password': 'loginpass'
    })
    
    assert response.status_code == 200
    assert 'Login successful' in response.get_json()['message']

# Run tests
# pytest --cov=app tests/`,
};
