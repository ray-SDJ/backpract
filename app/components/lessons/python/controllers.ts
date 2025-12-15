import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Flask Controllers & Blueprints",
  difficulty: "Intermediate",
  description:
    "Learn how to organize Flask applications using controllers, blueprints, and the MVC pattern for clean, maintainable code.",
  objectives: [
    "Understand Flask controllers and view functions",
    "Organize code with Flask blueprints",
    "Implement class-based views for better structure",
    "Handle CRUD operations with proper error handling",
    "Apply the service layer pattern",
  ],
  content: `
    <h1>Controllers in Flask</h1>
    <p>Flask uses blueprints and view functions to organize application logic. Controllers (view functions) handle HTTP requests, process data, and return responses. Blueprints allow you to organize related controllers into modules.</p>

    <h2>Why Use Controllers?</h2>
    <ul>
      <li><strong>Organization:</strong> Group related endpoints together</li>
      <li><strong>Reusability:</strong> Blueprints can be reused across projects</li>
      <li><strong>Separation of Concerns:</strong> Keep routing logic separate from business logic</li>
      <li><strong>Scalability:</strong> Break large applications into manageable modules</li>
    </ul>

    <h2>Basic Controller (View Function)</h2>
    <p>In Flask, controllers are functions that handle HTTP requests. Let's create CRUD operations step by step:</p>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h4 class="font-semibold text-blue-900 mb-2">💡 Flask Controller Basics</h4>
      <p class="text-sm text-blue-800">Flask controllers are plain Python functions that return responses. They use <code>jsonify()</code> to convert Python dictionaries to JSON format. The second value in the return tuple is the HTTP status code.</p>
    </div>

    <pre><code># controllers/user_controller.py
# Import Flask utilities and database models
from flask import jsonify, request
from models import User, db

def get_all_users():
    """GET all users from database"""
    try:
        # Query all users from the User table
        users = User.query.all()
        
        # Convert each user object to dictionary using to_dict() method
        # List comprehension: [expression for item in list]
        # Return as JSON with 200 OK status
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        # If anything fails, return error message with 500 status
        return jsonify({'error': str(e)}), 500

def get_user_by_id(user_id):
    """GET a single user by their ID"""
    try:
        # User.query.get(id) finds user by primary key
        # Returns None if user doesn't exist
        user = User.query.get(user_id)
        
        # Check if user was found
        if not user:
            # Return 404 Not Found with error message
            return jsonify({'error': 'User not found'}), 404
        
        # Convert user to dictionary and return as JSON
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def create_user():
    """POST - Create a new user"""
    try:
        # request.get_json() extracts JSON data from the request body
        data = request.get_json()
        
        # Create new User instance with data from request
        # data.get('key') safely retrieves value or returns None
        user = User(
            name=data.get('name'),
            email=data.get('email')
        )
        
        # Add new user to the database session (staging area)
        db.session.add(user)
        
        # Commit actually saves the changes to the database
        db.session.commit()
        
        # Return new user with 201 Created status
        return jsonify(user.to_dict()), 201
    except Exception as e:
        # If anything fails, undo database changes
        db.session.rollback()
        
        # Return error with 400 Bad Request (client error)
        return jsonify({'error': str(e)}), 400

def update_user(user_id):
    """PUT - Update an existing user"""
    try:
        # First, find the user to update
        user = User.query.get(user_id)
        
        # Check if user exists
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get new data from request
        data = request.get_json()
        
        # Update user fields
        # data.get('name', user.name) means: use new name if provided, 
        # otherwise keep the current user.name
        user.name = data.get('name', user.name)
        user.email = data.get('email', user.email)
        
        # Save changes to database
        db.session.commit()
        
        # Return updated user
        return jsonify(user.to_dict()), 200
    except Exception as e:
        # Rollback on error
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

def delete_user(user_id):
    """DELETE - Remove a user from database"""
    try:
        # Find the user to delete
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Mark user for deletion
        db.session.delete(user)
        
        # Save changes (actually delete from database)
        db.session.commit()
        
        # Return success message
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        # Rollback if deletion fails
        db.session.rollback()
        return jsonify({'error': str(e)}), 500</code></pre>

    <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <h4 class="font-semibold text-green-900 mb-2">🔑 Key Python/Flask Concepts</h4>
      <ul class="text-sm text-green-800 space-y-1 ml-4">
        <li>• <strong>jsonify():</strong> Converts Python dict to JSON response</li>
        <li>• <strong>request.get_json():</strong> Extracts JSON data from request body</li>
        <li>• <strong>db.session.add():</strong> Stages a new record for insertion</li>
        <li>• <strong>db.session.commit():</strong> Saves all changes to database</li>
        <li>• <strong>db.session.rollback():</strong> Undoes changes if error occurs</li>
        <li>• <strong>Return tuple:</strong> (data, status_code) - e.g., (json, 200)</li>
      </ul>
    </div>

    <h2>Using Flask Blueprints</h2>
    <p>Blueprints are Flask's way of organizing routes and controllers into reusable modules. Think of them as mini-applications:</p>
    
    <pre><code># blueprints/user_blueprint.py
from flask import Blueprint, request
# Import our controller functions
from controllers.user_controller import (
    get_all_users,
    get_user_by_id,
    create_user,
    update_user,
    delete_user
)

user_bp = Blueprint('users', __name__, url_prefix='/api/users')

# Register routes
user_bp.route('/', methods=['GET'])(get_all_users)
user_bp.route('/&lt;int:user_id&gt;', methods=['GET'])(get_user_by_id)
user_bp.route('/', methods=['POST'])(create_user)
user_bp.route('/&lt;int:user_id&gt;', methods=['PUT'])(update_user)
user_bp.route('/&lt;int:user_id&gt;', methods=['DELETE'])(delete_user)

# Register blueprint in app
# app.py
from flask import Flask
from blueprints.user_blueprint import user_bp

app = Flask(__name__)
app.register_blueprint(user_bp)</code></pre>

    <h2>Class-Based Controllers</h2>
    <p>Flask supports class-based views for more structure:</p>
    <pre><code># controllers/product_controller.py
from flask import jsonify, request
from flask.views import MethodView
from models import Product, db

class ProductController(MethodView):
    """Class-based controller for products"""
    
    def get(self, product_id=None):
        """Handle GET requests"""
        if product_id is None:
            # Get all products
            try:
                page = request.args.get('page', 1, type=int)
                per_page = request.args.get('per_page', 10, type=int)
                
                products = Product.query.paginate(
                    page=page,
                    per_page=per_page,
                    error_out=False
                )
                
                return jsonify({
                    'products': [p.to_dict() for p in products.items],
                    'total': products.total,
                    'pages': products.pages,
                    'current_page': page
                }), 200
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        else:
            # Get single product
            try:
                product = Product.query.get(product_id)
                if not product:
                    return jsonify({'error': 'Product not found'}), 404
                return jsonify(product.to_dict()), 200
            except Exception as e:
                return jsonify({'error': str(e)}), 500
    
    def post(self):
        """Handle POST requests (create)"""
        try:
            data = request.get_json()
            product = Product(
                name=data.get('name'),
                price=data.get('price'),
                description=data.get('description')
            )
            db.session.add(product)
            db.session.commit()
            return jsonify(product.to_dict()), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400
    
    def put(self, product_id):
        """Handle PUT requests (update)"""
        try:
            product = Product.query.get(product_id)
            if not product:
                return jsonify({'error': 'Product not found'}), 404
            
            data = request.get_json()
            product.name = data.get('name', product.name)
            product.price = data.get('price', product.price)
            product.description = data.get('description', product.description)
            
            db.session.commit()
            return jsonify(product.to_dict()), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 400
    
    def delete(self, product_id):
        """Handle DELETE requests"""
        try:
            product = Product.query.get(product_id)
            if not product:
                return jsonify({'error': 'Product not found'}), 404
            
            db.session.delete(product)
            db.session.commit()
            return jsonify({'message': 'Product deleted successfully'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

# Register class-based view
# blueprints/product_blueprint.py
from flask import Blueprint
from controllers.product_controller import ProductController

product_bp = Blueprint('products', __name__, url_prefix='/api/products')

# Register routes
product_view = ProductController.as_view('product_api')
product_bp.add_url_rule('/', view_func=product_view, methods=['GET', 'POST'])
product_bp.add_url_rule('/&lt;int:product_id&gt;', view_func=product_view, 
                        methods=['GET', 'PUT', 'DELETE'])</code></pre>

    <h2>Controller with Authentication</h2>
    <pre><code># controllers/auth_controller.py
from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from models import User, db
import jwt
import datetime
from config import SECRET_KEY

def register():
    """Register new user"""
    try:
        data = request.get_json()
        
        # Check if user exists
        if User.query.filter_by(email=data.get('email')).first():
            return jsonify({'error': 'User already exists'}), 400
        
        # Create user
        hashed_password = generate_password_hash(data.get('password'))
        user = User(
            name=data.get('name'),
            email=data.get('email'),
            password=hashed_password
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Generate token
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }, SECRET_KEY, algorithm='HS256')
        
        return jsonify({
            'user': user.to_dict(),
            'token': token
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

def login():
    """Login user"""
    try:
        data = request.get_json()
        
        # Find user
        user = User.query.filter_by(email=data.get('email')).first()
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Check password
        if not check_password_hash(user.password, data.get('password')):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Generate token
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }, SECRET_KEY, algorithm='HS256')
        
        return jsonify({
            'user': user.to_dict(),
            'token': token
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_current_user(user_id):
    """Get current user info"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500</code></pre>

    <h2>Best Practices</h2>
    <ul>
      <li><strong>Use Blueprints:</strong> Organize related routes into blueprints</li>
      <li><strong>Error Handling:</strong> Always use try-except blocks and return proper status codes</li>
      <li><strong>Validation:</strong> Validate input data before processing (use Flask-Marshmallow or similar)</li>
      <li><strong>Consistent Responses:</strong> Use consistent JSON response format</li>
      <li><strong>RESTful Design:</strong> Follow REST conventions for endpoint naming and HTTP methods</li>
      <li><strong>Separate Business Logic:</strong> Move complex logic to service classes</li>
    </ul>

    <h2>Service Layer Pattern</h2>
    <pre><code># services/user_service.py
from models import User, db

class UserService:
    """Business logic for user operations"""
    
    @staticmethod
    def create_user(data):
        user = User(**data)
        db.session.add(user)
        db.session.commit()
        return user
    
    @staticmethod
    def get_user(user_id):
        return User.query.get(user_id)
    
    @staticmethod
    def update_user(user_id, data):
        user = User.query.get(user_id)
        if user:
            for key, value in data.items():
                setattr(user, key, value)
            db.session.commit()
        return user

# controllers/user_controller.py
from services.user_service import UserService

def create_user():
    try:
        data = request.get_json()
        user = UserService.create_user(data)
        return jsonify(user.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400</code></pre>
  `,
  practiceInstructions: [
    "Create a Flask blueprint with at least 3 routes",
    "Implement controller functions with proper error handling",
    "Use try-except blocks for database operations",
    "Return appropriate HTTP status codes (200, 201, 404, 500)",
    "Include request data validation",
  ],
  hints: [
    "Always wrap database operations in try-except blocks",
    "Use jsonify() to return JSON responses",
    "Remember to db.session.rollback() on errors",
    "Check if resources exist before operations",
  ],
  starterCode: `# Create a Flask controller for products
from flask import jsonify, request
from models import Product, db

# TODO: Implement get_all_products function
def get_all_products():
    # Your code here
    pass

# TODO: Implement create_product function
def create_product():
    # Your code here
    pass

# TODO: Implement get_product_by_id function
def get_product_by_id(product_id):
    # Your code here
    pass`,
  solution: `# Complete Flask controller for products
from flask import jsonify, request
from models import Product, db

def get_all_products():
    """Get all products"""
    try:
        products = Product.query.all()
        return jsonify([product.to_dict() for product in products]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_product_by_id(product_id):
    """Get product by ID"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        return jsonify(product.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def create_product():
    """Create new product"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name') or not data.get('price'):
            return jsonify({'error': 'Name and price are required'}), 400
        
        product = Product(
            name=data.get('name'),
            price=data.get('price'),
            description=data.get('description', '')
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify(product.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

def update_product(product_id):
    """Update product"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        data = request.get_json()
        product.name = data.get('name', product.name)
        product.price = data.get('price', product.price)
        product.description = data.get('description', product.description)
        
        db.session.commit()
        return jsonify(product.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

def delete_product(product_id):
    """Delete product"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500`,
};

export default lessonData;
