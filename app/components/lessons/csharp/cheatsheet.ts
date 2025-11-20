import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "C# Cheat Sheet - Complete Reference",
  description:
    "Comprehensive cheat sheet covering C# string methods, collections (List, Dictionary, HashSet), LINQ, and ASP.NET Core backend methods.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <p>A complete reference guide for C# covering essential language methods and ASP.NET Core backend operations.</p>

    <h2>📝 String Methods</h2>
    
    <div class="code-block">
      <pre><code>string text = "Hello World";

// Case Conversion
text.ToUpper()                  // "HELLO WORLD"
text.ToLower()                  // "hello world"

// Search & Check
text.Length                     // 11
text[0]                         // 'H'
text.IndexOf("World")           // 6
text.LastIndexOf("o")          // 7
text.Contains("World")          // true
text.StartsWith("Hello")        // true
text.EndsWith("World")          // true
String.IsNullOrEmpty(text)      // false
String.IsNullOrWhiteSpace(text) // false

// Substring & Replace
text.Substring(0, 5)            // "Hello"
text.Substring(6)               // "World"
text.Replace("World", "C#")     // "Hello C#"

// Splitting & Joining
text.Split(' ')                 // ["Hello", "World"]
text.Split(new[] { ' ', ',' })
String.Join("-", new[] { "a", "b", "c" })  // "a-b-c"

// Trimming & Padding
"  hello  ".Trim()              // "hello"
"  hello  ".TrimStart()         // "hello  "
"  hello  ".TrimEnd()           // "  hello"
"5".PadLeft(3, '0')            // "005"
"5".PadRight(3, '0')           // "500"

// Formatting
String.Format("Name: {0}, Age: {1}", "Alice", 30)
$"Name: {"Alice"}, Age: {30}"  // String interpolation
$"Price: {price:C}"             // Currency format
$"Date: {date:yyyy-MM-dd}"      // Date format
$"Number: {num:N2}"             // 2 decimal places

// Comparison
text.Equals("Hello World")                    // true
text.Equals("hello world", StringComparison.OrdinalIgnoreCase)
String.Compare(text, "Hello World")           // 0 (equal)

// Other
text.Insert(5, " Beautiful")    // "Hello Beautiful World"
text.Remove(5)                  // "Hello"
text.Remove(5, 6)              // "Hello"
text.ToCharArray()             // ['H', 'e', 'l', 'l', 'o', ...]
new String('*', 5)             // "*****"</code></pre>
    </div>

    <h2>📋 List<T> Methods</h2>
    
    <div class="code-block">
      <pre><code>using System.Collections.Generic;

List<int> nums = new List<int> { 1, 2, 3, 4, 5 };

// Adding Elements
nums.Add(6);                    // Add to end
nums.Insert(0, 0);              // Insert at index
nums.AddRange(new[] { 7, 8 });  // Add multiple

// Accessing Elements
nums[0]                         // 0
nums.First()                    // First element
nums.Last()                     // Last element
nums.ElementAt(2)               // Element at index

// Removing Elements
nums.Remove(0)                  // Remove first occurrence
nums.RemoveAt(0)                // Remove at index
nums.RemoveRange(0, 2)          // Remove range
nums.RemoveAll(n => n > 5)      // Remove matching
nums.Clear()                    // Remove all

// Searching
nums.Contains(3)                // true
nums.IndexOf(3)                 // Index of first occurrence
nums.LastIndexOf(3)             // Index of last occurrence
nums.Find(n => n > 3)           // First matching element
nums.FindAll(n => n > 3)        // All matching elements
nums.FindIndex(n => n > 3)      // Index of first match
nums.Exists(n => n > 3)         // Check if any match

// Sorting & Reversing
nums.Sort();                    // Sort ascending
nums.Sort((a, b) => b.CompareTo(a));  // Sort descending
nums.Reverse();                 // Reverse in place

// Conversion
int[] array = nums.ToArray();
List<int> copy = new List<int>(nums);

