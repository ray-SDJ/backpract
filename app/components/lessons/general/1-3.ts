import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Understanding HTTP and Web Communication",
  difficulty: "Beginner",
  description:
    "Master the fundamentals of HTTP protocol, requests, responses, and how web communication works.",
  objectives: [
    "Understand the HTTP protocol and its importance",
    "Learn about HTTP methods (GET, POST, PUT, DELETE)",
    "Master HTTP status codes and their meanings",
    "Understand headers, cookies, and authentication",
    "Learn about REST API principles and design",
  ],
  content: `
    <div class="lesson-card bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
      <div class="lesson-content p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Understanding HTTP and Web Communication</h1>
        
        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🌐 What is HTTP?
          </h2>
          <p class="text-gray-700 mb-4 leading-relaxed">
            HTTP (HyperText Transfer Protocol) is the foundation of data communication on the World Wide Web. It's a stateless protocol that defines how messages are formatted and transmitted between web browsers and servers.
          </p>
          
          <div class="explanation-box border rounded-lg p-4 mb-6 bg-blue-50 border-blue-200 text-blue-900">
            <h4 class="font-semibold mb-3 flex items-center gap-2 text-blue-600">
              🔄 HTTP Request-Response Cycle
            </h4>
            <div class="explanation-content space-y-3">
              <div class="flex items-center gap-3 p-3 bg-white rounded border">
                <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                <div class="flex-1">
                  <h5 class="font-medium">Client sends HTTP Request</h5>
                  <p class="text-sm text-gray-600">Browser/app initiates communication</p>
                </div>
                <div class="text-2xl">→</div>
              </div>
              <div class="flex items-center gap-3 p-3 bg-white rounded border">
                <div class="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                <div class="flex-1">
                  <h5 class="font-medium">Server processes Request</h5>
                  <p class="text-sm text-gray-600">Server handles business logic</p>
                </div>
                <div class="text-2xl">⚙️</div>
              </div>
              <div class="flex items-center gap-3 p-3 bg-white rounded border">
                <div class="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                <div class="flex-1">
                  <h5 class="font-medium">Server sends HTTP Response</h5>
                  <p class="text-sm text-gray-600">Returns data and status information</p>
                </div>
                <div class="text-2xl">←</div>
              </div>
            </div>
          </div>
          
          <div class="code-block-wrapper mb-6">
            <div class="code-block-header bg-gray-800 text-white px-4 py-2 rounded-t-lg flex items-center gap-2">
              <span class="text-sm font-medium">Example HTTP Request</span>
              <span class="text-xs text-gray-400 ml-auto">HTTP</span>
            </div>
            <pre class="code-block bg-gray-900 text-green-400 p-4 overflow-x-auto font-mono text-sm rounded-b-lg">
              <code>GET /api/users/123 HTTP/1.1
Host: api.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json</code>
            </pre>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🎯 HTTP Methods (Verbs)
          </h2>
          
          <p class="text-gray-700 mb-4 leading-relaxed">
            HTTP methods indicate the desired action to be performed on a resource. Each method has specific semantics and use cases.
          </p>
          
          <div class="grid md:grid-cols-2 gap-4 mb-6">
            <div class="explanation-box border rounded-lg p-4 bg-green-50 border-green-200 text-green-900">
              <h4 class="font-semibold mb-3 text-green-800 flex items-center gap-2">
                📖 GET - Retrieve Data
              </h4>
              <ul class="space-y-2 text-sm">
                <li><strong>Purpose:</strong> Fetch data from server</li>
                <li><strong>Safe:</strong> No side effects</li>
                <li><strong>Idempotent:</strong> Same result every time</li>
                <li><strong>Cacheable:</strong> Responses can be cached</li>
              </ul>
              <div class="code-block bg-gray-100 p-2 rounded text-xs mt-2">
                <code>GET /api/products?category=electronics</code>
              </div>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-blue-50 border-blue-200 text-blue-900">
              <h4 class="font-semibold mb-3 text-blue-800 flex items-center gap-2">
                ➕ POST - Create Data
              </h4>
              <ul class="space-y-2 text-sm">
                <li><strong>Purpose:</strong> Create new resources</li>
                <li><strong>Safe:</strong> No (creates data)</li>
                <li><strong>Idempotent:</strong> No (multiple calls = multiple resources)</li>
                <li><strong>Cacheable:</strong> Usually not</li>
              </ul>
              <div class="code-block bg-gray-100 p-2 rounded text-xs mt-2">
                <code>POST /api/users</code>
              </div>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-yellow-50 border-yellow-200 text-yellow-900">
              <h4 class="font-semibold mb-3 text-yellow-800 flex items-center gap-2">
                ✏️ PUT - Update/Replace
              </h4>
              <ul class="space-y-2 text-sm">
                <li><strong>Purpose:</strong> Update entire resource</li>
                <li><strong>Safe:</strong> No (modifies data)</li>
                <li><strong>Idempotent:</strong> Yes (same result)</li>
                <li><strong>Cacheable:</strong> No</li>
              </ul>
              <div class="code-block bg-gray-100 p-2 rounded text-xs mt-2">
                <code>PUT /api/users/123</code>
              </div>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-red-50 border-red-200 text-red-900">
              <h4 class="font-semibold mb-3 text-red-800 flex items-center gap-2">
                🗑️ DELETE - Remove Data
              </h4>
              <ul class="space-y-2 text-sm">
                <li><strong>Purpose:</strong> Delete resources</li>
                <li><strong>Safe:</strong> No (removes data)</li>
                <li><strong>Idempotent:</strong> Yes (delete twice = same result)</li>
                <li><strong>Cacheable:</strong> No</li>
              </ul>
              <div class="code-block bg-gray-100 p-2 rounded text-xs mt-2">
                <code>DELETE /api/users/123</code>
              </div>
            </div>
          </div>
          
          <div class="explanation-box border rounded-lg p-4 mb-6 bg-purple-50 border-purple-200 text-purple-900">
            <h4 class="font-semibold mb-3 text-purple-800">
              🔧 Additional HTTP Methods
            </h4>
            <div class="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h5 class="font-medium">PATCH</h5>
                <p>Partial updates to resources</p>
              </div>
              <div>
                <h5 class="font-medium">HEAD</h5>
                <p>Like GET but headers only</p>
              </div>
              <div>
                <h5 class="font-medium">OPTIONS</h5>
                <p>Check allowed methods</p>
              </div>
            </div>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📊 HTTP Status Codes
          </h2>
          
          <p class="text-gray-700 mb-4 leading-relaxed">
            Status codes communicate the result of the HTTP request. They're grouped into five classes based on the first digit.
          </p>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div class="explanation-box border rounded-lg p-4 bg-green-50 border-green-200 text-green-900">
              <h4 class="font-semibold mb-3 text-green-800">2xx Success</h4>
              <ul class="space-y-1 text-sm">
                <li><strong>200 OK:</strong> Request successful</li>
                <li><strong>201 Created:</strong> Resource created</li>
                <li><strong>204 No Content:</strong> Success, no body</li>
              </ul>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-yellow-50 border-yellow-200 text-yellow-900">
              <h4 class="font-semibold mb-3 text-yellow-800">3xx Redirection</h4>
              <ul class="space-y-1 text-sm">
                <li><strong>301 Moved:</strong> Permanent redirect</li>
                <li><strong>302 Found:</strong> Temporary redirect</li>
                <li><strong>304 Not Modified:</strong> Use cache</li>
              </ul>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-red-50 border-red-200 text-red-900">
              <h4 class="font-semibold mb-3 text-red-800">4xx Client Error</h4>
              <ul class="space-y-1 text-sm">
                <li><strong>400 Bad Request:</strong> Invalid syntax</li>
                <li><strong>401 Unauthorized:</strong> Not authenticated</li>
                <li><strong>403 Forbidden:</strong> No permission</li>
                <li><strong>404 Not Found:</strong> Resource missing</li>
              </ul>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-purple-50 border-purple-200 text-purple-900">
              <h4 class="font-semibold mb-3 text-purple-800">5xx Server Error</h4>
              <ul class="space-y-1 text-sm">
                <li><strong>500 Internal:</strong> Server error</li>
                <li><strong>502 Bad Gateway:</strong> Invalid response</li>
                <li><strong>503 Unavailable:</strong> Server down</li>
              </ul>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-blue-50 border-blue-200 text-blue-900">
              <h4 class="font-semibold mb-3 text-blue-800">1xx Informational</h4>
              <ul class="space-y-1 text-sm">
                <li><strong>100 Continue:</strong> Proceed with request</li>
                <li><strong>101 Switching:</strong> Protocol upgrade</li>
              </ul>
            </div>
          </div>
          
          <div class="code-block-wrapper mb-6">
            <div class="code-block-header bg-gray-800 text-white px-4 py-2 rounded-t-lg flex items-center gap-2">
              <span class="text-sm font-medium">Example HTTP Response</span>
              <span class="text-xs text-gray-400 ml-auto">HTTP</span>
            </div>
            <pre class="code-block bg-gray-900 text-green-400 p-4 overflow-x-auto font-mono text-sm rounded-b-lg">
              <code>HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 85
Cache-Control: max-age=3600
Date: Thu, 16 Oct 2025 10:30:00 GMT

{
  "id": 123,
  "name": "John Doe", 
  "email": "john@example.com",
  "created_at": "2025-10-16T10:30:00Z"
}</code>
            </pre>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📋 HTTP Headers
          </h2>
          
          <p class="text-gray-700 mb-4 leading-relaxed">
            Headers provide additional information about the request or response. They control caching, authentication, content types, and more.
          </p>
          
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 class="text-lg font-semibold text-gray-800 mb-3">Request Headers</h4>
              <div class="space-y-3">
                <div class="p-3 bg-blue-50 border border-blue-200 rounded">
                  <h5 class="font-medium text-blue-800">Authorization</h5>
                  <p class="text-sm text-blue-700">Authentication credentials</p>
                  <code class="text-xs bg-blue-100 px-2 py-1 rounded">Bearer token...</code>
                </div>
                <div class="p-3 bg-green-50 border border-green-200 rounded">
                  <h5 class="font-medium text-green-800">Content-Type</h5>
                  <p class="text-sm text-green-700">Format of request body</p>
                  <code class="text-xs bg-green-100 px-2 py-1 rounded">application/json</code>
                </div>
                <div class="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <h5 class="font-medium text-yellow-800">Accept</h5>
                  <p class="text-sm text-yellow-700">Preferred response format</p>
                  <code class="text-xs bg-yellow-100 px-2 py-1 rounded">application/json</code>
                </div>
              </div>
            </div>
            
            <div>
              <h4 class="text-lg font-semibold text-gray-800 mb-3">Response Headers</h4>
              <div class="space-y-3">
                <div class="p-3 bg-purple-50 border border-purple-200 rounded">
                  <h5 class="font-medium text-purple-800">Cache-Control</h5>
                  <p class="text-sm text-purple-700">Caching directives</p>
                  <code class="text-xs bg-purple-100 px-2 py-1 rounded">max-age=3600</code>
                </div>
                <div class="p-3 bg-red-50 border border-red-200 rounded">
                  <h5 class="font-medium text-red-800">Set-Cookie</h5>
                  <p class="text-sm text-red-700">Store data in browser</p>
                  <code class="text-xs bg-red-100 px-2 py-1 rounded">sessionId=abc123</code>
                </div>
                <div class="p-3 bg-indigo-50 border border-indigo-200 rounded">
                  <h5 class="font-medium text-indigo-800">Location</h5>
                  <p class="text-sm text-indigo-700">Redirect destination</p>
                  <code class="text-xs bg-indigo-100 px-2 py-1 rounded">/new-url</code>
                </div>
              </div>
            </div>
          </div>
          
          <div class="code-block-wrapper mb-6">
            <div class="code-block-header bg-gray-800 text-white px-4 py-2 rounded-t-lg flex items-center gap-2">
              <span class="text-sm font-medium">Common Security Headers</span>
              <span class="text-xs text-gray-400 ml-auto">HTTP</span>
            </div>
            <pre class="code-block bg-gray-900 text-green-400 p-4 overflow-x-auto font-mono text-sm rounded-b-lg">
              <code># Security headers for protection
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'</code>
            </pre>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🏗️ REST API Principles
          </h2>
          
          <p class="text-gray-700 mb-4 leading-relaxed">
            REST (Representational State Transfer) is an architectural style for designing networked applications. It uses HTTP methods and status codes effectively.
          </p>
          
          <div class="explanation-box border rounded-lg p-4 mb-6 bg-blue-50 border-blue-200 text-blue-900">
            <h4 class="font-semibold mb-3 text-blue-600">
              📐 REST Principles
            </h4>
            <div class="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 class="font-medium mb-2">1. Stateless</h5>
                <p>Each request contains all information needed</p>
              </div>
              <div>
                <h5 class="font-medium mb-2">2. Resource-Based</h5>
                <p>URLs represent resources, not actions</p>
              </div>
              <div>
                <h5 class="font-medium mb-2">3. HTTP Methods</h5>
                <p>Use appropriate verbs for actions</p>
              </div>
              <div>
                <h5 class="font-medium mb-2">4. JSON Format</h5>
                <p>Standard data exchange format</p>
              </div>
            </div>
          </div>
          
          <div class="code-block-wrapper mb-6">
            <div class="code-block-header bg-gray-800 text-white px-4 py-2 rounded-t-lg flex items-center gap-2">
              <span class="text-sm font-medium">RESTful API Design Examples</span>
              <span class="text-xs text-gray-400 ml-auto">REST</span>
            </div>
            <pre class="code-block bg-gray-900 text-green-400 p-4 overflow-x-auto font-mono text-sm rounded-b-lg">
              <code># User management endpoints
GET    /api/users           # Get all users
GET    /api/users/123       # Get specific user
POST   /api/users           # Create new user
PUT    /api/users/123       # Update entire user
PATCH  /api/users/123       # Partial user update
DELETE /api/users/123       # Delete user

# Nested resources
GET    /api/users/123/posts # Get user's posts
POST   /api/users/123/posts # Create post for user

# Filtering and pagination
GET /api/users?role=admin&page=2&limit=10
GET /api/posts?author=123&status=published</code>
            </pre>
          </div>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div class="explanation-box border rounded-lg p-4 bg-green-50 border-green-200 text-green-900">
              <h4 class="font-semibold mb-3 text-green-800">✅ Good REST Design</h4>
              <ul class="space-y-1 text-sm">
                <li>• Use nouns for resource names</li>
                <li>• Consistent naming conventions</li>
                <li>• Proper HTTP status codes</li>
                <li>• Meaningful error messages</li>
                <li>• Version your APIs (/v1/users)</li>
              </ul>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-red-50 border-red-200 text-red-900">
              <h4 class="font-semibold mb-3 text-red-800">❌ Avoid These</h4>
              <ul class="space-y-1 text-sm">
                <li>• Verbs in URLs (/getUsers)</li>
                <li>• Inconsistent naming</li>
                <li>• Wrong status codes (200 for errors)</li>
                <li>• Exposing internal structure</li>
                <li>• Breaking changes without versions</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🔐 Authentication & Security
          </h2>
          
          <p class="text-gray-700 mb-4 leading-relaxed">
            HTTP provides several mechanisms for authentication and security. Understanding these is crucial for building secure APIs.
          </p>
          
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="explanation-box border rounded-lg p-4 bg-yellow-50 border-yellow-200 text-yellow-900">
              <h4 class="font-semibold mb-3 text-yellow-800">🔑 Authentication Methods</h4>
              <div class="space-y-3 text-sm">
                <div>
                  <h5 class="font-medium">Basic Auth</h5>
                  <p>Username:password in Base64</p>
                  <code class="bg-yellow-100 px-2 py-1 rounded text-xs">Authorization: Basic dXNlcjpwYXNz</code>
                </div>
                <div>
                  <h5 class="font-medium">Bearer Token</h5>
                  <p>JWT or API key in header</p>
                  <code class="bg-yellow-100 px-2 py-1 rounded text-xs">Authorization: Bearer token123</code>
                </div>
                <div>
                  <h5 class="font-medium">API Key</h5>
                  <p>Key in header or query param</p>
                  <code class="bg-yellow-100 px-2 py-1 rounded text-xs">X-API-Key: your-api-key</code>
                </div>
              </div>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-red-50 border-red-200 text-red-900">
              <h4 class="font-semibold mb-3 text-red-800">🛡️ Security Headers</h4>
              <ul class="space-y-1 text-sm">
                <li><strong>HTTPS Only:</strong> Encrypt all traffic</li>
                <li><strong>CORS:</strong> Control cross-origin requests</li>
                <li><strong>Rate Limiting:</strong> Prevent abuse</li>
                <li><strong>Input Validation:</strong> Sanitize data</li>
                <li><strong>Error Handling:</strong> Don't leak info</li>
              </ul>
            </div>
          </div>
          
          <div class="code-block-wrapper mb-6">
            <div class="code-block-header bg-gray-800 text-white px-4 py-2 rounded-t-lg flex items-center gap-2">
              <span class="text-sm font-medium">CORS Configuration Example</span>
              <span class="text-xs text-gray-400 ml-auto">JavaScript</span>
            </div>
            <pre class="code-block bg-gray-900 text-green-400 p-4 overflow-x-auto font-mono text-sm rounded-b-lg">
              <code>// CORS headers for API security
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://myapp.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  next();
});</code>
            </pre>
          </div>
        </div>

        <div class="lesson-section mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🧪 Testing HTTP APIs
          </h2>
          
          <p class="text-gray-700 mb-4 leading-relaxed">
            Testing is essential for API development. We'll use various tools to test our HTTP endpoints.
          </p>
          
          <div class="grid md:grid-cols-3 gap-4 mb-6">
            <div class="explanation-box border rounded-lg p-4 bg-purple-50 border-purple-200 text-purple-900">
              <h4 class="font-semibold mb-3 text-purple-800">🧪 Postman</h4>
              <ul class="space-y-1 text-sm">
                <li>• Visual interface</li>
                <li>• Collections & environments</li>
                <li>• Automated testing</li>
                <li>• Team collaboration</li>
              </ul>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-green-50 border-green-200 text-green-900">
              <h4 class="font-semibold mb-3 text-green-800">📡 curl</h4>
              <ul class="space-y-1 text-sm">
                <li>• Command line tool</li>
                <li>• Scriptable</li>
                <li>• Lightweight</li>
                <li>• Pre-installed on most systems</li>
              </ul>
            </div>
            
            <div class="explanation-box border rounded-lg p-4 bg-blue-50 border-blue-200 text-blue-900">
              <h4 class="font-semibold mb-3 text-blue-800">🔬 REST Client</h4>
              <ul class="space-y-1 text-sm">
                <li>• VS Code extension</li>
                <li>• File-based requests</li>
                <li>• Version controlled</li>
                <li>• Simple syntax</li>
              </ul>
            </div>
          </div>
          
          <div class="code-block-wrapper mb-6">
            <div class="code-block-header bg-gray-800 text-white px-4 py-2 rounded-t-lg flex items-center gap-2">
              <span class="text-sm font-medium">curl Command Examples</span>
              <span class="text-xs text-gray-400 ml-auto">bash</span>
            </div>
            <pre class="code-block bg-gray-900 text-green-400 p-4 overflow-x-auto font-mono text-sm rounded-b-lg">
              <code># GET request
curl -X GET "https://api.example.com/users" \\
  -H "Accept: application/json"

# POST request with JSON data
curl -X POST "https://api.example.com/users" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your-token" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'

# PUT request to update data
curl -X PUT "https://api.example.com/users/123" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Jane Doe"}'</code>
            </pre>
          </div>
        </div>
        
        <div class="quick-test bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h4 class="font-semibold text-green-900 mb-2 flex items-center gap-2">
            🎯 Test Your Knowledge
          </h4>
          <div class="text-sm text-green-800 space-y-2">
            <p><strong>Try this:</strong> Use Postman or curl to make requests to a public API like JSONPlaceholder (jsonplaceholder.typicode.com)</p>
            <ul class="ml-4 space-y-1">
              <li>• GET all posts: /posts</li>
              <li>• GET specific post: /posts/1</li>
              <li>• POST new post: /posts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  practiceInstructions: [
    "Use Postman to make GET, POST, PUT, and DELETE requests to JSONPlaceholder API",
    "Practice writing curl commands for different HTTP methods",
    "Examine HTTP headers in browser developer tools when visiting websites",
    "Test different status codes by making invalid requests",
    "Set up a simple REST Client file in VS Code with sample requests",
  ],
  hints: [
    "HTTP is stateless - each request must contain all necessary information",
    "Status codes in the 200s mean success, 400s mean client errors, 500s mean server errors",
    "Always use HTTPS in production to encrypt data in transit",
    "REST APIs should use nouns for resources and HTTP verbs for actions",
    "Headers carry important metadata - learn the common ones by heart",
  ],
  solution: `# HTTP Testing with curl (Universal)

# GET request
curl -X GET "https://jsonplaceholder.typicode.com/users" \
  -H "Accept: application/json"

# POST request with JSON data  
curl -X POST "https://jsonplaceholder.typicode.com/users" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'

# PUT request to update data
curl -X PUT "https://jsonplaceholder.typicode.com/users/1" \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe"}'

# DELETE request
curl -X DELETE "https://jsonplaceholder.typicode.com/users/1"

# Test with authentication header
curl -X GET "https://api.example.com/protected" \
  -H "Authorization: Bearer your-token-here"

# Save response to file and show headers
curl -X GET "https://jsonplaceholder.typicode.com/users/1" \
  -H "Accept: application/json" \
  -D headers.txt \
  -o response.json

echo "Practice these commands to understand HTTP fundamentals!"`,
};

export default lessonData;
