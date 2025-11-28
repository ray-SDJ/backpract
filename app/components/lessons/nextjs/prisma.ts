import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Prisma Database Models & Schema",
  description:
    "Master Prisma ORM for Next.js - create type-safe database models, relationships, and migrations for PostgreSQL, MySQL, and more.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <h1 class="text-3xl font-bold mb-6">Prisma Database Models & Schema</h1>
    
    <p class="mb-4">Learn how to design and implement database schemas using Prisma ORM with full TypeScript type safety.</p>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🚀 Getting Started with Prisma</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
# Install Prisma
npm install prisma @prisma/client

# Initialize Prisma in your project
npx prisma init

# This creates:
# ├── prisma/
# │   └── schema.prisma
# └── .env
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">📝 Basic Schema Structure</h2>
    
    <p class="mb-4">The <code>schema.prisma</code> file defines your database schema:</p>

    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // or "mysql", "sqlite", "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  username  String   @unique
  name      String?
  password  String
  bio       String?  @db.Text
  avatar    String?
  
  // Status fields
  isActive  Boolean  @default(true)
  isAdmin   Boolean  @default(false)
  verified  Boolean  @default(false)
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  lastLogin DateTime?
  
  // Indexes for performance
  @@index([email])
  @@index([username])
  @@map("users")  // Custom table name
}
      </code>
    </pre>

    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🎯 Field Attributes</h4>
      <ul class="text-blue-800 space-y-2">
        <li>• <strong>@id</strong> - Marks field as primary key</li>
        <li>• <strong>@unique</strong> - Ensures unique values</li>
        <li>• <strong>@default()</strong> - Sets default value</li>
        <li>• <strong>@updatedAt</strong> - Auto-updates on changes</li>
        <li>• <strong>@db.Text</strong> - Database-specific type</li>
        <li>• <strong>?</strong> - Makes field optional (nullable)</li>
        <li>• <strong>@@index([])</strong> - Creates database index</li>
        <li>• <strong>@@map()</strong> - Custom table/column name</li>
      </ul>
    </div>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🔗 Model Relationships</h2>

    <h3 class="text-xl font-semibold mt-6 mb-3">One-to-Many Relationship</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  username  String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // One user has many posts
  posts     Post[]
  comments  Comment[]
  
  @@map("users")
}

model Post {
  id          Int      @id @default(autoincrement())
  title       String
  slug        String   @unique
  content     String   @db.Text
  excerpt     String?
  published   Boolean  @default(false)
  viewCount   Int      @default(0)
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  publishedAt DateTime?
  
  // Foreign key - many posts belong to one user
  authorId    Int
  author      User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  // One post has many comments
  comments    Comment[]
  
  // Many-to-many with tags
  tags        Tag[]
  
  @@index([authorId])
  @@index([slug])
  @@index([published])
  @@map("posts")
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Foreign keys
  postId    Int
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  userId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([postId])
  @@index([userId])
  @@map("comments")
}
      </code>
    </pre>

    <h3 class="text-xl font-semibold mt-6 mb-3">Many-to-Many Relationship</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String   @db.Text
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  
  // Many-to-many: posts can have many tags, tags can have many posts
  tags      Tag[]
  
  @@map("posts")
}

model Tag {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  slug        String   @unique
  description String?
  createdAt   DateTime @default(now())
  
  // Many-to-many with posts
  posts       Post[]
  
  @@map("tags")
}

// Prisma automatically creates junction table: _PostToTag
      </code>
    </pre>

    <h3 class="text-xl font-semibold mt-6 mb-3">Explicit Many-to-Many (with extra fields)</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
model User {
  id            Int              @id @default(autoincrement())
  email         String           @unique
  enrollments   CourseEnrollment[]
  
  @@map("users")
}

model Course {
  id            Int              @id @default(autoincrement())
  title         String
  description   String           @db.Text
  price         Decimal          @db.Decimal(10, 2)
  enrollments   CourseEnrollment[]
  
  @@map("courses")
}

