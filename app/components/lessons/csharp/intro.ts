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
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=csharp_backend;Username=your_username;Password=your_password"
  },
  "Jwt": {
    "Key": "your_jwt_secret_key_32_chars_long",
    "Issuer": "CSharpBackend",
    "Audience": "CSharpBackend"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
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
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();`,
};
