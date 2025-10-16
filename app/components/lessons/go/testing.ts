import { LessonData } from "../types";

const testing: LessonData = {
  title: "Testing & Production Deployment",
  difficulty: "Advanced",
  description:
    "Master testing strategies for Go applications with unit tests, integration tests, and mocking. Learn Docker containerization and production deployment with monitoring and security best practices.",
  objectives: [
    "Write comprehensive unit and integration tests for Go APIs",
    "Set up test databases and mock external dependencies",
    "Containerize Go applications with Docker for consistent deployment",
    "Deploy to production with proper monitoring, logging, and security",
  ],
  content: `
    <div class="lesson-content">
      <h2>Testing & Production Deployment</h2>
      
      <div class="info-box">
        <h3>What You'll Learn</h3>
        <p>Testing ensures code reliability and helps prevent bugs in production. You'll learn to write effective tests, containerize applications with Docker, and deploy securely to production environments.</p>
      </div>

      <h3>1. Unit Testing Setup</h3>
      <p>Set up comprehensive unit tests for your Go handlers:</p>
      
      <div class="code-example">
        <h4>handlers/auth_test.go - Authentication Tests</h4>
        <pre><code>package handlers

import (
    "bytes"
    "encoding/json"
    "net/http/httptest"
    "testing"
    "go-fiber-api/db"
    "go-fiber-api/models"
    
    "github.com/gofiber/fiber/v2"
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/require"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
    "golang.org/x/crypto/bcrypt"
)

// setupTestDB creates an in-memory SQLite database for testing
func setupTestDB() *gorm.DB {
    database, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
    if err != nil {
        panic("Failed to connect to test database")
    }
    
    // Auto-migrate test models
    database.AutoMigrate(&models.User{})
    
    return database
}

// setupTestApp creates a Fiber app for testing
func setupTestApp() *fiber.App {
    app := fiber.New()
    
    // Setup test database
    db.DB = setupTestDB()
    
    return app
}

func TestRegister(t *testing.T) {
    app := setupTestApp()
    app.Post("/register", Register)
    
    tests := []struct {
        name       string
        payload    map[string]string
        expectCode int
        expectErr  bool
    }{
        {
            name: "Valid Registration",
            payload: map[string]string{
                "username":   "testuser",
                "email":      "test@example.com",
                "password":   "password123",
                "first_name": "Test",
                "last_name":  "User",
            },
            expectCode: 201,
            expectErr:  false,
        },
        {
            name: "Duplicate Username", 
            payload: map[string]string{
                "username":   "testuser", // Same as above
                "email":      "different@example.com",
                "password":   "password123",
                "first_name": "Another",
                "last_name":  "User",
            },
            expectCode: 409,
            expectErr:  true,
        },
        {
            name: "Invalid Email",
            payload: map[string]string{
                "username":   "newuser",
                "email":      "invalid-email",
                "password":   "password123", 
                "first_name": "Test",
                "last_name":  "User",
            },
            expectCode: 400,
            expectErr:  true,
        },
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            body, _ := json.Marshal(tt.payload)
            
            req := httptest.NewRequest("POST", "/register", bytes.NewReader(body))
            req.Header.Set("Content-Type", "application/json")
            
            resp, _ := app.Test(req)
            
            assert.Equal(t, tt.expectCode, resp.StatusCode)
            
            if !tt.expectErr {
                // Verify user was created in database
                var user models.User
                err := db.DB.Where("username = ?", tt.payload["username"]).First(&user).Error
                require.NoError(t, err)
                assert.Equal(t, tt.payload["username"], user.Username)
            }
        })
    }
}

func TestLogin(t *testing.T) {
    app := setupTestApp()
    app.Post("/login", Login)
    
    // Create test user
    hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
    user := models.User{
        Username: "testuser",
        Email:    "test@example.com",
        Password: string(hashedPassword),
        IsActive: true,
        Role:     "user",
    }
    db.DB.Create(&user)
    
    tests := []struct {
        name       string
        username   string
        password   string
        expectCode int
    }{
        {
            name:       "Valid Login",
            username:   "testuser",
            password:   "password123",
            expectCode: 200,
        },
        {
            name:       "Invalid Password",
            username:   "testuser", 
            password:   "wrongpassword",
            expectCode: 401,
        },
        {
            name:       "Non-existent User",
            username:   "nonexistent",
            password:   "password123",
            expectCode: 401,
        },
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            payload := map[string]string{
                "username": tt.username,
                "password": tt.password,
            }
            
            body, _ := json.Marshal(payload)
            req := httptest.NewRequest("POST", "/login", bytes.NewReader(body))
            req.Header.Set("Content-Type", "application/json")
            
            resp, _ := app.Test(req)
            
            assert.Equal(t, tt.expectCode, resp.StatusCode)
            
            if tt.expectCode == 200 {
                var response map[string]interface{}
                json.NewDecoder(resp.Body).Decode(&response)
                
                assert.Contains(t, response, "token")
                assert.Contains(t, response, "user")
            }
        })
    }
}</code></pre>
      </div>

      <h3>2. Integration Testing</h3>
      <p>Test complete workflows across multiple endpoints:</p>
      
      <div class="code-example">
        <h4>main_test.go - Integration Tests</h4>
        <pre><code>package main

import (
    "bytes"
    "encoding/json"
    "net/http/httptest"
    "testing"
    "go-fiber-api/db"
    "go-fiber-api/models"
    "go-fiber-api/routes"
    
    "github.com/gofiber/fiber/v2"
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/require"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
)

func setupIntegrationTest() (*fiber.App, func()) {
    // Setup in-memory database
    database, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
    database.AutoMigrate(&models.User{})
    db.DB = database
    
    // Create Fiber app with routes
    app := fiber.New()
    routes.SetupRoutes(app)
    
    // Return cleanup function
    cleanup := func() {
        sqlDB, _ := database.DB()
        sqlDB.Close()
    }
    
    return app, cleanup
}

func TestCompleteUserWorkflow(t *testing.T) {
    app, cleanup := setupIntegrationTest()
    defer cleanup()
    
    // Step 1: Register new user
    registerData := map[string]string{
        "username":   "integrationtest",
        "email":      "integration@test.com",
        "password":   "securepass123",
        "first_name": "Integration",
        "last_name":  "Test",
    }
    
    body, _ := json.Marshal(registerData)
    req := httptest.NewRequest("POST", "/api/v1/auth/register", bytes.NewReader(body))
    req.Header.Set("Content-Type", "application/json")
    
    resp, err := app.Test(req)
    require.NoError(t, err)
    assert.Equal(t, 201, resp.StatusCode)
    
    // Extract token from registration response
    var registerResp map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&registerResp)
    token := registerResp["token"].(string)
    
    // Step 2: Access protected profile endpoint
    req2 := httptest.NewRequest("GET", "/api/v1/profile", nil)
    req2.Header.Set("Authorization", "Bearer "+token)
    
    resp2, err := app.Test(req2)
    require.NoError(t, err)
    assert.Equal(t, 200, resp2.StatusCode)
    
    // Step 3: Update profile information
    updateData := map[string]string{
        "first_name": "Updated",
        "last_name":  "Name",
    }
    
    body3, _ := json.Marshal(updateData)
    req3 := httptest.NewRequest("PUT", "/api/v1/profile", bytes.NewReader(body3))
    req3.Header.Set("Content-Type", "application/json")
    req3.Header.Set("Authorization", "Bearer "+token)
    
    resp3, err := app.Test(req3)
    require.NoError(t, err)
    assert.Equal(t, 200, resp3.StatusCode)
    
    // Step 4: Verify profile was updated
    req4 := httptest.NewRequest("GET", "/api/v1/profile", nil)
    req4.Header.Set("Authorization", "Bearer "+token)
    
    resp4, err := app.Test(req4)
    require.NoError(t, err)
    
    var profileResp map[string]interface{}
    json.NewDecoder(resp4.Body).Decode(&profileResp)
    
    user := profileResp["user"].(map[string]interface{})
    assert.Equal(t, "Updated", user["first_name"])
    assert.Equal(t, "Name", user["last_name"])
}

func TestUnauthorizedAccess(t *testing.T) {
    app, cleanup := setupIntegrationTest()
    defer cleanup()
    
    // Try to access protected endpoint without token
    req := httptest.NewRequest("GET", "/api/v1/profile", nil)
    resp, _ := app.Test(req)
    assert.Equal(t, 401, resp.StatusCode)
    
    // Try with invalid token
    req2 := httptest.NewRequest("GET", "/api/v1/profile", nil)
    req2.Header.Set("Authorization", "Bearer invalid-token")
    resp2, _ := app.Test(req2)
    assert.Equal(t, 401, resp2.StatusCode)
}</code></pre>
      </div>

      <h3>3. Docker Containerization</h3>
      <p>Create production-ready Docker configuration:</p>
      
      <div class="code-example">
        <h4>Dockerfile - Multi-stage Build</h4>
        <pre><code># Build stage
FROM golang:1.21-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git ca-certificates tzdata

# Set working directory
WORKDIR /app

# Copy go modules files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \\
    -ldflags='-w -s -extldflags "-static"' \\
    -a -installsuffix cgo -o main .

# Production stage
FROM alpine:latest

# Install runtime dependencies
RUN apk --no-cache add ca-certificates tzdata

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \\
    adduser -u 1001 -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy binary from builder stage
COPY --from=builder /app/main .

# Copy timezone data
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Set environment
ENV GIN_MODE=release
ENV PORT=8080

# Run the application
CMD ["./main"]</code></pre>
      </div>

      <h3>4. Docker Compose Development</h3>
      <p>Complete development environment with databases:</p>
      
      <div class="code-example">
        <h4>docker-compose.yml - Full Stack</h4>
        <pre><code>version: '3.8'

services:
  app:
    build: 
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=postgres
      - DB_USER=postgres
      - DB_PASSWORD=secretpassword
      - DB_NAME=go_fiber_api
      - DB_PORT=5432
      - JWT_SECRET=super-secret-jwt-key-change-in-production
      - REDIS_URL=redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - app-network

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: go_fiber_api
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secretpassword
      POSTGRES_INITDB_ARGS: "--auth-host=scram-sha-256"
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d go_fiber_api"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes --requirepass redispassword
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - app-network

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

networks:
  app-network:
    driver: bridge</code></pre>
      </div>

      <h3>5. Production Deployment</h3>
      <p>Deploy securely with proper configuration management:</p>
      
      <div class="code-example">
        <h4>Production Environment Setup</h4>
        <pre><code># Production docker-compose.prod.yml
version: '3.8'

services:
  app:
    image: your-registry/go-fiber-api:latest
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=\${DB_HOST}
      - DB_USER=\${DB_USER}
      - DB_PASSWORD=\${DB_PASSWORD}
      - DB_NAME=\${DB_NAME}
      - JWT_SECRET=\${JWT_SECRET}
      - REDIS_URL=\${REDIS_URL}
    env_file:
      - .env.production
    restart: always
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

# Production environment variables (.env.production)
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=your-secure-production-password
DB_NAME=go_fiber_api_prod
JWT_SECRET=your-256-bit-secret-key-here
REDIS_URL=your-redis-production-url
PORT=8080
GIN_MODE=release</code></pre>
      </div>

      <h3>6. Monitoring & Logging</h3>
      <p>Implement comprehensive monitoring for production:</p>
      
      <div class="code-example">
        <h4>Production Monitoring Setup</h4>
        <pre><code>// Add to main.go - Structured logging
import (
    "github.com/rs/zerolog"
    "github.com/rs/zerolog/log"
)

func setupLogging() {
    // Configure structured logging
    zerolog.TimeFieldFormat = time.RFC3339
    log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stdout})
    
    // Set log level based on environment
    if os.Getenv("GIN_MODE") == "release" {
        zerolog.SetGlobalLevel(zerolog.InfoLevel)
    } else {
        zerolog.SetGlobalLevel(zerolog.DebugLevel)
    }
}

// Prometheus metrics middleware
func prometheusMiddleware() fiber.Handler {
    return func(c *fiber.Ctx) error {
        start := time.Now()
        
        err := c.Next()
        
        // Record metrics
        duration := time.Since(start)
        status := c.Response().StatusCode()
        method := c.Method()
        path := c.Route().Path
        
        log.Info().
            Str("method", method).
            Str("path", path).
            Int("status", status).
            Dur("duration", duration).
            Msg("HTTP request completed")
        
        return err
    }
}</code></pre>
      </div>

      <h3>7. Security Checklist</h3>
      <div class="info-box">
        <h4>🔒 Production Security Checklist</h4>
        <ul>
          <li><strong>Environment Variables:</strong> Never hardcode secrets, use secure environment management</li>
          <li><strong>HTTPS:</strong> Enable TLS/SSL with valid certificates</li>
          <li><strong>Rate Limiting:</strong> Implement rate limiting to prevent abuse</li>
          <li><strong>CORS:</strong> Configure proper CORS policies</li>
          <li><strong>Input Validation:</strong> Validate and sanitize all user inputs</li>
          <li><strong>Database Security:</strong> Use connection pooling, prepared statements</li>
          <li><strong>Monitoring:</strong> Set up logging, metrics, and alerting</li>
        </ul>
      </div>

      <div class="tip-box">
        <h4>🚀 Deployment Tip</h4>
        <p>Use CI/CD pipelines for automated testing and deployment. Implement blue-green deployments for zero-downtime updates in production environments.</p>
      </div>
    </div>
  `,
  practiceInstructions: [
    "Write comprehensive unit tests for your authentication and user handlers",
    "Create integration tests that test complete user workflows",
    "Build Docker containers and test the application in containerized environment",
    "Deploy the application to a cloud platform with proper monitoring",
  ],
  hints: [
    "Use in-memory SQLite database for testing to avoid external dependencies",
    "Mock external services and databases in unit tests for isolation",
    "Test both success and error scenarios in your test cases",
    "Use multi-stage Docker builds to create smaller, more secure production images",
  ],
  solution: `# Complete testing and deployment solution:

# 1. Run unit tests
go test -v ./handlers

# 2. Run all tests with coverage
go test -v -cover ./...

# 3. Generate coverage report
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out

# 4. Build and test Docker container
docker build -t go-fiber-api .
docker run -d -p 8080:8080 --name test-api go-fiber-api

# 5. Test containerized application
curl http://localhost:8080/health

# 6. Deploy with docker-compose
docker-compose -f docker-compose.prod.yml up -d

# The application should be fully tested, containerized, and ready for production deployment with proper monitoring and security measures.`,
};

export default testing;
