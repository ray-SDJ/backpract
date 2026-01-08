import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Spring Boot Complete Guide",
  description:
    "Master Spring Boot from fundamentals to advanced topics including REST APIs, dependency injection, Spring Data JPA, and microservices architecture.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>Spring Boot is the most popular Java framework for building production-ready applications. This comprehensive guide covers everything from basics to advanced enterprise patterns.</p>

    <h2>What is Spring Boot?</h2>
    
    <p>Spring Boot is an opinionated framework built on top of the Spring Framework. It eliminates boilerplate configuration and provides:</p>

    <div class="feature-list">
      <ul>
        <li><strong>Auto-configuration:</strong> Intelligent defaults based on your dependencies</li>
        <li><strong>Embedded Servers:</strong> Tomcat, Jetty, or Undertow included</li>
        <li><strong>Production-Ready:</strong> Actuator endpoints for monitoring and health checks</li>
        <li><strong>Starter Dependencies:</strong> Pre-configured dependency bundles</li>
        <li><strong>Opinionated Defaults:</strong> Convention over configuration approach</li>
        <li><strong>No XML Configuration:</strong> Pure Java or annotations</li>
      </ul>
    </div>

    <h2>Creating a Spring Boot Project</h2>
    
    <p>Use Spring Initializr at <strong>start.spring.io</strong> or the command line:</p>

    <pre class="code-block">
      <code>
# Using Spring Boot CLI
spring init --dependencies=web,data-jpa,postgresql,validation \\
  --type=maven-project --java-version=17 \\
  --group-id=com.example --artifact-id=demo \\
  demo

cd demo
./mvnw spring-boot:run
      </code>
    </pre>

    <h2>Project Structure</h2>
    
    <pre class="code-block">
      <code>
demo/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/demo/
│   │   │       ├── DemoApplication.java    # Main entry point
│   │   │       ├── controller/             # REST controllers
│   │   │       ├── service/                # Business logic
│   │   │       ├── repository/             # Data access
│   │   │       ├── model/                  # Domain entities
│   │   │       ├── dto/                    # Data transfer objects
│   │   │       ├── config/                 # Configuration classes
│   │   │       └── exception/              # Custom exceptions
│   │   └── resources/
│   │       ├── application.properties      # Configuration
│   │       ├── static/                     # Static resources
│   │       └── templates/                  # Templates (Thymeleaf)
│   └── test/                               # Unit and integration tests
├── pom.xml                                 # Maven dependencies
└── mvnw                                    # Maven wrapper
      </code>
    </pre>

    <h2>Main Application Class</h2>
    
    <pre class="code-block">
      <code>
// DemoApplication.java
package com.example.demo;

// Import Spring Boot starter class and auto-configuration
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication is a meta-annotation that combines:
// 1. @Configuration - Marks class as source of bean definitions
// 2. @EnableAutoConfiguration - Enables Spring Boot's auto-configuration
// 3. @ComponentScan - Scans this package and subpackages for components
@SpringBootApplication
public class DemoApplication {
    
    // main() method is the entry point of the application
    // When you run this class, it starts the entire Spring Boot application
    public static void main(String[] args) {
        // SpringApplication.run() bootstraps the application:
        // 1. Creates ApplicationContext (Spring container)
        // 2. Registers all beans (components, services, repositories)
        // 3. Starts embedded web server (Tomcat by default)
        // 4. Initializes application and makes it ready to receive requests
        SpringApplication.run(DemoApplication.class, args);
    }
}
      </code>
    </pre>

    <h2>Creating REST Controllers</h2>
    
    <pre class="code-block">
      <code>
// UserController.java
package com.example.demo.controller;

// Import required Spring Web and HTTP classes
import org.springframework.web.bind.annotation.*;    // REST annotations
import org.springframework.http.ResponseEntity;       // Type-safe HTTP response
import org.springframework.http.HttpStatus;           // HTTP status codes
import org.springframework.beans.factory.annotation.Autowired;  // Dependency injection
import jakarta.validation.Valid;                      // Bean validation
import java.util.List;