// Other
nums.Count                      // Length
nums.Capacity                   // Current capacity
nums.GetRange(1, 3)            // Sublist from index 1, count 3
nums.ForEach(n => Console.WriteLine(n));</code></pre>
    </div>

    <h2>🗺️ Dictionary<TKey, TValue> Methods</h2>
    
    <div class="code-block">
      <pre><code>Dictionary<string, int> dict = new Dictionary<string, int>();

// Adding/Updating
dict.Add("Alice", 30);
dict["Bob"] = 25;                       // Add or update
dict.TryAdd("Alice", 35);               // Only if key doesn't exist

// Accessing
dict["Alice"]                           // 30 (throws if not found)
dict.TryGetValue("Alice", out int age); // Safe get
dict.GetValueOrDefault("Charlie", 0);   // With default

// Removing
dict.Remove("Alice")                    // Returns true if removed
dict.Remove("Bob", out int bobAge)      // Remove and get value
dict.Clear()

// Checking
dict.ContainsKey("Alice")               // true
dict.ContainsValue(30)                  // true

// Iteration
foreach (var key in dict.Keys) { }
foreach (var value in dict.Values) { }
foreach (var kvp in dict)
{
    var key = kvp.Key;
    var value = kvp.Value;
}

// Other
dict.Count                              // Number of items
dict.Keys                               // Collection of keys
dict.Values                             // Collection of values</code></pre>
    </div>

    <h2>🎯 HashSet<T> Methods</h2>
    
    <div class="code-block">
      <pre><code>HashSet<int> set = new HashSet<int> { 1, 2, 3, 4, 5 };

// Adding/Removing
set.Add(6);                     // Returns true if added
set.Remove(1);                  // Returns true if removed
set.RemoveWhere(n => n > 5);
set.Clear();

// Checking
set.Contains(3)                 // true
set.Count                       // Length

// Set Operations
HashSet<int> a = new HashSet<int> { 1, 2, 3 };
HashSet<int> b = new HashSet<int> { 3, 4, 5 };

a.UnionWith(b);                 // a = {1, 2, 3, 4, 5}
a.IntersectWith(b);             // a = {3}
a.ExceptWith(b);                // a = {1, 2}
a.SymmetricExceptWith(b);       // a = {1, 2, 4, 5}

// Subset/Superset
a.IsSubsetOf(b)
a.IsSupersetOf(b)
a.Overlaps(b)                   // Have common elements
a.SetEquals(b)                  // Same elements

// Conversion
int[] array = set.ToArray();
List<int> list = set.ToList();</code></pre>
    </div>

    <h2>🌊 LINQ Methods</h2>
    
    <div class="code-block">
      <pre><code>using System.Linq;

List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// Filtering
numbers.Where(n => n > 5)               // [6, 7, 8, 9, 10]
numbers.Where((n, i) => i % 2 == 0)     // Elements at even indices

// Projection
numbers.Select(n => n * 2)              // [2, 4, 6, 8, 10, ...]
numbers.Select((n, i) => new { Index = i, Value = n })

// SelectMany (flatten)
var nested = new List<List<int>> { 
    new List<int> { 1, 2 }, 
    new List<int> { 3, 4 } 
};
nested.SelectMany(list => list)         // [1, 2, 3, 4]

// Ordering
numbers.OrderBy(n => n)                 // Ascending
numbers.OrderByDescending(n => n)       // Descending
numbers.OrderBy(n => n).ThenBy(n => n)  // Multiple ordering

// Distinct & GroupBy
numbers.Distinct()
numbers.GroupBy(n => n % 2)             // Group by even/odd
numbers.GroupBy(n => n % 2, n => n * 2) // Group and project

// Aggregation
numbers.Count()
numbers.Count(n => n > 5)
numbers.Sum()
numbers.Average()
numbers.Min()
numbers.Max()
numbers.Aggregate(0, (sum, n) => sum + n)  // Custom aggregation

