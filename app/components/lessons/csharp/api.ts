import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "ASP.NET Web API & Controllers",
  description:
    "Build RESTful APIs with ASP.NET Core controllers, implement CRUD operations, and create custom middleware.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>ASP.NET Core provides powerful features for building RESTful APIs with automatic model binding, validation, and built-in dependency injection.</p>

    <h2>Server Configuration</h2>
    
    <p>Configure your ASP.NET Core server with essential services:</p>

    <pre class="code-block">
      <code>
using Microsoft.EntityFrameworkCore;
using CSharpBackend.Data;
using CSharpBackend.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database configuration
builder.Services.AddDbContext&lt;AppDbContext&gt;(options =&gt;
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repository pattern registration
builder.Services.AddScoped&lt;IUserRepository, UserRepository&gt;();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
      </code>
    </pre>

    <h2>Creating API Controllers</h2>
    
    <p>Build a users controller with full CRUD operations:</p>

    <pre class="code-block">
      <code>
// Import statements - bring in necessary ASP.NET Core classes
using Microsoft.AspNetCore.Mvc;              // Controller base classes and attributes
using Microsoft.AspNetCore.Authorization;     // [Authorize] attribute
using CSharpBackend.Models;                  // Domain models (User, etc.)
using CSharpBackend.Repositories;            // Data access layer interfaces
using CSharpBackend.DTOs;                    // Data Transfer Objects

// namespace groups related classes together (like folders)
namespace CSharpBackend.Controllers;

// [Route] defines base URL for all endpoints in this controller
// [controller] is replaced with class name minus "Controller"
// UsersController -> /api/users
[Route("api/[controller]")]

// [ApiController] enables API-specific features:
// - Automatic model validation (400 response if model invalid)
// - Infers parameter sources ([FromBody], [FromRoute], etc.)
// - Better error responses
[ApiController]

// [Authorize] requires authentication for ALL methods in this controller
// Without valid JWT token, requests get 401 Unauthorized
// Can be overridden per method with [AllowAnonymous]
[Authorize]

// public class = accessible from anywhere
// : ControllerBase = inherit from base controller (for APIs)
// ControllerBase has methods like Ok(), NotFound(), BadRequest(), etc.
public class UsersController : ControllerBase
{
    // readonly = can only be set in constructor (immutable after)
    // IUserRepository = interface (abstraction for data access)
    // Injected via Dependency Injection in constructor
    private readonly IUserRepository _userRepository;

    // Constructor - ASP.NET Core automatically injects IUserRepository
    // When request comes in, DI container creates instance and passes it here
    public UsersController(IUserRepository userRepository)
    {
        // Assign injected repository to private field
        _userRepository = userRepository;
    }

    // GET: /api/users - Get all users
    [HttpGet]  // Responds to HTTP GET requests
    // async = method can use await (non-blocking)
    // Task<T> = asynchronous operation that returns T
    // ActionResult<T> = HTTP response with data of type T
    // IEnumerable<UserDto> = collection of UserDto objects
    public async Task&lt;ActionResult&lt;IEnumerable&lt;UserDto&gt;&gt;&gt; GetUsers()
    {
        // await = wait for async operation without blocking thread
        // GetAllAsync() queries database for all users
        var users = await _userRepository.GetAllAsync();
        
        // LINQ (Language Integrated Query) - transform data
        // Select() = like JavaScript .map() - transforms each item
        // u => creates lambda expression (anonymous function)
        // Project User model to UserDto (hide sensitive data like passwords)
        var userDtos = users.Select(u =&gt; new UserDto
        {
            // Object initializer syntax - set properties
            Id = u.Id,
            Username = u.Username,
            Email = u.Email,
            CreatedAt = u.CreatedAt
            // Notice: Password is NOT included (hidden from API response)
        });
        
        // Ok() returns HTTP 200 with data
        // ASP.NET Core automatically serializes to JSON
        return Ok(userDtos);
    }

    // GET: /api/users/5 - Get user by ID
    // {id} is route parameter (captured from URL)
    [HttpGet("{id}")]
    public async Task&lt;ActionResult&lt;UserDto&gt;&gt; GetUser(int id)
    {
        // GetByIdAsync queries database for user with matching ID
        // Returns null if not found
        var user = await _userRepository.GetByIdAsync(id);
        
        // Check if user exists
        if (user == null)
        {
            // NotFound() returns HTTP 404
            // new { } creates anonymous object (quick object creation)
            return NotFound(new { message = "User not found" });
        }

        // Manual DTO mapping (one property at a time)
        // Alternative: Use AutoMapper library for automatic mapping
        var userDto = new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            CreatedAt = user.CreatedAt
        };

        // Return 200 OK with user data
        return Ok(userDto);
    }

    // PUT: /api/users/5 - Update user
    [HttpPut("{id}")]
    // IActionResult = HTTP response without data (just status code)
    // UpdateUserDto = DTO with only updateable fields
    public async Task&lt;IActionResult&gt; UpdateUser(int id, UpdateUserDto updateUserDto)
    {
        // First, check if user exists
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        // Update only non-null, non-empty fields
        // string.IsNullOrEmpty() checks if string is null or ""
        // ! = logical NOT operator
        if (!string.IsNullOrEmpty(updateUserDto.Email))
        {
            // Update email if provided
            user.Email = updateUserDto.Email;
        }
        
        // DateTime.UtcNow = current UTC time (best practice for databases)
        // Always use UTC to avoid timezone issues
        user.UpdatedAt = DateTime.UtcNow;

        // Save changes to database
        await _userRepository.UpdateAsync(user);
        
        // NoContent() returns HTTP 204 (success with no response body)
        // Standard for successful PUT/DELETE operations
        return NoContent();
    }

    // DELETE: /api/users/5 - Delete user
    [HttpDelete("{id}")]
    public async Task&lt;IActionResult&gt; DeleteUser(int id)
    {
        // Check if user exists before trying to delete
        // ExistsAsync() is more efficient than GetByIdAsync()
        // (doesn't load full user object, just checks existence)
        var exists = await _userRepository.ExistsAsync(id);
        if (!exists)
        {
            return NotFound(new { message = "User not found" });
        }

        // Delete user from database
        await _userRepository.DeleteAsync(id);
        
        // Return 204 No Content (successful deletion)
        return NoContent();
    }
}
      </code>
    </pre>

    <h2>Data Transfer Objects (DTOs)</h2>
    
    <p>DTOs control what data is exposed in your API responses:</p>

    <pre class="code-block">
      <code>
