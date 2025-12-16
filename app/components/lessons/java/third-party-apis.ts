import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Working with Third-Party APIs",
  description:
    "Learn how to integrate external APIs like Google Gemini, Claude, OpenAI, and other services into your Java Spring Boot applications.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>Third-party API integration is essential for modern Java applications. Learn how to make HTTP requests, handle authentication, and process responses from AI services, payment gateways, and external data sources.</p>

    <h2>Understanding Third-Party APIs in Java</h2>
    
    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">☕ Java HTTP Clients</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>RestTemplate:</strong> Classic Spring HTTP client (synchronous)</li>
        <li><strong>WebClient:</strong> Modern reactive HTTP client (async, Spring WebFlux)</li>
        <li><strong>HttpClient:</strong> Java 11+ built-in HTTP client</li>
        <li><strong>OkHttp:</strong> Popular third-party HTTP client</li>
        <li><strong>Feign:</strong> Declarative REST client (Spring Cloud)</li>
      </ul>
    </div>

    <h2>Setting Up Environment Variables</h2>
    
    <p>Configure Spring Boot to use environment variables:</p>

    <pre class="code-block">
      <code>
// application.properties
// Properties file for Spring Boot configuration
// Key-value pairs separated by =

// API Keys (loaded from environment variables)
// \${GEMINI_API_KEY:} = environment variable with empty default
// : after variable name = default value if not set
gemini.api.key=\${GEMINI_API_KEY:}
claude.api.key=\${CLAUDE_API_KEY:}
stripe.api.key=\${STRIPE_SECRET_KEY:}

// HTTP client configuration
// Connect timeout = time to establish connection
// Read timeout = time to wait for response
http.client.connect-timeout=10000
http.client.read-timeout=30000

// Or use application.yml (YAML format):
# gemini:
#   api:
#     key: \${GEMINI_API_KEY:}
# claude:
#   api:
#     key: \${CLAUDE_API_KEY:}
      </code>
    </pre>

    <pre class="code-block">
      <code>
// Configuration class to load properties
// @Configuration = Spring configuration class (holds beans)
// @ConfigurationProperties = bind properties to Java object
package com.example.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Data;  // Lombok generates getters/setters

// @Data = Lombok annotation (generates getters, setters, toString, etc.)
@Data
// @Configuration = marks class as Spring configuration
@Configuration
// @ConfigurationProperties = binds properties with prefix "gemini"
// Looks for gemini.api.key in application.properties
@ConfigurationProperties(prefix = "gemini")
public class GeminiConfig {
    // Inner class for nested properties
    // gemini.api.key maps to api.key
    private Api api = new Api();
    
    @Data
    public static class Api {
        // String key = field name matches "key" in properties
        // Spring automatically sets this from gemini.api.key
        private String key;
    }
}

// Using the configuration in a service
// @Service = Spring service component (business logic)
@Service
public class GeminiService {
    // @Autowired = dependency injection (Spring provides instance)
    // final = field cannot be reassigned after initialization
    private final GeminiConfig geminiConfig;
    
    // Constructor injection (preferred over field injection)
    // Spring automatically calls this constructor and provides GeminiConfig
    public GeminiService(GeminiConfig geminiConfig) {
        this.geminiConfig = geminiConfig;
    }
    
    public String getApiKey() {
        // Access API key from configuration
        return geminiConfig.getApi().getKey();
    }
}
      </code>
    </pre>

    <h2>Making HTTP Requests with RestTemplate</h2>
    
    <p>RestTemplate is the classic Spring HTTP client:</p>

    <pre class="code-block">
      <code>
// RestTemplate configuration
package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.boot.web.client.RestTemplateBuilder;
import java.time.Duration;

@Configuration
public class RestTemplateConfig {
    
    // @Bean = method creates Spring-managed object
    // Spring will call this method and store returned object
    // Other classes can inject RestTemplate
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        // RestTemplateBuilder = fluent API for configuring RestTemplate
        return builder
            // setConnectTimeout() = connection timeout duration
            // Duration.ofSeconds(10) = 10 second timeout
            .setConnectTimeout(Duration.ofSeconds(10))
            // setReadTimeout() = response timeout duration
            .setReadTimeout(Duration.ofSeconds(30))
            .build();
    }
}

