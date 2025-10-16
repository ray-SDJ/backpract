import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Testing & Production Deployment",
  description:
    "Write comprehensive tests with xUnit, configure production settings, and deploy ASP.NET Core applications with Docker.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <p>Learn to write comprehensive tests for your ASP.NET Core application and deploy it to production with proper configuration and monitoring.</p>

    <h2>Unit Testing with xUnit</h2>
    
    <p>Create a test project for your application:</p>

    <pre class="code-block">
      <code>
dotnet new xunit -n CSharpBackend.Tests
cd CSharpBackend.Tests
dotnet add reference ../CSharpBackend/CSharpBackend.csproj
dotnet add package Microsoft.AspNetCore.Mvc.Testing
dotnet add package Moq
dotnet add package FluentAssertions
      </code>
    </pre>

    <p>Write unit tests for your services:</p>

    <pre class="code-block">
      <code>
using Xunit;
using FluentAssertions;
using CSharpBackend.Services;

namespace CSharpBackend.Tests.Services;

public class PasswordServiceTests
{
    private readonly PasswordService _passwordService;

    public PasswordServiceTests()
    {
        _passwordService = new PasswordService();
    }

    [Fact]
    public void HashPassword_ShouldReturnHashedPassword()
    {
        // Arrange
        var password = "TestPassword123!";

        // Act
        var hashedPassword = _passwordService.HashPassword(password);

        // Assert
        hashedPassword.Should().NotBeEmpty();
        hashedPassword.Should().NotBe(password);
        hashedPassword.Length.Should().BeGreaterThan(50);
    }

    [Theory]
    [InlineData("Password123!")] // Valid strong password
    [InlineData("MyP@ssw0rd")] // Valid strong password
    public void IsPasswordStrong_WithStrongPassword_ShouldReturnTrue(string password)
    {
        // Act
        var result = _passwordService.IsPasswordStrong(password);

        // Assert
        result.Should().BeTrue();
    }
}
      </code>
    </pre>

    <h2>Integration Testing</h2>
    
    <p>Test your API endpoints with integration tests:</p>

    <pre class="code-block">
      <code>
using System.Net.Http;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;
using FluentAssertions;
using CSharpBackend.Data;
using CSharpBackend.DTOs;

namespace CSharpBackend.Tests.Controllers;

public class AuthControllerTests : IClassFixture&lt;WebApplicationFactory&lt;Program&gt;&gt;
{
    private readonly WebApplicationFactory&lt;Program&gt; _factory;
    private readonly HttpClient _client;

    public AuthControllerTests(WebApplicationFactory&lt;Program&gt; factory)
    {
        _factory = factory.WithWebHostBuilder(builder =&gt;
        {
            builder.ConfigureServices(services =&gt;
            {
                var descriptor = services.SingleOrDefault(
                    d =&gt; d.ServiceType == typeof(DbContextOptions&lt;AppDbContext&gt;));
                if (descriptor != null)
                    services.Remove(descriptor);

                services.AddDbContext&lt;AppDbContext&gt;(options =&gt;
                {
                    options.UseInMemoryDatabase("TestDatabase");
                });
            });
        });

        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task Register_WithValidData_ShouldReturn201()
    {
        // Arrange
        var registerDto = new CreateUserDto
        {
            Username = "testuser",
            Email = "test@example.com",
            Password = "TestPassword123!"
        };

        var json = JsonSerializer.Serialize(registerDto);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/auth/register", content);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }
}
      </code>
    </pre>

    <h2>Production Configuration</h2>
    
    <p>Configure your application for production in appsettings.Production.json:</p>

    <pre class="code-block">
      <code>
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=prod-db-server;Database=csharp_backend_prod;Username=prod_user;Password=\${DB_PASSWORD}"
  },
  "Jwt": {
    "Key": "\${JWT_SECRET_KEY}",
    "Issuer": "CSharpBackend",
    "Audience": "CSharpBackend"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "CSharpBackend": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "yourdomain.com,www.yourdomain.com"
}
      </code>
    </pre>

