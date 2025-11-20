import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Error & Exception Handling in C#",
  description:
    "Master exception handling in C# with try-catch-finally, custom exceptions, ASP.NET error handling, and logging for robust .NET applications.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <h2>Understanding Exceptions in C#</h2>
    <p>C# uses a structured exception handling system based on try-catch-finally blocks. All exceptions inherit from System.Exception.</p>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🔍 C# Exception Hierarchy</h4>
      <ul class="text-sm text-blue-800 space-y-1 ml-4">
        <li>• <strong>System.Exception:</strong> Base class for all exceptions</li>
        <li>• <strong>SystemException:</strong> Runtime-generated exceptions</li>
        <li>• <strong>ApplicationException:</strong> Application-defined exceptions (deprecated pattern)</li>
        <li>• <strong>Custom Exceptions:</strong> Inherit directly from Exception</li>
        <li>• <strong>AggregateException:</strong> Contains multiple exceptions (Task-based)</li>
      </ul>
    </div>

    <h2>Basic Exception Handling</h2>
    <p>Use try-catch-finally blocks to handle exceptions:</p>

    <pre class="code-block">
      <code>
using System;

public class BasicExceptionHandling
{
    // Simple try-catch
    public static int Divide(int a, int b)
    {
        try
        {
            return a / b;
        }
        catch (DivideByZeroException ex)
        {
            Console.WriteLine($"Error: Cannot divide by zero");
            return 0;
        }
    }

    // Multiple catch blocks (specific to general)
    public static void ProcessFile(string filename)
    {
        try
        {
            string content = File.ReadAllText(filename);
            var data = JsonSerializer.Deserialize<MyData>(content);
            ProcessData(data);
        }
        catch (FileNotFoundException ex)
        {
            Console.WriteLine($"File not found: {ex.FileName}");
        }
        catch (JsonException ex)
        {
            Console.WriteLine($"Invalid JSON: {ex.Message}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unexpected error: {ex.Message}");
        }
    }

    // Try-catch-finally
    public static void ReadFile(string path)
    {
        FileStream? file = null;
        try
        {
            file = File.OpenRead(path);
            byte[] buffer = new byte[1024];
            file.Read(buffer, 0, buffer.Length);
        }
        catch (IOException ex)
        {
            Console.WriteLine($"IO Error: {ex.Message}");
        }
        finally
        {
            // Always executes (cleanup)
            file?.Dispose();
            Console.WriteLine("Cleanup complete");
        }
    }

    // Using statement (automatic disposal)
    public static void ReadFileModern(string path)
    {
        try
        {
            using (var file = File.OpenRead(path))
            {
                byte[] buffer = new byte[1024];
                file.Read(buffer, 0, buffer.Length);
            } // Automatically disposed here
        }
        catch (IOException ex)
        {
            Console.WriteLine($"IO Error: {ex.Message}");
        }
    }
}
      </code>
    </pre>

    <div class="complexity-table bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-gray-900 mb-3">📊 Common .NET Exceptions</h4>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-300">
            <th class="text-left py-2">Exception Type</th>
            <th class="text-left py-2">When It Occurs</th>
            <th class="text-left py-2">Example</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>NullReferenceException</code></td>
            <td class="py-2">Accessing null object</td>
            <td class="py-2">string s = null; s.Length</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>ArgumentNullException</code></td>
            <td class="py-2">Null argument passed</td>
            <td class="py-2">Method receives null</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>ArgumentException</code></td>
            <td class="py-2">Invalid argument</td>
            <td class="py-2">Invalid enum value</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>InvalidOperationException</code></td>
            <td class="py-2">Invalid operation state</td>
            <td class="py-2">Dequeue from empty queue</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>IOException</code></td>
            <td class="py-2">File/stream operations</td>
            <td class="py-2">File not found, access denied</td>
          </tr>
          <tr>
            <td class="py-2"><code>FormatException</code></td>
            <td class="py-2">Invalid format conversion</td>
            <td class="py-2">int.Parse("abc")</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>Throwing and Re-throwing Exceptions</h2>
    <p>Throw exceptions to signal error conditions:</p>

    <pre class="code-block">
      <code>
