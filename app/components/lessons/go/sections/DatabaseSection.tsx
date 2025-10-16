import React from "react";
import { Database } from "lucide-react";

export const DatabaseSection = {
  id: "database",
  title: "Database & Models",
  icon: <Database className="w-6 h-6" />,
  overview: "Set up GORM with PostgreSQL and define data models",
  content: (
    <div className="prose max-w-none">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Learning Objectives:</strong>
              <br />• Configure GORM with PostgreSQL database
              <br />• Define Go structs as database models
              <br />• Implement database migrations and relationships
              <br />• Use GORM tags for field constraints and validation
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">
        Database Configuration
      </h3>
      <p className="text-slate-700 mb-4">
        GORM is a powerful ORM library for Go that provides a convenient way to
        interact with databases. We&apos;ll use PostgreSQL as our database
        backend.
      </p>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-900 mb-2">
          Database Connection (db/database.go)
        </h4>
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
          <code>{`package db

import (
    "fmt"
    "log"
    "os"
    "go-fiber-api/models"
    
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
    "gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDB() {
    var err error
    
    // Database connection string
    dsn := fmt.Sprintf(
        "host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
        getEnv("DB_HOST", "localhost"),
        getEnv("DB_USER", "postgres"),
        getEnv("DB_PASSWORD", "password"),
        getEnv("DB_NAME", "go_fiber_api"),
        getEnv("DB_PORT", "5432"),
    )
    
    // Connect to database
    DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
        Logger: logger.Default.LogMode(logger.Info),
    })
    
    if err != nil {
        log.Fatal("Failed to connect to database: ", err)
    }
    
    log.Println("Database connected successfully")
    
    // Auto-migrate models
    err = DB.AutoMigrate(&models.User{})
    if err != nil {
        log.Fatal("Failed to migrate database: ", err)
    }
}

func getEnv(key, defaultValue string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return defaultValue
}`}</code>
        </pre>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-900 mb-2">
          User Model (models/user.go)
        </h4>
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
          <code>{`package models

import (
    "time"
    "gorm.io/gorm"
)

type User struct {
    ID        uint           \`json:"id" gorm:"primaryKey"\`
    CreatedAt time.Time      \`json:"created_at"\`
    UpdatedAt time.Time      \`json:"updated_at"\`
    DeletedAt gorm.DeletedAt \`json:"-" gorm:"index"\`
    
    Username  string \`json:"username" gorm:"uniqueIndex;not null;size:100"\`
    Email     string \`json:"email" gorm:"uniqueIndex;not null;size:255"\`
    Password  string \`json:"-" gorm:"not null;size:255"\`
    FirstName string \`json:"first_name" gorm:"size:100"\`
    LastName  string \`json:"last_name" gorm:"size:100"\`
    IsActive  bool   \`json:"is_active" gorm:"default:true"\`
    Role      string \`json:"role" gorm:"default:'user';size:50"\`
}

// TableName overrides the table name
func (User) TableName() string {
    return "users"
}

// Public returns user data without sensitive information
func (u *User) Public() map[string]interface{} {
    return map[string]interface{}{
        "id":         u.ID,
        "username":   u.Username,
        "email":      u.Email,
        "first_name": u.FirstName,
        "last_name":  u.LastName,
        "is_active":  u.IsActive,
        "role":       u.Role,
        "created_at": u.CreatedAt,
        "updated_at": u.UpdatedAt,
    }
}`}</code>
        </pre>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-900 mb-2">
          Additional Models Example
        </h4>
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
          <code>{`// Product model example
type Product struct {
    ID          uint      \`json:"id" gorm:"primaryKey"\`
    CreatedAt   time.Time \`json:"created_at"\`
    UpdatedAt   time.Time \`json:"updated_at"\`
    
    Name        string  \`json:"name" gorm:"not null;size:255"\`
    Description string  \`json:"description" gorm:"type:text"\`
    Price       float64 \`json:"price" gorm:"not null;type:decimal(10,2)"\`
    Stock       int     \`json:"stock" gorm:"default:0"\`
    UserID      uint    \`json:"user_id" gorm:"not null"\`
    
    // Relationship
    User        User    \`json:"user" gorm:"foreignKey:UserID"\`
}

// Category model with many-to-many relationship
type Category struct {
    ID       uint      \`json:"id" gorm:"primaryKey"\`
    Name     string    \`json:"name" gorm:"uniqueIndex;not null;size:100"\`
    Products []Product \`json:"products" gorm:"many2many:product_categories;"\`
}`}</code>
        </pre>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-amber-700">
              <strong>GORM Tags Explained:</strong>
              <br />• <strong>primaryKey:</strong> Defines the primary key field
              <br />• <strong>uniqueIndex:</strong> Creates a unique index on
              the field
              <br />• <strong>not null:</strong> Field cannot be null
              <br />• <strong>size:</strong> Sets the maximum length for string
              fields
              <br />• <strong>default:</strong> Sets a default value
              <br />• <strong>foreignKey:</strong> Defines foreign key
              relationships
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-900 mb-2">
          Environment Variables (.env)
        </h4>
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
          <code>{`# Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=go_fiber_api
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key

# Server Configuration
PORT=8080`}</code>
        </pre>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-green-700">
              <strong>Practice Exercise:</strong>
              <br />
              Set up PostgreSQL locally, create the database, and run the
              connection code. Verify that the users table is created
              automatically by GORM&apos;s AutoMigrate feature.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};
