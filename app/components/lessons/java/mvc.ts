import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Spring MVC & RESTful APIs",
  description:
    "Build robust REST APIs with Spring MVC. Learn about controllers, request mapping, validation, and error handling.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>In this lesson, you'll learn advanced Spring MVC patterns for building production-ready REST APIs with validation, error handling, and best practices.</p>

    <h2>Advanced Controller Patterns</h2>
    
    <p>Let's build a comprehensive user management API with full CRUD operations:</p>

    <pre class="code-block">
      <code>
// UserDto.java - Data Transfer Object
public class UserDto {
    private Long id;
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;
    
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;
    
    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 120, message = "Age must not exceed 120")
    private Integer age;
    
    // Constructors, getters, setters...
}
      </code>
    </pre>

    <h2>REST Controller with Validation</h2>
    
    <pre class="code-block">
      <code>
@RestController
@RequestMapping("/api/users")
@Validated
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    private final List<UserDto> users = new ArrayList<>();
    private Long nextId = 1L;
    
    // GET /api/users - Get all users with pagination
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        
        // Filter users based on search parameter
        List<UserDto> filteredUsers = users;
        if (search != null && !search.isEmpty()) {
            filteredUsers = users.stream()
                .filter(user -> user.getUsername().toLowerCase().contains(search.toLowerCase()))
                .collect(Collectors.toList());
        }
        
        // Apply pagination
        int start = page * size;
        int end = Math.min(start + size, filteredUsers.size());
        List<UserDto> pageUsers = filteredUsers.subList(start, end);
        
        Map<String, Object> response = Map.of(
            "users", pageUsers,
            "page", page,
            "size", size,
            "totalElements", filteredUsers.size()
        );
        
        return ResponseEntity.ok(response);
    }
    
    // POST /api/users - Create new user
    @PostMapping
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserDto userDto) {
        userDto.setId(nextId++);
        users.add(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
    }
    
    // PUT /api/users/{id} - Update user
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long id, 
            @Valid @RequestBody UserDto userDto) {
        
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).getId().equals(id)) {
                userDto.setId(id);
                users.set(i, userDto);
                return ResponseEntity.ok(userDto);
            }
        }
        return ResponseEntity.notFound().build();
    }
    
    // DELETE /api/users/{id} - Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        boolean removed = users.removeIf(user -> user.getId().equals(id));
        return removed ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
      </code>
    </pre>

    <h2>Global Exception Handling</h2>
    
    <p>Handle validation errors and exceptions globally:</p>

    <pre class="code-block">
      <code>
@ControllerAdvice
public class GlobalExceptionHandler {
    
    // Handle validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setMessage("Validation failed");
        errorResponse.setValidationErrors(errors);
        errorResponse.setTimestamp(LocalDateTime.now());
        
        return ResponseEntity.badRequest().body(errorResponse);
    }
    
    // Handle generic exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setMessage("An unexpected error occurred");
        errorResponse.setTimestamp(LocalDateTime.now());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
      </code>
    </pre>

    <h2>Key Annotations</h2>
    
    <div class="explanation-list">
      <ul>
        <li><strong>@Valid:</strong> Triggers validation of request body using Bean Validation annotations</li>
        <li><strong>@RequestParam:</strong> Extract query parameters with optional default values</li>
        <li><strong>@CrossOrigin:</strong> Enable CORS for frontend integration</li>
        <li><strong>@ControllerAdvice:</strong> Global exception handler for all controllers</li>
        <li><strong>@ExceptionHandler:</strong> Method that handles specific exception types</li>
      </ul>
    </div>

    <h2>Testing Your API</h2>
    
    <p>Use tools like Postman or curl to test your endpoints:</p>
    
    <pre class="code-block">
      <code>
# Create a user
curl -X POST http://localhost:8080/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"username": "john", "email": "john@example.com", "age": 25}'

# Get all users  
curl http://localhost:8080/api/users

# Get users with pagination
curl "http://localhost:8080/api/users?page=0&size=5"
      </code>
    </pre>
  </div>`,
  objectives: [
    "Build comprehensive REST APIs with full CRUD operations",
    "Implement request validation using Bean Validation annotations",
    "Handle query parameters for pagination and filtering",
    "Create global exception handlers with @ControllerAdvice",
    "Return appropriate HTTP status codes for different scenarios",
  ],
  practiceInstructions: [
    "Create a UserDto class with validation annotations",
    "Implement a UserController with CRUD endpoints",
    "Add pagination support to the GET endpoint",
    "Create a GlobalExceptionHandler for validation errors",
    "Test all endpoints using Postman or curl",
  ],
  hints: [
    "Use @Valid to trigger validation on request bodies",
    "ResponseEntity allows you to set custom HTTP status codes",
    "Stream API is useful for filtering and processing collections",
    "@RequestParam can have default values and optional parameters",
  ],
  solution: `// Complete UserController with all CRUD operations
@RestController
@RequestMapping("/api/users")
@Validated
public class UserController {
    
    private final List<UserDto> users = new ArrayList<>();
    private Long nextId = 1L;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        int start = page * size;
        int end = Math.min(start + size, users.size());
        List<UserDto> pageUsers = users.subList(start, end);
        
        Map<String, Object> response = Map.of(
            "users", pageUsers,
            "page", page,
            "totalElements", users.size()
        );
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserDto userDto) {
        userDto.setId(nextId++);
        users.add(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return users.stream()
            .filter(user -> user.getId().equals(id))
            .findFirst()
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}`,
};