// Element Operations
numbers.First()                         // First element
numbers.FirstOrDefault()                // First or default value
numbers.First(n => n > 5)              // First matching
numbers.Last()
numbers.LastOrDefault()
numbers.Single()                        // Exactly one element
numbers.SingleOrDefault()
numbers.ElementAt(3)

// Quantifiers
numbers.Any(n => n > 5)                // At least one > 5
numbers.All(n => n > 0)                // All positive
numbers.Contains(5)

// Set Operations
var a = new List<int> { 1, 2, 3 };
var b = new List<int> { 3, 4, 5 };

a.Union(b)                             // {1, 2, 3, 4, 5}
a.Intersect(b)                         // {3}
a.Except(b)                            // {1, 2}

// Partitioning
numbers.Take(5)                        // First 5
numbers.Skip(5)                        // Skip first 5
numbers.TakeWhile(n => n < 5)         // Take until condition fails
numbers.SkipWhile(n => n < 5)         // Skip until condition fails

// Conversion
numbers.ToArray()
numbers.ToList()
numbers.ToDictionary(n => n, n => n * 2)
numbers.ToHashSet()

// Query Syntax
var result = from n in numbers
             where n > 5
             orderby n descending
             select n * 2;</code></pre>
    </div>

    <h2>🌐 ASP.NET Core - Controller</h2>
    
    <div class="code-block">
      <pre><code>using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    // GET: api/users
    [HttpGet]
    public ActionResult<IEnumerable<User>> GetAll(
        [FromQuery] int page = 0,
        [FromQuery] int size = 10,
        [FromQuery] string? search = null)
    {
        return Ok(users);
    }

    // GET: api/users/5
    [HttpGet("{id}")]
    public ActionResult<User> GetById(int id)
    {
        if (user == null)
            return NotFound();
        
        return Ok(user);
    }

    // POST: api/users
    [HttpPost]
    public ActionResult<User> Create([FromBody] User user)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    // PUT: api/users/5
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] User user)
    {
        if (id != user.Id)
            return BadRequest();
        
        return NoContent();
    }

    // DELETE: api/users/5
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        return NoContent();
    }

    // PATCH: api/users/5
    [HttpPatch("{id}")]
    public ActionResult<User> Patch(
        int id, 
        [FromBody] JsonPatchDocument<User> patchDoc)
    {
        return Ok(updatedUser);
    }

    // Response types
    return Ok(data);                           // 200
    return Created(uri, data);                 // 201
    return CreatedAtAction("GetById", new { id }, data);
    return NoContent();                        // 204
    return BadRequest();                       // 400
    return BadRequest(ModelState);
    return Unauthorized();                     // 401
    return Forbid();                           // 403
    return NotFound();                         // 404
    return Conflict();                         // 409
    return StatusCode(500, error);             // Custom status

    // Request sources
    [FromBody]      // Request body (JSON)
    [FromRoute]     // URL route parameters
    [FromQuery]     // Query string parameters
    [FromHeader]    // Request headers
    [FromForm]      // Form data
    [FromServices]  // Dependency injection
}</code></pre>
    </div>

    <h2>🗄️ Entity Framework Core</h2>
    
    <div class="code-block">
      <pre><code>using Microsoft.EntityFrameworkCore;

// DbContext
public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Username).IsRequired().HasMaxLength(50);
        });
    }
}

// CRUD Operations
using (var context = new AppDbContext())
{
    // Create
    var user = new User { Username = "alice", Email = "alice@email.com" };
    context.Users.Add(user);
    await context.SaveChangesAsync();

    // Read
    var all = await context.Users.ToListAsync();
    var byId = await context.Users.FindAsync(id);
    var first = await context.Users.FirstOrDefaultAsync(u => u.Username == "alice");

    // Update
    user.Age = 31;
    context.Users.Update(user);
    await context.SaveChangesAsync();

    // Delete
    context.Users.Remove(user);
    await context.SaveChangesAsync();
}

