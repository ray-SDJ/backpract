import React from "react";
import { TestTube, Rocket, Monitor } from "lucide-react";

export const TestingSection = {
  id: "testing",
  title: "Testing & Production Deployment",
  icon: <TestTube className="w-5 h-5" />,
  overview:
    "Write comprehensive tests and deploy ASP.NET Core applications to production.",
  content: (
    <div className="lesson-content">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Testing & Deployment
        </h2>
        <p className="text-slate-700 mb-6">
          Learn to write comprehensive tests for your ASP.NET Core application
          and deploy it to production with proper configuration and monitoring.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Unit Testing with xUnit
        </h3>
        <p className="text-slate-700 mb-4">
          Create a test project for your application:
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-4">
          <pre className="text-green-400 text-sm overflow-x-auto">
            <code>{`dotnet new xunit -n CSharpBackend.Tests
cd CSharpBackend.Tests
dotnet add reference ../CSharpBackend/CSharpBackend.csproj
dotnet add package Microsoft.AspNetCore.Mvc.Testing
dotnet add package Moq
dotnet add package FluentAssertions`}</code>
          </pre>
        </div>

        <p className="text-slate-700 mb-4">
          Write unit tests for your services. Create{" "}
          <code className="bg-slate-100 px-2 py-1 rounded">
            Tests/Services/PasswordServiceTests.cs
          </code>
          :
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <pre className="text-blue-400 text-sm overflow-x-auto">
            <code>{`using Xunit;
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

    [Fact]
    public void VerifyPassword_WithCorrectPassword_ShouldReturnTrue()
    {
        // Arrange
        var password = "TestPassword123!";
        var hashedPassword = _passwordService.HashPassword(password);

        // Act
        var result = _passwordService.VerifyPassword(password, hashedPassword);

        // Assert
        result.Should().BeTrue();
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

    [Theory]
    [InlineData("weak")] // Too short
    [InlineData("password123")] // No uppercase or special chars
    [InlineData("PASSWORD123!")] // No lowercase
    public void IsPasswordStrong_WithWeakPassword_ShouldReturnFalse(string password)
    {
        // Act
        var result = _passwordService.IsPasswordStrong(password);

        // Assert
        result.Should().BeFalse();
    }
}`}</code>
          </pre>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Integration Testing
        </h3>
        <p className="text-slate-700 mb-4">
          Test your API endpoints with integration tests. Create{" "}
          <code className="bg-slate-100 px-2 py-1 rounded">
            Tests/Controllers/AuthControllerTests.cs
          </code>
          :
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <pre className="text-blue-400 text-sm overflow-x-auto">
            <code>{`using System.Net.Http;
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

public class AuthControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public AuthControllerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Remove the app DbContext registration
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
                if (descriptor != null)
                    services.Remove(descriptor);

                // Add InMemory database for testing
                services.AddDbContext<AppDbContext>(options =>
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
        
        var responseContent = await response.Content.ReadAsStringAsync();
        var userDto = JsonSerializer.Deserialize<UserDto>(responseContent, 
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        
        userDto.Should().NotBeNull();
        userDto!.Username.Should().Be("testuser");
        userDto.Email.Should().Be("test@example.com");
    }

    [Fact]
    public async Task Login_WithValidCredentials_ShouldReturnToken()
    {
        // Arrange - First register a user
        await RegisterTestUser();
        
        var loginDto = new LoginDto
        {
            Username = "testuser",
            Password = "TestPassword123!"
        };

        var json = JsonSerializer.Serialize(loginDto);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/auth/login", content);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var responseContent = await response.Content.ReadAsStringAsync();
        responseContent.Should().Contain("token");
    }

    private async Task RegisterTestUser()
    {
        var registerDto = new CreateUserDto
        {
            Username = "testuser",
            Email = "test@example.com",
            Password = "TestPassword123!"
        };

        var json = JsonSerializer.Serialize(registerDto);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        await _client.PostAsync("/api/auth/register", content);
    }
}`}</code>
          </pre>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Production Configuration
        </h3>
        <p className="text-slate-700 mb-4">
          Configure your application for production in{" "}
          <code className="bg-slate-100 px-2 py-1 rounded">
            appsettings.Production.json
          </code>
          :
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <pre className="text-blue-400 text-sm overflow-x-auto">
            <code>{`{
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
}`}</code>
          </pre>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Docker Configuration
        </h3>
        <p className="text-slate-700 mb-4">
          Create a{" "}
          <code className="bg-slate-100 px-2 py-1 rounded">Dockerfile</code> for
          containerization:
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <pre className="text-blue-400 text-sm overflow-x-auto">
            <code>{`FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
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

ENTRYPOINT ["dotnet", "CSharpBackend.dll"]`}</code>
          </pre>
        </div>

        <p className="text-slate-700 mb-4">
          Create{" "}
          <code className="bg-slate-100 px-2 py-1 rounded">
            docker-compose.yml
          </code>{" "}
          for development:
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <pre className="text-blue-400 text-sm overflow-x-auto">
            <code>{`version: '3.8'

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
  postgres_data:`}</code>
          </pre>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Health Checks & Monitoring
        </h3>
        <p className="text-slate-700 mb-4">
          Add health checks to monitor your application status:
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <pre className="text-blue-400 text-sm overflow-x-auto">
            <code>{`// In Program.cs
builder.Services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>()
    .AddNpgSql(builder.Configuration.GetConnectionString("DefaultConnection")!);

// Configure the HTTP request pipeline
app.MapHealthChecks("/health");
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready"),
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false
});`}</code>
          </pre>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <TestTube className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-semibold text-slate-900">xUnit Testing</h4>
          </div>
          <p className="text-sm text-slate-600">
            Comprehensive unit and integration testing framework for .NET
            applications.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Rocket className="w-5 h-5 text-green-600 mr-2" />
            <h4 className="font-semibold text-slate-900">Docker Deployment</h4>
          </div>
          <p className="text-sm text-slate-600">
            Containerized deployment with multi-stage builds and production
            optimization.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Monitor className="w-5 h-5 text-purple-600 mr-2" />
            <h4 className="font-semibold text-slate-900">Health Monitoring</h4>
          </div>
          <p className="text-sm text-slate-600">
            Built-in health checks for application and database connectivity
            monitoring.
          </p>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-2">
          Production Deployment Checklist:
        </h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Configure environment-specific settings</li>
          <li>• Set up SSL/TLS certificates for HTTPS</li>
          <li>• Implement proper logging and monitoring</li>
          <li>• Configure database connection pooling</li>
          <li>• Set up automated backups</li>
          <li>• Enable health checks and readiness probes</li>
          <li>• Configure rate limiting and security headers</li>
        </ul>
      </div>
    </div>
  ),
};
