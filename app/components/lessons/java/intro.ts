import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Introduction to Spring Boot",
  description:
    "Spring Boot is a powerful Java framework that simplifies Spring application development with auto-configuration, embedded servers, and production-ready features.",
  difficulty: "Beginner",
  content: `<div class="lesson-content">
    <p>Welcome to Spring Boot development! In this lesson, you'll learn the fundamentals of Spring Boot and create your first web application.</p>

    <h2>What is Spring Boot?</h2>
    
    <p>Spring Boot takes an opinionated approach to Spring framework configuration, providing sensible defaults and auto-configuration to get you up and running quickly. It's perfect for building microservices, web applications, and enterprise solutions.</p>

    <div class="feature-list">
      <h3>Key features of Spring Boot:</h3>
      <ul>
        <li><strong>Auto-configuration:</strong> Automatically configures Spring based on classpath</li>
        <li><strong>Embedded servers:</strong> Tomcat, Jetty, or Undertow built-in</li>
        <li><strong>Production-ready:</strong> Health checks, metrics, and monitoring</li>
        <li><strong>No XML:</strong> Annotation-based configuration</li>
        <li><strong>Starter dependencies:</strong> Pre-configured dependency bundles</li>
      </ul>
    </div>

    <h2>Setting Up Your First Spring Boot App</h2>
    
    <p>The easiest way to create a Spring Boot project is using Spring Initializr at <strong>start.spring.io</strong>. Select dependencies: Spring Web and Spring Boot DevTools.</p>

    <pre class="code-block">
      <code>
// Application.java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
      </code>
    </pre>

    <h2>Creating Your First REST Controller</h2>
    
    <p>Let's create a simple REST controller:</p>

    <pre class="code-block">
      <code>
// HelloController.java
package com.example.demo.controller;

// Import statements - bring in classes from Spring framework and Java libraries
import org.springframework.web.bind.annotation.*;    // Annotations for REST controllers
import org.springframework.http.ResponseEntity;       // Type-safe HTTP response wrapper
import java.time.LocalDateTime;                       // Modern date/time API
import java.util.Map;                                 // Key-value pair collection

// @RestController annotation combines @Controller + @ResponseBody
// Tells Spring: "This class handles HTTP requests and returns JSON automatically"
// Spring automatically serializes return values to JSON
@RestController

// @RequestMapping defines base URL for all endpoints in this controller
// "/api" means all routes here start with /api
// Full URLs: /api/hello, /api/hello/john, etc.
@RequestMapping("/api")

// public class = accessible from anywhere
// Controller naming convention: <Resource>Controller
public class HelloController {

    // @GetMapping maps HTTP GET requests to this method
    // "/hello" is relative to @RequestMapping("/api")
    // Full URL: GET /api/hello
    @GetMapping("/hello")
    
    // Method signature breakdown:
    // - public = accessible from outside class
    // - ResponseEntity<T> = wrapper that includes HTTP status + headers + body
    // - Map<String, Object> = response body type (key=String, value=any Object)
    public ResponseEntity<Map<String, Object>> hello() {
        
        // Map.of() creates an immutable (unchangeable) map with key-value pairs
        // Modern Java 9+ syntax for creating maps quickly
        // Keys are strings, values can be any type (String, LocalDateTime, etc.)
        Map<String, Object> response = Map.of(
            "message", "Hello from Spring Boot!",   // String value
            "timestamp", LocalDateTime.now(),        // Current date/time
            "status", "success"                      // String value
        );
        
        // ResponseEntity.ok() is a static method that:
        // 1. Sets HTTP status to 200 (OK)
        // 2. Wraps the response map in ResponseEntity
        // 3. Spring auto-converts Map to JSON
        // Returns: {"message": "Hello from Spring Boot!", "timestamp": "2024-01-15T10:30:00", "status": "success"}
        return ResponseEntity.ok(response);
    }

    // Route with path variable (dynamic URL segment)
    // {name} is a placeholder that captures part of the URL
    // Example: /api/hello/john -> name = "john"
    //          /api/hello/alice -> name = "alice"
    @GetMapping("/hello/{name}")
    
    // @PathVariable annotation extracts {name} from URL and passes it to method parameter
    // String name = whatever is in the URL path
    public ResponseEntity<Map<String, String>> helloName(@PathVariable String name) {
        
        // Create response map with personalized message
        // This map only contains String values (no mixed types)
        Map<String, String> response = Map.of(
            "message", "Hello, " + name + "!",   // String concatenation with +
            "name", name                          // Echo back the name
        );
        
        // Return 200 OK with JSON response
        return ResponseEntity.ok(response);
    }
}
      </code>
    </pre>
    
    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🔍 Spring Boot Annotations Explained</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>@RestController:</strong> Marks class as REST API controller, auto-converts responses to JSON</li>
        <li><strong>@RequestMapping("/api"):</strong> Base URL path for all endpoints in this controller</li>
        <li><strong>@GetMapping("/hello"):</strong> Maps HTTP GET requests to method, full path is /api/hello</li>
        <li><strong>@PathVariable:</strong> Extracts value from URL path {name} and injects into method parameter</li>
        <li><strong>ResponseEntity&lt;T&gt;:</strong> Type-safe wrapper for HTTP response with status, headers, and body</li>
        <li><strong>Map.of():</strong> Java 9+ immutable map creation syntax</li>
      </ul>
    </div>

    <h2>Code Explanation</h2>
    
    <div class="explanation-list">
      <ul>
        <li><strong>@SpringBootApplication:</strong> Combines @Configuration, @EnableAutoConfiguration, and @ComponentScan</li>
        <li><strong>@RestController:</strong> Combines @Controller and @ResponseBody for REST API endpoints</li>
        <li><strong>@RequestMapping("/api"):</strong> Base URL mapping for all endpoints in this controller</li>
        <li><strong>@GetMapping("/hello"):</strong> Maps HTTP GET requests to this method</li>
        <li><strong>@PathVariable:</strong> Extracts values from URL path parameters</li>
        <li><strong>ResponseEntity.ok():</strong> Returns HTTP 200 status with response body</li>
      </ul>
    </div>

    <h2>Quick Test</h2>
    
    <p>Run with <code>./mvnw spring-boot:run</code>, then visit <code>http://localhost:8080/api/hello</code> in your browser!</p>
  </div>`,
  objectives: [
    "Understand what Spring Boot is and its key features",
    "Set up a basic Spring Boot project using Spring Initializr",
    "Create your first REST controller with @RestController",
    "Use @GetMapping to handle HTTP GET requests",
    "Return JSON responses using ResponseEntity",
  ],
  practiceInstructions: [
    "Go to start.spring.io and create a new project with Spring Web dependency",
    "Create a DemoApplication class with @SpringBootApplication",
    "Add a HelloController with @RestController annotation",
    "Implement a /hello endpoint that returns a JSON response",
    "Run the application and test the endpoint in your browser",
  ],
  hints: [
    "Make sure you have Java 11+ and Maven installed",
    "Use @RequestMapping at class level for base path",
    "ResponseEntity allows you to control HTTP status codes",
    "Spring Boot DevTools enables automatic restart on code changes",
  ],
  solution: `// DemoApplication.java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}

// HelloController.java  
package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/hello")
    public ResponseEntity<Map<String, Object>> hello() {
        Map<String, Object> response = Map.of(
            "message", "Hello from Spring Boot!",
            "timestamp", LocalDateTime.now(),
            "status", "success"
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/hello/{name}")
    public ResponseEntity<Map<String, String>> helloName(@PathVariable String name) {
        Map<String, String> response = Map.of(
            "message", "Hello, " + name + "!",
            "name", name
        );
        return ResponseEntity.ok(response);
    }
}`,
};
