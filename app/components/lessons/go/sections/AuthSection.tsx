import React from "react";
import { Shield } from "lucide-react";

export const AuthSection = {
  id: "auth",
  title: "JWT Authentication",
  icon: <Shield className="w-6 h-6" />,
  overview: "Implement secure JWT authentication and authorization",
  content: (
    <div className="prose max-w-none">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Learning Objectives:</strong>
              <br />• Implement JWT-based authentication system
              <br />• Create secure password hashing with bcrypt
              <br />• Build authentication middleware for route protection
              <br />• Handle token refresh and user sessions
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">
        JWT Authentication System
      </h3>
      <p className="text-slate-700 mb-4">
        JSON Web Tokens (JWT) provide a secure way to authenticate users and
        maintain stateless sessions. We&apos;ll implement registration, login,
        and token-based authentication.
      </p>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-900 mb-2">
          Authentication Handlers (handlers/auth.go)
        </h4>
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
          <code>{`package handlers

import (
    "os"
    "time"
    "go-fiber-api/db"
    "go-fiber-api/models"
    
    "github.com/gofiber/fiber/v2"
    "github.com/golang-jwt/jwt/v4"
    "golang.org/x/crypto/bcrypt"
)

type AuthRequest struct {
    Username string \`json:"username" validate:"required"\`
    Email    string \`json:"email" validate:"required,email"\`
    Password string \`json:"password" validate:"required,min=6"\`
}

type LoginRequest struct {
    Username string \`json:"username" validate:"required"\`
    Password string \`json:"password" validate:"required"\`
}

type Claims struct {
    UserID   uint   \`json:"user_id"\`
    Username string \`json:"username"\`
    Role     string \`json:"role"\`
    jwt.RegisteredClaims
}

// Register creates a new user account
func Register(c *fiber.Ctx) error {
    var req AuthRequest
    
    if err := c.BodyParser(&req); err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Invalid request format",
        })
    }
    
    // Check if user already exists
    var existingUser models.User
    if err := db.DB.Where("username = ? OR email = ?", req.Username, req.Email).First(&existingUser).Error; err == nil {
        return c.Status(409).JSON(fiber.Map{
            "error": "User already exists",
        })
    }
    
    // Hash password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        return c.Status(500).JSON(fiber.Map{
            "error": "Failed to hash password",
        })
    }
    
    // Create user
    user := models.User{
        Username: req.Username,
        Email:    req.Email,
        Password: string(hashedPassword),
        IsActive: true,
        Role:     "user",
    }
    
    if err := db.DB.Create(&user).Error; err != nil {
        return c.Status(500).JSON(fiber.Map{
            "error": "Failed to create user",
        })
    }
    
    // Generate JWT token
    token, err := generateJWT(user)
    if err != nil {
        return c.Status(500).JSON(fiber.Map{
            "error": "Failed to generate token",
        })
    }
    
    return c.Status(201).JSON(fiber.Map{
        "message": "User registered successfully",
        "user":    user.Public(),
        "token":   token,
    })
}

// Login authenticates user and returns JWT token
func Login(c *fiber.Ctx) error {
    var req LoginRequest
    
    if err := c.BodyParser(&req); err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Invalid request format",
        })
    }
    
    // Find user
    var user models.User
    if err := db.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
        return c.Status(401).JSON(fiber.Map{
            "error": "Invalid credentials",
        })
    }
    
    // Check password
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
        return c.Status(401).JSON(fiber.Map{
            "error": "Invalid credentials",
        })
    }
    
    // Check if user is active
    if !user.IsActive {
        return c.Status(403).JSON(fiber.Map{
            "error": "Account is disabled",
        })
    }
    
    // Generate JWT token
    token, err := generateJWT(user)
    if err != nil {
        return c.Status(500).JSON(fiber.Map{
            "error": "Failed to generate token",
        })
    }
    
    return c.JSON(fiber.Map{
        "message": "Login successful",
        "user":    user.Public(),
        "token":   token,
    })
}

// generateJWT creates a new JWT token for the user
func generateJWT(user models.User) (string, error) {
    claims := Claims{
        UserID:   user.ID,
        Username: user.Username,
        Role:     user.Role,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
            NotBefore: jwt.NewNumericDate(time.Now()),
        },
    }
    
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    
    jwtSecret := os.Getenv("JWT_SECRET")
    if jwtSecret == "" {
        jwtSecret = "default-secret-key" // Use environment variable in production
    }
    
    return token.SignedString([]byte(jwtSecret))
}

// RefreshToken generates a new JWT token
func RefreshToken(c *fiber.Ctx) error {
    // Get user from context (set by middleware)
    user, ok := c.Locals("user").(models.User)
    if !ok {
        return c.Status(401).JSON(fiber.Map{
            "error": "Unauthorized",
        })
    }
    
    // Generate new token
    token, err := generateJWT(user)
    if err != nil {
        return c.Status(500).JSON(fiber.Map{
            "error": "Failed to generate token",
        })
    }
    
    return c.JSON(fiber.Map{
        "token": token,
    })
}`}</code>
        </pre>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-900 mb-2">
          JWT Middleware (middleware/auth.go)
        </h4>
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
          <code>{`package middleware

import (
    "os"
    "strings"
    "go-fiber-api/db"
    "go-fiber-api/models"
    
    "github.com/gofiber/fiber/v2"
    "github.com/golang-jwt/jwt/v4"
)

type Claims struct {
    UserID   uint   \`json:"user_id"\`
    Username string \`json:"username"\`
    Role     string \`json:"role"\`
    jwt.RegisteredClaims
}

// JWTMiddleware validates JWT tokens
func JWTMiddleware() fiber.Handler {
    return func(c *fiber.Ctx) error {
        // Get Authorization header
        authHeader := c.Get("Authorization")
        if authHeader == "" {
            return c.Status(401).JSON(fiber.Map{
                "error": "Missing authorization header",
            })
        }
        
        // Check Bearer token format
        if !strings.HasPrefix(authHeader, "Bearer ") {
            return c.Status(401).JSON(fiber.Map{
                "error": "Invalid token format",
            })
        }
        
        // Extract token
        tokenString := strings.TrimPrefix(authHeader, "Bearer ")
        
        // Parse and validate token
        token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
            jwtSecret := os.Getenv("JWT_SECRET")
            if jwtSecret == "" {
                jwtSecret = "default-secret-key"
            }
            return []byte(jwtSecret), nil
        })
        
        if err != nil || !token.Valid {
            return c.Status(401).JSON(fiber.Map{
                "error": "Invalid token",
            })
        }
        
        // Extract claims
        claims, ok := token.Claims.(*Claims)
        if !ok {
            return c.Status(401).JSON(fiber.Map{
                "error": "Invalid token claims",
            })
        }
        
        // Get user from database
        var user models.User
        if err := db.DB.First(&user, claims.UserID).Error; err != nil {
            return c.Status(401).JSON(fiber.Map{
                "error": "User not found",
            })
        }
        
        // Check if user is active
        if !user.IsActive {
            return c.Status(403).JSON(fiber.Map{
                "error": "Account is disabled",
            })
        }
        
        // Store user in context
        c.Locals("user", user)
        c.Locals("userID", user.ID)
        c.Locals("userRole", user.Role)
        
        return c.Next()
    }
}

// AdminMiddleware checks if user has admin role
func AdminMiddleware() fiber.Handler {
    return func(c *fiber.Ctx) error {
        role, ok := c.Locals("userRole").(string)
        if !ok || role != "admin" {
            return c.Status(403).JSON(fiber.Map{
                "error": "Admin access required",
            })
        }
        
        return c.Next()
    }
}`}</code>
        </pre>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-900 mb-2">
          Profile Handlers (handlers/profile.go)
        </h4>
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
          <code>{`package handlers

import (
    "go-fiber-api/db"
    "go-fiber-api/models"
    
    "github.com/gofiber/fiber/v2"
    "golang.org/x/crypto/bcrypt"
)

// GetProfile returns current user profile
func GetProfile(c *fiber.Ctx) error {
    user, ok := c.Locals("user").(models.User)
    if !ok {
        return c.Status(401).JSON(fiber.Map{
            "error": "Unauthorized",
        })
    }
    
    return c.JSON(fiber.Map{
        "user": user.Public(),
    })
}

// UpdateProfile updates current user profile
func UpdateProfile(c *fiber.Ctx) error {
    user, ok := c.Locals("user").(models.User)
    if !ok {
        return c.Status(401).JSON(fiber.Map{
            "error": "Unauthorized",
        })
    }
    
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
            "error": "Failed to update profile",
        })
    }
    
    return c.JSON(fiber.Map{
        "message": "Profile updated successfully",
        "user": user.Public(),
    })
}

// ChangePassword updates user password
func ChangePassword(c *fiber.Ctx) error {
    user, ok := c.Locals("user").(models.User)
    if !ok {
        return c.Status(401).JSON(fiber.Map{
            "error": "Unauthorized",
        })
    }
    
    var req struct {
        CurrentPassword string \`json:"current_password" validate:"required"\`
        NewPassword     string \`json:"new_password" validate:"required,min=6"\`
    }
    
    if err := c.BodyParser(&req); err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Invalid request body",
        })
    }
    
    // Verify current password
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.CurrentPassword)); err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Current password is incorrect",
        })
    }
    
    // Hash new password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
    if err != nil {
        return c.Status(500).JSON(fiber.Map{
            "error": "Failed to hash password",
        })
    }
    
    // Update password
    user.Password = string(hashedPassword)
    if err := db.DB.Save(&user).Error; err != nil {
        return c.Status(500).JSON(fiber.Map{
            "error": "Failed to update password",
        })
    }
    
    return c.JSON(fiber.Map{
        "message": "Password updated successfully",
    })
}`}</code>
        </pre>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-amber-700">
              <strong>JWT Security Best Practices:</strong>
              <br />• <strong>Secret Keys:</strong> Use strong, random JWT
              secrets and store them securely
              <br />• <strong>Token Expiration:</strong> Set reasonable
              expiration times (1-24 hours)
              <br />• <strong>Password Hashing:</strong> Always hash passwords
              with bcrypt, never store plaintext
              <br />• <strong>HTTPS:</strong> Always use HTTPS in production to
              protect tokens in transit
            </p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-green-700">
              <strong>Practice Exercise:</strong>
              <br />
              Test the authentication system by registering a new user, logging
              in, and accessing protected routes. Implement role-based access
              control for admin-only endpoints.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};
