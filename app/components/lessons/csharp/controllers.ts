import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "ASP.NET Core Controllers",
  difficulty: "Intermediate",
  description:
    "Master ASP.NET Core MVC and API controllers. Learn routing, model binding, validation, and best practices for building robust APIs.",
  objectives: [
    "Understand ASP.NET Core API controllers and routing",
    "Implement CRUD operations with proper action results",
    "Use model binding and validation attributes",
    "Apply authorization and authentication",
    "Follow async/await best practices",
  ],
  content: `
    <h1>Controllers in ASP.NET Core</h1>
    <p>Controllers in ASP.NET Core handle HTTP requests and return responses. They act as the intermediary between your application logic and HTTP, processing requests, validating input, and returning appropriate responses.</p>

    <h2>API Controller Basics</h2>
    <p>ASP.NET Core controllers use attributes (annotations) and dependency injection. Let's understand each part:</p>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h4 class="font-semibold text-blue-900 mb-2">💡 C# Controller Fundamentals</h4>
      <ul class="text-sm text-blue-800 space-y-1 ml-4">
        <li>• <strong>[ApiController]:</strong> Enables automatic model validation and better error responses</li>
        <li>• <strong>ControllerBase:</strong> Base class for API controllers (no view support)</li>
        <li>• <strong>async/await:</strong> Non-blocking operations for better performance</li>
        <li>• <strong>Dependency Injection:</strong> Services injected through constructor</li>
        <li>• <strong>ActionResult&lt;T&gt;:</strong> Type-safe return type with HTTP status</li>
      </ul>
    </div>

    <pre><code>using Microsoft.AspNetCore.Mvc;

namespace MyApp.Controllers;

// [ApiController] enables automatic model validation and 400 responses
[ApiController]

// [Route] defines base URL - [controller] is replaced with "Users"
// So this becomes: /api/users
[Route("api/[controller]")]

// Inherit from ControllerBase (for APIs) not Controller (for MVC views)
public class UsersController : ControllerBase
{
    // Readonly fields for dependencies (injected services)
    // readonly = can only be set in constructor
    private readonly IUserService _userService;
    private readonly ILogger&lt;UsersController&gt; _logger;

    // Constructor - ASP.NET Core automatically injects dependencies
    // This is called Dependency Injection (DI)
    public UsersController(
        IUserService userService,    // Business logic service
        ILogger&lt;UsersController&gt; logger)  // Logging service
    {
        // Assign injected dependencies to fields
        _userService = userService;
        _logger = logger;
    }

    // GET: api/users - Get all users
    [HttpGet]  // Responds to HTTP GET requests
    // async = method contains await operations
    // Task&lt;T&gt; = asynchronous operation that returns T
    // ActionResult&lt;T&gt; = HTTP response with data of type T
    public async Task&lt;ActionResult&lt;IEnumerable&lt;UserDto&gt;&gt;&gt; GetUsers()
    {
        try
        {
            // await = wait for async operation to complete
            // Don't block the thread while waiting
            var users = await _userService.GetAllUsersAsync();
            
            // Ok() returns HTTP 200 with the data
            return Ok(users);
        }
        catch (Exception ex)
        {
            // Log error details (helpful for debugging)
            _logger.LogError(ex, "Error getting users");
            
            // Return 500 Internal Server Error
            return StatusCode(500, "Internal server error");
        }
    }

    // GET: api/users/5 - Get user by ID
    [HttpGet("{id}")]  // {id} is a route parameter
    public async Task&lt;ActionResult&lt;UserDto&gt;&gt; GetUser(int id)
    {
        try
        {
            // Call service to get user by ID
            var user = await _userService.GetUserByIdAsync(id);
            
            // Check if user exists (service returns null if not found)
            if (user == null)
            {
                // NotFound() returns HTTP 404
                // $ allows string interpolation (embedding variables)
                return NotFound($"User with ID {id} not found");
            }
            
            // Return 200 OK with user data
            return Ok(user);
        }
        catch (Exception ex)
        {
            // {UserId} is a structured logging placeholder
            _logger.LogError(ex, "Error getting user {UserId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // POST: api/users - Create new user
    [HttpPost]  // Responds to HTTP POST requests
    public async Task&lt;ActionResult&lt;UserDto&gt;&gt; CreateUser(
        // [ApiController] automatically validates this DTO
        CreateUserDto dto)  // Data Transfer Object from request body
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userService.CreateUserAsync(dto);
            
            return CreatedAtAction(
                nameof(GetUser),
                new { id = user.Id },
                user
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user");
            return StatusCode(500, "Internal server error");
        }
    }

    // PUT: api/users/5
    [HttpPut("{id}")]
    public async Task&lt;IActionResult&gt; UpdateUser(int id, UpdateUserDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var success = await _userService.UpdateUserAsync(id, dto);
            
            if (!success)
            {
                return NotFound($"User with ID {id} not found");
            }
            
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user {UserId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // DELETE: api/users/5
    [HttpDelete("{id}")]
    public async Task&lt;IActionResult&gt; DeleteUser(int id)
    {
        try
        {
            var success = await _userService.DeleteUserAsync(id);
            
            if (!success)
            {
                return NotFound($"User with ID {id} not found");
            }
            
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user {UserId}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}</code></pre>

    <h2>Controller Attributes</h2>
    <ul>
      <li><strong>[ApiController]:</strong> Enables automatic model validation, automatic 400 responses, and more</li>
      <li><strong>[Route]:</strong> Defines the base route for the controller</li>
      <li><strong>[HttpGet/Post/Put/Delete]:</strong> Specifies the HTTP method</li>
      <li><strong>[FromBody/FromQuery/FromRoute]:</strong> Specifies where to bind parameters from</li>
    </ul>

    <h2>Model Binding and Validation</h2>
    <pre><code>using System.ComponentModel.DataAnnotations;

// DTO with validation attributes
public class CreateProductDto
{
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Range(0.01, 10000)]
    public decimal Price { get; set; }

    [StringLength(500)]
    public string? Description { get; set; }

    [Required]
    public string Category { get; set; } = string.Empty;
}

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpPost]
    public async Task&lt;ActionResult&lt;ProductDto&gt;&gt; CreateProduct(
        [FromBody] CreateProductDto dto)
    {
        // ModelState is automatically validated with [ApiController]
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var product = await _productService.CreateProductAsync(dto);
        
        return CreatedAtAction(
            nameof(GetProduct),
            new { id = product.Id },
            product
        );
    }

    [HttpGet("{id}")]
    public async Task&lt;ActionResult&lt;ProductDto&gt;&gt; GetProduct(int id)
    {
        var product = await _productService.GetProductByIdAsync(id);
        
        if (product == null)
        {
            return NotFound();
        }
        
        return Ok(product);
    }

    // Query string parameters
    [HttpGet]
    public async Task&lt;ActionResult&lt;PagedResult&lt;ProductDto&gt;&gt;&gt; GetProducts(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? category = null,
        [FromQuery] string? search = null)
    {
        var result = await _productService.GetProductsAsync(
            page, pageSize, category, search);
        
        return Ok(result);
    }
}</code></pre>

    <h2>Action Results</h2>
    <p>ASP.NET Core provides many helper methods for returning responses:</p>
    <pre><code>// 200 OK
return Ok(data);

// 201 Created
return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);

// 204 No Content
return NoContent();

// 400 Bad Request
return BadRequest("Invalid data");
return BadRequest(ModelState);

// 404 Not Found
return NotFound();
return NotFound("User not found");

// 401 Unauthorized
return Unauthorized();

// 403 Forbidden
return Forbid();

// 500 Internal Server Error
return StatusCode(500, "Internal server error");

// Custom status code
return StatusCode(StatusCodes.Status418ImATeapot, "I'm a teapot");</code></pre>

    <h2>Controller with Authorization</h2>
    <pre><code>using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Requires authentication for all actions
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    // Anyone authenticated can access
    [HttpGet]
    public async Task&lt;ActionResult&lt;IEnumerable&lt;OrderDto&gt;&gt;&gt; GetMyOrders()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var orders = await _orderService.GetUserOrdersAsync(userId);
        return Ok(orders);
    }

    // Only admins can access
    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task&lt;ActionResult&lt;IEnumerable&lt;OrderDto&gt;&gt;&gt; GetAllOrders()
    {
        var orders = await _orderService.GetAllOrdersAsync();
        return Ok(orders);
    }

    // Policy-based authorization
    [HttpDelete("{id}")]
    [Authorize(Policy = "CanDeleteOrders")]
    public async Task&lt;IActionResult&gt; DeleteOrder(int id)
    {
        var success = await _orderService.DeleteOrderAsync(id);
        
        if (!success)
        {
            return NotFound();
        }
        
        return NoContent();
    }

    // Allow anonymous access (override [Authorize] on controller)
    [AllowAnonymous]
    [HttpGet("public")]
    public ActionResult&lt;string&gt; GetPublicInfo()
    {
        return Ok("This is public information");
    }
}</code></pre>

    <h2>Custom Action Filters</h2>
    <pre><code>// Custom validation filter
public class ValidateModelAttribute : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.ModelState.IsValid)
        {
            context.Result = new BadRequestObjectResult(context.ModelState);
        }
    }
}

// Apply filter to controller or action
[ApiController]
[Route("api/[controller]")]
[ValidateModel]
public class UsersController : ControllerBase
{
    // Actions...
}</code></pre>

    <h2>Async Best Practices</h2>
    <pre><code>[ApiController]
[Route("api/[controller]")]
public class AsyncExampleController : ControllerBase
{
    private readonly IDataService _dataService;

    public AsyncExampleController(IDataService dataService)
    {
        _dataService = dataService;
    }

    // ✅ Good: Async all the way
    [HttpGet]
    public async Task&lt;ActionResult&lt;IEnumerable&lt;DataDto&gt;&gt;&gt; GetData()
    {
        var data = await _dataService.GetDataAsync();
        return Ok(data);
    }

    // ❌ Bad: Blocking async code
    [HttpGet("bad")]
    public ActionResult&lt;IEnumerable&lt;DataDto&gt;&gt; GetDataBad()
    {
        var data = _dataService.GetDataAsync().Result; // Blocks thread!
        return Ok(data);
    }

    // ✅ Good: Multiple async operations in parallel
    [HttpGet("parallel")]
    public async Task&lt;ActionResult&lt;CombinedDto&gt;&gt; GetCombinedData()
    {
        var userTask = _dataService.GetUsersAsync();
        var orderTask = _dataService.GetOrdersAsync();
        var productTask = _dataService.GetProductsAsync();

        await Task.WhenAll(userTask, orderTask, productTask);

        return Ok(new CombinedDto
        {
            Users = await userTask,
            Orders = await orderTask,
            Products = await productTask
        });
    }
}</code></pre>

    <h2>Best Practices</h2>
    <ul>
      <li><strong>Use [ApiController]:</strong> Enables automatic model validation and better API behavior</li>
      <li><strong>Dependency Injection:</strong> Inject services through constructor</li>
      <li><strong>Async/Await:</strong> Use async methods for I/O operations</li>
      <li><strong>ControllerBase:</strong> Use ControllerBase for APIs (not Controller)</li>
      <li><strong>Action Results:</strong> Return ActionResult&lt;T&gt; for type safety</li>
      <li><strong>Validation:</strong> Use data annotations and ModelState</li>
      <li><strong>Logging:</strong> Log errors and important events</li>
      <li><strong>Thin Controllers:</strong> Keep business logic in services</li>
    </ul>

    <h2>Service Layer Pattern</h2>
    <pre><code>// Service interface
public interface IUserService
{
    Task&lt;IEnumerable&lt;UserDto&gt;&gt; GetAllUsersAsync();
    Task&lt;UserDto?&gt; GetUserByIdAsync(int id);
    Task&lt;UserDto&gt; CreateUserAsync(CreateUserDto dto);
    Task&lt;bool&gt; UpdateUserAsync(int id, UpdateUserDto dto);
    Task&lt;bool&gt; DeleteUserAsync(int id);
}

// Service implementation
public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public UserService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task&lt;IEnumerable&lt;UserDto&gt;&gt; GetAllUsersAsync()
    {
        var users = await _context.Users.ToListAsync();
        return _mapper.Map&lt;IEnumerable&lt;UserDto&gt;&gt;(users);
    }

    // Other methods...
}

// Register in Program.cs
builder.Services.AddScoped&lt;IUserService, UserService&gt;();</code></pre>
  `,
  practiceInstructions: [
    "Create an API controller inheriting from ControllerBase",
    "Use [ApiController] and [Route] attributes",
    "Implement at least 3 CRUD operations with proper HTTP verbs",
    "Use async/await for database operations",
    "Return appropriate ActionResult types with status codes",
  ],
  hints: [
    "Use [ApiController] attribute for automatic model validation",
    "Return ActionResult<T> for type safety",
    "Always use async/await for I/O operations",
    "Inject services through the constructor",
  ],
  starterCode: `using Microsoft.AspNetCore.Mvc;

namespace MyApp.Controllers;

// TODO: Add controller attributes
public class ProductsController : ControllerBase
{
    // TODO: Inject service via constructor
    
    // TODO: Implement GET all products
    
    // TODO: Implement GET product by id
    
    // TODO: Implement POST create product
}`,
  solution: `using Microsoft.AspNetCore.Mvc;

namespace MyApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(
        IProductService productService,
        ILogger<ProductsController> logger)
    {
        _productService = productService;
        _logger = logger;
    }

    // GET: api/products
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
    {
        try
        {
            var products = await _productService.GetAllProductsAsync();
            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting products");
            return StatusCode(500, "Internal server error");
        }
    }

    // GET: api/products/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        try
        {
            var product = await _productService.GetProductByIdAsync(id);
            
            if (product == null)
            {
                return NotFound($"Product with ID {id} not found");
            }
            
            return Ok(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting product {ProductId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // POST: api/products
    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _productService.CreateProductAsync(dto);
            
            return CreatedAtAction(
                nameof(GetProduct),
                new { id = product.Id },
                product
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product");
            return StatusCode(500, "Internal server error");
        }
    }

    // PUT: api/products/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, UpdateProductDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var success = await _productService.UpdateProductAsync(id, dto);
            
            if (!success)
            {
                return NotFound($"Product with ID {id} not found");
            }
            
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product {ProductId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    // DELETE: api/products/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        try
        {
            var success = await _productService.DeleteProductAsync(id);
            
            if (!success)
            {
                return NotFound($"Product with ID {id} not found");
            }
            
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting product {ProductId}", id);
            return StatusCode(500, "Internal server error");
        }
    }
}`,
};

export default lessonData;
