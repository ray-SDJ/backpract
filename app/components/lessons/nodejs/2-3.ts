import { LessonData } from "../types";

const lessonData: LessonData = {
  title: "Express Routing & Middleware",
  difficulty: "Intermediate",
  description:
    "Master Express.js routing patterns, middleware architecture, and modular application structure.",
  objectives: [
    "Understand advanced routing patterns and parameters",
    "Create and use custom middleware functions",
    "Implement modular routing with Express Router",
    "Handle authentication and authorization middleware",
    "Build middleware chains for complex request processing",
  ],
  content: `
    <div class="lesson-card bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
      <div class="lesson-content p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Express Routing & Middleware</h1>
        
        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🛤️ Advanced Routing Patterns
          </h2>
          <p class="text-gray-700 mb-4 leading-relaxed">
            Express routing goes beyond basic CRUD operations. Learn how to create flexible, 
            maintainable routing systems with parameters, wildcards, and modular organization.
          </p>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>// Route parameters and patterns
const express = require('express');
const app = express();

// Basic parameter
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: \`User ID: \${id}\` });
});

// Multiple parameters
app.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.json({ 
    message: \`User \${userId}, Post \${postId}\`,
    params: req.params
  });
});

// Optional parameters (using ?)
app.get('/products/:id/:variant?', (req, res) => {
  const { id, variant } = req.params;
  res.json({ 
    productId: id,
    variant: variant || 'default'
  });
});

// Wildcard parameters (using *)
app.get('/files/*', (req, res) => {
  const filePath = req.params[0]; // Everything after /files/
  res.json({ 
    message: 'File requested',
    path: filePath
  });
});

// Regular expression patterns
app.get(/.*fly$/, (req, res) => {
  res.json({ message: 'Path ends with "fly"' });
});

// Parameter validation with regex
app.get('/users/:id(\\\\d+)', (req, res) => {
  // Only matches if id is numeric
  res.json({ userId: req.params.id });
});</code></pre>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🔗 Middleware Fundamentals
          </h2>
          
          <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-blue-900 mb-3">🧩 What is Middleware?</h4>
            <p class="text-blue-800 mb-3">
              Middleware functions are functions that have access to the request object (req), 
              the response object (res), and the next middleware function in the application's request-response cycle.
            </p>
            <ul class="explanation-list space-y-2">
              <li><strong>Execute code:</strong> Run any code during request processing</li>
              <li><strong>Modify objects:</strong> Make changes to req and res objects</li>
              <li><strong>End cycle:</strong> End the request-response cycle</li>
              <li><strong>Call next:</strong> Call the next middleware in the stack</li>
            </ul>
          </div>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>// Custom middleware examples

// Logging middleware
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const userAgent = req.get('User-Agent');
  
  console.log(\`[\${timestamp}] \${method} \${url} - \${userAgent}\`);
  
  // Add request ID for tracing
  req.requestId = Math.random().toString(36).substr(2, 9);
  
  next(); // Important: call next() to continue to next middleware
};

// Authentication middleware
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Provide a valid token.'
    });
  }
  
  const token = authHeader.substring(7); // Remove 'Bearer '
  
  // In real app, verify JWT token here
  if (token === 'valid-token') {
    req.user = { id: 1, name: 'John Doe', role: 'user' };
    next();
  } else {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

// Role-based authorization
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }
    
    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        error: \`Access denied. \${role} role required.\`
      });
    }
    
    next();
  };
};

// Request validation middleware
const validateUser = (req, res, next) => {
  const { name, email } = req.body;
  
  const errors = [];
  
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!email || !email.includes('@')) {
    errors.push('Valid email is required');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
  
  // Sanitize input
  req.body.name = name.trim();
  req.body.email = email.toLowerCase().trim();
  
  next();
};</code></pre>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📁 Modular Routing with Express Router
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>// routes/users.js - Modular user routes
const express = require('express');
const router = express.Router();

// Middleware specific to this router
router.use(requestLogger);

// Routes relative to /api/users
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ]
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    success: true,
    data: { id, name: \`User \${id}\`, email: \`user\${id}@example.com\` }
  });
});

router.post('/', validateUser, requireAuth, (req, res) => {
  const userData = req.body;
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: { id: Date.now(), ...userData }
  });
});

router.put('/:id', requireAuth, validateUser, (req, res) => {
  const { id } = req.params;
  const userData = req.body;
  res.json({
    success: true,
    message: 'User updated successfully',
    data: { id, ...userData }
  });
});

router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const { id } = req.params;
  res.json({
    success: true,
    message: \`User \${id} deleted successfully\`
  });
});

module.exports = router;</code></pre>
          </div>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>// routes/posts.js - Posts routes
const express = require('express');
const router = express.Router();

// Get all posts
router.get('/', (req, res) => {
  const { page = 1, limit = 10, author } = req.query;
  
  // Simulate posts data
  const posts = Array.from({ length: limit }, (_, i) => ({
    id: (page - 1) * limit + i + 1,
    title: \`Post \${(page - 1) * limit + i + 1}\`,
    content: 'Lorem ipsum dolor sit amet...',
    author: author || 'Anonymous',
    createdAt: new Date().toISOString()
  }));
  
  res.json({
    success: true,
    data: posts,
    pagination: { page: +page, limit: +limit }
  });
});

// Get posts by user
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  
  const userPosts = [
    {
      id: 1,
      title: \`Post by user \${userId}\`,
      content: 'User specific content...',
      userId,
      createdAt: new Date().toISOString()
    }
  ];
  
  res.json({
    success: true,
    data: userPosts
  });
});

// Create post (requires authentication)
router.post('/', requireAuth, (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      error: 'Title and content are required'
    });
  }
  
  const newPost = {
    id: Date.now(),
    title,
    content,
    userId,
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: newPost
  });
});

module.exports = router;</code></pre>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🏗️ Main Application Setup
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>// app.js - Main application file
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import route modules
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');

const app = express();

// Global middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Request logging
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Custom global middleware
app.use(requestLogger);

// API routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Express API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      posts: '/api/posts',
      health: '/health'
    }
  });
});

// 404 handler (must be after all routes)
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: \`Route \${req.method} \${req.originalUrl} not found\`
  });
});

// Global error handler (must be last)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    requestId: req.requestId,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
  console.log(\`📊 Health check: http://localhost:\${PORT}/health\`);
  console.log(\`👥 Users API: http://localhost:\${PORT}/api/users\`);
  console.log(\`📝 Posts API: http://localhost:\${PORT}/api/posts\`);
});</code></pre>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            ⚙️ Middleware Patterns & Best Practices
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>// middleware/index.js - Centralized middleware
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// Rate limiting middleware
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// Speed limiting middleware
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // Allow 100 requests per windowMs without delay
  delayMs: 500 // Add 500ms delay for each request after delayAfter
});

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Request size limiter
const sizeLimiter = (req, res, next) => {
  const contentLength = req.get('Content-Length');
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (contentLength && parseInt(contentLength) > maxSize) {
    return res.status(413).json({
      success: false,
      error: 'Request entity too large'
    });
  }
  
  next();
};

// Cache middleware
const cache = require('memory-cache');

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);
    
    if (cachedResponse) {
      return res.json(cachedResponse);
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      cache.put(key, body, duration * 1000);
      res.sendResponse(body);
    };
    
    next();
  };
};

module.exports = {
  createRateLimiter,
  speedLimiter,
  corsOptions,
  sizeLimiter,
  cacheMiddleware
};</code></pre>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 class="font-semibold text-green-900 mb-3">✅ Middleware Best Practices</h4>
              <ul class="explanation-list space-y-2 text-sm">
                <li><strong>Order matters:</strong> Place middleware in correct sequence</li>
                <li><strong>Always call next():</strong> Unless ending the cycle</li>
                <li><strong>Error handling:</strong> Use error middleware</li>
                <li><strong>Modularity:</strong> Separate concerns into modules</li>
              </ul>
            </div>
            
            <div class="explanation-box bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 class="font-semibold text-red-900 mb-3">⚠️ Common Pitfalls</h4>
              <ul class="explanation-list space-y-2 text-sm">
                <li><strong>Forgetting next():</strong> Request hangs</li>
                <li><strong>Wrong order:</strong> Middleware doesn't execute</li>
                <li><strong>Memory leaks:</strong> Not cleaning up resources</li>
                <li><strong>Blocking code:</strong> Synchronous operations</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🎯 Practice Exercise
          </h2>
          
          <div class="practice-box bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-yellow-900 mb-3">🏪 Build an E-commerce API</h4>
            <p class="text-yellow-800 mb-3">Create a modular e-commerce API with the following structure:</p>
            <ol class="list-decimal list-inside space-y-2 text-yellow-800">
              <li><strong>Products Router:</strong> CRUD operations for products</li>
              <li><strong>Categories Router:</strong> Manage product categories</li>
              <li><strong>Orders Router:</strong> Handle customer orders (requires auth)</li>
              <li><strong>Auth Middleware:</strong> JWT token validation</li>
              <li><strong>Admin Middleware:</strong> Role-based access control</li>
              <li><strong>Validation Middleware:</strong> Input validation for all POST/PUT routes</li>
              <li><strong>Rate Limiting:</strong> Different limits for public vs authenticated routes</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  `,
  practiceInstructions: [
    "How do you create a router using express.Router()?",
    "How do you define routes on a router (router.get, router.post)?",
    "How do you create a middleware function with (req, res, next) signature?",
    "Why must middleware call next() to pass control to the next handler?",
    "How do you mount a router on your app using app.use()?",
    "Create a router with at least one route",
    "Create a custom middleware that calls next()",
  ],
  hints: [
    "Use express.Router() to create modular route handlers",
    "Authentication middleware should add user info to req.user",
    "Validation middleware should sanitize input and return detailed errors",
    "Use middleware factories to create configurable middleware functions",
    "Remember to handle both sync and async errors in middleware",
    "Test middleware order - security middleware should come before route handlers",
  ],
  solution: `
// Complete modular structure example:

// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'Token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

const authorize = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, error: 'Insufficient permissions' });
  }
  next();
};

// routes/products.js
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', (req, res) => {
  // Public route - get all products
});

router.post('/', authenticate, authorize(['admin']), (req, res) => {
  // Admin only - create product
});

router.put('/:id', authenticate, authorize(['admin']), (req, res) => {
  // Admin only - update product
});

// app.js
const express = require('express');
const productRoutes = require('./routes/products');
const { createRateLimiter } = require('./middleware');

const app = express();

// Global middleware
app.use(express.json());
app.use(createRateLimiter(15 * 60 * 1000, 100, 'Too many requests'));

// Routes
app.use('/api/products', productRoutes);

module.exports = app;
  `,
  validationCriteria: {
    requiredIncludes: ["express.Router()", "router.", "app.use(", "next()"],
    requiredPatterns: [
      /const\s+router\s*=\s*express\.Router\(\)/,
      /router\.(get|post|put|delete)\s*\(/,
      /\(req,\s*res,\s*next\)\s*=>/,
      /app\.use\s*\(['"]/,
    ],
    minLines: 20,
    customValidator: (code: string) => {
      const hasRouter = /express\.Router\(\)/.test(code);
      const hasRouterRoute = /router\.(get|post|put|delete)/.test(code);
      const hasMiddleware = /\(req,\s*res,\s*next\)/.test(code);
      const hasAppUse = /app\.use\s*\(/.test(code);
      const hasNextCall = /next\(\)/.test(code);

      if (!hasRouter) {
        return {
          valid: false,
          message: "Must create a router using express.Router()",
        };
      }
      if (!hasRouterRoute) {
        return {
          valid: false,
          message:
            "Must define routes on the router (router.get, router.post, etc.)",
        };
      }
      if (!hasMiddleware) {
        return {
          valid: false,
          message: "Must create middleware with (req, res, next) signature",
        };
      }
      if (!hasNextCall) {
        return {
          valid: false,
          message: "Middleware must call next() to pass control",
        };
      }
      if (!hasAppUse) {
        return { valid: false, message: "Must mount router using app.use()" };
      }

      return {
        valid: true,
        message: "Express routing and middleware implemented correctly!",
      };
    },
  },
  starterCode: `// Implement modular routing and custom middleware
const express = require('express');
const app = express();

// TODO: Create an Express Router
// const router = express.Router();

// TODO: Create a custom middleware function
// Example: (req, res, next) => { /* logic */ next(); }

// TODO: Add routes to the router
// router.get('/users', ...)
// router.post('/users', ...)

// TODO: Mount the router on the app
// app.use('/api', router);

// TODO: Add error handling middleware

const PORT = 3000;
app.listen(PORT, () => console.log(\`Server on port \${PORT}\`));
`,
};

export default lessonData;
export { lessonData };
