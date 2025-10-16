import React from "react";
import { Shield, Key, Lock } from "lucide-react";

export const AuthSection = {
  id: "auth",
  title: "JWT Authentication & Security",
  icon: <Shield className="w-5 h-5" />,
  overview:
    "Implement secure JWT authentication with registration and login endpoints.",
  content: (
    <div className="lesson-content">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          JWT Authentication System
        </h2>
        <p className="text-slate-700 mb-6">
          JSON Web Tokens (JWT) provide a secure way to authenticate users and
          authorize access to protected resources in your ASP.NET Core API.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Authentication Controller
        </h3>
        <p className="text-slate-700 mb-4">
          Create secure registration and login endpoints. Build{" "}
          <code className="bg-slate-100 px-2 py-1 rounded">
            Controllers/AuthController.cs
          </code>
          :
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <pre className="text-blue-400 text-sm overflow-x-auto">
            <code>{`using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using CSharpBackend.Data;
using CSharpBackend.Models;
using CSharpBackend.DTOs;
using CSharpBackend.Repositories;

namespace CSharpBackend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IUserRepository userRepository, 
        IConfiguration configuration,
        ILogger<AuthController> logger)
    {
        _userRepository = userRepository;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] CreateUserDto createUserDto)
    {
        try
        {
            // Check if username already exists
            if (await _userRepository.UsernameExistsAsync(createUserDto.Username))
            {
                return BadRequest(new { message = "Username already exists" });
            }

            // Check if email already exists
            if (await _userRepository.EmailExistsAsync(createUserDto.Email))
            {
                return BadRequest(new { message = "Email already exists" });
            }

            // Create new user with hashed password
            var user = new User
            {
                Username = createUserDto.Username,
                Email = createUserDto.Email,
                Password = BCrypt.HashPassword(createUserDto.Password),
                CreatedAt = DateTime.UtcNow
            };

            var createdUser = await _userRepository.CreateAsync(user);
            
            _logger.LogInformation("New user registered: {Username}", user.Username);

            // Return user info without password
            var userDto = new UserDto
            {
                Id = createdUser.Id,
                Username = createdUser.Username,
                Email = createdUser.Email,
                CreatedAt = createdUser.CreatedAt
            };

            return CreatedAtAction(nameof(GetUser), new { id = createdUser.Id }, userDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during user registration");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            // Find user by username
            var user = await _userRepository.GetByUsernameAsync(loginDto.Username);
            
            if (user == null || !BCrypt.Verify(loginDto.Password, user.Password))
            {
                _logger.LogWarning("Failed login attempt for username: {Username}", loginDto.Username);
                return Unauthorized(new { message = "Invalid credentials" });
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);
            
            _logger.LogInformation("User logged in successfully: {Username}", user.Username);

            return Ok(new 
            { 
                token = token,
                user = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    CreatedAt = user.CreatedAt
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred during user login");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    private string GenerateJwtToken(User user)
    {
        var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not found");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("username", user.Username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, 
                new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString(), 
                ClaimValueTypes.Integer64)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24), // 24-hour expiration
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    [HttpGet("user/{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
        {
            return NotFound();
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
}`}</code>
          </pre>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Password Security
        </h3>
        <p className="text-slate-700 mb-4">
          Use BCrypt for secure password hashing. Create{" "}
          <code className="bg-slate-100 px-2 py-1 rounded">
            Services/PasswordService.cs
          </code>
          :
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <pre className="text-blue-400 text-sm overflow-x-auto">
            <code>{`using BCrypt.Net;

namespace CSharpBackend.Services;

public interface IPasswordService
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string hashedPassword);
    bool IsPasswordStrong(string password);
}

public class PasswordService : IPasswordService
{
    public string HashPassword(string password)
    {
        // Generate salt and hash password
        return BCrypt.HashPassword(password, BCrypt.GenerateSalt(12));
    }

    public bool VerifyPassword(string password, string hashedPassword)
    {
        try
        {
            return BCrypt.Verify(password, hashedPassword);
        }
        catch
        {
            return false;
        }
    }

    public bool IsPasswordStrong(string password)
    {
        if (string.IsNullOrEmpty(password) || password.Length < 8)
            return false;

        bool hasUpper = password.Any(char.IsUpper);
        bool hasLower = password.Any(char.IsLower);
        bool hasDigit = password.Any(char.IsDigit);
        bool hasSpecial = password.Any(ch => !char.IsLetterOrDigit(ch));

        return hasUpper && hasLower && hasDigit && hasSpecial;
    }
}`}</code>
          </pre>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          JWT Token Validation
        </h3>
        <p className="text-slate-700 mb-4">
          Configure JWT validation middleware for protecting endpoints:
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <pre className="text-blue-400 text-sm overflow-x-auto">
            <code>{`// In Program.cs
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Set to true in production
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ClockSkew = TimeSpan.Zero, // Reduce clock skew to zero
        
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
    
    // Custom JWT events for better error handling
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
            {
                context.Response.Headers.Add("Token-Expired", "true");
            }
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            // Additional validation logic can go here
            return Task.CompletedTask;
        }
    };
});`}</code>
          </pre>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Authorization Attributes
        </h3>
        <p className="text-slate-700 mb-4">
          Protect your endpoints with different authorization levels:
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <pre className="text-blue-400 text-sm overflow-x-auto">
            <code>{`// Protect entire controller
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    // Allow anonymous access to specific actions
    [AllowAnonymous]
    [HttpGet("public")]
    public IActionResult GetPublicData()
    {
        return Ok(new { message = "This is public data" });
    }

    // Require authentication for this action
    [HttpGet("profile")]
    public IActionResult GetProfile()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Ok(new { userId = userId });
    }

    // Custom authorization policy
    [Authorize(Policy = "AdminOnly")]
    [HttpGet("admin")]
    public IActionResult GetAdminData()
    {
        return Ok(new { message = "Admin-only data" });
    }
}`}</code>
          </pre>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Key className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-semibold text-slate-900">JWT Tokens</h4>
          </div>
          <p className="text-sm text-slate-600">
            Stateless authentication tokens containing user claims and
            expiration information.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Lock className="w-5 h-5 text-green-600 mr-2" />
            <h4 className="font-semibold text-slate-900">BCrypt Hashing</h4>
          </div>
          <p className="text-sm text-slate-600">
            Secure password hashing with salt generation for protecting user
            credentials.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Shield className="w-5 h-5 text-purple-600 mr-2" />
            <h4 className="font-semibold text-slate-900">Authorization</h4>
          </div>
          <p className="text-sm text-slate-600">
            Attribute-based protection for controllers and actions with flexible
            policies.
          </p>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-red-800 mb-2">
          Security Best Practices:
        </h4>
        <ul className="text-sm text-red-700 space-y-1">
          <li>• Always use HTTPS in production environments</li>
          <li>• Set appropriate JWT expiration times (not too long)</li>
          <li>• Implement refresh token mechanism for long-lived sessions</li>
          <li>• Use strong password requirements and validation</li>
          <li>• Log authentication events for security monitoring</li>
          <li>• Never store passwords in plain text</li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">
          Testing Authentication:
        </h4>
        <p className="text-sm text-blue-700 mb-2">
          Use these endpoints to test your authentication:
        </p>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• POST /api/auth/register - Create new user account</li>
          <li>• POST /api/auth/login - Authenticate and get JWT token</li>
          <li>
            • GET /api/users/profile - Access protected endpoint with Bearer
            token
          </li>
        </ul>
      </div>
    </div>
  ),
};
