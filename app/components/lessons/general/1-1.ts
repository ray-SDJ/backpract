import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "What is Backend Development?",
  difficulty: "Beginner",
  description: "Introduction to backend development concepts and technologies.",
  objectives: [
    "Understand the role of backend in web applications",
    "Learn about client-server architecture",
    "Explore different backend technologies",
    "Understand APIs and their importance",
  ],
  content: `
    <div class="lesson-card bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
      <div class="lesson-content p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">What is Backend Development?</h1>
        
        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🌟 The Foundation of Modern Applications
          </h2>
          <p class="text-gray-700 mb-4 leading-relaxed">
            Backend development is the invisible engine that powers every digital application you use. While frontend focuses on what users see and interact with, the backend handles everything that happens "behind the scenes" - data processing, business logic, security, and communication with databases and external services.
          </p>
          
          <div class="explanation-box border rounded-lg p-4 mb-6 bg-blue-50 border-blue-200 text-blue-900">
            <h4 class="font-semibold mb-3 flex items-center gap-2 text-blue-600">
              📚 Real-World Examples
            </h4>
            <div class="explanation-content">
              <ul class="space-y-2">
                <li class="flex items-start gap-2">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>When you login to Instagram, the backend verifies your credentials</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>When you make an online purchase, the backend processes payment and inventory</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>When you send a message, the backend routes it to the recipient</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>When you search on Google, the backend queries billions of web pages</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🏗 Client-Server Architecture
          </h2>
          <p class="text-gray-700 mb-4 leading-relaxed">
            The web follows a client-server model where communication happens through HTTP requests and responses:
          </p>
          
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="feature-list">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Client Side (Frontend)</h3>
              <ul class="space-y-3">
                <li class="flex items-start gap-3">
                  <div class="mt-1.5 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <span class="font-medium text-gray-900">Web browsers:</span>
                    <span class="text-gray-700 ml-1">(Chrome, Firefox, Safari)</span>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <div class="mt-1.5 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <span class="font-medium text-gray-900">Mobile apps:</span>
                    <span class="text-gray-700 ml-1">(iOS, Android)</span>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <div class="mt-1.5 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <span class="font-medium text-gray-900">Desktop applications:</span>
                    <span class="text-gray-700 ml-1">Native desktop software</span>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <div class="mt-1.5 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <span class="font-medium text-gray-900">IoT devices:</span>
                    <span class="text-gray-700 ml-1">(smart home devices, wearables)</span>
                  </div>
                </li>
              </ul>
            </div>
            
            <div class="feature-list">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Server Side (Backend)</h3>
              <ul class="space-y-3">
                <li class="flex items-start gap-3">
                  <div class="mt-1.5 w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <span class="font-medium text-gray-900">Web servers:</span>
                    <span class="text-gray-700 ml-1">Handle HTTP requests</span>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <div class="mt-1.5 w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <span class="font-medium text-gray-900">Application servers:</span>
                    <span class="text-gray-700 ml-1">Run business logic</span>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <div class="mt-1.5 w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <span class="font-medium text-gray-900">Database servers:</span>
                    <span class="text-gray-700 ml-1">Store and retrieve data</span>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <div class="mt-1.5 w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <span class="font-medium text-gray-900">File servers:</span>
                    <span class="text-gray-700 ml-1">Manage static assets</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div class="explanation-box border rounded-lg p-4 mb-6 bg-green-50 border-green-200 text-green-900">
            <h4 class="font-semibold mb-3 flex items-center gap-2 text-green-600">
              🔄 Communication Flow
            </h4>
            <div class="explanation-content space-y-2">
              <div class="flex items-center gap-2">
                <span class="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">1</span>
                <span><strong>Client sends request</strong> → <code class="bg-gray-100 px-2 py-1 rounded text-sm">GET https://api.example.com/users</code></span>
              </div>
              <div class="flex items-center gap-2">
                <span class="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">2</span>
                <span><strong>Backend processes request</strong> → Validates, queries database, applies business rules</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">3</span>
                <span><strong>Backend sends response</strong> → JSON data with user information</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">4</span>
                <span><strong>Client displays data</strong> → Updates UI with received information</span>
              </div>
            </div>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🎯 Backend Responsibilities
          </h2>
          
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">1. Data Processing & Business Logic</h3>
            
            <div class="code-block-wrapper mb-6">
              <div class="code-block-header bg-gray-800 text-white px-4 py-2 rounded-t-lg flex items-center gap-2">
                <span class="text-sm font-medium">Example: E-commerce Order Processing</span>
                <span class="text-xs text-gray-400 ml-auto">JavaScript</span>
              </div>
              <pre class="code-block bg-gray-900 text-green-400 p-4 overflow-x-auto font-mono text-sm rounded-b-lg">
                <code>// Example: E-commerce order processing
function processOrder(orderData) {
  // Validate customer information
  if (!validateCustomer(orderData.customerId)) {
    throw new Error('Invalid customer');
  }
  
  // Check inventory availability
  if (!checkInventory(orderData.items)) {
    throw new Error('Insufficient inventory');
  }
  
  // Calculate pricing with taxes and discounts
  const totalPrice = calculateTotal(orderData.items, orderData.discountCode);
  
  // Process payment
  const paymentResult = processPayment(orderData.payment, totalPrice);
  
  // Update inventory
  updateInventory(orderData.items);
  
  // Create order record
  const order = createOrder({
    ...orderData,
    totalPrice,
    paymentId: paymentResult.id,
    status: 'confirmed'
  });
  
  // Send confirmation email
  sendOrderConfirmation(order);
  
  return order;
}</code>
              </pre>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">2. Database Management</h3>
            
            <div class="code-block-wrapper mb-6">
              <div class="code-block-header bg-gray-800 text-white px-4 py-2 rounded-t-lg flex items-center gap-2">
                <span class="text-sm font-medium">Database Queries</span>
                <span class="text-xs text-gray-400 ml-auto">SQL</span>
              </div>
              <pre class="code-block bg-gray-900 text-green-400 p-4 overflow-x-auto font-mono text-sm rounded-b-lg">
                <code>-- User authentication and authorization
SELECT users.id, users.email, users.role, user_profiles.name
FROM users 
JOIN user_profiles ON users.id = user_profiles.user_id 
WHERE users.email = ? AND users.password_hash = ? AND users.active = true;

-- Complex business queries
SELECT 
  products.name,
  categories.name as category,
  AVG(reviews.rating) as avg_rating,
  COUNT(orders.id) as total_sales
FROM products
JOIN categories ON products.category_id = categories.id
LEFT JOIN reviews ON products.id = reviews.product_id
LEFT JOIN order_items ON products.id = order_items.product_id
LEFT JOIN orders ON order_items.order_id = orders.id
WHERE products.active = true
GROUP BY products.id
ORDER BY total_sales DESC;</code>
              </pre>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">3. Authentication & Security</h3>
            
            <div class="code-block-wrapper mb-6">
              <div class="code-block-header bg-gray-800 text-white px-4 py-2 rounded-t-lg flex items-center gap-2">
                <span class="text-sm font-medium">JWT Token-based Authentication</span>
                <span class="text-xs text-gray-400 ml-auto">JavaScript</span>
              </div>
              <pre class="code-block bg-gray-900 text-green-400 p-4 overflow-x-auto font-mono text-sm rounded-b-lg">
                <code>// JWT Token-based authentication
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function authenticateUser(email, password) {
  // Find user in database
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }
  
  // Verify password hash
  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    throw new Error('Invalid password');
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  };
}

// Authorization middleware
function requireRole(role) {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (userRole !== role && userRole !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}</code>
              </pre>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">4. API Development & Integration</h3>
            
            <div class="code-block-wrapper mb-6">
              <div class="code-block-header bg-gray-800 text-white px-4 py-2 rounded-t-lg flex items-center gap-2">
                <span class="text-sm font-medium">RESTful API & External Integration</span>
                <span class="text-xs text-gray-400 ml-auto">JavaScript</span>
              </div>
              <pre class="code-block bg-gray-900 text-green-400 p-4 overflow-x-auto font-mono text-sm rounded-b-lg">
                <code>// RESTful API endpoints
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// External API integration
async function sendNotification(userId, message) {
  const user = await User.findById(userId);
  
  // Send push notification via Firebase
  await admin.messaging().send({
    token: user.fcmToken,
    notification: {
      title: 'New Message',
      body: message
    }
  });
  
  // Send email via SendGrid
  await sgMail.send({
    to: user.email,
    from: 'notifications@example.com',
    subject: 'New Message',
    html: \`<p>\${message}</p>\`
  });
}</code>
              </pre>
            </div>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🛠 Popular Backend Technologies
          </h2>
          
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Programming Languages & Frameworks</h3>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div class="explanation-box border rounded-lg p-4 bg-yellow-50 border-yellow-200 text-yellow-900">
              <h4 class="font-semibold mb-2 text-yellow-800">JavaScript/TypeScript</h4>
              <ul class="text-sm space-y-1">
                <li><strong>Node.js:</strong> Server-side JavaScript runtime</li>
                <li><strong>Express.js:</strong> Minimal web framework</li>
                <li><strong>NestJS:</strong> Enterprise-grade Node.js framework</li>
                <li class="text-xs text-yellow-700 mt-2"><strong>Used by:</strong> Netflix, Uber, LinkedIn</li>
              </ul>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-green-50 border-green-200 text-green-900">
              <h4 class="font-semibold mb-2 text-green-800">Python</h4>
              <ul class="text-sm space-y-1">
                <li><strong>Django:</strong> Full-featured web framework</li>
                <li><strong>Flask:</strong> Lightweight microframework</li>
                <li><strong>FastAPI:</strong> Modern, high-performance API framework</li>
                <li class="text-xs text-green-700 mt-2"><strong>Used by:</strong> Instagram, Spotify, Dropbox</li>
              </ul>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-red-50 border-red-200 text-red-900">
              <h4 class="font-semibold mb-2 text-red-800">Java</h4>
              <ul class="text-sm space-y-1">
                <li><strong>Spring Boot:</strong> Enterprise Java framework</li>
                <li><strong>Spring Framework:</strong> Comprehensive programming model</li>
                <li class="text-xs text-red-700 mt-2"><strong>Used by:</strong> Netflix, Amazon, Google</li>
              </ul>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-purple-50 border-purple-200 text-purple-900">
              <h4 class="font-semibold mb-2 text-purple-800">C#/.NET</h4>
              <ul class="text-sm space-y-1">
                <li><strong>ASP.NET Core:</strong> Cross-platform web framework</li>
                <li><strong>Entity Framework:</strong> Object-relational mapping</li>
                <li class="text-xs text-purple-700 mt-2"><strong>Used by:</strong> Microsoft, Stack Overflow, GoDaddy</li>
              </ul>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-cyan-50 border-cyan-200 text-cyan-900">
              <h4 class="font-semibold mb-2 text-cyan-800">Go (Golang)</h4>
              <ul class="text-sm space-y-1">
                <li><strong>Gin:</strong> HTTP web framework</li>
                <li><strong>Echo:</strong> High performance web framework</li>
                <li class="text-xs text-cyan-700 mt-2"><strong>Used by:</strong> Google, Docker, Kubernetes</li>
              </ul>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-orange-50 border-orange-200 text-orange-900">
              <h4 class="font-semibold mb-2 text-orange-800">Rust</h4>
              <ul class="text-sm space-y-1">
                <li><strong>Actix-web:</strong> Powerful actor-based framework</li>
                <li><strong>Rocket:</strong> Type-safe web framework</li>
                <li class="text-xs text-orange-700 mt-2"><strong>Used by:</strong> Dropbox, Coursera, npm</li>
              </ul>
            </div>
          </div>

          <h3 class="text-xl font-semibold text-gray-900 mb-4">Database Technologies</h3>
          
          <div class="mb-6">
            <h4 class="text-lg font-semibold text-gray-800 mb-3">Relational Databases (SQL)</h4>
            <div class="code-block-wrapper mb-4">
              <div class="code-block-header bg-gray-800 text-white px-4 py-2 rounded-t-lg flex items-center gap-2">
                <span class="text-sm font-medium">PostgreSQL, MySQL, SQL Server</span>
                <span class="text-xs text-gray-400 ml-auto">SQL</span>
              </div>
              <pre class="code-block bg-gray-900 text-green-400 p-4 overflow-x-auto font-mono text-sm rounded-b-lg">
                <code>-- PostgreSQL, MySQL, SQL Server
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending'
);</code>
              </pre>
            </div>
          </div>
          
          <div class="mb-6">
            <h4 class="text-lg font-semibold text-gray-800 mb-3">NoSQL Databases</h4>
            <div class="code-block-wrapper mb-4">
              <div class="code-block-header bg-gray-800 text-white px-4 py-2 rounded-t-lg flex items-center gap-2">
                <span class="text-sm font-medium">MongoDB & Redis Examples</span>
                <span class="text-xs text-gray-400 ml-auto">JavaScript</span>
              </div>
              <pre class="code-block bg-gray-900 text-green-400 p-4 overflow-x-auto font-mono text-sm rounded-b-lg">
                <code>// MongoDB document store
{
  "_id": ObjectId("..."),
  "email": "user@example.com",
  "profile": {
    "name": "John Doe",
    "preferences": {
      "theme": "dark",
      "notifications": true
    }
  },
  "orders": [
    { "id": "order123", "total": 99.99 },
    { "id": "order124", "total": 149.99 }
  ]
}

// Redis key-value store
SET user:1001:session "eyJhbGciOiJIUzI1NiIs..."
EXPIRE user:1001:session 3600

// Cache frequently accessed data
SET product:popular:list "[{id:1,name:'...'},{id:2,name:'...'}]"</code>
              </pre>
            </div>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🚀 Backend Architecture Patterns
          </h2>
          
          <div class="grid md:grid-cols-3 gap-6 mb-6">
            <div class="explanation-box border rounded-lg p-4 bg-blue-50 border-blue-200 text-blue-900">
              <h4 class="font-semibold mb-3 text-blue-800">Monolithic Architecture</h4>
              <div class="code-block bg-gray-100 p-3 rounded text-xs font-mono mb-3">
                <pre>┌─────────────────────────────────┐
│        Single Application       │
├─────────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌──────────┐  │
│  │ API │ │ Auth│ │ Business │  │
│  │     │ │     │ │  Logic   │  │
│  └─────┘ └─────┘ └──────────┘  │
├─────────────────────────────────┤
│           Database              │
└─────────────────────────────────┘</pre>
              </div>
              <p class="text-sm">Single deployable unit with all components tightly coupled.</p>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-green-50 border-green-200 text-green-900">
              <h4 class="font-semibold mb-3 text-green-800">Microservices Architecture</h4>
              <div class="code-block bg-gray-100 p-3 rounded text-xs font-mono mb-3">
                <pre>┌──────────┐ ┌──────────┐ ┌──────────┐
│   User   │ │ Product  │ │ Order    │
│ Service  │ │ Service  │ │ Service  │
├──────────┤ ├──────────┤ ├──────────┤
│   DB     │ │    DB    │ │    DB    │
└──────────┘ └──────────┘ └──────────┘
            │
      ┌─────────────┐
      │ API Gateway │
      └─────────────┘</pre>
              </div>
              <p class="text-sm">Independent services that communicate over networks.</p>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-purple-50 border-purple-200 text-purple-900">
              <h4 class="font-semibold mb-3 text-purple-800">Serverless Architecture</h4>
              <div class="code-block-wrapper mb-3">
                <pre class="code-block bg-gray-900 text-green-400 p-3 overflow-x-auto font-mono text-xs rounded">
                  <code>// AWS Lambda function
exports.handler = async (event) => {
  const { userId, action } = JSON.parse(event.body);
  
  switch (action) {
    case 'create_user':
      return await createUser(userId);
    case 'get_user':
      return await getUser(userId);
    default:
      return { statusCode: 400, body: 'Invalid action' };
  }
};</code>
                </pre>
              </div>
              <p class="text-sm">Functions-as-a-Service with automatic scaling and management.</p>
            </div>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🌐 How Backend Powers Different Industries
          </h2>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div class="explanation-box border rounded-lg p-4 bg-emerald-50 border-emerald-200 text-emerald-900">
              <h4 class="font-semibold mb-3 text-emerald-800 flex items-center gap-2">
                🛒 E-Commerce (Amazon, Shopify)
              </h4>
              <ul class="space-y-2 text-sm">
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Product catalog management</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Shopping cart and checkout processing</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Payment gateway integration</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Inventory management</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Order fulfillment and tracking</span>
                </li>
              </ul>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-blue-50 border-blue-200 text-blue-900">
              <h4 class="font-semibold mb-3 text-blue-800 flex items-center gap-2">
                📱 Social Media (Facebook, Twitter)
              </h4>
              <ul class="space-y-2 text-sm">
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>User authentication and profiles</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Content feed algorithms</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Real-time messaging systems</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Image and video processing</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Content moderation and safety</span>
                </li>
              </ul>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-yellow-50 border-yellow-200 text-yellow-900">
              <h4 class="font-semibold mb-3 text-yellow-800 flex items-center gap-2">
                💰 Fintech (Stripe, PayPal)
              </h4>
              <ul class="space-y-2 text-sm">
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Payment processing and settlements</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Fraud detection algorithms</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Regulatory compliance and reporting</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Multi-currency exchange rates</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Risk assessment and credit scoring</span>
                </li>
              </ul>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-red-50 border-red-200 text-red-900">
              <h4 class="font-semibold mb-3 text-red-800 flex items-center gap-2">
                🏥 Healthcare (Epic, Cerner)
              </h4>
              <ul class="space-y-2 text-sm">
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Electronic health records (EHR)</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Patient data privacy (HIPAA compliance)</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Medical imaging and diagnostics</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Telemedicine platforms</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Drug interaction checking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            💡 Why Backend Development Matters
          </h2>
          
          <div class="space-y-4">
            <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <h4 class="font-semibold text-gray-900">Scalability</h4>
                <p class="text-gray-700 text-sm">Backend systems must handle millions of users simultaneously</p>
              </div>
            </div>
            <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <h4 class="font-semibold text-gray-900">Security</h4>
                <p class="text-gray-700 text-sm">Protecting sensitive data and preventing cyber attacks</p>
              </div>
            </div>
            <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <h4 class="font-semibold text-gray-900">Performance</h4>
                <p class="text-gray-700 text-sm">Optimizing response times and resource usage</p>
              </div>
            </div>
            <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
              <div>
                <h4 class="font-semibold text-gray-900">Reliability</h4>
                <p class="text-gray-700 text-sm">Ensuring 99.9% uptime for critical business operations</p>
              </div>
            </div>
            <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">5</div>
              <div>
                <h4 class="font-semibold text-gray-900">Integration</h4>
                <p class="text-gray-700 text-sm">Connecting various systems, APIs, and third-party services</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🎯 Your Backend Development Journey
          </h2>
          
          <p class="text-gray-700 mb-6 leading-relaxed">
            As you progress through this course, you'll master:
          </p>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div class="p-4 border border-gray-200 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-2">1. Foundation</h4>
              <p class="text-sm text-gray-600">Server setup, HTTP protocols, and basic API development</p>
            </div>
            <div class="p-4 border border-gray-200 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-2">2. Database Skills</h4>
              <p class="text-sm text-gray-600">Data modeling, queries, and database optimization</p>
            </div>
            <div class="p-4 border border-gray-200 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-2">3. Security</h4>
              <p class="text-sm text-gray-600">Authentication, authorization, and secure coding practices</p>
            </div>
            <div class="p-4 border border-gray-200 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-2">4. Performance</h4>
              <p class="text-sm text-gray-600">Caching strategies, load balancing, and optimization</p>
            </div>
            <div class="p-4 border border-gray-200 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-2">5. Architecture</h4>
              <p class="text-sm text-gray-600">Designing scalable, maintainable backend systems</p>
            </div>
            <div class="p-4 border border-gray-200 rounded-lg">
              <h4 class="font-semibold text-gray-900 mb-2">6. DevOps</h4>
              <p class="text-sm text-gray-600">Deployment, monitoring, and production maintenance</p>
            </div>
          </div>
          
          <div class="explanation-box border rounded-lg p-4 mb-6 bg-emerald-50 border-emerald-200 text-emerald-900">
            <h4 class="font-semibold mb-3 text-emerald-800 flex items-center gap-2">
              🎓 By the end of this course, you'll be able to:
            </h4>
            <ul class="space-y-2 text-sm">
              <li class="flex items-start gap-2">
                <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Build production-ready APIs that serve millions of users</span>
              </li>
              <li class="flex items-start gap-2">
                <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Design secure, scalable backend architectures</span>
              </li>
              <li class="flex items-start gap-2">
                <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Integrate with databases, external APIs, and cloud services</span>
              </li>
              <li class="flex items-start gap-2">
                <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Deploy and monitor backend systems in production environments</span>
              </li>
              <li class="flex items-start gap-2">
                <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Collaborate effectively with frontend developers and DevOps teams</span>
              </li>
            </ul>
          </div>
          
          <div class="quick-test bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 class="font-semibold text-green-900 mb-2 flex items-center gap-2">
              🚀 Ready to Start?
            </h4>
            <p class="text-sm text-green-800">
              Your journey into backend development starts now – let's build the invisible engines that power the digital world!
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  practiceInstructions: [],
  hints: [
    "Backend development is like building the engine of a car - users don't see it, but it's essential for everything to work",
    "Think about what happens when you submit a form on a website",
    "Consider how your data is stored when you create an account",
    "Remember that the backend is invisible to users but essential for functionality",
  ],
  solution: `// This is a conceptual lesson - no coding challenge
// Focus on understanding the concepts presented in the lesson content.`,
};

export default lessonData;
