import React from "react";
import { Code } from "lucide-react";

interface CodeExplanationProps {
  code: string;
  explanation: Array<{ label: string; desc: string }>;
}

const CodeExplanation: React.FC<CodeExplanationProps> = ({
  code,
  explanation,
}) => (
  <div className="mt-4 space-y-3">
    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
      <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
    </div>
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-semibold text-blue-900 mb-3">Code Explanation:</h4>
      <div className="space-y-2">
        {explanation.map((item, index) => (
          <div key={index} className="flex gap-3">
            <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono whitespace-nowrap">
              {item.label}
            </code>
            <span className="text-blue-700 text-sm">{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const IntroSection = {
  id: "intro",
  title: "TypeScript Setup & Express Server",
  icon: Code,
  overview:
    "Set up TypeScript development environment and create your first Express server",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">
          TypeScript Development Environment
        </h3>
        <p className="text-gray-700 mb-3">
          TypeScript adds static type checking to JavaScript, catching errors at
          compile time and providing better IDE support for large applications.
        </p>
        <CodeExplanation
          code={`# Create new TypeScript project
mkdir my-typescript-api
cd my-typescript-api

# Initialize npm project
npm init -y

# Install TypeScript and development dependencies
npm install -D typescript @types/node ts-node nodemon
npm install express cors helmet morgan dotenv
npm install -D @types/express @types/cors

# Create TypeScript configuration
npx tsc --init

# Update tsconfig.json
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
}`}
          explanation={[
            {
              label: "typescript",
              desc: "Core TypeScript compiler for type checking and compilation",
            },
            {
              label: "@types/node",
              desc: "Type definitions for Node.js built-in modules",
            },
            {
              label: "ts-node",
              desc: "Direct execution of TypeScript files without compilation step",
            },
            {
              label: "strict: true",
              desc: "Enables all strict type checking options for better code quality",
            },
            {
              label: "outDir/rootDir",
              desc: "Specifies output directory for compiled JS and source directory",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">
          Express Server with TypeScript
        </h3>
        <CodeExplanation
          code={`// src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
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
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }));
    
    // Logging and parsing
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

    // API routes
    this.app.get('/api/users', this.getUsers);
    this.app.post('/api/users', this.createUser);
    this.app.get('/api/users/:id', this.getUserById);
  }

  private getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      // Simulate database call
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

      // Validation
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
      
      // Simulate finding user
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

// src/server.ts
import App from './app';

const app = new App();
app.listen();`}
          explanation={[
            {
              label: "class App",
              desc: "Object-oriented approach for organizing Express application structure",
            },
            {
              label: "Request, Response, NextFunction",
              desc: "TypeScript interfaces from Express for type-safe route handlers",
            },
            {
              label: "private initializeMiddleware()",
              desc: "Class method to set up middleware with proper encapsulation",
            },
            {
              label: "helmet()",
              desc: "Security middleware that sets various HTTP headers",
            },
            {
              label: "arrow functions with types",
              desc: "Route handlers as class methods with explicit return types",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">
          Development Scripts & Environment
        </h3>
        <CodeExplanation
          code={`// package.json scripts
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "type-check": "tsc --noEmit",
    "lint": "eslint src/**/*.ts",
    "test": "jest"
  }
}

// .env file
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/myapp

// nodemon.json
{
  "watch": ["src"],
  "ext": "ts,json",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "ts-node src/server.ts"
}

// Start development server
npm run dev

// Test endpoints
curl http://localhost:3000/health
curl http://localhost:3000/api/users
curl -X POST http://localhost:3000/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Alice","email":"alice@example.com"}'`}
          explanation={[
            {
              label: "nodemon",
              desc: "Automatically restarts server when files change during development",
            },
            {
              label: "ts-node",
              desc: "Executes TypeScript directly without compilation step",
            },
            {
              label: "type-check",
              desc: "Validates TypeScript without generating JavaScript files",
            },
            {
              label: ".env",
              desc: "Environment variables for configuration management",
            },
            {
              label: "nodemon.json",
              desc: "Configuration for file watching and automatic restart",
            },
          ]}
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">
          🎯 TypeScript Benefits
        </h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Catch errors at compile time instead of runtime</li>
          <li>• Better IDE support with autocomplete and refactoring</li>
          <li>• Self-documenting code with explicit types</li>
          <li>• Easier team collaboration with type contracts</li>
          <li>• Gradual adoption - works with existing JavaScript</li>
        </ul>
      </div>
    </div>
  ),
};
