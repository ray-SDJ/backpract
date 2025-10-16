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
}
      </code>
    </pre>

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
