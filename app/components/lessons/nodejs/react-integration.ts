import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Connecting React to Node.js",
  description:
    "Learn how to build full-stack applications by connecting a React frontend with a Node.js/Express backend. Master API integration, CORS, authentication, and file uploads.",
  difficulty: "Intermediate",
  objectives: [
    "Set up CORS for React-Node.js communication",
    "Make HTTP requests from React to Node.js APIs",
    "Implement JWT authentication between frontend and backend",
    "Handle file uploads with React and Node.js",
    "Use axios for better API calls",
    "Manage authentication state in React",
  ],
  practiceInstructions: [
    "Create an Express server with CORS enabled on port 5000",
    "Add GET /api/users endpoint that returns an array of users",
    "Add POST /api/users endpoint that accepts name and email",
    "Create a React component that fetches and displays users",
    "Add a form in React to create new users via POST request",
    "Install and configure axios with a base URL",
    "Test the full-stack application: start both servers and verify data flows",
  ],
  hints: [
    "Install cors package: npm install cors",
    "Use app.use(cors()) to enable CORS for all origins",
    "Don't forget app.use(express.json()) to parse request bodies",
    "In React, use useState for data and useEffect for fetching",
    "Create axios instance with baseURL: 'http://localhost:5000/api'",
    "Handle loading and error states in your React components",
  ],
  solution: `// Backend (server.js)
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

app.get('/api/users', (req, res) => {
  res.json({ success: true, data: users });
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: Date.now(), name, email };
  users.push(newUser);
  res.status(201).json({ success: true, data: newUser });
});

app.listen(5000, () => console.log('Server running on port 5000'));

// Frontend (UserManager.jsx)
import { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

function UserManager() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    api.get('/users').then(res => setUsers(res.data.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.post('/users', formData);
    setUsers([...users, res.data.data]);
    setFormData({ name: '', email: '' });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Name"
        />
        <input
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="Email"
        />
        <button type="submit">Add User</button>
      </form>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}`,
  content: `<div class="lesson-content">
    <h2>🔗 Connecting React Frontend to Node.js Backend</h2>
    <p>Building modern full-stack applications requires connecting your React frontend with a Node.js/Express backend. This lesson covers everything you need to know about making these two technologies work together seamlessly.</p>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🎯 What You'll Learn</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Backend Setup:</strong> Configure Express with CORS for React</li>
        <li><strong>API Integration:</strong> Make HTTP requests from React components</li>
        <li><strong>Authentication:</strong> Implement JWT auth flow between frontend and backend</li>
        <li><strong>File Uploads:</strong> Handle multipart form data with React and Node.js</li>
        <li><strong>Best Practices:</strong> Security, error handling, and deployment strategies</li>
      </ul>
    </div>

    <h2>📖 Part 1: Setting Up the Backend</h2>
    <p>First, let's set up an Express server that can communicate with our React frontend:</p>

    <pre class="code-block">
      <code>
// Install required packages
npm install express cors

// server.js - Basic Express server with CORS
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all origins (development)
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Sample routes
app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
  ];
  res.json({ success: true, data: users });
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  // Validation
  if (!name || !email) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name and email are required' 
    });
  }
  
  const newUser = { 
    id: Date.now(), 
    name, 
    email 
  };
  
  res.status(201).json({ 
    success: true, 
    data: newUser 
  });
});

app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});
      </code>
    </pre>

    <div class="tip-box bg-green-50 border border-green-200 rounded-lg p-4 my-4">
      <h4 class="font-semibold text-green-900 mb-2">💡 Key Points</h4>
      <ul class="text-green-800 space-y-1">
        <li><strong>cors():</strong> Allows React (running on port 3000) to make requests to Express (port 5000)</li>
        <li><strong>express.json():</strong> Automatically parses JSON request bodies</li>
        <li><strong>Port 5000:</strong> Standard port for Node.js backends when React uses 3000</li>
      </ul>
    </div>

    <h2>🎨 Part 2: Fetching Data in React</h2>
    <p>Now let's create a React component that fetches data from our Node.js backend:</p>

    <pre class="code-block">
      <code>
// UserList.jsx - Fetching users with native fetch
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch users from backend
    fetch('http://localhost:5000/api/users')
      .then(response => {
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        return response.json();
      })
      .then(data => {
        setUsers(data.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []); // Empty dependency array - runs once on mount

  if (loading) {
    return <div className="text-center p-4">Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User List</h2>
      <div className="space-y-2">
        {users.map(user => (
          <div key={user.id} className="border p-3 rounded">
            <div className="font-semibold">{user.name}</div>
            <div className="text-gray-600">{user.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
      </code>
    </pre>

    <h2>🚀 Part 3: Using Axios for Better API Calls</h2>
    <p>Axios provides a cleaner API and better error handling than fetch:</p>

    <pre class="code-block">
      <code>
// Install axios in your React project
npm install axios

// api.js - Create axios instance with configuration
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds
});

// Add request interceptor (for adding auth tokens)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor (for handling errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
      </code>
    </pre>

    <pre class="code-block">
      <code>
// UserManager.jsx - Using axios for CRUD operations
import { useState, useEffect } from 'react';
import api from './api';

function UserManager() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    }
  };

  // Create user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/users', formData);
      setUsers([...users, response.data.data]);
      setFormData({ name: '', email: '' }); // Reset form
      alert('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      alert(error.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Manager</h2>
      
      {/* Create User Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Creating...' : 'Add User'}
        </button>
      </form>

      {/* User List */}
      <div className="space-y-2">
        {users.map(user => (
          <div key={user.id} className="border p-3 rounded">
            <div className="font-semibold">{user.name}</div>
            <div className="text-gray-600">{user.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserManager;
      </code>
    </pre>

    <h2>🔒 Part 4: JWT Authentication Flow</h2>
    <p>Implementing authentication between React and Node.js:</p>

    <pre class="code-block">
      <code>
// Backend - Login endpoint
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Install: npm install jsonwebtoken bcryptjs

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find user (example - use real database)
    // const user = await User.findOne({ email });
    const user = { 
      id: 1, 
      email: 'john@example.com', 
      password: '$2a$10$hashedpassword' // bcrypt hash
    };
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({ 
      success: true,
      token, 
      user: { 
        id: user.id, 
        email: user.email 
      } 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'No token provided' 
    });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
};

// Protected route example
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ 
    success: true,
    user: req.user 
  });
});
      </code>
    </pre>

    <pre class="code-block">
      <code>
// React - Login component
import { useState } from 'react';
import api from './api';

function Login({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({ 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Call success callback
      onLoginSuccess(response.data.user);
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({
              ...credentials, 
              email: e.target.value
            })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({
              ...credentials, 
              password: e.target.value
            })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
      </code>
    </pre>

    <h2>📤 Part 5: File Upload</h2>
    <p>Handling file uploads between React and Node.js:</p>

    <pre class="code-block">
      <code>
// Backend - File upload with multer
const multer = require('multer');
const path = require('path');

// Install: npm install multer

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Create this folder
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only images and PDFs are allowed'));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      message: 'No file uploaded' 
    });
  }
  
  res.json({
    success: true,
    message: 'File uploaded successfully',
    file: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      path: \`/uploads/\${req.file.filename}\`
    }
  });
});

// Serve static files
app.use('/uploads', express.static('uploads'));
      </code>
    </pre>

    <pre class="code-block">
      <code>
// React - File upload component
import { useState } from 'react';
import api from './api';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    
    // Create preview for images
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        }
      });
      
      setUploadedFile(response.data.file);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">File Upload</h2>
      
      <div className="space-y-4">
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileSelect}
          className="w-full"
        />
        
        {preview && (
          <div className="border rounded p-2">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-w-full h-auto"
            />
          </div>
        )}
        
        {uploading && (
          <div className="w-full bg-gray-200 rounded">
            <div 
              className="bg-blue-500 text-xs leading-none py-1 text-center text-white rounded"
              style={{ width: \`\${uploadProgress}%\` }}
            >
              {uploadProgress}%
            </div>
          </div>
        )}
        
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
        
        {uploadedFile && (
          <div className="bg-green-50 border border-green-200 p-3 rounded">
            <p className="font-semibold">File uploaded successfully!</p>
            <p className="text-sm text-gray-600">{uploadedFile.originalname}</p>
            <p className="text-sm text-gray-600">
              Size: {(uploadedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
      </code>
    </pre>

    <h2>⚙️ Part 6: CORS Configuration</h2>
    <p>Advanced CORS setup for production:</p>

    <pre class="code-block">
      <code>
// server.js - Production CORS configuration
const cors = require('cors');

// Option 1: Basic CORS (development only)
app.use(cors());

// Option 2: Specific origin (recommended)
const corsOptions = {
  origin: 'http://localhost:3000', // Your React app URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies
  maxAge: 86400 // 24 hours
};
app.use(cors(corsOptions));

// Option 3: Multiple origins (production)
const allowedOrigins = [
  'http://localhost:3000', // Development
  'http://localhost:3001',
  'https://myapp.com',      // Production
  'https://www.myapp.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Option 4: Dynamic origin from environment
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
      </code>
    </pre>

    <div class="explanation-box bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-yellow-900 mb-3">🚀 Development Setup Options</h4>
      <div class="text-yellow-800 space-y-3">
        <div>
          <p class="font-semibold">Option 1: Separate Ports (Recommended for Learning)</p>
          <ul class="ml-4 mt-1 space-y-1">
            <li>• React dev server: <code>http://localhost:3000</code></li>
            <li>• Node.js server: <code>http://localhost:5000</code></li>
            <li>• Enable CORS on backend</li>
            <li>• Use full URLs in fetch/axios</li>
          </ul>
        </div>
        
        <div>
          <p class="font-semibold">Option 2: Proxy in React (Easier Development)</p>
          <pre class="bg-yellow-900 text-yellow-100 p-2 rounded text-sm mt-1">
// Add to React's package.json
"proxy": "http://localhost:5000"

// Then use relative URLs
fetch('/api/users') // Proxies to http://localhost:5000/api/users</pre>
        </div>
        
        <div>
          <p class="font-semibold">Option 3: Production (Same Server)</p>
          <ul class="ml-4 mt-1 space-y-1">
            <li>• Build React: <code>npm run build</code></li>
            <li>• Serve from Express: <code>app.use(express.static('build'))</code></li>
            <li>• Deploy to single server</li>
          </ul>
        </div>
      </div>
    </div>

    <h2>✅ Best Practices</h2>
    <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <ul class="space-y-2 text-green-800">
        <li>✅ <strong>Environment Variables:</strong> Use .env for API URLs and secrets</li>
        <li>✅ <strong>Error Handling:</strong> Implement proper try-catch and error states</li>
        <li>✅ <strong>Loading States:</strong> Show loading indicators during API calls</li>
        <li>✅ <strong>Validation:</strong> Validate on both frontend and backend</li>
        <li>✅ <strong>Security:</strong> Use HTTPS in production, secure JWT storage</li>
        <li>✅ <strong>CORS:</strong> Restrict origins in production</li>
        <li>✅ <strong>Rate Limiting:</strong> Implement rate limiting on backend</li>
        <li>✅ <strong>Token Refresh:</strong> Implement token refresh for better UX</li>
        <li>✅ <strong>Request Cancellation:</strong> Cancel requests on unmount</li>
        <li>✅ <strong>Error Messages:</strong> Provide clear, user-friendly error messages</li>
      </ul>
    </div>

    <h2>🎯 Exercise: Build a Full-Stack Todo App</h2>
    <p>Practice what you've learned by building a complete todo application:</p>
    
    <div class="explanation-box bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-purple-900 mb-3">Requirements:</h4>
      <ul class="space-y-2 text-purple-800">
        <li><strong>Backend:</strong>
          <ul class="ml-4 mt-1">
            <li>• Create Express API with routes: GET, POST, PUT, DELETE</li>
            <li>• Implement JWT authentication</li>
            <li>• Add MongoDB/PostgreSQL for persistence</li>
            <li>• Configure CORS properly</li>
          </ul>
        </li>
        <li><strong>Frontend:</strong>
          <ul class="ml-4 mt-1">
            <li>• Create React components for login and todo list</li>
            <li>• Use axios for API calls</li>
            <li>• Implement authentication flow</li>
            <li>• Add loading states and error handling</li>
          </ul>
        </li>
      </ul>
    </div>

    <h2>📚 Additional Resources</h2>
    <ul class="list-disc ml-6 space-y-2">
      <li><strong>CORS:</strong> Understanding Cross-Origin Resource Sharing</li>
      <li><strong>JWT:</strong> JSON Web Token authentication best practices</li>
      <li><strong>Axios:</strong> HTTP client documentation</li>
      <li><strong>React Query:</strong> Advanced data fetching and caching</li>
      <li><strong>Socket.io:</strong> Real-time communication between React and Node.js</li>
    </ul>

    <div class="tip-box bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
      <h4 class="font-semibold text-blue-900 mb-2">🎓 Next Steps</h4>
      <p class="text-blue-800">
        Now that you know how to connect React to Node.js, explore advanced topics like:
        WebSockets for real-time features, GraphQL for flexible APIs, server-side rendering
        with Next.js, and deploying your full-stack application to platforms like Vercel,
        Heroku, or AWS.
      </p>
    </div>
  </div>`,
};
