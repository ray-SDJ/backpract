import React from "react";
import { Zap, Code, Shield } from "lucide-react";

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

export const ApiSection = {
  id: "api",
  title: "REST API Development",
  icon: Zap,
  overview: "Building robust RESTful APIs with Express.js",
  content: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-900 mb-3">
          ⚡ REST API Development with Express
        </h3>
        <p className="text-purple-800 leading-relaxed">
          Master the art of building RESTful APIs with Express.js. Learn routing
          patterns, middleware architecture, request validation, error handling,
          and API documentation for production-ready applications.
        </p>
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-blue-400" />
          <h4 className="text-white font-semibold">API Structure & Routing</h4>
        </div>

        <CodeExplanation
          code={`// src/routes/api.js - Main API router
const express = require('express');
const userRoutes = require('./users');
const authRoutes = require('./auth');
const postRoutes = require('./posts');
const { authenticate } = require('../middleware/auth');
const { rateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply rate limiting to all API routes
router.use(rateLimiter);

// API documentation endpoint
router.get('/', (req, res) => {
  res.json({
    name: 'My API',
    version: '1.0.0',
    description: 'RESTful API built with Node.js and Express',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      posts: '/api/posts'
    },
    documentation: '/api/docs'
  });
});

// Public routes
router.use('/auth', authRoutes);

// Protected routes (require authentication)
router.use('/users', authenticate, userRoutes);
router.use('/posts', authenticate, postRoutes);

module.exports = router;

// src/routes/users.js - User-specific routes
const express = require('express');
const userController = require('../controllers/userController');
const { validateUser, validateUserId } = require('../middleware/validation');
const { authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/users - Get all users (with filtering)
router.get('/', userController.getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', validateUserId, userController.getUserById);

// POST /api/users - Create new user (admin only)
router.post('/', 
  authorize('admin'), 
  validateUser, 
  userController.createUser
);

// PUT /api/users/:id - Update user
router.put('/:id', 
  validateUserId, 
  validateUser, 
  userController.updateUser
);

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', 
  validateUserId, 
  authorize('admin'), 
  userController.deleteUser
);

// GET /api/users/:id/posts - Get user's posts
router.get('/:id/posts', validateUserId, userController.getUserPosts);

module.exports = router;`}
          explanation={[
            {
              label: "Router modularity",
              desc: "Separate routers for different resources and concerns",
            },
            {
              label: "Middleware stacking",
              desc: "Chain multiple middleware functions for validation and auth",
            },
            {
              label: "Route parameters",
              desc: "Dynamic segments in URLs for resource identification",
            },
            {
              label: "HTTP methods",
              desc: "RESTful mapping of CRUD operations to HTTP verbs",
            },
            {
              label: "Route-specific middleware",
              desc: "Apply middleware only to specific routes as needed",
            },
          ]}
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-green-400" />
          <h4 className="text-white font-semibold">
            Request Validation & Middleware
          </h4>
        </div>

        <CodeExplanation
          code={`// src/middleware/validation.js
const Joi = require('joi');

// User validation schema
const userSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': 'Name is required'
    }),
  
  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain uppercase, lowercase, number and special character'
    }),
  
  role: Joi.string()
    .valid('user', 'admin')
    .default('user'),
  
  profile: Joi.object({
    avatar: Joi.string().uri(),
    bio: Joi.string().max(500),
    socialLinks: Joi.object({
      twitter: Joi.string().uri(),
      linkedin: Joi.string().uri(),
      github: Joi.string().uri()
    })
  })
});

// Validation middleware factory
const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    req.body = value; // Use validated and sanitized data
    next();
  };
};

// Specific validation middleware
exports.validateUser = validateSchema(userSchema);

exports.validateUserId = (req, res, next) => {
  const { error } = Joi.string().hex().length(24).validate(req.params.id);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid user ID format'
    });
  }
  
  next();
};

// File upload validation
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and WebP allowed.'), false);
  }
};

exports.uploadAvatar = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}).single('avatar');`}
          explanation={[
            {
              label: "Joi validation",
              desc: "Powerful schema-based validation with custom messages",
            },
            {
              label: "Sanitization",
              desc: "Clean and transform input data automatically",
            },
            {
              label: "Error formatting",
              desc: "Consistent error response format for client consumption",
            },
            {
              label: "File upload",
              desc: "Secure file upload with type and size validation",
            },
            {
              label: "Middleware factory",
              desc: "Reusable validation patterns for different schemas",
            },
          ]}
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h4 className="text-white font-semibold">Advanced API Features</h4>
        </div>

        <CodeExplanation
          code={`// src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('../config/redis');

// Different rate limits for different endpoints
exports.rateLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'api_limit:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
    retryAfter: Math.ceil(15 * 60 * 1000 / 1000) // in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for auth endpoints
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  message: {
    success: false,
    error: 'Too many login attempts, please try again later.'
  }
});

// src/middleware/apiFeatures.js - Query features
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Advanced filtering (gte, gt, lte, lt)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\\b(gte|gt|lte|lt)\\b/g, match => \`$\${match}\`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.pagination = { page, limit, skip };
    return this;
  }

  search() {
    if (this.queryString.search) {
      this.query = this.query.find({
        $text: { $search: this.queryString.search }
      });
    }
    return this;
  }
}

// Usage in controller
exports.getAllUsers = async (req, res) => {
  const features = new ApiFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .search();

  const users = await features.query;
  const total = await User.countDocuments();

  res.json({
    success: true,
    results: users.length,
    pagination: {
      ...features.pagination,
      total,
      pages: Math.ceil(total / features.pagination.limit)
    },
    data: users
  });
};

// src/middleware/cache.js - Response caching
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes default

exports.cacheMiddleware = (duration = 600) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Store original res.json
    const originalJson = res.json;

    // Override res.json to cache the response
    res.json = function(data) {
      cache.set(key, data, duration);
      return originalJson.call(this, data);
    };

    next();
  };
};`}
          explanation={[
            {
              label: "Rate limiting",
              desc: "Protect API from abuse with configurable request limits",
            },
            {
              label: "Query features",
              desc: "Advanced filtering, sorting, pagination, and field selection",
            },
            {
              label: "Text search",
              desc: "Full-text search capabilities with MongoDB indexes",
            },
            {
              label: "Response caching",
              desc: "Improve performance by caching GET request responses",
            },
            {
              label: "Middleware chaining",
              desc: "Compose multiple query operations fluently",
            },
          ]}
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-purple-400" />
          <h4 className="text-white font-semibold">
            API Documentation & Testing
          </h4>
        </div>

        <CodeExplanation
          code={`// src/docs/swagger.js - API Documentation with Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'A Node.js Express API with authentication and CRUD operations',
      contact: {
        name: 'API Support',
        email: 'support@myapi.com'
      }
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            id: {
              type: 'string',
              description: 'User unique identifier'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message'
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/models/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     total: { type: integer }
 *                     pages: { type: integer }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// tests/api/users.test.js - API Testing with Jest & Supertest
const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');

describe('Users API', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    // Create test user and get auth token
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword123'
    });

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword123'
      });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await User.findByIdAndDelete(testUser._id);
  });

  describe('GET /api/users', () => {
    test('should return users list when authenticated', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', \`Bearer \${authToken}\`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.pagination).toBeDefined();
    });

    test('should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('should support pagination', async () => {
      const response = await request(app)
        .get('/api/users?page=1&limit=5')
        .set('Authorization', \`Bearer \${authToken}\`)
        .expect(200);

      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(5);
    });
  });

  describe('POST /api/users', () => {
    test('should create user with valid data', async () => {
      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'newpassword123',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', \`Bearer \${authToken}\`)
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(userData.name);
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.password).toBeUndefined();
    });

    test('should return 400 for invalid data', async () => {
      const invalidData = {
        name: '',
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', \`Bearer \${authToken}\`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.details).toBeDefined();
    });
  });
});`}
          explanation={[
            {
              label: "OpenAPI 3.0",
              desc: "Industry-standard API documentation with interactive UI",
            },
            {
              label: "Schema definitions",
              desc: "Reusable data models for consistent documentation",
            },
            {
              label: "JSDoc annotations",
              desc: "Document API endpoints directly in route files",
            },
            {
              label: "Jest & Supertest",
              desc: "Comprehensive API testing with HTTP requests",
            },
            {
              label: "Test lifecycle",
              desc: "Setup and teardown for isolated test environments",
            },
          ]}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">25 min</div>
          <div className="text-slate-600">Routing & Structure</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">35 min</div>
          <div className="text-slate-600">Validation & Middleware</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">40 min</div>
          <div className="text-slate-600">Testing & Documentation</div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">
          💡 API Development Best Practices
        </h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Use consistent HTTP status codes and error formats</li>
          <li>• Implement proper input validation and sanitization</li>
          <li>• Add rate limiting to prevent API abuse</li>
          <li>• Document all endpoints with OpenAPI/Swagger</li>
          <li>• Write comprehensive tests for all API endpoints</li>
          <li>• Use appropriate caching strategies for performance</li>
        </ul>
      </div>
    </div>
  ),
};
