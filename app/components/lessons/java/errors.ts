import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Error & Exception Handling in Java",
  description:
    "Master exception handling in Java with try-catch-finally, checked vs unchecked exceptions, custom exceptions, Spring Boot error handling, and logging.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <h2>Understanding Java Exceptions</h2>
    <p>Java has a robust exception hierarchy with two main types: checked exceptions (must be handled) and unchecked exceptions (runtime exceptions).</p>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🔍 Java Exception Hierarchy</h4>
      <ul class="text-sm text-blue-800 space-y-1 ml-4">
        <li>• <strong>Throwable:</strong> Base class for all errors and exceptions</li>
        <li>• <strong>Error:</strong> Serious problems (OutOfMemoryError, StackOverflowError)</li>
        <li>• <strong>Exception:</strong> Conditions that applications should catch</li>
        <li>• <strong>RuntimeException:</strong> Unchecked exceptions (NullPointerException, etc.)</li>
        <li>• <strong>Checked Exceptions:</strong> Must be declared or caught (IOException, SQLException)</li>
      </ul>
    </div>

    <div class="complexity-table bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-gray-900 mb-3">📊 Checked vs Unchecked Exceptions</h4>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-300">
            <th class="text-left py-2">Type</th>
            <th class="text-left py-2">Must Declare?</th>
            <th class="text-left py-2">Examples</th>
            <th class="text-left py-2">When to Use</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-gray-200">
            <td class="py-2"><strong>Checked</strong></td>
            <td class="py-2">Yes (throws)</td>
            <td class="py-2">IOException, SQLException</td>
            <td class="py-2">Recoverable errors</td>
          </tr>
          <tr>
            <td class="py-2"><strong>Unchecked</strong></td>
            <td class="py-2">No</td>
            <td class="py-2">NullPointerException, IllegalArgumentException</td>
            <td class="py-2">Programming errors</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>Basic Exception Handling</h2>
    <p>Use try-catch-finally blocks to handle exceptions:</p>

    <pre class="code-block">
      <code>
import java.io.*;
import java.util.*;

public class BasicExceptionHandling {
    
    // Simple try-catch
    public static int divide(int a, int b) {
        try {
            return a / b;
        } catch (ArithmeticException e) {
            System.out.println("Error: Cannot divide by zero");
            return 0;
        }
    }

    // Multiple catch blocks (specific to general)
    public static void readFile(String filename) {
        try {
            BufferedReader reader = new BufferedReader(
                new FileReader(filename)
            );
            String line = reader.readLine();
            System.out.println(line);
            reader.close();
        } catch (FileNotFoundException e) {
            System.out.println("File not found: " + filename);
        } catch (IOException e) {
            System.out.println("Error reading file: " + e.getMessage());
        }
    }

    // Try-catch-finally
    public static void processFile(String path) {
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader(path));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            System.err.println("IO Error: " + e.getMessage());
        } finally {
            // Always executes (cleanup)
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    System.err.println("Error closing file: " + e.getMessage());
                }
            }
        }
    }

    // Try-with-resources (Java 7+)
    public static void readFileModern(String path) {
        try (BufferedReader reader = new BufferedReader(
                new FileReader(path))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            System.err.println("Error: " + e.getMessage());
        } // Automatically closes reader
    }

    // Multi-catch (Java 7+)
    public static void parseData(String data) {
        try {
            int value = Integer.parseInt(data);
            int result = 100 / value;
            System.out.println("Result: " + result);
        } catch (NumberFormatException | ArithmeticException e) {
            System.out.println("Invalid input or division error: " + 
                e.getMessage());
        }
    }
}
      </code>
    </pre>

    <h2>Throwing Exceptions</h2>
    <p>Throw exceptions to signal error conditions:</p>

    <pre class="code-block">
      <code>
public class ThrowingExceptions {
    
    // Throwing unchecked exceptions
    public static void validateAge(int age) {
        if (age < 0) {
            throw new IllegalArgumentException(
                "Age cannot be negative: " + age
            );
        }
        
        if (age < 18) {
            throw new IllegalStateException(
                "User must be 18 or older"
            );
        }
    }

    // Throwing checked exceptions (must declare)
    public static void saveData(String filename, String data) 
            throws IOException {
        try (FileWriter writer = new FileWriter(filename)) {
            writer.write(data);
        } // IOException propagates to caller
    }

    // Re-throwing exceptions
    public static void processOrder(Order order) throws OrderException {
        try {
            validateOrder(order);
            saveToDatabase(order);
        } catch (SQLException e) {
            // Log error
            logger.error("Database error processing order", e);
            
            // Wrap and re-throw
            throw new OrderException(
                "Failed to process order", 
                e // Cause
            );
        }
    }