// Querying
await context.Users
    .Where(u => u.Age >= 18)
    .OrderByDescending(u => u.CreatedAt)
    .Skip(10)
    .Take(10)
    .ToListAsync();

// Include related entities
await context.Users
    .Include(u => u.Posts)
    .ThenInclude(p => p.Comments)
    .ToListAsync();

// Raw SQL
await context.Users
    .FromSqlRaw("SELECT * FROM Users WHERE Age > {0}", 18)
    .ToListAsync();

// Transactions
using var transaction = await context.Database.BeginTransactionAsync();
try
{
    // Multiple operations
    await context.SaveChangesAsync();
    await transaction.CommitAsync();
}
catch
{
    await transaction.RollbackAsync();
}

// Tracking
context.Users.AsNoTracking().ToList();  // Read-only queries</code></pre>
    </div>

    <h2>🔐 Authentication & JWT</h2>
    
    <div class="code-block">
      <pre><code>using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net;

// Password Hashing
string hashedPassword = BCrypt.Net.BCrypt.HashPassword("password123");
bool isValid = BCrypt.Net.BCrypt.Verify("password123", hashedPassword);

// JWT Token Generation
var tokenHandler = new JwtSecurityTokenHandler();
var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

var tokenDescriptor = new SecurityTokenDescriptor
{
    Subject = new ClaimsIdentity(new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role)
    }),
    Expires = DateTime.UtcNow.AddDays(7),
    SigningCredentials = new SigningCredentials(
        new SymmetricSecurityKey(key),
        SecurityAlgorithms.HmacSha512Signature
    ),
    Issuer = _configuration["Jwt:Issuer"],
    Audience = _configuration["Jwt:Audience"]
};

var token = tokenHandler.CreateToken(tokenDescriptor);
var tokenString = tokenHandler.WriteToken(token);

// Authorization Attribute
[Authorize]
public class ProtectedController : ControllerBase { }

[Authorize(Roles = "Admin")]
public IActionResult AdminOnly() { }

[Authorize(Policy = "RequireAdminRole")]
public IActionResult PolicyBased() { }

// Get Current User
var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
var username = User.Identity?.Name;
var isAuthenticated = User.Identity?.IsAuthenticated ?? false;</code></pre>
    </div>

    <h2>📅 DateTime Methods</h2>
    
    <div class="code-block">
      <pre><code>// Current date/time
DateTime now = DateTime.Now;            // Local time
DateTime utcNow = DateTime.UtcNow;      // UTC time

// Creating dates
DateTime date = new DateTime(2024, 12, 25);
DateTime dateTime = new DateTime(2024, 12, 25, 10, 30, 0);

// Parsing
DateTime.Parse("2024-12-25")
DateTime.TryParse("2024-12-25", out DateTime result)
DateTime.ParseExact("25/12/2024", "dd/MM/yyyy", null)

// Formatting
date.ToString("yyyy-MM-dd")             // "2024-12-25"
date.ToString("dd/MM/yyyy HH:mm:ss")    // "25/12/2024 10:30:00"
date.ToString("MMMM dd, yyyy")          // "December 25, 2024"

// Arithmetic
DateTime tomorrow = date.AddDays(1);
DateTime nextWeek = date.AddDays(7);
DateTime nextMonth = date.AddMonths(1);
DateTime lastYear = date.AddYears(-1);

TimeSpan difference = date2 - date1;
int days = difference.Days;

// Comparison
date1 > date2
date1.CompareTo(date2)

// Components
int year = date.Year;
int month = date.Month;
int day = date.Day;
int hour = date.Hour;
DayOfWeek dayOfWeek = date.DayOfWeek;

// DateTimeOffset (recommended for APIs)
DateTimeOffset dateTimeOffset = DateTimeOffset.UtcNow;
dateTimeOffset.ToUnixTimeSeconds();</code></pre>
    </div>

    <h2>🔍 Regular Expressions</h2>
    
    <div class="code-block">
      <pre><code>using System.Text.RegularExpressions;