// Using RestTemplate in a service
package com.example.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.http.*;
import java.util.HashMap;
import java.util.Map;

@Service
public class ExternalApiService {
    
    // Inject RestTemplate
    private final RestTemplate restTemplate;
    
    public ExternalApiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    
    // GET request example
    public Map<String, Object> getUserData(Long userId) {
        try {
            // String url = API endpoint URL
            String url = "https://api.example.com/users/" + userId;
            
            // Create headers
            // HttpHeaders = Spring class for HTTP headers
            HttpHeaders headers = new HttpHeaders();
            // setContentType() = set Content-Type header
            // MediaType.APPLICATION_JSON = "application/json"
            headers.setContentType(MediaType.APPLICATION_JSON);
            // setBearerAuth() = set Authorization: Bearer <token> header
            headers.setBearerAuth("your-api-key");
            
            // Create request entity
            // HttpEntity<T> = wrapper for request body and headers
            // <Void> = no request body (GET request)
            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
            
            // Make GET request
            // exchange() = flexible method for any HTTP method
            // Arguments:
            //   1. URL string
            //   2. HTTP method (GET, POST, PUT, DELETE)
            //   3. Request entity (body + headers)
            //   4. Response type (Map.class for JSON object)
            // Returns ResponseEntity<T> with status, headers, body
            ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                requestEntity,
                Map.class  // Response body type (Spring parses JSON to Map)
            );
            
            // response.getStatusCode() = HTTP status code (200, 404, etc.)
            if (response.getStatusCode() == HttpStatus.OK) {
                // response.getBody() = parsed response body
                return (Map<String, Object>) response.getBody();
            } else {
                // Handle non-200 status
                throw new RuntimeException("API request failed with status: " + response.getStatusCode());
            }
            
        } catch (HttpClientErrorException e) {
            // HttpClientErrorException = 4xx errors (400, 404, etc.)
            // e.getStatusCode() = status code
            // e.getResponseBodyAsString() = response body as string
            System.err.println("HTTP Error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            throw new RuntimeException("Failed to fetch user data", e);
        } catch (Exception e) {
            // Catch all other exceptions
            System.err.println("Error: " + e.getMessage());
            throw new RuntimeException("API request failed", e);
        }
    }
    
    // POST request example
    public Map<String, Object> createUser(Map<String, Object> userData) {
        try {
            String url = "https://api.example.com/users";
            
            // Create headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth("your-api-key");
            
            // Create request entity with body
            // HttpEntity<Map> = request with Map body (converted to JSON)
            HttpEntity<Map<String, Object>> requestEntity = 
                new HttpEntity<>(userData, headers);
            
            // Make POST request
            // postForEntity() = shortcut for POST requests
            // Returns ResponseEntity<T>
            ResponseEntity<Map> response = restTemplate.postForEntity(
                url,
                requestEntity,
                Map.class  // Response type
            );
            
            return (Map<String, Object>) response.getBody();
            
        } catch (Exception e) {
            System.err.println("Error creating user: " + e.getMessage());
            throw new RuntimeException("Failed to create user", e);
        }
    }
}
      </code>
    </pre>

    <h2>Integrating Google Gemini AI</h2>
    
    <p>Let's create a Spring Boot controller for Gemini AI:</p>

    <pre class="code-block">
      <code>
// Service class for Gemini AI integration
package com.example.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.example.config.GeminiConfig;
import java.util.*;

@Service
public class GeminiService {
    
    // Inject dependencies
    private final RestTemplate restTemplate;
    private final GeminiConfig geminiConfig;
    
    // Gemini API endpoint
    // static final = constant (cannot change, class-level)
    private static final String GEMINI_API_URL = 
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    
    // Constructor injection
    public GeminiService(RestTemplate restTemplate, GeminiConfig geminiConfig) {
        this.restTemplate = restTemplate;
        this.geminiConfig = geminiConfig;
    }
    
