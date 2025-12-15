import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Introduction to Flask",
  description:
    "Flask is a lightweight Python microframework for building web applications. Learn the basics and create your first Flask app.",
  difficulty: "Beginner",
  content: `<div class="lesson-content">
    <p>Welcome to Flask development! In this lesson, you'll learn how to set up Flask and create your first web application.</p>

    <h2>What is Flask?</h2>
    
    <p>Flask is a lightweight Python microframework for building web applications. Unlike Django which is batteries-included, Flask gives you total control and flexibility.</p>
    
    <p>Flask is a web framework that handles HTTP requests and responses. Think of it as a traffic controller - it listens for requests from clients, routes them to the right handler function, and sends responses back.</p>

    <div class="feature-list">
      <h3>Key features of Flask:</h3>
      <ul>
        <li><strong>Routing:</strong> Maps URLs to Python functions</li>
        <li><strong>Request handling:</strong> Handles HTTP data automatically</li>
        <li><strong>Decorators:</strong> Simple @ syntax to mark functions as routes</li>
        <li><strong>Blueprints:</strong> Organize code into reusable modules</li>
        <li><strong>Minimal:</strong> Start small, add extensions as needed</li>
      </ul>
    </div>

    <h2>Installation and Setup</h2>
    
    <p>First, let's install Flask and set up our development environment:</p>

    <pre class="code-block">
      <code>
# Create a virtual environment
python -m venv flask_env

# Activate virtual environment
# On Windows:
flask_env\\Scripts\\activate
# On macOS/Linux:
source flask_env/bin/activate

# Install Flask
pip install Flask
      </code>
    </pre>

    <h2>Your First Flask App</h2>
    
    <p>Let's create a simple Flask application:</p>

    <pre class="code-block">
      <code>
# Import Flask class from flask module
# Flask is installed with: pip install Flask
from flask import Flask

# Step 1: Create Flask app instance
# Flask(__name__) creates the application object
# __name__ is a special Python variable:
#   - When run directly, __name__ = '__main__'
#   - When imported, __name__ = the module name
# Flask uses this to determine root path for templates/static files
app = Flask(__name__)

# Step 2: Define a route and handler function
# @app.route() is a DECORATOR - it wraps the function below it
# Decorators modify function behavior without changing the function code
# This decorator registers the function as a handler for '/hello' URL
@app.route('/hello', methods=['GET'])
def hello_world():
    # This function runs when someone visits http://localhost:5000/hello
    
    # Return a tuple: (data, status_code)
    # Flask automatically converts dict to JSON response
    # {'key': 'value'} is a dictionary (like JavaScript object)
    # 200 = HTTP status code for success (OK)
    return {'message': 'Hello, World!', 'status': 'success'}, 200

# Step 3: Run the server
# if __name__ == '__main__': only runs when file is executed directly
# Prevents code from running when file is imported as module
if __name__ == '__main__':
    # app.run() starts the Flask development server
    # debug=True enables:
    #   - Auto-reload when you change code (no manual restart needed)
    #   - Detailed error messages in browser
    #   - Interactive debugger for exceptions
    # WARNING: NEVER use debug=True in production (security risk!)
    # port=5000 sets server port (default is 5000)
    app.run(debug=True, port=5000)
      </code>
    </pre>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🔍 Core Concepts Explained</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Flask(__name__):</strong> Creates Flask application instance. __name__ helps Flask locate resources</li>
        <li><strong>@app.route():</strong> Decorator that maps URL path to function. Think of it as "when user visits /hello, run this function"</li>
        <li><strong>methods=['GET']:</strong> Specifies HTTP methods this route accepts (GET, POST, PUT, DELETE, etc.)</li>
        <li><strong>Return tuple:</strong> (data, status_code) - Flask auto-converts dict to JSON with correct status</li>
        <li><strong>debug=True:</strong> Development mode with auto-reload and detailed errors. NEVER use in production!</li>
      </ul>
    </div>

    <h2>Code Explanation</h2>
    
    <div class="explanation-list">
      <ul>
        <li><strong>app = Flask(__name__):</strong> Creates a Flask application instance. __name__ tells Flask where this module is</li>
        <li><strong>@app.route():</strong> Decorator that maps a URL path to a function. When someone visits /hello, this function runs</li>
        <li><strong>methods=['GET']:</strong> Specifies which HTTP methods this route accepts. GET retrieves data, POST creates data, etc.</li>
        <li><strong>return {...}, 200:</strong> Returns JSON data and HTTP status code. 200 means success</li>
        <li><strong>debug=True:</strong> Auto-reloads server when you edit code. Use False in production</li>
      </ul>
    </div>

    <h2>Quick Test</h2>
    
    <p>Run the code above, then open your browser to <code>http://localhost:5000/hello</code>. You'll see the JSON response!</p>
  </div>`,
  objectives: [
    "Understand what Flask is and its key features",
    "Set up a basic Flask application",
    "Create your first route with the @app.route decorator",
    "Return JSON responses from Flask routes",
    "Run a Flask development server",
  ],
  practiceInstructions: [
    "Create a new Python file called app.py",
    "Install Flask using pip install flask",
    "Copy the basic Flask app code and run it",
    "Visit http://localhost:5000/hello in your browser",
    "Try adding a new route like /goodbye that returns a different message",
  ],
  hints: [
    "Make sure you have Python 3.6+ installed",
    "Use a virtual environment to avoid package conflicts",
    "If you get 'Module not found', make sure Flask is installed in your current environment",
    "The debug=True parameter makes development easier by auto-reloading on changes",
  ],
  solution: `from flask import Flask

app = Flask(__name__)

@app.route('/hello', methods=['GET'])
def hello_world():
    return {'message': 'Hello, World!', 'status': 'success'}, 200

@app.route('/goodbye', methods=['GET'])
def goodbye():
    return {'message': 'Goodbye, World!', 'status': 'success'}, 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)`,
};