// Creating regex
Regex regex = new Regex(@"\\d+");
Regex regex = new Regex(@"pattern", RegexOptions.IgnoreCase);

// Testing
Regex.IsMatch("Price: 100", @"\\d+")    // true

// Matching
Match match = Regex.Match("Price: 100", @"\\d+");
if (match.Success)
{
    Console.WriteLine(match.Value);     // "100"
}

MatchCollection matches = Regex.Matches("Price: 100, Tax: 20", @"\\d+");
foreach (Match m in matches)
{
    Console.WriteLine(m.Value);
}

// Replace
string result = Regex.Replace("Price: 100", @"\\d+", "X");  // "Price: X"

// Split
string[] parts = Regex.Split("a,b;c", @"[,;]");  // ["a", "b", "c"]

// Groups
Match match = Regex.Match("Name: Alice", @"Name: (\\w+)");
string name = match.Groups[1].Value;    // "Alice"

// Common patterns
@"\\d"          // Digit
@"\\D"          // Non-digit
@"\\w"          // Word character
@"\\W"          // Non-word
@"\\s"          // Whitespace
@"\\S"          // Non-whitespace
@"."           // Any character
@"*"           // 0 or more
@"+"           // 1 or more
@"?"           // 0 or 1
@"{3}"         // Exactly 3
@"{2,5}"       // 2 to 5
@"[a-z]"       // Character class
@"^"           // Start
@"$"           // End</code></pre>
    </div>

    <h2>💡 Best Practices</h2>
    
    <div class="explanation-list">
      <ul>
        <li><strong>Use var:</strong> For local variables when type is obvious</li>
        <li><strong>Async/await:</strong> Use async methods for I/O operations</li>
        <li><strong>LINQ:</strong> Prefer LINQ over traditional loops for collections</li>
        <li><strong>Null safety:</strong> Use nullable reference types (C# 8+)</li>
        <li><strong>String interpolation:</strong> Use $"" instead of String.Format</li>
        <li><strong>Dependency Injection:</strong> Use built-in DI container</li>
        <li><strong>ConfigureAwait:</strong> Use ConfigureAwait(false) in libraries</li>
        <li><strong>IDisposable:</strong> Use using statements for resource cleanup</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Master C# string manipulation methods",
    "Understand collections (List, Dictionary, HashSet)",
    "Learn LINQ for functional programming",
    "Use ASP.NET Core for building REST APIs",
    "Work with Entity Framework Core for database operations",
  ],
  practiceInstructions: [
    "Practice string methods on various text inputs",
    "Manipulate Lists using various methods",
    "Use LINQ queries for data transformation",
    "Build ASP.NET Core controllers with different HTTP methods",
    "Implement CRUD operations with Entity Framework Core",
  ],
  hints: [
    "Strings are immutable in C# - methods return new strings",
    "Use async/await for database operations",
    "LINQ methods are chainable for complex queries",
    "[ApiController] provides automatic model validation",
    "Entity Framework tracks changes automatically",
  ],
  solution: `// String manipulation
string text = "hello world";
Console.WriteLine(text.ToUpper());  // "HELLO WORLD"
string[] words = text.Split(' ');

// List operations
List<int> nums = new List<int> { 1, 2, 3, 4, 5 };
nums.Add(6);
var doubled = nums.Select(n => n * 2).ToList();

// LINQ query
var adults = users
    .Where(u => u.Age >= 18)
    .OrderBy(u => u.Name)
    .ToList();

// ASP.NET Core endpoint
[HttpPost]
public async Task<ActionResult<User>> Create([FromBody] User user)
{
    await _context.Users.AddAsync(user);
    await _context.SaveChangesAsync();
    return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
}

// EF Core query
var users = await _context.Users
    .Where(u => u.Age >= 18)
    .OrderByDescending(u => u.CreatedAt)
    .Take(10)
    .ToListAsync();`,
};
