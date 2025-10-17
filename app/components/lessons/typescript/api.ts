import { LessonData } from "../types";

const api: LessonData = {
  title: "REST API Development",
  difficulty: "Intermediate",
  description:
    "Build production-ready REST APIs with TypeScript, including validation, error handling, documentation, and advanced patterns for scalable backend development.",
  objectives: [
    "Create type-safe API controllers and route handlers",
    "Implement request validation and error handling middleware",
    "Build standardized API responses and error formats",
    "Generate API documentation with Swagger/OpenAPI",
    "Handle file uploads, pagination, and filtering",
  ],
  content: `<div class="lesson-content">
    <h2>TypeScript REST API Development</h2>
    
    <p>Building robust REST APIs with TypeScript involves creating type-safe controllers, implementing proper validation, handling errors gracefully, and providing clear API documentation. We'll build a complete API following industry best practices.</p>

    <h3>API Response Types & Interfaces</h3>
    
    <pre class="code-block">
      <code>
// src/types/api.ts - Standardized API response types
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: ValidationError[];
  meta?: PaginationMeta;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  search?: string;
}

// src/types/user.ts - User-related DTOs
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin' | 'moderator';
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'user' | 'admin' | 'moderator';
  isEmailVerified?: boolean;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  postCount?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserResponse;
  token: string;
  expiresAt: Date;
}
      </code>
    </pre>

    <h3>Validation Middleware & Error Handling</h3>
    
    <pre class="code-block">
      <code>
// src/middleware/validation.ts - Request validation middleware
import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult, ValidationChain } from 'express-validator';
import { ApiResponse, ValidationError } from '../types/api';

export class ValidationMiddleware {
  static validate(validations: ValidationChain[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      // Run all validations
      await Promise.all(validations.map(validation => validation.run(req)));

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      const validationErrors: ValidationError[] = errors.array().map(error => ({
        field: error.type === 'field' ? error.path : 'unknown',
        message: error.msg,
        value: error.type === 'field' ? error.value : undefined,
      }));

      const response: ApiResponse = {
        status: 'error',
        message: 'Validation failed',
        errors: validationErrors,
      };

      res.status(400).json(response);
    };
  }

  // User validation rules
  static createUserValidation = [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 6 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('role')
      .optional()
      .isIn(['user', 'admin', 'moderator'])
      .withMessage('Role must be user, admin, or moderator'),
  ];

  static updateUserValidation = [
    param('id').isUUID().withMessage('Invalid user ID format'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email format'),
    body('role')
      .optional()
      .isIn(['user', 'admin', 'moderator'])
      .withMessage('Role must be user, admin, or moderator'),
  ];

  static paginationValidation = [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('sort')
      .optional()
      .isIn(['name', 'email', 'createdAt', 'updatedAt'])
      .withMessage('Invalid sort field'),
    query('order')
      .optional()
      .isIn(['ASC', 'DESC'])
      .withMessage('Order must be ASC or DESC'),
  ];
}

// src/middleware/errorHandler.ts - Global error handling
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/api';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  // Log error for debugging
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  const response: ApiResponse = {
    status: 'error',
    message,
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.data = { stack: error.stack };
  }

  res.status(statusCode).json(response);
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
      </code>
    </pre>

    <h3>API Controllers with Type Safety</h3>
    
    <pre class="code-block">
      <code>
// src/controllers/UserController.ts - Type-safe user controller
import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { 
  CreateUserRequest, 
  UpdateUserRequest, 
  UserResponse, 
  PaginationQuery,
  ApiResponse,
  PaginationMeta 
} from '../types';
import { AppError, asyncHandler } from '../middleware/errorHandler';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // GET /api/users - Get all users with pagination
  getUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query: PaginationQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sort: req.query.sort as string || 'createdAt',
      order: (req.query.order as 'ASC' | 'DESC') || 'DESC',
      search: req.query.search as string,
    };

    const result = await this.userService.getUsers(query);

    const meta: PaginationMeta = {
      page: query.page!,
      limit: query.limit!,
      total: result.total,
      totalPages: Math.ceil(result.total / query.limit!),
      hasNext: query.page! < Math.ceil(result.total / query.limit!),
      hasPrev: query.page! > 1,
    };

    const response: ApiResponse<{ users: UserResponse[] }> = {
      status: 'success',
      message: 'Users retrieved successfully',
      data: { users: result.users },
      meta,
    };

    res.status(200).json(response);
  });

  // GET /api/users/:id - Get user by ID
  getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const response: ApiResponse<{ user: UserResponse }> = {
      status: 'success',
      message: 'User retrieved successfully',
      data: { user },
    };

    res.status(200).json(response);
  });

  // POST /api/users - Create new user
  createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userData: CreateUserRequest = req.body;
    const user = await this.userService.createUser(userData);

    const response: ApiResponse<{ user: UserResponse }> = {
      status: 'success',
      message: 'User created successfully',
      data: { user },
    };

    res.status(201).json(response);
  });

  // PUT /api/users/:id - Update user
  updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData: UpdateUserRequest = req.body;

    const user = await this.userService.updateUser(id, updateData);

    const response: ApiResponse<{ user: UserResponse }> = {
      status: 'success',
      message: 'User updated successfully',
      data: { user },
    };

    res.status(200).json(response);
  });

  // DELETE /api/users/:id - Delete user
  deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.userService.deleteUser(id);

    const response: ApiResponse = {
      status: 'success',
      message: 'User deleted successfully',
    };

    res.status(200).json(response);
  });

  // GET /api/users/:id/stats - Get user statistics
  getUserStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const stats = await this.userService.getUserStats(id);

    const response: ApiResponse<typeof stats> = {
      status: 'success',
      message: 'User statistics retrieved successfully',
      data: stats,
    };

    res.status(200).json(response);
  });
}

// src/routes/userRoutes.ts - Route definitions
import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { ValidationMiddleware } from '../middleware/validation';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();
const userController = new UserController();

// Public routes
router.post(
  '/',
  ValidationMiddleware.validate(ValidationMiddleware.createUserValidation),
  userController.createUser
);

// Protected routes (require authentication)
router.use(authMiddleware);

router.get(
  '/',
  ValidationMiddleware.validate(ValidationMiddleware.paginationValidation),
  userController.getUsers
);

router.get('/:id', userController.getUserById);
router.get('/:id/stats', userController.getUserStats);

// Admin-only routes
router.use(adminMiddleware);

router.put(
  '/:id',
  ValidationMiddleware.validate(ValidationMiddleware.updateUserValidation),
  userController.updateUser
);

router.delete('/:id', userController.deleteUser);

export default router;
      </code>
    </pre>

    <h3>API Documentation with Swagger</h3>
    
    <pre class="code-block">
      <code>
// Install swagger dependencies
npm install swagger-ui-express swagger-jsdoc
npm install -D @types/swagger-ui-express @types/swagger-jsdoc

// src/config/swagger.ts - Swagger configuration
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TypeScript API',
      version: '1.0.0',
      description: 'A robust REST API built with TypeScript and Express',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['user', 'admin', 'moderator'] },
            isEmailVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['success', 'error'] },
            message: { type: 'string' },
            data: { type: 'object' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'TypeScript API Documentation',
  }));

  console.log('📚 API Documentation available at /api-docs');
};

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
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of users per page
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
 *                       type: object
 *                       properties:
 *                         users:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/User'
 */
      </code>
    </pre>

    <p><strong>API Development Benefits:</strong> Type safety prevents runtime errors, standardized responses improve client integration, comprehensive validation ensures data integrity, and automatic documentation reduces maintenance overhead.</p>
  </div>`,
  practiceInstructions: [
    "Create TypeScript interfaces for API requests and responses",
    "Implement validation middleware using express-validator",
    "Build type-safe controllers with error handling",
    "Set up standardized API response formats",
    "Generate API documentation with Swagger",
    "Test API endpoints with proper error scenarios",
  ],
  hints: [
    "Use generic types for ApiResponse to ensure type safety",
    "Implement asyncHandler wrapper to catch Promise rejections",
    "Create custom AppError class for operational errors",
    "Use ValidationChain for reusable validation rules",
    "Document endpoints with JSDoc comments for Swagger",
  ],
  solution: `# Install validation and documentation dependencies
npm install express-validator swagger-ui-express swagger-jsdoc
npm install -D @types/swagger-ui-express @types/swagger-jsdoc

# Test API endpoints
curl -X POST http://localhost:3000/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John Doe","email":"john@example.com","password":"SecurePass123"}'

# View API documentation
open http://localhost:3000/api-docs`,
};

export default api;
