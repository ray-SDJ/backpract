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
    <p>Spring Boot controllers use annotations to map HTTP requests to methods. Let's break down each part:</p>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h4 class="font-semibold text-blue-900 mb-2">💡 Spring Annotations Explained</h4>
      <ul class="text-sm text-blue-800 space-y-1 ml-4">
        <li>• <strong>@RestController:</strong> Marks this class as a REST API controller</li>
        <li>• <strong>@RequestMapping("/api/users"):</strong> Base URL for all methods</li>
        <li>• <strong>@GetMapping:</strong> Handles HTTP GET requests</li>
        <li>• <strong>@PostMapping:</strong> Handles HTTP POST requests (create)</li>
        <li>• <strong>@PutMapping:</strong> Handles HTTP PUT requests (update)</li>
        <li>• <strong>@DeleteMapping:</strong> Handles HTTP DELETE requests</li>
      </ul>
    </div>
    
    <pre class="code-block">
      <code>
// ========== DATABASE INTEGRATION WITH SPRING DATA JPA ==========
// In real Spring Boot applications, use Spring Data JPA for database operations
// First, create JPA Entity and Repository:

// @Entity  // Marks this class as a database table
// @Table(name = "users")
// public class User {
//     @Id  // Primary key
//     @GeneratedValue(strategy = GenerationType.IDENTITY)  // Auto-increment
//     private Long id;
//     
//     @Column(unique = true, nullable = false)
//     private String username;
//     
//     @Column(unique = true, nullable = false)
//     private String email;
//     
//     @Column
//     private Integer age;
//     
//     @CreationTimestamp
//     private LocalDateTime createdAt;
//     
//     // Getters, setters, constructors...
// }

// public interface UserRepository extends JpaRepository<User, Long> {
//     // Spring Data JPA automatically implements these methods!
//     Optional<User> findByUsername(String username);
//     Page<User> findByUsernameContainingIgnoreCase(String username, Pageable pageable);
//     boolean existsByUsername(String username);
// }

