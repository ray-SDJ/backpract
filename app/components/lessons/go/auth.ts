import { LessonData } from "../types";

const auth: LessonData = {
  title: "JWT Authentication & Security",
  difficulty: "Advanced",
  description:
    "Implement secure JWT-based authentication system with password hashing, token validation, and role-based access control. Master authentication middleware and session management.",
  objectives: [
    "Implement JWT-based authentication with secure token generation",
    "Create password hashing and verification with bcrypt",
    "Build authentication middleware for route protection",
    "Handle token refresh and role-based authorization",
  ],
  content: `
    <div class="lesson-content">
      <h2>JWT Authentication System</h2>
      
      <div class="info-box">
        <h3>What You'll Learn</h3>
        <p>JSON Web Tokens (JWT) provide secure, stateless authentication for web APIs. You'll implement a complete authentication system with registration, login, password security, and protected routes.</p>
      </div>

      <h3>1. Authentication Handlers</h3>
      <p>Build secure registration and login endpoints:</p>
      
      <div class="code-example">
        <h4>handlers/auth.go - Authentication Logic</h4>
        <pre><code>package handlers

import (
    "os"
    "time"
    "go-fiber-api/db"
    "go-fiber-api/models"
    
    "github.com/gofiber/fiber/v2"
    "github.com/golang-jwt/jwt/v4"
    "golang.org/x/crypto/bcrypt"
)

type Claims struct {
    UserID   uint   \`json:"user_id"\`
    Username string \`json:"username"\`
    Role     string \`json:"role"\`
    jwt.RegisteredClaims
}

type RegisterRequest struct {
    Username  string \`json:"username" validate:"required,min=3,max=20"\`
    Email     string \`json:"email" validate:"required,email"\`
    Password  string \`json:"password" validate:"required,min=8"\`
    FirstName string \`json:"first_name" validate:"required,min=2"\`
    LastName  string \`json:"last_name" validate:"required,min=2"\`
}

type LoginRequest struct {
    Username string \`json:"username" validate:"required"\`
    Password string \`json:"password" validate:"required"\`
}

// Register creates a new user account
func Register(c *fiber.Ctx) error {
    var req RegisterRequest
    
    // Parse and validate request
    if err := c.BodyParser(&req); err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Invalid request format",
        })
    }
    
    // Check if user already exists
    var existingUser models.User
    if err := db.DB.Where("username = ? OR email = ?", 
        req.Username, req.Email).First(&existingUser).Error; err == nil {
        return c.Status(409).JSON(fiber.Map{
            "error": "User with this username or email already exists",
        })
    }
    
    // Hash password with bcrypt
    hashedPassword, err := bcrypt.GenerateFromPassword(
        []byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        return c.Status(500).JSON(fiber.Map{
            "error": "Failed to secure password",
        })
    }
    
    // Create new user
    user := models.User{
        Username:  req.Username,
        Email:     req.Email,
        Password:  string(hashedPassword),
        FirstName: req.FirstName,
        LastName:  req.LastName,
        IsActive:  true,
        Role:      "user",
    }
    
    if err := db.DB.Create(&user).Error; err != nil {
        return c.Status(500).JSON(fiber.Map{
            "error": "Failed to create user account",
        })
    }
    
    // Generate JWT token
    token, err := generateJWT(user)
    if err != nil {
        return c.Status(500).JSON(fiber.Map{
            "error": "Failed to generate authentication token",
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
    
    // Find user by username
    var user models.User
    if err := db.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
        return c.Status(401).JSON(fiber.Map{
            "error": "Invalid username or password",
        })
    }
    
    // Verify password
    if err := bcrypt.CompareHashAndPassword(
        []byte(user.Password), []byte(req.Password)); err != nil {
        return c.Status(401).JSON(fiber.Map{
            "error": "Invalid username or password",
        })
    }
    
    // Check if account is active
    if !user.IsActive {
        return c.Status(403).JSON(fiber.Map{
            "error": "Account is disabled. Contact support.",
        })
    }
    
    // Generate JWT token
    token, err := generateJWT(user)
    if err != nil {
        return c.Status(500).JSON(fiber.Map{
            "error": "Failed to generate authentication token",
        })
    }
    
    return c.JSON(fiber.Map{
        "message": "Login successful",
        "user":    user.Public(),
        "token":   token,
    })
}

// generateJWT creates a JWT token for authenticated user
func generateJWT(user models.User) (string, error) {
    // Create claims with user information
    claims := Claims{
        UserID:   user.ID,
        Username: user.Username,
        Role:     user.Role,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
            NotBefore: jwt.NewNumericDate(time.Now()),
            Issuer:    "go-fiber-api",
            Subject:   user.Username,
        },
    }
    
    // Create token with claims
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    
    // Get JWT secret from environment
    jwtSecret := os.Getenv("JWT_SECRET")
    if jwtSecret == "" {
        jwtSecret = "default-secret-change-in-production"
    }
    
    // Sign and return token
    return token.SignedString([]byte(jwtSecret))
}</code></pre>
      </div>

      <h3>2. JWT Middleware</h3>
      <p>Create middleware to protect routes and validate tokens:</p>
      
      <div class="code-example">
        <h4>middleware/auth.go - Token Validation</h4>
        <pre><code>package middleware

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

// JWTMiddleware validates JWT tokens for protected routes
func JWTMiddleware() fiber.Handler {
    return func(c *fiber.Ctx) error {
        // Get Authorization header
        authHeader := c.Get("Authorization")
        if authHeader == "" {
            return c.Status(401).JSON(fiber.Map{
                "error": "Authorization header is required",
            })
        }
        
        // Check Bearer token format
        if !strings.HasPrefix(authHeader, "Bearer ") {
            return c.Status(401).JSON(fiber.Map{
                "error": "Invalid authorization header format",
            })
        }
        
        // Extract token string
        tokenString := strings.TrimPrefix(authHeader, "Bearer ")
        
        // Parse and validate token
        token, err := jwt.ParseWithClaims(tokenString, &Claims{}, 
            func(token *jwt.Token) (interface{}, error) {
                // Verify signing method
                if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
                    return nil, jwt.NewValidationError("invalid signing method", 
                        jwt.ValidationErrorSignatureInvalid)
                }
                
                // Return JWT secret
                jwtSecret := os.Getenv("JWT_SECRET")
                if jwtSecret == "" {
                    jwtSecret = "default-secret-change-in-production"
                }
                return []byte(jwtSecret), nil
            })
        
        // Check for parsing errors
        if err != nil || !token.Valid {
            return c.Status(401).JSON(fiber.Map{
                "error": "Invalid or expired token",
            })
        }
        
        // Extract claims
        claims, ok := token.Claims.(*Claims)
        if !ok {
            return c.Status(401).JSON(fiber.Map{
                "error": "Invalid token claims",
            })
        }
        
        // Verify user still exists and is active
        var user models.User
        if err := db.DB.First(&user, claims.UserID).Error; err != nil {
            return c.Status(401).JSON(fiber.Map{
                "error": "User account not found",
            })
        }
        
        if !user.IsActive {
            return c.Status(403).JSON(fiber.Map{
                "error": "Account is disabled",
            })
        }
        
        // Store user information in context
        c.Locals("user", user)
        c.Locals("userID", user.ID)
        c.Locals("userRole", user.Role)
        
        // Continue to next handler
        return c.Next()
    }
}

// AdminMiddleware restricts access to admin users only
func AdminMiddleware() fiber.Handler {
    return func(c *fiber.Ctx) error {
        role, ok := c.Locals("userRole").(string)
        if !ok || role != "admin" {
            return c.Status(403).JSON(fiber.Map{
                "error": "Administrator privileges required",
            })
        }
        
        return c.Next()
    }
}

// OptionalAuthMiddleware allows both authenticated and anonymous access
func OptionalAuthMiddleware() fiber.Handler {
    return func(c *fiber.Ctx) error {
        authHeader := c.Get("Authorization")
        
        // If no auth header, continue without user context
        if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
            return c.Next()
        }
        
        // Try to authenticate if token is provided
        tokenString := strings.TrimPrefix(authHeader, "Bearer ")
        token, err := jwt.ParseWithClaims(tokenString, &Claims{}, 
            func(token *jwt.Token) (interface{}, error) {
                jwtSecret := os.Getenv("JWT_SECRET")
                if jwtSecret == "" {
                    jwtSecret = "default-secret-change-in-production"
                }
                return []byte(jwtSecret), nil
            })
        
        // If valid token, set user context
        if err == nil && token.Valid {
            if claims, ok := token.Claims.(*Claims); ok {
                var user models.User
                if db.DB.First(&user, claims.UserID).Error == nil && user.IsActive {
                    c.Locals("user", user)
                    c.Locals("userID", user.ID)
                    c.Locals("userRole", user.Role)
                }
            }
        }
        
        return c.Next()
    }
}</code></pre>
      </div>

      <h3>3. Profile Management</h3>
      <p>Implement profile endpoints for authenticated users:</p>
      
      <div class="code-example">
        <h4>handlers/profile.go - User Profile Operations</h4>
        <pre><code>package handlers

import (
    "go-fiber-api/db"
    "go-fiber-api/models"
    
    "github.com/gofiber/fiber/v2"
    "golang.org/x/crypto/bcrypt"
)

// GetProfile returns current user's profile information
func GetProfile(c *fiber.Ctx) error {
    user, ok := c.Locals("user").(models.User)
    if !ok {
        return c.Status(401).JSON(fiber.Map{
            "error": "Authentication required",
        })
    }
    
    return c.JSON(fiber.Map{
        "user": user.Public(),
    })
}

// UpdateProfile allows users to update their own profile
func UpdateProfile(c *fiber.Ctx) error {
    user, ok := c.Locals("user").(models.User)
    if !ok {
        return c.Status(401).JSON(fiber.Map{
            "error": "Authentication required",
        })
    }
    
    var updateData struct {
        FirstName string \`json:"first_name" validate:"omitempty,min=2,max=50"\`
        LastName  string \`json:"last_name" validate:"omitempty,min=2,max=50"\`
        Email     string \`json:"email" validate:"omitempty,email"\`
    }
    
    if err := c.BodyParser(&updateData); err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Invalid request format",
        })
    }
    
    // Update only provided fields
    if updateData.FirstName != "" {
        user.FirstName = updateData.FirstName
    }
    if updateData.LastName != "" {
        user.LastName = updateData.LastName
    }
    if updateData.Email != "" {
        // Check if email is already taken
        var existingUser models.User
        if err := db.DB.Where("email = ? AND id != ?", 
            updateData.Email, user.ID).First(&existingUser).Error; err == nil {
            return c.Status(409).JSON(fiber.Map{
                "error": "Email address is already in use",
            })
        }
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

// ChangePassword allows users to change their password
func ChangePassword(c *fiber.Ctx) error {
    user, ok := c.Locals("user").(models.User)
    if !ok {
        return c.Status(401).JSON(fiber.Map{
            "error": "Authentication required",
        })
    }
    
    var req struct {
        CurrentPassword string \`json:"current_password" validate:"required"\`
        NewPassword     string \`json:"new_password" validate:"required,min=8"\`
        ConfirmPassword string \`json:"confirm_password" validate:"required"\`
    }
    
    if err := c.BodyParser(&req); err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Invalid request format",
        })
    }
    
    // Verify passwords match
    if req.NewPassword != req.ConfirmPassword {
        return c.Status(400).JSON(fiber.Map{
            "error": "New password and confirmation do not match",
        })
    }
    
    // Verify current password
    if err := bcrypt.CompareHashAndPassword(
        []byte(user.Password), []byte(req.CurrentPassword)); err != nil {
        return c.Status(400).JSON(fiber.Map{
            "error": "Current password is incorrect",
        })
    }
    
    // Hash new password
    hashedPassword, err := bcrypt.GenerateFromPassword(
        []byte(req.NewPassword), bcrypt.DefaultCost)
    if err != nil {
        return c.Status(500).JSON(fiber.Map{
            "error": "Failed to secure new password",
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
}</code></pre>
      </div>

      <h3>4. Security Best Practices</h3>
      <div class="info-box">
        <h4>🔒 JWT Security Guidelines</h4>
        <ul>
          <li><strong>Strong Secrets:</strong> Use cryptographically secure JWT secrets (256+ bits)</li>
          <li><strong>Token Expiration:</strong> Set reasonable expiration times (1-24 hours)</li>
          <li><strong>Secure Storage:</strong> Store tokens securely on client-side (httpOnly cookies preferred)</li>
          <li><strong>HTTPS Only:</strong> Always use HTTPS in production to protect tokens</li>
          <li><strong>Password Security:</strong> Use bcrypt with appropriate cost factor (12+)</li>
        </ul>
      </div>

      <h3>5. Token Refresh Implementation</h3>
      <p>Add token refresh functionality for better user experience:</p>
      
      <div class="code-example">
        <h4>Token Refresh Handler</h4>
        <pre><code>// RefreshToken generates a new JWT token for authenticated users
func RefreshToken(c *fiber.Ctx) error {
    user, ok := c.Locals("user").(models.User)
    if !ok {
        return c.Status(401).JSON(fiber.Map{
            "error": "Valid authentication token required",
        })
    }
    
    // Generate new token
    newToken, err := generateJWT(user)
    if err != nil {
        return c.Status(500).JSON(fiber.Map{
            "error": "Failed to generate new token",
        })
    }
    
    return c.JSON(fiber.Map{
        "message": "Token refreshed successfully",
        "token":   newToken,
    })
}</code></pre>
      </div>

      <div class="tip-box">
        <h4>🛡️ Security Tip</h4>
        <p>Implement rate limiting on authentication endpoints to prevent brute force attacks. Consider using Redis for token blacklisting when implementing logout functionality.</p>
      </div>
    </div>
  `,
  practiceInstructions: [
    "Implement the complete authentication system with registration and login handlers",
    "Create JWT middleware for route protection and token validation",
    "Build profile management endpoints for authenticated users",
    "Test the authentication flow by registering, logging in, and accessing protected routes",
  ],
  hints: [
    "Store JWT secrets in environment variables, never hardcode them",
    "Use bcrypt.DefaultCost (10) for password hashing, or higher for sensitive applications",
    "Always validate JWT tokens on each request to protected routes",
    "Implement proper error messages without revealing sensitive information",
  ],
  solution: `# Complete authentication testing solution:

# 1. Register a new user
curl -X POST http://localhost:8080/api/v1/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "testuser",
    "email": "test@example.com", 
    "password": "securepass123",
    "first_name": "Test",
    "last_name": "User"
  }'

# 2. Login with credentials
curl -X POST http://localhost:8080/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "testuser",
    "password": "securepass123"
  }'

# 3. Use returned JWT token for protected routes
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 4. Access protected profile endpoint
curl -H "Authorization: Bearer $TOKEN" \\
  http://localhost:8080/api/v1/profile

# The authentication system should securely handle user registration, 
# login, and provide access control for protected resources.`,
};

export default auth;
