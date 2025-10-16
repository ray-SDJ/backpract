import React from "react";
import { Globe, Route, Layers } from "lucide-react";

export const ApiSection = {
  id: "api",
  title: "ASP.NET Web API & Controllers",
  icon: <Globe className="w-5 h-5" />,
  overview: "Build RESTful APIs with ASP.NET Core controllers and middleware.",
  content: (
    <div className="lesson-content">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Building RESTful APIs
        </h2>
        <p className="text-slate-700 mb-6">
          ASP.NET Core provides powerful features for building RESTful APIs with
          automatic model binding, validation, and built-in dependency
          injection.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Server Configuration
        </h3>
        <p className="text-slate-700 mb-4">
          Configure your ASP.NET Core server in{" "}
          <code className="bg-slate-100 px-2 py-1 rounded">Program.cs</code>:
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <pre className="text-blue-400 text-sm overflow-x-auto">
            <code>{`using Microsoft.EntityFrameworkCore;
using CSharpBackend.Data;
using CSharpBackend.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database configuration
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repository pattern registration
builder.Services.AddScoped<IUserRepository, UserRepository>();

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

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

app.Run();`}</code>
          </pre>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Creating API Controllers
        </h3>
        <p className="text-slate-700 mb-4">
          Build a users controller with full CRUD operations. Create{" "}
          <code className="bg-slate-100 px-2 py-1 rounded">
            Controllers/UsersController.cs
          </code>
          :
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <pre className="text-blue-400 text-sm overflow-x-auto">
            <code>{`using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CSharpBackend.Models;
using CSharpBackend.Repositories;
using CSharpBackend.DTOs;
using System.Security.Claims;

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
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var users = await _userRepository.GetAllAsync();
        var userDtos = users.Select(u => new UserDto
        {
            Id = u.Id,
            Username = u.Username,
            Email = u.Email,
            CreatedAt = u.CreatedAt
        });
        
        return Ok(userDtos);
    }

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
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, UpdateUserDto updateUserDto)
    {
        // Get current user ID from JWT token
        var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        if (currentUserId != id)
        {
            return Forbid("You can only update your own profile");
        }

        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        // Update user properties
        if (!string.IsNullOrEmpty(updateUserDto.Email))
        {
            user.Email = updateUserDto.Email;
        }
        
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);
        
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        if (currentUserId != id)
        {
            return Forbid("You can only delete your own account");
        }

        var exists = await _userRepository.ExistsAsync(id);
        if (!exists)
        {
            return NotFound(new { message = "User not found" });
        }

        await _userRepository.DeleteAsync(id);
        
        return NoContent();
    }
}`}</code>
          </pre>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Data Transfer Objects (DTOs)
        </h3>
        <p className="text-slate-700 mb-4">
          DTOs control what data is exposed in your API responses. Create{" "}
          <code className="bg-slate-100 px-2 py-1 rounded">
            DTOs/UserDto.cs
          </code>
          :
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <pre className="text-blue-400 text-sm overflow-x-auto">
            <code>{`using System.ComponentModel.DataAnnotations;

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

public class LoginDto
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}`}</code>
          </pre>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Custom Middleware
        </h3>
        <p className="text-slate-700 mb-4">
          Create custom middleware for request logging. Create{" "}
          <code className="bg-slate-100 px-2 py-1 rounded">
            Middleware/RequestLoggingMiddleware.cs
          </code>
          :
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <pre className="text-blue-400 text-sm overflow-x-auto">
            <code>{`namespace CSharpBackend.Middleware;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
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
        return builder.UseMiddleware<RequestLoggingMiddleware>();
    }
}`}</code>
          </pre>
        </div>

        <p className="text-slate-700 mb-4">
          Register the middleware in{" "}
          <code className="bg-slate-100 px-2 py-1 rounded">Program.cs</code>{" "}
          (add after{" "}
          <code className="bg-slate-100 px-2 py-1 rounded">
            UseHttpsRedirection
          </code>
          ):
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <pre className="text-green-400 text-sm overflow-x-auto">
            <code>{`app.UseRequestLogging();`}</code>
          </pre>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Route className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-semibold text-slate-900">API Controllers</h4>
          </div>
          <p className="text-sm text-slate-600">
            Handle HTTP requests with automatic model binding, validation, and
            response formatting.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Layers className="w-5 h-5 text-green-600 mr-2" />
            <h4 className="font-semibold text-slate-900">DTOs</h4>
          </div>
          <p className="text-sm text-slate-600">
            Data Transfer Objects that define the shape of request and response
            data.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Globe className="w-5 h-5 text-purple-600 mr-2" />
            <h4 className="font-semibold text-slate-900">Middleware</h4>
          </div>
          <p className="text-sm text-slate-600">
            Components that process requests and responses in the HTTP pipeline.
          </p>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-2">
          API Development Best Practices:
        </h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Use proper HTTP status codes (200, 201, 400, 401, 404, 500)</li>
          <li>• Implement consistent error response formats</li>
          <li>• Use DTOs to control data exposure and validation</li>
          <li>• Add comprehensive logging with structured data</li>
          <li>
            • Implement proper authorization checks for sensitive operations
          </li>
          <li>• Use async/await for all I/O operations</li>
        </ul>
      </div>
    </div>
  ),
};
