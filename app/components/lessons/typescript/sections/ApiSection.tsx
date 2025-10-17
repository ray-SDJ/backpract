import React from "react";
import { Globe } from "lucide-react";

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

export const ApiSection = {
  id: "api",
  title: "REST API with Express & TypeScript",
  icon: Globe,
  overview:
    "Build type-safe REST APIs with proper validation, error handling, and documentation",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">Type-Safe Route Controllers</h3>
        <p className="text-gray-700 mb-3">
          Create strongly typed controllers with proper request/response types
          and validation.
        </p>
        <CodeExplanation
          code={`// src/types/api.ts
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// src/controllers/UserController.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { UserService } from '../services/UserService';
import { ApiResponse, CreateUserRequest, UpdateUserRequest, UserResponse } from '../types/api';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // GET /api/users
  public getUsers = async (req: Request, res: Response<ApiResponse<UserResponse[]>>): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      let users;
      if (search) {
        users = await this.userService.searchUsers(search);
      } else {
        users = await this.userService.getAllUsers(page, limit);
      }

      const userResponses: UserResponse[] = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      }));

      res.status(200).json({
        status: 'success',
        data: userResponses,
        message: 'Users retrieved successfully',
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve users',
      });
    }
  };

  // GET /api/users/:id
  public getUserById = async (req: Request, res: Response<ApiResponse<UserResponse>>): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = parseInt(id);

      if (isNaN(userId)) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid user ID',
        });
        return;
      }

      const user = await this.userService.getUserById(userId);

      if (!user) {
        res.status(404).json({
          status: 'error',
          message: 'User not found',
        });
        return;
      }

      const userResponse: UserResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };

      res.status(200).json({
        status: 'success',
        data: userResponse,
        message: 'User retrieved successfully',
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve user',
      });
    }
  };

  // POST /api/users
  public createUser = async (req: Request<{}, ApiResponse<UserResponse>, CreateUserRequest>, res: Response<ApiResponse<UserResponse>>): Promise<void> => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errors.array().map(err => err.msg),
        });
        return;
      }

      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await this.userService.getUserByEmail(email);
      if (existingUser) {
        res.status(409).json({
          status: 'error',
          message: 'User with this email already exists',
        });
        return;
      }

      const user = await this.userService.createUser({ name, email, password });

      const userResponse: UserResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };

      res.status(201).json({
        status: 'success',
        data: userResponse,
        message: 'User created successfully',
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to create user',
      });
    }
  };

  // PUT /api/users/:id
  public updateUser = async (req: Request<{ id: string }, ApiResponse<UserResponse>, UpdateUserRequest>, res: Response<ApiResponse<UserResponse>>): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errors.array().map(err => err.msg),
        });
        return;
      }

      const userId = parseInt(req.params.id);
      const updateData = req.body;

      const updatedUser = await this.userService.updateUser(userId, updateData);

      if (!updatedUser) {
        res.status(404).json({
          status: 'error',
          message: 'User not found',
        });
        return;
      }

      const userResponse: UserResponse = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString(),
      };

      res.status(200).json({
        status: 'success',
        data: userResponse,
        message: 'User updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to update user',
      });
    }
  };

  // DELETE /api/users/:id
  public deleteUser = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);

      const success = await this.userService.deleteUser(userId);

      if (!success) {
        res.status(404).json({
          status: 'error',
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: 'User deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to delete user',
      });
    }
  };
}`}
          explanation={[
            {
              label: "Response<ApiResponse<T>>",
              desc: "Generic type for consistent API response structure",
            },
            {
              label: "Request<{}, Response, Body>",
              desc: "Express Request type with params, response, and body types",
            },
            {
              label: "validationResult(req)",
              desc: "Express-validator function to check validation errors",
            },
            {
              label: "parseInt(req.params.id)",
              desc: "Convert string parameter to number with validation",
            },
            {
              label: "UserResponse interface",
              desc: "Type-safe response object that excludes sensitive data",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">
          Request Validation with express-validator
        </h3>
        <CodeExplanation
          code={`# Install validation library
npm install express-validator

// src/middleware/validation.ts
import { body, param, query } from 'express-validator';

export const validateCreateUser = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim()
    .escape(),
  
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
];

export const validateUpdateUser = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .trim()
    .escape(),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
];

export const validateUserId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
];

export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters')
    .trim()
    .escape(),
];

// src/routes/userRoutes.ts
import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { 
  validateCreateUser, 
  validateUpdateUser, 
  validateUserId, 
  validatePagination 
} from '../middleware/validation';

const router = Router();
const userController = new UserController();

// GET /api/users - Get all users with pagination and search
router.get('/', validatePagination, userController.getUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', validateUserId, userController.getUserById);

// POST /api/users - Create new user
router.post('/', validateCreateUser, userController.createUser);

// PUT /api/users/:id - Update user
router.put('/:id', validateUserId, validateUpdateUser, userController.updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', validateUserId, userController.deleteUser);

export default router;`}
          explanation={[
            {
              label: "body('name')",
              desc: "Validates request body field with chained validation rules",
            },
            {
              label: ".isLength({ min: 2, max: 100 })",
              desc: "Validates string length constraints",
            },
            {
              label: ".trim().escape()",
              desc: "Sanitizes input by removing whitespace and escaping HTML",
            },
            {
              label: ".matches(/regex/)",
              desc: "Validates password complexity with regular expression",
            },
            {
              label: "validateUserId middleware",
              desc: "Reusable validation middleware for route parameters",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">
          Error Handling & Custom Middleware
        </h3>
        <CodeExplanation
          code={`// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/api';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const globalErrorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // Handle operational errors
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
    return;
  }

  // Handle TypeORM errors
  if (error.name === 'QueryFailedError') {
    res.status(400).json({
      status: 'error',
      message: 'Database query failed',
    });
    return;
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: [error.message],
    });
    return;
  }

  // Default error response
  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : error.message,
  });
};

// src/middleware/asyncHandler.ts
import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage in controllers
export class UserController {
  public getUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Controller logic here
    // Any thrown errors will be caught and passed to error handler
  });
}

// src/middleware/requestLogger.ts
import { Request, Response, NextFunction } from 'express';

interface LogData {
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  userAgent?: string;
  ip: string;
}

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Override res.end to capture response
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any): void {
    const responseTime = Date.now() - startTime;
    
    const logData: LogData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress || 'unknown',
    };

    console.log(\`[\${new Date().toISOString()}] \${logData.method} \${logData.url} - \${logData.statusCode} - \${logData.responseTime}ms\`);

    originalEnd.call(this, chunk, encoding);
  };

  next();
};`}
          explanation={[
            {
              label: "class AppError extends Error",
              desc: "Custom error class for operational application errors",
            },
            {
              label: "Error.captureStackTrace",
              desc: "Captures stack trace for debugging purposes",
            },
            {
              label: "asyncHandler",
              desc: "Higher-order function that catches async errors automatically",
            },
            {
              label: "res.end override",
              desc: "Intercepts response to log performance metrics",
            },
            {
              label: "Promise.resolve(fn()).catch(next)",
              desc: "Ensures async errors are passed to Express error handler",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">
          API Documentation with OpenAPI/Swagger
        </h3>
        <CodeExplanation
          code={`# Install swagger documentation
npm install swagger-jsdoc swagger-ui-express
npm install -D @types/swagger-jsdoc @types/swagger-ui-express

// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TypeScript API Documentation',
      version: '1.0.0',
      description: 'A TypeScript REST API with Express and TypeORM',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'User full name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['success', 'error'],
            },
            data: {
              type: 'object',
            },
            message: {
              type: 'string',
            },
            errors: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to route files for documentation
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  console.log('📚 Swagger documentation available at /api-docs');
};

// Add to userRoutes.ts with JSDoc comments
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of users per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for user name or email
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 */
router.get('/', validatePagination, userController.getUsers);
router.post('/', validateCreateUser, userController.createUser);`}
          explanation={[
            {
              label: "swaggerJsdoc(options)",
              desc: "Generates OpenAPI specification from JSDoc comments",
            },
            {
              label: "@swagger comment",
              desc: "JSDoc annotation for documenting API endpoints",
            },
            {
              label: "$ref: '#/components/schemas/User'",
              desc: "References reusable schema definitions",
            },
            {
              label: "allOf composition",
              desc: "Combines multiple schemas for complex response types",
            },
            {
              label: "swagger-ui-express",
              desc: "Serves interactive API documentation at /api-docs",
            },
          ]}
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">
          🎯 TypeScript API Benefits
        </h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Compile-time type checking prevents runtime errors</li>
          <li>• IDE autocomplete and refactoring support</li>
          <li>• Self-documenting code with interface definitions</li>
          <li>• Better team collaboration with type contracts</li>
          <li>• Swagger documentation generated from types</li>
        </ul>
      </div>
    </div>
  ),
};