// @RestController combines @Controller and @ResponseBody
// All methods automatically serialize return values to JSON/XML
@RestController

// Base path for all endpoints in this controller
// Full URL: http://localhost:8080/api/users
@RequestMapping("/api/users")

// @CrossOrigin allows requests from specified origins (CORS)
// This allows frontend apps from localhost:3000 to call this API
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    // @Autowired tells Spring to inject UserService instance
    // Spring's dependency injection handles object creation
    // Field injection (shown here) vs constructor injection (preferred)
    @Autowired
    private UserService userService;

    // GET /api/users - Retrieve all users
    // @GetMapping maps HTTP GET requests to this method
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        // Call service layer to fetch users
        List<User> users = userService.findAll();
        
        // ResponseEntity.ok() returns:
        // - HTTP 200 (OK) status
        // - List<User> as JSON in response body
        return ResponseEntity.ok(users);
    }

    // GET /api/users/{id} - Retrieve user by ID
    // {id} is a path variable that gets extracted from URL
    // Example: GET /api/users/123 -> id = 123
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(
        // @PathVariable extracts {id} from URL and converts to Long
        @PathVariable Long id
    ) {
        // Call service to find user, throws exception if not found
        User user = userService.findById(id);
        
        // Return 200 OK with user object as JSON
        return ResponseEntity.ok(user);
    }

    // POST /api/users - Create new user
    // @PostMapping maps HTTP POST requests to this method
    @PostMapping
    public ResponseEntity<User> createUser(
        // @RequestBody deserializes JSON from request body to User object
        // @Valid triggers validation annotations (@NotNull, @Email, etc.)
        // If validation fails, returns 400 Bad Request automatically
        @Valid @RequestBody User user
    ) {
        // Save user to database via service layer
        User savedUser = userService.save(user);
        
        // ResponseEntity.status(CREATED) returns:
        // - HTTP 201 (Created) status
        // - Saved user object as JSON
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    // PUT /api/users/{id} - Update existing user
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
        @PathVariable Long id,
        @Valid @RequestBody User user
    ) {
        // Update user in database
        User updatedUser = userService.update(id, user);
        return ResponseEntity.ok(updatedUser);
    }

    // DELETE /api/users/{id} - Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        
        // ResponseEntity.noContent() returns:
        // - HTTP 204 (No Content) status
        // - Empty response body (Void)
        return ResponseEntity.noContent().build();
    }

    // GET /api/users/search?email=example@email.com - Search by query param
    // @RequestParam extracts query parameters from URL
    @GetMapping("/search")
    public ResponseEntity<User> findByEmail(
        // @RequestParam extracts "email" parameter from query string
        // Example: /api/users/search?email=john@example.com
        // required=true means this parameter must be present (default)
        @RequestParam(required = true) String email
    ) {
        User user = userService.findByEmail(email);
        return ResponseEntity.ok(user);
    }
}
      </code>
    </pre>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🔍 REST Controller Annotations Explained</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>@RestController:</strong> Combines @Controller + @ResponseBody, auto-converts responses to JSON</li>
        <li><strong>@RequestMapping("/path"):</strong> Base URL path for all endpoints in the controller</li>
        <li><strong>@GetMapping:</strong> Maps HTTP GET requests (retrieve data)</li>
        <li><strong>@PostMapping:</strong> Maps HTTP POST requests (create data)</li>
        <li><strong>@PutMapping:</strong> Maps HTTP PUT requests (update data)</li>
        <li><strong>@DeleteMapping:</strong> Maps HTTP DELETE requests (delete data)</li>
        <li><strong>@PathVariable:</strong> Extracts values from URL path (/users/{id})</li>
        <li><strong>@RequestParam:</strong> Extracts query parameters (?email=value)</li>
        <li><strong>@RequestBody:</strong> Deserializes JSON request body to Java object</li>
        <li><strong>@Valid:</strong> Triggers Bean Validation on request body</li>
        <li><strong>@Autowired:</strong> Dependency injection of Spring-managed beans</li>
        <li><strong>ResponseEntity&lt;T&gt;:</strong> Type-safe HTTP response with status, headers, and body</li>
      </ul>
    </div>

    <h2>Service Layer with Business Logic</h2>
    
    <pre class="code-block">
      <code>
