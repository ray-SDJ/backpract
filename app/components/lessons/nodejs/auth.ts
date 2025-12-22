import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Express JWT Authentication & Security",
  description:
    "Build a complete authentication system in Express.js with JWT tokens, bcrypt password hashing, and comprehensive security middleware.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>Implement enterprise-grade authentication in Express.js with JWT tokens, secure password hashing, role-based access control, and security best practices.</p>

    <h2>Installing Required Packages</h2>
    
    <p>Install authentication and security dependencies:</p>

    <pre class="code-block">
      <code>
# Core authentication packages
npm install jsonwebtoken bcryptjs cookie-parser

# Security middleware
npm install helmet express-rate-limit express-mongo-sanitize xss-clean hpp cors

# Validation
npm install validator express-validator

# Environment variables
npm install dotenv

# Optional: For refresh tokens
npm install uuid
      </code>
    </pre>

    <h2>User Model with Password Hashing</h2>
    
    <p>Create a Mongoose user model with secure password handling:</p>

    <pre class="code-block">
      <code>
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't return password by default
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update passwordChangedAt when password is modified
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT access token
userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { 
      userId: this._id,
      email: this.email,
      role: this.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
};

// Generate JWT refresh token
userSchema.methods.generateRefreshToken = function() {
  const refreshToken = jwt.sign(
    { userId: this._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );
  
  // Store refresh token in user document
  this.refreshTokens.push({ token: refreshToken });
  
  // Keep only last 5 refresh tokens
  if (this.refreshTokens.length &gt; 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }
  
  return refreshToken;
};

// Check if password changed after JWT was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp &lt; changedTimestamp;
  }
  return false;
};

// Remove sensitive data from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.refreshTokens;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  return user;
};

module.exports = mongoose.model('User', userSchema);
      </code>
    </pre>

    <h2>Authentication Controllers</h2>
    
    <p>Create authentication controller with registration, login, and token management:</p>

    <pre class="code-block">
      <code>
// controllers/authController.js
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  
  // Save refresh token to database
  user.save({ validateBeforeSave: false });
  
  // Cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  
  // Set cookie
  res.cookie('jwt', accessToken, cookieOptions);
  
  // Send response
  res.status(statusCode).json({
    success: true,
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already exists with this email'
      });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password
    });
    
    // Send token response
    sendTokenResponse(user, 201, res);
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }
    
    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Account has been deactivated'
      });
    }
    
    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });
    
    // Send token response
    sendTokenResponse(user, 200, res);
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login'
    });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token required'
      });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Find user and check if refresh token exists
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }
    
    // Check if refresh token is in user's token list
    const tokenExists = user.refreshTokens.some(t =&gt; t.token === refreshToken);
    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }
    
    // Generate new access token
    const newAccessToken = user.generateAccessToken();
    
    res.json({
      success: true,
      accessToken: newAccessToken
    });
    
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid or expired refresh token'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      // Remove refresh token from user
      await User.findByIdAndUpdate(req.user.userId, {
        $pull: { refreshTokens: { token: refreshToken } }
      });
    }
    
    // Clear cookie
    res.clearCookie('jwt');
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during logout'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide current and new password'
      });
    }
    
    // Get user with password
    const user = await User.findById(req.user.userId).select('+password');
    
    // Verify current password
    const isPasswordMatch = await user.comparePassword(currentPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    // Clear all refresh tokens (force re-login on all devices)
    user.refreshTokens = [];
    await user.save({ validateBeforeSave: false });
    
    // Send new tokens
    sendTokenResponse(user, 200, res);
    
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during password update'
    });
  }
};
      </code>
    </pre>

    <h2>Authentication Middleware</h2>
    
    <p>Create middleware to protect routes and check permissions:</p>

    <pre class="code-block">
      <code>
// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header or cookie
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized. Please log in.'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
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
    
    // Check if password was changed after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        success: false,
        error: 'Password recently changed. Please log in again.'
      });
    }
    
    // Grant access to protected route
    req.user = decoded;
    next();
    
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }
    
    res.status(401).json({
      success: false,
      error: 'Not authorized'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: \`User role '\${req.user.role}' is not authorized to access this route\`
      });
    }
    
    next();
  };
};

// Optional authentication (for public endpoints that can show more data if authenticated)
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (user && user.isActive) {
        req.user = decoded;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
      </code>
    </pre>

    <h2>Input Validation Middleware</h2>
    
    <p>Add validation for authentication endpoints:</p>

    <pre class="code-block">
      <code>
// middleware/validators.js
const { body } = require('express-validator');

exports.validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

exports.validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

exports.validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];
      </code>
    </pre>

    <h2>Security Middleware Setup</h2>
    
    <p>Configure security middleware in your main app:</p>

    <pre class="code-block">
      <code>
// app.js or server.js
const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later'
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp({
  whitelist: ['sort', 'fields', 'page', 'limit']
}));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

module.exports = app;
      </code>
    </pre>

    <h2>Authentication Routes</h2>
    
    <p>Set up authentication routes:</p>

    <pre class="code-block">
      <code>
// routes/auth.js
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  updatePassword
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  validatePasswordUpdate
} = require('../middleware/validators');

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh', refreshToken);

// Protected routes
router.use(protect); // All routes below are protected

router.get('/me', getMe);
router.post('/logout', logout);
router.put('/password', validatePasswordUpdate, updatePassword);

// Admin only route example
router.get('/users', authorize('admin'), async (req, res) =&gt; {
  const users = await User.find();
  res.json({ success: true, data: { users } });
});

module.exports = router;
      </code>
    </pre>

    <h2>Environment Configuration</h2>
    
    <p>Set up your environment variables:</p>

    <pre class="code-block">
      <code>
# .env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/myapp

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters
JWT_REFRESH_EXPIRES_IN=30d

# Client URL
CLIENT_URL=http://localhost:3000

# Cookie settings
COOKIE_EXPIRES_IN=7
      </code>
    </pre>

    <h2>Testing Authentication</h2>
    
    <p>Test your authentication endpoints:</p>

    <pre class="code-block">
      <code>
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# Get current user (protected route)
curl -X GET http://localhost:5000/api/auth/me \\
  -H "Authorization: Bearer &lt;your-access-token&gt;"

# Refresh token
curl -X POST http://localhost:5000/api/auth/refresh \\
  -H "Content-Type: application/json" \\
  -d '{
    "refreshToken": "&lt;your-refresh-token&gt;"
  }'

# Update password
curl -X PUT http://localhost:5000/api/auth/password \\
  -H "Authorization: Bearer &lt;your-access-token&gt;" \\
  -H "Content-Type: application/json" \\
  -d '{
    "currentPassword": "SecurePass123",
    "newPassword": "NewSecurePass456"
  }'
      </code>
    </pre>

    <h2>Security Best Practices</h2>
    
    <div class="explanation-list">
      <ul>
        <li><strong>Strong Secrets:</strong> Use at least 32-character random strings for JWT secrets</li>
        <li><strong>HTTPS Only:</strong> Always use HTTPS in production</li>
        <li><strong>Bcrypt Rounds:</strong> Use at least 12 salt rounds for password hashing</li>
        <li><strong>Token Expiration:</strong> Short expiration for access tokens (1 hour), longer for refresh tokens (30 days)</li>
        <li><strong>Rate Limiting:</strong> Prevent brute force attacks on authentication endpoints</li>
        <li><strong>Input Validation:</strong> Always validate and sanitize user input</li>
        <li><strong>Security Headers:</strong> Use Helmet.js for security headers</li>
        <li><strong>Cookie Security:</strong> Use httpOnly, secure, and sameSite flags</li>
        <li><strong>NoSQL Injection:</strong> Use mongo-sanitize to prevent injection attacks</li>
        <li><strong>XSS Protection:</strong> Sanitize user input with xss-clean</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Implement JWT-based authentication in Express.js",
    "Create secure user registration and login with bcrypt",
    "Build authentication middleware for route protection",
    "Implement role-based authorization",
    "Add comprehensive security middleware",
  ],
  practiceInstructions: [
    "Install authentication and security packages",
    "Create User model with password hashing",
    "Implement registration and login controllers",
    "Create authentication middleware (protect, authorize)",
    "Add security middleware (helmet, rate limiting, etc.)",
    "Test authentication flow with access and refresh tokens",
  ],
  hints: [
    "Use bcrypt with at least 12 salt rounds",
    "Store JWT secrets in environment variables",
    "Include user role in JWT payload for authorization",
    "Implement refresh token rotation for security",
    "Use rate limiting on authentication endpoints",
  ],
  solution: `// Protected route with role-based authorization
const { protect, authorize } = require('../middleware/auth');

router.get('/admin/dashboard', 
  protect, 
  authorize('admin', 'moderator'), 
  async (req, res) => {
    res.json({ 
      message: 'Welcome to admin dashboard',
      user: req.user 
    });
  }
);`,
};
