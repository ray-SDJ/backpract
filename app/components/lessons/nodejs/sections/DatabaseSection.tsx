import React from "react";
import { Database, Code, Zap } from "lucide-react";

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

export const DatabaseSection = {
  id: "database",
  title: "MongoDB & Mongoose Integration",
  icon: Database,
  overview: "Database integration with MongoDB and Mongoose ODM",
  content: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          📊 Database Integration with MongoDB
        </h3>
        <p className="text-blue-800 leading-relaxed">
          Learn to integrate MongoDB with your Node.js applications using
          Mongoose ODM. Master schema design, data validation, relationships,
          and advanced query operations for scalable database architecture.
        </p>
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-green-400" />
          <h4 className="text-white font-semibold">MongoDB & Mongoose Setup</h4>
        </div>

        <CodeExplanation
          code={`# Install MongoDB dependencies
npm install mongoose

# Install optional development tools
npm install -D mongodb-memory-server

# MongoDB Connection Setup
// src/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(\`📊 MongoDB Connected: \${conn.connection.host}\`);
    return conn;
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
});

module.exports = connectDB;`}
          explanation={[
            {
              label: "mongoose",
              desc: "MongoDB object modeling library with schema validation",
            },
            {
              label: "useNewUrlParser",
              desc: "Uses new MongoDB connection string parser",
            },
            {
              label: "useUnifiedTopology",
              desc: "Uses new Server Discovery and Monitoring engine",
            },
            {
              label: "SIGINT handler",
              desc: "Cleanly closes database connection on app termination",
            },
          ]}
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-blue-400" />
          <h4 className="text-white font-semibold">
            Schema Definition & Models
          </h4>
        </div>

        <CodeExplanation
          code={`// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\\S+@\\S+\\.\\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profile: {
    avatar: String,
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    socialLinks: {
      twitter: String,
      linkedin: String,
      github: String
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ name: 'text', 'profile.bio': 'text' });

// Virtual for user's full profile URL
userSchema.virtual('profileUrl').get(function() {
  return \`/users/\${this._id}\`;
});

// Pre-save middleware for password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method for password comparison
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method for finding active users
userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true }).select('-password');
};

module.exports = mongoose.model('User', userSchema);`}
          explanation={[
            {
              label: "Schema validation",
              desc: "Built-in validators for data integrity and security",
            },
            {
              label: "Indexes",
              desc: "Database indexes for optimized query performance",
            },
            {
              label: "Virtual properties",
              desc: "Computed properties not stored in database",
            },
            {
              label: "Middleware hooks",
              desc: "Pre/post hooks for business logic like password hashing",
            },
            {
              label: "Instance methods",
              desc: "Methods available on document instances",
            },
            {
              label: "Static methods",
              desc: "Methods available on the Model constructor",
            },
          ]}
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h4 className="text-white font-semibold">
            CRUD Operations & Controllers
          </h4>
        </div>

        <CodeExplanation
          code={`// src/controllers/userController.js
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

// Get all users with filtering and pagination
exports.getAllUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('profile.avatar');

  const total = await User.countDocuments(filter);

  res.json({
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
      total
    }
  });
});

// Create new user
exports.createUser = catchAsync(async (req, res) => {
  const user = await User.create(req.body);
  
  res.status(201).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

// Get user by ID
exports.getUserById = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  res.json({
    success: true,
    data: user
  });
});

// Update user
exports.updateUser = catchAsync(async (req, res) => {
  const allowedFields = ['name', 'email', 'profile'];
  const updates = {};
  
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    req.params.id,
    updates,
    { 
      new: true, 
      runValidators: true 
    }
  ).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  res.json({
    success: true,
    data: user
  });
});

// Delete user (soft delete)
exports.deleteUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  res.json({
    success: true,
    message: 'User deactivated successfully'
  });
});

// Utility function for async error handling
// src/utils/catchAsync.js
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;`}
          explanation={[
            {
              label: "Pagination",
              desc: "Efficient handling of large datasets with skip/limit",
            },
            {
              label: "Text search",
              desc: "MongoDB text search with indexed fields",
            },
            {
              label: "Field filtering",
              desc: "Selective updates to prevent unauthorized changes",
            },
            {
              label: "Population",
              desc: "Automatic reference resolution for related documents",
            },
            {
              label: "Soft delete",
              desc: "Mark records as inactive instead of removing them",
            },
            {
              label: "catchAsync",
              desc: "Utility to handle async errors in Express routes",
            },
          ]}
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-purple-400" />
          <h4 className="text-white font-semibold">
            Advanced Queries & Aggregation
          </h4>
        </div>

        <CodeExplanation
          code={`// Advanced query examples
// src/services/userService.js

// Complex aggregation pipeline
exports.getUserStats = async () => {
  const stats = await User.aggregate([
    // Stage 1: Filter active users
    { $match: { isActive: true } },
    
    // Stage 2: Group by role and calculate metrics
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
        avgAge: { $avg: '$age' },
        recentLogins: {
          $sum: {
            $cond: [
              { $gte: ['$lastLogin', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
              1,
              0
            ]
          }
        }
      }
    },
    
    // Stage 3: Sort by count
    { $sort: { count: -1 } }
  ]);

  return stats;
};

// Advanced filtering with multiple conditions
exports.findUsersAdvanced = async (filters) => {
  const query = User.find();
  
  // Date range filtering
  if (filters.createdAfter || filters.createdBefore) {
    const dateFilter = {};
    if (filters.createdAfter) dateFilter.$gte = new Date(filters.createdAfter);
    if (filters.createdBefore) dateFilter.$lte = new Date(filters.createdBefore);
    query.where('createdAt', dateFilter);
  }
  
  // Array field filtering
  if (filters.skills && filters.skills.length > 0) {
    query.where('skills').in(filters.skills);
  }
  
  // Nested object filtering
  if (filters.location) {
    query.where('profile.location').regex(filters.location, 'i');
  }
  
  // Execute query with population
  return await query
    .populate('posts', 'title createdAt')
    .populate('followers', 'name avatar')
    .sort({ createdAt: -1 })
    .lean(); // Returns plain objects for better performance
};

// Geospatial queries (requires GeoJSON schema)
exports.findNearbyUsers = async (longitude, latitude, maxDistance) => {
  return await User.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    }
  });
};

// Transaction example
const mongoose = require('mongoose');

exports.transferCredits = async (fromUserId, toUserId, amount) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      // Deduct from sender
      const sender = await User.findByIdAndUpdate(
        fromUserId,
        { $inc: { credits: -amount } },
        { session, new: true }
      );
      
      if (sender.credits < 0) {
        throw new Error('Insufficient credits');
      }
      
      // Add to receiver
      await User.findByIdAndUpdate(
        toUserId,
        { $inc: { credits: amount } },
        { session, new: true }
      );
    });
    
    console.log('Transfer completed successfully');
  } catch (error) {
    console.error('Transfer failed:', error);
    throw error;
  } finally {
    await session.endSession();
  }
};`}
          explanation={[
            {
              label: "Aggregation pipeline",
              desc: "Complex data transformations and analytics queries",
            },
            {
              label: "Query chaining",
              desc: "Fluent interface for building complex queries",
            },
            {
              label: "Population",
              desc: "Automatically resolve references to other collections",
            },
            {
              label: "Lean queries",
              desc: "Return plain objects for better performance",
            },
            {
              label: "Geospatial queries",
              desc: "Location-based queries with MongoDB's geo features",
            },
            {
              label: "Transactions",
              desc: "ACID transactions for data consistency",
            },
          ]}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">20 min</div>
          <div className="text-slate-600">Setup & Connection</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">35 min</div>
          <div className="text-slate-600">Schema Design</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">45 min</div>
          <div className="text-slate-600">Advanced Operations</div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">
          💡 Database Best Practices
        </h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Design schemas with proper validation and indexes</li>
          <li>• Use population sparingly and only when necessary</li>
          <li>• Implement proper error handling for database operations</li>
          <li>
            • Use transactions for operations affecting multiple documents
          </li>
          <li>• Monitor query performance and optimize slow queries</li>
        </ul>
      </div>
    </div>
  ),
};
