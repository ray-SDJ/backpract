import { LessonData } from "../types";

const database: LessonData = {
  title: "Database Setup with GORM",
  difficulty: "Intermediate",
  description:
    "Master GORM ORM with PostgreSQL database. Learn to define models, configure relationships, and implement database migrations for a robust data layer.",
  objectives: [
    "Configure GORM with PostgreSQL database connection",
    "Define Go structs as database models with proper tags",
    "Implement database relationships and constraints",
    "Use GORM's AutoMigrate for schema management",
  ],
  content: `
    <div class="lesson-content">
      <h2>Database Configuration & Models</h2>
      
      <div class="info-box">
        <h3>What You'll Learn</h3>
        <p>GORM is a powerful Object-Relational Mapping library for Go that simplifies database interactions. You'll learn to connect to PostgreSQL, define models, and manage database schemas efficiently.</p>
      </div>

      <h3>1. Database Connection Setup</h3>
      <p>Configure GORM to connect to PostgreSQL with proper error handling and logging:</p>
      
      <div class="code-example">
        <h4>db/database.go</h4>
        <pre><code>package db

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
    
    // Build connection string
    dsn := fmt.Sprintf(
        "host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
        getEnv("DB_HOST", "localhost"),
        getEnv("DB_USER", "postgres"), 
        getEnv("DB_PASSWORD", "password"),
        getEnv("DB_NAME", "go_fiber_api"),
        getEnv("DB_PORT", "5432"),
    )
    
    // Connect with configuration
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
}</code></pre>
      </div>

      <h3>2. User Model Definition</h3>
      <p>Define the User model with GORM tags for database constraints:</p>
      
      <div class="code-example">
        <h4>models/user.go</h4>
        <pre><code>package models

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
}</code></pre>
      </div>

      <h3>3. GORM Tags Explained</h3>
      <div class="info-box">
        <h4>Common GORM Tags</h4>
        <ul>
          <li><strong>primaryKey:</strong> Defines the primary key field</li>
          <li><strong>uniqueIndex:</strong> Creates a unique index</li>
          <li><strong>not null:</strong> Field cannot be null</li>
          <li><strong>size:</strong> Sets maximum length for strings</li>
          <li><strong>default:</strong> Sets default value</li>
          <li><strong>foreignKey:</strong> Defines foreign key relationships</li>
        </ul>
      </div>

      <h3>4. Database Relationships</h3>
      <p>Example of additional models with relationships:</p>
      
      <div class="code-example">
        <h4>Product Model with User Relationship</h4>
        <pre><code>type Product struct {
    ID          uint      \`json:"id" gorm:"primaryKey"\`
    CreatedAt   time.Time \`json:"created_at"\`
    UpdatedAt   time.Time \`json:"updated_at"\`
    
    Name        string  \`json:"name" gorm:"not null;size:255"\`
    Description string  \`json:"description" gorm:"type:text"\`
    Price       float64 \`json:"price" gorm:"not null;type:decimal(10,2)"\`
    Stock       int     \`json:"stock" gorm:"default:0"\`
    UserID      uint    \`json:"user_id" gorm:"not null"\`
    
    // Belongs to relationship
    User        User    \`json:"user" gorm:"foreignKey:UserID"\`
}

// Many-to-many relationship example
type Category struct {
    ID       uint      \`json:"id" gorm:"primaryKey"\`
    Name     string    \`json:"name" gorm:"uniqueIndex;not null;size:100"\`
    Products []Product \`json:"products" gorm:"many2many:product_categories;"\`
}</code></pre>
      </div>

      <h3>5. Environment Variables</h3>
      <p>Set up your .env file with database credentials:</p>
      
      <div class="code-example">
        <h4>.env Configuration</h4>
        <pre><code># Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=go_fiber_api
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration  
PORT=8080</code></pre>
      </div>

      <div class="tip-box">
        <h4>🔒 Security Tip</h4>
        <p>Never commit your .env file to version control. Add it to .gitignore and use strong, unique passwords for database connections.</p>
      </div>

      <h3>6. Database Operations</h3>
      <p>Common GORM operations you'll use frequently:</p>
      
      <div class="code-example">
        <h4>Basic GORM Operations</h4>
        <pre><code>// Create a new user
user := models.User{
    Username: "john_doe",
    Email:    "john@example.com",
}
DB.Create(&user)

// Find user by ID
var user models.User
DB.First(&user, 1)

// Find user by condition
DB.Where("username = ?", "john_doe").First(&user)

// Update user
DB.Model(&user).Update("first_name", "John")

// Delete user (soft delete)
DB.Delete(&user, 1)</code></pre>
      </div>
    </div>
  `,
  practiceInstructions: [
    "Set up PostgreSQL database locally and create the go_fiber_api database",
    "Implement the database connection code in db/database.go",
    "Create the User model in models/user.go with all specified fields and tags",
    "Test the database connection and verify that tables are created automatically",
  ],
  hints: [
    "Install PostgreSQL using your system's package manager or download from postgresql.org",
    "Use createdb command to create the database: 'createdb go_fiber_api'",
    "Test database connection with psql: 'psql -h localhost -U postgres -d go_fiber_api'",
    "GORM will automatically create tables when you run AutoMigrate",
  ],
  solution: `# PostgreSQL setup and testing solution:

# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres createdb go_fiber_api

# Test connection
sudo -u postgres psql -d go_fiber_api

# In your Go application, the database connection will automatically
# create the users table when you call ConnectDB() with AutoMigrate`,
};

export default database;
