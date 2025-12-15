import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Controllers & MVC Pattern",
  difficulty: "Intermediate",
  description:
    "Learn how to organize your Express.js application using the MVC pattern with controllers to handle business logic.",
  objectives: [
    "Understand the MVC pattern and controller responsibilities",
    "Create function-based and class-based controllers",
    "Implement CRUD operations with proper error handling",
    "Connect controllers to routes",
    "Apply the service layer pattern for complex logic",
  ],
  content: `
    <h1>Controllers in Express.js</h1>
    <p>Controllers are the C in MVC (Model-View-Controller). They handle the business logic of your application, acting as intermediaries between routes and models. Controllers keep your code organized and maintainable.</p>

    <h2>Why Use Controllers?</h2>
    <p>Controllers help you:</p>
    <ul>
      <li><strong>Separate concerns:</strong> Routes define endpoints, controllers handle logic</li>
      <li><strong>Reuse code:</strong> Same controller methods can be used by multiple routes</li>
      <li><strong>Test easily:</strong> Controllers are easier to unit test than routes</li>
      <li><strong>Maintain scale:</strong> Organize large applications into logical modules</li>
    </ul>

    <h2>Basic Controller Structure</h2>
    <p>Let's build a complete user controller with CRUD operations. Each function handles one specific operation:</p>
    
    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h4 class="font-semibold text-blue-900 mb-2">💡 Understanding the Code</h4>
      <p class="text-sm text-blue-800">Controllers are just functions that take <code>req</code> (request) and <code>res</code> (response) as parameters. They process the request and send back a response using methods like <code>res.json()</code> or <code>res.status()</code>.</p>
    </div>

    <pre><code>// controllers/userController.js
// Import the User model to interact with the database
const User = require('../models/User');

// GET all users - Retrieve every user from the database
exports.getAllUsers = async (req, res) => {
  try {
    // User.find() with no parameters gets ALL users from MongoDB
    const users = await User.find();
    
    // Send the array of users as JSON with 200 OK status (default)
    res.json(users);
  } catch (error) {
    // If database operation fails, send 500 Internal Server Error
    res.status(500).json({ error: error.message });
  }
};

// GET user by ID - Retrieve a single user using their unique ID
exports.getUserById = async (req, res) => {
  try {
    // req.params.id comes from the URL route parameter (e.g., /users/:id)
    const user = await User.findById(req.params.id);
    
    // Check if user exists in database
    if (!user) {
      // Return 404 Not Found if user doesn't exist
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Send the user object as JSON
    res.json(user);
  } catch (error) {
    // Handle errors (invalid ID format, database issues, etc.)
    res.status(500).json({ error: error.message });
  }
};

// POST - Create a new user
exports.createUser = async (req, res) => {
  try {
    // req.body contains the data sent in the request body (name, email, etc.)
    const user = new User(req.body);
    
    // Save the new user to the database
    await user.save();
    
    // Send 201 Created status with the new user object
    res.status(201).json(user);
  } catch (error) {
    // 400 Bad Request - validation failed or invalid data
    res.status(400).json({ error: error.message });
  }
};

// PUT - Update an existing user
exports.updateUser = async (req, res) => {
  try {
    // findByIdAndUpdate finds the user and updates it in one operation
    const user = await User.findByIdAndUpdate(
      req.params.id,           // Which user to update
      req.body,                // New data to update with
      { 
        new: true,             // Return the UPDATED user (not the old one)
        runValidators: true    // Run model validations on update
      }
    );
    
    // Check if user was found
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Send back the updated user
    res.json(user);
  } catch (error) {
    // 400 if validation fails
    res.status(400).json({ error: error.message });
  }
};

// DELETE - Remove a user from the database
exports.deleteUser = async (req, res) => {
  try {
    // Find user by ID and delete it
    const user = await User.findByIdAndDelete(req.params.id);
    
    // Check if user existed
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Send success message (no user data needed after deletion)
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};</code></pre>

    <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <h4 class="font-semibold text-green-900 mb-2">🔑 Key Concepts</h4>
      <ul class="text-sm text-green-800 space-y-1 ml-4">
        <li>• <strong>async/await:</strong> Waits for database operations to complete</li>
        <li>• <strong>try-catch:</strong> Catches errors and prevents app crashes</li>
        <li>• <strong>req.params.id:</strong> Gets URL parameters (e.g., /users/123)</li>
        <li>• <strong>req.body:</strong> Gets data sent in POST/PUT requests</li>
        <li>• <strong>res.status():</strong> Sets HTTP status code (200, 404, 500, etc.)</li>
        <li>• <strong>res.json():</strong> Sends JSON response back to client</li>
      </ul>
    </div>

    <h2>Connecting Routes to Controllers</h2>
    <p>Routes define the endpoints (URLs) and connect them to controller functions:</p>
    
    <pre><code>// routes/userRoutes.js
const express = require('express');
const router = express.Router();
// Import our controller functions
const userController = require('../controllers/userController');

// Define routes and connect them to controller methods
// When someone visits GET /users → call getAllUsers function
router.get('/', userController.getAllUsers);

// :id is a route parameter - captures the ID from the URL
// GET /users/123 → calls getUserById with req.params.id = "123"
router.get('/:id', userController.getUserById);

// POST /users → calls createUser (expects data in req.body)
router.post('/', userController.createUser);

// PUT /users/123 → calls updateUser (ID in URL, new data in req.body)
router.put('/:id', userController.updateUser);

// DELETE /users/123 → calls deleteUser (ID in URL)
router.delete('/:id', userController.deleteUser);

// Export router to use in main app file
module.exports = router;</code></pre>

    <div class="explanation-box bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
      <h4 class="font-semibold text-purple-900 mb-2">🔗 How Routes Work</h4>
      <p class="text-sm text-purple-800 mb-2">In your main <code>app.js</code> or <code>server.js</code>, you register this router:</p>
      <pre class="text-xs bg-purple-100 p-2 rounded"><code>const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Now your endpoints are:
// GET    /api/users      → Get all users
// GET    /api/users/123  → Get user with ID 123
// POST   /api/users      → Create new user
// PUT    /api/users/123  → Update user 123
// DELETE /api/users/123  → Delete user 123</code></pre>
    </div>

    <h2>Class-Based Controllers</h2>
    <p>You can also organize controllers as classes for better structure:</p>
    <pre><code>// controllers/ProductController.js
const Product = require('../models/Product');

class ProductController {
  async index(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const products = await Product.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      
      const count = await Product.countDocuments();
      
      res.json({
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async store(req, res) {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async destroy(req, res) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ProductController();</code></pre>

    <h2>Controller Middleware Pattern</h2>
    <p>Controllers can also act as middleware for complex workflows:</p>
    <pre><code>// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
  async register(req, res) {
    try {
      const { email, password, name } = req.body;
      
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      // Create user
      const user = new User({ email, password, name });
      await user.save();
      
      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.status(201).json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Verify password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.json({ user, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Middleware to protect routes
  async protect(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId);
      
      if (!req.user) {
        return res.status(401).json({ error: 'User not found' });
      }
      
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
}

module.exports = new AuthController();</code></pre>

    <h2>Best Practices</h2>
    <ul>
      <li><strong>Single Responsibility:</strong> Each controller should handle one resource</li>
      <li><strong>Consistent Naming:</strong> Use standard CRUD names (index, show, store, update, destroy)</li>
      <li><strong>Error Handling:</strong> Always use try-catch blocks and return appropriate status codes</li>
      <li><strong>Validation:</strong> Validate input before processing (use middleware or validation libraries)</li>
      <li><strong>Keep it Thin:</strong> Controllers coordinate, they don't contain business logic. Move complex logic to services</li>
      <li><strong>Return Consistent Responses:</strong> Use the same response format across all controllers</li>
    </ul>

    <h2>Service Layer Pattern</h2>
    <p>For complex applications, separate business logic into services:</p>
    <pre><code>// services/userService.js
const User = require('../models/User');

class UserService {
  async createUser(userData) {
    const user = new User(userData);
    await user.save();
    return user;
  }

  async getUserById(id) {
    return await User.findById(id);
  }

  async updateUser(id, userData) {
    return await User.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true
    });
  }
}

module.exports = new UserService();

// controllers/userController.js
const userService = require('../services/userService');

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};</code></pre>
  `,
  practiceInstructions: [
    "Create a controller file with at least 3 CRUD operations",
    "Use async/await for asynchronous operations",
    "Include proper error handling with try-catch blocks",
    "Return appropriate HTTP status codes (200, 201, 404, 500)",
    "Export controller methods for use in routes",
  ],
  hints: [
    "Always wrap async operations in try-catch blocks",
    "Use res.status() to set appropriate HTTP status codes",
    "Check if resources exist before updating or deleting",
    "Export functions with exports.functionName syntax",
  ],
  starterCode: `// Create a basic user controller
const User = require('../models/User');

// TODO: Implement getAllUsers function
exports.getAllUsers = async (req, res) => {
  // Your code here
};

// TODO: Implement createUser function
exports.createUser = async (req, res) => {
  // Your code here
};

// TODO: Implement getUserById function
exports.getUserById = async (req, res) => {
  // Your code here
};`,
  solution: `// Complete user controller with CRUD operations
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};`,
};

export default lessonData;
