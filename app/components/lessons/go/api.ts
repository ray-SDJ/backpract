import { LessonData } from "../types";

const api: LessonData = {
  title: "REST APIs with Fiber",
  difficulty: "Intermediate",
  description:
    "Build comprehensive RESTful APIs using the Fiber web framework. Learn to create CRUD endpoints, handle request validation, implement proper error responses, and organize routes effectively.",
  objectives: [
    "Create RESTful API endpoints with Fiber framework",
    "Implement CRUD operations with GORM database integration",
    "Handle request validation and structured error responses",
    "Organize routes with groups and middleware",
  ],
  content: `
    <div class="lesson-content">
      <h2>Building REST APIs with Fiber</h2>
      
      <div class="info-box">
        <h3>What You'll Learn</h3>
        <p>Fiber is a fast, Express.js-inspired web framework for Go. You'll master creating RESTful APIs with proper HTTP methods, status codes, and response formatting for professional web services.</p>
      </div>

      <h3>1. Fiber Server Setup</h3>
      <p>Configure the main Fiber application with essential middleware:</p>
      
      <div class="code-example">
        <h4>main.go - Server Configuration</h4>
        <pre><code>package main

import (
    "log"
    "os"
    "go-fiber-api/db"
    "go-fiber-api/routes"
    
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/cors"
    "github.com/gofiber/fiber/v2/middleware/logger"
    "github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
    // Initialize database
    db.ConnectDB()
    
    // Create Fiber app with error handling
    app := fiber.New(fiber.Config{
        ErrorHandler: func(c *fiber.Ctx, err error) error {
            code := fiber.StatusInternalServerError
            if e, ok := err.(*fiber.Error); ok {
                code = e.Code
            }
            return c.Status(code).JSON(fiber.Map{
                "error": err.Error(),
            })
        },
    })
    
    // Apply middleware
    app.Use(cors.New())
    app.Use(logger.New())
    app.Use(recover.New())
    
    // Health check endpoint
    app.Get("/health", func(c *fiber.Ctx) error {
        return c.JSON(fiber.Map{
            "status": "ok",
            "message": "Server is running",
        })
    })
    
    // Setup API routes
    routes.SetupRoutes(app)
    
    // Start server
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }
    
    log.Printf("Server starting on port %s", port)
    log.Fatal(app.Listen(":" + port))
}</code></pre>
      </div>

      <h3>2. User API Handlers</h3>
      <p>Implement comprehensive CRUD operations for users:</p>
      
      <div class="code-example">
        <h4>handlers/user.go - User Operations</h4>
        <pre><code>package handlers

import (
    "strconv"
    "go-fiber-api/db"
    "go-fiber-api/models"
    
    "github.com/gofiber/fiber/v2"
)

// GetUsers retrieves all users with pagination
func GetUsers(c *fiber.Ctx) error {
    var users []models.User
    
    // Parse query parameters
    page, _ := strconv.Atoi(c.Query("page", "1"))
    limit, _ := strconv.Atoi(c.Query("limit", "10"))
    offset := (page - 1) * limit
    
    // Query with pagination
    result := db.DB.Offset(offset).Limit(limit).Find(&users)
    if result.Error != nil {
        return c.Status(500).JSON(fiber.Map{
            "error": "Failed to fetch users",
        })
    }
    
    // Get total count
    var total int64
    db.DB.Model(&models.User{}).Count(&total)
    
    // Return public user data
    var publicUsers []map[string]interface{}
    for _, user := range users {
        publicUsers = append(publicUsers, user.Public())
    }
    
    return c.JSON(fiber.Map{
        "users": publicUsers,
        "pagination": fiber.Map{
            "page":  page,
            "limit": limit,
            "total": total,
        },
    })
}

// GetUser retrieves a single user by ID
func GetUser(c *fiber.Ctx) error {
    id, err := strconv.Atoi(c.Params("id"))
    if err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Invalid user ID format",
        })
    }
    
    var user models.User
    result := db.DB.First(&user, id)
    if result.Error != nil {
        return c.Status(404).JSON(fiber.Map{
            "error": "User not found",
        })
    }
    
    return c.JSON(fiber.Map{
        "user": user.Public(),
    })
}

// UpdateUser modifies user information
func UpdateUser(c *fiber.Ctx) error {
    id, err := strconv.Atoi(c.Params("id"))
    if err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Invalid user ID format",
        })
    }
    
    var user models.User
    result := db.DB.First(&user, id)
    if result.Error != nil {
        return c.Status(404).JSON(fiber.Map{
            "error": "User not found",
        })
    }
    
    // Parse and validate request body
    var updateData struct {
        FirstName string \`json:"first_name" validate:"omitempty,min=2,max=50"\`
        LastName  string \`json:"last_name" validate:"omitempty,min=2,max=50"\`
        Email     string \`json:"email" validate:"omitempty,email"\`
    }
    
    if err := c.BodyParser(&updateData); err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Invalid request body format",
        })
    }
    
    // Update non-empty fields
    if updateData.FirstName != "" {
        user.FirstName = updateData.FirstName
    }
    if updateData.LastName != "" {
        user.LastName = updateData.LastName
    }
    if updateData.Email != "" {
        user.Email = updateData.Email
    }
    
    // Save changes
    if err := db.DB.Save(&user).Error; err != nil {
        return c.Status(500).JSON(fiber.Map{
            "error": "Failed to update user",
        })
    }
    
    return c.JSON(fiber.Map{
        "message": "User updated successfully",
        "user": user.Public(),
    })
}

// DeleteUser performs soft delete on user
func DeleteUser(c *fiber.Ctx) error {
    id, err := strconv.Atoi(c.Params("id"))
    if err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Invalid user ID format",
        })
    }
    
    result := db.DB.Delete(&models.User{}, id)
    if result.Error != nil {
        return c.Status(500).JSON(fiber.Map{
            "error": "Failed to delete user",
        })
    }
    
    if result.RowsAffected == 0 {
        return c.Status(404).JSON(fiber.Map{
            "error": "User not found",
        })
    }
    
    return c.JSON(fiber.Map{
        "message": "User deleted successfully",
    })
}</code></pre>
      </div>

      <h3>3. Route Organization</h3>
      <p>Structure your routes with groups and middleware:</p>
      
      <div class="code-example">
        <h4>routes/routes.go - Route Configuration</h4>
        <pre><code>package routes

import (
    "go-fiber-api/handlers"
    "go-fiber-api/middleware"
    
    "github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
    // API v1 group
    api := app.Group("/api/v1")
    
    // Authentication routes (public)
    auth := api.Group("/auth")
    auth.Post("/register", handlers.Register)
    auth.Post("/login", handlers.Login)
    auth.Post("/refresh", handlers.RefreshToken)
    
    // Protected routes requiring authentication
    protected := api.Group("/", middleware.JWTMiddleware())
    
    // User management routes
    users := protected.Group("/users")
    users.Get("/", handlers.GetUsers)        // GET /api/v1/users
    users.Get("/:id", handlers.GetUser)      // GET /api/v1/users/:id
    users.Put("/:id", handlers.UpdateUser)   // PUT /api/v1/users/:id
    users.Delete("/:id", handlers.DeleteUser) // DELETE /api/v1/users/:id
    
    // Profile management routes
    profile := protected.Group("/profile")
    profile.Get("/", handlers.GetProfile)    // GET /api/v1/profile
    profile.Put("/", handlers.UpdateProfile) // PUT /api/v1/profile
    profile.Post("/change-password", handlers.ChangePassword)
    
    // Admin-only routes
    admin := protected.Group("/admin", middleware.AdminMiddleware())
    admin.Get("/users", handlers.GetAllUsersAdmin)
    admin.Put("/users/:id/status", handlers.UpdateUserStatus)
}</code></pre>
      </div>

      <h3>4. Request Validation</h3>
      <p>Implement proper request validation for data integrity:</p>
      
      <div class="code-example">
        <h4>Validation Example</h4>
        <pre><code>// Install validation package
// go get github.com/go-playground/validator/v10

package handlers

import (
    "github.com/go-playground/validator/v10"
    "github.com/gofiber/fiber/v2" 
)

var validate = validator.New()

type CreateUserRequest struct {
    Username  string \`json:"username" validate:"required,min=3,max=20,alphanum"\`
    Email     string \`json:"email" validate:"required,email"\`
    Password  string \`json:"password" validate:"required,min=8"\`
    FirstName string \`json:"first_name" validate:"required,min=2,max=50"\`
    LastName  string \`json:"last_name" validate:"required,min=2,max=50"\`
}

func CreateUser(c *fiber.Ctx) error {
    var req CreateUserRequest
    
    // Parse request body
    if err := c.BodyParser(&req); err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Invalid request format",
        })
    }
    
    // Validate request data
    if err := validate.Struct(&req); err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Validation failed",
            "details": err.Error(),
        })
    }
    
    // Process valid request...
    return c.JSON(fiber.Map{
        "message": "User created successfully",
    })
}</code></pre>
      </div>

      <h3>5. HTTP Status Codes</h3>
      <div class="info-box">
        <h4>REST API Status Codes</h4>
        <ul>
          <li><strong>200 OK:</strong> Successful GET, PUT requests</li>
          <li><strong>201 Created:</strong> Successful POST requests</li>
          <li><strong>400 Bad Request:</strong> Invalid request data</li>
          <li><strong>401 Unauthorized:</strong> Authentication required</li>
          <li><strong>403 Forbidden:</strong> Permission denied</li>
          <li><strong>404 Not Found:</strong> Resource doesn't exist</li>
          <li><strong>500 Internal Server Error:</strong> Server errors</li>
        </ul>
      </div>

      <h3>6. Testing Your API</h3>
      <p>Test endpoints using curl commands:</p>
      
      <div class="code-example">
        <h4>API Testing Commands</h4>
        <pre><code># Test health endpoint
curl http://localhost:8080/health

# Get all users (requires authentication)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
     http://localhost:8080/api/v1/users

# Get specific user
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
     http://localhost:8080/api/v1/users/1

# Update user
curl -X PUT \\
     -H "Content-Type: application/json" \\
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
     -d '{"first_name":"John","last_name":"Doe"}' \\
     http://localhost:8080/api/v1/users/1</code></pre>
      </div>

      <div class="tip-box">
        <h4>🚀 Performance Tip</h4>
        <p>Use pagination for list endpoints to avoid loading large datasets. Implement caching for frequently accessed data and consider database indexing for better query performance.</p>
      </div>
    </div>
  `,
  practiceInstructions: [
    "Implement the main.go server setup with Fiber configuration and middleware",
    "Create user CRUD handlers in handlers/user.go with proper error handling",
    "Set up route groups in routes/routes.go with authentication middleware",
    "Test all endpoints using curl or Postman to verify functionality",
  ],
  hints: [
    "Use fiber.Map{} for consistent JSON responses throughout your API",
    "Implement pagination with OFFSET and LIMIT for list endpoints",
    "Always validate input data before processing database operations",
    "Use proper HTTP status codes to indicate success, client errors, and server errors",
  ],
  solution: `# Complete API implementation with testing:

# 1. Start your server
go run main.go

# 2. Test health endpoint
curl http://localhost:8080/health

# Expected response:
# {"status":"ok","message":"Server is running"}

# 3. After implementing authentication and getting a JWT token:
export TOKEN="your_jwt_token_here"

# 4. Test user endpoints
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/v1/users
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/v1/users/1

# The API should return properly formatted JSON responses with appropriate status codes`,
};

export default api;
