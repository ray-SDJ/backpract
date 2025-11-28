import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Node.js & Express Performance Optimization",
  description:
    "Master Node.js and Express optimization techniques including caching, clustering, database optimization, and async best practices.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <h1 class="text-3xl font-bold mb-6">Node.js & Express Performance Optimization</h1>
    
    <p class="mb-4">Learn advanced optimization techniques to build high-performance, scalable Node.js applications.</p>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🚀 Caching Strategies</h2>
    
    <h3 class="text-xl font-semibold mt-6 mb-3">Redis Caching</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
const express = require('express');
const redis = require('redis');
const { promisify } = require('util');

const app = express();
const client = redis.createClient({
  host: 'localhost',
  port: 6379
});

// Promisify Redis methods
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);

// Cache middleware
const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    const key = \`cache:\${req.originalUrl}\`;
    
    try {
      const cachedData = await getAsync(key);
      
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }
      
      // Store original json function
      res.originalJson = res.json;
      
      // Override json function to cache response
      res.json = function(data) {
        setAsync(key, JSON.stringify(data), 'EX', duration);
        res.originalJson(data);
      };
      
      next();
    } catch (error) {
      next();
    }
  };
};

// Use cache middleware
app.get('/api/users', cacheMiddleware(60), async (req, res) => {
  const users = await User.find();
  res.json({ users });
});

// Manual caching
app.get('/api/products', async (req, res) => {
  const cacheKey = 'products:all';
  
  try {
    const cached = await getAsync(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    const products = await Product.find();
    await setAsync(cacheKey, JSON.stringify(products), 'EX', 300);
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Invalidate cache
async function invalidateProductCache() {
  await delAsync('products:all');
}
      </code>
    </pre>

    <h3 class="text-xl font-semibold mt-6 mb-3">In-Memory Caching with node-cache</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
const NodeCache = require('node-cache');

// Create cache instance
const cache = new NodeCache({
  stdTTL: 300,        // Default TTL: 5 minutes
  checkperiod: 60,    // Check for expired keys every 60 seconds
  useClones: false    // Don't clone objects (faster)
});

// Cache function results
function cacheWrapper(key, ttl, fetchFunction) {
  return async (...args) => {
    const cacheKey = \`\${key}:\${JSON.stringify(args)}\`;
    
    const cached = cache.get(cacheKey);
    if (cached !== undefined) {
      return cached;
    }
    
    const result = await fetchFunction(...args);
    cache.set(cacheKey, result, ttl);
    return result;
  };
}

// Usage
const getUser = cacheWrapper('user', 600, async (userId) => {
  return await User.findById(userId);
});

// With events
cache.on('expired', (key, value) => {
  console.log(\`Cache expired: \${key}\`);
});

cache.on('set', (key, value) => {
  console.log(\`Cache set: \${key}\`);
});
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">⚡ Database Optimization</h2>
    
    <h3 class="text-xl font-semibold mt-6 mb-3">MongoDB Query Optimization</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
const mongoose = require('mongoose');

// BAD: Loading unnecessary data
const users = await User.find();  // Loads everything!

// GOOD: Select only needed fields
const users = await User.find()
  .select('username email')
  .lean();  // Returns plain objects (faster)

// BAD: N+1 Query problem
const posts = await Post.find();
for (const post of posts) {
  const author = await User.findById(post.authorId);  // New query each time!
}

// GOOD: Use populate (single query with join)
const posts = await Post.find()
  .populate('author', 'username email')
  .populate('comments')
  .lean();

// Pagination
const getPosts = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  
  const [posts, total] = await Promise.all([
    Post.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(),
    Post.countDocuments()
  ]);
  
  return {
    posts,
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

// Indexes for performance
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true, unique: true, index: true },
  createdAt: { type: Date, default: Date.now, index: true }
});

// Compound index for common queries
userSchema.index({ email: 1, isActive: 1 });

// Aggregation pipeline (database-level operations)
const getPostStatistics = async () => {
  return await Post.aggregate([
    { $match: { published: true } },
    {
      $group: {
        _id: '$authorId',
        totalPosts: { $sum: 1 },
        avgViews: { $avg: '$viewCount' },
        totalViews: { $sum: '$viewCount' }
      }
    },
    { $sort: { totalPosts: -1 } },
    { $limit: 10 }
  ]);
};

// Bulk operations
const bulkUpdateUsers = async (updates) => {
  const bulkOps = updates.map(({ id, data }) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: data }
    }
  }));
  
  return await User.bulkWrite(bulkOps);
};
      </code>
    </pre>

    <h3 class="text-xl font-semibold mt-6 mb-3">Connection Pooling</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// MongoDB connection with pooling
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,        // Maximum connections in pool
  minPoolSize: 2,         // Minimum connections
  socketTimeoutMS: 45000, // Close sockets after 45 seconds
  serverSelectionTimeoutMS: 5000,
  family: 4               // Use IPv4
});

// PostgreSQL with pg-pool
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'mydb',
  user: 'user',
  password: 'password',
  max: 20,                // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Use pooled connection
app.get('/api/data', async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users');
    res.json(result.rows);
  } finally {
    client.release();  // Return connection to pool
  }
});
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🔄 Clustering & Worker Threads</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// cluster.js - Use all CPU cores
const cluster = require('cluster');
const os = require('os');
const express = require('express');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(\`Master \${process.pid} is running\`);
  
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(\`Worker \${worker.process.pid} died, restarting...\`);
    cluster.fork();
  });
  
} else {
  // Worker process
  const app = express();
  
  app.get('/', (req, res) => {
    res.send(\`Worker \${process.pid} handled request\`);
  });
  
  app.listen(3000, () => {
    console.log(\`Worker \${process.pid} started\`);
  });
}

// Worker threads for CPU-intensive tasks
const { Worker } = require('worker_threads');

function runHeavyTask(data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./heavy-task-worker.js', {
      workerData: data
    });
    
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(\`Worker stopped with code \${code}\`));
      }
    });
  });
}

// heavy-task-worker.js
const { parentPort, workerData } = require('worker_threads');

function fibonacci(n) {
  if (n < 2) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(workerData.n);
parentPort.postMessage(result);
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">⚡ Async Optimization</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// BAD: Sequential execution
async function fetchDataSlow() {
  const users = await User.find();       // Wait
  const posts = await Post.find();       // Wait
  const comments = await Comment.find(); // Wait
  return { users, posts, comments };
}

// GOOD: Parallel execution
async function fetchDataFast() {
  const [users, posts, comments] = await Promise.all([
    User.find(),
    Post.find(),
    Comment.find()
  ]);
  return { users, posts, comments };
}

// Handle errors in parallel
async function fetchWithErrorHandling() {
  const results = await Promise.allSettled([
    fetchUsers(),
    fetchPosts(),
    fetchComments()
  ]);
  
  const data = results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error(\`Request \${index} failed:\`, result.reason);
      return null;
    }
  });
  
  return data;
}

// Limit concurrent operations
async function processBatch(items, batchSize = 5) {
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(item => processItem(item))
    );
    results.push(...batchResults);
  }
  
  return results;
}

// Queue for rate limiting
const pQueue = require('p-queue');
const queue = new pQueue({ concurrency: 3 });

async function processWithQueue(items) {
  return await Promise.all(
    items.map(item => queue.add(() => processItem(item)))
  );
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🌐 Express Middleware Optimization</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// 1. Compression middleware (gzip)
app.use(compression({
  level: 6,              // Compression level (0-9)
  threshold: 1024,       // Only compress if > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// 2. Security headers
app.use(helmet());

// 3. Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // Max 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests, please try again later'
    });
  }
});

app.use('/api/', limiter);

// 4. Static file caching
app.use(express.static('public', {
  maxAge: '1y',           // Cache for 1 year
  etag: true,
  lastModified: true
}));

// 5. JSON parsing with limit
app.use(express.json({ limit: '10mb' }));

// 6. Request timing
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(\`\${req.method} \${req.path} - \${duration}ms\`);
    
    if (duration > 1000) {
      console.warn(\`Slow request: \${req.path} took \${duration}ms\`);
    }
  });
  
  next();
});

// 7. Response caching headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  next();
});
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">📊 Profiling & Monitoring</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// Performance monitoring with clinic
// npm install -g clinic
// clinic doctor -- node app.js

// Memory profiling
const v8 = require('v8');
const { writeHeapSnapshot } = require('v8');

app.get('/debug/heap-snapshot', (req, res) => {
  const filename = writeHeapSnapshot();
  res.json({ snapshot: filename });
});

// Function timing
function measurePerformance(fn, label) {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    console.log(\`\${label}: \${(end - start).toFixed(2)}ms\`);
    return result;
  };
}

// Usage
const timedFetchUsers = measurePerformance(fetchUsers, 'fetchUsers');

// APM with New Relic or AppSignal
require('newrelic');  // Add at top of main file

// Custom metrics
const prometheus = require('prom-client');

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🔧 Stream Processing</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
const fs = require('fs');
const stream = require('stream');
const { pipeline } = require('stream/promises');

// BAD: Load entire file into memory
app.get('/download/slow', (req, res) => {
  const data = fs.readFileSync('large-file.csv');  // Memory intensive!
  res.send(data);
});

// GOOD: Stream file
app.get('/download/fast', (req, res) => {
  const fileStream = fs.createReadStream('large-file.csv');
  fileStream.pipe(res);
});

// Process large datasets with streams
const { Transform } = require('stream');

class ProcessDataStream extends Transform {
  constructor(options) {
    super({ ...options, objectMode: true });
  }
  
  _transform(chunk, encoding, callback) {
    // Process each chunk
    const processed = processData(chunk);
    this.push(processed);
    callback();
  }
}

app.get('/api/export', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  const cursor = User.find().cursor();
  const transform = new ProcessDataStream();
  
  await pipeline(
    cursor,
    transform,
    res
  );
});
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">💡 Best Practices</h2>
    
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-yellow-900 mb-3">✅ Node.js Optimization Checklist</h4>
      <ul class="text-yellow-800 space-y-2">
        <li>• <strong>Use clustering:</strong> Utilize all CPU cores with cluster module</li>
        <li>• <strong>Cache aggressively:</strong> Redis for shared state, in-memory for single instance</li>
        <li>• <strong>Parallel operations:</strong> Use Promise.all() for independent async tasks</li>
        <li>• <strong>Pagination:</strong> Always paginate large datasets</li>
        <li>• <strong>Lean queries:</strong> Use .lean() with Mongoose for better performance</li>
        <li>• <strong>Connection pooling:</strong> Configure appropriate pool sizes</li>
        <li>• <strong>Compression:</strong> Enable gzip compression for responses</li>
        <li>• <strong>Stream large data:</strong> Don't load everything into memory</li>
        <li>• <strong>Rate limiting:</strong> Protect against abuse and DDoS</li>
        <li>• <strong>Monitor production:</strong> Use APM tools to track performance</li>
      </ul>
    </div>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🚀 Production Configuration</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// pm2 ecosystem.config.js
module.exports = {
  apps: [{
    name: 'api',
    script: './app.js',
    instances: 'max',        // Use all CPU cores
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};

// Start with: pm2 start ecosystem.config.js

// Production environment variables
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/prod
REDIS_URL=redis://localhost:6379
LOG_LEVEL=error
MAX_REQUEST_SIZE=10mb
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
      </code>
    </pre>
  </div>`,
  objectives: [
    "Implement Redis caching for Express applications",
    "Use clustering to utilize all CPU cores",
    "Optimize database queries with indexing and lean()",
    "Parallelize async operations with Promise.all()",
    "Configure compression and rate limiting middleware",
    "Profile and monitor application performance",
  ],
  practiceInstructions: [
    "Set up Redis caching middleware for API endpoints",
    "Implement clustering with the cluster module",
    "Add database indexes to frequently queried fields",
    "Replace sequential async calls with Promise.all()",
    "Configure compression and rate limiting",
    "Use PM2 for production deployment",
  ],
  hints: [
    "Use cluster module to create worker processes for each CPU core",
    "Always use .lean() with Mongoose when you don't need document methods",
    "Promise.all() executes operations in parallel, not sequentially",
    "Connection pooling prevents creating new connections on each request",
    "Compression middleware should come before route handlers",
    "Monitor memory usage and restart workers if they exceed limits",
  ],
  solution: `// Complete optimization example

const express = require('express');
const redis = require('redis');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { promisify } = require('util');

const app = express();

// Redis setup
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Middleware
app.use(compression());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Cache middleware
const cache = (duration) => async (req, res, next) => {
  const key = \`cache:\${req.originalUrl}\`;
  const cached = await getAsync(key);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  res.originalJson = res.json;
  res.json = function(data) {
    setAsync(key, JSON.stringify(data), 'EX', duration);
    res.originalJson(data);
  };
  
  next();
};

// Optimized route
app.get('/api/users', cache(60), async (req, res) => {
  const users = await User.find()
    .select('username email')
    .lean();
  res.json({ users });
});

// Parallel operations
app.get('/api/dashboard', async (req, res) => {
  const [users, posts, stats] = await Promise.all([
    User.countDocuments(),
    Post.find().limit(10).lean(),
    getStatistics()
  ]);
  
  res.json({ users, posts, stats });
});

app.listen(3000);`,
};