// UserService.java
package com.example.demo.service;

import org.springframework.stereotype.Service;           // Marks as service component
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;  // Transaction management
import java.util.List;

// @Service marks this class as a Spring service component
// Spring automatically detects and registers it as a bean
// Services contain business logic and orchestrate repository calls
@Service

// @Transactional ensures all methods run within database transactions
// If any method throws exception, transaction rolls back automatically
@Transactional
public class UserService {

    // Inject UserRepository for database operations
    // Constructor injection (preferred over field injection)
    private final UserRepository userRepository;

    // Constructor injection (preferred approach)
    // @Autowired is optional on constructors (Spring 4.3+)
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Read-only transaction (optimization for SELECT queries)
    // No write lock needed, improves performance
    @Transactional(readOnly = true)
    public List<User> findAll() {
        // Delegate to repository for database query
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public User findById(Long id) {
        // orElseThrow() handles Optional return from repository
        // Throws custom exception if user not found
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    // Write operation (creates transaction automatically)
    public User save(User user) {
        // Add business logic here (validation, password hashing, etc.)
        // Example: user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        return userRepository.save(user);
    }

    public User update(Long id, User userDetails) {
        // First check if user exists
        User user = findById(id);
        
        // Update fields
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        // ... update other fields
        
        // Save updated entity
        return userRepository.save(user);
    }

    public void delete(Long id) {
        // Verify user exists before deleting
        User user = findById(id);
        userRepository.delete(user);
    }
}
      </code>
    </pre>

    <h2>Repository Layer with Spring Data JPA</h2>
    
    <pre class="code-block">
      <code>
// UserRepository.java
package com.example.demo.repository;

// Import Spring Data JPA repository interfaces
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

// @Repository marks this as a repository component
// Spring automatically implements this interface at runtime
// No need to write implementation - Spring Data JPA handles it
@Repository

// JpaRepository<Entity, ID> provides CRUD operations out of the box:
// - save(), saveAll()
// - findById(), findAll()
// - deleteById(), delete(), deleteAll()
// - count(), existsById()
// User = entity type, Long = primary key type
public interface UserRepository extends JpaRepository<User, Long> {

    // Method name query (Spring Data JPA convention)
    // Spring generates SQL from method name:
    // findBy + Email = SELECT * FROM users WHERE email = ?
    // Returns Optional<User> - safely handles not found case
    Optional<User> findByEmail(String email);

    // Multiple conditions with And
    // findBy + Email + And + Name
    // SQL: SELECT * FROM users WHERE email = ? AND name = ?
    Optional<User> findByEmailAndName(String email, String name);

    // Like query for partial matching
    // SQL: SELECT * FROM users WHERE name LIKE '%value%'
    List<User> findByNameContaining(String name);

    // Ordering results
    // SQL: SELECT * FROM users WHERE email = ? ORDER BY name ASC
    List<User> findByEmailOrderByNameAsc(String email);

    // @Query annotation for custom JPQL queries
    // JPQL uses entity names (User) instead of table names
    // :email is a named parameter
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findUserByEmail(@Param("email") String email);

    // Native SQL query with @Query
    // nativeQuery = true uses actual SQL syntax
    // Useful for complex queries or database-specific features
    @Query(value = "SELECT * FROM users WHERE email = :email", nativeQuery = true)
    Optional<User> findUserByEmailNative(@Param("email") String email);

    // Count query
    // SQL: SELECT COUNT(*) FROM users WHERE email = ?
    long countByEmail(String email);

    // Exists query (returns boolean)
    // SQL: SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)
    boolean existsByEmail(String email);

    // Delete query
    // SQL: DELETE FROM users WHERE email = ?
    // @Transactional required for delete/update queries
    void deleteByEmail(String email);
}
      </code>
    </pre>

    <h2>Entity Classes with JPA</h2>
    
    <pre class="code-block">
      <code>
// User.java
package com.example.demo.model;

// Import JPA annotations for ORM mapping
import jakarta.persistence.*;                    // JPA entity annotations
import jakarta.validation.constraints.*;         // Bean validation
import java.time.LocalDateTime;
import java.util.List;

// @Entity marks this class as a JPA entity (maps to database table)
// JPA will create/manage a database table for this class
@Entity

// @Table specifies table details (optional if table name = class name)
// name = table name in database
// uniqueConstraints = creates unique index on specified columns
@Table(name = "users", 
       uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class User {

    // @Id marks this field as the primary key
    @Id
    
    // @GeneratedValue specifies primary key generation strategy
    // IDENTITY = database auto-increment (for MySQL, PostgreSQL)
    // AUTO = JPA chooses strategy based on database
    // SEQUENCE = uses database sequence (Oracle, PostgreSQL)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @Column specifies column details (optional if defaults are fine)
    // nullable = NOT NULL constraint
    // length = varchar length
    // unique = unique constraint
    @Column(nullable = false, length = 100)
    
    // Bean validation annotations
    // @NotBlank = not null, not empty, not whitespace
    @NotBlank(message = "Name is required")
    private String name;

    @Column(nullable = false, unique = true, length = 255)
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @Column(nullable = false)
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    // Enum field stored as string in database
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    // Date/time field with automatic timestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    // @CreationTimestamp auto-sets timestamp on insert
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    // @UpdateTimestamp auto-updates timestamp on update
    private LocalDateTime updatedAt;

    // One-to-Many relationship: One user has many posts
    // mappedBy = field name in Post entity that owns relationship
    // cascade = operations that cascade to related entities
    // orphanRemoval = delete posts when removed from user
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts;

    // @PrePersist callback executes before entity is saved to database
    // Useful for setting timestamps, default values, etc.
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // @PreUpdate callback executes before entity is updated
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Constructors, getters, setters
    public User() {}

    public User(String name, String email, String password, UserRole role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Getters and setters omitted for brevity...
}

// Enum for user roles
enum UserRole {
    USER, ADMIN, MODERATOR
}
      </code>
    </pre>

    <h2>Application Configuration</h2>
    
    <pre class="code-block">
      <code>
# application.properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/demo_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Configuration
# ddl-auto options:
# - create: drop and recreate tables on startup (DEV only!)
# - update: update schema if needed (use with caution)
# - validate: validate schema, no changes
# - none: do nothing (PROD)
spring.jpa.hibernate.ddl-auto=update

# Show SQL queries in console (DEV only)
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Database dialect
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# Server Configuration
server.port=8080
server.error.include-message=always
server.error.include-stacktrace=never

# Logging Configuration
logging.level.root=INFO
logging.level.com.example.demo=DEBUG
logging.level.org.springframework.web=DEBUG
logging.level.org.hibernate.SQL=DEBUG

# JSON Configuration
spring.jackson.serialization.indent_output=true
spring.jackson.default-property-inclusion=non_null
      </code>
    </pre>

    <h2>Exception Handling</h2>
    
    <pre class="code-block">
      <code>
// GlobalExceptionHandler.java
package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

// @RestControllerAdvice applies exception handling globally to all controllers
// Centralizes error handling in one place
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle ResourceNotFoundException (custom exception)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
        ResourceNotFoundException ex
    ) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    // Handle validation errors from @Valid annotation
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
        MethodArgumentNotValidException ex
    ) {
        Map<String, Object> errors = new HashMap<>();
        errors.put("timestamp", LocalDateTime.now());
        errors.put("status", HttpStatus.BAD_REQUEST.value());
        
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            fieldErrors.put(error.getField(), error.getDefaultMessage())
        );
        errors.put("errors", fieldErrors);
        
        return ResponseEntity.badRequest().body(errors);
    }

