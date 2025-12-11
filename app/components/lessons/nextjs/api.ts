import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "API Routes & Route Handlers in Next.js",
  description:
    "Master Next.js API Routes and Route Handlers to build RESTful APIs with full CRUD operations, request validation, and error handling.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <h2>Introduction to Route Handlers</h2>
    <p>Route Handlers are Next.js's way of creating API endpoints. They replace the old Pages Router API routes and use the standard Web Request and Response APIs, making them familiar if you've worked with other backend frameworks.</p>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-2">🔍 Key Concepts</h4>
      <ul class="text-sm text-blue-800 space-y-1">
        <li>• <strong>File-based routing:</strong> Create app/api/[name]/route.ts for /api/[name]</li>
        <li>• <strong>HTTP methods:</strong> Export functions named GET, POST, PUT, DELETE, PATCH</li>
        <li>• <strong>Standard APIs:</strong> Uses Web Request and Response standards</li>
        <li>• <strong>Serverless by default:</strong> Each route is a serverless function</li>
        <li>• <strong>TypeScript support:</strong> Full type safety with Request and Response</li>
      </ul>
    </div>

    <h2>Basic Route Handler Structure</h2>
    <p>A route handler exports async functions for each HTTP method you want to support:</p>

    <pre class="code-block">
      <code>
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/products
export async function GET(request: NextRequest) {
  // Access query parameters
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  
  // Simulate database query
  const products = [
    { id: 1, name: 'Laptop', price: 999, category: 'electronics' },
    { id: 2, name: 'Book', price: 19, category: 'books' }
  ];
  
  // Filter by category if provided
  const filtered = category 
    ? products.filter(p => p.category === category)
    : products;
  
  return NextResponse.json({ products: filtered });
}

// POST /api/products
export async function POST(request: NextRequest) {
  try {
    // Parse JSON body
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      );
    }
    
    // Simulate database insert
    const newProduct = {
      id: Date.now(),
      name: body.name,
      price: body.price,
      category: body.category || 'uncategorized'
    };
    
    return NextResponse.json(
      { product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    );
  }
}
      </code>
    </pre>

    <h2>Dynamic Route Handlers</h2>
    <p>Use square brackets for dynamic segments in your API routes:</p>

    <pre class="code-block">
      <code>
// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/products/123
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  
  // Simulate database lookup
  const product = {
    id: productId,
    name: 'Sample Product',
    price: 99
  };
  
  return NextResponse.json({ product });
}

// PUT /api/products/123
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  const body = await request.json();
  
  // Simulate database update
  const updatedProduct = {
    id: productId,
    ...body,
    updatedAt: new Date().toISOString()
  };
  
  return NextResponse.json({ product: updatedProduct });
}

