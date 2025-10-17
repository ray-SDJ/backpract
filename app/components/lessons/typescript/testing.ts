import { LessonData } from "../types";

const testing: LessonData = {
  title: "Testing & Production Deployment",
  difficulty: "Advanced",
  description:
    "Implement comprehensive testing strategies with Jest and Supertest, set up production deployment with Docker, monitoring, and performance optimization for TypeScript applications.",
  objectives: [
    "Set up Jest testing framework with TypeScript configuration",
    "Write unit tests for services and utilities",
    "Create integration tests for API endpoints",
    "Build production Docker containers and deployment pipelines",
    "Implement monitoring, logging, and performance optimization",
  ],
  content: `<div class="lesson-content">
    <h2>Testing & Production Deployment</h2>
    
    <p>Testing ensures code reliability and maintainability, while proper deployment strategies ensure your TypeScript application runs reliably in production. We'll cover comprehensive testing approaches and production-ready deployment configurations.</p>

    <h3>Jest Testing Setup & Configuration</h3>
    
    <pre class="code-block">
      <code>
# Install testing dependencies
npm install -D jest @types/jest ts-jest supertest @types/supertest
npm install -D jest-environment-node @jest/globals

# jest.config.js - Jest configuration for TypeScript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/migrations/**',
    '!src/server.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  testTimeout: 10000,
  maxWorkers: 1, // For database tests
};

// src/tests/setup.ts - Test environment setup
import { AppDataSource } from '../config/database';

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

beforeEach(async () => {
  // Clean database before each test
  const entities = AppDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name);
    await repository.clear();
  }
});

// src/tests/helpers/testHelpers.ts - Testing utilities
import { User, UserRole } from '../entities/User';
import { UserService } from '../services/UserService';
import { JwtService } from '../services/JwtService';

export class TestHelpers {
  private userService: UserService;
  private jwtService: JwtService;

  constructor() {
    this.userService = new UserService();
    this.jwtService = new JwtService();
  }

  async createTestUser(overrides: Partial<User> = {}): Promise<User> {
    const defaultUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: UserRole.USER,
      ...overrides,
    };

    return this.userService.createUser(defaultUser);
  }

  async createAdminUser(): Promise<User> {
    return this.createTestUser({
      name: 'Admin User',
      email: 'admin@example.com',
      role: UserRole.ADMIN,
    });
  }

  generateAuthToken(user: User): string {
    const tokens = this.jwtService.generateTokens(user);
    return tokens.accessToken;
  }

  getAuthHeader(token: string): { Authorization: string } {
    return { Authorization: \`Bearer \${token}\` };
  }
}

export const testHelpers = new TestHelpers();
      </code>
    </pre>

    <h3>Unit Testing Services & Business Logic</h3>
    
    <pre class="code-block">
      <code>
// src/tests/services/UserService.test.ts - Unit tests for UserService
import { UserService } from '../../services/UserService';
import { User, UserRole } from '../../entities/User';
import { testHelpers } from '../helpers/testHelpers';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: UserRole.USER,
      };

      const user = await userService.createUser(userData);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe(userData.role);
      expect(user.password).not.toBe(userData.password); // Should be hashed
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should throw error for duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      await userService.createUser(userData);

      await expect(userService.createUser(userData)).rejects.toThrow(
        'User with this email already exists'
      );
    });

    it('should validate email format', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
      };

      await expect(userService.createUser(userData)).rejects.toThrow();
    });

    it('should validate password length', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123', // Too short
      };

      await expect(userService.createUser(userData)).rejects.toThrow();
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate user with correct credentials', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      await userService.createUser(userData);
      const authenticatedUser = await userService.authenticateUser(
        userData.email,
        userData.password
      );

      expect(authenticatedUser).toBeDefined();
      expect(authenticatedUser.email).toBe(userData.email);
    });

    it('should throw error for incorrect password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      await userService.createUser(userData);

      await expect(
        userService.authenticateUser(userData.email, 'wrongpassword')
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw error for non-existent user', async () => {
      await expect(
        userService.authenticateUser('nonexistent@example.com', 'password')
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      const createdUser = await testHelpers.createTestUser();
      const foundUser = await userService.getUserById(createdUser.id);

      expect(foundUser).toBeDefined();
      expect(foundUser.id).toBe(createdUser.id);
      expect(foundUser.email).toBe(createdUser.email);
    });

    it('should throw error for non-existent user ID', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      await expect(userService.getUserById(nonExistentId)).rejects.toThrow(
        'User not found'
      );
    });
  });

  describe('updateUser', () => {
    it('should update user data', async () => {
      const user = await testHelpers.createTestUser();
      const updateData = { name: 'Updated Name' };

      const updatedUser = await userService.updateUser(user.id, updateData);

      expect(updatedUser.name).toBe(updateData.name);
      expect(updatedUser.id).toBe(user.id);
      expect(updatedUser.email).toBe(user.email);
    });

    it('should validate email format when updating', async () => {
      const user = await testHelpers.createTestUser();
      const updateData = { email: 'invalid-email' };

      await expect(userService.updateUser(user.id, updateData)).rejects.toThrow();
    });
  });
});

// src/tests/services/AuthService.test.ts - Authentication service tests
import { AuthService } from '../../services/AuthService';
import { testHelpers } from '../helpers/testHelpers';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('register', () => {
    it('should register new user and return tokens', async () => {
      const registerData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const result = await authService.register(registerData);

      expect(result.user).toBeDefined();
      expect(result.tokens).toBeDefined();
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
      expect(result.user.email).toBe(registerData.email);
    });

    it('should throw error for password mismatch', async () => {
      const registerData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'differentpassword',
      };

      await expect(authService.register(registerData)).rejects.toThrow(
        'Passwords do not match'
      );
    });
  });

  describe('login', () => {
    it('should login user with correct credentials', async () => {
      const user = await testHelpers.createTestUser();
      const credentials = {
        email: user.email,
        password: 'password123', // This is the default password in testHelpers
      };

      const result = await authService.login(credentials);

      expect(result.user).toBeDefined();
      expect(result.tokens).toBeDefined();
      expect(result.user.id).toBe(user.id);
    });
  });
});
      </code>
    </pre>

    <h3>Integration Testing with Supertest</h3>
    
    <pre class="code-block">
      <code>
// src/tests/integration/auth.test.ts - API integration tests
import request from 'supertest';
import { Application } from 'express';
import App from '../../app';
import { testHelpers } from '../helpers/testHelpers';
import { User } from '../../entities/User';

describe('Authentication API', () => {
  let app: Application;
  let server: any;

  beforeAll(() => {
    const appInstance = new App();
    app = appInstance.app;
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const registerData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(registerData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.user.email).toBe(registerData.email);
      expect(response.body.data.user.name).toBe(registerData.name);
    });

    it('should return validation errors for invalid data', async () => {
      const invalidData = {
        name: '', // Too short
        email: 'invalid-email',
        password: '123', // Too short
        confirmPassword: '456', // Doesn't match
      };

      const response = await request(app)
        .post('/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('should prevent duplicate email registration', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
      };

      // First registration
      await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      // Second registration with same email
      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('POST /auth/login', () => {
    let testUser: User;

    beforeEach(async () => {
      testUser = await testHelpers.createTestUser({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should login with correct credentials', async () => {
      const loginData = {
        email: testUser.email,
        password: 'password123',
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.user.id).toBe(testUser.id);
    });

    it('should reject invalid credentials', async () => {
      const loginData = {
        email: testUser.email,
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Invalid');
    });
  });

  describe('GET /auth/me', () => {
    let testUser: User;
    let authToken: string;

    beforeEach(async () => {
      testUser = await testHelpers.createTestUser();
      authToken = testHelpers.generateAuthToken(testUser);
    });

    it('should return user profile when authenticated', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', \`Bearer \${authToken}\`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.id).toBe(testUser.id);
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/auth/me')
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('token required');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.status).toBe('error');
    });
  });
});

// src/tests/integration/users.test.ts - User API integration tests
import request from 'supertest';
import { Application } from 'express';
import App from '../../app';
import { testHelpers } from '../helpers/testHelpers';

describe('Users API', () => {
  let app: Application;

  beforeAll(() => {
    const appInstance = new App();
    app = appInstance.app;
  });

  describe('GET /api/users', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(401);

      expect(response.body.status).toBe('error');
    });

    it('should return paginated users for authenticated user', async () => {
      const user = await testHelpers.createTestUser();
      const token = testHelpers.generateAuthToken(user);

      const response = await request(app)
        .get('/api/users')
        .set(...Object.entries(testHelpers.getAuthHeader(token))[0])
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.users).toBeDefined();
      expect(response.body.meta).toBeDefined();
      expect(response.body.meta.page).toBe(1);
    });

    it('should handle pagination parameters', async () => {
      const user = await testHelpers.createTestUser();
      const token = testHelpers.generateAuthToken(user);

      const response = await request(app)
        .get('/api/users?page=2&limit=5')
        .set(...Object.entries(testHelpers.getAuthHeader(token))[0])
        .expect(200);

      expect(response.body.meta.page).toBe(2);
      expect(response.body.meta.limit).toBe(5);
    });
  });

  describe('POST /api/users', () => {
    it('should create user with admin privileges', async () => {
      const admin = await testHelpers.createAdminUser();
      const token = testHelpers.generateAuthToken(admin);

      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/users')
        .set(...Object.entries(testHelpers.getAuthHeader(token))[0])
        .send(userData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.user.email).toBe(userData.email);
    });
  });
});
      </code>
    </pre>

    <h3>Production Deployment with Docker</h3>
    
    <pre class="code-block">
      <code>
# Dockerfile - Multi-stage production build
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

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S typescript -u 1001

# Copy built application
COPY --from=builder --chown=typescript:nodejs /app/dist ./dist
COPY --from=builder --chown=typescript:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=typescript:nodejs /app/package*.json ./

# Expose port
EXPOSE 3000

# Switch to non-root user
USER typescript

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node dist/healthcheck.js

# Start application
CMD ["node", "dist/server.js"]

# docker-compose.yml - Complete production setup
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=typescript_app
      - DB_USER=postgres
      - DB_PASSWORD=password
      - JWT_ACCESS_SECRET=your-production-secret
      - JWT_REFRESH_SECRET=your-refresh-secret
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs
    networks:
      - app-network

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=typescript_app
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped
    networks:
      - app-network

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
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge

# nginx.conf - Production reverse proxy
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /health {
            access_log off;
            proxy_pass http://app;
        }
    }
}

# package.json - Production scripts
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "jest --config jest.e2e.config.js",
    "docker:build": "docker build -t typescript-api .",
    "docker:run": "docker-compose up -d",
    "docker:logs": "docker-compose logs -f app",
    "docker:stop": "docker-compose down",
    "production:deploy": "./scripts/deploy.sh"
  }
}

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
docker-compose logs -f app
      </code>
    </pre>

    <p><strong>Production Considerations:</strong> Comprehensive test coverage, containerized deployment, health checks, monitoring, security headers, SSL termination, database migrations, and proper logging ensure reliable production operations.</p>
  </div>`,
  practiceInstructions: [
    "Set up Jest with TypeScript configuration and test database",
    "Write unit tests for services with proper mocking",
    "Create integration tests for API endpoints using Supertest",
    "Build production Docker images with multi-stage builds",
    "Configure Docker Compose with database and reverse proxy",
    "Set up monitoring, logging, and health checks",
  ],
  hints: [
    "Use separate test database to avoid affecting development data",
    "Mock external dependencies in unit tests",
    "Test both success and error scenarios in integration tests",
    "Use non-root user in Docker containers for security",
    "Implement health checks for container orchestration",
  ],
  solution: `# Run test suite
npm test
npm run test:coverage

# Build and deploy production
npm run build
docker-compose -f docker-compose.prod.yml up -d

# Check application health
curl http://localhost/health
docker-compose logs -f app`,
};

export default testing;
