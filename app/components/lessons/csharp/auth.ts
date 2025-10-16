import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "JWT Authentication & Security",
  description:
    "Implement secure JWT authentication with registration and login endpoints, password hashing, and authorization.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <p>JSON Web Tokens (JWT) provide a secure way to authenticate users and authorize access to protected resources in your ASP.NET Core API.</p>

    <h2>Authentication Controller</h2>
    
    <p>Create secure registration and login endpoints:</p>

    <pre class="code-block">
      <code>
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
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
    private readonly ILogger&lt;AuthController&gt; _logger;

    public AuthController(
        IUserRepository userRepository, 
        IConfiguration configuration,
        ILogger&lt;AuthController&gt; logger)
    {
        _userRepository = userRepository;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task&lt;IActionResult&gt; Register([FromBody] CreateUserDto createUserDto)
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
    public async Task&lt;IActionResult&gt; Login([FromBody] LoginDto loginDto)
    {
        try
        {
            var user = await _userRepository.GetByUsernameAsync(loginDto.Username);
            
            if (user == null || !BCrypt.Verify(loginDto.Password, user.Password))
            {
                _logger.LogWarning("Failed login attempt for username: {Username}", loginDto.Username);
                return Unauthorized(new { message = "Invalid credentials" });
            }

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
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
      </code>
    </pre>

    <h2>JWT Configuration</h2>
    
    <p>Configure JWT validation middleware in Program.cs:</p>

    <pre class="code-block">
      <code>
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

builder.Services.AddAuthentication(options =&gt;
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =&gt;
{
    options.RequireHttpsMetadata = false; // Set to true in production
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ClockSkew = TimeSpan.Zero,
        
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
    
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =&gt;
        {
            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
            {
                context.Response.Headers.Add("Token-Expired", "true");
            }
            return Task.CompletedTask;
        }
    };
});
      </code>
    </pre>

    <h2>Password Security Service</h2>
    
    <p>Create a service for secure password operations:</p>

    <pre class="code-block">
      <code>
using BCrypt.Net;

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
        if (string.IsNullOrEmpty(password) || password.Length &lt; 8)
            return false;

        bool hasUpper = password.Any(char.IsUpper);
        bool hasLower = password.Any(char.IsLower);
        bool hasDigit = password.Any(char.IsDigit);
        bool hasSpecial = password.Any(ch =&gt; !char.IsLetterOrDigit(ch));

        return hasUpper && hasLower && hasDigit && hasSpecial;
    }
}
      </code>
    </pre>

    <h2>Authorization Attributes</h2>
    
    <p>Protect your endpoints with authorization:</p>

    <pre class="code-block">
      <code>
// Protect entire controller
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

    // Require authentication
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
}
      </code>
    </pre>

    <h2>Security Best Practices</h2>
    
    <div class="explanation-list">
      <ul>
        <li><strong>HTTPS Only:</strong> Always use HTTPS in production environments</li>
        <li><strong>Token Expiration:</strong> Set appropriate JWT expiration times</li>
        <li><strong>Refresh Tokens:</strong> Implement refresh token mechanism for long sessions</li>
        <li><strong>Password Strength:</strong> Enforce strong password requirements</li>
        <li><strong>Security Logging:</strong> Log authentication events for monitoring</li>
        <li><strong>Secure Storage:</strong> Never store passwords in plain text</li>
      </ul>
    </div>

    <h2>Testing Authentication</h2>
    
    <p>Test your authentication endpoints:</p>
    
    <div class="explanation-list">
      <ul>
        <li><strong>POST /api/auth/register:</strong> Create new user account</li>
        <li><strong>POST /api/auth/login:</strong> Authenticate and get JWT token</li>
        <li><strong>GET /api/users/profile:</strong> Access protected endpoint with Bearer token</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Implement JWT-based authentication system",
    "Create secure user registration and login endpoints",
    "Configure JWT validation middleware",
    "Implement password hashing and validation",
    "Apply authorization attributes to protect endpoints",
  ],
  practiceInstructions: [
    "Create AuthController with register and login endpoints",
    "Configure JWT authentication in Program.cs",
    "Implement secure password hashing with BCrypt",
    "Add authorization attributes to protect API endpoints",
    "Test authentication flow with JWT tokens",
  ],
  hints: [
    "JWT secret key must be at least 32 characters long",
    "Use BCrypt with salt rounds of 12 for secure hashing",
    "Include user claims in JWT for authorization decisions",
    "Set appropriate token expiration times for security",
  ],
  solution: `// JWT Token Generation
private string GenerateJwtToken(User user)
{
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Email, user.Email)
    };

    var token = new JwtSecurityToken(
        issuer: _configuration["Jwt:Issuer"],
        audience: _configuration["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddHours(24),
        signingCredentials: credentials
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}`,
};