public class ExceptionThrowing
{
    // Throwing new exceptions
    public static void ValidateAge(int age)
    {
        if (age < 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(age), 
                age, 
                "Age cannot be negative"
            );
        }

        if (age < 18)
        {
            throw new InvalidOperationException(
                "User must be 18 or older"
            );
        }
    }

    // Guard clauses (C# 10+)
    public static void ProcessUser(User? user)
    {
        ArgumentNullException.ThrowIfNull(user);
        ArgumentException.ThrowIfNullOrEmpty(user.Name);
        
        Console.WriteLine($"Processing {user.Name}");
    }

    // Re-throwing exceptions
    public static void SaveData(string data)
    {
        try
        {
            File.WriteAllText("data.json", data);
        }
        catch (IOException ex)
        {
            // Log error
            Logger.LogError(ex, "Failed to save data");
            
            // Re-throw to let caller handle
            throw; // Preserves stack trace
        }
    }

    // Wrapping exceptions
    public static void ProcessOrder(Order order)
    {
        try
        {
            ValidateOrder(order);
            SaveToDatabase(order);
        }
        catch (Exception ex)
        {
            throw new ApplicationException(
                "Order processing failed", 
                ex // Inner exception
            );
        }
    }

    // Exception filters (when clause)
    public static void ProcessRequest(HttpRequest request)
    {
        try
        {
            HandleRequest(request);
        }
        catch (HttpException ex) when (ex.StatusCode == 404)
        {
            Console.WriteLine("Resource not found");
        }
        catch (HttpException ex) when (ex.StatusCode >= 500)
        {
            Console.WriteLine("Server error");
            NotifyAdministrator(ex);
        }
    }
}
      </code>
    </pre>

    <h2>Custom Exception Classes</h2>
    <p>Create domain-specific exceptions for your application:</p>

    <pre class="code-block">
      <code>
using System;
using System.Runtime.Serialization;

// Basic custom exception
public class ValidationException : Exception
{
    public ValidationException() { }

    public ValidationException(string message) 
        : base(message) { }

    public ValidationException(string message, Exception inner) 
        : base(message, inner) { }
}

// Exception with additional properties
public class InsufficientFundsException : Exception
{
    public decimal RequiredAmount { get; }
    public decimal AvailableAmount { get; }
    public decimal Shortfall => RequiredAmount - AvailableAmount;

    public InsufficientFundsException(
        decimal required, 
        decimal available)
        : base($"Insufficient funds: need {required:C}, have {available:C}")
    {
        RequiredAmount = required;
        AvailableAmount = available;
    }

    public InsufficientFundsException(
        decimal required, 
        decimal available, 
        Exception inner)
        : base($"Insufficient funds: need {required:C}, have {available:C}", inner)
    {
        RequiredAmount = required;
        AvailableAmount = available;
    }
}

// Usage
public class BankAccount
{
    private decimal balance;

    public void Withdraw(decimal amount)
    {
        if (amount <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(amount), 
                "Amount must be positive"
            );
        }

        if (amount > balance)
        {
            throw new InsufficientFundsException(amount, balance);
        }

        balance -= amount;
    }
}

// Caller handles custom exception
public static void ProcessWithdrawal()
{
    var account = new BankAccount();
    
    try
    {
        account.Withdraw(1000m);
    }
    catch (InsufficientFundsException ex)
    {
        Console.WriteLine(ex.Message);
        Console.WriteLine($"Shortfall: {ex.Shortfall:C}");
    }
    catch (ArgumentOutOfRangeException ex)
    {
        Console.WriteLine($"Invalid amount: {ex.Message}");
    }
}
      </code>
    </pre>

    <h2>ASP.NET Core Error Handling</h2>
    <p>Handle errors globally in web applications:</p>

    <pre class="code-block">
      <code>
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Diagnostics;