// DELETE /api/products/123
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  
  // Simulate database delete
  return NextResponse.json({
    message: \`Product \${productId} deleted successfully\`
  });
}
      </code>
    </pre>

    <h2>Request Headers and Cookies</h2>
    <p>Access and set headers and cookies in your route handlers:</p>

    <pre class="code-block">
      <code>
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Get headers
  const userAgent = request.headers.get('user-agent');
  const contentType = request.headers.get('content-type');
  
  // Get cookies
  const token = request.cookies.get('auth-token');
  
  // Simulate authentication
  if (body.email && body.password) {
    const response = NextResponse.json({
      success: true,
      user: { email: body.email }
    });
    
    // Set cookie
    response.cookies.set('auth-token', 'secret-token-123', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    
    // Set custom header
    response.headers.set('X-Custom-Header', 'my-value');
    
    return response;
  }
  
  return NextResponse.json(
    { error: 'Invalid credentials' },
    { status: 401 }
  );
}
      </code>
    </pre>

    <h2>Error Handling Best Practices</h2>
    <p>Implement proper error handling and status codes:</p>

    <pre class="code-block">
      <code>
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    
    // Validate ID format
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 } // Bad Request
      );
    }
    
    // Simulate database lookup
    const user = await findUserById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 } // Not Found
      );
    }
    
    return NextResponse.json({ user });
    
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 } // Internal Server Error
    );
  }
}

// Helper function
async function findUserById(id: number) {
  // Simulate database query
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ];
  return users.find(u => u.id === id);
}
      </code>
    </pre>

    <div class="complexity-table bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-gray-900 mb-3">📊 HTTP Status Codes Quick Reference</h4>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-300">
            <th class="text-left py-2">Code</th>
            <th class="text-left py-2">Meaning</th>
            <th class="text-left py-2">When to Use</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-gray-200">
            <td class="py-2">200</td>
            <td class="py-2">OK</td>
            <td class="py-2">Successful GET, PUT, PATCH</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">201</td>
            <td class="py-2">Created</td>
            <td class="py-2">Successful POST (resource created)</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">400</td>
            <td class="py-2">Bad Request</td>
            <td class="py-2">Invalid input/validation error</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">401</td>
            <td class="py-2">Unauthorized</td>
            <td class="py-2">Authentication required</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">403</td>
            <td class="py-2">Forbidden</td>
            <td class="py-2">User doesn't have permission</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">404</td>
            <td class="py-2">Not Found</td>
            <td class="py-2">Resource doesn't exist</td>
          </tr>
          <tr>
            <td class="py-2">500</td>
            <td class="py-2">Server Error</td>
            <td class="py-2">Unexpected server error</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>CORS Configuration</h2>
    <p>Enable Cross-Origin Resource Sharing for external API access:</p>

    <pre class="code-block">
      <code>
// app/api/public/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = NextResponse.json({
    message: 'Public API endpoint'
  });
  
  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

// Handle preflight OPTIONS request
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
      </code>
    </pre>

    <h2>Middleware for Route Protection</h2>
    <p>Use Next.js middleware to protect routes:</p>

    <pre class="code-block">
      <code>
// middleware.ts (in root directory)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for auth token
  const token = request.cookies.get('auth-token');
  
  if (!token && request.nextUrl.pathname.startsWith('/api/protected')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: '/api/protected/:path*',
};
      </code>
    </pre>

    <div class="quick-test bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-2">💡 Best Practices</h4>
      <ul class="text-sm text-green-800 space-y-1">
        <li>✓ Always validate input data before processing</li>
        <li>✓ Use appropriate HTTP status codes</li>
        <li>✓ Handle errors gracefully with try-catch</li>
        <li>✓ Set proper CORS headers for public APIs</li>
        <li>✓ Use environment variables for sensitive data</li>
        <li>✓ Implement rate limiting for production APIs</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Create RESTful API endpoints with route handlers",
    "Handle different HTTP methods (GET, POST, PUT, DELETE)",
    "Work with dynamic route parameters",
    "Manage request headers, cookies, and query parameters",
    "Implement proper error handling and status codes",
  ],
  practiceInstructions: [
    "Create a complete CRUD API for a 'tasks' resource",
    "Implement route handlers for GET, POST, PUT, DELETE methods",
    "Add validation for required fields (title, description)",
    "Use dynamic routes for individual task operations",
    "Return appropriate HTTP status codes for each operation",
  ],
  hints: [
    "Create app/api/tasks/route.ts for list operations",
    "Create app/api/tasks/[id]/route.ts for single task operations",
    "Use await request.json() to parse request body",
    "Return NextResponse.json() with data and status code",
    "Store tasks in an in-memory array for this practice",
  ],
  solution: `// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (use database in production)
let tasks = [
  { id: 1, title: 'Learn Next.js', description: 'Master API routes', completed: false },
  { id: 2, title: 'Build project', description: 'Create full-stack app', completed: false }
];

// GET /api/tasks
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const completed = searchParams.get('completed');
  
  let filtered = tasks;
  if (completed !== null) {
    filtered = tasks.filter(t => t.completed === (completed === 'true'));
  }
  
  return NextResponse.json({ tasks: filtered });
}

// POST /api/tasks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    const newTask = {
      id: Date.now(),
      title: body.title,
      description: body.description || '',
      completed: false
    };
    
    tasks.push(newTask);
    
    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// app/api/tasks/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/tasks/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const task = tasks.find(t => t.id === parseInt(params.id));
  
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  
  return NextResponse.json({ task });
}

// PUT /api/tasks/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const taskId = parseInt(params.id);
  const index = tasks.findIndex(t => t.id === taskId);
  
  if (index === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  
  const body = await request.json();
  tasks[index] = { ...tasks[index], ...body };
  
  return NextResponse.json({ task: tasks[index] });
}

// DELETE /api/tasks/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const taskId = parseInt(params.id);
  const index = tasks.findIndex(t => t.id === taskId);
  
  if (index === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  
  tasks.splice(index, 1);
  
  return NextResponse.json({ message: 'Task deleted successfully' });
}`,
};

export default lessonData;