    // Validating parameters
    public static void processUser(User user) {
        Objects.requireNonNull(user, "User cannot be null");
        Objects.requireNonNull(user.getName(), "User name cannot be null");
        
        if (user.getName().isEmpty()) {
            throw new IllegalArgumentException("User name cannot be empty");
        }
        
        System.out.println("Processing: " + user.getName());
    }
}
      </code>
    </pre>

    <div class="complexity-table bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-gray-900 mb-3">📊 Common Java Exceptions</h4>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-300">
            <th class="text-left py-2">Exception Type</th>
            <th class="text-left py-2">Checked?</th>
            <th class="text-left py-2">When It Occurs</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>NullPointerException</code></td>
            <td class="py-2">No</td>
            <td class="py-2">Accessing null object</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>IllegalArgumentException</code></td>
            <td class="py-2">No</td>
            <td class="py-2">Invalid method argument</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>IllegalStateException</code></td>
            <td class="py-2">No</td>
            <td class="py-2">Invalid object state</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>IOException</code></td>
            <td class="py-2">Yes</td>
            <td class="py-2">File/stream operations</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>SQLException</code></td>
            <td class="py-2">Yes</td>
            <td class="py-2">Database operations</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>ClassNotFoundException</code></td>
            <td class="py-2">Yes</td>
            <td class="py-2">Class not found at runtime</td>
          </tr>
          <tr>
            <td class="py-2"><code>NumberFormatException</code></td>
            <td class="py-2">No</td>
            <td class="py-2">Invalid string to number conversion</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>Custom Exception Classes</h2>
    <p>Create domain-specific exceptions for your application:</p>

    <pre class="code-block">
      <code>
// Unchecked custom exception
public class ValidationException extends RuntimeException {
    public ValidationException(String message) {
        super(message);
    }

    public ValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}

// Checked custom exception
public class OrderException extends Exception {
    public OrderException(String message) {
        super(message);
    }

    public OrderException(String message, Throwable cause) {
        super(message, cause);
    }
}

// Exception with additional properties
public class InsufficientFundsException extends RuntimeException {
    private final double requiredAmount;
    private final double availableAmount;

    public InsufficientFundsException(double required, double available) {
        super(String.format(
            "Insufficient funds: need $%.2f, have $%.2f", 
            required, 
            available
        ));
        this.requiredAmount = required;
        this.availableAmount = available;
    }

    public double getRequiredAmount() {
        return requiredAmount;
    }

    public double getAvailableAmount() {
        return availableAmount;
    }

    public double getShortfall() {
        return requiredAmount - availableAmount;
    }
}

// Usage
public class BankAccount {
    private double balance;

    public void withdraw(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException(
                "Amount must be positive"
            );
        }

        if (amount > balance) {
            throw new InsufficientFundsException(amount, balance);
        }

        balance -= amount;
    }
}

// Caller handles custom exception
public class Main {
    public static void main(String[] args) {
        BankAccount account = new BankAccount();
        
        try {
            account.withdraw(1000.0);
        } catch (InsufficientFundsException e) {
            System.out.println(e.getMessage());
            System.out.printf("Shortfall: $%.2f%n", e.getShortfall());
        } catch (IllegalArgumentException e) {
            System.out.println("Invalid amount: " + e.getMessage());
        }
    }
}
      </code>
    </pre>

    <h2>Spring Boot Error Handling</h2>
    <p>Handle errors globally in Spring Boot applications:</p>

    <pre class="code-block">
      <code>
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.slf4j.*;

// Global exception handler
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = 
        LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Handle validation errors
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            ValidationException ex) {
        logger.warn("Validation error: {}", ex.getMessage());
        
        ErrorResponse error = new ErrorResponse(
            "Validation Error",
            ex.getMessage(),
            HttpStatus.BAD_REQUEST.value()
        );
        
        return ResponseEntity.badRequest().body(error);
    }

    // Handle not found errors
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException ex) {
        logger.warn("Resource not found: {}", ex.getMessage());
        
        ErrorResponse error = new ErrorResponse(
            "Not Found",
            ex.getMessage(),
            HttpStatus.NOT_FOUND.value()
        );
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    // Handle insufficient funds
    @ExceptionHandler(InsufficientFundsException.class)
    public ResponseEntity<Map<String, Object>> handleInsufficientFunds(
            InsufficientFundsException ex) {
        logger.warn("Insufficient funds: {}", ex.getMessage());
        
        Map<String, Object> error = new HashMap<>();
        error.put("error", ex.getMessage());
        error.put("shortfall", ex.getShortfall());
        error.put("status", 402);
        
        return ResponseEntity.status(402).body(error);
    }

    // Handle all other exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        logger.error("Unexpected error", ex);
        
        ErrorResponse error = new ErrorResponse(
            "Internal Server Error",
            "An unexpected error occurred",
            HttpStatus.INTERNAL_SERVER_ERROR.value()
        );
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(error);
    }
}

