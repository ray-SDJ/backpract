import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Database Integration with Prisma",
  description:
    "Learn how to integrate Prisma ORM with Next.js for type-safe database operations, migrations, and efficient data management.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <h2>What is Prisma?</h2>
    <p>Prisma is a modern ORM (Object-Relational Mapping) tool that provides type-safe database access for TypeScript and Node.js. It works perfectly with Next.js and supports PostgreSQL, MySQL, SQLite, MongoDB, and more.</p>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-2">🎯 Why Prisma?</h4>
      <ul class="text-sm text-blue-800 space-y-1">
        <li>• <strong>Type Safety:</strong> Auto-generated TypeScript types from your schema</li>
        <li>• <strong>Intuitive API:</strong> Clean, readable database queries</li>
        <li>• <strong>Migrations:</strong> Version-controlled database schema changes</li>
        <li>• <strong>Prisma Studio:</strong> Visual database browser</li>
        <li>• <strong>Relations:</strong> Easy handling of complex data relationships</li>
      </ul>
    </div>

    <h2>Setting Up Prisma</h2>
    <p>Install Prisma in your Next.js project:</p>

    <pre class="code-block">
      <code>
# Install Prisma CLI and Client
npm install prisma @prisma/client

# Initialize Prisma
npx prisma init

# This creates:
# - prisma/schema.prisma (database schema)
# - .env (database connection string)
      </code>
    </pre>

    <h2>Defining Your Schema</h2>
    <p>Edit <code>prisma/schema.prisma</code> to define your database models:</p>

    <pre class="code-block">
      <code>
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  name      String?
  posts     Post[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Post {
  id        Int       @id @default(autoincrement())
  title     String
  content   String?
  published Boolean   @default(false)
  author    User      @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
      </code>
    </pre>

    <h2>Running Migrations</h2>
    <p>Create and apply database migrations:</p>

    <pre class="code-block">
      <code>
# Set your database URL in .env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# Create and run migration
npx prisma migrate dev --name init

# This will:
# 1. Create SQL migration files
# 2. Apply migrations to your database
# 3. Generate Prisma Client

# Generate Prisma Client (run after schema changes)
npx prisma generate
      </code>
    </pre>

    <h2>Prisma Client Singleton</h2>
    <p>Create a single Prisma Client instance to use throughout your app:</p>

    <pre class="code-block">
      <code>
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Prevent multiple instances in development
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
      </code>
    </pre>

    <h2>CRUD Operations in API Routes</h2>
    <p>Use Prisma Client in your Next.js API routes:</p>

    <pre class="code-block">
      <code>
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/users - List all users
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true // Include related posts
      }
    });
    
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name
      }
    });
    
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
      </code>
    </pre>

    <pre class="code-block">
      <code>
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/users/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
      include: { posts: true }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT /api/users/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const user = await prisma.user.update({
      where: { id: parseInt(params.id) },
      data: {
        email: body.email,
        name: body.name
      }
    });
    
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: parseInt(params.id) }
    });
    
    return NextResponse.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
      </code>
    </pre>

    <h2>Advanced Queries</h2>
    <p>Prisma provides powerful query capabilities:</p>

    <pre class="code-block">
      <code>
// Filtering and sorting
const users = await prisma.user.findMany({
  where: {
    email: {
      contains: '@example.com'
    }
  },
  orderBy: {
    createdAt: 'desc'
  },
  take: 10 // Limit results
});

// Complex filtering with AND/OR
const posts = await prisma.post.findMany({
  where: {
    OR: [
      { title: { contains: 'Next.js' } },
      { content: { contains: 'Next.js' } }
    ],
    AND: {
      published: true
    }
  }
});

// Pagination
const page = 1;
const pageSize = 20;
const posts = await prisma.post.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize
});

// Count total (for pagination)
const totalPosts = await prisma.post.count();

// Aggregations
const stats = await prisma.post.aggregate({
  _count: true,
  _avg: { authorId: true },
  _max: { createdAt: true }
});
      </code>
    </pre>

    <h2>Relations and Nested Writes</h2>
    <p>Handle related data efficiently:</p>

    <pre class="code-block">
      <code>
// Create user with posts
const user = await prisma.user.create({
  data: {
    email: 'john@example.com',
    name: 'John Doe',
    posts: {
      create: [
        { title: 'First Post', content: 'Hello World' },
        { title: 'Second Post', content: 'Learning Prisma' }
      ]
    }
  },
  include: {
    posts: true
  }
});

