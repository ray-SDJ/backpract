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
// @RestController combines @Controller and @ResponseBody
// It tells Spring this class handles HTTP requests and returns JSON
@RestController

// Base URL path - all methods will start with /api/users
@RequestMapping("/api/users")

// @Validated enables validation on request parameters
@Validated

// @CrossOrigin allows requests from specified origins (CORS)
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    // In-memory storage for demonstration (use database in real apps)
    private final List<UserDto> users = new ArrayList<>();
    private Long nextId = 1L;  // Auto-increment ID
    
    // GET /api/users - Retrieve all users with optional filtering and pagination
    @GetMapping  // Maps to GET /api/users
    public ResponseEntity<Map<String, Object>> getAllUsers(
            // @RequestParam extracts query parameters from URL
            // Example: /api/users?page=0&size=10&search=john
            @RequestParam(defaultValue = "0") int page,      // Which page to show
            @RequestParam(defaultValue = "10") int size,     // Items per page
            @RequestParam(required = false) String search) { // Optional search term
        
        // Filter users based on search parameter
        List<UserDto> filteredUsers = users;
        if (search != null && !search.isEmpty()) {
            // Stream API: filter users whose username contains search term
            filteredUsers = users.stream()
                .filter(user -> user.getUsername().toLowerCase().contains(search.toLowerCase()))
                .collect(Collectors.toList());  // Convert stream back to list
        }
        
        // Apply pagination - show only a subset of results
        int start = page * size;  // Calculate starting index
        int end = Math.min(start + size, filteredUsers.size());  // Calculate end
        List<UserDto> pageUsers = filteredUsers.subList(start, end);
        
        // Create response with metadata
        // Map.of() creates an immutable map (Java 9+)
        Map<String, Object> response = Map.of(
            "users", pageUsers,              // The actual data
            "page", page,                    // Current page number
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