    public Map<String, Object> generateContent(String prompt) {
        try {
            // Build request body
            // Map<String, Object> = JSON-like structure
            Map<String, Object> requestBody = new HashMap<>();
            
            // Build contents array
            // List<Map> = array of objects
            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> content = new HashMap<>();
            
            // Build parts array
            List<Map<String, String>> parts = new ArrayList<>();
            Map<String, String> part = new HashMap<>();
            // put() = add key-value pair to map
            part.put("text", prompt);
            parts.add(part);
            
            content.put("parts", parts);
            contents.add(content);
            
            requestBody.put("contents", contents);
            
            // Create headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            // Create request entity
            HttpEntity<Map<String, Object>> requestEntity = 
                new HttpEntity<>(requestBody, headers);
            
            // Build URL with API key
            // String.format() = formatted string (like printf)
            // %s = string placeholder
            String url = String.format("%s?key=%s", 
                GEMINI_API_URL, 
                geminiConfig.getApi().getKey()
            );
            
            // Make POST request
            ResponseEntity<Map> response = restTemplate.postForEntity(
                url,
                requestEntity,
                Map.class
            );
            
            // Parse response
            // response.getBody() = response as Map
            Map<String, Object> responseBody = response.getBody();
            
            // Navigate response structure to get generated text
            // (List<Map>) = cast to List of Maps
            List<Map<String, Object>> candidates = 
                (List<Map<String, Object>>) responseBody.get("candidates");
            
            // Get first candidate
            Map<String, Object> candidate = candidates.get(0);
            Map<String, Object> contentResponse = 
                (Map<String, Object>) candidate.get("content");
            List<Map<String, Object>> responseParts = 
                (List<Map<String, Object>>) contentResponse.get("parts");
            
            // Extract text from first part
            String generatedText = (String) responseParts.get(0).get("text");
            
            // Return structured response
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("response", generatedText);
            result.put("model", "gemini-pro");
            
            return result;
            
        } catch (Exception e) {
            // Log error
            System.err.println("Gemini API Error: " + e.getMessage());
            
            // Return error response
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to generate content");
            errorResponse.put("message", e.getMessage());
            
            return errorResponse;
        }
    }
}

// Controller for Gemini API endpoints
package com.example.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.example.service.GeminiService;
import java.util.Map;

// @RestController = marks class as REST API controller
// Combines @Controller + @ResponseBody
@RestController
// @RequestMapping = base path for all routes in this controller
@RequestMapping("/api/ai")
public class GeminiController {
    
    // Inject GeminiService
    private final GeminiService geminiService;
    
    public GeminiController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }
    
    // @PostMapping = handle POST requests to /api/ai/generate
    @PostMapping("/generate")
    // @RequestBody = parse JSON request body to Map
    // ResponseEntity<Map> = response with status code and body
    public ResponseEntity<Map<String, Object>> generateText(
            @RequestBody Map<String, String> request) {
        
        // Extract prompt from request
        // request.get("prompt") = get value for "prompt" key
        String prompt = request.get("prompt");
        
        // Validate input
        if (prompt == null || prompt.isEmpty()) {
            // Map.of() = create immutable map (Java 9+)
            return ResponseEntity
                .badRequest()  // 400 Bad Request
                .body(Map.of("error", "Prompt is required"));
        }
        
        // Call service
        Map<String, Object> result = geminiService.generateContent(prompt);
        
        // Check if successful
        if ((Boolean) result.get("success")) {
            // ResponseEntity.ok() = 200 OK status
            return ResponseEntity.ok(result);
        } else {
            // ResponseEntity.status() = custom status code
            return ResponseEntity
                .status(500)  // 500 Internal Server Error
                .body(result);
        }
    }
}
      </code>
    </pre>

    <h2>Using WebClient for Reactive Programming</h2>
    
    <p>WebClient is the modern, reactive HTTP client:</p>

    <pre class="code-block">
      <code>
// WebClient configuration
package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import reactor.netty.http.client.HttpClient;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Configuration
public class WebClientConfig {
    
    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        // Configure HttpClient with timeouts
        // HttpClient = Netty HTTP client (underlying implementation)
        HttpClient httpClient = HttpClient.create()
            // option() = set socket option
            // CONNECT_TIMEOUT_MILLIS = connection timeout
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 10000)
            // doOnConnected() = callback when connection established
            .doOnConnected(conn -> conn
                // addHandlerLast() = add handler to pipeline
                // ReadTimeoutHandler = timeout for reading response
                .addHandlerLast(new ReadTimeoutHandler(30, TimeUnit.SECONDS))
                // WriteTimeoutHandler = timeout for writing request
                .addHandlerLast(new WriteTimeoutHandler(30, TimeUnit.SECONDS))
            );
        
        // Build WebClient with custom HttpClient
        return builder
            // clientConnector() = set HTTP client
            // ReactorClientHttpConnector = wrapper for Netty client
            .clientConnector(new ReactorClientHttpConnector(httpClient))
            .build();
    }
}