@RestController
@RequestMapping("/api/users")
@Validated
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    // ========== DEPENDENCY INJECTION ==========
    // @Autowired tells Spring to inject the UserRepository bean
    // UserRepository is auto-implemented by Spring Data JPA
    @Autowired
    private UserRepository userRepository;  // Database access layer
    
    // ========== GET - DATABASE QUERY ==========
    // Fetch users from database with filtering and pagination
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        
        try {
            // ========== BUILD PAGEABLE OBJECT ==========
            // Pageable defines pagination and sorting parameters
            // PageRequest.of(page, size) creates pagination request
            // Sort.by(...) adds sorting (newest first)
            Pageable pageable = PageRequest.of(
                page, 
                size,
                Sort.by("createdAt").descending()
            );
            
            // ========== EXECUTE DATABASE QUERY ==========
            // Page<User> contains results and pagination metadata
            Page<User> userPage;
            
            if (search != null && !search.isEmpty()) {
                // Query with search filter
                // findByUsernameContainingIgnoreCase executes:
                // SELECT * FROM users WHERE username ILIKE '%search%'
                userPage = userRepository
                    .findByUsernameContainingIgnoreCase(search, pageable);
            } else {
                // Query all users with pagination
                // findAll() executes: SELECT * FROM users
                userPage = userRepository.findAll(pageable);
            }
            
            // ========== CONVERT TO DTO ==========
            // Convert Entity objects to DTOs (Data Transfer Objects)
            // DTOs control what data is exposed in API responses
            List<UserDto> userDtos = userPage.getContent().stream()
                .map(this::convertToDto)  // Convert each User to UserDto
                .collect(Collectors.toList());
            
            // Build response with pagination metadata
            Map<String, Object> response = Map.of(
                "users", userDtos,
                "pagination", Map.of(
                    "page", userPage.getNumber(),
                    "size", userPage.getSize(),
                    "totalElements", userPage.getTotalElements(),
                    "totalPages", userPage.getTotalPages(),
                    "isLast", userPage.isLast()
                )
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            // Error handling
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch users from database"));
        }
    }
    
    // ========== POST - DATABASE INSERT ==========
    // Create new user in database
    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody UserDto userDto) {
        try {
            // ========== VALIDATION ==========
            // Check if username already exists
            // existsByUsername() executes: SELECT COUNT(*) FROM users WHERE username = ?
            if (userRepository.existsByUsername(userDto.getUsername())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Username already exists"));
            }
            
            // ========== CONVERT DTO TO ENTITY ==========
            // DTOs are for API layer, Entities are for database layer
            User user = new User();
            user.setUsername(userDto.getUsername());
            user.setEmail(userDto.getEmail());
            user.setAge(userDto.getAge());
            
            // ========== DATABASE INSERT ==========
            // userRepository.save() executes SQL INSERT
            // INSERT INTO users (username, email, age, created_at) VALUES (?, ?, ?, ?)
            // Returns saved entity with auto-generated ID
            User savedUser = userRepository.save(user);
            
            // Convert back to DTO for response
            UserDto responseDto = convertToDto(savedUser);
            
            // Return 201 Created with saved user
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                    "message", "User created successfully",
                    "user", responseDto
                ));
                
        } catch (DataIntegrityViolationException e) {
            // Handle database constraint violations (unique email, etc.)
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "Email already exists"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to create user"));
        }
    }
    
    // ========== PUT - DATABASE UPDATE ==========
    // Update existing user in database
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,  // Extract from URL path
            @Valid @RequestBody UserDto userDto) {
        
        try {
            // ========== FIND USER IN DATABASE ==========
            // findById() executes: SELECT * FROM users WHERE id = ?
            // Returns Optional<User> (may or may not contain user)
            Optional<User> userOptional = userRepository.findById(id);
            
            // Check if user exists
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
            }
            
            // Get the user from Optional
            User user = userOptional.get();
            
            // ========== UPDATE USER FIELDS ==========
            // Update only provided fields
            if (userDto.getUsername() != null) {
                user.setUsername(userDto.getUsername());
            }
            if (userDto.getEmail() != null) {
                user.setEmail(userDto.getEmail());
            }
            if (userDto.getAge() != null) {
                user.setAge(userDto.getAge());
            }
            
            // ========== DATABASE UPDATE ==========
            // save() on existing entity executes SQL UPDATE
            // UPDATE users SET username=?, email=?, age=? WHERE id=?
            User updatedUser = userRepository.save(user);
            
            // Convert to DTO for response
            UserDto responseDto = convertToDto(updatedUser);
            
            return ResponseEntity.ok(Map.of(
                "message", "User updated successfully",
                "user", responseDto
            ));
            
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "Username or email already exists"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to update user"));
        }
    }
    
    // ========== HELPER METHOD ==========
    // Convert Entity to DTO (for API responses)
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setAge(user.getAge());
        return dto;
    }
    
    // ========== DEMO WITHOUT DATABASE (for learning) ==========
    // Below is the original in-memory version for comparison:
    private final List<UserDto> demoUsers = new ArrayList<>();
    private Long nextId = 1L;
    
    @GetMapping("/demo")
    public ResponseEntity<Map<String, Object>> getDemoUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        
        // Filter users based on search
        List<UserDto> filteredUsers = demoUsers;
        if (search != null && !search.isEmpty()) {
            filteredUsers = demoUsers.stream()
                .filter(user -> user.getUsername().toLowerCase().contains(search.toLowerCase()))
                .collect(Collectors.toList());
        }
        
        // Apply pagination
        int start = page * size;
        int end = Math.min(start + size, filteredUsers.size());
        List<UserDto> pageUsers = filteredUsers.subList(start, end);
        
        Map<String, Object> response = Map.of(
            "users", pageUsers,
            "page", page
            "size", size,                    // Items per page
            "totalElements", filteredUsers.size()  // Total matching users
        );
        
        // ResponseEntity wraps the response with HTTP status
        // .ok() sets status to 200 OK
        return ResponseEntity.ok(response);
    }
    
    // POST /api/users - Create a new user
    @PostMapping  // Maps to POST /api/users
    public ResponseEntity<UserDto> createUser(
            // @Valid triggers validation on UserDto fields
            // @RequestBody extracts JSON from request body and converts to UserDto
            @Valid @RequestBody UserDto userDto) {
        
        // Assign ID and add to list
        userDto.setId(nextId++);  // Post-increment: use current, then add 1
        users.add(userDto);       // Add to our in-memory list
        
        // Return 201 Created status with the new user
        return ResponseEntity.status(HttpStatus.CREATED).body(userDto);
    }
    
    // PUT /api/users/{id} - Update an existing user
    @PutMapping("/{id}")  // {id} is a path variable
    public ResponseEntity<UserDto> updateUser(
            // @PathVariable extracts {id} from URL path
            @PathVariable Long id, 
            @Valid @RequestBody UserDto userDto) {
        
        // Search for user with matching ID
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).getId().equals(id)) {
                // Found the user - update it
                userDto.setId(id);         // Keep the same ID
                users.set(i, userDto);     // Replace old user with updated one
                return ResponseEntity.ok(userDto);  // Return 200 OK
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

    <h2>🎯 Practice: Consuming APIs with Java HttpClient</h2>
    
    <p>Now let's practice making HTTP requests to an external API using Java's modern HttpClient. We have a Countries API with real data you can fetch!</p>

    <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-3">📡 Available Endpoints</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>GET http://localhost:3000/api/countries</strong> - Get all countries</li>
        <li><strong>GET http://localhost:3000/api/countries?continent=Asia</strong> - Filter by continent</li>
        <li><strong>GET http://localhost:3000/api/cities?countryId=8</strong> - Get cities for China (ID: 8)</li>
        <li><strong>GET http://localhost:3000/api/cities?isCapital=true</strong> - Get capital cities</li>
        <li><strong>GET http://localhost:3000/api/languages?minSpeakers=100000000</strong> - Popular languages</li>
      </ul>
    </div>

    <h3>Practice Task 1: Fetch All Countries</h3>
    <p>Use HttpClient to fetch all countries and display their information.</p>

    <pre class="code-block">
      <code>
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;

public class CountriesClient {
    private static final String BASE_URL = "http://localhost:3000/api";
    
    public static void fetchAllCountries() {
        HttpClient client = HttpClient.newHttpClient();
        Gson gson = new Gson();
        
        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/countries"))
                .GET()
                .build();
            
            HttpResponse&lt;String&gt; response = client.send(
                request, 
                HttpResponse.BodyHandlers.ofString()
            );
            
            JsonObject data = gson.fromJson(response.body(), JsonObject.class);
            JsonArray countries = data.getAsJsonArray("data");
            
            System.out.println("Found " + countries.size() + " countries\\n");
            
            countries.forEach(element -> {
                JsonObject country = element.getAsJsonObject();
                System.out.println(country.get("name").getAsString() + 
                                 " (" + country.get("code").getAsString() + ")");
                System.out.println("  Capital: " + country.get("capital").getAsString());
                System.out.printf("  Population: %,d%n", 
                                country.get("population").getAsLong());
                System.out.println();
            });
            
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
    
    public static void main(String[] args) {
        fetchAllCountries();
    }
}
      </code>
    </pre>

    <h3>Practice Task 2: Get Cities in China</h3>
    <p>Make a request to get all cities in China (country ID: 8). Display each city with population.</p>

    <pre class="code-block">
      <code>
public static void fetchChinaCities() {
    HttpClient client = HttpClient.newHttpClient();
    Gson gson = new Gson();
    
    try {
        String url = BASE_URL + "/cities?countryId=8";
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .GET()
            .build();
        
        HttpResponse&lt;String&gt; response = client.send(
            request, 
            HttpResponse.BodyHandlers.ofString()
        );
        
        JsonObject data = gson.fromJson(response.body(), JsonObject.class);
        JsonArray cities = data.getAsJsonArray("data");
        
        System.out.println("Cities in China:\\n");
        cities.forEach(element -> {
            JsonObject city = element.getAsJsonObject();
            String badge = city.get("isCapital").getAsBoolean() ? "👑 " : "   ";
            System.out.printf("%s%s: %,d%n",
                            badge,
                            city.get("name").getAsString(),
                            city.get("population").getAsLong());
        });
        
    } catch (Exception e) {
        System.err.println("Error: " + e.getMessage());
    }
}
      </code>
    </pre>

    <h3>Practice Task 3: Find All Capital Cities</h3>
    <p>Request all capital cities and display them with their countries.</p>

    <pre class="code-block">
      <code>
public static void fetchCapitalCities() {
    HttpClient client = HttpClient.newHttpClient();
    Gson gson = new Gson();
    
    try {
        String url = BASE_URL + "/cities?isCapital=true";
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .GET()
            .build();
        
        HttpResponse&lt;String&gt; response = client.send(
            request, 
            HttpResponse.BodyHandlers.ofString()
        );
        
        JsonObject data = gson.fromJson(response.body(), JsonObject.class);
        JsonArray cities = data.getAsJsonArray("data");
        
        System.out.println("Capital Cities (" + cities.size() + "):\\n");
        cities.forEach(element -> {
            JsonObject city = element.getAsJsonObject();
            System.out.printf("👑 %s, %s%n",
                            city.get("name").getAsString(),
                            city.get("country").getAsString());
        });
        
    } catch (Exception e) {
        System.err.println("Error: " + e.getMessage());
    }
}
      </code>
    </pre>

    <div class="explanation-box bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-purple-900 mb-3">💪 More Practice Tasks</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Task 4:</strong> Get countries in Africa using <code>?continent=Africa</code></li>
        <li><strong>Task 5:</strong> Get languages with 200M+ speakers using <code>?minSpeakers=200000000</code></li>
        <li><strong>Challenge:</strong> Fetch all North American countries, get their cities and languages, calculate total population, and list unique languages</li>
      </ul>
    </div>
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