// Error response class
public class ErrorResponse {
    private String error;
    private String message;
    private int status;
    private long timestamp;

    public ErrorResponse(String error, String message, int status) {
        this.error = error;
        this.message = message;
        this.status = status;
        this.timestamp = System.currentTimeMillis();
    }

    // Getters and setters...
}

// Controller using custom exceptions
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private static final Logger logger = 
        LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        logger.info("Getting user: {}", id);
        
        User user = userService.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "User not found with id: " + id
            ));
        
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody UserDto dto) {
        logger.info("Creating user: {}", dto.getEmail());
        
        if (dto.getEmail() == null || dto.getName() == null) {
            throw new ValidationException(
                "Email and name are required"
            );
        }
        
        User user = userService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
}
      </code>
    </pre>

    <h2>Logging with SLF4J</h2>
    <p>Use SLF4J with Logback for structured logging:</p>

    <pre class="code-block">
      <code>
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

public class OrderService {
    
    private static final Logger logger = 
        LoggerFactory.getLogger(OrderService.class);

    public Order processOrder(Long orderId) {
        // Add context to logs
        MDC.put("orderId", orderId.toString());
        
        try {
            logger.info("Processing order");
            
            Order order = getOrder(orderId);
            validateOrder(order);
            processPayment(order);
            
            logger.info("Order processed successfully");
            return order;
            
        } catch (ValidationException e) {
            logger.warn("Order validation failed: {}", e.getMessage());
            throw e;
        } catch (PaymentException e) {
            logger.error("Payment processing failed", e);
            throw new OrderException("Order processing failed", e);
        } catch (Exception e) {
            logger.error("Unexpected error processing order", e);
            throw new OrderException("Unexpected error", e);
        } finally {
            MDC.clear();
        }
    }

    // Log with parameterized messages (better performance)
    public User createUser(String email, String name) {
        logger.info("Creating user with email: {}", email);
        
        try {
            User user = new User(email, name);
            userRepository.save(user);
            
            logger.info("User created successfully: userId={}", user.getId());
            return user;
            
        } catch (DataIntegrityViolationException e) {
            logger.warn("Email already exists: {}", email);
            throw new ValidationException("Email already registered");
        } catch (Exception e) {
            logger.error("Error creating user: email={}", email, e);
            throw new RuntimeException("User creation failed", e);
        }
    }

    // Different log levels
    public void demonstrateLogging() {
        logger.trace("Detailed trace information");
        logger.debug("Debug information for developers");
        logger.info("General information");
        logger.warn("Warning - something might be wrong");
        logger.error("Error - something went wrong");
    }
}
      </code>
    </pre>

    <h2>Try-With-Resources Best Practices</h2>
    <p>Automatically manage resources that need cleanup:</p>

    <pre class="code-block">
      <code>
import java.io.*;
import java.sql.*;

public class ResourceManagement {
    
    // Single resource
    public static void readFile(String path) throws IOException {
        try (BufferedReader reader = new BufferedReader(
                new FileReader(path))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } // Automatically closes reader
    }

    // Multiple resources
    public static void copyFile(String source, String dest) 
            throws IOException {
        try (FileInputStream in = new FileInputStream(source);
             FileOutputStream out = new FileOutputStream(dest)) {
            
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
        } // Both streams automatically closed
    }

