import React from "react";
import { Database, Table, Key } from "lucide-react";

export const DatabaseSection = {
  id: "database",
  title: "Entity Framework & Models",
  icon: <Database className="w-5 h-5" />,
  overview:
    "Set up Entity Framework Core with PostgreSQL and create data models.",
  content: (
    <div className="lesson-content">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Database Setup with Entity Framework Core
        </h2>
        <p className="text-slate-700 mb-6">
          Entity Framework Core (EF Core) is an ORM that maps C# objects to
          database tables, providing type-safe queries and automatic change
          tracking.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Creating Data Models
        </h3>
        <p className="text-slate-700 mb-4">
          Models represent database tables as C# classes. Create{" "}
          <code className="bg-slate-100 px-2 py-1 rounded">Models/User.cs</code>
          :
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <pre className="text-blue-400 text-sm overflow-x-auto">
            <code>{`using System.ComponentModel.DataAnnotations;

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
    
    // Navigation properties for relationships
    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();
}`}</code>
          </pre>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Database Context
        </h3>
        <p className="text-slate-700 mb-4">
          The DbContext manages database connections and entity tracking. Create{" "}
          <code className="bg-slate-100 px-2 py-1 rounded">
            Data/AppDbContext.cs
          </code>
          :
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <pre className="text-blue-400 text-sm overflow-x-auto">
            <code>{`using Microsoft.EntityFrameworkCore;
using CSharpBackend.Models;

namespace CSharpBackend.Data;

public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Post> Posts { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Username).IsUnique();
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.CreatedAt).HasDefaultValueSql("NOW()");
        });

        // Configure relationships
        modelBuilder.Entity<Post>()
            .HasOne(p => p.User)
            .WithMany(u => u.Posts)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}`}</code>
          </pre>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Entity Framework Migrations
        </h3>
        <p className="text-slate-700 mb-4">
          Migrations track database schema changes and apply them
          systematically:
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-4">
          <pre className="text-green-400 text-sm overflow-x-auto">
            <code>{`# Create initial migration
dotnet ef migrations add CreateInitialSchema

# Update database with migrations
dotnet ef database update

# Add new migration for changes
dotnet ef migrations add AddUserEmail`}</code>
          </pre>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Repository Pattern
        </h3>
        <p className="text-slate-700 mb-4">
          Implement the repository pattern for cleaner data access. Create{" "}
          <code className="bg-slate-100 px-2 py-1 rounded">
            Repositories/IUserRepository.cs
          </code>
          :
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <pre className="text-blue-400 text-sm overflow-x-auto">
            <code>{`using CSharpBackend.Models;

namespace CSharpBackend.Repositories;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id);
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetByEmailAsync(string email);
    Task<IEnumerable<User>> GetAllAsync();
    Task<User> CreateAsync(User user);
    Task<User> UpdateAsync(User user);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
    Task<bool> UsernameExistsAsync(string username);
    Task<bool> EmailExistsAsync(string email);
}`}</code>
          </pre>
        </div>

        <p className="text-slate-700 mb-4">
          Implementation in{" "}
          <code className="bg-slate-100 px-2 py-1 rounded">
            Repositories/UserRepository.cs
          </code>
          :
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <pre className="text-blue-400 text-sm overflow-x-auto">
            <code>{`using Microsoft.EntityFrameworkCore;
using CSharpBackend.Data;
using CSharpBackend.Models;

namespace CSharpBackend.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users
            .Include(u => u.Posts)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<User> CreateAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<bool> UsernameExistsAsync(string username)
    {
        return await _context.Users
            .AnyAsync(u => u.Username == username);
    }
}`}</code>
          </pre>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Table className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-semibold text-slate-900">DbSet Properties</h4>
          </div>
          <p className="text-sm text-slate-600">
            Represent database tables and provide LINQ query capabilities for
            type-safe operations.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Key className="w-5 h-5 text-green-600 mr-2" />
            <h4 className="font-semibold text-slate-900">Data Annotations</h4>
          </div>
          <p className="text-sm text-slate-600">
            Attributes like [Required] and [EmailAddress] that define validation
            rules and constraints.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Database className="w-5 h-5 text-purple-600 mr-2" />
            <h4 className="font-semibold text-slate-900">Migrations</h4>
          </div>
          <p className="text-sm text-slate-600">
            Version control for database schemas, allowing incremental updates
            and rollbacks.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">
          EF Core Best Practices:
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use async methods for all database operations</li>
          <li>• Implement proper indexing for frequently queried columns</li>
          <li>• Use Include() for loading related entities efficiently</li>
          <li>• Always validate input data with data annotations</li>
          <li>• Use the repository pattern for testable data access</li>
        </ul>
      </div>
    </div>
  ),
};
