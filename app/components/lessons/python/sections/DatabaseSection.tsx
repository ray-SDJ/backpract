"use client";

import React from "react";
import { Database } from "lucide-react";

interface CodeExplanationProps {
  code: string;
  explanation: Array<{ label: string; desc: string }>;
}

const CodeExplanation: React.FC<CodeExplanationProps> = ({
  code,
  explanation,
}) => (
  <div className="mt-4 space-y-3">
    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
      <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
    </div>
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-semibold text-blue-900 mb-3">Code Explanation:</h4>
      <div className="space-y-2">
        {explanation.map((item, index) => (
          <div key={index} className="flex gap-3">
            <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono whitespace-nowrap">
              {item.label}
            </code>
            <span className="text-blue-700 text-sm">{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const DatabaseSection = {
  id: "databases",
  title: "Databases & Models",
  icon: Database,
  overview:
    "SQLAlchemy is an ORM that lets you work with databases using Python objects instead of SQL queries.",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">Setting Up SQLAlchemy</h3>
        <CodeExplanation
          code={`# Install Flask-SQLAlchemy
$ pip install flask-sqlalchemy

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
db = SQLAlchemy(app)`}
          explanation={[
            {
              label: "SQLALCHEMY_DATABASE_URI",
              desc: "Connection string. sqlite:/// for local file, postgres:// for PostgreSQL",
            },
            {
              label: "os.getenv()",
              desc: "Read DATABASE_URL from environment variables (production)",
            },
            {
              label: "TRACK_MODIFICATIONS",
              desc: "Set False for better performance",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">Defining Models</h3>
        <CodeExplanation
          code={`class User(db.Model):
    """User model - represents users table"""
    
    # Columns
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    posts = db.relationship('Post', backref='author', lazy=True)
    
    def to_dict(self):
        """Convert to dictionary for JSON responses"""
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
    
    # Foreign key to user
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# Create tables
with app.app_context():
    db.create_all()`}
          explanation={[
            {
              label: "db.Model",
              desc: "Base class for all models. Maps to database tables",
            },
            {
              label: "primary_key=True",
              desc: "Unique identifier, auto-increments",
            },
            {
              label: "unique=True, nullable=False",
              desc: "Column constraints: unique values, required field",
            },
            {
              label: "db.relationship()",
              desc: "Links models together. User has many posts",
            },
            {
              label: "db.ForeignKey()",
              desc: "References another table's primary key",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">CRUD Operations</h3>
        <CodeExplanation
          code={`# CREATE - Add new records
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    
    user = User(
        username=data['username'],
        email=data['email'],
        password=data['password']  # Hash this in real apps!
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify(user.to_dict()), 201

# READ - Query records
@app.route('/api/users')
def get_users():
    # Get all users
    users = User.query.all()
    
    # Get user by ID
    user = User.query.get(1)
    
    # Filter users
    active_users = User.query.filter_by(is_active=True).all()
    
    # Advanced filtering
    users = User.query.filter(User.username.like('%john%')).all()
    
    return jsonify([u.to_dict() for u in users])

# UPDATE - Modify records
@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    user.email = data.get('email', user.email)
    user.is_active = data.get('is_active', user.is_active)
    
    db.session.commit()
    return jsonify(user.to_dict())

# DELETE - Remove records
@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return '', 204`}
          explanation={[
            {
              label: "db.session.add()",
              desc: "Add object to session (not saved yet)",
            },
            {
              label: "db.session.commit()",
              desc: "Save all changes to database",
            },
            {
              label: "User.query.all()",
              desc: "Get all records from User table",
            },
            {
              label: ".filter_by()",
              desc: "Simple filtering by column values",
            },
            {
              label: ".get_or_404()",
              desc: "Get by ID or return 404 error if not found",
            },
          ]}
        />
      </div>
    </div>
  ),
};
