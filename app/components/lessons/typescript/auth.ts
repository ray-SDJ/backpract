import { LessonData } from "../types";

const auth: LessonData = {
  title: "JWT Authentication & Security",
  difficulty: "Advanced",
  description:
    "Implement comprehensive JWT authentication system with TypeScript, including middleware, role-based access control, password security, and session management.",
  objectives: [
    "Implement JWT token generation and validation with TypeScript",
    "Create authentication middleware and route protection",
    "Build role-based access control (RBAC) system",
    "Handle password hashing, validation, and security best practices",
    "Implement token refresh, logout, and session management",
  ],
  content: `<div class="lesson-content">
    <h2>JWT Authentication & Security</h2>
    
    <p>Authentication is critical for any production application. We'll implement a complete JWT authentication system with TypeScript, including secure token handling, role-based permissions, and comprehensive security middleware.</p>

    <h3>JWT Service & Token Management</h3>
    
    <pre class="code-block">
      <code>
// Install authentication dependencies
npm install jsonwebtoken bcryptjs cookie-parser express-rate-limit helmet
npm install -D @types/jsonwebtoken @types/bcryptjs @types/cookie-parser

// src/types/auth.ts - Authentication type definitions
export interface JwtPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// src/services/JwtService.ts - JWT token management
import jwt from 'jsonwebtoken';
import { JwtPayload, RefreshTokenPayload, AuthTokens } from '../types/auth';
import { User } from '../entities/User';

export class JwtService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'your-access-secret';
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';

    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
      console.warn('⚠️  JWT secrets not set in environment variables');
    }
  }

  generateTokens(user: User): AuthTokens {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const refreshPayload: RefreshTokenPayload = {
      userId: user.id,
      tokenVersion: user.tokenVersion || 0,
    };

    const accessToken = jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      issuer: 'typescript-api',
      audience: 'typescript-app',
    });

    const refreshToken = jwt.sign(refreshPayload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
      issuer: 'typescript-api',
      audience: 'typescript-app',
    });

    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + (15 * 60 * 1000)); // 15 minutes

    return { accessToken, refreshToken, expiresAt };
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'typescript-api',
        audience: 'typescript-app',
      }) as JwtPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Access token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid access token');
      }
      throw new Error('Token verification failed');
    }
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'typescript-api',
        audience: 'typescript-app',
      }) as RefreshTokenPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid refresh token');
      }
      throw new Error('Refresh token verification failed');
    }
  }

  extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}

// src/services/AuthService.ts - Authentication business logic
import bcrypt from 'bcryptjs';
import { UserService } from './UserService';
import { JwtService } from './JwtService';
import { LoginCredentials, RegisterData, AuthTokens } from '../types/auth';
import { User } from '../entities/User';
import { AppError } from '../middleware/errorHandler';

export class AuthService {
  private userService: UserService;
  private jwtService: JwtService;

  constructor() {
    this.userService = new UserService();
    this.jwtService = new JwtService();
  }

  async register(registerData: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
    const { name, email, password, confirmPassword } = registerData;

    // Validate password confirmation
    if (password !== confirmPassword) {
      throw new AppError('Passwords do not match', 400);
    }

    // Check if user already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Create user
    const user = await this.userService.createUser({ name, email, password });
    const tokens = this.jwtService.generateTokens(user);

    // Update last login
    await this.userService.updateLastLogin(user.id);

    return { user, tokens };
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const { email, password } = credentials;

    // Find user and verify password
    const user = await this.userService.authenticateUser(email, password);
    
    // Generate tokens
    const tokens = this.jwtService.generateTokens(user);

    return { user, tokens };
  }

  async refreshTokens(refreshToken: string): Promise<{ user: User; tokens: AuthTokens }> {
    // Verify refresh token
    const payload = this.jwtService.verifyRefreshToken(refreshToken);
    
    // Get user and verify token version
    const user = await this.userService.getUserById(payload.userId);
    if (user.tokenVersion !== payload.tokenVersion) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Generate new tokens
    const tokens = this.jwtService.generateTokens(user);

    return { user, tokens };
  }

  async logout(userId: string): Promise<void> {
    // Increment token version to invalidate all existing tokens
    await this.userService.incrementTokenVersion(userId);
  }

  async changePassword(
    userId: string, 
    currentPassword: string, 
    newPassword: string
  ): Promise<void> {
    const user = await this.userService.getUserById(userId);
    
    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new AppError('Current password is incorrect', 400);
    }

    // Validate new password
    if (newPassword.length < 6) {
      throw new AppError('New password must be at least 6 characters', 400);
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await this.userService.updateUser(userId, { password: hashedPassword });

    // Invalidate all tokens
    await this.userService.incrementTokenVersion(userId);
  }
}
      </code>
    </pre>

    <h3>Authentication Middleware & Protection</h3>
    
    <pre class="code-block">
      <code>
// src/middleware/auth.ts - Authentication and authorization middleware
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../services/JwtService';
import { UserService } from '../services/UserService';
import { JwtPayload } from '../types/auth';
import { AppError } from './errorHandler';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'user' | 'admin' | 'moderator';
      };
    }
  }
}

export class AuthMiddleware {
  private jwtService: JwtService;
  private userService: UserService;

  constructor() {
    this.jwtService = new JwtService();
    this.userService = new UserService();
  }

  // Verify JWT token and attach user to request
  authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = this.jwtService.extractTokenFromHeader(authHeader);

      if (!token) {
        throw new AppError('Access token required', 401);
      }

      // Verify token
      const payload: JwtPayload = this.jwtService.verifyAccessToken(token);

      // Get user to ensure they still exist and are active
      const user = await this.userService.getUserById(payload.userId);
      if (!user) {
        throw new AppError('User no longer exists', 401);
      }

      // Attach user info to request
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AppError('Authentication failed', 401));
      }
    }
  };

  // Check if user has required role
  authorize = (roles: Array<'user' | 'admin' | 'moderator'>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      if (!roles.includes(req.user.role)) {
        throw new AppError('Insufficient permissions', 403);
      }

      next();
    };
  };

  // Admin-only middleware
  adminOnly = (req: Request, res: Response, next: NextFunction): void => {
    this.authorize(['admin'])(req, res, next);
  };

  // Admin or moderator middleware
  moderatorOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
    this.authorize(['admin', 'moderator'])(req, res, next);
  };

  // Resource ownership check
  checkResourceOwnership = (resourceUserIdParam: string = 'userId') => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        throw new AppError('Authentication required', 401);
      }

      const resourceUserId = req.params[resourceUserIdParam];
      
      // Allow admins to access any resource
      if (req.user.role === 'admin') {
        return next();
      }

      // Check if user owns the resource
      if (req.user.id !== resourceUserId) {
        throw new AppError('Access denied: You can only access your own resources', 403);
      }

      next();
    };
  };
}

// Create singleton instance
const authMiddleware = new AuthMiddleware();

export const authenticate = authMiddleware.authenticate;
export const authorize = authMiddleware.authorize;
export const adminOnly = authMiddleware.adminOnly;
export const moderatorOrAdmin = authMiddleware.moderatorOrAdmin;
export const checkResourceOwnership = authMiddleware.checkResourceOwnership;

// src/middleware/security.ts - Additional security middleware
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';

// Rate limiting for authentication endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiting
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests, please try again later',
  },
});

// Security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

// CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
      </code>
    </pre>

    <h3>Authentication Controllers & Routes</h3>
    
    <pre class="code-block">
      <code>
// src/controllers/AuthController.ts - Authentication endpoints
import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { LoginCredentials, RegisterData } from '../types/auth';
import { ApiResponse } from '../types/api';
import { asyncHandler, AppError } from '../middleware/errorHandler';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // POST /auth/register
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const registerData: RegisterData = req.body;
    const { user, tokens } = await this.authService.register(registerData);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const response: ApiResponse = {
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
        accessToken: tokens.accessToken,
        expiresAt: tokens.expiresAt,
      },
    };

    res.status(201).json(response);
  });

  // POST /auth/login
  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const credentials: LoginCredentials = req.body;
    const { user, tokens } = await this.authService.login(credentials);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const response: ApiResponse = {
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
        accessToken: tokens.accessToken,
        expiresAt: tokens.expiresAt,
      },
    };

    res.status(200).json(response);
  });

  // POST /auth/refresh
  refresh = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError('Refresh token not provided', 401);
    }

    const { user, tokens } = await this.authService.refreshTokens(refreshToken);

    // Set new refresh token
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const response: ApiResponse = {
      status: 'success',
      message: 'Tokens refreshed successfully',
      data: {
        accessToken: tokens.accessToken,
        expiresAt: tokens.expiresAt,
      },
    };

    res.status(200).json(response);
  });

  // POST /auth/logout
  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    await this.authService.logout(req.user.id);

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    const response: ApiResponse = {
      status: 'success',
      message: 'Logout successful',
    };

    res.status(200).json(response);
  });

  // GET /auth/me
  getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const response: ApiResponse = {
      status: 'success',
      message: 'Profile retrieved successfully',
      data: { user: req.user },
    };

    res.status(200).json(response);
  });

  // PUT /auth/change-password
  changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const { currentPassword, newPassword } = req.body;
    await this.authService.changePassword(req.user.id, currentPassword, newPassword);

    const response: ApiResponse = {
      status: 'success',
      message: 'Password changed successfully',
    };

    res.status(200).json(response);
  });
}

// src/routes/authRoutes.ts - Authentication routes
import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { ValidationMiddleware } from '../middleware/validation';
import { authenticate, authRateLimit } from '../middleware';

const router = Router();
const authController = new AuthController();

// Public routes with rate limiting
router.post(
  '/register',
  authRateLimit,
  ValidationMiddleware.validate([
    body('name').trim().isLength({ min: 2, max: 100 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  ]),
  authController.register
);

router.post(
  '/login',
  authRateLimit,
  ValidationMiddleware.validate([
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ]),
  authController.login
);

router.post('/refresh', authController.refresh);

// Protected routes
router.use(authenticate);
router.post('/logout', authController.logout);
router.get('/me', authController.getProfile);
router.put(
  '/change-password',
  ValidationMiddleware.validate([
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 }),
  ]),
  authController.changePassword
);

export default router;
      </code>
    </pre>

    <p><strong>Security Best Practices:</strong> JWT tokens with refresh rotation, bcrypt password hashing, rate limiting, CORS protection, security headers, httpOnly cookies for refresh tokens, and role-based access control.</p>
  </div>`,
  practiceInstructions: [
    "Set up JWT service with access and refresh token generation",
    "Implement authentication middleware with role-based authorization",
    "Create secure password hashing and validation",
    "Build login, register, and token refresh endpoints",
    "Add rate limiting and security headers",
    "Test authentication flow and protected routes",
  ],
  hints: [
    "Use separate secrets for access and refresh tokens",
    "Store refresh tokens in httpOnly cookies for security",
    "Implement token versioning for logout functionality",
    "Use bcrypt with salt rounds of 12 for password hashing",
    "Add proper CORS configuration for frontend integration",
  ],
  solution: `# Install authentication dependencies
npm install jsonwebtoken bcryptjs cookie-parser express-rate-limit helmet
npm install -D @types/jsonwebtoken @types/bcryptjs @types/cookie-parser

# Set environment variables
JWT_ACCESS_SECRET=your-very-secure-access-secret
JWT_REFRESH_SECRET=your-very-secure-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Test authentication flow
curl -X POST http://localhost:3000/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John Doe","email":"john@example.com","password":"SecurePass123","confirmPassword":"SecurePass123"}'`,
};

export default auth;
