"use client";

import React from "react";
import { Zap } from "lucide-react";

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

export const RoutingSection = {
  id: "routing",
  title: "Routing & HTTP Methods",
  icon: Zap,
  overview:
    "Learn how to handle different URL patterns and HTTP methods to build robust APIs and web applications.",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">URL Parameters</h3>
        <p className="text-gray-700 mb-3">
          Flask can capture parts of the URL as variables and pass them to your
          functions.
        </p>
        <CodeExplanation
          code={`@app.route('/users/<int:user_id>')
def get_user(user_id):
    """Get user by ID - /users/123"""
    return {'user_id': user_id, 'name': 'John'}, 200

@app.route('/users/<username>')
def get_user_by_name(username):
    """Get user by username - /users/john"""
    return {'username': username, 'email': f'{username}@example.com'}, 200

@app.route('/posts/<int:post_id>/comments/<int:comment_id>')
def get_comment(post_id, comment_id):
    """Nested parameters - /posts/5/comments/10"""
    return {
        'post_id': post_id,
        'comment_id': comment_id,
        'content': 'Great post!'
    }, 200`}
          explanation={[
            {
              label: "<int:user_id>",
              desc: "Captures an integer from URL. Flask converts it automatically",
            },
            {
              label: "<username>",
              desc: "Captures a string (default type). No conversion needed",
            },
            {
              label: "Multiple parameters",
              desc: "You can have multiple parameters in a single route",
            },
            {
              label: "def get_user(user_id)",
              desc: "Function parameters must match the URL parameter names",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">HTTP Methods & CRUD</h3>
        <CodeExplanation
          code={`from flask import request, jsonify

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
@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    # Update user in database
    return jsonify({'id': user_id, 'updated': True}), 200

# DELETE - Remove resource
@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    # Delete user from database
    return '', 204  # 204 = No Content`}
          explanation={[
            {
              label: "methods=['POST']",
              desc: "Only accept POST requests for this route",
            },
            {
              label: "request.get_json()",
              desc: "Extract JSON data from request body",
            },
            {
              label: "request.args.get()",
              desc: "Get query parameters from URL (?page=1)",
            },
            {
              label: "201, 200, 204",
              desc: "HTTP status codes: Created, OK, No Content",
            },
          ]}
        />
      </div>
    </div>
  ),
};
