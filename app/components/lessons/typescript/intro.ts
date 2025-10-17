import { LessonData } from "../types";

const intro: LessonData = {
  title: "TypeScript Setup & Express Server",
  difficulty: "Beginner",
  description:
    "Set up a TypeScript development environment with Express, learn about type safety, and create your first strongly-typed backend server.",
  objectives: [
    "Install and configure TypeScript with Node.js",
    "Set up Express server with TypeScript types",
    "Understand TypeScript benefits for backend development",
    "Create type-safe API endpoints and middleware",
    "Configure development workflow with ts-node and nodemon",
  ],
  content: `<div class="lesson-content">
    <h2>TypeScript Development Environment</h2>
    
    <p>TypeScript adds static type checking to JavaScript, making your code more robust and maintainable. For backend development, TypeScript provides excellent IDE support, compile-time error detection, and self-documenting interfaces.</p>

    <h3>Project Setup & Configuration</h3>
    
    <p>Let's create a professional TypeScript backend project:</p>

    <pre class="code-block">
      <code>
# Create new TypeScript project
mkdir my-typescript-api && cd my-typescript-api

# Initialize npm project
npm init -y

# Install TypeScript and development dependencies
npm install -D typescript @types/node ts-node nodemon
npm install express cors helmet morgan dotenv
npm install -D @types/express @types/cors

# Create TypeScript configuration
npx tsc --init

# Update tsconfig.json for backend development
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs", 
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
      </code>
    </pre>

    <h3>Express Server with TypeScript Classes</h3>
    
    <pre class="code-block">
      <code>
// src/app.ts - Object-oriented Express setup
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

class App {
  public app: Application;
  private PORT: string | number;

  constructor() {
    this.app = express();
    this.PORT = process.env.PORT || 3000;
    
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    this.app.use(helmet()); // Security headers
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }));
    this.app.use(morgan('combined'));
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'success',
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    });

    // Type-safe API routes
    this.app.get('/api/users', this.getUsers);
    this.app.post('/api/users', this.createUser);
    this.app.get('/api/users/:id', this.getUserById);
  }

  // Type-safe route handlers
  private getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ];

      res.status(200).json({
        status: 'success',
        data: { users },
        message: 'Users retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve users'
      });
    }
  };

  private createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email }: { name: string; email: string } = req.body;

      if (!name || !email) {
        res.status(400).json({
          status: 'error',
          message: 'Name and email are required'
        });
        return;
      }

      const newUser = {
        id: Date.now(),
        name,
        email,
        createdAt: new Date().toISOString()
      };

      res.status(201).json({
        status: 'success',
        data: { user: newUser },
        message: 'User created successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to create user'
      });
    }
  };

  private getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = { id: parseInt(id), name: 'John Doe', email: 'john@example.com' };

      res.status(200).json({
        status: 'success',
        data: { user },
        message: 'User retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'User not found'
      });
    }
  };

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        status: 'error',
        message: 'Route not found'
      });
    });

    // Global error handler
    this.app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('Error:', error.message);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    });
  }

  public listen(): void {
    this.app.listen(this.PORT, () => {
      console.log(\`🚀 Server running on port \${this.PORT}\`);
      console.log(\`📍 Environment: \${process.env.NODE_ENV || 'development'}\`);
    });
  }
}

export default App;

// src/server.ts - Entry point
import App from './app';

const app = new App();
app.listen();
      </code>
    </pre>

    <h3>Development Workflow</h3>
    
    <pre class="code-block">
      <code>
// package.json development scripts
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "type-check": "tsc --noEmit",
    "lint": "eslint src/**/*.ts"
  }
}

// nodemon.json - Auto-reload configuration
{
  "watch": ["src"],
  "ext": "ts,json",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "ts-node src/server.ts"
}

// .env - Environment variables
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/myapp

# Start development server
npm run dev

# Test your API endpoints
curl http://localhost:3000/health
curl http://localhost:3000/api/users
curl -X POST http://localhost:3000/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Alice","email":"alice@example.com"}'
      </code>
    </pre>

    <p><strong>TypeScript Benefits:</strong> Catch errors at compile time, excellent IDE support with autocomplete, self-documenting code with explicit types, easier team collaboration, and gradual adoption from existing JavaScript projects.</p>
  </div>`,
  practiceInstructions: [
    "Create a new TypeScript project with proper tsconfig.json configuration",
    "Install Express and TypeScript type definitions",
    "Build an Express server using TypeScript classes and interfaces",
    "Create type-safe route handlers with proper error handling",
    "Set up development workflow with nodemon and ts-node",
    "Test your API endpoints using curl or Postman",
  ],
  hints: [
    "Use 'strict: true' in tsconfig.json for maximum type safety",
    "Install @types packages for third-party libraries",
    "Use interface definitions for request/response objects",
    "Leverage TypeScript's 'void' return type for Express handlers",
    "Set up proper environment variable typing",
  ],
  solution: `# Complete TypeScript Express setup
npm init -y
npm install -D typescript @types/node ts-node nodemon
npm install express cors helmet morgan dotenv @types/express @types/cors
npx tsc --init

# Start development server
npm run dev

# Test endpoints
curl http://localhost:3000/health
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"name":"Test","email":"test@example.com"}'`,
};

export default intro;
