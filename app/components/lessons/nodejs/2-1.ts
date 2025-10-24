import { LessonData } from "../types";

const lessonData: LessonData = {
  title: "Setting Up Node.js Project",
  difficulty: "Beginner",
  description:
    "Learn how to set up a Node.js project from scratch with proper project structure and dependencies.",
  objectives: [
    "Install and configure Node.js development environment",
    "Initialize a new Node.js project with npm",
    "Set up project structure and essential dependencies",
    "Configure development tools and scripts",
  ],
  content: `
    <div class="lesson-card bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
      <div class="lesson-content p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Setting Up Node.js Project</h1>
        
        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🚀 Node.js Development Environment
          </h2>
          <p class="text-gray-700 mb-4 leading-relaxed">
            Setting up a Node.js project correctly from the start ensures maintainable, scalable, and professional applications. 
            We'll cover environment setup, project initialization, and essential development tools.
          </p>
          
          <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-green-900 mb-3">🔧 Prerequisites</h4>
            <ul class="explanation-list space-y-2">
              <li><strong>Node.js 18+:</strong> Download from <a href="https://nodejs.org" target="_blank" class="text-blue-600 hover:underline">nodejs.org</a></li>
              <li><strong>Package Manager:</strong> npm (comes with Node.js) or yarn</li>
              <li><strong>Code Editor:</strong> VS Code with Node.js extensions recommended</li>
              <li><strong>Terminal:</strong> Command line interface for running commands</li>
            </ul>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📦 Project Initialization
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code># Check Node.js and npm versions
node --version
npm --version

# Create project directory
mkdir my-node-app
cd my-node-app

# Initialize npm project
npm init -y

# Or use interactive mode
npm init</code></pre>
          </div>
          
          <p class="text-gray-700 mb-4">
            The <code class="bg-gray-100 px-2 py-1 rounded">npm init -y</code> command creates a package.json file with default values. 
            The package.json file is the heart of your Node.js project, containing metadata and dependencies.
          </p>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📁 Project Structure
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>my-node-app/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
├── tests/
│   ├── unit/
│   └── integration/
├── config/
├── public/
├── logs/
├── .env
├── .env.example
├── .gitignore
├── README.md
└── package.json</code></pre>
          </div>
          
          <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-blue-900 mb-3">📂 Folder Explanation</h4>
            <ul class="explanation-list space-y-2">
              <li><strong>src/:</strong> Main application source code</li>
              <li><strong>controllers/:</strong> Request handlers and business logic</li>
              <li><strong>middleware/:</strong> Express middleware functions</li>
              <li><strong>models/:</strong> Database models and schemas</li>
              <li><strong>routes/:</strong> API endpoint definitions</li>
              <li><strong>services/:</strong> Business logic and external integrations</li>
              <li><strong>tests/:</strong> Unit and integration tests</li>
              <li><strong>config/:</strong> Configuration files</li>
            </ul>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🔧 Essential Dependencies
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code># Production dependencies
npm install express cors helmet morgan dotenv

# Development dependencies  
npm install -D nodemon concurrently eslint prettier

# Create basic files
touch src/server.js .env .gitignore README.md</code></pre>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="explanation-box bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 class="font-semibold text-purple-900 mb-3">📚 Production Dependencies</h4>
              <ul class="explanation-list space-y-2 text-sm">
                <li><strong>express:</strong> Web application framework</li>
                <li><strong>cors:</strong> Cross-Origin Resource Sharing</li>
                <li><strong>helmet:</strong> Security middleware</li>
                <li><strong>morgan:</strong> HTTP request logger</li>
                <li><strong>dotenv:</strong> Environment variables</li>
              </ul>
            </div>
            
            <div class="explanation-box bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 class="font-semibold text-orange-900 mb-3">🛠️ Development Dependencies</h4>
              <ul class="explanation-list space-y-2 text-sm">
                <li><strong>nodemon:</strong> Auto-restart on changes</li>
                <li><strong>concurrently:</strong> Run multiple commands</li>
                <li><strong>eslint:</strong> Code linting</li>
                <li><strong>prettier:</strong> Code formatting</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            ⚙️ Package.json Configuration
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>{
  "name": "my-node-app",
  "version": "1.0.0",
  "description": "Node.js Express API",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "echo \\"No tests yet\\" && exit 1",
    "lint": "eslint src/**/*.js",
    "lint:fix": "eslint src/**/*.js --fix",
    "format": "prettier --write src/**/*.js"
  },
  "keywords": ["nodejs", "express", "api", "backend"],
  "author": "Your Name",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}</code></pre>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🔒 Environment Configuration
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code># .env file
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/myapp

# Security
JWT_SECRET=your-super-secret-jwt-key-here

# External APIs
API_KEY=your-api-key-here</code></pre>
          </div>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code># .gitignore
node_modules/
.env
.env.local
.env.production
dist/
build/
*.log
.DS_Store
.vscode/
coverage/</code></pre>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🏃‍♂️ Basic Server Setup
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>// src/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to my Node.js API!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

// Start server
app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
  console.log(\`📍 Health check: http://localhost:\${PORT}/health\`);
});</code></pre>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibent text-gray-800 mb-4 flex items-center gap-2">
            🎯 Practice Exercise
          </h2>
          
          <div class="practice-box bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-yellow-900 mb-3">💻 Try It Yourself</h4>
            <ol class="list-decimal list-inside space-y-2 text-yellow-800">
              <li>Create a new Node.js project following the structure above</li>
              <li>Install all the essential dependencies</li>
              <li>Set up the basic server with routes</li>
              <li>Test your server by running <code>npm run dev</code></li>
              <li>Visit <code>http://localhost:3000</code> to see your API response</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  `,
  practiceInstructions: [
    "How do you require the express module in Node.js?",
    "How do you create an Express application instance?",
    "How do you define a PORT variable that uses process.env.PORT with a fallback?",
    "How do you add middleware to parse JSON in Express?",
    "How do you create a GET route for the root path ('/') that returns JSON?",
    "How do you make the server listen on the PORT and log a message?",
    "Your code should use app.listen(), app.get(), res.json(), and console.log()",
  ],
  hints: [
    "Use 'npm init -y' for quick project initialization with defaults",
    "Remember to add nodemon to devDependencies, not regular dependencies",
    "The .env file should never be committed to version control",
    "Use 'require('dotenv').config()' at the top of your main server file",
    "Test your setup by creating a simple GET route that returns JSON",
  ],
  solution: `
// Complete working example:
// package.json
{
  "name": "my-node-app",
  "version": "1.0.0",
  "description": "Node.js Express API",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}

// src/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Node.js API is running!' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
  `,
  validationCriteria: {
    requiredIncludes: [
      "const express = require('express')",
      "const app = express()",
      "app.listen(",
      "app.get('/'",
      "res.json(",
    ],
    requiredPatterns: [
      /const\s+PORT\s*=\s*process\.env\.PORT\s*\|\|\s*\d+/,
      /app\.use\(/,
      /console\.log\(/,
    ],
    minLines: 10,
    customValidator: (code: string) => {
      const hasRouteHandler =
        /app\.get\s*\(\s*['"`]\/['"`]\s*,\s*\([^)]+\)\s*=>\s*\{/.test(code);
      const hasJsonResponse = /res\.json\s*\(/.test(code);

      if (!hasRouteHandler) {
        return {
          valid: false,
          message: "Must include a GET route handler for '/'",
        };
      }
      if (!hasJsonResponse) {
        return { valid: false, message: "Must send a JSON response" };
      }

      return { valid: true, message: "Express server structure is correct!" };
    },
  },
  starterCode: `// Create your first Express.js server
// TODO: Require express and create an app
// TODO: Set up the PORT variable
// TODO: Add basic middleware (express.json())
// TODO: Create a GET route for '/' that returns JSON
// TODO: Start the server with app.listen()

console.log("Welcome to Node.js!");
`,
};

export default lessonData;
export { lessonData };