    <h2>Docker Configuration</h2>
    
    <p>Create a Dockerfile for containerization:</p>

    <pre class="code-block">
      <code>
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["CSharpBackend/CSharpBackend.csproj", "CSharpBackend/"]
RUN dotnet restore "CSharpBackend/CSharpBackend.csproj"
COPY . .
WORKDIR "/src/CSharpBackend"
RUN dotnet build "CSharpBackend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CSharpBackend.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create a non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser

ENTRYPOINT ["dotnet", "CSharpBackend.dll"]
      </code>
    </pre>

    <h2>Docker Compose</h2>
    
    <p>Create docker-compose.yml for development:</p>

    <pre class="code-block">
      <code>
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Host=postgres;Database=csharp_backend;Username=postgres;Password=password123
      - Jwt__Key=your-super-secret-jwt-key-that-is-at-least-32-characters-long
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: csharp_backend
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

volumes:
  postgres_data:
      </code>
    </pre>

    <h2>Health Checks</h2>
    
    <p>Add health checks to monitor your application:</p>

    <pre class="code-block">
      <code>
// In Program.cs
builder.Services.AddHealthChecks()
    .AddDbContextCheck&lt;AppDbContext&gt;()
    .AddNpgSql(builder.Configuration.GetConnectionString("DefaultConnection")!);

// Configure endpoints
app.MapHealthChecks("/health");
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check =&gt; check.Tags.Contains("ready"),
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});
      </code>
    </pre>

    <h2>Production Deployment Steps</h2>
    
    <div class="explanation-list">
      <ul>
        <li><strong>Environment Variables:</strong> Use environment variables for sensitive configuration</li>
        <li><strong>SSL/TLS:</strong> Configure HTTPS certificates for production</li>
        <li><strong>Logging:</strong> Set up structured logging with external providers</li>
        <li><strong>Monitoring:</strong> Implement health checks and performance monitoring</li>
        <li><strong>Database:</strong> Use connection pooling and proper backup strategies</li>
        <li><strong>Security Headers:</strong> Add security headers and rate limiting</li>
      </ul>
    </div>

    <h2>Running Tests</h2>
    
    <p>Execute your test suite:</p>

    <pre class="code-block">
      <code>
# Run all tests
dotnet test

# Run tests with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific test category
dotnet test --filter Category=Integration
      </code>
    </pre>

    <h2>Deployment Commands</h2>
    
    <p>Deploy your application:</p>

    <pre class="code-block">
      <code>
# Build and run with Docker
docker build -t csharp-backend .
docker run -p 5000:80 csharp-backend

# Deploy with docker-compose
docker-compose up -d

# Publish for deployment
dotnet publish -c Release -o ./publish
      </code>
    </pre>
  </div>`,
  objectives: [
    "Write comprehensive unit and integration tests",
    "Configure production environment settings",
    "Create Docker containers for deployment",
    "Implement health checks and monitoring",
    "Deploy ASP.NET Core applications to production",
  ],
  practiceInstructions: [
    "Create a test project with xUnit and essential testing packages",
    "Write unit tests for your services and controllers",
    "Configure production settings with environment variables",
    "Build Docker image and test with docker-compose",
    "Add health checks for application monitoring",
  ],
  hints: [
    "Use InMemoryDatabase for integration testing",
    "Environment variables keep production secrets secure",
    "Multi-stage Dockerfile optimizes image size and security",
    "Health checks are crucial for container orchestration",
  ],
  solution: `// Complete test example
[Fact]
public async Task Register_WithValidData_ShouldReturn201()
{
    // Arrange
    var registerDto = new CreateUserDto
    {
        Username = "testuser",
        Email = "test@example.com", 
        Password = "TestPassword123!"
    };

    var json = JsonSerializer.Serialize(registerDto);
    var content = new StringContent(json, Encoding.UTF8, "application/json");

    // Act
    var response = await _client.PostAsync("/api/auth/register", content);

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.Created);
}`,
};