    // Database connection
    public static List<User> getUsers() throws SQLException {
        List<User> users = new ArrayList<>();
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                 "SELECT * FROM users");
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                users.add(new User(
                    rs.getLong("id"),
                    rs.getString("name"),
                    rs.getString("email")
                ));
            }
        } // All resources automatically closed
        
        return users;
    }

    // Custom AutoCloseable resource
    public static class Transaction implements AutoCloseable {
        private Connection conn;
        
        public Transaction(Connection conn) throws SQLException {
            this.conn = conn;
            conn.setAutoCommit(false);
        }
        
        public void commit() throws SQLException {
            conn.commit();
        }
        
        @Override
        public void close() throws SQLException {
            if (conn != null && !conn.isClosed()) {
                conn.rollback();
                conn.setAutoCommit(true);
                conn.close();
            }
        }
    }

    // Usage
    public static void transferMoney(long fromId, long toId, double amount) 
            throws SQLException {
        try (Transaction tx = new Transaction(dataSource.getConnection())) {
            debit(fromId, amount);
            credit(toId, amount);
            tx.commit();
        } // Automatically rolls back if exception occurs
    }
}
      </code>
    </pre>

    <div class="quick-test bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-2">✅ Java Exception Handling Best Practices</h4>
      <ul class="text-sm text-green-800 space-y-1">
        <li>✓ Use try-with-resources for automatic resource management</li>
        <li>✓ Catch specific exceptions before general ones</li>
        <li>✓ Use unchecked exceptions for programming errors</li>
        <li>✓ Use checked exceptions for recoverable conditions</li>
        <li>✓ Always log exceptions before re-throwing or handling</li>
        <li>✓ Include original exception as cause when wrapping</li>
        <li>✓ Use @ControllerAdvice for centralized Spring error handling</li>
        <li>✓ Never catch Throwable or Error</li>
      </ul>
    </div>

    <div class="quick-test bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-red-900 mb-2">❌ Common Mistakes</h4>
      <ul class="text-sm text-red-800 space-y-1">
        <li>✗ Catching Exception and swallowing errors (empty catch)</li>
        <li>✗ Using exceptions for control flow</li>
        <li>✗ Logging and re-throwing (creates duplicate logs)</li>
        <li>✗ Not closing resources in finally (use try-with-resources)</li>
        <li>✗ Creating checked exceptions for programming errors</li>
        <li>✗ Throwing generic Exception instead of specific types</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Understand checked vs unchecked exceptions in Java",
    "Handle exceptions with try-catch-finally blocks",
    "Use try-with-resources for automatic resource management",
    "Create custom exception classes for domain-specific errors",
    "Implement global exception handling in Spring Boot",
    "Log exceptions effectively with SLF4J",
  ],
  practiceInstructions: [
    "Create a custom checked exception class (OrderException) and unchecked exception (ValidationException)",
    "Build a method using try-with-resources to read and process a file",
    "Implement a Spring Boot @RestControllerAdvice with multiple @ExceptionHandler methods",
    "Write a service method that logs exceptions with SLF4J and MDC context",
    "Create a custom AutoCloseable class for transaction management",
  ],
  hints: [
    "Checked exceptions must extend Exception, unchecked extend RuntimeException",
    "Try-with-resources syntax: try (Resource r = ...) { }",
    "@RestControllerAdvice provides global exception handling for all controllers",
    "Use logger.error(message, throwable) to log exception with stack trace",
    "AutoCloseable.close() is called automatically when leaving try block",
  ],
  solution: `import java.io.*;
import java.sql.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.slf4j.*;

// 1. Custom Exception Classes
public class OrderException extends Exception {
    public OrderException(String message) {
        super(message);
    }

    public OrderException(String message, Throwable cause) {
        super(message, cause);
    }
}

public class ValidationException extends RuntimeException {
    public ValidationException(String message) {
        super(message);
    }
}

// 2. Try-with-resources
public class FileProcessor {
    public static void processFile(String path) throws IOException {
        try (BufferedReader reader = new BufferedReader(new FileReader(path))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("Processing: " + line);
                // Process line
            }
        } // Automatically closes reader even if exception occurs
    }
}

// 3. Spring Boot Exception Handler
@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(ValidationException ex) {
        logger.warn("Validation error: {}", ex.getMessage());
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("Validation Error", ex.getMessage()));
    }

    @ExceptionHandler(OrderException.class)
    public ResponseEntity<ErrorResponse> handleOrder(OrderException ex) {
        logger.error("Order processing failed", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse("Order Error", ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        logger.error("Unexpected error", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse("Internal Error", "An unexpected error occurred"));
    }
}

// 4. Service with SLF4J Logging
public class OrderService {
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    public Order processOrder(Long orderId) throws OrderException {
        MDC.put("orderId", orderId.toString());
        
        try {
            logger.info("Processing order");
            
            Order order = getOrder(orderId);
            validateOrder(order);
            
            logger.info("Order processed successfully");
            return order;
        } catch (ValidationException e) {
            logger.warn("Validation failed: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Order processing failed", e);
            throw new OrderException("Processing failed", e);
        } finally {
            MDC.clear();
        }
    }
}

// 5. Custom AutoCloseable Transaction
public class Transaction implements AutoCloseable {
    private Connection conn;
    private static final Logger logger = LoggerFactory.getLogger(Transaction.class);
    
    public Transaction(Connection conn) throws SQLException {
        this.conn = conn;
        conn.setAutoCommit(false);
        logger.debug("Transaction started");
    }
    
    public void commit() throws SQLException {
        conn.commit();
        logger.info("Transaction committed");
    }
    
    @Override
    public void close() throws SQLException {
        if (conn != null && !conn.isClosed()) {
            conn.rollback();
            conn.setAutoCommit(true);
            conn.close();
            logger.debug("Transaction rolled back and closed");
        }
    }
}

// Usage
public void transferMoney(long fromId, long toId, double amount) throws SQLException {
    try (Transaction tx = new Transaction(dataSource.getConnection())) {
        debit(fromId, amount);
        credit(toId, amount);
        tx.commit();
    } // Automatically rolls back if exception occurs
}

System.out.println("Exception handling implementation complete!");`,
};
