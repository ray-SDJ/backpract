import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "NextAuth.js Authentication & Authorization",
  description:
    "Implement secure authentication in Next.js using NextAuth.js with multiple providers, JWT sessions, and role-based access control.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <h2>What is NextAuth.js?</h2>
    <p>NextAuth.js is a complete authentication solution for Next.js applications. It provides secure authentication with minimal configuration, supporting various providers and session strategies.</p>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-2">🔐 Why NextAuth.js?</h4>
      <ul class="text-sm text-blue-800 space-y-1">
        <li>• <strong>Multiple Providers:</strong> OAuth, Email, Credentials, and more</li>
        <li>• <strong>Secure by Default:</strong> CSRF protection, encrypted JWT, secure cookies</li>
        <li>• <strong>TypeScript Support:</strong> Full type safety for auth operations</li>
        <li>• <strong>Database Adapters:</strong> Support for Prisma, MongoDB, PostgreSQL, etc.</li>
        <li>• <strong>Session Management:</strong> JWT or database sessions</li>
      </ul>
    </div>

    <h2>Installation & Setup</h2>
    <p>Install NextAuth.js and required dependencies:</p>

    <pre class="code-block">
      <code>
# Install NextAuth.js
npm install next-auth

# Install database adapter (Prisma example)
npm install @next-auth/prisma-adapter
npm install prisma @prisma/client
npm install bcryptjs
npm install --save-dev @types/bcryptjs

# Initialize Prisma
npx prisma init
      </code>
    </pre>

    <h2>Prisma Schema for Authentication</h2>
    <p>Configure your database schema for authentication:</p>

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