// DataAnnotations = validation attributes for models
using System.ComponentModel.DataAnnotations;

namespace CSharpBackend.DTOs;

// UserDto = Data Transfer Object for GET requests
// DTOs control what data is exposed in API responses
// Separates internal model from external API contract
public class UserDto
{
    // Properties = like fields but with get/set methods
    // get; set; = auto-implemented property (compiler generates backing field)
    public int Id { get; set; }
    
    // = string.Empty sets default value (prevents null)
    // string.Empty is same as "" but more explicit
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    
    // DateTime = date and time structure
    public DateTime CreatedAt { get; set; }
    
    // NOTICE: No Password property!
    // DTOs let you hide sensitive data from API responses
}

// CreateUserDto = for POST requests (creating new users)
// Includes validation attributes that ASP.NET Core validates automatically
public class CreateUserDto
{
    // [Required] = field cannot be null or empty
    // ASP.NET Core returns 400 Bad Request if missing
    [Required]
    
    // [StringLength] validates text length
    // Max = 50 characters, Min = 3 characters
    // Returns 400 if outside this range
    [StringLength(50, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;

    [Required]
    
    // [EmailAddress] validates email format
    // Checks for @ symbol, valid domain, etc.
    // Returns 400 if invalid email format
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    
    // Password validation: 6-100 characters
    // In real apps, use additional validation:
    // - Uppercase + lowercase letters
    // - Numbers
    // - Special characters
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;
}

// UpdateUserDto = for PUT/PATCH requests (updating existing users)
// All fields optional (? makes them nullable)
public class UpdateUserDto
{
    // string? = nullable string (can be null)
    // Without ?, C# 8+ nullable reference types would warn
    [EmailAddress]  // Still validate format IF provided
    public string? Email { get; set; }
    
    // No validation attributes = accept any value
    // Application logic decides if valid
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    
    // Only include fields that users should be able to update
    // Don't include Id, CreatedAt, etc. (immutable fields)
}
      </code>
    </pre>

    <h2>Custom Middleware</h2>
    
    <p>Create custom middleware for request logging:</p>

    <pre class="code-block">
      <code>
// namespace = like a folder for organizing code
// Prevents naming conflicts (like multiple Logger classes)
namespace CSharpBackend.Middleware;

// Middleware = component that processes HTTP requests
// This one logs request details (method, path, duration, status)
public class RequestLoggingMiddleware
{
    // RequestDelegate = next middleware in pipeline
    // _next() calls the next middleware (like Express's next())
    private readonly RequestDelegate _next;
    
    // ILogger = logging interface from ASP.NET Core
    // Used to write log messages to configured outputs (console, file, etc.)
    private readonly ILogger&lt;RequestLoggingMiddleware&gt; _logger;

    // Constructor receives dependencies via Dependency Injection
    // ASP.NET Core automatically provides these when creating middleware
    public RequestLoggingMiddleware(RequestDelegate next, ILogger&lt;RequestLoggingMiddleware&gt; logger)
    {
        _next = next;
        _logger = logger;
    }

    // InvokeAsync = called for EVERY incoming HTTP request
    // HttpContext = contains request and response objects
    public async Task InvokeAsync(HttpContext context)
    {
        // Record when request processing started
        // DateTime.UtcNow = current time in UTC (avoids timezone issues)
        var startTime = DateTime.UtcNow;
        
        // Log request start with structured logging
        // {Method} {Path} {StartTime} = placeholders filled with values
        // This creates searchable, structured logs (better than string concatenation)
        _logger.LogInformation("Request: {Method} {Path} started at {StartTime}",
            context.Request.Method,    // GET, POST, PUT, DELETE, etc.
            context.Request.Path,       // /api/users/123
            startTime);

        try
        {
            // Call next middleware in pipeline
            // All remaining middlewares and controller execute here
            await _next(context);
        }
        finally
        {
            // finally = ALWAYS runs (even if exception thrown)
            // Guarantees we log completion even if request failed
            
            // Calculate request duration
            // Subtract start time from current time
            var duration = DateTime.UtcNow - startTime;
            
            // Log request completion with timing and status
            // duration.TotalMilliseconds = converts TimeSpan to milliseconds
            _logger.LogInformation("Request: {Method} {Path} completed in {Duration}ms with status {StatusCode}",
                context.Request.Method,
                context.Request.Path,
                duration.TotalMilliseconds,  // How long request took
                context.Response.StatusCode); // 200, 404, 500, etc.
        }
    }
}

// Extension method for easier registration
// Makes registration cleaner: app.UseRequestLogging() instead of app.UseMiddleware<RequestLoggingMiddleware>()
public static class RequestLoggingMiddlewareExtensions
{
    // static = method belongs to class, not instance
    // this IApplicationBuilder = extends IApplicationBuilder with new method
    // Like JavaScript: String.prototype.myMethod = function() { }
    public static IApplicationBuilder UseRequestLogging(this IApplicationBuilder builder)
    {
        // UseMiddleware<T> adds our middleware to the pipeline
        // Returns builder for method chaining: app.UseRequestLogging().UseAuth()
        return builder.UseMiddleware&lt;RequestLoggingMiddleware&gt;();
    }
}

// USAGE IN Program.cs:
// app.UseRequestLogging();  // Clean syntax thanks to extension method
      </code>
    </pre>

    <h2>API Development Best Practices</h2>
    
    <div class="explanation-list">
      <ul>
        <li><strong>HTTP Status Codes:</strong> Use proper codes (200, 201, 400, 401, 404, 500)</li>
        <li><strong>Error Handling:</strong> Implement consistent error response formats</li>
        <li><strong>DTOs:</strong> Control data exposure and validation</li>
        <li><strong>Logging:</strong> Add comprehensive structured logging</li>
        <li><strong>Authorization:</strong> Implement proper authorization checks</li>
        <li><strong>Async Operations:</strong> Use async/await for all I/O operations</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Configure ASP.NET Core server with essential services",
    "Build RESTful API controllers with CRUD operations",
    "Implement Data Transfer Objects for API responses",
    "Create custom middleware for request processing",
    "Apply API development best practices",
  ],
  practiceInstructions: [
    "Set up Program.cs with database and service registration",
    "Create a UsersController with GET, POST, PUT, DELETE endpoints",
    "Implement DTOs for request and response data",
    "Add custom middleware for request logging",
    "Test your API endpoints using Swagger or Postman",
  ],
  hints: [
    "Use [Route] and [HttpGet] attributes for endpoint routing",
    "Return appropriate HTTP status codes for each operation",
    "Use DTOs to separate API contracts from domain models",
    "Middleware runs in the order it's registered in Program.cs",
  ],
  solution: `// Complete API controller example
[HttpGet("{id}")]
public async Task<ActionResult<UserDto>> GetUser(int id)
{
    var user = await _userRepository.GetByIdAsync(id);
    
    if (user == null)
    {
        return NotFound(new { message = "User not found" });
    }

    var userDto = new UserDto
    {
        Id = user.Id,
        Username = user.Username,
        Email = user.Email,
        CreatedAt = user.CreatedAt
    };

    return Ok(userDto);
}`,
};
