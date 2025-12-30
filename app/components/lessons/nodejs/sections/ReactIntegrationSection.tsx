import React from "react";
import { Layers, Code, Zap } from "lucide-react";

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

export const ReactIntegrationSection = {
  id: "react-integration",
  title: "Connecting React to Node.js",
  icon: Layers,
  overview:
    "Building full-stack applications with React frontend and Node.js backend",
  content: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          🔗 React + Node.js Integration
        </h3>
        <p className="text-blue-800 leading-relaxed">
          Learn how to connect your React frontend with a Node.js/Express
          backend. Master API integration, CORS configuration, authentication
          flows, file uploads, and real-time communication for building modern
          full-stack applications.
        </p>
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-blue-400" />
          <h4 className="text-white font-semibold">
            Setting Up the Backend (Node.js/Express)
          </h4>
        </div>

        <CodeExplanation
          code={`// server.js - Backend setup
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for React frontend
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Sample API routes
app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: Date.now(), name, email };
  res.status(201).json(newUser);
});

app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});`}
          explanation={[
            {
              label: "cors()",
              desc: "Enables Cross-Origin Resource Sharing so React can make requests",
            },
            {
              label: "express.json()",
              desc: "Parses incoming JSON request bodies",
            },
            { label: "GET /api/users", desc: "Returns a list of users" },
            { label: "POST /api/users", desc: "Creates a new user" },
          ]}
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-cyan-400" />
          <h4 className="text-white font-semibold">Fetching Data in React</h4>
        </div>

        <CodeExplanation
          code={`// React Component - Fetching users
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
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []); // Empty dependency array - runs once on mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}`}
          explanation={[
            {
              label: "useState",
              desc: "Manages users, loading, and error states",
            },
            { label: "useEffect", desc: "Fetches data when component mounts" },
            { label: "fetch", desc: "Makes HTTP GET request to backend API" },
            {
              label: "Error handling",
              desc: "Displays loading state and error messages",
            },
          ]}
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-green-400" />
          <h4 className="text-white font-semibold">
            Using Axios for Better API Calls
          </h4>
        </div>

        <CodeExplanation
          code={`// Install axios: npm install axios

// React Component with Axios
import { useState, useEffect } from 'react';
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

function UserManager() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Create user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users', formData);
      setUsers([...users, response.data]);
      setFormData({ name: '', email: '' }); // Reset form
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
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
}`}
          explanation={[
            {
              label: "axios.create()",
              desc: "Creates a configured axios instance with baseURL",
            },
            { label: "async/await", desc: "Modern way to handle promises" },
            {
              label: "api.get()",
              desc: "Makes GET request with less boilerplate than fetch",
            },
            {
              label: "api.post()",
              desc: "Makes POST request with automatic JSON serialization",
            },
          ]}
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-purple-400" />
          <h4 className="text-white font-semibold">
            CORS Configuration (Advanced)
          </h4>
        </div>

        <CodeExplanation
          code={`// server.js - Detailed CORS setup
const cors = require('cors');

// Basic CORS - allows all origins (development only)
app.use(cors());

// Production CORS - restrict to specific origin
const corsOptions = {
  origin: 'http://localhost:3000', // React dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allow cookies
};
app.use(cors(corsOptions));

// Multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://myapp.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));`}
          explanation={[
            {
              label: "Basic cors()",
              desc: "Allows all origins - use only in development",
            },
            {
              label: "corsOptions",
              desc: "Restricts access to specific origins and methods",
            },
            {
              label: "credentials: true",
              desc: "Allows cookies and authentication headers",
            },
            {
              label: "Multiple origins",
              desc: "Whitelist multiple domains for production use",
            },
          ]}
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-yellow-400" />
          <h4 className="text-white font-semibold">
            Authentication Flow (JWT)
          </h4>
        </div>

        <CodeExplanation
          code={`// Backend - Login endpoint
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Find user (example - use real database)
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Create JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.json({ token, user: { id: user._id, email: user.email } });
});

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Protected route
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});`}
          explanation={[
            {
              label: "jwt.sign()",
              desc: "Creates a signed JWT token with user data",
            },
            {
              label: "authenticateToken",
              desc: "Middleware to verify JWT on protected routes",
            },
            {
              label: "Authorization header",
              desc: "Token sent as 'Bearer <token>'",
            },
            {
              label: "Protected route",
              desc: "Only accessible with valid token",
            },
          ]}
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-yellow-400" />
          <h4 className="text-white font-semibold">
            React - Login & Token Storage
          </h4>
        </div>

        <CodeExplanation
          code={`// React - Login component
import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        credentials
      );
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect or update app state
      window.location.href = '/dashboard';
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
      />
      <button type="submit">Login</button>
    </form>
  );
}

// Making authenticated requests
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Example protected request
const fetchProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }
};`}
          explanation={[
            {
              label: "localStorage",
              desc: "Stores JWT token and user data in browser",
            },
            {
              label: "axios.interceptors",
              desc: "Automatically adds token to all requests",
            },
            {
              label: "Error handling",
              desc: "Redirects to login if token is invalid",
            },
            {
              label: "Bearer token",
              desc: "Standard format for JWT in Authorization header",
            },
          ]}
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-orange-400" />
          <h4 className="text-white font-semibold">
            File Upload (Backend & Frontend)
          </h4>
        </div>

        <CodeExplanation
          code={`// Backend - File upload with multer
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
  }
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
    path: \`/uploads/\${req.file.filename}\`
  });
});

// Serve static files
app.use('/uploads', express.static('uploads'));`}
          explanation={[
            {
              label: "multer",
              desc: "Middleware for handling multipart/form-data file uploads",
            },
            {
              label: "diskStorage",
              desc: "Configures where and how files are saved",
            },
            { label: "fileFilter", desc: "Validates file types before upload" },
            {
              label: "upload.single()",
              desc: "Handles single file upload with field name 'image'",
            },
          ]}
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-orange-400" />
          <h4 className="text-white font-semibold">
            React - File Upload Component
          </h4>
        </div>

        <CodeExplanation
          code={`// React - File upload component
import { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    
    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    
    // Create FormData
    const formData = new FormData();
    formData.append('image', selectedFile);
    
    try {
      const response = await axios.post(
        'http://localhost:5000/api/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            console.log(\`Upload Progress: \${Math.round(progress)}%\`);
          }
        }
      );
      
      setUploadedFile(response.data);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
      />
      
      {preview && (
        <div>
          <img src={preview} alt="Preview" style={{maxWidth: '300px'}} />
        </div>
      )}
      
      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      
      {uploadedFile && (
        <div>
          <p>File uploaded: {uploadedFile.filename}</p>
          <img
            src={\`http://localhost:5000\${uploadedFile.path}\`}
            alt="Uploaded"
          />
        </div>
      )}
    </div>
  );
}`}
          explanation={[
            {
              label: "FormData",
              desc: "Browser API for sending multipart/form-data",
            },
            {
              label: "FileReader",
              desc: "Creates preview URL for selected image",
            },
            {
              label: "onUploadProgress",
              desc: "Track upload progress for progress bar",
            },
            {
              label: "Content-Type",
              desc: "Must be multipart/form-data for file uploads",
            },
          ]}
        />
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200 mt-6">
        <h4 className="font-semibold text-green-900 mb-3">💡 Best Practices</h4>
        <ul className="space-y-2 text-green-800">
          <li>
            ✅ Use environment variables for API URLs
            (process.env.REACT_APP_API_URL)
          </li>
          <li>✅ Implement proper error handling and loading states</li>
          <li>✅ Use axios interceptors for authentication tokens</li>
          <li>✅ Validate data on both frontend and backend</li>
          <li>✅ Implement request cancellation for unmounted components</li>
          <li>✅ Use HTTPS in production</li>
          <li>
            ✅ Never store sensitive data in localStorage (use httpOnly cookies
            for tokens)
          </li>
          <li>✅ Implement rate limiting on the backend</li>
        </ul>
      </div>

      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200 mt-6">
        <h4 className="font-semibold text-yellow-900 mb-3">
          🚀 Development Setup
        </h4>
        <div className="space-y-3 text-yellow-800">
          <p>
            <strong>Option 1: Separate Ports (Development)</strong>
          </p>
          <ul className="ml-4 space-y-1">
            <li>• React: http://localhost:3000</li>
            <li>• Node.js: http://localhost:5000</li>
            <li>• Enable CORS on backend</li>
          </ul>

          <p className="mt-4">
            <strong>Option 2: Proxy (package.json)</strong>
          </p>
          <pre className="bg-yellow-900 text-yellow-100 p-3 rounded text-sm mt-2">
            {`// In React's package.json
"proxy": "http://localhost:5000"

// Then use relative URLs in React
fetch('/api/users') // Automatically proxies to http://localhost:5000/api/users`}
          </pre>

          <p className="mt-4">
            <strong>Option 3: Production (Single Server)</strong>
          </p>
          <ul className="ml-4 space-y-1">
            <li>• Build React: npm run build</li>
            <li>• Serve static files from Express</li>
            <li>• Deploy to same server/domain</li>
          </ul>
        </div>
      </div>
    </div>
  ),
};
