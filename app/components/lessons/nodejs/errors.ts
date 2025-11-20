import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Error & Exception Handling in Node.js",
  description:
    "Master error handling in Node.js with try-catch, promises, async/await, custom errors, and Express middleware for building robust applications.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <h2>Understanding Errors in Node.js</h2>
    <p>Node.js has both synchronous and asynchronous error handling patterns. Understanding both is crucial for building reliable applications.</p>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🔍 Node.js Error Patterns</h4>
      <ul class="text-sm text-blue-800 space-y-1 ml-4">
        <li>• <strong>Synchronous errors:</strong> Use try-catch blocks</li>
        <li>• <strong>Callback errors:</strong> Error-first callbacks (err, data)</li>
        <li>• <strong>Promise errors:</strong> Use .catch() or try-catch with async/await</li>
        <li>• <strong>Event emitter errors:</strong> Listen for 'error' events</li>
        <li>• <strong>Unhandled rejections:</strong> Global handlers for process</li>
      </ul>
    </div>

    <h2>Synchronous Error Handling</h2>
    <p>Use try-catch for synchronous code:</p>

    <pre class="code-block">
      <code>
// Basic try-catch
function parseJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    return data;
  } catch (error) {
    console.error('JSON parsing failed:', error.message);
    return null;
  }
}

