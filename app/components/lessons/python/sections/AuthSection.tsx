"use client";

import React from "react";
import { Lock } from "lucide-react";

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

export const AuthSection = {
  id: "auth",
  title: "Authentication & Security",
  icon: Lock,
  overview:
    "Implement user authentication, password hashing, and JWT tokens to secure your Flask applications.",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">Password Hashing</h3>
        <p className="text-gray-700 mb-3">
          Never store plain passwords! Always hash them using secure algorithms.
        </p>
        <CodeExplanation
          code={`from werkzeug.security import generate_password_hash, check_password_hash

# When user registers - HASH the password
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user already exists
    existing_user = User.query.filter_by(username=data['username']).first()
    if existing_user:
        return {'error': 'Username already exists'}, 400
    
    # Hash password
    hashed_password = generate_password_hash(data['password'])
    
    # Create user with hashed password
    user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_password  # Store hash, not plain password
    )
    
    db.session.add(user)
    db.session.commit()
    
    return {'message': 'User created successfully'}, 201

# When user logs in - VERIFY password
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Find user
    user = User.query.filter_by(username=data['username']).first()
    
    if not user:
        return {'error': 'User not found'}, 404
    
    # Check password
    if check_password_hash(user.password, data['password']):
        return {'message': 'Login successful', 'user_id': user.id}, 200
    else:
        return {'error': 'Invalid password'}, 401`}
          explanation={[
            {
              label: "generate_password_hash()",
              desc: "One-way function. Converts plain text to secure hash",
            },
            {
              label: "check_password_hash()",
              desc: "Compares plain password with stored hash",
            },
            {
              label: "Store hash only",
              desc: "Never save the actual password in your database",
            },
            {
              label: "401 vs 404",
              desc: "401 = Unauthorized (wrong password), 404 = Not Found",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">JWT Tokens</h3>
        <CodeExplanation
          code={`# Install PyJWT
$ pip install pyjwt

import jwt
from datetime import datetime, timedelta
from functools import wraps

SECRET_KEY = 'your-secret-key-change-in-production'

def create_token(user_id):
    """Create JWT token for authenticated user"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=24),  # Expires in 24h
        'iat': datetime.utcnow()  # Issued at
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def token_required(f):
    """Decorator to protect routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return {'error': 'Token is missing'}, 401
        
        try:
            # Remove 'Bearer ' prefix
            token = token.replace('Bearer ', '')
            
            # Decode token
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user_id = data['user_id']
            
        except jwt.ExpiredSignatureError:
            return {'error': 'Token has expired'}, 401
        except jwt.InvalidTokenError:
            return {'error': 'Invalid token'}, 401
        
        # Pass user_id to the route function
        return f(current_user_id, *args, **kwargs)
    
    return decorated

# Updated login to return token
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password, data['password']):
        token = create_token(user.id)
        return {
            'message': 'Login successful',
            'token': token,
            'user': user.to_dict()
        }, 200
    else:
        return {'error': 'Invalid credentials'}, 401

# Protected route example
@app.route('/api/profile')
@token_required
def get_profile(current_user_id):
    user = User.query.get(current_user_id)
    return jsonify(user.to_dict())`}
          explanation={[
            {
              label: "JWT payload",
              desc: "Contains user_id, expiration time, and issued time",
            },
            {
              label: "@token_required",
              desc: "Decorator that checks for valid token before running route",
            },
            {
              label: "Authorization header",
              desc: "Client sends 'Authorization: Bearer <token>'",
            },
            {
              label: "jwt.decode()",
              desc: "Verifies token signature and extracts data",
            },
          ]}
        />
      </div>
    </div>
  ),
};
