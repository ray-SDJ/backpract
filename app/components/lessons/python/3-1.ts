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
from flask import Flask

# Step 1: Create Flask app instance
app = Flask(__name__)

# Step 2: Define a route and handler function
@app.route('/hello', methods=['GET'])
def hello_world():
    return {'message': 'Hello, World!', 'status': 'success'}, 200

# Step 3: Run the server
if __name__ == '__main__':
    app.run(debug=True, port=5000)
      </code>
    </pre>

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
