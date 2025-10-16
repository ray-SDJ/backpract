import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Flask REST API & JSON",
  description:
    "Learn how to handle different URL patterns, HTTP methods, and build RESTful APIs with Flask.",
  difficulty: "Beginner",
  content: `<div class="lesson-content">
    <p>In this lesson, you'll learn how to handle different URL patterns and HTTP methods to build robust APIs and web applications.</p>

    <h2>URL Parameters</h2>
    
    <p>Flask can capture parts of the URL as variables and pass them to your functions. This is essential for building RESTful APIs.</p>

    <pre class="code-block">
      <code>
@app.route('/users/&lt;int:user_id&gt;')
def get_user(user_id):
    """Get user by ID - /users/123"""
    return {'user_id': user_id, 'name': 'John'}, 200

@app.route('/users/&lt;username&gt;')
def get_user_by_name(username):
    """Get user by username - /users/john"""
    return {'username': username, 'email': f'{username}@example.com'}, 200

@app.route('/posts/&lt;int:post_id&gt;/comments/&lt;int:comment_id&gt;')
def get_comment(post_id, comment_id):
    """Nested parameters - /posts/5/comments/10"""
    return {
        'post_id': post_id,
        'comment_id': comment_id,
        'content': 'Great post!'
    }, 200
      </code>
    </pre>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">💡 Code Explanation</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>&lt;int:user_id&gt;:</strong> Captures an integer from URL and converts it automatically</li>
        <li><strong>&lt;username&gt;:</strong> Captures a string (default type), no conversion needed</li>
        <li><strong>Multiple parameters:</strong> You can have multiple parameters in a single route</li>
        <li><strong>Function parameters:</strong> Must match the URL parameter names</li>
      </ul>
    </div>

    <h2>HTTP Methods & CRUD Operations</h2>
    
    <p>Different HTTP methods represent different operations on your resources:</p>

    <pre class="code-block">
      <code>
from flask import Flask, request, jsonify

app = Flask(__name__)

# CREATE - Add new resource
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    # Validate and save user
    new_user = {
        'id': 123,
        'username': data['username'],
        'email': data['email']
    }
    return jsonify(new_user), 201  # 201 = Created

# READ - Get resources  
@app.route('/api/users', methods=['GET'])
def get_users():
    page = request.args.get('page', 1, type=int)
    return jsonify({
        'users': [{'id': 1, 'username': 'john'}],
        'page': page
    }), 200

# UPDATE - Modify existing resource
@app.route('/api/users/&lt;int:user_id&gt;', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    # Update user in database
    return jsonify({'id': user_id, 'updated': True}), 200

# DELETE - Remove resource
@app.route('/api/users/&lt;int:user_id&gt;', methods=['DELETE'])
def delete_user(user_id):
    # Delete user from database
    return '', 204  # 204 = No Content
      </code>
    </pre>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">💡 Code Explanation</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>methods=['POST']:</strong> Only accept POST requests for this route</li>
        <li><strong>request.get_json():</strong> Extract JSON data from request body</li>
        <li><strong>request.args.get():</strong> Get query parameters from URL (?page=1)</li>
        <li><strong>201, 200, 204:</strong> HTTP status codes: Created, OK, No Content</li>
      </ul>
    </div>

    <h2>Error Handling</h2>
    
    <p>Proper error responses for invalid requests:</p>

    <pre class="code-block">
      <code>
from flask import abort

@app.route('/api/users/&lt;int:user_id&gt;')
def get_user(user_id):
    if user_id &lt; 1:
        abort(400)  # Bad Request
    
    # Simulate user lookup
    user = None  # Imagine this comes from database
    if not user:
        abort(404)  # Not Found
    
    return jsonify(user)

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Invalid request'}), 400
      </code>
    </pre>

    <div class="quick-test bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-2">💡 Quick Test</h4>
      <p class="text-sm text-green-800">
        Create a complete CRUD API for posts with routes for creating, reading, updating, and deleting posts. 
        Test each endpoint using Postman or curl commands.
      </p>
    </div>
  </div>`,
  objectives: [
    "Understand URL parameters and route variables",
    "Learn different HTTP methods (GET, POST, PUT, DELETE)",
    "Extract JSON data from request bodies",
    "Handle query parameters from URLs",
    "Return appropriate HTTP status codes",
  ],
  practiceInstructions: [
    "Create routes with URL parameters like /users/<int:id>",
    "Build a complete CRUD API for a 'posts' resource",
    "Test your API endpoints using a tool like Postman or curl",
    "Handle both JSON request bodies and query parameters",
    "Return proper HTTP status codes for different operations",
  ],
  hints: [
    "Use <int:variable> to capture integers from URLs",
    "request.get_json() returns None if no JSON is sent",
    "Always validate input data before processing",
    "Use jsonify() to ensure proper JSON responses",
    "Return 404 for resources that don't exist",
  ],
  solution: `from flask import Flask, request, jsonify

app = Flask(__name__)

# In-memory storage for demo
users = [
    {'id': 1, 'username': 'john', 'email': 'john@example.com'}
]
next_id = 2

@app.route('/api/users', methods=['GET'])
def get_users():
    page = request.args.get('page', 1, type=int)
    return jsonify({'users': users, 'page': page}), 200

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = next((u for u in users if u['id'] == user_id), None)
    if user:
        return jsonify(user), 200
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/users', methods=['POST'])
def create_user():
    global next_id
    data = request.get_json()
    if not data or 'username' not in data:
        return jsonify({'error': 'Username required'}), 400
    
    new_user = {
        'id': next_id,
        'username': data['username'],
        'email': data.get('email', '')
    }
    users.append(new_user)
    next_id += 1
    return jsonify(new_user), 201

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    global users
    users = [u for u in users if u['id'] != user_id]
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)`,
};