// Using WebClient in a service
package com.example.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.Map;

@Service
public class ReactiveApiService {
    
    private final WebClient webClient;
    
    public ReactiveApiService(WebClient webClient) {
        this.webClient = webClient;
    }
    
    // Reactive GET request
    // Mono<T> = reactive type (0 or 1 element)
    // Like Promise in JavaScript
    public Mono<Map> getUserDataReactive(Long userId) {
        // webClient.get() = create GET request
        return webClient
            .get()
            // uri() = set request URL
            .uri("https://api.example.com/users/" + userId)
            // header() = add HTTP header
            .header("Authorization", "Bearer your-api-key")
            // retrieve() = execute request and get response
            .retrieve()
            // bodyToMono() = extract response body
            // Mono<Map> = reactive response (completes asynchronously)
            .bodyToMono(Map.class);
        
        // To use the response:
        // getUserDataReactive(123L)
        //     .subscribe(data -> System.out.println(data));
    }
    
    // Reactive POST request
    public Mono<Map> createUserReactive(Map<String, Object> userData) {
        return webClient
            .post()
            .uri("https://api.example.com/users")
            .header("Authorization", "Bearer your-api-key")
            // bodyValue() = set request body
            .bodyValue(userData)
            .retrieve()
            .bodyToMono(Map.class);
    }
    
    // Blocking version (if you need synchronous)
    public Map getUserDataBlocking(Long userId) {
        // block() = wait for Mono to complete (converts to synchronous)
        // Returns result or throws exception
        return getUserDataReactive(userId).block();
    }
}
      </code>
    </pre>

    <h2>Integrating Anthropic Claude AI</h2>
    
    <p>Working with Claude AI in Spring Boot:</p>

    <pre class="code-block">
      <code>
// Claude service implementation
package com.example.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@Service
public class ClaudeService {
    
    private final RestTemplate restTemplate;
    private final String claudeApiKey;
    
    private static final String CLAUDE_API_URL = 
        "https://api.anthropic.com/v1/messages";
    
    // @Value = inject property value from application.properties
    public ClaudeService(
            RestTemplate restTemplate,
            @Value("\${claude.api.key}") String claudeApiKey) {
        this.restTemplate = restTemplate;
        this.claudeApiKey = claudeApiKey;
    }
    
    public Map<String, Object> chat(String message, String systemPrompt) {
        try {
            // Build request body
            Map<String, Object> requestBody = new HashMap<>();
            
            // Set model
            requestBody.put("model", "claude-3-sonnet-20240229");
            
            // Set max_tokens
            requestBody.put("max_tokens", 1024);
            
            // Set system prompt (optional)
            if (systemPrompt != null && !systemPrompt.isEmpty()) {
                requestBody.put("system", systemPrompt);
            }
            
            // Build messages array
            List<Map<String, String>> messages = new ArrayList<>();
            Map<String, String> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", message);
            messages.add(userMessage);
            
            requestBody.put("messages", messages);
            
            // Create headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            // Claude requires specific headers
            headers.set("x-api-key", claudeApiKey);
            headers.set("anthropic-version", "2023-06-01");
            
            // Create request entity
            HttpEntity<Map<String, Object>> requestEntity = 
                new HttpEntity<>(requestBody, headers);
            
            // Make POST request
            ResponseEntity<Map> response = restTemplate.postForEntity(
                CLAUDE_API_URL,
                requestEntity,
                Map.class
            );
            
            // Parse response
            Map<String, Object> responseBody = response.getBody();
            
            // Extract text from response
            // content = array of content blocks
            List<Map<String, Object>> content = 
                (List<Map<String, Object>>) responseBody.get("content");
            String responseText = (String) content.get(0).get("text");
            
            // Extract usage information
            Map<String, Object> usage = 
                (Map<String, Object>) responseBody.get("usage");
            
            // Build result
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("response", responseText);
            result.put("model", responseBody.get("model"));
            result.put("usage", Map.of(
                "inputTokens", usage.get("input_tokens"),
                "outputTokens", usage.get("output_tokens")
            ));
            
            return result;
            
        } catch (Exception e) {
            System.err.println("Claude API Error: " + e.getMessage());
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to generate response");
            errorResponse.put("message", e.getMessage());
            
            return errorResponse;
        }
    }
}

