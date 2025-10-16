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
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CSharpBackend.Models;
using CSharpBackend.Repositories;
using CSharpBackend.DTOs;

namespace CSharpBackend.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;

    public UsersController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpGet]
    public async Task&lt;ActionResult&lt;IEnumerable&lt;UserDto&gt;&gt;&gt; GetUsers()
    {
        var users = await _userRepository.GetAllAsync();
        var userDtos = users.Select(u =&gt; new UserDto
        {
            Id = u.Id,
            Username = u.Username,
            Email = u.Email,
            CreatedAt = u.CreatedAt
        });
        
        return Ok(userDtos);
    }

    [HttpGet("{id}")]
    public async Task&lt;ActionResult&lt;UserDto&gt;&gt; GetUser(int id)
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
    }

    [HttpPut("{id}")]
    public async Task&lt;IActionResult&gt; UpdateUser(int id, UpdateUserDto updateUserDto)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        if (!string.IsNullOrEmpty(updateUserDto.Email))
        {
            user.Email = updateUserDto.Email;
        }
        
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);
        
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task&lt;IActionResult&gt; DeleteUser(int id)
    {
        var exists = await _userRepository.ExistsAsync(id);
        if (!exists)
        {
            return NotFound(new { message = "User not found" });
        }

        await _userRepository.DeleteAsync(id);
        
        return NoContent();
    }
}
      </code>
    </pre>

    <h2>Data Transfer Objects (DTOs)</h2>
    
    <p>DTOs control what data is exposed in your API responses:</p>

    <pre class="code-block">
      <code>
using System.ComponentModel.DataAnnotations;

namespace CSharpBackend.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateUserDto
{
    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;
}

public class UpdateUserDto
{
    [EmailAddress]
    public string? Email { get; set; }
    
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}
      </code>
    </pre>

    <h2>Custom Middleware</h2>
    
    <p>Create custom middleware for request logging:</p>

    <pre class="code-block">
      <code>
namespace CSharpBackend.Middleware;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger&lt;RequestLoggingMiddleware&gt; _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger&lt;RequestLoggingMiddleware&gt; logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var startTime = DateTime.UtcNow;
        
        _logger.LogInformation("Request: {Method} {Path} started at {StartTime}",
            context.Request.Method,
            context.Request.Path,
            startTime);

        try
        {
            await _next(context);
        }
        finally
        {
            var duration = DateTime.UtcNow - startTime;
            _logger.LogInformation("Request: {Method} {Path} completed in {Duration}ms with status {StatusCode}",
                context.Request.Method,
                context.Request.Path,
                duration.TotalMilliseconds,
                context.Response.StatusCode);
        }
    }
}

// Extension method for easier registration
public static class RequestLoggingMiddlewareExtensions
{
    public static IApplicationBuilder UseRequestLogging(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware&lt;RequestLoggingMiddleware&gt;();
    }
}
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
