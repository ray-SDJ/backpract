import React from "react";
import { BookOpen } from "lucide-react";

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

export const IntroSection = {
  id: "intro",
  title: "Introduction to Spring Boot",
  icon: BookOpen,
  overview:
    "Spring Boot is a powerful Java framework that simplifies Spring application development with auto-configuration, embedded servers, and production-ready features.",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">What is Spring Boot?</h3>
        <p className="text-gray-700 mb-3">
          Spring Boot takes an opinionated approach to Spring framework
          configuration, providing sensible defaults and auto-configuration to
          get you up and running quickly. It&apos;s perfect for building
          microservices, web applications, and enterprise solutions.
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
          <li>
            <strong>Auto-configuration:</strong> Automatically configures Spring
            based on classpath
          </li>
          <li>
            <strong>Embedded servers:</strong> Tomcat, Jetty, or Undertow
            built-in
          </li>
          <li>
            <strong>Production-ready:</strong> Health checks, metrics, and
            monitoring
          </li>
          <li>
            <strong>No XML:</strong> Annotation-based configuration
          </li>
          <li>
            <strong>Starter dependencies:</strong> Pre-configured dependency
            bundles
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">
          Your First Spring Boot Application
        </h3>
        <CodeExplanation
          code={`// Create project at https://start.spring.io
// Dependencies: Spring Web, Spring Boot DevTools

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

    @PostMapping("/hello")
    public ResponseEntity<Map<String, String>> createGreeting(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String greeting = "Hello, " + (name != null ? name : "World") + "!";
        
        Map<String, String> response = Map.of(
            "greeting", greeting,
            "received", name != null ? name : "anonymous"
        );
        return ResponseEntity.ok(response);
    }
}`}
          explanation={[
            {
              label: "@SpringBootApplication",
              desc: "Combines @Configuration, @EnableAutoConfiguration, and @ComponentScan",
            },
            {
              label: "@RestController",
              desc: "Combines @Controller and @ResponseBody for REST API endpoints",
            },
            {
              label: "@RequestMapping('/api')",
              desc: "Base URL mapping for all endpoints in this controller",
            },
            {
              label: "@GetMapping('/hello')",
              desc: "Maps HTTP GET requests to this method",
            },
            {
              label: "@PathVariable",
              desc: "Extracts values from URL path parameters",
            },
            {
              label: "ResponseEntity.ok()",
              desc: "Returns HTTP 200 status with response body",
            },
          ]}
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">💡 Quick Test</h4>
        <p className="text-sm text-green-800">
          Run with{" "}
          <code className="bg-white px-2 py-1 rounded">
            ./mvnw spring-boot:run
          </code>
          , then visit{" "}
          <code className="bg-white px-2 py-1 rounded">
            http://localhost:8080/api/hello
          </code>
        </p>
      </div>
    </div>
  ),
};