// Update with relations
const updatedUser = await prisma.user.update({
  where: { id: 1 },
  data: {
    name: 'Jane Doe',
    posts: {
      create: { title: 'New Post', content: 'Content here' },
      deleteMany: { published: false }
    }
  }
});

// Query with nested relations
const users = await prisma.user.findMany({
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    }
  }
});
      </code>
    </pre>

    <div class="complexity-table bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-gray-900 mb-3">🔧 Prisma CLI Commands</h4>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-300">
            <th class="text-left py-2">Command</th>
            <th class="text-left py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>npx prisma init</code></td>
            <td class="py-2">Initialize Prisma in project</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>npx prisma migrate dev</code></td>
            <td class="py-2">Create and apply migration</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>npx prisma generate</code></td>
            <td class="py-2">Generate Prisma Client</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>npx prisma studio</code></td>
            <td class="py-2">Open visual database browser</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>npx prisma db push</code></td>
            <td class="py-2">Push schema without migration</td>
          </tr>
          <tr>
            <td class="py-2"><code>npx prisma db seed</code></td>
            <td class="py-2">Run database seeding script</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>Using Prisma in Server Components</h2>
    <p>Server Components can directly query the database:</p>

    <pre class="code-block">
      <code>
// app/users/page.tsx (Server Component)
import { prisma } from '@/lib/prisma';

export default async function UsersPage() {
  // Direct database query - no API route needed!
  const users = await prisma.user.findMany({
    include: { posts: true }
  });
  
  return (
    &lt;div className="p-8"&gt;
      &lt;h1 className="text-2xl font-bold mb-4"&gt;Users&lt;/h1&gt;
      {users.map(user =&gt; (
        &lt;div key={user.id} className="mb-4 p-4 border rounded"&gt;
          &lt;h2 className="font-semibold"&gt;{user.name}&lt;/h2&gt;
          &lt;p className="text-gray-600"&gt;{user.email}&lt;/p&gt;
          &lt;p className="text-sm text-gray-500"&gt;
            {user.posts.length} posts
          &lt;/p&gt;
        &lt;/div&gt;
      ))}
    &lt;/div&gt;
  );
}
      </code>
    </pre>

    <div class="quick-test bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-2">💡 Best Practices</h4>
      <ul class="text-sm text-green-800 space-y-1">
        <li>✓ Use a Prisma Client singleton to avoid connection issues</li>
        <li>✓ Enable query logging in development for debugging</li>
        <li>✓ Use transactions for operations that must succeed or fail together</li>
        <li>✓ Index frequently queried fields in your schema</li>
        <li>✓ Use \`select\` to fetch only needed fields for better performance</li>
        <li>✓ Handle Prisma errors properly (unique constraint violations, etc.)</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Set up Prisma ORM in a Next.js project",
    "Define database models and relations in Prisma schema",
    "Run migrations to sync schema with database",
    "Perform CRUD operations using Prisma Client",
    "Query related data and handle complex database operations",
  ],
  practiceInstructions: [
    "Install Prisma and initialize it in your Next.js project",
    "Create a schema with User and Post models (one-to-many relationship)",
    "Run migrations to create the database tables",
    "Build API routes for creating users and posts",
    "Query users with their associated posts using Prisma",
  ],
  hints: [
    "Run 'npx prisma init' to create schema file",
    "Use @relation to define relationships between models",
    "Run 'npx prisma migrate dev' after schema changes",
    "Import prisma from your lib/prisma.ts singleton",
    "Use 'include' in queries to fetch related data",
  ],
  solution: `// Complete Prisma setup solution

// 1. Install dependencies
// npm install prisma @prisma/client
// npx prisma init

// 2. prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
}

// 3. Run migration
// npx prisma migrate dev --name init

// 4. lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// 5. app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const { email, name } = await request.json();
  
  const user = await prisma.user.create({
    data: { email, name }
  });
  
  return NextResponse.json({ user }, { status: 201 });
}

export async function GET() {
  const users = await prisma.user.findMany({
    include: { posts: true }
  });
  
  return NextResponse.json({ users });
}

// 6. app/api/posts/route.ts
export async function POST(request: NextRequest) {
  const { title, content, authorId } = await request.json();
  
  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: parseInt(authorId)
    }
  });
  
  return NextResponse.json({ post }, { status: 201 });
}`,
};
