import React from "react";
import { TestTube2, Code, Zap } from "lucide-react";

interface CodeExplanationProps {
  code: string;
  explanation: Array<{ label: string; desc: string }>;
}

const CodeExplanation: React.FC<CodeExplanationProps> = ({
  code,
  explanation,
}) => (
  <div className="bg-slate-50 rounded-lg p-4 mb-6">
    <pre className="text-sm overflow-x-auto mb-4 bg-slate-900 text-slate-100 p-4 rounded">
      <code>{code}</code>
    </pre>
    <div className="grid gap-3">
      {explanation.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <strong className="text-slate-800">{item.label}:</strong>
            <span className="text-slate-600 ml-1">{item.desc}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const TestingSection = {
  id: "testing",
  title: "Testing & Performance Optimization",
  icon: TestTube2,
  overview:
    "Comprehensive testing strategies and performance optimization techniques",
  content: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-3">
          🧪 Testing & Performance Optimization
        </h3>
        <p className="text-green-800 leading-relaxed">
          Master comprehensive testing strategies including unit tests,
          integration tests, and API testing. Learn performance optimization
          techniques, monitoring, and deployment strategies for production-ready
          Node.js applications.
        </p>
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <TestTube2 className="w-5 h-5 text-green-400" />
          <h4 className="text-white font-semibold">
            Testing Setup & Configuration
          </h4>
        </div>

        <CodeExplanation
          code={`# Install testing dependencies
npm install -D jest supertest @types/jest @types/supertest
npm install -D mongodb-memory-server cross-env

# Optional: Additional testing tools
npm install -D nyc  # Code coverage
npm install -D eslint-plugin-jest  # ESLint rules for Jest

# package.json test scripts
{
  "scripts": {
    "test": "cross-env NODE_ENV=test jest",
    "test:watch": "cross-env NODE_ENV=test jest --watch",
    "test:coverage": "cross-env NODE_ENV=test nyc jest",
    "test:integration": "cross-env NODE_ENV=test jest --testPathPattern=integration",
    "test:unit": "cross-env NODE_ENV=test jest --testPathPattern=unit"
  }
}

// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/**/*.spec.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/**',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  verbose: true,
  forceExit: true,
  clearMocks: true
};

// tests/setup.js - Global test setup
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;

// Setup before all tests
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

// Cleanup after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

// Clear database between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});`}
          explanation={[
            {
              label: "Jest framework",
              desc: "Popular JavaScript testing framework with built-in assertions",
            },
            {
              label: "Supertest",
              desc: "HTTP testing library for testing Express applications",
            },
            {
              label: "MongoDB Memory Server",
              desc: "In-memory MongoDB instance for isolated test database",
            },
            {
              label: "Coverage thresholds",
              desc: "Enforce minimum code coverage requirements",
            },
            {
              label: "Test isolation",
              desc: "Clean database state between tests for reliable results",
            },
          ]}
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-blue-400" />
          <h4 className="text-white font-semibold">
            Unit & Integration Testing
          </h4>
        </div>

        <CodeExplanation
          code={`// tests/unit/userService.test.js - Unit testing
const userService = require('../../src/services/userService');
const User = require('../../src/models/User');

// Mock the User model
jest.mock('../../src/models/User');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    test('should create user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const mockUser = {
        _id: 'user123',
        ...userData,
        createdAt: new Date()
      };

      User.create.mockResolvedValue(mockUser);

      const result = await userService.createUser(userData);

      expect(User.create).toHaveBeenCalledWith(userData);
      expect(result).toMatchObject(mockUser);
    });

    test('should throw error for duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'password123'
      };

      User.create.mockRejectedValue(new Error('Email already exists'));

      await expect(userService.createUser(userData)).rejects.toThrow('Email already exists');
    });
  });

  describe('getUserById', () => {
    test('should return user when found', async () => {
      const userId = 'user123';
      const mockUser = {
        _id: userId,
        name: 'John Doe',
        email: 'john@example.com'
      };

      User.findById.mockResolvedValue(mockUser);

      const result = await userService.getUserById(userId);

      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    test('should return null when user not found', async () => {
      const userId = 'nonexistent';
      
      User.findById.mockResolvedValue(null);

      const result = await userService.getUserById(userId);

      expect(result).toBeNull();
    });
  });
});

// tests/integration/auth.test.js - Integration testing
const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');

describe('Authentication Integration', () => {
  describe('POST /api/auth/register', () => {
    test('should register new user successfully', async () => {
      const userData = {
        name: 'Integration Test User',
        email: 'integration@test.com',
        password: 'TestPass123!',
        confirmPassword: 'TestPass123!'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.accessToken).toBeDefined();

      // Verify user was created in database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeDefined();
      expect(user.name).toBe(userData.name);
    });

    test('should reject registration with invalid data', async () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
        password: 'weak'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.details).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    let testUser;

    beforeEach(async () => {
      testUser = await User.create({
        name: 'Test User',
        email: 'login@test.com',
        password: 'TestPass123!'
      });
    });

    test('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@test.com',
          password: 'TestPass123!'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.accessToken).toBeDefined();
    });

    test('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@test.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid email or password');
    });
  });
});

// tests/integration/users.test.js - Protected route testing
describe('Users API Integration', () => {
  let authToken;
  let testUser;

  beforeEach(async () => {
    // Create test user and get auth token
    testUser = await User.create({
      name: 'API Test User',
      email: 'api@test.com',
      password: 'TestPass123!'
    });

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'api@test.com',
        password: 'TestPass123!'
      });

    authToken = loginResponse.body.data.accessToken;
  });

  describe('GET /api/users', () => {
    test('should return users for authenticated request', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', \`Bearer \${authToken}\`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toBeDefined();
    });

    test('should reject unauthenticated request', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});`}
          explanation={[
            {
              label: "Jest mocking",
              desc: "Mock dependencies to isolate unit tests from external systems",
            },
            {
              label: "Test data setup",
              desc: "Create predictable test data with beforeEach hooks",
            },
            {
              label: "HTTP testing",
              desc: "Test full request-response cycle with Supertest",
            },
            {
              label: "Database verification",
              desc: "Verify data persistence and state changes",
            },
            {
              label: "Error scenarios",
              desc: "Test both success and failure cases comprehensively",
            },
          ]}
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h4 className="text-white font-semibold">Performance Optimization</h4>
        </div>

        <CodeExplanation
          code={`// src/middleware/performance.js
const compression = require('compression');
const redis = require('redis');
const NodeCache = require('node-cache');

// Setup Redis for distributed caching
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD
});

// Fallback to in-memory cache if Redis unavailable
const memoryCache = new NodeCache({ stdTTL: 600 });

// Intelligent caching middleware
exports.smartCache = (duration = 300, useRedis = false) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = \`cache:\${req.originalUrl}\`;
    
    try {
      let cachedData;
      
      if (useRedis && redisClient.connected) {
        cachedData = await redisClient.get(key);
        if (cachedData) {
          return res.json(JSON.parse(cachedData));
        }
      } else {
        cachedData = memoryCache.get(key);
        if (cachedData) {
          return res.json(cachedData);
        }
      }

      // Store original res.json
      const originalJson = res.json;
      
      res.json = function(data) {
        // Cache successful responses only
        if (res.statusCode === 200) {
          if (useRedis && redisClient.connected) {
            redisClient.setex(key, duration, JSON.stringify(data));
          } else {
            memoryCache.set(key, data, duration);
          }
        }
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Cache error:', error);
      next();
    }
  };
};

// Database query optimization
exports.optimizeQuery = (Model) => {
  return {
    // Efficient pagination with cursor-based pagination for large datasets
    paginateCursor: async (query, cursor = null, limit = 20) => {
      if (cursor) {
        query = query.where('_id').gt(cursor);
      }
      
      const items = await query.limit(limit + 1).sort({ _id: 1 }).lean();
      const hasNext = items.length > limit;
      
      if (hasNext) items.pop();
      
      return {
        items,
        hasNext,
        nextCursor: hasNext ? items[items.length - 1]._id : null
      };
    },

    // Aggregation pipeline optimization
    aggregateWithIndex: (pipeline, options = {}) => {
      // Ensure $match stages come first for index utilization
      const optimizedPipeline = [];
      const matchStages = [];
      const otherStages = [];
      
      pipeline.forEach(stage => {
        if (stage.$match) {
          matchStages.push(stage);
        } else {
          otherStages.push(stage);
        }
      });
      
      return Model.aggregate([...matchStages, ...otherStages], {
        allowDiskUse: true,
        ...options
      });
    }
  };
};

// Request/Response optimization
exports.responseOptimization = (req, res, next) => {
  // Enable gzip compression
  compression()(req, res, () => {
    // Set optimal cache headers
    if (req.method === 'GET') {
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
    }
    
    // Add response time header
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      res.set('X-Response-Time', \`\${duration}ms\`);
      
      // Log slow requests
      if (duration > 1000) {
        console.warn(\`Slow request: \${req.method} \${req.originalUrl} took \${duration}ms\`);
      }
    });
    
    next();
  });
};

// Memory usage monitoring
const v8 = require('v8');
const process = require('process');

exports.memoryMonitor = {
  getMemoryUsage: () => {
    const heapStats = v8.getHeapStatistics();
    const processMemory = process.memoryUsage();
    
    return {
      heap: {
        used: Math.round(heapStats.used_heap_size / 1024 / 1024),
        total: Math.round(heapStats.total_heap_size / 1024 / 1024),
        limit: Math.round(heapStats.heap_size_limit / 1024 / 1024)
      },
      process: {
        rss: Math.round(processMemory.rss / 1024 / 1024),
        heapUsed: Math.round(processMemory.heapUsed / 1024 / 1024),
        external: Math.round(processMemory.external / 1024 / 1024)
      }
    };
  },

  // Garbage collection monitoring
  startGCMonitoring: () => {
    const PerformanceObserver = require('perf_hooks').PerformanceObserver;
    
    const obs = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log(\`GC: \${entry.name} took \${entry.duration}ms\`);
      });
    });
    
    obs.observe({ entryTypes: ['gc'] });
  }
};

// Load testing with autocannon (for CI/CD)
// tests/load/api.load.test.js
const autocannon = require('autocannon');

describe('Load Testing', () => {
  test('API should handle concurrent requests', async () => {
    const result = await autocannon({
      url: 'http://localhost:3000/api/health',
      connections: 10,
      duration: 10,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(result.errors).toBe(0);
    expect(result.statusCodeStats['200']).toBeGreaterThan(0);
    expect(result.latency.mean).toBeLessThan(100); // Average response time under 100ms
  });

  test('Database queries should be optimized', async () => {
    const start = Date.now();
    
    const result = await autocannon({
      url: 'http://localhost:3000/api/users?limit=50',
      connections: 5,
      duration: 5,
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });

    const duration = Date.now() - start;
    
    expect(result.latency.p95).toBeLessThan(500); // 95th percentile under 500ms
    expect(result.throughput.mean).toBeGreaterThan(10); // At least 10 requests/sec
  });
});`}
          explanation={[
            {
              label: "Multi-tier caching",
              desc: "Redis for distributed caching, memory cache as fallback",
            },
            {
              label: "Query optimization",
              desc: "Cursor-based pagination and aggregation pipeline optimization",
            },
            {
              label: "Response compression",
              desc: "Gzip compression and optimal cache headers",
            },
            {
              label: "Performance monitoring",
              desc: "Memory usage and garbage collection monitoring",
            },
            {
              label: "Load testing",
              desc: "Automated performance testing with Autocannon",
            },
          ]}
        />
      </div>

      <div className="bg-slate-900 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <TestTube2 className="w-5 h-5 text-purple-400" />
          <h4 className="text-white font-semibold">CI/CD & Deployment</h4>
        </div>

        <CodeExplanation
          code={`# .github/workflows/ci.yml - GitHub Actions CI/CD
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:5.0
        ports:
          - 27017:27017
      redis:
        image: redis:6.2
        ports:
          - 6379:6379

    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]

    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js \$\{\{ matrix.node-version \}\}
      uses: actions/setup-node@v3
      with:
        node-version: \$\{\{ matrix.node-version \}\}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm test
      env:
        NODE_ENV: test
        MONGODB_URI: mongodb://localhost:27017/test
        REDIS_HOST: localhost
        JWT_SECRET: test-secret-key-32-characters-long
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Generate coverage report
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3

  security:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run security audit
      run: npm audit --audit-level high
    
    - name: Run SAST scan
      uses: github/super-linter@v4
      env:
        DEFAULT_BRANCH: main
        GITHUB_TOKEN: \$\{\{ secrets.GITHUB_TOKEN \}\}

  build-and-deploy:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Docker image
      run: |
        docker build -t my-api:latest .
        docker tag my-api:latest my-api:\$\{\{ github.sha \}\}
    
    - name: Deploy to staging
      run: |
        # Deploy to staging environment
        echo "Deploying to staging..."
        # Add your deployment commands here

# Dockerfile for production
FROM node:18-alpine AS base

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src/ ./src/

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /usr/src/app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["node", "src/server.js"]

# docker-compose.yml for local development
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/myapp
      - REDIS_HOST=redis
    depends_on:
      - mongo
      - redis
    volumes:
      - ./logs:/usr/src/app/logs

  mongo:
    image: mongo:5.0
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123

  redis:
    image: redis:6.2-alpine
    restart: always
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

volumes:
  mongo_data:
  redis_data:

# Production monitoring with PM2
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'my-api',
    script: 'src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_restarts: 10,
    min_uptime: '10s'
  }],

  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:username/repo.git',
      path: '/var/www/production',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};`}
          explanation={[
            {
              label: "GitHub Actions",
              desc: "Automated CI/CD pipeline with testing and deployment",
            },
            {
              label: "Multi-node testing",
              desc: "Test across multiple Node.js versions for compatibility",
            },
            {
              label: "Security scanning",
              desc: "Automated security audits and static analysis",
            },
            {
              label: "Docker deployment",
              desc: "Containerized application with health checks",
            },
            {
              label: "PM2 clustering",
              desc: "Production-ready process management with clustering",
            },
          ]}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">35 min</div>
          <div className="text-slate-600">Testing Setup</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">30 min</div>
          <div className="text-slate-600">Performance Optimization</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">25 min</div>
          <div className="text-slate-600">CI/CD & Deployment</div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">
          🚀 Production Best Practices
        </h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>
            • Implement comprehensive testing at all levels (unit, integration,
            e2e)
          </li>
          <li>
            • Use performance monitoring and optimize based on real metrics
          </li>
          <li>
            • Set up automated CI/CD pipelines with proper security scanning
          </li>
          <li>
            • Containerize applications for consistent deployment environments
          </li>
          <li>• Monitor application health and performance in production</li>
          <li>
            • Implement proper logging, error tracking, and alerting systems
          </li>
        </ul>
      </div>
    </div>
  ),
};
