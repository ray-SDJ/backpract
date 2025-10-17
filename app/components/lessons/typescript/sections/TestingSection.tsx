import React from "react";
import { TestTube } from "lucide-react";

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

export const TestingSection = {
  id: "testing",
  title: "Jest Testing & Production Deployment",
  icon: TestTube,
  overview:
    "Write comprehensive tests with Jest and deploy TypeScript applications to production",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">Jest Testing Setup</h3>
        <p className="text-gray-700 mb-3">
          Set up Jest with TypeScript for unit testing, integration testing, and
          API endpoint testing.
        </p>
        <CodeExplanation
          code={`# Install Jest and testing dependencies
npm install -D jest @types/jest ts-jest supertest @types/supertest
npm install -D jest-environment-node

# Initialize Jest configuration
npx ts-jest config:init

# jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/*.(test|spec).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/config/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  testTimeout: 10000,
};

# Package.json scripts
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}

// src/tests/setup.ts
import { AppDataSource } from '../config/database';

// Global test setup
beforeAll(async () => {
  // Initialize test database connection
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

afterAll(async () => {
  // Close database connection
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

// Mock external services
jest.mock('../services/EmailService', () => ({
  EmailService: {
    sendWelcomeEmail: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  },
}));`}
          explanation={[
            {
              label: "preset: 'ts-jest'",
              desc: "Jest preset for TypeScript compilation and execution",
            },
            {
              label: "testMatch patterns",
              desc: "Glob patterns to find test files in the project",
            },
            {
              label: "collectCoverageFrom",
              desc: "Specifies which files to include in coverage reports",
            },
            {
              label: "setupFilesAfterEnv",
              desc: "Runs setup code before each test file",
            },
            {
              label: "jest.mock()",
              desc: "Mocks external dependencies for isolated testing",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">Unit Testing Services</h3>
        <CodeExplanation
          code={`// src/tests/services/UserService.test.ts
import { UserService } from '../../services/UserService';
import { UserRepository } from '../../repositories/UserRepository';
import { User } from '../../entities/User';
import bcrypt from 'bcrypt';

// Mock dependencies
jest.mock('../../repositories/UserRepository');
jest.mock('bcrypt');

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Create service instance
    userService = new UserService();
    
    // Get mocked repository
    mockUserRepository = jest.mocked(new UserRepository());
    (userService as any).userRepository = mockUserRepository;
  });

  describe('createUser', () => {
    it('should create user with hashed password', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const expectedUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      // Mock bcrypt.hash
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      
      // Mock repository create
      mockUserRepository.create.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: 'hashedPassword',
      });
      expect(result).toEqual(expectedUser);
    });

    it('should throw error if user creation fails', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockUserRepository.create.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(userService.createUser(userData)).rejects.toThrow('Database error');
    });
  });

  describe('authenticateUser', () => {
    it('should return user for valid credentials', async () => {
      // Arrange
      const email = 'john@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedPassword';

      const user = {
        id: 1,
        email,
        password: hashedPassword,
        isActive: true,
      } as User;

      mockUserRepository.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await userService.authenticateUser(email, password);

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toEqual(user);
    });

    it('should return null for invalid credentials', async () => {
      // Arrange
      const email = 'john@example.com';
      const password = 'wrongpassword';
      
      const user = {
        id: 1,
        email,
        password: 'hashedPassword',
      } as User;

      mockUserRepository.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await userService.authenticateUser(email, password);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null if user not found', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act
      const result = await userService.authenticateUser('nonexistent@example.com', 'password');

      // Assert
      expect(result).toBeNull();
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });
});

// src/tests/services/JwtService.test.ts
import { JwtService } from '../../services/JwtService';
import jwt from 'jsonwebtoken';

// Mock jsonwebtoken
jest.mock('jsonwebtoken');

describe('JwtService', () => {
  let jwtService: JwtService;
  const mockSecret = 'test-secret';

  beforeEach(() => {
    process.env.JWT_SECRET = mockSecret;
    jwtService = new JwtService();
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate token with correct payload', () => {
      // Arrange
      const payload = {
        userId: 1,
        email: 'test@example.com',
        role: 'user' as const,
      };

      const expectedToken = 'generated.jwt.token';
      (jwt.sign as jest.Mock).mockReturnValue(expectedToken);

      // Act
      const result = jwtService.generateToken(payload);

      // Assert
      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        mockSecret,
        expect.objectContaining({
          expiresIn: expect.any(String),
          issuer: 'typescript-api',
          audience: 'typescript-client',
        })
      );
      expect(result).toBe(expectedToken);
    });
  });

  describe('verifyToken', () => {
    it('should return payload for valid token', () => {
      // Arrange
      const token = 'valid.jwt.token';
      const expectedPayload = {
        userId: 1,
        email: 'test@example.com',
        role: 'user',
        iat: 1234567890,
        exp: 1234567999,
      };

      (jwt.verify as jest.Mock).mockReturnValue(expectedPayload);

      // Act
      const result = jwtService.verifyToken(token);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(
        token,
        mockSecret,
        expect.objectContaining({
          issuer: 'typescript-api',
          audience: 'typescript-client',
        })
      );
      expect(result).toEqual(expectedPayload);
    });

    it('should return null for invalid token', () => {
      // Arrange
      const token = 'invalid.jwt.token';
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.JsonWebTokenError('invalid token');
      });

      // Act
      const result = jwtService.verifyToken(token);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for expired token', () => {
      // Arrange
      const token = 'expired.jwt.token';
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.TokenExpiredError('token expired', new Date());
      });

      // Act
      const result = jwtService.verifyToken(token);

      // Assert
      expect(result).toBeNull();
    });
  });
});`}
          explanation={[
            {
              label: "jest.mocked()",
              desc: "TypeScript helper to get typed mock objects",
            },
            {
              label: "beforeEach(() => { jest.clearAllMocks() })",
              desc: "Resets mock call history before each test",
            },
            {
              label: "mockResolvedValue()",
              desc: "Mocks async function to return resolved promise",
            },
            {
              label: "expect().toHaveBeenCalledWith()",
              desc: "Asserts function was called with specific arguments",
            },
            {
              label: "await expect().rejects.toThrow()",
              desc: "Tests that async function throws expected error",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">
          Integration Testing with Supertest
        </h3>
        <CodeExplanation
          code={`// src/tests/integration/auth.test.ts
import request from 'supertest';
import { App } from '../../app';
import { AppDataSource } from '../../config/database';
import { User } from '../../entities/User';

describe('Authentication Endpoints', () => {
  let app: Express.Application;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    // Initialize test database
    await AppDataSource.initialize();
    userRepository = AppDataSource.getRepository(User);
    
    // Create app instance
    const appInstance = new App();
    app = appInstance.app;
  });

  beforeEach(async () => {
    // Clean database before each test
    await userRepository.clear();
  });

  afterAll(async () => {
    // Close database connection
    await AppDataSource.destroy();
  });

  describe('POST /api/auth/register', () => {
    it('should register new user successfully', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };

      // Act
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Assert
      expect(response.body).toMatchObject({
        status: 'success',
        message: 'User registered successfully',
        data: {
          user: {
            name: userData.name,
            email: userData.email,
            role: 'user',
          },
          token: expect.any(String),
          refreshToken: expect.any(String),
        },
      });

      // Verify user was created in database
      const createdUser = await userRepository.findOne({
        where: { email: userData.email },
      });
      expect(createdUser).toBeTruthy();
      expect(createdUser!.name).toBe(userData.name);
    });

    it('should return validation error for invalid data', async () => {
      // Arrange
      const invalidUserData = {
        name: 'A', // Too short
        email: 'invalid-email', // Invalid format
        password: '123', // Too weak
      };

      // Act
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUserData)
        .expect(400);

      // Assert
      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Validation failed',
        errors: expect.arrayContaining([
          expect.stringContaining('Name must be'),
          expect.stringContaining('Must be a valid email'),
          expect.stringContaining('Password must be'),
        ]),
      });
    });

    it('should return conflict error for duplicate email', async () => {
      // Arrange - Create existing user
      const existingUser = userRepository.create({
        name: 'Existing User',
        email: 'test@example.com',
        password: 'hashedPassword',
      });
      await userRepository.save(existingUser);

      const duplicateUserData = {
        name: 'New User',
        email: 'test@example.com', // Same email
        password: 'Password123!',
      };

      // Act
      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateUserData)
        .expect(409);

      // Assert
      expect(response.body).toMatchObject({
        status: 'error',
        message: 'User with this email already exists',
      });
    });
  });

  describe('POST /api/auth/login', () => {
    let testUser: User;

    beforeEach(async () => {
      // Create test user
      testUser = userRepository.create({
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('Password123!', 12),
        isActive: true,
      });
      await userRepository.save(testUser);
    });

    it('should login with valid credentials', async () => {
      // Arrange
      const loginData = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      // Assert
      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Login successful',
        data: {
          user: {
            id: testUser.id,
            name: testUser.name,
            email: testUser.email,
            role: testUser.role,
          },
          token: expect.any(String),
          refreshToken: expect.any(String),
        },
      });
    });

    it('should reject invalid credentials', async () => {
      // Arrange
      const invalidLoginData = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidLoginData)
        .expect(401);

      // Assert
      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Invalid email or password',
      });
    });
  });

  describe('Protected Routes', () => {
    let authToken: string;
    let testUser: User;

    beforeEach(async () => {
      // Create user and get auth token
      testUser = userRepository.create({
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('Password123!', 12),
        isActive: true,
      });
      await userRepository.save(testUser);

      // Login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
        });

      authToken = loginResponse.body.data.token;
    });

    it('should access protected route with valid token', async () => {
      // Act
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', \`Bearer \${authToken}\`)
        .expect(200);

      // Assert
      expect(response.body.data.user.id).toBe(testUser.id);
    });

    it('should reject access without token', async () => {
      // Act
      const response = await request(app)
        .get('/api/users/me')
        .expect(401);

      // Assert
      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Authorization header is required',
      });
    });

    it('should reject access with invalid token', async () => {
      // Act
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', 'Bearer invalid.jwt.token')
        .expect(401);

      // Assert
      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Invalid or expired token',
      });
    });
  });
});`}
          explanation={[
            {
              label: "request(app).post().send()",
              desc: "Supertest method for making HTTP requests to Express app",
            },
            {
              label: ".expect(201)",
              desc: "Asserts HTTP status code and automatically fails test if wrong",
            },
            {
              label: "toMatchObject()",
              desc: "Jest matcher that checks object contains expected properties",
            },
            {
              label: "beforeEach database cleanup",
              desc: "Ensures clean state for each test by clearing data",
            },
            {
              label: "expect.any(String)",
              desc: "Jest matcher for asserting type without checking exact value",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">Production Deployment</h3>
        <CodeExplanation
          code={`# Production build process
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S typescript -u 1001

WORKDIR /app

# Copy built application
COPY --from=builder --chown=typescript:nodejs /app/dist ./dist
COPY --from=builder --chown=typescript:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=typescript:nodejs /app/package*.json ./

# Switch to non-root user
USER typescript

EXPOSE 3000

CMD ["node", "dist/server.js"]

# docker-compose.production.yml
version: '3.8'

services:
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: \${DB_NAME}
      POSTGRES_USER: \${DB_USER}
      POSTGRES_PASSWORD: \${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${DB_USER} -d \${DB_NAME}"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    environment:
      NODE_ENV: production
      DATABASE_URL: postgres://\${DB_USER}:\${DB_PASSWORD}@db:5432/\${DB_NAME}
      REDIS_URL: redis://redis:6379
      JWT_SECRET: \${JWT_SECRET}
      JWT_REFRESH_SECRET: \${JWT_REFRESH_SECRET}
    ports:
      - "3000:3000"
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:

# Deploy to cloud platforms
# Heroku
echo "web: node dist/server.js" > Procfile

# Deploy commands
heroku create typescript-api-production
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=\$(openssl rand -hex 32)
heroku config:set JWT_REFRESH_SECRET=\$(openssl rand -hex 32)
git push heroku main

# AWS ECS / Digital Ocean / Railway deployment
# CI/CD Pipeline with GitHub Actions
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Run tests
        run: npm run test:ci
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/test_db
      
      - name: Build application
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        run: |
          # Deploy to your chosen platform
          echo "Deploying to production..."

# Performance optimization
# src/config/production.ts
export const productionConfig = {
  // Database connection pooling
  database: {
    max: 20,
    min: 5,
    acquire: 30000,
    idle: 10000,
  },
  
  // Redis configuration
  redis: {
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    lazyConnect: true,
  },
  
  // Rate limiting
  rateLimiting: {
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
  },
  
  // CORS
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    credentials: true,
  },
};`}
          explanation={[
            {
              label: "Multi-stage Dockerfile",
              desc: "Builds app in one stage, copies to production image for smaller size",
            },
            {
              label: "healthcheck configuration",
              desc: "Docker health checks for container orchestration",
            },
            {
              label: "depends_on: service_healthy",
              desc: "Waits for dependencies to be healthy before starting",
            },
            {
              label: "GitHub Actions CI/CD",
              desc: "Automated testing and deployment pipeline",
            },
            {
              label: "connection pooling",
              desc: "Database connection optimization for production load",
            },
          ]}
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">
          🚀 Production Checklist
        </h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Comprehensive test coverage (unit, integration, e2e)</li>
          <li>• Type checking and linting in CI pipeline</li>
          <li>• Docker containerization with health checks</li>
          <li>• Environment variable configuration</li>
          <li>• Database migrations and connection pooling</li>
          <li>• Monitoring, logging, and error tracking</li>
        </ul>
      </div>
    </div>
  ),
};
