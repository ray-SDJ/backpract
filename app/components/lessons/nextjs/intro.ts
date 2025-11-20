import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Next.js Setup & Project Structure",
  description:
    "Learn how to set up a Next.js project and understand the App Router architecture for building full-stack applications with React.",
  difficulty: "Beginner",
  content: `<div class="lesson-content">
    <h2>What is Next.js?</h2>
    <p>Next.js is a powerful React framework that enables you to build full-stack web applications. It provides both frontend and backend capabilities in a single framework, making it perfect for creating modern, performant applications.</p>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-2">🎯 Why Next.js for Backend?</h4>
      <ul class="text-sm text-blue-800 space-y-1">
        <li>• <strong>API Routes:</strong> Built-in serverless API endpoints</li>
        <li>• <strong>Server Components:</strong> Run backend logic directly in React components</li>
        <li>• <strong>Server Actions:</strong> Handle form submissions and mutations securely</li>
        <li>• <strong>TypeScript Support:</strong> First-class TypeScript integration</li>
        <li>• <strong>Optimizations:</strong> Automatic code splitting, image optimization, and more</li>
      </ul>
    </div>

    <h2>Setting Up a Next.js Project</h2>
    <p>Let's create a new Next.js application using the official create-next-app tool:</p>

    <pre class="code-block">
      <code>
# Create a new Next.js project
npx create-next-app@latest my-backend-app

# You'll be prompted with configuration options:
# ✓ Would you like to use TypeScript? Yes
# ✓ Would you like to use ESLint? Yes
# ✓ Would you like to use Tailwind CSS? Yes
# ✓ Would you like to use 'src/' directory? No
# ✓ Would you like to use App Router? Yes (recommended)
# ✓ Would you like to customize the default import alias? No

cd my-backend-app
npm run dev

# Your app will be running at http://localhost:3000
      </code>
    </pre>

    <h2>Understanding the App Router Structure</h2>
    <p>Next.js 13+ uses the App Router, which organizes your application in the <code>app</code> directory:</p>

    <pre class="code-block">
      <code>
my-backend-app/
├── app/
│   ├── layout.tsx          # Root layout (wraps all pages)
│   ├── page.tsx            # Home page (/)
│   ├── globals.css         # Global styles
│   ├── api/                # API Routes folder
│   │   └── hello/
│   │       └── route.ts    # API endpoint: /api/hello
│   └── dashboard/
│       └── page.tsx        # Dashboard page (/dashboard)
├── public/                 # Static files
├── package.json
└── next.config.js         # Next.js configuration
      </code>
    </pre>

    <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-2">📁 Key Folders Explained</h4>
      <ul class="text-sm text-green-800 space-y-2">
        <li><strong>app/</strong> - Your application code lives here</li>
        <li><strong>app/api/</strong> - Backend API routes (serverless functions)</li>
        <li><strong>app/layout.tsx</strong> - Shared UI that wraps pages</li>
        <li><strong>app/page.tsx</strong> - Route pages (page.tsx creates a route)</li>
        <li><strong>public/</strong> - Static assets (images, fonts, etc.)</li>
      </ul>
    </div>

    <h2>Creating Your First API Route</h2>
    <p>API routes are defined using <code>route.ts</code> files in the <code>app/api</code> directory. They use the Web Request and Response APIs:</p>

    <pre class="code-block">
      <code>
// app/api/hello/route.ts
import { NextResponse } from 'next/server';

// GET /api/hello
export async function GET(request: Request) {
  return NextResponse.json({
    message: 'Hello from Next.js API!',
    timestamp: new Date().toISOString()
  });
}

// POST /api/hello
export async function POST(request: Request) {
  const body = await request.json();
  
  return NextResponse.json({
    message: 'Data received!',
    data: body
  }, { status: 201 });
}
      </code>
    </pre>

    <h2>Testing Your API Route</h2>
    <p>You can test your API endpoint using curl or any HTTP client:</p>

    <pre class="code-block">
      <code>
# Test GET request
curl http://localhost:3000/api/hello

# Response:
# {
#   "message": "Hello from Next.js API!",
#   "timestamp": "2025-11-20T10:30:00.000Z"
# }

# Test POST request
curl -X POST http://localhost:3000/api/hello \\
  -H "Content-Type: application/json" \\
  -d '{"name": "John"}'

# Response:
# {
#   "message": "Data received!",
#   "data": {"name": "John"}
# }
      </code>
    </pre>

    <h2>Server Components vs Client Components</h2>
    <p>Next.js introduces a new paradigm with Server and Client Components:</p>

    <div class="comparison-table bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-gray-900 mb-3">Server vs Client Components</h4>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-300">
            <th class="text-left py-2">Feature</th>
            <th class="text-left py-2">Server Component</th>
            <th class="text-left py-2">Client Component</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-gray-200">
            <td class="py-2">Where it runs</td>
            <td class="py-2">Server only</td>
            <td class="py-2">Client (browser)</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Access to backend</td>
            <td class="py-2 text-green-600">✓ Direct DB access</td>
            <td class="py-2 text-red-600">✗ Must use API</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Interactivity</td>
            <td class="py-2 text-red-600">✗ No hooks/events</td>
            <td class="py-2 text-green-600">✓ useState, onClick, etc.</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2">Bundle size</td>
            <td class="py-2 text-green-600">Smaller (no JS sent)</td>
            <td class="py-2 text-orange-600">Larger (includes JS)</td>
          </tr>
          <tr>
            <td class="py-2">Use case</td>
            <td class="py-2">Data fetching, SEO</td>
            <td class="py-2">Interactivity, forms</td>
          </tr>
        </tbody>
      </table>
    </div>

    <pre class="code-block">
      <code>
// Server Component (default in app/ directory)
// app/users/page.tsx
export default async function UsersPage() {
  // Direct database access - runs on server
  const users = await db.user.findMany();
  
  return (
    &lt;div&gt;
      &lt;h1&gt;Users&lt;/h1&gt;
      {users.map(user =&gt; (
        &lt;div key={user.id}&gt;{user.name}&lt;/div&gt;
      ))}
    &lt;/div&gt;
  );
}

// Client Component - add "use client" directive
// app/components/Counter.tsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    &lt;button onClick={() =&gt; setCount(count + 1)}&gt;
      Count: {count}
    &lt;/button&gt;
  );
}
      </code>
    </pre>

    <h2>Environment Variables</h2>
    <p>Next.js supports environment variables for configuration:</p>

    <pre class="code-block">
      <code>
# .env.local (create this file in root directory)
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
API_SECRET_KEY="your-secret-key-here"

# .env.local is gitignored by default - never commit secrets!

# Access in Server Components and API Routes:
const dbUrl = process.env.DATABASE_URL;

# For client-side access, prefix with NEXT_PUBLIC_:
NEXT_PUBLIC_API_URL="https://api.example.com"

# Access in Client Components:
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      </code>
    </pre>

    <div class="quick-test bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-yellow-900 mb-2">⚠️ Important Security Note</h4>
      <p class="text-sm text-yellow-800">
        Never expose sensitive data (API keys, database credentials) to the client. 
        Use <code>NEXT_PUBLIC_</code> prefix only for truly public data. All backend 
        operations should use regular environment variables accessed only on the server.
      </p>
    </div>

    <h2>Next Steps</h2>
    <p>Now that you understand the basics of Next.js structure, you're ready to:</p>
    <ul>
      <li>Build complex API routes with route handlers</li>
      <li>Integrate databases using Prisma ORM</li>
      <li>Implement authentication with NextAuth.js</li>
      <li>Use Server Actions for form handling</li>
      <li>Deploy to Vercel or other platforms</li>
    </ul>
  </div>`,
  objectives: [
    "Understand Next.js App Router architecture",
    "Set up a Next.js project with TypeScript",
    "Create basic API routes using route handlers",
    "Understand Server Components vs Client Components",
    "Configure environment variables securely",
  ],
  practiceInstructions: [
    "Create a new Next.js project using create-next-app",
    "Build an API route at /api/users that returns a JSON array of users",
    "Create a Server Component page that displays the current timestamp",
    "Add a Client Component button that increments a counter",
    "Set up environment variables for a database URL",
  ],
  hints: [
    "Use 'npx create-next-app@latest' to scaffold a new project",
    "API routes must be in app/api/ directory with route.ts filename",
    "Server Components can use async/await directly",
    "Client Components need 'use client' directive at the top",
    "Create .env.local file for local environment variables",
  ],
  solution: `// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' }
  ];
  
  return NextResponse.json({ users });
}

// app/timestamp/page.tsx (Server Component)
export default async function TimestampPage() {
  const timestamp = new Date().toISOString();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Server Timestamp</h1>
      <p>Current server time: {timestamp}</p>
    </div>
  );
}

// app/components/Counter.tsx (Client Component)
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl mb-2">Counter</h2>
      <p className="mb-2">Count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Increment
      </button>
    </div>
  );
}

// .env.local
DATABASE_URL="postgresql://localhost:5432/myapp"
NEXT_PUBLIC_API_URL="http://localhost:3000"`,
};
