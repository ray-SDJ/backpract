"use client";

import React from "react";
import { BookOpen } from "lucide-react";

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

export const IntroSection = {
  id: "intro",
  title: "Introduction to Flask",
  icon: BookOpen,
  overview:
    "Flask is a lightweight Python microframework for building web applications. Unlike Django which is batteries-included, Flask gives you total control and flexibility.",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">What is Flask?</h3>
        <p className="text-gray-700 mb-3">
          Flask is a web framework that handles HTTP requests and responses.
          Think of it as a traffic controller - it listens for requests from
          clients, routes them to the right handler function, and sends
          responses back.
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
          <li>
            <strong>Routing:</strong> Maps URLs to Python functions
          </li>
          <li>
            <strong>Request handling:</strong> Handles HTTP data automatically
          </li>
          <li>
            <strong>Decorators:</strong> Simple @ syntax to mark functions as
            routes
          </li>
          <li>
            <strong>Blueprints:</strong> Organize code into reusable modules
          </li>
          <li>
            <strong>Minimal:</strong> Start small, add extensions as needed
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">Your First Flask App</h3>
        <CodeExplanation
          code={`from flask import Flask

# Step 1: Create Flask app instance
app = Flask(__name__)

# Step 2: Define a route and handler function
@app.route('/hello', methods=['GET'])
def hello_world():
    return {'message': 'Hello, World!', 'status': 'success'}, 200

# Step 3: Run the server
if __name__ == '__main__':
    app.run(debug=True, port=5000)`}
          explanation={[
            {
              label: "app = Flask(__name__)",
              desc: "Creates a Flask application instance. __name__ tells Flask where this module is",
            },
            {
              label: "@app.route()",
              desc: "Decorator that maps a URL path to a function. When someone visits /hello, this function runs",
            },
            {
              label: "methods=['GET']",
              desc: "Specifies which HTTP methods this route accepts. GET retrieves data, POST creates data, etc.",
            },
            {
              label: "return {...}, 200",
              desc: "Returns JSON data and HTTP status code. 200 means success",
            },
            {
              label: "debug=True",
              desc: "Auto-reloads server when you edit code. Use False in production",
            },
          ]}
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">💡 Quick Test</h4>
        <p className="text-sm text-green-800">
          Run the code above, then open your browser to{" "}
          <code className="bg-white px-2 py-1 rounded">
            http://localhost:5000/hello
          </code>
          . You&apos;ll see the JSON response!
        </p>
      </div>
    </div>
  ),
};
