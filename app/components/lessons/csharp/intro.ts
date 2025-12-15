import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "ASP.NET Core Setup",
  description:
    "Learn to set up ASP.NET Core projects, install essential packages, and understand the framework architecture.",
  difficulty: "Beginner",
  content: `<div class="lesson-content">
    <p>ASP.NET Core is a cross-platform framework for building modern web applications and APIs. Learn the essentials of project setup and configuration.</p>

    <h2>Prerequisites</h2>
    
    <p>Ensure you have the .NET SDK installed (version 8.0 or later):</p>

    <pre class="code-block">
      <code>
dotnet --version
      </code>
    </pre>

    <h2>Creating a New Project</h2>
    
    <p>Create a new ASP.NET Core Web API project:</p>

    <pre class="code-block">
      <code>
dotnet new webapi -n CSharpBackend
cd CSharpBackend
      </code>
    </pre>

    <h2>Essential NuGet Packages</h2>
    
    <p>Install the necessary packages for a complete backend setup:</p>

    <pre class="code-block">
      <code>
dotnet add package Microsoft.EntityFrameworkCore --version 8.0.10
dotnet add package Microsoft.EntityFrameworkCore.Design --version 8.0.10
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 8.0.4
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 8.0.10
dotnet add package System.IdentityModel.Tokens.Jwt --version 7.1.2
dotnet add package BCrypt.Net-Next --version 4.0.3
      </code>
    </pre>

    <h2>Configuration Setup</h2>
    
    <p>Configure your application settings in appsettings.json:</p>

    <pre class="code-block">
      <code>
{
  // Database connection strings
  // Access in code with: builder.Configuration.GetConnectionString("DefaultConnection")
  "ConnectionStrings": {
    // PostgreSQL connection string format:
    // Host = database server address (localhost for local development)
    // Database = database name to connect to
    // Username/Password = database credentials
    "DefaultConnection": "Host=localhost;Database=csharp_backend;Username=your_username;Password=your_password"
  },
  
  // JWT (JSON Web Token) authentication settings
  // Used for securing API endpoints with bearer tokens
  "Jwt": {
    // Secret key for signing/verifying JWTs
    // MUST be at least 32 characters for HS256 algorithm
    // Keep this secret! Never commit real keys to source control
    "Key": "your_jwt_secret_key_32_chars_long",
    
    // Issuer = who created the token (your API)
    // Verified when token is validated
    "Issuer": "CSharpBackend",
    
    // Audience = who the token is intended for (your API)
    // Prevents tokens from other APIs being used here
    "Audience": "CSharpBackend"
  },
  
  // Logging configuration
  // Controls how much detail is logged to console/files
  "Logging": {
    // LogLevel determines what gets logged:
    // Trace < Debug < Information < Warning < Error < Critical
    "LogLevel": {
      // Default level for all loggers (if not specified below)
      "Default": "Information",
      
      // ASP.NET Core internal logging level
      // Set to Warning to reduce noise from framework logs
      "Microsoft.AspNetCore": "Warning"
    }
  },
  
  // AllowedHosts = which host headers are accepted
  // "*" allows all hosts (fine for development)
  // In production, specify exact domains: "example.com;www.example.com"
  "AllowedHosts": "*"
}
      </code>
    </pre>

    <h2>Understanding ASP.NET Core Architecture</h2>
    
    <div class="explanation-list">
      <ul>
        <li><strong>Kestrel Server:</strong> Built-in web server for high-performance HTTP handling</li>
        <li><strong>Dependency Injection:</strong> Built-in IoC container for service management</li>
        <li><strong>Middleware Pipeline:</strong> Request processing chain with configurable components</li>
        <li><strong>Configuration System:</strong> Flexible configuration from multiple sources</li>
        <li><strong>Logging Framework:</strong> Structured logging with multiple providers</li>
      </ul>
    </div>

    <h2>Running Your Application</h2>
    
    <p>Start your development server:</p>

    <pre class="code-block">
      <code>
dotnet run
      </code>
    </pre>

    <p>Your API will be available at https://localhost:5001 or http://localhost:5000</p>
  </div>`,
  objectives: [
    "Set up a new ASP.NET Core Web API project",
    "Install and configure essential NuGet packages",
    "Understand the ASP.NET Core project structure",
    "Configure application settings and connection strings",
    "Learn about the ASP.NET Core architecture components",
  ],
  practiceInstructions: [
    "Create a new ASP.NET Core project using the CLI",
    "Install the required NuGet packages for database and authentication",
    "Configure your appsettings.json with database connection",
    "Run the application and access the default API endpoints",
    "Explore the project structure and understand the Program.cs file",
  ],
  hints: [
    "Use 'dotnet --version' to check your .NET SDK version",
    "The connection string should match your PostgreSQL setup",
    "JWT Key must be at least 32 characters for security",
    "Use 'dotnet watch run' for automatic reloading during development",
  ],
  solution: `// Program.cs - Basic ASP.NET Core setup
// Import Entity Framework Core for database operations
using Microsoft.EntityFrameworkCore;

// Create a WebApplicationBuilder - this sets up the application configuration
// WebApplicationBuilder handles:
// - Loading appsettings.json configuration
// - Setting up dependency injection container
// - Configuring logging
// args = command line arguments passed to the application
var builder = WebApplication.CreateBuilder(args);

// ========== REGISTER SERVICES (Dependency Injection) ==========
// builder.Services is the DI container - register all services here
// Services registered here can be injected into controllers/classes

// AddControllers() registers controller services
// Enables MVC controller functionality (routing, model binding, etc.)
builder.Services.AddControllers();

// AddEndpointsApiExplorer() generates API endpoint metadata
// Required for Swagger/OpenAPI documentation generation
builder.Services.AddEndpointsApiExplorer();

// AddSwaggerGen() configures Swagger documentation generator
// Creates interactive API documentation at /swagger endpoint
builder.Services.AddSwaggerGen();

// BUILD THE APPLICATION
// builder.Build() creates the WebApplication instance
// After this point, you can no longer register services
var app = builder.Build();

// ========== CONFIGURE HTTP REQUEST PIPELINE ==========
// Middleware executes in the order you define with app.Use*()
// Each request flows through this pipeline top to bottom

// Only enable Swagger in development (not in production)
// app.Environment checks the current environment (Development, Staging, Production)
if (app.Environment.IsDevelopment())
{
    // UseSwagger() adds Swagger JSON endpoint at /swagger/v1/swagger.json
    app.UseSwagger();
    
    // UseSwaggerUI() adds Swagger UI web interface at /swagger
    // Provides interactive API documentation and testing
    app.UseSwaggerUI();
}

// UseHttpsRedirection() redirects HTTP requests to HTTPS
// Ensures all communication is encrypted (HTTP 301 redirect)
app.UseHttpsRedirection();

// UseAuthorization() enables authorization middleware
// Checks if user has permission to access requested resources
// Must come AFTER UseAuthentication() if using authentication
app.UseAuthorization();

// MapControllers() maps attribute-routed controllers
// Scans for [Route], [HttpGet], [HttpPost] attributes and creates routes
// Without this, your controller endpoints won't work
app.MapControllers();

// Run() starts the web server and listens for requests
// This is a blocking call - application runs until stopped
app.Run();`,
};