// Controller for Claude endpoints
@RestController
@RequestMapping("/api/claude")
public class ClaudeController {
    
    private final ClaudeService claudeService;
    
    public ClaudeController(ClaudeService claudeService) {
        this.claudeService = claudeService;
    }
    
    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(
            @RequestBody Map<String, String> request) {
        
        String message = request.get("message");
        String systemPrompt = request.get("system_prompt");
        
        if (message == null || message.isEmpty()) {
            return ResponseEntity
                .badRequest()
                .body(Map.of("error", "Message is required"));
        }
        
        Map<String, Object> result = claudeService.chat(message, systemPrompt);
        
        if ((Boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(500).body(result);
        }
    }
}
      </code>
    </pre>

    <h2>Best Practices for Java API Integration</h2>
    
    <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-3">✅ Java API Best Practices</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Use @ConfigurationProperties:</strong> Type-safe configuration binding</li>
        <li><strong>Constructor Injection:</strong> Preferred over field injection</li>
        <li><strong>RestTemplate vs WebClient:</strong> Use WebClient for new projects</li>
        <li><strong>Error Handling:</strong> Use @ExceptionHandler for global error handling</li>
        <li><strong>Timeouts:</strong> Always configure connection and read timeouts</li>
        <li><strong>Logging:</strong> Use SLF4J for proper logging</li>
        <li><strong>Async Processing:</strong> Use @Async for long-running API calls</li>
        <li><strong>Circuit Breaker:</strong> Use Resilience4j for fault tolerance</li>
      </ul>
    </div>

    <div class="explanation-box bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-orange-900 mb-3">⚠️ Common Java API Pitfalls</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>No Timeouts:</strong> Always set connection and read timeouts</li>
        <li><strong>Blocking Calls:</strong> Use async or reactive for high-traffic apps</li>
        <li><strong>No Error Handling:</strong> Catch HttpClientErrorException and handle properly</li>
        <li><strong>Hardcoded URLs:</strong> Use application.properties for configuration</li>
        <li><strong>Memory Leaks:</strong> Close resources properly (try-with-resources)</li>
        <li><strong>Not Using DTOs:</strong> Create proper request/response classes</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Configure Spring Boot to use environment variables for API keys",
    "Make HTTP requests using RestTemplate and WebClient",
    "Integrate AI services like Google Gemini and Anthropic Claude",
    "Implement proper error handling and timeouts for external API calls",
    "Use reactive programming with WebClient for non-blocking API calls",
  ],
  practiceInstructions: [
    "Add dependencies: spring-boot-starter-web, spring-boot-starter-webflux",
    "Create application.properties with API key properties",
    "Create a @ConfigurationProperties class for configuration",
    "Build a Spring Boot controller that calls Gemini AI",
    "Test your endpoint using Postman or curl",
  ],
  hints: [
    "Use @Value or @ConfigurationProperties to inject API keys",
    "Configure RestTemplate with timeouts in @Bean method",
    "Always use try-catch blocks for external API calls",
    "Use ResponseEntity for flexible HTTP responses",
    "Consider WebClient for reactive/async operations",
  ],
  solution: `// Complete Spring Boot service with Gemini AI
@Service
public class GeminiService {
    
    private final RestTemplate restTemplate;
    private final String apiKey;
    
    private static final String API_URL = 
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    
    public GeminiService(
            RestTemplate restTemplate,
            @Value("\${gemini.api.key}") String apiKey) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
    }
    
    public Map<String, Object> generateContent(String prompt) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> content = new HashMap<>();
            List<Map<String, String>> parts = new ArrayList<>();
            Map<String, String> part = new HashMap<>();
            
            part.put("text", prompt);
            parts.add(part);
            content.put("parts", parts);
            contents.add(content);
            requestBody.put("contents", contents);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> entity = 
                new HttpEntity<>(requestBody, headers);
            
            String url = String.format("%s?key=%s", API_URL, apiKey);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(
                url, entity, Map.class);
            
            return response.getBody();
            
        } catch (Exception e) {
            throw new RuntimeException("API call failed", e);
        }
    }
}`,
};

export default lessonData;
