import React from "react";
import { Shield } from "lucide-react";

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

export const AuthSection = {
  id: "auth",
  title: "JWT Authentication & Security",
  icon: Shield,
  overview:
    "Implement secure JWT authentication with TypeScript interfaces and middleware",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">JWT Service with TypeScript</h3>
        <p className="text-gray-700 mb-3">
          Create a type-safe JWT service for token generation, verification, and
          user authentication.
        </p>
        <CodeExplanation
          code={`# Install JWT and security packages
npm install jsonwebtoken bcrypt
npm install -D @types/jsonwebtoken @types/bcrypt

// src/types/auth.ts
export interface JwtPayload {
  userId: number;
  email: string;
  role: 'user' | 'admin';
  iat?: number;
  exp?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  token: string;
  refreshToken: string;
}

// src/services/JwtService.ts
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/auth';

export class JwtService {
  private readonly secretKey: string;
  private readonly refreshSecretKey: string;
  private readonly expiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor() {
    this.secretKey = process.env.JWT_SECRET || 'your-secret-key';
    this.refreshSecretKey = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '15m';
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

    if (!process.env.JWT_SECRET) {
      console.warn('⚠️  JWT_SECRET not set in environment variables');
    }
  }

  generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.secretKey, {
      expiresIn: this.expiresIn,
      issuer: 'typescript-api',
      audience: 'typescript-client',
    });
  }

  generateRefreshToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.refreshSecretKey, {
      expiresIn: this.refreshExpiresIn,
      issuer: 'typescript-api',
      audience: 'typescript-client',
    });
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.secretKey, {
        issuer: 'typescript-api',
        audience: 'typescript-client',
      }) as JwtPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        console.log('Token expired:', error.expiredAt);
      } else if (error instanceof jwt.JsonWebTokenError) {
        console.log('Invalid token:', error.message);
      }
      return null;
    }
  }

  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.refreshSecretKey, {
        issuer: 'typescript-api',
        audience: 'typescript-client',
      }) as JwtPayload;

      return decoded;
    } catch (error) {
      console.log('Invalid refresh token:', error);
      return null;
    }
  }

  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}`}
          explanation={[
            {
              label: "JwtPayload interface",
              desc: "TypeScript interface defining structure of JWT token payload",
            },
            {
              label: "Omit<JwtPayload, 'iat' | 'exp'>",
              desc: "Utility type excluding automatic JWT fields from payload",
            },
            {
              label: "jwt.sign(payload, secret, options)",
              desc: "Creates signed JWT token with expiration and issuer claims",
            },
            {
              label: "jwt.verify() as JwtPayload",
              desc: "Verifies token signature and casts to TypeScript interface",
            },
            {
              label: "TokenExpiredError check",
              desc: "Handles specific JWT error types for better error handling",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">Authentication Controller</h3>
        <CodeExplanation
          code={`// src/controllers/AuthController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserService } from '../services/UserService';
import { JwtService } from '../services/JwtService';
import { ApiResponse, LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';
import { validationResult } from 'express-validator';

export class AuthController {
  private userService: UserService;
  private jwtService: JwtService;

  constructor() {
    this.userService = new UserService();
    this.jwtService = new JwtService();
  }

  // POST /api/auth/register
  public register = async (
    req: Request<{}, ApiResponse<AuthResponse>, RegisterRequest>,
    res: Response<ApiResponse<AuthResponse>>
  ): Promise<void> => {
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

      // Create user
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await this.userService.createUser({
        name,
        email,
        password: hashedPassword,
      });

      // Generate tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role as 'user' | 'admin',
      };

      const token = this.jwtService.generateToken(tokenPayload);
      const refreshToken = this.jwtService.generateRefreshToken(tokenPayload);

      // Store refresh token (in production, use Redis or database)
      // await this.refreshTokenService.saveRefreshToken(user.id, refreshToken);

      const authResponse: AuthResponse = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
        refreshToken,
      };

      res.status(201).json({
        status: 'success',
        data: authResponse,
        message: 'User registered successfully',
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to register user',
      });
    }
  };

  // POST /api/auth/login
  public login = async (
    req: Request<{}, ApiResponse<AuthResponse>, LoginRequest>,
    res: Response<ApiResponse<AuthResponse>>
  ): Promise<void> => {
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

      const { email, password } = req.body;

      // Find user with password
      const user = await this.userService.getUserByEmailWithPassword(email);
      if (!user) {
        res.status(401).json({
          status: 'error',
          message: 'Invalid email or password',
        });
        return;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({
          status: 'error',
          message: 'Invalid email or password',
        });
        return;
      }

      // Check if user is active
      if (!user.isActive) {
        res.status(401).json({
          status: 'error',
          message: 'Account is deactivated',
        });
        return;
      }

      // Generate tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role as 'user' | 'admin',
      };

      const token = this.jwtService.generateToken(tokenPayload);
      const refreshToken = this.jwtService.generateRefreshToken(tokenPayload);

      const authResponse: AuthResponse = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
        refreshToken,
      };

      res.status(200).json({
        status: 'success',
        data: authResponse,
        message: 'Login successful',
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to login',
      });
    }
  };

  // POST /api/auth/refresh
  public refreshToken = async (
    req: Request<{}, ApiResponse<{ token: string }>, { refreshToken: string }>,
    res: Response<ApiResponse<{ token: string }>>
  ): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          status: 'error',
          message: 'Refresh token is required',
        });
        return;
      }

      // Verify refresh token
      const payload = this.jwtService.verifyRefreshToken(refreshToken);
      if (!payload) {
        res.status(401).json({
          status: 'error',
          message: 'Invalid refresh token',
        });
        return;
      }

      // Check if user still exists and is active
      const user = await this.userService.getUserById(payload.userId);
      if (!user || !user.isActive) {
        res.status(401).json({
          status: 'error',
          message: 'User not found or inactive',
        });
        return;
      }

      // Generate new access token
      const newTokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role as 'user' | 'admin',
      };

      const newToken = this.jwtService.generateToken(newTokenPayload);

      res.status(200).json({
        status: 'success',
        data: { token: newToken },
        message: 'Token refreshed successfully',
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to refresh token',
      });
    }
  };

  // POST /api/auth/logout
  public logout = async (
    req: Request<{}, ApiResponse, { refreshToken: string }>,
    res: Response<ApiResponse>
  ): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        // In production, invalidate refresh token in database/Redis
        // await this.refreshTokenService.invalidateRefreshToken(refreshToken);
      }

      res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to logout',
      });
    }
  };
}`}
          explanation={[
            {
              label: "bcrypt.hash(password, 12)",
              desc: "Hashes password with salt rounds for secure storage",
            },
            {
              label: "bcrypt.compare(password, hash)",
              desc: "Safely compares plain password with hashed version",
            },
            {
              label: "role as 'user' | 'admin'",
              desc: "TypeScript type assertion for union type validation",
            },
            {
              label: "Request<{}, Response, Body>",
              desc: "Fully typed Express request with params, response, and body",
            },
            {
              label: "validationResult(req)",
              desc: "Checks express-validator errors with TypeScript support",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">Authentication Middleware</h3>
        <CodeExplanation
          code={`// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../services/JwtService';
import { UserService } from '../services/UserService';
import { JwtPayload } from '../types/auth';
import { ApiResponse } from '../types/api';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: 'user' | 'admin';
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

  // Require authentication
  public authenticate = async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        res.status(401).json({
          status: 'error',
          message: 'Authorization header is required',
        });
        return;
      }

      const token = this.jwtService.extractTokenFromHeader(authHeader);
      if (!token) {
        res.status(401).json({
          status: 'error',
          message: 'Invalid authorization header format',
        });
        return;
      }

      const payload = this.jwtService.verifyToken(token);
      if (!payload) {
        res.status(401).json({
          status: 'error',
          message: 'Invalid or expired token',
        });
        return;
      }

      // Verify user still exists and is active
      const user = await this.userService.getUserById(payload.userId);
      if (!user || !user.isActive) {
        res.status(401).json({
          status: 'error',
          message: 'User not found or inactive',
        });
        return;
      }

      // Add user to request
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role as 'user' | 'admin',
      };

      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Authentication failed',
      });
    }
  };

  // Optional authentication
  public optionalAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader) {
        const token = this.jwtService.extractTokenFromHeader(authHeader);
        if (token) {
          const payload = this.jwtService.verifyToken(token);
          if (payload) {
            const user = await this.userService.getUserById(payload.userId);
            if (user && user.isActive) {
              req.user = {
                id: user.id,
                email: user.email,
                role: user.role as 'user' | 'admin',
              };
            }
          }
        }
      }

      next();
    } catch (error) {
      // Continue without authentication
      next();
    }
  };

  // Require admin role
  public requireAdmin = (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
      return;
    }

    if (req.user.role !== 'admin') {
      res.status(403).json({
        status: 'error',
        message: 'Admin access required',
      });
      return;
    }

    next();
  };

  // Require resource ownership or admin
  public requireOwnershipOrAdmin = (resourceUserIdParam: string = 'userId') => {
    return (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          status: 'error',
          message: 'Authentication required',
        });
        return;
      }

      const resourceUserId = parseInt(req.params[resourceUserIdParam]);
      
      if (req.user.role === 'admin' || req.user.id === resourceUserId) {
        next();
      } else {
        res.status(403).json({
          status: 'error',
          message: 'Access denied: insufficient permissions',
        });
      }
    };
  };
}

// Usage in routes
// src/routes/userRoutes.ts
import { AuthMiddleware } from '../middleware/auth';

const router = Router();
const authMiddleware = new AuthMiddleware();

// Public routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Protected routes
router.get('/users/me', authMiddleware.authenticate, userController.getCurrentUser);
router.put('/users/:id', authMiddleware.authenticate, authMiddleware.requireOwnershipOrAdmin('id'), userController.updateUser);

// Admin only routes
router.get('/admin/users', authMiddleware.authenticate, authMiddleware.requireAdmin, userController.getAllUsersAdmin);`}
          explanation={[
            {
              label: "declare global namespace Express",
              desc: "Extends Express Request interface to include user property",
            },
            {
              label: "req.user = { id, email, role }",
              desc: "Attaches authenticated user data to request object",
            },
            {
              label: "requireOwnershipOrAdmin(param)",
              desc: "Higher-order function for resource-specific authorization",
            },
            {
              label: "req.user.role !== 'admin'",
              desc: "Role-based access control with TypeScript type safety",
            },
            {
              label: "authMiddleware.authenticate",
              desc: "Middleware chain for protecting routes",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">Security Best Practices</h3>
        <CodeExplanation
          code={`// Security configuration
// .env
JWT_SECRET=your-super-secret-key-at-least-256-bits-long
JWT_REFRESH_SECRET=your-refresh-secret-different-from-main
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

// src/middleware/security.ts
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Application } from 'express';

export const configureSecurityMiddleware = (app: Application): void => {
  // Security headers
  app.use(helmet({
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
  }));

  // Rate limiting
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
      status: 'error',
      message: 'Too many authentication attempts, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
      status: 'error',
      message: 'Too many requests, please try again later',
    },
  });

  // Apply rate limiting
  app.use('/api/auth', authLimiter);
  app.use('/api', generalLimiter);
};

// Input sanitization
import validator from 'validator';

export const sanitizeInput = (input: string): string => {
  return validator.escape(validator.trim(input));
};

// Password validation
export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/(?=.*\\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// CORS configuration
import cors from 'cors';

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));`}
          explanation={[
            {
              label: "helmet()",
              desc: "Sets security headers to protect against common vulnerabilities",
            },
            {
              label: "rateLimit({ max: 5 })",
              desc: "Limits authentication attempts to prevent brute force attacks",
            },
            {
              label: "validator.escape()",
              desc: "Sanitizes input to prevent XSS attacks",
            },
            {
              label: "password regex validation",
              desc: "Enforces strong password requirements with regex patterns",
            },
            {
              label: "CORS allowedOrigins",
              desc: "Restricts API access to specific frontend domains",
            },
          ]}
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">
          🔒 Security Checklist
        </h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>
            • Use strong JWT secrets (256+ bits) stored in environment variables
          </li>
          <li>• Implement rate limiting on authentication endpoints</li>
          <li>• Hash passwords with bcrypt (12+ rounds)</li>
          <li>• Validate and sanitize all user input</li>
          <li>• Use HTTPS in production with proper CORS configuration</li>
          <li>• Implement refresh token rotation for better security</li>
        </ul>
      </div>
    </div>
  ),
};
