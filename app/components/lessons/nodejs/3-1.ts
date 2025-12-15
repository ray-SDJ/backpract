import { LessonData } from "../types";

const lessonData: LessonData = {
  title: "MongoDB with Mongoose",
  difficulty: "Intermediate",
  description:
    "Learn to integrate MongoDB database with Node.js using Mongoose ODM for data modeling and operations.",
  objectives: [
    "Set up MongoDB database connection",
    "Design schemas and models with Mongoose",
    "Implement basic CRUD operations",
    "Understand middleware and validation in Mongoose",
  ],
  content: `
    <div class="lesson-card bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
      <div class="lesson-content p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">MongoDB with Mongoose</h1>
        
        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🍃 MongoDB & Mongoose Introduction
          </h2>
          <p class="text-gray-700 mb-4 leading-relaxed">
            MongoDB is a popular NoSQL database that stores data in flexible, JSON-like documents. 
            Mongoose provides a straight-forward, schema-based solution to model your application data 
            with built-in type casting, validation, query building, and business logic hooks.
          </p>
          
          <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-green-900 mb-3">🌟 Why MongoDB + Mongoose?</h4>
            <ul class="explanation-list space-y-2">
              <li><strong>Flexible Schema:</strong> Easy to evolve data structure</li>
              <li><strong>JSON-like:</strong> Natural fit for JavaScript applications</li>
              <li><strong>Scalable:</strong> Handles large amounts of data efficiently</li>
              <li><strong>Rich Queries:</strong> Powerful query language and indexing</li>
              <li><strong>Mongoose ODM:</strong> Adds structure and validation to MongoDB</li>
            </ul>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            ⚙️ Setup and Installation
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code># Install MongoDB (macOS with Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Install MongoDB (Ubuntu)
sudo apt-get install mongodb

# Install MongoDB (Windows) - Download from mongodb.com

# Install Mongoose
npm install mongoose

# Optional: Install MongoDB Compass (GUI)
# Download from: https://www.mongodb.com/products/compass</code></pre>
          </div>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>// config/database.js - Database connection setup

// Import Mongoose ODM (Object Document Mapper)
// Mongoose provides schema-based solution to model MongoDB data
const mongoose = require('mongoose');

// connectDB is an async function because database connections are asynchronous
// async allows us to use await inside the function
const connectDB = async () => {
  // try-catch block handles potential connection errors
  try {
    // mongoose.connect() returns a Promise
    // await pauses execution until Promise resolves or rejects
    // process.env.MONGODB_URI comes from .env file (for security)
    // || means "or" - uses localhost if MONGODB_URI not defined (fallback)
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp',
      {
        // useNewUrlParser: true - uses MongoDB's new URL parser
        useNewUrlParser: true,
        // useUnifiedTopology: true - uses new Server Discovery and Monitoring engine
        useUnifiedTopology: true,
      }
    );

    // conn.connection.host contains the MongoDB server address
    // Template literal (\`\`) allows embedding variables with \${}
    console.log(\`📊 MongoDB Connected: \${conn.connection.host}\`);
    
    // ========== CONNECTION EVENT LISTENERS ==========
    // Event listeners monitor connection status changes
    
    // 'error' event fires when connection has an error AFTER initial connection
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    // 'disconnected' event fires when connection to MongoDB is lost
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Return connection object for further use
    return conn;
    
  } catch (error) {
    // Catch block executes if connection fails
    console.error('Database connection failed:', error);
    
    // process.exit(1) terminates the Node.js process
    // 1 = exit with error code (0 would mean success)
    // App can't function without database, so we exit
    process.exit(1);
  }
};

// ========== GRACEFUL SHUTDOWN ==========
// Handle process termination signals to close DB connection cleanly

// SIGINT = interrupt signal (Ctrl+C in terminal)
// process.on() registers event listener for system signals
process.on('SIGINT', async () => {
  // await ensures connection closes before exiting
  // Prevents data corruption and cleanly releases resources
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  
  // Exit with success code (0 = clean shutdown)
  process.exit(0);
});

// Export function so it can be used in other files
// Usage: const connectDB = require('./config/database');
module.exports = connectDB;</code></pre>
          </div>
          
          <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-blue-900 mb-3">🔍 Key Concepts Explained</h4>
            <ul class="explanation-list space-y-2">
              <li><strong>async/await:</strong> Modern syntax for handling asynchronous operations (Promises)</li>
              <li><strong>try-catch:</strong> Error handling - try contains code that might fail, catch handles errors</li>
              <li><strong>mongoose.connect():</strong> Establishes connection to MongoDB database</li>
              <li><strong>process.exit(1):</strong> Terminates Node.js process with error code</li>
              <li><strong>Event listeners (.on()):</strong> Functions that run when specific events occur</li>
              <li><strong>Graceful shutdown:</strong> Properly closing connections before app exits</li>
            </ul>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📋 Schema Definition
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>// models/User.js - User schema and model
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
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
    match: [/^\\S+@\\S+\\.\\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: [150, 'Age cannot exceed 150']
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin', 'moderator'],
      message: 'Role must be either user, admin, or moderator'
    },
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
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { virtuals: true }, // Include virtuals when converting to JSON
  toObject: { virtuals: true }
});

// Indexes for better query performance
userSchema.index({ email: 1 }); // Single field index
userSchema.index({ createdAt: -1 }); // Descending index
userSchema.index({ name: 'text', 'profile.bio': 'text' }); // Text index for search</code></pre>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🔧 Middleware and Methods
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>// Continue with User model...

// Virtual property - computed field not stored in DB
userSchema.virtual('fullProfile').get(function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    profile: this.profile,
    memberSince: this.createdAt
  };
});

// Pre-save middleware - runs before saving document
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware for email normalization
userSchema.pre('save', function(next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase().trim();
  }
  next();
});

// Instance methods - available on document instances
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    throw new Error('Password not available for comparison');
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  return await this.save({ validateBeforeSave: false });
};

// Static methods - available on Model
userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true });
};

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.getUserStats = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
        averageAge: { $avg: '$age' }
      }
    }
  ]);
};

// Export the model
module.exports = mongoose.model('User', userSchema);</code></pre>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🔄 Basic CRUD Operations
          </h2>
          
          <div class="code-block bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
            <pre><code>// Basic CRUD operations examples
const User = require('./models/User');

// CREATE - Adding new documents
const createUser = async (userData) => {
  try {
    const user = new User(userData);
    const savedUser = await user.save();
    console.log('User created:', savedUser.getPublicProfile());
    return savedUser;
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw error;
  }
};

// Alternative create method
const createUserAlternative = async (userData) => {
  try {
    const user = await User.create(userData);
    return user;
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw error;
  }
};

// READ - Finding documents
const findUsers = async () => {
  try {
    // Find all users
    const allUsers = await User.find();
    
    // Find with conditions
    const activeUsers = await User.find({ isActive: true });
    
    // Find one user
    const singleUser = await User.findOne({ email: 'john@example.com' });
    
    // Find by ID
    const userById = await User.findById('507f1f77bcf86cd799439011');
    
    // Find with select (only specific fields)
    const limitedFields = await User.find().select('name email role');
    
    // Find with pagination
    const page = 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const paginatedUsers = await User.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    return { allUsers, activeUsers, singleUser, userById };
  } catch (error) {
    console.error('Error finding users:', error.message);
    throw error;
  }
};

// UPDATE - Modifying documents
const updateUser = async (userId, updateData) => {
  try {
    // Update and return new document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    );
    
    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error.message);
    throw error;
  }
};

// Alternative update methods
const updateUserAlternative = async (userId, updateData) => {
  try {
    // Find first, then update (allows pre-save middleware to run)
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    Object.assign(user, updateData);
    const savedUser = await user.save();
    
    return savedUser;
  } catch (error) {
    console.error('Error updating user:', error.message);
    throw error;
  }
};

// DELETE - Removing documents
const deleteUser = async (userId) => {
  try {
    // Hard delete (permanent removal)
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      throw new Error('User not found');
    }
    
    console.log('User deleted permanently');
    return deletedUser;
  } catch (error) {
    console.error('Error deleting user:', error.message);
    throw error;
  }
};

// Soft delete (recommended approach)
const softDeleteUser = async (userId) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );
    
    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    console.log('User deactivated');
    return updatedUser;
  } catch (error) {
    console.error('Error deactivating user:', error.message);
    throw error;
  }
};</code></pre>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🎯 Practice Exercise
          </h2>
          
          <div class="practice-box bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-yellow-900 mb-3">📚 Create a Blog System</h4>
            <p class="text-yellow-800 mb-3">Build a complete blog system with MongoDB and Mongoose:</p>
            <ol class="list-decimal list-inside space-y-2 text-yellow-800">
              <li>Create User, Post, and Comment models with proper schemas</li>
              <li>Implement relationships between models</li>
              <li>Add validation and middleware for all models</li>
              <li>Create CRUD operations for all entities</li>
              <li>Implement user authentication and authorization</li>
              <li>Add search functionality for posts</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  `,
  practiceInstructions: [
    "How do you connect to MongoDB using mongoose.connect()?",
    "How do you define a schema using new mongoose.Schema()?",
    "What properties define a field's type in a schema? (e.g., type: String)",
    "How do you add validation to schema fields? (required, unique, minlength)",
    "How do you create a model from a schema using mongoose.model()?",
    "Your code must include mongoose.connect(), mongoose.Schema(), and mongoose.model()",
    "Add at least one field with validation (required: true or similar)",
  ],
  hints: [
    "Use environment variables for database connection string",
    "Always validate user input before saving to database",
    "Use bcrypt for password hashing with appropriate salt rounds",
    "Implement proper error handling for all database operations",
    "Use indexes on frequently queried fields like email",
    "Consider using soft deletes instead of hard deletes",
  ],
  solution: `
// Complete MongoDB/Mongoose setup example:

// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;

// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

// Usage in app.js
const connectDB = require('./config/database');
const User = require('./models/User');

// Connect to database
connectDB();

// Create user
const newUser = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
});
  `,
  validationCriteria: {
    requiredIncludes: [
      "mongoose.connect(",
      "mongoose.Schema(",
      "mongoose.model(",
      "new mongoose.Schema",
    ],
    requiredPatterns: [
      /mongoose\.connect\s*\(/,
      /new\s+mongoose\.Schema\s*\(/,
      /mongoose\.model\s*\(/,
      /type:\s*String/,
      /required:\s*true/,
    ],
    minLines: 15,
    customValidator: (code: string) => {
      const hasConnect = /mongoose\.connect/.test(code);
      const hasSchema = /mongoose\.Schema/.test(code);
      const hasModel = /mongoose\.model/.test(code);
      const hasSchemaFields = /type:\s*(String|Number|Boolean|Date)/.test(code);
      const hasValidation = /(required|unique|minlength|maxlength):\s*\w+/.test(
        code
      );

      if (!hasConnect) {
        return {
          valid: false,
          message: "Must connect to MongoDB using mongoose.connect()",
        };
      }
      if (!hasSchema) {
        return {
          valid: false,
          message: "Must define a schema using mongoose.Schema()",
        };
      }
      if (!hasModel) {
        return {
          valid: false,
          message: "Must create a model using mongoose.model()",
        };
      }
      if (!hasSchemaFields) {
        return {
          valid: false,
          message: "Schema must have fields with types (String, Number, etc.)",
        };
      }
      if (!hasValidation) {
        return {
          valid: false,
          message: "Schema should include validation (required, unique, etc.)",
        };
      }

      return {
        valid: true,
        message: "MongoDB connection and Mongoose schema created correctly!",
      };
    },
  },
  starterCode: `// Set up MongoDB connection and create a Mongoose model
const mongoose = require('mongoose');

// TODO: Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/myapp');

// TODO: Create a schema
// const userSchema = new mongoose.Schema({ ... });

// TODO: Add schema fields with types and validation
// Example: name: { type: String, required: true }

// TODO: Create and export the model
// const User = mongoose.model('User', userSchema);

console.log("Ready to implement MongoDB with Mongoose!");
`,
};

export default lessonData;
export { lessonData };
