import { LessonData } from "../types";

const lessonData: LessonData = {
  title: "Your First Express Server",
  difficulty: "Beginner",
  description:
    "Build your first Express.js server with routes, middleware, and request handling.",
  objectives: [
    "Understand Express.js framework fundamentals",
    "Create and configure an Express application",
    "Implement basic routes and HTTP methods",
    "Handle request and response objects",
    "Add middleware for common functionality",
  ],
  content: `
    <div class="lesson-card bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
      <div class="lesson-content p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Your First Express Server</h1>
        
        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            ⚡ Express.js Fundamentals
          </h2>
          <p class="text-gray-700 mb-4 leading-relaxed">
            Express.js is a fast, unopinionated web framework for Node.js. It provides a robust set of features 
            for web and mobile applications, making it easy to create APIs and web servers with minimal code.
          </p>
          
          <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-blue-900 mb-3">🌟 Why Express.js?</h4>
            <ul class="explanation-list space-y-2">
              <li><strong>Minimalist:</strong> Lightweight with essential web server features</li>
              <li><strong>Flexible:</strong> Unopinionated, allowing architectural freedom</li>
              <li><strong>Middleware:</strong> Powerful middleware system for request processing</li>
              <li><strong>Routing:</strong> Simple and intuitive routing system</li>
              <li><strong>Community:</strong> Large ecosystem of plugins and middleware</li>
            </ul>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🚀 Basic Express Server
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>// src/server.js - Minimal Express server
const express = require('express');

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server is running on http://localhost:\${PORT}\`);
});</code></pre>
          </div>
          
          <p class="text-gray-700 mb-4">
            This creates a minimal Express server that listens on port 3000 and responds with "Hello World" 
            when you visit the root URL. Let's expand this with more features.
          </p>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🛠️ Adding Middleware
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>// src/server.js - Enhanced server with middleware
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet()); // Sets security headers

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Logging middleware
app.use(morgan('dev')); // Logs HTTP requests

// Body parsing middleware
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Custom middleware example
app.use((req, res, next) => {
  req.timestamp = new Date().toISOString();
  console.log(\`[\${req.timestamp}] \${req.method} \${req.path}\`);
  next(); // Pass control to next middleware
});

// Routes will go here...

app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});</code></pre>
          </div>
          
          <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-green-900 mb-3">🔧 Middleware Explanation</h4>
            <ul class="explanation-list space-y-2">
              <li><strong>helmet():</strong> Sets various HTTP headers for security</li>
              <li><strong>cors():</strong> Enables Cross-Origin Resource Sharing</li>
              <li><strong>morgan():</strong> HTTP request logger for debugging</li>
              <li><strong>express.json():</strong> Parses incoming JSON payloads</li>
              <li><strong>express.urlencoded():</strong> Parses URL-encoded form data</li>
            </ul>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🛤️ Creating Routes
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>// Add these routes before app.listen()

// GET route - Homepage
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to my Express API!',
    version: '1.0.0',
    timestamp: req.timestamp,
    endpoints: {
      users: '/api/users',
      health: '/health'
    }
  });
});

// GET route - Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// GET route with parameters
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  
  // Simulate user data
  const user = {
    id: userId,
    name: \`User \${userId}\`,
    email: \`user\${userId}@example.com\`,
    createdAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: user
  });
});

// GET route with query parameters
app.get('/api/users', (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  
  // Simulate user list
  const users = Array.from({ length: limit }, (_, i) => ({
    id: (page - 1) * limit + i + 1,
    name: \`User \${(page - 1) * limit + i + 1}\`,
    email: \`user\${(page - 1) * limit + i + 1}@example.com\`
  }));
  
  const filteredUsers = search 
    ? users.filter(user => user.name.toLowerCase().includes(search.toLowerCase()))
    : users;
  
  res.json({
    success: true,
    data: filteredUsers,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: 100 // Simulated total
    }
  });
});</code></pre>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📮 HTTP Methods (POST, PUT, DELETE)
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>// POST route - Create user
app.post('/api/users', (req, res) => {
  const { name, email, age } = req.body;
  
  // Basic validation
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Name and email are required'
    });
  }
  
  // Simulate user creation
  const newUser = {
    id: Math.floor(Math.random() * 1000),
    name,
    email,
    age: age || null,
    createdAt: new Date().toISOString()
  };
  
  // Simulate saving to database
  console.log('Creating user:', newUser);
  
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
});

// PUT route - Update user
app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email, age } = req.body;
  
  // Simulate user update
  const updatedUser = {
    id: userId,
    name,
    email,
    age,
    updatedAt: new Date().toISOString()
  };
  
  console.log('Updating user:', updatedUser);
  
  res.json({
    success: true,
    message: 'User updated successfully',
    data: updatedUser
  });
});

// DELETE route - Delete user
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  
  // Simulate user deletion
  console.log('Deleting user with ID:', userId);
  
  res.json({
    success: true,
    message: \`User \${userId} deleted successfully\`
  });
});</code></pre>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="explanation-box bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 class="font-semibold text-purple-900 mb-3">📝 HTTP Methods</h4>
              <ul class="explanation-list space-y-2 text-sm">
                <li><strong>GET:</strong> Retrieve data (read-only)</li>
                <li><strong>POST:</strong> Create new resource</li>
                <li><strong>PUT:</strong> Update existing resource</li>
                <li><strong>DELETE:</strong> Remove resource</li>
              </ul>
            </div>
            
            <div class="explanation-box bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 class="font-semibold text-orange-900 mb-3">📊 Status Codes</h4>
              <ul class="explanation-list space-y-2 text-sm">
                <li><strong>200:</strong> OK (success)</li>
                <li><strong>201:</strong> Created</li>
                <li><strong>400:</strong> Bad Request</li>
                <li><strong>404:</strong> Not Found</li>
                <li><strong>500:</strong> Server Error</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🚨 Error Handling
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>// Error handling middleware (add at the end, before app.listen)

// 404 handler - Must be after all routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: \`Route \${req.originalUrl} not found\`,
    method: req.method
  });
});

// Global error handler - Must be last middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});</code></pre>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🧪 Testing Your Server
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code># Start your server
npm run dev

# Test with curl commands:

# GET request
curl http://localhost:3000/

# GET with parameters
curl http://localhost:3000/users/123

# GET with query parameters
curl "http://localhost:3000/api/users?page=1&limit=5&search=user"

# POST request (create user)
curl -X POST http://localhost:3000/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John Doe","email":"john@example.com","age":30}'

# PUT request (update user)
curl -X PUT http://localhost:3000/api/users/123 \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John Smith","email":"johnsmith@example.com","age":31}'

# DELETE request
curl -X DELETE http://localhost:3000/api/users/123</code></pre>
          </div>
          
          <div class="explanation-box bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-cyan-900 mb-3">🔧 Alternative Testing Tools</h4>
            <ul class="explanation-list space-y-2">
              <li><strong>Postman:</strong> GUI tool for API testing and documentation</li>
              <li><strong>Insomnia:</strong> Another popular API client</li>
              <li><strong>Thunder Client:</strong> VS Code extension for API testing</li>
              <li><strong>Browser:</strong> For testing GET requests directly</li>
            </ul>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🎯 Practice Exercise
          </h2>
          
          <div class="practice-box bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-yellow-900 mb-3">💻 Build a Books API</h4>
            <p class="text-yellow-800 mb-3">Create a simple books management API with the following endpoints:</p>
            <ol class="list-decimal list-inside space-y-2 text-yellow-800">
              <li><strong>GET /books</strong> - Get all books (with pagination)</li>
              <li><strong>GET /books/:id</strong> - Get book by ID</li>
              <li><strong>POST /books</strong> - Create a new book</li>
              <li><strong>PUT /books/:id</strong> - Update a book</li>
              <li><strong>DELETE /books/:id</strong> - Delete a book</li>
            </ol>
            <p class="text-yellow-800 mt-3">Each book should have: id, title, author, year, genre, pages</p>
          </div>
        </div>
      </div>
    </div>
  `,
  practiceInstructions: [
    "How do you create both a GET route and a POST route in Express?",
    "How do you access URL parameters using req.params (e.g., /users/:id)?",
    "How do you access request body data using req.body?",
    "How do you send JSON responses back to the client using res.json()?",
    "Create at least one GET route and one POST route",
    "Your GET route should read a URL parameter (:id)",
    "Your POST route should read data from req.body",
  ],
  hints: [
    "Use express.json() middleware to parse JSON request bodies",
    "Remember to validate required fields in POST requests",
    "Use req.params for URL parameters and req.query for query parameters",
    "Return appropriate HTTP status codes (200, 201, 400, 404)",
    "Add timestamps (createdAt, updatedAt) to your data objects",
  ],
  solution: `
// Complete Books API Example:
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// In-memory books storage (replace with database later)
let books = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925, genre: "Fiction", pages: 180 },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, genre: "Fiction", pages: 324 }
];
let nextId = 3;

// GET all books with pagination and filtering
app.get('/books', (req, res) => {
  const { page = 1, limit = 10, author, genre } = req.query;
  
  let filteredBooks = books;
  if (author) filteredBooks = filteredBooks.filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
  if (genre) filteredBooks = filteredBooks.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
  
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedBooks,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredBooks.length,
      pages: Math.ceil(filteredBooks.length / limit)
    }
  });
});

// GET book by ID
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ success: false, error: 'Book not found' });
  }
  res.json({ success: true, data: book });
});

// POST create book
app.post('/books', (req, res) => {
  const { title, author, year, genre, pages } = req.body;
  
  if (!title || !author) {
    return res.status(400).json({ success: false, error: 'Title and author are required' });
  }
  
  const newBook = {
    id: nextId++,
    title,
    author,
    year: year || null,
    genre: genre || 'Unknown',
    pages: pages || null,
    createdAt: new Date().toISOString()
  };
  
  books.push(newBook);
  res.status(201).json({ success: true, data: newBook });
});

// PUT update book
app.put('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex === -1) {
    return res.status(404).json({ success: false, error: 'Book not found' });
  }
  
  const { title, author, year, genre, pages } = req.body;
  books[bookIndex] = { ...books[bookIndex], title, author, year, genre, pages, updatedAt: new Date().toISOString() };
  
  res.json({ success: true, data: books[bookIndex] });
});

// DELETE book
app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex === -1) {
    return res.status(404).json({ success: false, error: 'Book not found' });
  }
  
  books.splice(bookIndex, 1);
  res.json({ success: true, message: 'Book deleted successfully' });
});

// Error handling
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(\`📚 Books API running on http://localhost:\${PORT}\`);
});
  `,
  validationCriteria: {
    requiredIncludes: [
      "const express = require('express')",
      "const app = express()",
      "app.get(",
      "app.post(",
      "req.params",
      "req.body",
    ],
    requiredPatterns: [
      /app\.(get|post|put|delete)\s*\(/,
      /res\.(json|send)\s*\(/,
      /req\.(params|body|query)/,
    ],
    minLines: 15,
    customValidator: (code: string) => {
      const hasGetRoute = /app\.get\s*\(/.test(code);
      const hasPostRoute = /app\.post\s*\(/.test(code);
      const hasParamsAccess = /req\.params/.test(code);
      const hasBodyAccess = /req\.body/.test(code);

      if (!hasGetRoute) {
        return {
          valid: false,
          message: "Must include at least one GET route (app.get)",
        };
      }
      if (!hasPostRoute) {
        return {
          valid: false,
          message: "Must include at least one POST route (app.post)",
        };
      }
      if (!hasParamsAccess) {
        return {
          valid: false,
          message: "Must access route parameters (req.params)",
        };
      }
      if (!hasBodyAccess) {
        return { valid: false, message: "Must access request body (req.body)" };
      }

      return {
        valid: true,
        message: "Express server with routes implemented correctly!",
      };
    },
  },
  starterCode: `// Build an Express server with multiple routes
const express = require('express');
const app = express();
const PORT = 3000;

// TODO: Add express.json() middleware to parse JSON bodies

// TODO: Create a GET route for '/' that returns a welcome message

// TODO: Create a GET route with a parameter (e.g., '/users/:id')

// TODO: Create a POST route that accepts data in req.body

// TODO: Add app.listen() to start the server

console.log("Ready to build Express routes!");
`,
};

export default lessonData;
export { lessonData };
