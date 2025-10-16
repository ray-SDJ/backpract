import React from "react";
import { Code2 } from "lucide-react";

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

export const TestingSection = {
  id: "testing",
  title: "Testing & Production",
  icon: Code2,
  overview:
    "Write comprehensive tests with JUnit, Mockito, and TestContainers. Learn deployment strategies and production best practices.",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">Unit & Integration Testing</h3>
        <CodeExplanation
          code={`// Add to pom.xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>

// Unit Tests
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    @DisplayName("Should create user when valid data provided")
    void shouldCreateUser_WhenValidDataProvided() {
        // Given
        User user = new User("john", "john@example.com", "password123");
        user.setAge(25);
        
        when(userRepository.existsByUsername("john")).thenReturn(false);
        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(user);
        
        // When
        User createdUser = userService.createUser(user);
        
        // Then
        assertThat(createdUser).isNotNull();
        assertThat(createdUser.getUsername()).isEqualTo("john");
        assertThat(createdUser.getEmail()).isEqualTo("john@example.com");
        
        verify(userRepository).existsByUsername("john");
        verify(userRepository).existsByEmail("john@example.com");
        verify(userRepository).save(user);
    }
    
    @Test
    @DisplayName("Should throw exception when username already exists")
    void shouldThrowException_WhenUsernameAlreadyExists() {
        // Given
        User user = new User("john", "john@example.com", "password123");
        when(userRepository.existsByUsername("john")).thenReturn(true);
        
        // When & Then
        assertThatThrownBy(() -> userService.createUser(user))
            .isInstanceOf(DuplicateUserException.class)
            .hasMessageContaining("john");
        
        verify(userRepository).existsByUsername("john");
        verify(userRepository, never()).save(any(User.class));
    }
    
    @Test
    @DisplayName("Should return user when found by id")
    void shouldReturnUser_WhenFoundById() {
        // Given
        Long userId = 1L;
        User user = new User("john", "john@example.com", "password123");
        user.setId(userId);
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        
        // When
        Optional<User> foundUser = userService.getUserById(userId);
        
        // Then
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getId()).isEqualTo(userId);
        assertThat(foundUser.get().getUsername()).isEqualTo("john");
    }
}

// Integration Tests
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class UserControllerIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:13")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Autowired
    private UserRepository userRepository;
    
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }
    
    @Test
    @DisplayName("Should create user via REST API")
    void shouldCreateUserViaRestApi() {
        // Given
        UserDto userDto = new UserDto();
        userDto.setUsername("john");
        userDto.setEmail("john@example.com");
        userDto.setAge(25);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserDto> request = new HttpEntity<>(userDto, headers);
        
        // When
        ResponseEntity<UserDto> response = restTemplate.postForEntity(
            "/api/users", request, UserDto.class);
        
        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getUsername()).isEqualTo("john");
        assertThat(response.getBody().getId()).isNotNull();
        
        // Verify in database
        Optional<User> savedUser = userRepository.findByUsername("john");
        assertThat(savedUser).isPresent();
    }
    
    @Test
    @DisplayName("Should return validation errors for invalid user data")
    void shouldReturnValidationErrors_ForInvalidUserData() {
        // Given
        UserDto invalidUser = new UserDto();
        invalidUser.setUsername("jo"); // Too short
        invalidUser.setEmail("invalid-email"); // Invalid format
        invalidUser.setAge(15); // Too young
        
        HttpEntity<UserDto> request = new HttpEntity<>(invalidUser);
        
        // When
        ResponseEntity<ErrorResponse> response = restTemplate.postForEntity(
            "/api/users", request, ErrorResponse.class);
        
        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getValidationErrors()).isNotEmpty();
    }
}`}
          explanation={[
            {
              label: "@ExtendWith(MockitoExtension.class)",
              desc: "JUnit 5 extension for Mockito integration",
            },
            {
              label: "@Mock, @InjectMocks",
              desc: "Create mock objects and inject them into the test subject",
            },
            {
              label: "@Testcontainers",
              desc: "Integration with TestContainers for real database testing",
            },
            {
              label: "@DynamicPropertySource",
              desc: "Configure application properties from container at runtime",
            },
            {
              label: "assertThatThrownBy()",
              desc: "AssertJ method for testing expected exceptions",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">
          Production Configuration & Deployment
        </h3>
        <CodeExplanation
          code={`# application-prod.properties
server.port=8080
spring.profiles.active=prod

# Database (PostgreSQL)
spring.datasource.url=jdbc:postgresql://localhost:5432/myapp
spring.datasource.username=\${DB_USERNAME:myapp}
spring.datasource.password=\${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# JWT Configuration
app.jwt.secret=\${JWT_SECRET}
app.jwt.expiration=\${JWT_EXPIRATION:86400000}

# Logging
logging.level.com.example.demo=INFO
logging.level.org.springframework.web=WARN
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
logging.file.name=logs/application.log
logging.file.max-size=10MB
logging.file.max-history=30

# Actuator (Health checks, metrics)
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.endpoint.health.show-details=when-authorized
management.metrics.export.prometheus.enabled=true

# Security Headers
server.servlet.session.cookie.http-only=true
server.servlet.session.cookie.secure=true

# Dockerfile
FROM openjdk:17-jre-slim

# Create app directory
WORKDIR /app

# Copy JAR file
COPY target/demo-*.jar app.jar

# Create non-root user
RUN addgroup --system spring && adduser --system --group spring
USER spring:spring

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Expose port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_HOST=postgres
      - DB_USERNAME=myapp
      - DB_PASSWORD=secret
      - JWT_SECRET=myVerySecureJwtSecretKey
    depends_on:
      - postgres
    restart: unless-stopped
    
  postgres:
    image: postgres:13
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=myapp
      - POSTGRES_PASSWORD=secret
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:

# kubernetes deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: spring-boot-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: spring-boot-app
  template:
    metadata:
      labels:
        app: spring-boot-app
    spec:
      containers:
      - name: app
        image: myregistry/spring-boot-app:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        - name: DB_HOST
          value: "postgres-service"
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: username
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5`}
          explanation={[
            {
              label: "${DB_PASSWORD}",
              desc: "Environment variable for sensitive configuration",
            },
            {
              label: "management.endpoints.web.exposure",
              desc: "Expose Spring Boot Actuator endpoints for monitoring",
            },
            {
              label: "HEALTHCHECK in Dockerfile",
              desc: "Container health monitoring for orchestration",
            },
            {
              label: "livenessProbe/readinessProbe",
              desc: "Kubernetes health checks for container management",
            },
          ]}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">🚀 Production Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • Use profiles (dev, test, prod) for environment-specific
            configuration
          </li>
          <li>• Implement proper logging with structured JSON format</li>
          <li>• Add monitoring with Micrometer and Prometheus</li>
          <li>• Use database migration tools like Flyway or Liquibase</li>
          <li>• Implement circuit breakers with Resilience4j</li>
          <li>• Set up distributed tracing with Zipkin or Jaeger</li>
        </ul>
      </div>
    </div>
  ),
};
