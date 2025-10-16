import React from "react";
import { Server } from "lucide-react";

export const ApiSection = {
  id: "api",
  title: "REST APIs & Handlers",
  icon: <Server className="w-6 h-6" />,
  overview: "Build RESTful APIs with Fiber handlers and routing",
  content: (
    <div className="prose max-w-none">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Learning Objectives:</strong>
              <br />• Create RESTful API endpoints with Fiber
              <br />• Implement CRUD operations with GORM
              <br />• Handle request validation and error responses
              <br />• Structure handlers and organize route groups
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">
        Fiber Server Setup
      </h3>
      <p className="text-slate-700 mb-4">
        Fiber is a fast HTTP web framework inspired by Express.js. It provides
        powerful routing, middleware support, and performance optimizations for
        Go applications.
      </p>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-900 mb-2">
          Main Server (main.go)
        </h4>
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
          <code>{`package main

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
    
    // Create Fiber app
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
    
    // Middleware
    app.Use(cors.New())
    app.Use(logger.New())
    app.Use(recover.New())
    
    // Health check route
    app.Get("/health", func(c *fiber.Ctx) error {
        return c.JSON(fiber.Map{
            "status": "ok",
            "message": "Server is running",
        })
    })
    
    // Setup routes
    routes.SetupRoutes(app)
    
    // Start server
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }
    
    log.Printf("Server starting on port %s", port)
    log.Fatal(app.Listen(":" + port))
}`}</code>
        </pre>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-900 mb-2">
          User Handlers (handlers/user.go)
        </h4>
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
          <code>{`package handlers

import (
    "strconv"
    "go-fiber-api/db"
    "go-fiber-api/models"
    
    "github.com/gofiber/fiber/v2"
)

// GetUsers retrieves all users
func GetUsers(c *fiber.Ctx) error {
    var users []models.User
    
    result := db.DB.Find(&users)
    if result.Error != nil {
        return c.Status(500).JSON(fiber.Map{
            "error": "Failed to fetch users",
        })
    }
    
    // Return public user data
    var publicUsers []map[string]interface{}
    for _, user := range users {
        publicUsers = append(publicUsers, user.Public())
    }
    
    return c.JSON(fiber.Map{
        "users": publicUsers,
        "count": len(users),
    })
}

// GetUser retrieves a single user by ID
func GetUser(c *fiber.Ctx) error {
    id, err := strconv.Atoi(c.Params("id"))
    if err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Invalid user ID",
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

// UpdateUser updates user information
func UpdateUser(c *fiber.Ctx) error {
    id, err := strconv.Atoi(c.Params("id"))
    if err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Invalid user ID",
        })
    }
    
    var user models.User
    result := db.DB.First(&user, id)
    if result.Error != nil {
        return c.Status(404).JSON(fiber.Map{
            "error": "User not found",
        })
    }
    
    // Parse request body
    var updateData struct {
        FirstName string \`json:"first_name"\`
        LastName  string \`json:"last_name"\`
        Email     string \`json:"email"\`
    }
    
    if err := c.BodyParser(&updateData); err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Invalid request body",
        })
    }
    
    // Update fields
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

// DeleteUser soft deletes a user
func DeleteUser(c *fiber.Ctx) error {
    id, err := strconv.Atoi(c.Params("id"))
    if err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Invalid user ID",
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
}`}</code>
        </pre>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-900 mb-2">
          Route Setup (routes/routes.go)
        </h4>
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
          <code>{`package routes

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
    
    // Protected routes
    protected := api.Group("/", middleware.JWTMiddleware())
    
    // User routes
    users := protected.Group("/users")
    users.Get("/", handlers.GetUsers)
    users.Get("/:id", handlers.GetUser)
    users.Put("/:id", handlers.UpdateUser)
    users.Delete("/:id", handlers.DeleteUser)
    
    // Profile routes
    profile := protected.Group("/profile")
    profile.Get("/", handlers.GetProfile)
    profile.Put("/", handlers.UpdateProfile)
}`}</code>
        </pre>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-amber-700">
              <strong>REST API Best Practices:</strong>
              <br />• <strong>HTTP Methods:</strong> GET (read), POST (create),
              PUT (update), DELETE (remove)
              <br />• <strong>Status Codes:</strong> 200 (success), 201
              (created), 400 (bad request), 404 (not found), 500 (server error)
              <br />• <strong>Route Grouping:</strong> Organize related
              endpoints under common prefixes
              <br />• <strong>Middleware:</strong> Apply authentication,
              logging, and CORS at appropriate levels
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-900 mb-2">
          Request Validation Example
        </h4>
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
          <code>{`// Validation struct with tags
type CreateUserRequest struct {
    Username  string \`json:"username" validate:"required,min=3,max=20"\`
    Email     string \`json:"email" validate:"required,email"\`
    Password  string \`json:"password" validate:"required,min=6"\`
    FirstName string \`json:"first_name" validate:"required,min=2"\`
    LastName  string \`json:"last_name" validate:"required,min=2"\`
}

// Usage in handler
func CreateUser(c *fiber.Ctx) error {
    var req CreateUserRequest
    
    if err := c.BodyParser(&req); err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Invalid request format",
        })
    }
    
    // Validate request
    if err := validate.Struct(&req); err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Validation failed",
            "details": err.Error(),
        })
    }
    
    // Process request...
}`}</code>
        </pre>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-green-700">
              <strong>Practice Exercise:</strong>
              <br />
              Implement a complete CRUD API for a &quot;Product&quot; resource
              with handlers for Create, Read, Update, and Delete operations.
              Test all endpoints using Postman or curl.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};
