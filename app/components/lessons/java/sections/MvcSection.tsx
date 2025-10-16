import React from "react";
import { Zap } from "lucide-react";

// TypeScript interfaces
interface CodeExplanationProps {
  code: string;
  explanation: Array<{ label: string; desc: string }>;
}

const CodeExplanation: React.FC<CodeExplanationProps> = ({
  code,
  explanation,
}) => (
  <div className="mt-4 space-y-3">
    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
      <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
    </div>
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-semibold text-blue-900 mb-3">Code Explanation:</h4>
      <div className="space-y-2">
        {explanation.map((item, index) => (
          <div key={index} className="flex gap-3">
            <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono whitespace-nowrap">
              {item.label}
            </code>
            <span className="text-blue-700 text-sm">{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const MvcSection = {
  id: "mvc",
  title: "Spring MVC & RESTful APIs",
  icon: Zap,
  overview:
    "Build robust REST APIs with Spring MVC. Learn about controllers, request mapping, validation, and error handling.",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">Advanced Controller Patterns</h3>
        <CodeExplanation
          code={`package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import javax.validation.Valid;
import javax.validation.constraints.*;
import java.util.List;
import java.util.ArrayList;

// User DTO
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
    
    // Constructors, getters, setters
    public UserDto() {}
    
    public UserDto(Long id, String username, String email, Integer age) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.age = age;
    }
    
    // Getters and setters...
}

@RestController
@RequestMapping("/api/users")
@Validated
@CrossOrigin(origins = "http://localhost:3000") // Enable CORS
public class UserController {
    
    private final List<UserDto> users = new ArrayList<>();
    private Long nextId = 1L;
    
    // GET /api/users - Get all users with pagination
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        
        List<UserDto> filteredUsers = users;
        
        if (search != null && !search.isEmpty()) {
            filteredUsers = users.stream()
                .filter(user -> user.getUsername().toLowerCase().contains(search.toLowerCase()) ||
                               user.getEmail().toLowerCase().contains(search.toLowerCase()))
                .collect(Collectors.toList());
        }
        
        int start = page * size;
        int end = Math.min(start + size, filteredUsers.size());
        List<UserDto> pageUsers = filteredUsers.subList(start, end);
        
        Map<String, Object> response = Map.of(
            "users", pageUsers,
            "page", page,
            "size", size,
            "totalElements", filteredUsers.size(),
            "totalPages", (int) Math.ceil((double) filteredUsers.size() / size)
        );
        
        return ResponseEntity.ok(response);
    }
    
    // GET /api/users/{id} - Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return users.stream()
            .filter(user -> user.getId().equals(id))
            .findFirst()
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    // POST /api/users - Create new user
    @PostMapping
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserDto userDto) {
        // Check if username already exists
        boolean usernameExists = users.stream()
            .anyMatch(user -> user.getUsername().equals(userDto.getUsername()));
        
        if (usernameExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        
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
}`}
          explanation={[
            {
              label: "@Valid",
              desc: "Triggers validation of request body using Bean Validation annotations",
            },
            {
              label: "@RequestParam(defaultValue = '0')",
              desc: "Extract query parameters with default values",
            },
            {
              label: "@CrossOrigin",
              desc: "Enable CORS for frontend integration",
            },
            {
              label: "ResponseEntity.status(HttpStatus.CREATED)",
              desc: "Return custom HTTP status codes",
            },
            {
              label: "@NotBlank, @Email, @Min/@Max",
              desc: "Bean Validation annotations for data validation",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">Global Exception Handling</h3>
        <CodeExplanation
          code={`package com.example.demo.exception;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

// Custom exception classes
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(Long id) {
        super("User not found with id: " + id);
    }
}

public class DuplicateUserException extends RuntimeException {
    public DuplicateUserException(String username) {
        super("User already exists with username: " + username);
    }
}

// Error response DTO
public class ErrorResponse {
    private String message;
    private String error;
    private int status;
    private LocalDateTime timestamp;
    private Map<String, String> validationErrors;
    
    // Constructors, getters, setters...
}

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
        errorResponse.setError("VALIDATION_ERROR");
        errorResponse.setStatus(400);
        errorResponse.setTimestamp(LocalDateTime.now());
        errorResponse.setValidationErrors(errors);
        
        return ResponseEntity.badRequest().body(errorResponse);
    }
    
    // Handle custom exceptions
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setMessage(ex.getMessage());
        errorResponse.setError("USER_NOT_FOUND");
        errorResponse.setStatus(404);
        errorResponse.setTimestamp(LocalDateTime.now());
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
    
    @ExceptionHandler(DuplicateUserException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateUser(DuplicateUserException ex) {
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setMessage(ex.getMessage());
        errorResponse.setError("DUPLICATE_USER");
        errorResponse.setStatus(409);
        errorResponse.setTimestamp(LocalDateTime.now());
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }
    
    // Handle generic exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setMessage("An unexpected error occurred");
        errorResponse.setError("INTERNAL_SERVER_ERROR");
        errorResponse.setStatus(500);
        errorResponse.setTimestamp(LocalDateTime.now());
        
        // Log the actual exception for debugging
        ex.printStackTrace();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}`}
          explanation={[
            {
              label: "@ControllerAdvice",
              desc: "Global exception handler for all controllers in the application",
            },
            {
              label: "@ExceptionHandler",
              desc: "Method that handles specific exception types",
            },
            {
              label: "MethodArgumentNotValidException",
              desc: "Exception thrown when @Valid validation fails",
            },
            {
              label: "FieldError",
              desc: "Contains field name and validation error message",
            },
          ]}
        />
      </div>
    </div>
  ),
};