// Explicit junction table with additional fields
model CourseEnrollment {
  id           Int      @id @default(autoincrement())
  enrolledAt   DateTime @default(now())
  completedAt  DateTime?
  progress     Int      @default(0)
  grade        String?
  
  // Foreign keys
  userId       Int
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  courseId     Int
  course       Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  
  // Composite unique constraint
  @@unique([userId, courseId])
  @@index([userId])
  @@index([courseId])
  @@map("course_enrollments")
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">📊 Advanced Model Features</h2>

    <h3 class="text-xl font-semibold mt-6 mb-3">Enums</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
enum Role {
  USER
  MODERATOR
  ADMIN
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  role      Role     @default(USER)
  
  orders    Order[]
  
  @@map("users")
}

model Order {
  id            Int          @id @default(autoincrement())
  orderNumber   String       @unique
  status        OrderStatus  @default(PENDING)
  totalCents    Int          // Store money in cents
  
  userId        Int
  user          User         @relation(fields: [userId], references: [id])
  
  items         OrderItem[]
  
  createdAt     DateTime     @default(now())
  paidAt        DateTime?
  shippedAt     DateTime?
  deliveredAt   DateTime?
  
  @@index([userId])
  @@index([status])
  @@map("orders")
}
      </code>
    </pre>

    <h3 class="text-xl font-semibold mt-6 mb-3">Self-Relations (Tree Structures)</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
model Category {
  id          Int        @id @default(autoincrement())
  name        String
  slug        String     @unique
  description String?
  
  // Self-relation for nested categories
  parentId    Int?
  parent      Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryTree")
  
  products    Product[]
  
  @@index([parentId])
  @@map("categories")
}

model Product {
  id          Int      @id @default(autoincrement())
  name        String
  sku         String   @unique
  description String?  @db.Text
  priceCents  Int
  quantity    Int      @default(0)
  
  categoryId  Int?
  category    Category? @relation(fields: [categoryId], references: [id])
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([categoryId])
  @@index([sku])
  @@map("products")
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🔄 Migrations</h2>
    
    <p class="mb-4">Create and apply database migrations:</p>

    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
# Set your database URL in .env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# Create and apply migration
npx prisma migrate dev --name init

# This will:
# 1. Create SQL migration files in prisma/migrations/
# 2. Apply the migration to your database
# 3. Generate Prisma Client with TypeScript types

# Generate Prisma Client (after schema changes)
npx prisma generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy

# View database in Prisma Studio
npx prisma studio
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">⚡ Prisma Client Setup</h2>
    
    <p class="mb-4">Create a singleton Prisma Client instance:</p>

    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🎯 CRUD Operations</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// CREATE - POST /api/users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const user = await prisma.user.create({
      data: {
        email: body.email,
        username: body.username,
        name: body.name,
        password: body.password, // Hash this in production!
      },
    });
    
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// READ - GET /api/users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        include: {
          posts: {
            where: { published: true },
            select: { id: true, title: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);
    
    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
      </code>
    </pre>

    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// READ ONE - GET /api/users/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        posts: {
          include: { tags: true },
        },
        comments: true,
      },
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

// UPDATE - PUT /api/users/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const user = await prisma.user.update({
      where: { id: parseInt(params.id) },
      data: {
        name: body.name,
        bio: body.bio,
        avatar: body.avatar,
      },
    });
    
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE - DELETE /api/users/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: parseInt(params.id) },
    });
    
    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🔍 Advanced Queries</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// Complex filtering
const posts = await prisma.post.findMany({
  where: {
    AND: [
      { published: true },
      {
        OR: [
          { title: { contains: 'prisma' } },
          { content: { contains: 'database' } },
        ],
      },
      { author: { isActive: true } },
    ],
  },
  include: {
    author: {
      select: { username: true, avatar: true },
    },
    tags: true,
    _count: { select: { comments: true } },
  },
  orderBy: [
    { viewCount: 'desc' },
    { createdAt: 'desc' },
  ],
  take: 10,
});

// Aggregations
const stats = await prisma.post.aggregate({
  _count: { id: true },
  _avg: { viewCount: true },
  _sum: { viewCount: true },
  _max: { createdAt: true },
});

// Group by
const postsByAuthor = await prisma.post.groupBy({
  by: ['authorId'],
  _count: { id: true },
  _sum: { viewCount: true },
  having: {
    id: { _count: { gt: 5 } },
  },
});
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">💡 Best Practices</h2>
    
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-yellow-900 mb-3">✅ Prisma Best Practices</h4>
      <ul class="text-yellow-800 space-y-2">
        <li>• <strong>Use TypeScript:</strong> Get full type safety from Prisma Client</li>
        <li>• <strong>Add indexes:</strong> Index frequently queried fields for performance</li>
        <li>• <strong>Use cascades:</strong> onDelete: Cascade maintains referential integrity</li>
        <li>• <strong>Pagination:</strong> Use skip/take for large datasets</li>
        <li>• <strong>Select only what you need:</strong> Use select or include, not both</li>
        <li>• <strong>Store money in cents:</strong> Use Int for monetary values</li>
        <li>• <strong>Use enums:</strong> Type-safe status and role fields</li>
        <li>• <strong>Soft deletes:</strong> Add deletedAt field instead of hard deletes</li>
        <li>• <strong>Prisma Studio:</strong> Use for visual database management</li>
      </ul>
    </div>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🎯 Complete E-commerce Example</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// prisma/schema.prisma - Complete e-commerce schema

