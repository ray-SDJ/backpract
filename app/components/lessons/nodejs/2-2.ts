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

// Step 1: Import the Express module (npm install express)
// require() loads external modules into your file
const express = require('express');

// Step 2: Create an Express application instance
// express() is a function that returns an Express app object
// Think of 'app' as your web server that will handle HTTP requests
const app = express();

// Step 3: Define the port number where the server will listen
// process.env.PORT reads from environment variables (for deployment)
// || 3000 means "use 3000 if PORT is not defined" (fallback value)
const PORT = process.env.PORT || 3000;

// Step 4: Create a route handler (endpoint)
// app.get() means "listen for HTTP GET requests"
// '/' is the URL path (root/home page)
// (req, res) is a callback function that runs when someone visits this path
//   - req = request object (incoming data from client)
//   - res = response object (what we send back to client)
app.get('/', (req, res) => {
  // res.send() sends a response back to the client
  // This can be text, HTML, or JSON
  res.send('Hello World from Express!');
});

// Step 5: Start the server and listen for incoming requests
// app.listen() makes the server start running on the specified port
// The callback function runs once when server starts successfully
app.listen(PORT, () => {
  // \`template literals\` allow embedding variables with \${variable}
  console.log(\`Server is running on http://localhost:\${PORT}\`);
});</code></pre>
          </div>
          
          <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-blue-900 mb-3">🔍 Code Breakdown</h4>
            <ul class="explanation-list space-y-2">
              <li><strong>require():</strong> Node.js function to import modules/packages</li>
              <li><strong>express():</strong> Creates an application instance that handles HTTP</li>
              <li><strong>app.get():</strong> Defines a route that responds to GET requests</li>
              <li><strong>req (request):</strong> Object containing data from the client (headers, body, params)</li>
              <li><strong>res (response):</strong> Object used to send data back to the client</li>
              <li><strong>res.send():</strong> Sends a response (auto-detects content type)</li>
              <li><strong>app.listen():</strong> Starts the server on specified port</li>
            </ul>
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

// Import required packages (install with: npm install express cors helmet morgan dotenv)
const express = require('express');         // Web framework
const cors = require('cors');               // Cross-Origin Resource Sharing
const helmet = require('helmet');           // Security headers
const morgan = require('morgan');           // HTTP request logger
require('dotenv').config();                 // Load .env file variables into process.env

// Create Express app instance
const app = express();

// Get port from environment variable or use 3000 as default
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARE SETUP ==========
// Middleware = functions that process requests BEFORE they reach your routes
// They execute in the order you define them with app.use()

// Security middleware - adds HTTP headers to protect against common attacks
// Examples: XSS protection, prevent clickjacking, control DNS prefetching
app.use(helmet());

// CORS middleware - allows requests from other domains (e.g., frontend on different port)
// Without this, browsers block requests from http://localhost:3000 to your API
app.use(cors({
  // origin: which domains are allowed to access this API
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  // credentials: allow cookies and authentication headers
  credentials: true
}));

// Logging middleware - logs each HTTP request to console (helpful for debugging)
// 'dev' format: :method :url :status :response-time ms
// Example output: "GET /api/users 200 15.234 ms"
app.use(morgan('dev'));

// Body parsing middleware - converts incoming request body into usable JavaScript objects
// express.json() parses application/json content type (JSON data)
// { limit: '10mb' } sets maximum payload size to prevent DoS attacks
app.use(express.json({ limit: '10mb' }));

// express.urlencoded() parses application/x-www-form-urlencoded (HTML form data)
// { extended: true } allows rich objects and arrays to be encoded into URL format
app.use(express.urlencoded({ extended: true }));

// Custom middleware example - you can create your own middleware functions
// Middleware signature: (req, res, next) => { ... }
app.use((req, res, next) => {
  // Add a custom property to req object (accessible in all routes)
  req.timestamp = new Date().toISOString();
  
  // Log request details
  console.log(\`[\${req.timestamp}] \${req.method} \${req.path}\`);
  
  // IMPORTANT: Call next() to pass control to the next middleware/route
  // If you forget next(), the request will hang forever!
  next();
});

// Routes will go here...
// All routes defined below will have access to processed req/res objects

// Start the server
app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});</code></pre>
          </div>
          
          <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-green-900 mb-3">🔧 Middleware Explanation</h4>
            <ul class="explanation-list space-y-2">
              <li><strong>helmet():</strong> Sets various HTTP headers for security (XSS protection, MIME sniffing prevention)</li>
              <li><strong>cors():</strong> Enables Cross-Origin Resource Sharing - lets your API accept requests from different domains</li>
              <li><strong>morgan():</strong> HTTP request logger - logs every request with method, URL, status code, and response time</li>
              <li><strong>express.json():</strong> Parses incoming JSON payloads and makes them available in req.body</li>
              <li><strong>express.urlencoded():</strong> Parses URL-encoded form data (like HTML form submissions)</li>
              <li><strong>next():</strong> Function that passes control to the next middleware in the chain</li>
            </ul>
          </div>
          
          <div class="explanation-box bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-purple-900 mb-3">🔗 How Middleware Works</h4>
            <p class="text-purple-800 mb-2">
              Middleware functions execute in sequence like a chain. Each request flows through:
            </p>
            <ol class="text-sm text-purple-800 space-y-1 ml-4 list-decimal">
              <li>helmet() adds security headers</li>
              <li>cors() checks if request origin is allowed</li>
              <li>morgan() logs the request</li>
              <li>express.json() parses JSON body if present</li>
              <li>express.urlencoded() parses form data if present</li>
              <li>Custom middleware adds timestamp</li>
              <li>Finally, request reaches your route handler (app.get, app.post, etc.)</li>
            </ol>
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

// ========== ROUTE HANDLERS ==========

// GET route - Homepage (responds to GET requests to '/')
// app.get(path, callback) - defines a route handler
app.get('/', (req, res) => {
  // res.json() sends a JSON response with Content-Type: application/json
  // It automatically converts JavaScript objects to JSON strings
  res.json({
    message: 'Welcome to my Express API!',
    version: '1.0.0',
    timestamp: req.timestamp,        // Custom property from our middleware
    endpoints: {                     // List available endpoints for API discovery
      users: '/api/users',
      health: '/health'
    }
  });
});

// GET route - Health check endpoint (useful for monitoring/load balancers)
app.get('/health', (req, res) => {
  // res.status(200) explicitly sets HTTP status code (200 = OK/Success)
  // Can be chained with .json() to send status + data
  res.status(200).json({
    status: 'OK',
    // process.uptime() returns seconds since server started
    uptime: process.uptime(),
    // process.memoryUsage() returns object with memory statistics in bytes
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// GET route with URL parameters (dynamic routes)
// :id is a route parameter - a placeholder in the URL
// Example: /users/123 -> req.params.id = "123"
//          /users/abc -> req.params.id = "abc"
app.get('/users/:id', (req, res) => {
  // req.params is an object containing all route parameters
  // Access with req.params.parameterName
  const userId = req.params.id;
  
  // In a real app, you'd query database here with userId
  // For now, simulate user data
  const user = {
    id: userId,
    name: \`User \${userId}\`,
    email: \`user\${userId}@example.com\`,
    createdAt: new Date().toISOString()
  };
  
  // Return standardized response format
  res.json({
    success: true,
    data: user
  });
});

// ========== DATABASE INTEGRATION EXAMPLES ==========
// In real applications, you'll query from a database like MongoDB
// Here's how to integrate with Mongoose (MongoDB ODM)

// First, define a User model (in models/User.js):
// const mongoose = require('mongoose');
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   age: { type: Number, min: 18 },
//   createdAt: { type: Date, default: Date.now }
// });
// const User = mongoose.model('User', userSchema);
// module.exports = User;

// GET route with DATABASE QUERY - Fetch users from MongoDB
// Query params for filtering, pagination, search
app.get('/api/users', async (req, res) => {
  try {
    // Extract query parameters with defaults
    const { page = 1, limit = 10, search } = req.query;
    
    // Calculate pagination values
    const skip = (page - 1) * limit;
    
    // ========== BUILD DATABASE QUERY ==========
    // Create query object for filtering
    let query = {};
    
    // If search term provided, add regex search on name
    // $regex allows pattern matching (like SQL LIKE)
    // $options: 'i' makes it case-insensitive
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    // ========== EXECUTE DATABASE QUERIES ==========
    // User.find(query) queries the database with filters
    // .limit(limit) restricts number of results
    // .skip(skip) skips results for pagination (e.g., skip 10 for page 2)
    // .sort({ createdAt: -1 }) sorts by newest first (-1 = descending)
    // await pauses execution until database query completes
    const users = await User.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });
    
    // Count total documents matching query (for pagination metadata)
    const total = await User.countDocuments(query);
    
    // Return paginated results with metadata
    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    // Error handling for database failures
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users from database'
    });
  }
});

// POST route with DATABASE INSERT - Create new user in MongoDB
app.post('/api/users', async (req, res) => {
  try {
    // Extract data from request body
    const { name, email, age } = req.body;
    
    // ========== VALIDATION ==========
    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required'
      });
    }
    
    // ========== DATABASE INSERT ==========
    // User.create() inserts new document into MongoDB
    // Mongoose automatically validates against schema
    // Returns the created document with auto-generated _id
    const newUser = await User.create({
      name,
      email,
      age: age || 18  // Default age if not provided
    });
    
    // Return created user with 201 status (Created)
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    // Handle duplicate email error (MongoDB unique constraint)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    // Other errors
    res.status(500).json({
      success: false,
      error: 'Failed to create user'
    });
  }
});

// PUT route with DATABASE UPDATE - Update existing user in MongoDB
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;
    
    // ========== DATABASE UPDATE ==========
    // User.findByIdAndUpdate() finds document by ID and updates it
    // First param: document ID to find
    // Second param: fields to update
    // Options object:
    //   - new: true returns the updated document (not the old one)
    //   - runValidators: true runs schema validation on update
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, age },
      { new: true, runValidators: true }
    );
    
    // Check if user exists
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Return updated user
    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    // Handle invalid ID format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
});

// ========== DEMO WITHOUT DATABASE (for learning) ==========
// Below is a simpler version without database for practice:
app.get('/api/demo-users', (req, res) => {
  // Extract query parameters
  const { page = 1, limit = 10, search } = req.query;
  
  // Generate mock data
  const users = Array.from({ length: limit }, (_, i) => ({
    id: (page - 1) * limit + i + 1,
    name: \`User \${(page - 1) * limit + i + 1}\`,
    email: \`user\${(page - 1) * limit + i + 1}@example.com\`
  }));
  
  // If search parameter exists, filter results
  // Ternary operator: condition ? trueValue : falseValue
  const filteredUsers = search 
    ? users.filter(user => 
        // .toLowerCase() for case-insensitive search
        // .includes() checks if string contains substring
        user.name.toLowerCase().includes(search.toLowerCase())
      )
    : users;  // If no search, return all users
  
  // Return paginated response with metadata
  res.json({
    success: true,
    data: filteredUsers,
    pagination: {
      page: parseInt(page),      // Convert string to number
      limit: parseInt(limit),
      total: 100                 // Total items (would come from database)
    }
  });
});</code></pre>
          </div>
          
          <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-blue-900 mb-3">🎯 Route Parameters vs Query Parameters</h4>
            <ul class="explanation-list space-y-2">
              <li><strong>Route Parameters (/users/:id):</strong> Part of the URL path, required, used for identifying resources</li>
              <li><strong>Query Parameters (?page=1&limit=10):</strong> After '?' in URL, optional, used for filtering/pagination</li>
              <li><strong>req.params:</strong> Object with route parameters - /users/123 → req.params.id = "123"</li>
              <li><strong>req.query:</strong> Object with query parameters - ?page=2&limit=5 → req.query = {page: "2", limit: "5"}</li>
            </ul>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📮 HTTP Methods (POST, PUT, DELETE)
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>// POST route - Create new user
// POST is used for CREATING new resources
// app.post(path, callback) handles HTTP POST requests
app.post('/api/users', (req, res) => {
  // req.body contains data sent from client (parsed by express.json() middleware)
  // Use destructuring to extract properties
  const { name, email, age } = req.body;
  
  // ========== INPUT VALIDATION ==========
  // Always validate user input before processing!
  // Check if required fields are present
  if (!name || !email) {
    // return stops function execution - prevents sending multiple responses
    // status(400) = Bad Request (client sent invalid data)
    return res.status(400).json({
      success: false,
      error: 'Name and email are required'
    });
  }
  
  // Create new user object
  // In real app: save to database and get actual ID
  const newUser = {
    // Math.random() generates 0-0.999, * 1000 makes it 0-999
    // Math.floor() rounds down to integer
    id: Math.floor(Math.random() * 1000),
    name,                                    // ES6 shorthand for name: name
    email,
    age: age || null,                        // Use provided age or null if not provided
    createdAt: new Date().toISOString()      // ISO string: "2024-01-15T10:30:00.000Z"
  };
  
  // In real application: await db.users.create(newUser)
  console.log('Creating user:', newUser);
  
  // status(201) = Created (resource successfully created)
  // 201 is the correct status code for POST requests that create resources
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
});

// PUT route - Update existing user (full update)
// PUT replaces the entire resource
// PATCH (not shown) would do partial updates
app.put('/api/users/:id', (req, res) => {
  // Get user ID from URL parameter
  const userId = req.params.id;
  
  // Get updated data from request body
  const { name, email, age } = req.body;
  
  // In real app: 
  // 1. Check if user exists in database
  // 2. Update user record
  // 3. Return updated user
  
  // Simulate updated user object
  const updatedUser = {
    id: userId,
    name,
    email,
    age,
    updatedAt: new Date().toISOString()      // Track when update happened
  };
  
  // In real app: await db.users.update(userId, updatedUser)
  console.log('Updating user:', updatedUser);
  
  // Status 200 is default for successful PUT
  res.json({
    success: true,
    message: 'User updated successfully',
    data: updatedUser
  });
});

// DELETE route - Remove user
// DELETE is used for REMOVING resources
app.delete('/api/users/:id', (req, res) => {
  // Extract user ID from URL
  const userId = req.params.id;
  
  // In real app:
  // 1. Check if user exists
  // 2. Delete user from database
  // 3. Return success message
  
  // Simulate deletion
  console.log('Deleting user with ID:', userId);
  
  // For DELETE, you can return 200 with message or 204 with no content
  // 200 = OK with response body
  // 204 = No Content (success but no response body)
  res.json({
    success: true,
    message: \`User \${userId} deleted successfully\`
  });
});</code></pre>
          </div>
          
          <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-green-900 mb-3">💡 CRUD Operations Explained</h4>
            <ul class="explanation-list space-y-2">
              <li><strong>POST (/api/users):</strong> CREATE - req.body contains new user data, returns 201 status</li>
              <li><strong>GET (/api/users/:id):</strong> READ - req.params.id identifies which user, returns 200 status</li>
              <li><strong>PUT (/api/users/:id):</strong> UPDATE - combines req.params.id + req.body, returns 200 status</li>
              <li><strong>DELETE (/api/users/:id):</strong> DELETE - req.params.id identifies user to delete, returns 200 or 204</li>
            </ul>
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
            <pre><code>// ========== ERROR HANDLING ==========
// Error handlers must come AFTER all routes

// 404 handler - Catches requests to undefined routes
// app.use('*') means "match ANY path that wasn't matched by routes above"
// This middleware only runs if no previous route handled the request
app.use('*', (req, res) => {
  // req.originalUrl contains the full requested URL
  // req.method contains HTTP method (GET, POST, etc.)
  res.status(404).json({
    success: false,
    error: \`Route \${req.originalUrl} not found\`,
    method: req.method
  });
});

// Global error handler - Catches ALL errors from routes/middleware
// MUST have 4 parameters (err, req, res, next) for Express to recognize it
// Express automatically calls this when:
//   1. You call next(error)
//   2. An error is thrown in async code
//   3. Any middleware/route throws an error
app.use((err, req, res, next) => {
  // Log error details to console for debugging
  console.error('Error:', err);
  
  // Extract status code from error object or default to 500
  // Custom errors can have err.statusCode = 400, 403, etc.
  const statusCode = err.statusCode || 500;
  
  // Get error message or use generic message
  const message = err.message || 'Internal Server Error';
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    // Spread operator (...) conditionally adds stack trace in development
    // && is a short-circuit: if left is true, evaluate right
    // Shows full error stack only in development (security: hide in production)
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ========== GRACEFUL SHUTDOWN ==========
// Handle process termination signals to close server cleanly

// SIGTERM = termination signal (sent by process managers like PM2, Docker)
// process.on() registers an event listener
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  // Close database connections, finish pending requests, etc.
  // process.exit(0) = exit with success code
  process.exit(0);
});

// SIGINT = interrupt signal (sent when you press Ctrl+C)
process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});</code></pre>
          </div>
          
          <div class="explanation-box bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-red-900 mb-3">⚠️ Error Handling Best Practices</h4>
            <ul class="explanation-list space-y-2">
              <li><strong>Order matters:</strong> 404 handler after routes, error handler last</li>
              <li><strong>4 parameters:</strong> Error middleware MUST have (err, req, res, next)</li>
              <li><strong>Status codes:</strong> Use appropriate codes (400 client errors, 500 server errors)</li>
              <li><strong>Security:</strong> Don't expose stack traces in production</li>
              <li><strong>Logging:</strong> Always log errors for debugging</li>
            </ul>
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

          <div class="lesson-section mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              🎯 Practice: Consuming External APIs
            </h2>
            <p class="text-gray-700 mb-4">
              Now let's practice making HTTP requests to an external API using fetch(). We have a Countries API running at 
              <code class="bg-gray-100 px-2 py-1 rounded">http://localhost:3000/api</code> with the following endpoints:
            </p>

            <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 class="font-semibold text-green-900 mb-3">📡 Available Endpoints</h4>
              <ul class="explanation-list space-y-2">
                <li><strong>GET /api/countries</strong> - Get all countries</li>
                <li><strong>GET /api/countries?continent=Asia</strong> - Filter by continent</li>
                <li><strong>GET /api/cities?countryId=3</strong> - Get cities for country ID 3 (Japan)</li>
                <li><strong>GET /api/cities?isCapital=true</strong> - Get only capital cities</li>
                <li><strong>GET /api/languages?minSpeakers=100000000</strong> - Languages with 100M+ speakers</li>
              </ul>
            </div>

            <h3 class="text-xl font-semibold text-gray-800 mb-3">Practice Task 1: Fetch All Countries</h3>
            <p class="text-gray-700 mb-4">
              Make a GET request to <code class="bg-gray-100 px-2 py-1 rounded">http://localhost:3000/api/countries</code> 
              and display the name, capital, and population of each country.
            </p>

            <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
              <pre><code>// Practice: Fetch all countries
async function fetchCountries() {
  try {
    const response = await fetch('http://localhost:3000/api/countries');
    const data = await response.json();
    
    console.log(\`Found \${data.count} countries:\\n\`);
    
    data.data.forEach(country => {
      console.log(\`\${country.name} (\${country.code})\`);
      console.log(\`  Capital: \${country.capital}\`);
      console.log(\`  Population: \${country.population.toLocaleString()}\`);
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchCountries();</code></pre>
            </div>

            <h3 class="text-xl font-semibold text-gray-800 mb-3">Practice Task 2: Get Cities for Japan</h3>
            <p class="text-gray-700 mb-4">
              Make a request to get all cities in Japan (country ID: 3). Display each city name and whether it's a capital.
            </p>

            <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
              <pre><code>// Practice: Get cities for Japan (ID: 3)
async function fetchJapanCities() {
  try {
    const response = await fetch('http://localhost:3000/api/cities?countryId=3');
    const data = await response.json();
    
    console.log('Cities in Japan:');
    data.data.forEach(city => {
      const capitalBadge = city.isCapital ? '👑 ' : '';
      console.log(\`\${capitalBadge}\${city.name} - Population: \${city.population.toLocaleString()}\`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchJapanCities();</code></pre>
            </div>

            <h3 class="text-xl font-semibold text-gray-800 mb-3">Practice Task 3: Filter Countries by Continent</h3>
            <p class="text-gray-700 mb-4">
              Make a request to get all countries in Europe and display them sorted by population (highest first).
            </p>

            <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
              <pre><code>// Practice: Get European countries sorted by population
async function fetchEuropeanCountries() {
  try {
    const response = await fetch('http://localhost:3000/api/countries?continent=Europe');
    const data = await response.json();
    
    // Sort by population descending
    const sorted = data.data.sort((a, b) => b.population - a.population);
    
    console.log('European Countries (by population):\\n');
    sorted.forEach((country, index) => {
      console.log(\`\${index + 1}. \${country.name}: \${country.population.toLocaleString()}\`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchEuropeanCountries();</code></pre>
            </div>

            <div class="explanation-box bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <h4 class="font-semibold text-purple-900 mb-3">💪 More Practice Tasks</h4>
              <ul class="explanation-list space-y-2">
                <li><strong>Task 4:</strong> Request all capital cities using <code>?isCapital=true</code></li>
                <li><strong>Task 5:</strong> Get languages with at least 100M speakers using <code>?minSpeakers=100000000</code></li>
                <li><strong>Challenge:</strong> Fetch all Asian countries, then for each country fetch its cities, and calculate the total population</li>
              </ul>
            </div>
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
