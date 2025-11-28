import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Creating Database Models in Flask",
  description:
    "Master Flask-SQLAlchemy model creation with relationships, validations, and best practices for building robust database schemas.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <h1 class="text-3xl font-bold mb-6">Creating Database Models in Flask</h1>
    
    <p class="mb-4">Learn how to create comprehensive database models using Flask-SQLAlchemy with relationships, constraints, and methods.</p>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🏗️ Basic Model Structure</h2>
    
    <p class="mb-4">Every SQLAlchemy model is a Python class that inherits from <code>db.Model</code>:</p>

    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    """User model with authentication"""
    __tablename__ = 'users'  # Explicit table name
    
    # Primary Key
    id = db.Column(db.Integer, primary_key=True)
    
    # Basic Fields
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Profile Fields
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    bio = db.Column(db.Text)
    avatar_url = db.Column(db.String(255))
    
    # Status Fields
    is_active = db.Column(db.Boolean, default=True)
    is_admin = db.Column(db.Boolean, default=False)
    email_verified = db.Column(db.Boolean, default=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    def __repr__(self):
        return f'&lt;User {self.username}&gt;'
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verify password"""
        return check_password_hash(self.password_hash, password)
    
    @property
    def full_name(self):
        """Computed property for full name"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username
    
    def to_dict(self, include_email=False):
        """Convert to dictionary"""
        data = {
            'id': self.id,
            'username': self.username,
            'full_name': self.full_name,
            'bio': self.bio,
            'avatar_url': self.avatar_url,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        if include_email:
            data['email'] = self.email
        return data
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🔗 Model Relationships</h2>
    
    <p class="mb-4">SQLAlchemy supports one-to-many, many-to-one, and many-to-many relationships:</p>

    <h3 class="text-xl font-semibold mt-6 mb-3">One-to-Many Relationship</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
class Post(db.Model):
    """Blog post model"""
    __tablename__ = 'posts'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False, index=True)
    content = db.Column(db.Text, nullable=False)
    excerpt = db.Column(db.String(500))
    
    # Status
    published = db.Column(db.Boolean, default=False)
    view_count = db.Column(db.Integer, default=0)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = db.Column(db.DateTime)
    
    # Foreign Key - Many posts belong to one user
    author_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    # Relationship - Access author from post
    author = db.relationship('User', backref=db.backref('posts', lazy='dynamic', cascade='all, delete-orphan'))
    
    # Relationship with comments (one post has many comments)
    comments = db.relationship('Comment', backref='post', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'&lt;Post {self.title}&gt;'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'content': self.content,
            'excerpt': self.excerpt,
            'published': self.published,
            'view_count': self.view_count,
            'author': {
                'id': self.author.id,
                'username': self.author.username,
                'full_name': self.author.full_name
            },
            'created_at': self.created_at.isoformat(),
            'published_at': self.published_at.isoformat() if self.published_at else None
        }

class Comment(db.Model):
    """Comment model"""
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign Keys
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    # Relationships
    user = db.relationship('User', backref='comments')
    
    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'user': self.user.username,
            'created_at': self.created_at.isoformat()
        }
      </code>
    </pre>

    <h3 class="text-xl font-semibold mt-6 mb-3">Many-to-Many Relationship</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
# Association table for many-to-many relationship
post_tags = db.Table('post_tags',
    db.Column('post_id', db.Integer, db.ForeignKey('posts.id', ondelete='CASCADE'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id', ondelete='CASCADE'), primary_key=True),
    db.Column('created_at', db.DateTime, default=datetime.utcnow)
)

class Tag(db.Model):
    """Tag model for categorizing posts"""
    __tablename__ = 'tags'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    slug = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(200))
    
    # Many-to-many relationship with posts
    posts = db.relationship('Post', secondary=post_tags, 
                           backref=db.backref('tags', lazy='dynamic'))
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'post_count': len(self.posts)
        }

# Update Post model to include tags relationship
# Add this to the Post class:
# tags = db.relationship('Tag', secondary=post_tags, 
#                        backref=db.backref('tagged_posts', lazy='dynamic'))
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">📊 Advanced Model Features</h2>

    <h3 class="text-xl font-semibold mt-6 mb-3">Model with Validators</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
from sqlalchemy.orm import validates
import re

class Product(db.Model):
    """Product model with validation"""
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text)
    
    # Price fields (store in cents to avoid floating point issues)
    price_cents = db.Column(db.Integer, nullable=False)
    
    # Stock
    quantity = db.Column(db.Integer, default=0, nullable=False)
    
    # Category
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    category = db.relationship('Category', backref='products')
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    @validates('sku')
    def validate_sku(self, key, sku):
        """Validate SKU format"""
        if not re.match(r'^[A-Z0-9]{6,12}$', sku):
            raise ValueError('SKU must be 6-12 uppercase alphanumeric characters')
        return sku.upper()
    
    @validates('price_cents')
    def validate_price(self, key, price):
        """Validate price is positive"""
        if price < 0:
            raise ValueError('Price cannot be negative')
        return price
    
    @validates('quantity')
    def validate_quantity(self, key, quantity):
        """Validate quantity is non-negative"""
        if quantity < 0:
            raise ValueError('Quantity cannot be negative')
        return quantity
    
    @property
    def price(self):
        """Get price in dollars"""
        return self.price_cents / 100
    
    @price.setter
    def price(self, value):
        """Set price from dollars"""
        self.price_cents = int(value * 100)
    
    @property
    def in_stock(self):
        """Check if product is in stock"""
        return self.quantity > 0
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'sku': self.sku,
            'description': self.description,
            'price': self.price,
            'quantity': self.quantity,
            'in_stock': self.in_stock,
            'category': self.category.name if self.category else None,
            'is_active': self.is_active
        }