enum OrderStatus {
  PENDING
  PAID
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

model User {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  username      String    @unique
  name          String?
  password      String
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  orders        Order[]
  cart          Cart?
  reviews       Review[]
  
  @@map("users")
}

model Product {
  id            Int       @id @default(autoincrement())
  name          String
  slug          String    @unique
  description   String    @db.Text
  sku           String    @unique
  priceCents    Int
  quantity      Int       @default(0)
  isActive      Boolean   @default(true)
  
  categoryId    Int?
  category      Category? @relation(fields: [categoryId], references: [id])
  
  images        ProductImage[]
  orderItems    OrderItem[]
  cartItems     CartItem[]
  reviews       Review[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([slug])
  @@index([categoryId])
  @@map("products")
}

model Category {
  id          Int        @id @default(autoincrement())
  name        String
  slug        String     @unique
  parentId    Int?
  parent      Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryTree")
  products    Product[]
  
  @@map("categories")
}

model Order {
  id            Int          @id @default(autoincrement())
  orderNumber   String       @unique
  status        OrderStatus  @default(PENDING)
  totalCents    Int
  
  userId        Int
  user          User         @relation(fields: [userId], references: [id])
  
  items         OrderItem[]
  
  shippingAddress String     @db.Text
  trackingNumber  String?
  
  createdAt     DateTime     @default(now())
  paidAt        DateTime?
  shippedAt     DateTime?
  deliveredAt   DateTime?
  
  @@index([userId])
  @@index([status])
  @@map("orders")
}

model OrderItem {
  id          Int      @id @default(autoincrement())
  quantity    Int
  priceCents  Int
  
  orderId     Int
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  productId   Int
  product     Product  @relation(fields: [productId], references: [id])
  
  @@map("order_items")
}

model Cart {
  id        Int        @id @default(autoincrement())
  userId    Int        @unique
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items     CartItem[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  
  @@map("carts")
}

model CartItem {
  id        Int      @id @default(autoincrement())
  quantity  Int
  
  cartId    Int
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  
  productId Int
  product   Product  @relation(fields: [productId], references: [id])
  
  @@unique([cartId, productId])
  @@map("cart_items")
}

model Review {
  id        Int      @id @default(autoincrement())
  rating    Int      // 1-5
  comment   String?  @db.Text
  
  userId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  productId Int
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  
  @@unique([userId, productId])
  @@map("reviews")
}

model ProductImage {
  id        Int      @id @default(autoincrement())
  url       String
  altText   String?
  order     Int      @default(0)
  
  productId Int
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@map("product_images")
}
      </code>
    </pre>
  </div>`,
  objectives: [
    "Understand Prisma schema syntax and field types",
    "Create models with relationships (one-to-many, many-to-many)",
    "Use enums for type-safe status fields",
    "Implement database migrations with Prisma",
    "Perform CRUD operations with Prisma Client",
    "Use advanced queries with filtering and aggregations",
  ],
  practiceInstructions: [
    "Install Prisma and initialize in your Next.js project",
    "Create a User model with email, username, and timestamps",
    "Add a Post model with a one-to-many relationship to User",
    "Implement a many-to-many relationship between Posts and Tags",
    "Run migrations to create database tables",
    "Create API routes using Prisma Client for CRUD operations",
  ],
  hints: [
    "Use @unique for fields that must be unique (email, username)",
    "Add @default(now()) for createdAt and @updatedAt for updatedAt",
    "Use onDelete: Cascade to automatically delete related records",
    "Store prices in cents (Int) to avoid floating-point precision issues",
    "Use include to load related data, select to choose specific fields",
    "Create indexes with @@index([fieldName]) for better query performance",
  ],
  solution: `// Complete working example

// 1. prisma/schema.prisma
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
  username  String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
  
  @@map("users")
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String   @db.Text
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  tags      Tag[]
  createdAt DateTime @default(now())
  
  @@index([authorId])
  @@map("posts")
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
  
  @@map("tags")
}

// 2. lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// 3. app/api/posts/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const posts = await prisma.post.findMany({
    include: { author: true, tags: true },
  });
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const body = await request.json();
  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: body.authorId,
    },
  });
  return NextResponse.json({ post }, { status: 201 });
}

// Run: npx prisma migrate dev --name init`,
};
