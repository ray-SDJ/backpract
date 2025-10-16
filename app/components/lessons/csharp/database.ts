import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Entity Framework & Models",
  description:
    "Set up Entity Framework Core with PostgreSQL, create data models, and implement the repository pattern.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>Entity Framework Core (EF Core) is a powerful ORM that maps C# objects to database tables, providing type-safe queries and change tracking.</p>

    <h2>Creating Data Models</h2>
    
    <p>Define your data models with proper validation attributes:</p>

    <pre class="code-block">
      <code>
using System.ComponentModel.DataAnnotations;

namespace CSharpBackend.Models;

public class User
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Username { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string Password { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    public virtual ICollection&lt;Post&gt; Posts { get; set; } = new List&lt;Post&gt;();
}
      </code>
    </pre>

    <h2>Database Context</h2>
    
    <p>Create the DbContext to manage your entities:</p>

    <pre class="code-block">
      <code>
using Microsoft.EntityFrameworkCore;
using CSharpBackend.Models;

namespace CSharpBackend.Data;

public class AppDbContext : DbContext
{
    public DbSet&lt;User&gt; Users { get; set; }
    public DbSet&lt;Post&gt; Posts { get; set; }

    public AppDbContext(DbContextOptions&lt;AppDbContext&gt; options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity&lt;User&gt;(entity =&gt;
        {
            entity.HasKey(u =&gt; u.Id);
            entity.HasIndex(u =&gt; u.Username).IsUnique();
            entity.HasIndex(u =&gt; u.Email).IsUnique();
            entity.Property(u =&gt; u.CreatedAt).HasDefaultValueSql("NOW()");
        });

        // Configure relationships
        modelBuilder.Entity&lt;Post&gt;()
            .HasOne(p =&gt; p.User)
            .WithMany(u =&gt; u.Posts)
            .HasForeignKey(p =&gt; p.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
      </code>
    </pre>

    <h2>Entity Framework Migrations</h2>
    
    <p>Create and apply database migrations:</p>

    <pre class="code-block">
      <code>
# Create initial migration
dotnet ef migrations add CreateInitialSchema

# Update database with migrations
dotnet ef database update

# Add new migration for changes
dotnet ef migrations add AddUserEmail
      </code>
    </pre>

    <h2>Repository Pattern</h2>
    
    <p>Implement the repository pattern for clean data access:</p>

    <pre class="code-block">
      <code>
using CSharpBackend.Models;

namespace CSharpBackend.Repositories;

public interface IUserRepository
{
    Task&lt;User?&gt; GetByIdAsync(int id);
    Task&lt;User?&gt; GetByUsernameAsync(string username);
    Task&lt;User?&gt; GetByEmailAsync(string email);
    Task&lt;IEnumerable&lt;User&gt;&gt; GetAllAsync();
    Task&lt;User&gt; CreateAsync(User user);
    Task&lt;User&gt; UpdateAsync(User user);
    Task DeleteAsync(int id);
    Task&lt;bool&gt; ExistsAsync(int id);
    Task&lt;bool&gt; UsernameExistsAsync(string username);
    Task&lt;bool&gt; EmailExistsAsync(string email);
}

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task&lt;User?&gt; GetByIdAsync(int id)
    {
        return await _context.Users
            .Include(u =&gt; u.Posts)
            .FirstOrDefaultAsync(u =&gt; u.Id == id);
    }

    public async Task&lt;User?&gt; GetByUsernameAsync(string username)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u =&gt; u.Username == username);
    }

    public async Task&lt;User&gt; CreateAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task&lt;bool&gt; UsernameExistsAsync(string username)
    {
        return await _context.Users
            .AnyAsync(u =&gt; u.Username == username);
    }
}
      </code>
    </pre>

    <h2>Registering Services</h2>
    
    <p>Configure EF Core and repositories in Program.cs:</p>

    <pre class="code-block">
      <code>
// Add to Program.cs
builder.Services.AddDbContext&lt;AppDbContext&gt;(options =&gt;
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped&lt;IUserRepository, UserRepository&gt;();
      </code>
    </pre>

    <h2>Best Practices</h2>
    
    <div class="explanation-list">
      <ul>
        <li><strong>Async Operations:</strong> Use async/await for all database operations</li>
        <li><strong>Data Annotations:</strong> Use validation attributes for input validation</li>
        <li><strong>Indexing:</strong> Add indexes for frequently queried columns</li>
        <li><strong>Navigation Properties:</strong> Use Include() for loading related entities</li>
        <li><strong>Repository Pattern:</strong> Abstraction for testable data access</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Create data models with proper validation attributes",
    "Set up Entity Framework Core DbContext",
    "Configure entity relationships and constraints",
    "Implement database migrations",
    "Use the repository pattern for data access",
  ],
  practiceInstructions: [
    "Create a User model with validation attributes",
    "Set up the AppDbContext with DbSet properties",
    "Configure entity relationships in OnModelCreating",
    "Create and apply your first migration",
    "Implement a repository for the User entity",
  ],
  hints: [
    "Use [Required] and [EmailAddress] for validation",
    "Configure unique indexes for username and email",
    "Include navigation properties for related entities",
    "Use async methods for all database operations",
  ],
  solution: `// Complete User model with repository
[Required]
[StringLength(50)]
public string Username { get; set; } = string.Empty;

[Required]
[EmailAddress]
public string Email { get; set; } = string.Empty;

// Repository implementation
public async Task<User> CreateAsync(User user)
{
    _context.Users.Add(user);
    await _context.SaveChangesAsync();
    return user;
}`,
};