    // Handle all other exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "An unexpected error occurred",
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}

// ErrorResponse DTO
class ErrorResponse {
    private int status;
    private String message;
    private LocalDateTime timestamp;
    
    // Constructor, getters, setters...
}
      </code>
    </pre>

    <h2>Testing with JUnit and MockMvc</h2>
    
    <pre class="code-block">
      <code>
// UserControllerTest.java
package com.example.demo.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void shouldReturnUserWhenValidId() throws Exception {
        User user = new User(1L, "John Doe", "john@example.com");
        when(userService.findById(1L)).thenReturn(user);

        mockMvc.perform(get("/api/users/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("John Doe"))
            .andExpect(jsonPath("$.email").value("john@example.com"));
    }
}
      </code>
    </pre>

    <h2>Running the Application</h2>
    
    <pre class="code-block">
      <code>
# Development mode (with hot reload)
./mvnw spring-boot:run

# Build JAR file
./mvnw clean package

# Run JAR file
java -jar target/demo-0.0.1-SNAPSHOT.jar

# Run with custom profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
      </code>
    </pre>

    <div class="tip-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-3">💡 Spring Boot Best Practices</h4>
      <ul class="space-y-2">
        <li>✅ Use constructor injection instead of field injection</li>
        <li>✅ Keep controllers thin - move business logic to services</li>
        <li>✅ Use DTOs for request/response instead of exposing entities</li>
        <li>✅ Implement proper exception handling with @RestControllerAdvice</li>
        <li>✅ Use @Transactional on service methods, not controllers</li>
        <li>✅ Never use ddl-auto=create or update in production</li>
        <li>✅ Use application-{profile}.properties for environment-specific config</li>
        <li>✅ Write integration tests for critical endpoints</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Understand Spring Boot architecture and auto-configuration",
    "Create REST APIs with proper layered architecture (Controller, Service, Repository)",
    "Implement CRUD operations using Spring Data JPA",
    "Configure database connections and JPA properties",
    "Use dependency injection and Spring annotations effectively",
    "Handle exceptions globally with @RestControllerAdvice",
    "Validate request data with Bean Validation",
    "Write unit and integration tests for Spring Boot applications",
  ],
  practiceInstructions: [
    "Create a new Spring Boot project at start.spring.io with Web, JPA, and PostgreSQL dependencies",
    "Set up your database connection in application.properties",
    "Create a User entity with JPA annotations and validation",
    "Implement UserRepository extending JpaRepository",
    "Create UserService with business logic and transaction management",
    "Build UserController with full CRUD REST endpoints",
    "Add global exception handling with custom error responses",
    "Test your API using Postman or curl",
  ],
  hints: [
    "Use @SpringBootApplication on your main class to enable auto-configuration",
    "Constructor injection is preferred over @Autowired field injection",
    "Use @Transactional on service layer methods for transaction management",
    "ResponseEntity gives you full control over HTTP response status and headers",
    "Spring Data JPA generates queries from method names - follow naming conventions",
    "Use @Valid with @RequestBody to trigger Bean Validation",
    "Set spring.jpa.hibernate.ddl-auto=update only in development",
  ],
  solution: `// Complete Spring Boot application structure shown above
// Key components:
// 1. DemoApplication.java - Main entry point with @SpringBootApplication
// 2. UserController.java - REST endpoints with @RestController
// 3. UserService.java - Business logic with @Service and @Transactional
// 4. UserRepository.java - Data access with JpaRepository
// 5. User.java - JPA entity with validation
// 6. GlobalExceptionHandler.java - Centralized error handling
// 7. application.properties - Configuration

// Run the application:
// ./mvnw spring-boot:run

// Test endpoints:
// GET    http://localhost:8080/api/users
// GET    http://localhost:8080/api/users/1
// POST   http://localhost:8080/api/users
// PUT    http://localhost:8080/api/users/1
// DELETE http://localhost:8080/api/users/1`,
};
