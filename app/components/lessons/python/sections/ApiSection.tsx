"use client";

import React from "react";
import { Code2 } from "lucide-react";

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

export const ApiSection = {
  id: "apis",
  title: "REST APIs & Best Practices",
  icon: Code2,
  overview:
    "Build professional REST APIs with proper error handling, validation, and documentation.",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">RESTful API Design</h3>
        <p className="text-gray-700 mb-3">
          REST uses HTTP methods and URLs to represent actions on resources.
        </p>
        <div className="bg-gray-100 rounded-lg p-4 text-sm space-y-2 font-mono mb-4">
          <div>GET /api/users → Get all users</div>
          <div>GET /api/users/123 → Get user with ID 123</div>
          <div>POST /api/users → Create new user</div>
          <div>PUT /api/users/123 → Update user 123</div>
          <div>DELETE /api/users/123 → Delete user 123</div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">Error Handling</h3>
        <CodeExplanation
          code={`from flask import jsonify

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Bad request'}), 400

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# Custom validation function
def validate_user_data(data):
    errors = []
    
    if not data.get('username'):
        errors.append('Username is required')
    elif len(data['username']) < 3:
        errors.append('Username must be at least 3 characters')
    
    if not data.get('email'):
        errors.append('Email is required')
    elif '@' not in data['email']:
        errors.append('Invalid email format')
    
    return errors

@app.route('/api/users', methods=['POST'])
def create_user_with_validation():
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Validate data
    errors = validate_user_data(data)
    if errors:
        return jsonify({'errors': errors}), 400
    
    # Create user if validation passes
    user = User(
        username=data['username'],
        email=data['email'],
        password=generate_password_hash(data['password'])
    )
    
    try:
        db.session.add(user)
        db.session.commit()
        return jsonify(user.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create user'}), 500`}
          explanation={[
            {
              label: "@app.errorhandler()",
              desc: "Catches errors and returns consistent JSON responses",
            },
            {
              label: "validate_user_data()",
              desc: "Custom function to check data before saving",
            },
            {
              label: "400 vs 500",
              desc: "400 = client error (bad data), 500 = server error",
            },
            {
              label: "db.session.rollback()",
              desc: "Undo changes if something goes wrong",
            },
          ]}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">🚀 Production Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use environment variables for secrets</li>
          <li>• Enable CORS for frontend integration</li>
          <li>• Add rate limiting to prevent abuse</li>
          <li>• Log requests and errors for debugging</li>
          <li>• Use Gunicorn for production deployment</li>
        </ul>
      </div>
    </div>
  ),
};
