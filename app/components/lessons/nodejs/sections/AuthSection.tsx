import React from "react";
import { Shield, Lock, Key } from "lucide-react";

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

export const AuthSection = {
  id: "auth",
  title: "JWT Authentication & Security",
  icon: Shield,
  overview: "Implementing secure authentication with JWT tokens and middleware",
  content: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border border-red-200">
        <h3 className="text-lg font-semibold text-red-900 mb-3">
          🔐 Authentication & Authorization System
        </h3>
        <p className="text-red-800 leading-relaxed">
          Build a comprehensive authentication system with JWT tokens, password
          hashing, role-based access control, and security middleware. Learn to
          protect your API endpoints and manage user sessions securely.
        </p>
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-blue-400" />
          <h4 className="text-white font-semibold">JWT Authentication Setup</h4>
        </div>

        <CodeExplanation
          code={`// Install authentication dependencies
npm install jsonwebtoken bcryptjs cookie-parser express-rate-limit

// src/config/auth.js - Authentication configuration
const jwt = require('jsonwebtoken');

const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key-change-this',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: '30d'
  },
  bcrypt: {
    rounds: 12
  },
  cookie: {
    name: 'jwt',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
};

// JWT utility functions
const signToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    issuer: 'my-api',
    audience: 'my-app-users'
  });
};

const signRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret + '_refresh', {
    expiresIn: config.jwt.refreshExpiresIn
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.secret + '_refresh');
};

module.exports = {
  config,
  signToken,
  signRefreshToken,
  verifyToken,
  verifyRefreshToken
};`}
          explanation={[
            {
              label: "JWT configuration",
              desc: "Secure token configuration with proper expiration times",
            },
            {
              label: "Token signing",
              desc: "Create JWT tokens with user payload and security claims",
            },
            {
              label: "Refresh tokens",
              desc: "Long-lived tokens for refreshing access tokens",
            },
            {
              label: "Cookie settings",
              desc: "Secure HTTP-only cookies for token storage",
            },
            {
              label: "Environment variables",
              desc: "Keep secrets secure with environment configuration",
            },
          ]}
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-green-400" />
          <h4 className="text-white font-semibold">
            Authentication Controllers
          </h4>
        </div>

        <CodeExplanation
          code={`// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken, signRefreshToken, verifyRefreshToken, config } = require('../config/auth');
const catchAsync = require('../utils/catchAsync');

// Register new user
exports.register = catchAsync(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      error: 'Passwords do not match'
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      error: 'User already exists with this email'
    });
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password // Will be hashed by pre-save middleware
  });

  // Generate tokens
  const accessToken = signToken({ 
    userId: user._id, 
    email: user.email, 
    role: user.role 
  });
  const refreshToken = signRefreshToken({ userId: user._id });

  // Set secure cookie
  res.cookie(config.cookie.name, accessToken, config.cookie);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      accessToken,
      refreshToken
    }
  });
});

// Login user
exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password provided
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide email and password'
    });
  }

  // Find user and include password field
  const user = await User.findOne({ email, isActive: true }).select('+password');

  // Check if user exists and password is correct
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Generate tokens
  const accessToken = signToken({ 
    userId: user._id, 
    email: user.email, 
    role: user.role 
  });
  const refreshToken = signRefreshToken({ userId: user._id });

  // Set secure cookie
  res.cookie(config.cookie.name, accessToken, config.cookie);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      },
      accessToken,
      refreshToken
    }
  });
});

// Refresh access token
exports.refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      error: 'Refresh token required'
    });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    const newAccessToken = signToken({ 
      userId: user._id, 
      email: user.email, 
      role: user.role 
    });

    res.cookie(config.cookie.name, newAccessToken, config.cookie);

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid refresh token'
    });
  }
});

// Logout user
exports.logout = catchAsync(async (req, res) => {
  res.clearCookie(config.cookie.name);
  
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Get current user profile
exports.getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.userId);

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    }
  });
});

// Update password
exports.updatePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({
      success: false,
      error: 'New passwords do not match'
    });
  }

  const user = await User.findById(req.user.userId).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    return res.status(401).json({
      success: false,
      error: 'Current password is incorrect'
    });
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
});`}
          explanation={[
            {
              label: "Password validation",
              desc: "Secure password comparison and confirmation checks",
            },
            {
              label: "User existence check",
              desc: "Prevent duplicate registrations and handle login attempts",
            },
            {
              label: "Token generation",
              desc: "Create both access and refresh tokens with proper payloads",
            },
            {
              label: "Secure cookies",
              desc: "Store tokens in HTTP-only cookies for XSS protection",
            },
            {
              label: "Last login tracking",
              desc: "Monitor user activity for security auditing",
            },
          ]}
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-yellow-400" />
          <h4 className="text-white font-semibold">
            Authentication Middleware
          </h4>
        </div>

        <CodeExplanation
          code={`// src/middleware/auth.js
const { verifyToken } = require('../config/auth');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

// Authenticate user middleware
exports.authenticate = catchAsync(async (req, res, next) => {
  let token;

  // Get token from headers or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required. Please log in.'
    });
  }

  try {
    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User no longer exists'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account has been deactivated'
      });
    }

    // Check if user changed password after token was issued
    if (user.passwordChangedAfter && user.passwordChangedAfter(decoded.iat)) {
      return res.status(401).json({
        success: false,
        error: 'Password recently changed. Please log in again.'
      });
    }

    // Grant access to protected route
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }
    
    return res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
});

// Authorization middleware (role-based)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions for this action'
      });
    }

    next();
  };
};

// Optional authentication (for mixed public/private content)
exports.optionalAuth = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (token) {
    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);
      
      if (user && user.isActive) {
        req.user = decoded;
      }
    } catch (error) {
      // Token invalid, continue without authentication
      console.log('Optional auth failed:', error.message);
    }
  }

  next();
});

// Resource ownership middleware
exports.checkOwnership = (resourceModel, resourceIdParam = 'id') => {
  return catchAsync(async (req, res, next) => {
    const resourceId = req.params[resourceIdParam];
    const userId = req.user.userId;

    const resource = await resourceModel.findById(resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: 'Resource not found'
      });
    }

    // Allow admins to access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = resource.userId || resource.user || resource.createdBy;
    
    if (resourceUserId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only access your own resources.'
      });
    }

    req.resource = resource;
    next();
  });
};

// Rate limiting for auth endpoints
const rateLimit = require('express-rate-limit');

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Reset counter on successful login
  skipSuccessfulRequests: true
});`}
          explanation={[
            {
              label: "Token extraction",
              desc: "Get tokens from Authorization header or HTTP-only cookies",
            },
            {
              label: "User validation",
              desc: "Verify user exists, is active, and hasn't changed password",
            },
            {
              label: "Role-based access",
              desc: "Restrict endpoints based on user roles and permissions",
            },
            {
              label: "Resource ownership",
              desc: "Ensure users can only access their own resources",
            },
            {
              label: "Rate limiting",
              desc: "Prevent brute force attacks on authentication endpoints",
            },
          ]}
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-red-400" />
          <h4 className="text-white font-semibold">Security Best Practices</h4>
        </div>

        <CodeExplanation
          code={`// src/middleware/security.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Comprehensive security middleware setup
exports.setupSecurity = (app) => {
  // Set security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"]
      }
    },
    crossOriginEmbedderPolicy: false
  }));

  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());

  // Data sanitization against XSS attacks
  app.use(xss());

  // Prevent HTTP Parameter Pollution
  app.use(hpp({
    whitelist: ['sort', 'fields', 'page', 'limit']
  }));

  // Global rate limiting
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per window per IP
    message: {
      success: false,
      error: 'Too many requests from this IP, please try again later.'
    }
  });
  app.use('/api', globalLimiter);
};

// Password validation rules
const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();
passwordSchema
  .is().min(8)                                    // Minimum length 8
  .is().max(100)                                  // Maximum length 100
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits(2)                                // Must have at least 2 digits
  .has().not().spaces()                           // Should not have spaces
  .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist common passwords

exports.validatePassword = (password) => {
  return passwordSchema.validate(password, { list: true });
};

// Input validation middleware
const validator = require('validator');

exports.sanitizeInput = (req, res, next) => {
  // Sanitize string inputs
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = validator.escape(req.body[key].trim());
    }
  }
  next();
};

// CORS configuration for production
const cors = require('cors');

exports.corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Audit logging middleware
const winston = require('winston');

const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/audit.log' })
  ]
});

exports.auditLog = (req, res, next) => {
  // Log security-sensitive operations
  const sensitiveOperations = ['login', 'register', 'password-change', 'role-change'];
  const operation = req.path.split('/').pop();
  
  if (sensitiveOperations.includes(operation)) {
    auditLogger.info({
      operation,
      userId: req.user?.userId,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};

// Environment variables validation
exports.validateEnvironment = () => {
  const required = [
    'JWT_SECRET',
    'MONGODB_URI',
    'NODE_ENV'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(\`Missing required environment variables: \${missing.join(', ')}\`);
  }

  // Validate JWT secret strength
  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }
};`}
          explanation={[
            {
              label: "Helmet.js",
              desc: "Comprehensive security headers including CSP and XSS protection",
            },
            {
              label: "Input sanitization",
              desc: "Prevent NoSQL injection and XSS attacks through data cleaning",
            },
            {
              label: "Password validation",
              desc: "Enforce strong password policies with multiple criteria",
            },
            {
              label: "CORS configuration",
              desc: "Restrict cross-origin requests to trusted domains",
            },
            {
              label: "Audit logging",
              desc: "Track security-sensitive operations for monitoring",
            },
            {
              label: "Environment validation",
              desc: "Ensure all security configurations are properly set",
            },
          ]}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">30 min</div>
          <div className="text-slate-600">Authentication Setup</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">25 min</div>
          <div className="text-slate-600">Authorization & Middleware</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">35 min</div>
          <div className="text-slate-600">Security Hardening</div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">
          🔒 Security Best Practices
        </h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Use strong JWT secrets and rotate them regularly</li>
          <li>• Implement proper password hashing with bcrypt</li>
          <li>• Add rate limiting to prevent brute force attacks</li>
          <li>• Sanitize all user inputs to prevent injection attacks</li>
          <li>• Use HTTPS in production with proper CORS configuration</li>
          <li>• Log security events for monitoring and auditing</li>
        </ul>
      </div>
    </div>
  ),
};
