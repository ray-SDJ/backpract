import { LessonData } from "../types";

const intro: LessonData = {
  title: "Go Project Setup & Environment",
  difficulty: "Beginner",
  description:
    "Learn to set up a complete Go backend environment with Fiber web framework, GORM ORM, and PostgreSQL database. Master Go modules and project structure for professional development.",
  objectives: [
    "Initialize Go project with modules",
    "Install Fiber web framework and GORM ORM",
    "Set up PostgreSQL database connection",
    "Understand Go project structure and dependencies",
  ],
  content: `
    <div class="lesson-content">
      <h2>Go Backend Development Setup</h2>
      
      <div class="info-box">
        <h3>What You'll Learn</h3>
        <p>This lesson covers setting up a complete Go backend environment using modern tools and best practices. You'll learn to use Go modules for dependency management, Fiber for web framework, and GORM for database operations.</p>
      </div>

      <h3>1. Prerequisites</h3>
      <p>Before starting, ensure you have:</p>
      <ul>
        <li>Go 1.21 or later installed</li>
        <li>PostgreSQL database server</li>
        <li>Code editor with Go support (VS Code recommended)</li>
        <li>Basic understanding of Go syntax and concepts</li>
      </ul>

      <h3>2. Project Initialization</h3>
      <p>Go modules are the standard way to manage dependencies and provide reproducible builds:</p>
      
      <div class="code-example">
        <h4>Create New Project</h4>
        <pre><code># Create project directory
mkdir go-fiber-api
cd go-fiber-api

# Initialize Go module
go mod init go-fiber-api

# Create project structure
mkdir -p {handlers,models,middleware,db,routes}</code></pre>
      </div>

      <h3>3. Installing Dependencies</h3>
      <p>Install the essential packages for our Go backend:</p>
      
      <div class="code-example">
        <h4>Core Dependencies</h4>
        <pre><code># Fiber web framework (Express.js-inspired)
go get github.com/gofiber/fiber/v2

# GORM ORM and PostgreSQL driver  
go get gorm.io/gorm
go get gorm.io/driver/postgres

# JWT authentication
go get github.com/golang-jwt/jwt/v4

# Password hashing
go get golang.org/x/crypto/bcrypt

# Middleware packages
go get github.com/gofiber/fiber/v2/middleware/cors
go get github.com/gofiber/fiber/v2/middleware/logger</code></pre>
      </div>

      <h3>4. Project Structure</h3>
      <p>Organize your Go project with clear separation of concerns:</p>
      
      <div class="code-example">
        <pre><code>go-fiber-api/
├── main.go           # Application entry point
├── go.mod           # Module definition
├── go.sum           # Dependency checksums  
├── .env             # Environment variables
├── db/
│   └── database.go  # Database configuration
├── models/
│   └── user.go      # Data models
├── handlers/
│   ├── auth.go      # Authentication handlers
│   └── user.go      # User handlers  
├── middleware/
│   └── auth.go      # Authentication middleware
└── routes/
    └── routes.go    # Route definitions</code></pre>
      </div>

      <h3>5. Environment Configuration</h3>
      <p>Create a .env file for environment variables:</p>
      
      <div class="code-example">
        <h4>.env File</h4>
        <pre><code># Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=go_fiber_api
DB_PORT=5432

# JWT Configuration  
JWT_SECRET=your_super_secret_jwt_key

# Server Configuration
PORT=8080</code></pre>
      </div>

      <div class="tip-box">
        <h4>💡 Pro Tip</h4>
        <p>Use <code>go mod tidy</code> regularly to clean up your go.mod file and remove unused dependencies. This keeps your project lean and ensures reproducible builds.</p>
      </div>

      <h3>6. Next Steps</h3>
      <p>With your Go environment set up, you're ready to:</p>
      <ul>
        <li>Configure database connections with GORM</li>
        <li>Define data models and relationships</li>
        <li>Build RESTful API endpoints with Fiber</li>
        <li>Implement JWT authentication and authorization</li>
      </ul>
    </div>
  `,
  practiceInstructions: [
    "Create a new Go project following the structure shown above",
    "Install all dependencies using the go get commands",
    "Run 'go mod tidy' to clean up and verify your module configuration",
    "Create the basic directory structure for handlers, models, middleware, db, and routes",
  ],
  hints: [
    "Use 'go mod init' to initialize a new module with the project name",
    "Install dependencies one by one or use 'go get' with multiple packages",
    "Create directories using 'mkdir -p' to create parent directories automatically",
    "Verify installation with 'go list -m all' to see all dependencies",
  ],
  solution: `# Complete project setup solution:

mkdir go-fiber-api
cd go-fiber-api

# Initialize module
go mod init go-fiber-api

# Create directory structure
mkdir -p handlers models middleware db routes

# Install all dependencies
go get github.com/gofiber/fiber/v2
go get gorm.io/gorm
go get gorm.io/driver/postgres
go get github.com/golang-jwt/jwt/v4
go get golang.org/x/crypto/bcrypt
go get github.com/gofiber/fiber/v2/middleware/cors
go get github.com/gofiber/fiber/v2/middleware/logger

# Clean up dependencies
go mod tidy

# Verify setup
go list -m all`,
};

export default intro;
