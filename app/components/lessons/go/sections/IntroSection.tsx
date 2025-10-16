import React from "react";
import { Settings } from "lucide-react";

export const IntroSection = {
  id: "intro",
  title: "Go Project Setup",
  icon: <Settings className="w-6 h-6" />,
  overview: "Initialize Go modules and install dependencies",
  content: (
    <div className="prose max-w-none">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Learning Objectives:</strong>
              <br />• Set up a Go project with modules
              <br />• Install Fiber web framework and GORM ORM
              <br />• Configure PostgreSQL database connection
              <br />• Understand Go project structure and dependencies
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-4">
        Project Initialization
      </h3>
      <p className="text-slate-700 mb-4">
        Go modules are the standard way to manage dependencies in Go projects.
        They provide reproducible builds and version management for your
        applications.
      </p>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-900 mb-2">
          1. Create New Go Project
        </h4>
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
          <code>{`# Create project directory
mkdir go-fiber-api
cd go-fiber-api

# Initialize Go module
go mod init go-fiber-api

# Create basic project structure
mkdir -p {handlers,models,middleware,db,routes}`}</code>
        </pre>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-900 mb-2">
          2. Install Dependencies
        </h4>
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
          <code>{`# Install Fiber web framework
go get github.com/gofiber/fiber/v2

# Install GORM ORM and PostgreSQL driver
go get gorm.io/gorm
go get gorm.io/driver/postgres

# Install JWT and bcrypt for authentication
go get github.com/golang-jwt/jwt/v4
go get golang.org/x/crypto/bcrypt

# Install additional middleware
go get github.com/gofiber/fiber/v2/middleware/cors
go get github.com/gofiber/fiber/v2/middleware/logger`}</code>
        </pre>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-slate-900 mb-2">
          3. Project Structure
        </h4>
        <pre className="bg-slate-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
          <code>{`go-fiber-api/
├── main.go           # Application entry point
├── go.mod           # Module definition
├── go.sum           # Dependency checksums
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
    └── routes.go    # Route definitions`}</code>
        </pre>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-amber-700">
              <strong>Key Concepts:</strong>
              <br />• <strong>Go Modules:</strong> Dependency management system
              introduced in Go 1.11
              <br />• <strong>Fiber:</strong> Express.js inspired web framework
              for Go
              <br />• <strong>GORM:</strong> Object-Relational Mapping library
              for Go
              <br />• <strong>Project Structure:</strong> Organized code layout
              for maintainability
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
              Create a new Go project and install all dependencies. Verify your
              setup by running `go mod tidy` to clean up the go.mod file.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};
