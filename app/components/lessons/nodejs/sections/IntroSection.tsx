import React from "react";
import { Play, Code, Zap } from "lucide-react";

interface CodeExplanationProps {
  code: string;
  explanation: Array<{ label: string; desc: string }>;
}

const CodeExplanation: React.FC<CodeExplanationProps> = ({
  code,
  explanation,
}) => (
  <div className="bg-slate-50 rounded-lg p-4 mb-6">
    <pre className="text-sm overflow-x-auto mb-4 bg-slate-900 text-slate-100 p-4 rounded">
      <code>{code}</code>
    </pre>
    <div className="grid gap-3">
      {explanation.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <strong className="text-slate-800">{item.label}:</strong>
            <span className="text-slate-600 ml-1">{item.desc}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const IntroSection = {
  id: "intro",
  title: "Node.js & Express Setup",
  icon: Play,
  overview: "Node.js environment and Express framework introduction",
  content: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-3">
          🚀 Welcome to Node.js Backend Development
        </h3>
        <p className="text-green-800 leading-relaxed">
          Learn to build scalable server-side applications with Node.js and
          Express. Master JavaScript on the server, asynchronous programming,
          and create robust APIs with modern development practices.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-3">
            🔧 What You&apos;ll Learn
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Node.js runtime and NPM package management
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Express.js framework and middleware concepts
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Asynchronous programming with Promises and async/await
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              RESTful API development and middleware patterns
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-3">
            ⚡ Prerequisites
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Basic JavaScript knowledge (ES6+)
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Understanding of HTTP and web fundamentals
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Command line basics and Git version control
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Node.js 18+ installed on your system
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-green-400" />
          <h4 className="text-white font-semibold">Environment Setup</h4>
        </div>

        <CodeExplanation
          code={`# Check if Node.js is installed
node --version
npm --version

# Create a new project directory
mkdir my-node-app
cd my-node-app

# Initialize npm project
npm init -y

# Install Express and essential dependencies
npm install express cors helmet morgan dotenv
npm install -D nodemon concurrently

# Create basic project structure
mkdir src
mkdir src/routes
mkdir src/middleware
mkdir src/controllers
touch src/server.js
touch .env
touch .gitignore

echo "node_modules/
.env
dist/
*.log" > .gitignore`}
          explanation={[
            {
              label: "express",
              desc: "Fast, unopinionated web framework for Node.js",
            },
            {
              label: "cors",
              desc: "Enable Cross-Origin Resource Sharing for frontend integration",
            },
            {
              label: "helmet",
              desc: "Security middleware to set various HTTP headers",
            },
            {
              label: "morgan",
              desc: "HTTP request logger middleware for debugging",
            },
            {
              label: "nodemon",
              desc: "Development tool that auto-restarts server on file changes",
            },
          ]}
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h4 className="text-white font-semibold">Basic Express Server</h4>
        </div>

        <CodeExplanation
          code={`// src/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security and logging middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.get('/api/users', async (req, res) => {
  try {
    // Simulate database query
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found' 
  });
});

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
  console.log(\`📊 Health check: http://localhost:\${PORT}/health\`);
});`}
          explanation={[
            {
              label: "helmet()",
              desc: "Adds security headers to protect against common attacks",
            },
            {
              label: "cors()",
              desc: "Enables cross-origin requests from frontend applications",
            },
            {
              label: "morgan('combined')",
              desc: "Logs all HTTP requests in Apache combined log format",
            },
            {
              label: "express.json()",
              desc: "Parses JSON request bodies with size limit protection",
            },
            {
              label: "Error middleware",
              desc: "Catches and handles errors, hiding details in production",
            },
          ]}
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-blue-400" />
          <h4 className="text-white font-semibold">Package.json Scripts</h4>
        </div>

        <CodeExplanation
          code={`{
  "name": "my-node-app",
  "version": "1.0.0",
  "description": "Node.js Express API",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "echo \\"No tests yet\\" && exit 1",
    "lint": "echo \\"No linting configured\\" && exit 1"
  },
  "keywords": ["nodejs", "express", "api"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "concurrently": "^8.2.0"
  }
}

// .env file
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000

// Start development server
npm run dev

// Test endpoints
curl http://localhost:3000/health
curl http://localhost:3000/api/users`}
          explanation={[
            {
              label: "npm run dev",
              desc: "Starts server with nodemon for auto-restart on changes",
            },
            {
              label: "PORT=3000",
              desc: "Default port, can be overridden by environment variable",
            },
            {
              label: "NODE_ENV",
              desc: "Environment flag to control error detail visibility",
            },
            {
              label: "curl commands",
              desc: "Test your API endpoints from command line",
            },
          ]}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">15 min</div>
          <div className="text-slate-600">Setup & Environment</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">25 min</div>
          <div className="text-slate-600">Express Basics</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">30 min</div>
          <div className="text-slate-600">API Development</div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">💡 Pro Tips</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Use environment variables for configuration and secrets</li>
          <li>• Always validate and sanitize input data</li>
          <li>• Implement proper error handling and logging</li>
          <li>• Follow RESTful API design principles</li>
        </ul>
      </div>
    </div>
  ),
};