// Program.cs - Global exception handler
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Development error page
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    // Production error handler
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// Custom exception handler endpoint
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var exceptionHandlerFeature = context.Features
            .Get<IExceptionHandlerFeature>();
        
        var exception = exceptionHandlerFeature?.Error;
        
        var response = new
        {
            Error = exception?.Message ?? "An error occurred",
            Type = exception?.GetType().Name,
            StatusCode = 500
        };

        context.Response.StatusCode = 500;
        await context.Response.WriteAsJsonAsync(response);
    });
});

// Controller with exception handling
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ILogger<UsersController> _logger;

    public UsersController(ILogger<UsersController> logger)
    {
        _logger = logger;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        try
        {
            var user = await _userService.GetUserAsync(id);
            
            if (user == null)
            {
                return NotFound(new { Error = "User not found" });
            }
            
            return Ok(user);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation failed for user {UserId}", id);
            return BadRequest(new { Error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user {UserId}", id);
            return StatusCode(500, new { Error = "Internal server error" });
        }
    }
}

// Exception filter attribute
public class GlobalExceptionFilter : IExceptionFilter
{
    private readonly ILogger<GlobalExceptionFilter> _logger;

    public GlobalExceptionFilter(ILogger<GlobalExceptionFilter> logger)
    {
        _logger = logger;
    }

    public void OnException(ExceptionContext context)
    {
        var exception = context.Exception;
        
        _logger.LogError(exception, "Unhandled exception occurred");

        var statusCode = exception switch
        {
            ValidationException => 400,
            UnauthorizedAccessException => 401,
            KeyNotFoundException => 404,
            _ => 500
        };

        context.Result = new ObjectResult(new
        {
            Error = exception.Message,
            Type = exception.GetType().Name
        })
        {
            StatusCode = statusCode
        };

        context.ExceptionHandled = true;
    }
}

// Register filter in Program.cs
builder.Services.AddControllers(options =>
{
    options.Filters.Add<GlobalExceptionFilter>();
});
      </code>
    </pre>

    <h2>Async Exception Handling</h2>
    <p>Handle exceptions in asynchronous code:</p>

    <pre class="code-block">
      <code>
public class AsyncExceptionHandling
{
    // Basic async/await exception handling
    public static async Task<User> GetUserAsync(int id)
    {
        try
        {
            var response = await httpClient.GetAsync($"/users/{id}");
            response.EnsureSuccessStatusCode();
            
            var user = await response.Content
                .ReadFromJsonAsync<User>();
            
            return user ?? throw new InvalidOperationException(
                "User data was null"
            );
        }
        catch (HttpRequestException ex)
        {
            Console.WriteLine($"HTTP error: {ex.Message}");
            throw;
        }
        catch (JsonException ex)
        {
            Console.WriteLine($"JSON error: {ex.Message}");
            throw new InvalidOperationException("Invalid user data", ex);
        }
    }

    // Multiple async operations
    public static async Task<(User, Order)> GetUserAndOrderAsync(
        int userId, 
        int orderId)
    {
        try
        {
            var userTask = GetUserAsync(userId);
            var orderTask = GetOrderAsync(orderId);
            
            await Task.WhenAll(userTask, orderTask);
            
            return (userTask.Result, orderTask.Result);
        }
        catch (Exception ex)
        {
            // First exception from any failed task
            Console.WriteLine($"Operation failed: {ex.Message}");
            throw;
        }
    }

    // Handling AggregateException
    public static async Task ProcessMultipleAsync()
    {
        var tasks = new[]
        {
            ProcessItemAsync(1),
            ProcessItemAsync(2),
            ProcessItemAsync(3)
        };

        try
        {
            await Task.WhenAll(tasks);
        }
        catch (Exception)
        {
            // Check all exceptions
            foreach (var task in tasks)
            {
                if (task.IsFaulted && task.Exception != null)
                {
                    foreach (var ex in task.Exception.InnerExceptions)
                    {
                        Console.WriteLine($"Error: {ex.Message}");
                    }
                }
            }
        }
    }
}
      </code>
    </pre>

    <h2>Logging with ILogger</h2>
    <p>Use structured logging for error tracking:</p>

    <pre class="code-block">
      <code>
using Microsoft.Extensions.Logging;

public class UserService
{
    private readonly ILogger<UserService> _logger;

    public UserService(ILogger<UserService> logger)
    {
        _logger = logger;
    }

    public async Task<User> CreateUserAsync(UserDto dto)
    {
        try
        {
            _logger.LogInformation(
                "Creating user with email {Email}", 
                dto.Email
            );

            var user = await _repository.CreateAsync(dto);

            _logger.LogInformation(
                "User created successfully: {UserId}", 
                user.Id
            );

            return user;
        }
        catch (DbException ex)
        {
            _logger.LogError(
                ex, 
                "Database error creating user with email {Email}", 
                dto.Email
            );
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogCritical(
                ex, 
                "Unexpected error creating user"
            );
            throw;
        }
    }

    // Log scopes for context
    public async Task ProcessOrderAsync(int orderId)
    {
        using (_logger.BeginScope("OrderId:{OrderId}", orderId))
        {
            try
            {
                _logger.LogInformation("Starting order processing");
                
                var order = await GetOrderAsync(orderId);
                await ValidateOrderAsync(order);
                await ProcessPaymentAsync(order);
                
                _logger.LogInformation("Order processing completed");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Order processing failed");
                throw;
            }
        }
    }
}
      </code>
    </pre>

    <div class="quick-test bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-2">✅ C# Exception Handling Best Practices</h4>
      <ul class="text-sm text-green-800 space-y-1">
        <li>✓ Catch specific exceptions before general ones</li>
        <li>✓ Use using statements for automatic resource disposal</li>
        <li>✓ Throw; to preserve stack trace when re-throwing</li>
        <li>✓ Create custom exceptions for domain-specific errors</li>
        <li>✓ Use exception filters (when clause) for conditional catches</li>
        <li>✓ Log exceptions with structured logging (ILogger)</li>
        <li>✓ Handle async exceptions with try-catch around await</li>
        <li>✓ Never catch Exception without re-throwing unless at app boundary</li>
      </ul>
    </div>

    <div class="quick-test bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-red-900 mb-2">❌ Common Mistakes</h4>
      <ul class="text-sm text-red-800 space-y-1">
        <li>✗ Catching Exception and swallowing errors</li>
        <li>✗ Using throw ex (loses stack trace)</li>
        <li>✗ Not disposing resources in finally blocks</li>
        <li>✗ Returning error codes instead of throwing exceptions</li>
        <li>✗ Creating exceptions for control flow</li>
        <li>✗ Not logging exceptions before re-throwing</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Handle exceptions with try-catch-finally blocks",
    "Create and throw custom exception classes",
    "Use exception filters for conditional exception handling",
    "Implement global error handling in ASP.NET Core",
    "Handle exceptions in async/await code",
    "Log exceptions effectively with ILogger",
  ],
  practiceInstructions: [
    "Create a custom exception class with additional properties (like InsufficientFundsException)",
    "Build an async method that handles HttpRequestException and JsonException",
    "Implement a global exception filter for ASP.NET Core",
    "Write a method using exception filters (when clause) to handle different status codes",
    "Create a service method that logs exceptions with structured logging",
  ],
  hints: [
    "Custom exceptions should have at least 3 constructors (empty, message, message+inner)",
    "Use throw; instead of throw ex; to preserve stack trace",
    "IExceptionFilter.OnException() sets context.Result and context.ExceptionHandled",
    "Exception filters use when keyword: catch (Exception ex) when (condition)",
    "ILogger.LogError() takes exception as first parameter for proper tracking",
  ],
  solution: `using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

// 1. Custom Exception Class
public class InsufficientFundsException : Exception
{
    public decimal RequiredAmount { get; }
    public decimal AvailableAmount { get; }
    public decimal Shortfall => RequiredAmount - AvailableAmount;

    public InsufficientFundsException(decimal required, decimal available)
        : base($"Insufficient funds: need {required:C}, have {available:C}")
    {
        RequiredAmount = required;
        AvailableAmount = available;
    }

    public InsufficientFundsException(decimal required, decimal available, Exception inner)
        : base($"Insufficient funds: need {required:C}, have {available:C}", inner)
    {
        RequiredAmount = required;
        AvailableAmount = available;
    }
}

// 2. Async Exception Handling
public class UserService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<UserService> _logger;

    public async Task<User> GetUserAsync(int id)
    {
        try
        {
            _logger.LogInformation("Fetching user {UserId}", id);
            
            var response = await _httpClient.GetAsync($"/api/users/{id}");
            response.EnsureSuccessStatusCode();
            
            var user = await response.Content.ReadFromJsonAsync<User>();
            return user ?? throw new InvalidOperationException("User data was null");
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP error fetching user {UserId}", id);
            throw;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "JSON parsing error for user {UserId}", id);
            throw new InvalidOperationException("Invalid user data", ex);
        }
    }
}

// 3. Global Exception Filter
public class GlobalExceptionFilter : IExceptionFilter
{
    private readonly ILogger<GlobalExceptionFilter> _logger;

    public GlobalExceptionFilter(ILogger<GlobalExceptionFilter> logger)
    {
        _logger = logger;
    }

    public void OnException(ExceptionContext context)
    {
        _logger.LogError(context.Exception, "Unhandled exception occurred");

        var statusCode = context.Exception switch
        {
            ValidationException => 400,
            UnauthorizedAccessException => 401,
            KeyNotFoundException => 404,
            InsufficientFundsException => 402,
            _ => 500
        };

        context.Result = new ObjectResult(new
        {
            Error = context.Exception.Message,
            Type = context.Exception.GetType().Name
        })
        {
            StatusCode = statusCode
        };

        context.ExceptionHandled = true;
    }
}

// 4. Exception Filters (when clause)
public class OrderController : ControllerBase
{
    public async Task<IActionResult> ProcessOrder(int orderId)
    {
        try
        {
            var result = await _service.ProcessOrderAsync(orderId);
            return Ok(result);
        }
        catch (HttpRequestException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return NotFound(new { Error = "Order not found" });
        }
        catch (HttpRequestException ex) when ((int?)ex.StatusCode >= 500)
        {
            _logger.LogError(ex, "External service error");
            return StatusCode(503, new { Error = "Service unavailable" });
        }
        catch (InsufficientFundsException ex)
        {
            return StatusCode(402, new { Error = ex.Message, Shortfall = ex.Shortfall });
        }
    }
}

// 5. Structured Logging
public class PaymentService
{
    private readonly ILogger<PaymentService> _logger;

    public async Task ProcessPaymentAsync(Order order)
    {
        using (_logger.BeginScope("OrderId:{OrderId}", order.Id))
        {
            try
            {
                _logger.LogInformation("Processing payment for amount {Amount:C}", order.Amount);
                
                await ValidatePayment(order);
                await ChargeCustomer(order);
                
                _logger.LogInformation("Payment processed successfully");
            }
            catch (InsufficientFundsException ex)
            {
                _logger.LogWarning(ex, "Payment failed: {Message}", ex.Message);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error processing payment");
                throw;
            }
        }
    }
}

Console.WriteLine("Exception handling implementation complete!");`,
};