model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?  @db.Text
  access_token       String?  @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?  @db.Text
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          Role      @default(USER)
  accounts      Account[]
  sessions      Session[]
  posts         Post[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

enum Role {
  USER
  ADMIN
  MODERATOR
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
}
      </code>
    </pre>

    <h2>NextAuth Configuration</h2>
    <p>Create the NextAuth API route and configuration:</p>

    <pre class="code-block">
      <code>
// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    // Credentials Provider (Email & Password)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      }
    }),

    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),

    // GitHub OAuth Provider
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  // Session configuration
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // JWT configuration
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Custom pages
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },

  // Callbacks
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      // You can add additional sign-in logic here
      // For example, check if user is allowed to sign in
      return true;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return \`\${baseUrl}\${url}\`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },

  // Event handlers
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(\`User \${user.email} signed in\`);
    },
    async signOut({ session, token }) {
      console.log("User signed out");
    },
    async createUser({ user }) {
      console.log(\`New user created: \${user.email}\`);
    },
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
      </code>
    </pre>

    <h2>Registration API Route</h2>
    <p>Create a secure user registration endpoint:</p>

    <pre class="code-block">
      <code>
// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
      </code>
    </pre>

    <h2>Authentication Utilities</h2>
    <p>Create helper functions for server-side authentication:</p>

    <pre class="code-block">
      <code>
// lib/auth.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/auth/signin");
  }
  
  return session.user;
}

export async function requireRole(role: string | string[]) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/auth/signin");
  }

  const allowedRoles = Array.isArray(role) ? role : [role];
  
  if (!allowedRoles.includes(session.user.role)) {
    redirect("/unauthorized");
  }
  
  return session.user;
}

// Type definitions
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      image?: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
      </code>
    </pre>

    <h2>Protected Server Components</h2>
    <p>Use authentication in Server Components:</p>

    <pre class="code-block">
      <code>
// app/dashboard/page.tsx
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    &lt;div&gt;
      &lt;h1&gt;Welcome, {user.name}!&lt;/h1&gt;
      &lt;p&gt;Email: {user.email}&lt;/p&gt;
      &lt;p&gt;Role: {user.role}&lt;/p&gt;
    &lt;/div&gt;
  );
}

// app/admin/page.tsx
import { requireRole } from "@/lib/auth";

export default async function AdminPage() {
  const user = await requireRole("ADMIN");

  return (
    &lt;div&gt;
      &lt;h1&gt;Admin Dashboard&lt;/h1&gt;
      &lt;p&gt;Welcome, Admin {user.name}&lt;/p&gt;
    &lt;/div&gt;
  );
}
      </code>
    </pre>

    <h2>Protected API Routes</h2>
    <p>Secure your API endpoints with authentication:</p>

    <pre class="code-block">
      <code>
// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { title, content } = body;

  if (!title) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: session.user.id,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}

// app/api/posts/[id]/route.ts
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    return NextResponse.json(
      { error: "Post not found" },
      { status: 404 }
    );
  }

  // Check ownership or admin role
  if (post.authorId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  await prisma.post.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ message: "Post deleted successfully" });
}
      </code>
    </pre>

    <h2>Client-Side Authentication</h2>
    <p>Use authentication in Client Components:</p>

    <pre class="code-block">
      <code>
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return &lt;div&gt;Loading...&lt;/div&gt;;
  }

  if (status === "unauthenticated") {
    return (
      &lt;button onClick={() =&gt; signIn()}&gt;
        Sign In
      &lt;/button&gt;
    );
  }

  return (
    &lt;div&gt;
      &lt;p&gt;Welcome, {session?.user?.name}!&lt;/p&gt;
      &lt;button onClick={() =&gt; signOut()}&gt;
        Sign Out
      &lt;/button&gt;
    &lt;/div&gt;
  );
}

// Protect client component with redirect
export function ProtectedClientComponent() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/auth/signin");
    },
  });

  if (status === "loading") {
    return &lt;div&gt;Loading...&lt;/div&gt;;
  }

  return &lt;div&gt;Protected content for {session.user.name}&lt;/div&gt;;
}
      </code>
    </pre>

    <h2>Session Provider Setup</h2>
    <p>Wrap your app with the SessionProvider:</p>

    <pre class="code-block">
      <code>
// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return &lt;SessionProvider&gt;{children}&lt;/SessionProvider&gt;;
}

// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    &lt;html lang="en"&gt;
      &lt;body&gt;
        &lt;Providers&gt;
          {children}
        &lt;/Providers&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  );
}
      </code>
    </pre>

    <h2>Environment Variables</h2>
    <p>Configure your environment variables:</p>

    <pre class="code-block">
      <code>
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
      </code>
    </pre>

    <h2>Middleware for Route Protection</h2>
    <p>Protect routes at the middleware level:</p>

    <pre class="code-block">
      <code>
// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Check role-based access
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.rewrite(new URL("/unauthorized", req.url));
    }

    if (path.startsWith("/moderator") && 
        !["ADMIN", "MODERATOR"].includes(token?.role as string)) {
      return NextResponse.rewrite(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Specify which routes to protect
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/moderator/:path*",
    "/api/posts/:path*",
  ],
};
      </code>
    </pre>

    <h2>Security Best Practices</h2>
    
    <div class="explanation-list">
      <ul>
        <li><strong>Strong Secrets:</strong> Use at least 32-character random strings for NEXTAUTH_SECRET</li>
        <li><strong>HTTPS Only:</strong> Always use HTTPS in production</li>
        <li><strong>Password Hashing:</strong> Use bcrypt with at least 12 rounds</li>
        <li><strong>JWT Expiration:</strong> Set reasonable token expiration times</li>
        <li><strong>CSRF Protection:</strong> NextAuth.js includes built-in CSRF protection</li>
        <li><strong>Rate Limiting:</strong> Implement rate limiting on auth endpoints</li>
        <li><strong>Input Validation:</strong> Always validate and sanitize user input</li>
        <li><strong>Secure Cookies:</strong> Use httpOnly and secure cookie flags</li>
      </ul>
    </div>

    <h2>Testing Authentication</h2>
    
    <div class="explanation-list">
      <ul>
        <li><strong>POST /api/auth/register:</strong> Register a new user account</li>
        <li><strong>POST /api/auth/signin:</strong> Sign in with credentials</li>
        <li><strong>GET /api/auth/session:</strong> Get current session data</li>
        <li><strong>POST /api/auth/signout:</strong> Sign out and clear session</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Set up NextAuth.js with multiple authentication providers",
    "Implement secure user registration with password hashing",
    "Configure JWT sessions with role-based access control",
    "Protect Server Components and API routes with authentication",
    "Use middleware for route-level protection",
  ],
  practiceInstructions: [
    "Install NextAuth.js and configure Prisma adapter",
    "Set up authentication providers (Credentials, Google, GitHub)",
    "Create user registration API route with password validation",
    "Implement protected pages using requireAuth utility",
    "Add middleware to protect dashboard and admin routes",
  ],
  hints: [
    "Always hash passwords with bcrypt before storing in database",
    "Use getServerSession for server-side authentication checks",
    "Include user role in JWT token for authorization",
    "Test OAuth providers with proper redirect URLs",
    "Set NEXTAUTH_SECRET to a strong random string in production",
  ],
  solution: `// Protected API Route
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Protected logic here
  return NextResponse.json({ 
    message: "Success",
    user: session.user 
  });
}`,
};
