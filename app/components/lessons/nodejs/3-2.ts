import { LessonData } from "../types";

const lessonData: LessonData = {
  title: "CRUD Operations",
  difficulty: "Intermediate",
  description:
    "Master Create, Read, Update, and Delete operations with MongoDB and Mongoose in Express.js applications.",
  objectives: [
    "Implement complete CRUD operations with Mongoose",
    "Handle advanced queries and filtering",
    "Add pagination and sorting to queries",
    "Implement proper error handling and validation",
    "Create RESTful API endpoints for database operations",
  ],
  content: `
    <div class="lesson-card bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
      <div class="lesson-content p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">CRUD Operations with MongoDB</h1>
        
        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📝 CRUD Operations Overview
          </h2>
          <p class="text-gray-700 mb-4 leading-relaxed">
            CRUD operations form the foundation of any data-driven application. Learn how to implement 
            Create, Read, Update, and Delete operations efficiently with MongoDB and Mongoose, 
            including advanced querying, pagination, and error handling.
          </p>
          
          <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-blue-900 mb-3">🔄 CRUD Operation Mapping</h4>
            <ul class="explanation-list space-y-2">
              <li><strong>Create (POST):</strong> Add new documents to the database</li>
              <li><strong>Read (GET):</strong> Retrieve documents with queries and filters</li>
              <li><strong>Update (PUT/PATCH):</strong> Modify existing documents</li>
              <li><strong>Delete (DELETE):</strong> Remove documents from database</li>
            </ul>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            ➕ Create Operations
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>// controllers/userController.js - Create operations
const User = require('../models/User');

// Create single user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, age, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      age,
      role
    });
    
    const savedUser = await user.save();
    
    // Remove password from response
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userResponse
    });
    
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Alternative create method using Model.create()
exports.createUserAlternative = async (req, res) => {
  try {
    const userData = req.body;
    
    // Create user directly
    const user = await User.create(userData);
    
    // Return user without password
    const { password, ...userWithoutPassword } = user.toObject();
    
    res.status(201).json({
      success: true,
      data: userWithoutPassword
    });
    
  } catch (error) {
    // Error handling (same as above)
    handleCreateError(error, res);
  }
};

// Create multiple users (bulk insert)
exports.createMultipleUsers = async (req, res) => {
  try {
    const { users } = req.body;
    
    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Users array is required and must not be empty'
      });
    }
    
    // Use insertMany for bulk operations
    const createdUsers = await User.insertMany(users, {
      ordered: false, // Continue on error
      rawResult: true // Get detailed results
    });
    
    res.status(201).json({
      success: true,
      message: \`\${createdUsers.insertedCount} users created successfully\`,
      data: createdUsers.ops.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      })
    });
    
  } catch (error) {
    if (error.name === 'BulkWriteError') {
      // Handle bulk write errors
      const successCount = error.result.insertedCount;
      const errorCount = error.writeErrors.length;
      
      return res.status(207).json({
        success: true,
        message: \`\${successCount} users created, \${errorCount} failed\`,
        inserted: successCount,
        errors: error.writeErrors.map(err => ({
          index: err.index,
          error: err.errmsg
        }))
      });
    }
    
    handleCreateError(error, res);
  }
};</code></pre>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🔍 Read Operations
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>// Read operations with advanced querying
exports.getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      fields,
      search,
      role,
      isActive,
      ageMin,
      ageMax,
      createdAfter,
      createdBefore
    } = req.query;
    
    // Build query object
    const query = {};
    
    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by role
    if (role) {
      query.role = role;
    }
    
    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    // Age range filtering
    if (ageMin || ageMax) {
      query.age = {};
      if (ageMin) query.age.$gte = parseInt(ageMin);
      if (ageMax) query.age.$lte = parseInt(ageMax);
    }
    
    // Date range filtering
    if (createdAfter || createdBefore) {
      query.createdAt = {};
      if (createdAfter) query.createdAt.$gte = new Date(createdAfter);
      if (createdBefore) query.createdAt.$lte = new Date(createdBefore);
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build the main query
    let mongoQuery = User.find(query);
    
    // Field selection
    if (fields) {
      const selectedFields = fields.split(',').join(' ');
      mongoQuery = mongoQuery.select(selectedFields);
    } else {
      mongoQuery = mongoQuery.select('-password'); // Exclude password by default
    }
    
    // Apply sorting
    mongoQuery = mongoQuery.sort(sort);
    
    // Apply pagination
    mongoQuery = mongoQuery.skip(skip).limit(parseInt(limit));
    
    // Execute query
    const users = await mongoQuery;
    
    // Get total count for pagination
    const totalCount = await User.countDocuments(query);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalCount,
        itemsPerPage: parseInt(limit),
        hasNextPage,
        hasPrevPage
      },
      applied_filters: {
        search,
        role,
        isActive,
        ageRange: { min: ageMin, max: ageMax },
        dateRange: { after: createdAfter, before: createdBefore }
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { populate } = req.query;
    
    let query = User.findById(id).select('-password');
    
    // Optional population of referenced fields
    if (populate) {
      const populateFields = populate.split(',');
      populateFields.forEach(field => {
        query = query.populate(field.trim());
      });
    }
    
    const user = await query;
    
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
    
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
};

// Advanced aggregation queries
exports.getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      // Stage 1: Match active users only
      { $match: { isActive: true } },
      
      // Stage 2: Group by role and calculate statistics
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          averageAge: { $avg: '$age' },
          minAge: { $min: '$age' },
          maxAge: { $max: '$age' },
          recentUsers: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                1,
                0
              ]
            }
          }
        }
      },
      
      // Stage 3: Sort by count
      { $sort: { count: -1 } },
      
      // Stage 4: Add percentage
      {
        $group: {
          _id: null,
          roles: { $push: '$$ROOT' },
          totalUsers: { $sum: '$count' }
        }
      },
      
      // Stage 5: Calculate percentages
      {
        $unwind: '$roles'
      },
      
      {
        $project: {
          _id: '$roles._id',
          count: '$roles.count',
          percentage: { $multiply: [{ $divide: ['$roles.count', '$totalUsers'] }, 100] },
          averageAge: '$roles.averageAge',
          ageRange: { min: '$roles.minAge', max: '$roles.maxAge' },
          recentUsers: '$roles.recentUsers'
        }
      }
    ]);
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate user statistics'
    });
  }
};</code></pre>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            ✏️ Update Operations
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>// Update operations
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated directly
    const protectedFields = ['password', '_id', 'createdAt', '__v'];
    protectedFields.forEach(field => delete updateData[field]);
    
    // Update user and return new document
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validators
        context: 'query' // Ensure validators have access to this
      }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
    
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
};

// Partial update (PATCH)
exports.patchUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Find user first
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Apply updates
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== 'password') {
        user[key] = updates[key];
      }
    });
    
    // Save with validation
    const savedUser = await user.save();
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: savedUser.getPublicProfile()
    });
    
  } catch (error) {
    // Handle errors (same as update)
    handleUpdateError(error, res);
  }
};

// Update password separately (requires current password)
exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required'
      });
    }
    
    // Find user with password field
    const user = await User.findById(id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }
    
    // Update password (will be hashed by pre-save middleware)
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password updated successfully'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update password'
    });
  }
};

// Bulk update operations
exports.bulkUpdateUsers = async (req, res) => {
  try {
    const { filter, update } = req.body;
    
    if (!filter || !update) {
      return res.status(400).json({
        success: false,
        error: 'Filter and update objects are required'
      });
    }
    
    // Perform bulk update
    const result = await User.updateMany(filter, update);
    
    res.json({
      success: true,
      message: \`\${result.modifiedCount} users updated successfully\`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Bulk update failed'
    });
  }
};</code></pre>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🗑️ Delete Operations
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>// Delete operations
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully',
      data: {
        id: deletedUser._id,
        name: deletedUser.name,
        email: deletedUser.email
      }
    });
    
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
};

// Soft delete (recommended approach)
exports.softDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndUpdate(
      id,
      { 
        isActive: false,
        deletedAt: new Date()
      },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deactivated successfully',
      data: user
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to deactivate user'
    });
  }
};

// Restore soft-deleted user
exports.restoreUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndUpdate(
      id,
      { 
        isActive: true,
        $unset: { deletedAt: 1 }
      },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User restored successfully',
      data: user
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to restore user'
    });
  }
};

// Bulk delete operations
exports.bulkDeleteUsers = async (req, res) => {
  try {
    const { filter, permanent = false } = req.body;
    
    if (!filter) {
      return res.status(400).json({
        success: false,
        error: 'Filter object is required'
      });
    }
    
    let result;
    
    if (permanent) {
      // Hard delete
      result = await User.deleteMany(filter);
      
      res.json({
        success: true,
        message: \`\${result.deletedCount} users permanently deleted\`,
        deletedCount: result.deletedCount
      });
    } else {
      // Soft delete
      result = await User.updateMany(filter, {
        isActive: false,
        deletedAt: new Date()
      });
      
      res.json({
        success: true,
        message: \`\${result.modifiedCount} users deactivated\`,
        modifiedCount: result.modifiedCount
      });
    }
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Bulk delete operation failed'
    });
  }
};</code></pre>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🎯 Practice Exercise
          </h2>
          
          <div class="practice-box bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-yellow-900 mb-3">🏪 E-commerce Product Management</h4>
            <p class="text-yellow-800 mb-3">Build a complete product management system:</p>
            <ol class="list-decimal list-inside space-y-2 text-yellow-800">
              <li>Create Product model with categories, pricing, and inventory</li>
              <li>Implement advanced search and filtering (price range, category, availability)</li>
              <li>Add pagination and sorting options</li>
              <li>Create bulk operations for inventory management</li>
              <li>Implement product reviews and ratings</li>
              <li>Add soft delete functionality for products</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  `,
  practiceInstructions: [
    "How do you CREATE a document using Model.create()?",
    "How do you READ documents using Model.find() or Model.findById()?",
    "How do you UPDATE a document using Model.findByIdAndUpdate()?",
    "How do you DELETE a document using Model.findByIdAndDelete()?",
    "Why must you use async/await with Mongoose operations?",
    "How do you handle errors using try/catch blocks?",
    "Implement all 4 CRUD operations: .create(), .find(), .findByIdAndUpdate(), .findByIdAndDelete()",
  ],
  hints: [
    "Use MongoDB indexes on frequently queried fields for better performance",
    "Always validate input data before performing database operations",
    "Implement proper error handling for different types of MongoDB errors",
    "Use aggregation pipelines for complex queries and analytics",
    "Consider using transactions for operations that affect multiple documents",
    "Implement pagination to handle large datasets efficiently",
  ],
  solution: `
// Complete CRUD controller example:

const Product = require('../models/Product');

// Advanced read with filtering and pagination
exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      category,
      minPrice,
      maxPrice,
      inStock,
      search
    } = req.query;

    // Build query
    const query = {};
    
    if (category) query.category = category;
    if (inStock !== undefined) query.stock = { $gt: 0 };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;
    
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('category', 'name')
      .lean();

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create with validation
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => ({
        field: e.path,
        message: e.message
      }));
      return res.status(400).json({ success: false, errors });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update with validation
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
  `,
  validationCriteria: {
    requiredIncludes: [
      ".find(",
      ".findById(",
      ".create(",
      ".findByIdAndUpdate(",
      ".findByIdAndDelete(",
    ],
    requiredPatterns: [
      /\.find(One|ById)?\s*\(/,
      /\.create\s*\(/,
      /\.(findByIdAndUpdate|findOneAndUpdate|updateOne)\s*\(/,
      /\.(findByIdAndDelete|findOneAndDelete|deleteOne)\s*\(/,
      /async\s+\(/,
      /await\s+/,
    ],
    minLines: 25,
    customValidator: (code: string) => {
      const hasFind = /\.(find|findOne|findById)\s*\(/.test(code);
      const hasCreate = /\.create\s*\(/.test(code);
      const hasUpdate =
        /\.(findByIdAndUpdate|findOneAndUpdate|updateOne)\s*\(/.test(code);
      const hasDelete =
        /\.(findByIdAndDelete|findOneAndDelete|deleteOne)\s*\(/.test(code);
      const hasAsync = /async\s+(function|\()/.test(code);
      const hasAwait = /await\s+/.test(code);
      const hasTryCatch = /try\s*\{/.test(code) && /catch\s*\(/.test(code);

      if (!hasFind) {
        return {
          valid: false,
          message:
            "Must implement READ operation (.find, .findById, or .findOne)",
        };
      }
      if (!hasCreate) {
        return {
          valid: false,
          message: "Must implement CREATE operation (.create)",
        };
      }
      if (!hasUpdate) {
        return {
          valid: false,
          message:
            "Must implement UPDATE operation (.findByIdAndUpdate or similar)",
        };
      }
      if (!hasDelete) {
        return {
          valid: false,
          message:
            "Must implement DELETE operation (.findByIdAndDelete or similar)",
        };
      }
      if (!hasAsync || !hasAwait) {
        return {
          valid: false,
          message: "Must use async/await for database operations",
        };
      }
      if (!hasTryCatch) {
        return {
          valid: false,
          message: "Should include try/catch for error handling",
        };
      }

      return {
        valid: true,
        message: "Complete CRUD operations implemented correctly!",
      };
    },
  },
  starterCode: `// Implement CRUD operations with Mongoose
const mongoose = require('mongoose');
const User = require('./models/User'); // Assume User model exists

// TODO: CREATE - Add a new user
// async function createUser(userData) {
//   try {
//     const user = await User.create(userData);
//     return user;
//   } catch (error) {
//     console.error(error);
//   }
// }

// TODO: READ - Find all users
// async function getAllUsers() { ... }

// TODO: READ - Find user by ID
// async function getUserById(id) { ... }

// TODO: UPDATE - Update user by ID
// async function updateUser(id, updateData) {
//   const user = await User.findByIdAndUpdate(id, updateData, { new: true });
// }

// TODO: DELETE - Delete user by ID
// async function deleteUser(id) { ... }

console.log("Implement all CRUD operations!");
`,
};

export default lessonData;
export { lessonData };