class Category(db.Model):
    """Product category model"""
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    
    # Self-referential relationship for nested categories
    children = db.relationship('Category', backref=db.backref('parent', remote_side=[id]))
    
    def to_dict(self, include_products=False):
        data = {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'parent_id': self.parent_id
        }
        if include_products:
            data['products'] = [p.to_dict() for p in self.products]
        return data
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🔄 Creating and Migrating Models</h2>
    
    <p class="mb-4">Use Flask-Migrate to manage database schema changes:</p>

    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
# Install Flask-Migrate
pip install Flask-Migrate

# In your app.py
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:pass@localhost/dbname'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Initialize migrations
flask db init

# Create a migration after defining models
flask db migrate -m "Create users, posts, and comments tables"

# Apply migrations to database
flask db upgrade

# Rollback migration
flask db downgrade
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">💡 Best Practices</h2>
    
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-yellow-900 mb-3">✅ Model Best Practices</h4>
      <ul class="text-yellow-800 space-y-2">
        <li>• <strong>Use explicit table names:</strong> Set __tablename__ to avoid conflicts</li>
        <li>• <strong>Add indexes:</strong> Index frequently queried columns (username, email, slug)</li>
        <li>• <strong>Use cascade deletes:</strong> Maintain referential integrity with ondelete='CASCADE'</li>
        <li>• <strong>Add timestamps:</strong> Include created_at and updated_at for auditing</li>
        <li>• <strong>Validate data:</strong> Use @validates decorator for business logic</li>
        <li>• <strong>Add to_dict methods:</strong> Easy JSON serialization</li>
        <li>• <strong>Use lazy loading wisely:</strong> 'dynamic' for large collections, 'select' for small ones</li>
        <li>• <strong>Store money in cents:</strong> Avoid floating-point precision issues</li>
      </ul>
    </div>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🎯 Complete Example: E-commerce Models</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
# models.py - Complete e-commerce model structure

class Order(db.Model):
    """Order model"""
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(20), unique=True, nullable=False)
    
    # Customer info
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', backref='orders')
    
    # Order details
    total_cents = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, paid, shipped, delivered
    
    # Shipping
    shipping_address = db.Column(db.Text)
    tracking_number = db.Column(db.String(100))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    paid_at = db.Column(db.DateTime)
    shipped_at = db.Column(db.DateTime)
    delivered_at = db.Column(db.DateTime)
    
    # Order items (one-to-many)
    items = db.relationship('OrderItem', backref='order', lazy='dynamic', cascade='all, delete-orphan')
    
    @property
    def total(self):
        return self.total_cents / 100
    
    def calculate_total(self):
        """Calculate total from order items"""
        self.total_cents = sum(item.subtotal_cents for item in self.items)
    
    def to_dict(self):
        return {
            'id': self.id,
            'order_number': self.order_number,
            'customer': self.user.username,
            'total': self.total,
            'status': self.status,
            'items': [item.to_dict() for item in self.items],
            'created_at': self.created_at.isoformat()
        }

class OrderItem(db.Model):
    """Order item model"""
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    
    quantity = db.Column(db.Integer, nullable=False)
    price_cents = db.Column(db.Integer, nullable=False)  # Price at time of order
    
    product = db.relationship('Product')
    
    @property
    def subtotal_cents(self):
        return self.quantity * self.price_cents
    
    @property
    def subtotal(self):
        return self.subtotal_cents / 100
    
    def to_dict(self):
        return {
            'product': self.product.name,
            'quantity': self.quantity,
            'price': self.price_cents / 100,
            'subtotal': self.subtotal
        }
      </code>
    </pre>
  </div>`,
  objectives: [
    "Understand Flask-SQLAlchemy model structure and syntax",
    "Create models with proper field types and constraints",
    "Implement one-to-many and many-to-many relationships",
    "Add data validation using @validates decorator",
    "Use Flask-Migrate for database migrations",
    "Follow best practices for model design",
  ],
  practiceInstructions: [
    "Create a User model with username, email, and password fields",
    "Add a Post model with a foreign key relationship to User",
    "Implement a many-to-many relationship between Posts and Tags",
    "Add validation to ensure email format is correct",
    "Create migration files and apply them to your database",
    "Add to_dict() methods for JSON serialization",
  ],
  hints: [
    "Use db.Column() to define model fields with appropriate types",
    "Set unique=True and index=True for frequently queried fields",
    "Use db.relationship() for defining relationships between models",
    "The backref parameter creates a reverse relationship automatically",
    "Use cascade='all, delete-orphan' to maintain data integrity",
    "Store monetary values in cents to avoid floating-point issues",
  ],
  solution: `# Complete working example
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Association table
post_tags = db.Table('post_tags',
    db.Column('post_id', db.Integer, db.ForeignKey('posts.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    posts = db.relationship('Post', backref='author', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }

class Post(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    tags = db.relationship('Tag', secondary=post_tags, backref='posts')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author.username,
            'tags': [tag.name for tag in self.tags]
        }

class Tag(db.Model):
    __tablename__ = 'tags'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

# Run migrations:
# flask db init
# flask db migrate -m "Initial migration"
# flask db upgrade`,
};