// Multiple error types
function processNumber(value) {
  try {
    if (typeof value !== 'number') {
      throw new TypeError('Value must be a number');
    }
    
    if (value < 0) {
      throw new RangeError('Value must be positive');
    }
    
    return value * 2;
  } catch (error) {
    if (error instanceof TypeError) {
      console.error('Type error:', error.message);
    } else if (error instanceof RangeError) {
      console.error('Range error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
    return 0;
  }
}

// Finally for cleanup
function readFileSync(filename) {
  let fd;
  try {
    fd = fs.openSync(filename, 'r');
    const content = fs.readFileSync(fd, 'utf8');
    return content;
  } catch (error) {
    console.error('File read error:', error);
    throw error;
  } finally {
    if (fd !== undefined) {
      fs.closeSync(fd);
    }
  }
}
      </code>
    </pre>

    <h2>Error-First Callbacks</h2>
    <p>Traditional Node.js callback pattern:</p>

    <pre class="code-block">
      <code>
const fs = require('fs');

// Error-first callback pattern
function readConfig(filename, callback) {
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      // Always check error first
      if (err.code === 'ENOENT') {
        return callback(new Error(\`Config file not found: \${filename}\`));
      }
      return callback(err);
    }
    
    try {
      const config = JSON.parse(data);
      callback(null, config);
    } catch (parseError) {
      callback(new Error(\`Invalid JSON in config: \${parseError.message}\`));
    }
  });
}

// Usage
readConfig('config.json', (err, config) => {
  if (err) {
    console.error('Failed to load config:', err.message);
    return;
  }
  
  console.log('Config loaded:', config);
});

// Promisify callback functions
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

async function readConfigAsync(filename) {
  try {
    const data = await readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(\`Failed to read config: \${error.message}\`);
  }
}
      </code>
    </pre>

    <h2>Promise Error Handling</h2>
    <p>Handle errors in Promises using .catch() or async/await:</p>

    <pre class="code-block">
      <code>
// Using .catch()
function fetchUserData(userId) {
  return fetch(\`/api/users/\${userId}\`)
    .then(response => {
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      return response.json();
    })
    .then(data => {
      console.log('User data:', data);
      return data;
    })
    .catch(error => {
      console.error('Failed to fetch user:', error);
      throw error; // Re-throw for caller
    });
}

// Using async/await (preferred)
async function fetchUserDataAsync(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// Multiple async operations
async function processUserOrder(userId, orderId) {
  try {
    const [user, order] = await Promise.all([
      fetchUser(userId),
      fetchOrder(orderId)
    ]);
    
    if (user.id !== order.userId) {
      throw new Error('Order does not belong to user');
    }
    
    return { user, order };
  } catch (error) {
    if (error.message.includes('not found')) {
      console.error('Resource not found:', error);
    } else {
      console.error('Processing failed:', error);
    }
    throw error;
  }
}
      </code>
    </pre>

    <h2>Custom Error Classes</h2>
    <p>Create specific error types for your application:</p>

    <pre class="code-block">
      <code>
// Base custom error
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types
class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(\`\${resource} not found\`, 404);
    this.name = 'NotFoundError';
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

class DatabaseError extends AppError {
  constructor(message, originalError) {
    super(message, 500);
    this.name = 'DatabaseError';
    this.originalError = originalError;
  }
}

// Usage
async function getUser(userId) {
  if (!userId) {
    throw new ValidationError('User ID is required');
  }
  
  const user = await db.users.findById(userId);
  
  if (!user) {
    throw new NotFoundError('User');
  }
  
  return user;
}

// Error handler checks error type
function handleError(error) {
  if (error instanceof ValidationError) {
    console.log('Validation failed:', error.message);
  } else if (error instanceof NotFoundError) {
    console.log('Resource not found:', error.message);
  } else if (error instanceof AppError) {
    console.log(\`App error (\${error.statusCode}):\`, error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
      </code>
    </pre>

    <h2>Express Error Handling</h2>
    <p>Centralized error handling in Express applications:</p>

    <pre class="code-block">
      <code>
const express = require('express');
const app = express();

// Async wrapper to catch errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes with async handlers
app.get('/api/users/:id', asyncHandler(async (req, res) => {
  const user = await getUser(req.params.id);
  
  if (!user) {
    throw new NotFoundError('User');
  }
  
  res.json(user);
}));

app.post('/api/users', asyncHandler(async (req, res) => {
  const { email, name } = req.body;
  
  if (!email || !name) {
    throw new ValidationError('Email and name are required');
  }
  
  const user = await createUser({ email, name });
  res.status(201).json(user);
}));

// 404 handler
app.use((req, res, next) => {
  const error = new NotFoundError('Route');
  next(error);
});

// Global error handler (must be last)
app.use((error, req, res, next) => {
  // Log error
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method
  });
  
  // Send response
  const statusCode = error.statusCode || 500;
  const message = error.isOperational 
    ? error.message 
    : 'Internal server error';
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});
      </code>
    </pre>

    <div class="complexity-table bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-gray-900 mb-3">📊 Common Error Types in Node.js</h4>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-300">
            <th class="text-left py-2">Error Type</th>
            <th class="text-left py-2">When It Occurs</th>
            <th class="text-left py-2">Example</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>Error</code></td>
            <td class="py-2">Generic error</td>
            <td class="py-2">throw new Error('Oops')</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>TypeError</code></td>
            <td class="py-2">Wrong type used</td>
            <td class="py-2">null.toString()</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>ReferenceError</code></td>
            <td class="py-2">Undefined variable</td>
            <td class="py-2">console.log(x)</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>SyntaxError</code></td>
            <td class="py-2">Invalid syntax</td>
            <td class="py-2">JSON.parse('invalid')</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>RangeError</code></td>
            <td class="py-2">Value out of range</td>
            <td class="py-2">new Array(-1)</td>
          </tr>
          <tr>
            <td class="py-2">System Errors</td>
            <td class="py-2">OS-level errors</td>
            <td class="py-2">ENOENT, EACCES</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>Unhandled Errors & Process Events</h2>
    <p>Handle uncaught exceptions and unhandled rejections:</p>

    <pre class="code-block">
      <code>
// Unhandled Promise Rejection
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  
  // Log to error tracking service
  logErrorToService(reason);
  
  // Graceful shutdown in production
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Uncaught Exception (last resort)
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  
  // Log error
  logErrorToService(error);
  
  // Exit process (app is in unknown state)
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Warning events
process.on('warning', (warning) => {
  console.warn('Warning:', warning.name);
  console.warn(warning.message);
  console.warn(warning.stack);
});
      </code>
    </pre>

    <h2>Error Logging Best Practices</h2>
    <p>Use a proper logging library like Winston or Pino:</p>

    <pre class="code-block">
      <code>
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ 
      filename: 'error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'combined.log' 
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Log errors with context
async function processOrder(orderId) {
  try {
    const order = await getOrder(orderId);
    await validateOrder(order);
    await processPayment(order);
    
    logger.info('Order processed successfully', { orderId });
  } catch (error) {
    logger.error('Order processing failed', {
      orderId,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

// Create logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: \`\${duration}ms\`
    });
  });
  
  next();
};

app.use(requestLogger);
      </code>
    </pre>

    <div class="quick-test bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-2">✅ Error Handling Best Practices</h4>
      <ul class="text-sm text-green-800 space-y-1">
        <li>✓ Always handle promise rejections (use .catch() or try-catch)</li>
        <li>✓ Use async/await instead of promise chains for cleaner code</li>
        <li>✓ Create custom error classes for different error types</li>
        <li>✓ Centralize error handling in Express with middleware</li>
        <li>✓ Log errors with context (user ID, request ID, timestamp)</li>
        <li>✓ Handle process-level events (unhandledRejection, uncaughtException)</li>
        <li>✓ Return appropriate HTTP status codes in APIs</li>
        <li>✓ Never expose stack traces to clients in production</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Handle synchronous and asynchronous errors in Node.js",
    "Use try-catch with async/await for promise error handling",
    "Create custom error classes for specific error types",
    "Implement centralized error handling in Express",
    "Handle unhandled rejections and uncaught exceptions",
    "Log errors effectively with proper context",
  ],
  practiceInstructions: [
    "Create an async function that handles multiple error types (validation, not found, database)",
    "Build an Express error handling middleware that returns appropriate status codes",
    "Implement a custom error class hierarchy (AppError, ValidationError, NotFoundError)",
    "Set up process-level error handlers for unhandled rejections",
    "Create an asyncHandler wrapper to catch errors in Express routes",
  ],
  hints: [
    "Use try-catch blocks around await statements",
    "Error middleware in Express has 4 parameters: (err, req, res, next)",
    "Custom errors should extend Error and set statusCode property",
    "process.on('unhandledRejection', handler) catches unhandled promises",
    "asyncHandler returns a function that wraps async route handlers",
  ],
  solution: `const express = require('express');
const app = express();

// 1. Custom Error Classes
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(\`\${resource} not found\`, 404);
    this.name = 'NotFoundError';
  }
}

class DatabaseError extends AppError {
  constructor(message) {
    super(message, 500);
    this.name = 'DatabaseError';
  }
}

// 2. Async Handler Wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 3. Multi-error handling function
async function processUserData(userId, data) {
  try {
    // Validation error
    if (!data.email || !data.name) {
      throw new ValidationError('Email and name are required');
    }
    
    // Database operation (simulated)
    const user = await db.users.findById(userId);
    
    // Not found error
    if (!user) {
      throw new NotFoundError('User');
    }
    
    // Update user
    const updated = await db.users.update(userId, data);
    return updated;
    
  } catch (error) {
    // Database error
    if (error.code === 'ECONNREFUSED') {
      throw new DatabaseError('Database connection failed');
    }
    
    // Re-throw known errors
    if (error instanceof AppError) {
      throw error;
    }
    
    // Wrap unknown errors
    throw new AppError(error.message);
  }
}

// 4. Express Error Middleware
app.use((error, req, res, next) => {
  console.error(\`Error: \${error.message}\`);
  
  const statusCode = error.statusCode || 500;
  const message = error.isOperational 
    ? error.message 
    : 'Internal server error';
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack 
    })
  });
});

// 5. Process-level Error Handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Example route using asyncHandler
app.post('/api/users/:id', asyncHandler(async (req, res) => {
  const result = await processUserData(req.params.id, req.body);
  res.json(result);
}));

console.log('Error handling setup complete!');`,
};
