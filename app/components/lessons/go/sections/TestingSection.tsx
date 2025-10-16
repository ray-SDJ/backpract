import React from "react";
import { TestTube } from "lucide-react";

export const TestingSection = {
  id: "testing",
  title: "Testing & Deployment",
  icon: <TestTube className="w-6 h-6" />,
  overview: "Write tests and deploy Go applications to production",
  content: (
    <div className="prose max-w-none">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Learning Objectives:</strong>
              <br />• Write unit and integration tests for Go APIs
              <br />• Set up test databases and mock dependencies
              <br />• Deploy Go applications with Docker
              <br />• Configure production environment and monitoring
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">
        Testing Go Applications
      </h3>
      <p className="text-slate-700 mb-4">
        Testing is crucial for maintaining reliable Go applications. We&apos;ll
        cover unit tests, integration tests, and testing strategies for web APIs
        with database interactions.
      </p>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-900 mb-2">
          Unit Tests (handlers/auth_test.go)
        </h4>
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
          <code>{`package handlers

import (
    "bytes"
    "encoding/json"
    "net/http/httptest"
    "testing"
    "go-fiber-api/db"
    "go-fiber-api/models"
    
    "github.com/gofiber/fiber/v2"
    "github.com/stretchr/testify/assert"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
)

func setupTestDB() *gorm.DB {
    // Use in-memory SQLite for testing
    database, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
    database.AutoMigrate(&models.User{})
    return database
}

func TestRegister(t *testing.T) {
    // Setup
    testDB := setupTestDB()
    db.DB = testDB
    
    app := fiber.New()
    app.Post("/register", Register)
    
    // Test data
    registerData := map[string]string{
        "username": "testuser",
        "email":    "test@example.com",
        "password": "password123",
    }
    
    body, _ := json.Marshal(registerData)
    
    // Create request
    req := httptest.NewRequest("POST", "/register", bytes.NewReader(body))
    req.Header.Set("Content-Type", "application/json")
    
    // Execute request
    resp, _ := app.Test(req)
    
    // Assertions
    assert.Equal(t, 201, resp.StatusCode)
    
    // Verify user was created
    var user models.User
    err := testDB.Where("username = ?", "testuser").First(&user).Error
    assert.NoError(t, err)
    assert.Equal(t, "testuser", user.Username)
}

func TestLogin(t *testing.T) {
    // Setup
    testDB := setupTestDB()
    db.DB = testDB
    
    // Create test user
    hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
    user := models.User{
        Username: "testuser",
        Email:    "test@example.com",
        Password: string(hashedPassword),
        IsActive: true,
    }
    testDB.Create(&user)
    
    app := fiber.New()
    app.Post("/login", Login)
    
    // Test data
    loginData := map[string]string{
        "username": "testuser",
        "password": "password123",
    }
    
    body, _ := json.Marshal(loginData)
    
    // Create request
    req := httptest.NewRequest("POST", "/login", bytes.NewReader(body))
    req.Header.Set("Content-Type", "application/json")
    
    // Execute request
    resp, _ := app.Test(req)
    
    // Assertions
    assert.Equal(t, 200, resp.StatusCode)
    
    // Parse response
    var response map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&response)
    
    assert.Contains(t, response, "token")
    assert.Contains(t, response, "user")
}

func TestJWTMiddleware(t *testing.T) {
    // Setup
    testDB := setupTestDB()
    db.DB = testDB
    
    // Create test user
    user := models.User{
        Username: "testuser",
        Email:    "test@example.com",
        IsActive: true,
        Role:     "user",
    }
    testDB.Create(&user)
    
    app := fiber.New()
    
    // Protected route
    protected := app.Group("/", middleware.JWTMiddleware())
    protected.Get("/profile", func(c *fiber.Ctx) error {
        return c.JSON(fiber.Map{"message": "success"})
    })
    
    // Generate valid token
    token, _ := generateJWT(user)
    
    // Test with valid token
    req := httptest.NewRequest("GET", "/profile", nil)
    req.Header.Set("Authorization", "Bearer "+token)
    
    resp, _ := app.Test(req)
    assert.Equal(t, 200, resp.StatusCode)
    
    // Test without token
    req2 := httptest.NewRequest("GET", "/profile", nil)
    resp2, _ := app.Test(req2)
    assert.Equal(t, 401, resp2.StatusCode)
}`}</code>
        </pre>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-900 mb-2">
          Integration Tests (main_test.go)
        </h4>
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
          <code>{`package main

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
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
)

func setupTestApp() *fiber.App {
    // Setup test database
    database, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
    database.AutoMigrate(&models.User{})
    db.DB = database
    
    // Create Fiber app
    app := fiber.New()
    routes.SetupRoutes(app)
    
    return app
}

func TestUserWorkflow(t *testing.T) {
    app := setupTestApp()
    
    // 1. Register user
    registerData := map[string]string{
        "username": "integrationtest",
        "email":    "integration@test.com",
        "password": "password123",
    }
    
    body, _ := json.Marshal(registerData)
    req := httptest.NewRequest("POST", "/api/v1/auth/register", bytes.NewReader(body))
    req.Header.Set("Content-Type", "application/json")
    
    resp, _ := app.Test(req)
    assert.Equal(t, 201, resp.StatusCode)
    
    var registerResp map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&registerResp)
    token := registerResp["token"].(string)
    
    // 2. Get profile
    req2 := httptest.NewRequest("GET", "/api/v1/profile", nil)
    req2.Header.Set("Authorization", "Bearer "+token)
    
    resp2, _ := app.Test(req2)
    assert.Equal(t, 200, resp2.StatusCode)
    
    // 3. Update profile
    updateData := map[string]string{
        "first_name": "Integration",
        "last_name":  "Test",
    }
    
    body3, _ := json.Marshal(updateData)
    req3 := httptest.NewRequest("PUT", "/api/v1/profile", bytes.NewReader(body3))
    req3.Header.Set("Content-Type", "application/json")
    req3.Header.Set("Authorization", "Bearer "+token)
    
    resp3, _ := app.Test(req3)
    assert.Equal(t, 200, resp3.StatusCode)
    
    // 4. Login with updated user
    loginData := map[string]string{
        "username": "integrationtest",
        "password": "password123",
    }
    
    body4, _ := json.Marshal(loginData)
    req4 := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewReader(body4))
    req4.Header.Set("Content-Type", "application/json")
    
    resp4, _ := app.Test(req4)
    assert.Equal(t, 200, resp4.StatusCode)
}`}</code>
        </pre>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-900 mb-2">
          Dockerfile for Production
        </h4>
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
          <code>{`# Build stage
FROM golang:1.21-alpine AS builder

# Set working directory
WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Production stage
FROM alpine:latest

# Install ca-certificates for HTTPS
RUN apk --no-cache add ca-certificates

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \\
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /root/

# Copy binary from builder stage
COPY --from=builder /app/main .

# Change ownership to non-root user
RUN chown appuser:appgroup main

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Run the application
CMD ["./main"]`}</code>
        </pre>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-900 mb-2">
          Docker Compose for Development
        </h4>
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
          <code>{`version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=postgres
      - DB_USER=postgres
      - DB_PASSWORD=password
      - DB_NAME=go_fiber_api
      - DB_PORT=5432
      - JWT_SECRET=super-secret-jwt-key
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: go_fiber_api
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:`}</code>
        </pre>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-900 mb-2">
          Makefile for Development
        </h4>
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
          <code>{`.PHONY: build run test clean docker-build docker-run

# Build the application
build:
	go build -o bin/main main.go

# Run the application
run:
	go run main.go

# Run tests
test:
	go test -v ./...

# Run tests with coverage
test-coverage:
	go test -v -cover ./...

# Format code
fmt:
	go fmt ./...

# Lint code
lint:
	golangci-lint run

# Clean build artifacts
clean:
	rm -rf bin/

# Build Docker image
docker-build:
	docker build -t go-fiber-api .

# Run with Docker Compose
docker-run:
	docker-compose up --build

# Run database migrations
migrate-up:
	migrate -path migrations -database "postgres://postgres:password@localhost:5432/go_fiber_api?sslmode=disable" up

# Rollback database migrations
migrate-down:
	migrate -path migrations -database "postgres://postgres:password@localhost:5432/go_fiber_api?sslmode=disable" down

# Install dependencies
deps:
	go mod tidy
	go mod download

# Run development server with hot reload
dev:
	air`}</code>
        </pre>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-amber-700">
              <strong>Production Deployment Checklist:</strong>
              <br />• <strong>Environment Variables:</strong> Use secure
              environment variables for secrets
              <br />• <strong>HTTPS:</strong> Enable TLS/SSL certificates in
              production
              <br />• <strong>Monitoring:</strong> Set up logging, metrics, and
              health checks
              <br />• <strong>Database:</strong> Use managed database services
              with backups
              <br />• <strong>Security:</strong> Enable rate limiting, CORS, and
              input validation
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-900 mb-2">Running Tests</h4>
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
          <code>{`# Run all tests
go test ./...

# Run tests with verbose output
go test -v ./...

# Run tests with coverage
go test -v -cover ./...

# Run specific test
go test -v ./handlers -run TestRegister

# Run tests with race detection
go test -race ./...

# Generate coverage report
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out`}</code>
        </pre>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-green-700">
              <strong>Practice Exercise:</strong>
              <br />
              Write comprehensive tests for your API endpoints, containerize the
              application with Docker, and deploy it to a cloud platform like
              DigitalOcean or AWS.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};
