import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Testing & Production",
  description:
    "Write comprehensive tests with JUnit, Mockito, and TestContainers. Learn deployment strategies and production best practices.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <p>Learn to write comprehensive tests and deploy Spring Boot applications to production with proper configuration and monitoring.</p>

    <h2>Testing Dependencies</h2>
    
    <p>Add testing dependencies to your pom.xml:</p>

    <pre class="code-block">
      <code>
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-test&lt;/artifactId&gt;
    &lt;scope&gt;test&lt;/scope&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.testcontainers&lt;/groupId&gt;
    &lt;artifactId&gt;junit-jupiter&lt;/artifactId&gt;
    &lt;scope&gt;test&lt;/scope&gt;
&lt;/dependency&gt;
      </code>
    </pre>

    <h2>Unit Testing with JUnit and Mockito</h2>
    
    <pre class="code-block">
      <code>
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
        assertThatThrownBy(() -&gt; userService.createUser(user))
            .isInstanceOf(DuplicateUserException.class)
            .hasMessageContaining("john");
        
        verify(userRepository).existsByUsername("john");
        verify(userRepository, never()).save(any(User.class));
    }
}
      </code>
    </pre>

    <h2>Integration Testing with TestContainers</h2>
    
    <pre class="code-block">
      <code>
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class UserControllerIntegrationTest {
    
    @Container
    static PostgreSQLContainer&lt;?&gt; postgres = new PostgreSQLContainer&lt;&gt;("postgres:13")
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
        HttpEntity&lt;UserDto&gt; request = new HttpEntity&lt;&gt;(userDto, headers);
        
        // When
        ResponseEntity&lt;UserDto&gt; response = restTemplate.postForEntity(
            "/api/users", request, UserDto.class);
        
        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getUsername()).isEqualTo("john");
        
        // Verify in database
        Optional&lt;User&gt; savedUser = userRepository.findByUsername("john");
        assertThat(savedUser).isPresent();
    }
}
      </code>
    </pre>

    <h2>Production Configuration</h2>
    
    <p>Configure your application for production in application-prod.properties:</p>

    <pre class="code-block">
      <code>
# Production configuration
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
logging.file.name=logs/application.log

# Actuator (Health checks, metrics)
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=when-authorized

# Security Headers
server.servlet.session.cookie.http-only=true
server.servlet.session.cookie.secure=true
      </code>
    </pre>

    <h2>Docker Deployment</h2>
    
    <p>Create a Dockerfile for containerization:</p>

    <pre class="code-block">
      <code>
FROM openjdk:17-jre-slim

# Create app directory
WORKDIR /app

# Copy JAR file
COPY target/demo-*.jar app.jar

# Create non-root user
RUN addgroup --system spring && adduser --system --group spring
USER spring:spring

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \\
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Expose port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
      </code>
    </pre>

    <h2>Docker Compose Setup</h2>
    
    <pre class="code-block">
      <code>
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

volumes:
  postgres_data:
      </code>
    </pre>

    <h2>Kubernetes Deployment</h2>
    
    <pre class="code-block">
      <code>
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
          periodSeconds: 5
      </code>
    </pre>

    <h2>Testing Best Practices</h2>
    
    <div class="explanation-list">
      <ul>
        <li><strong>@ExtendWith(MockitoExtension.class):</strong> JUnit 5 extension for Mockito integration</li>
        <li><strong>@Mock, @InjectMocks:</strong> Create mock objects and inject them into test subjects</li>
        <li><strong>@Testcontainers:</strong> Integration testing with real database containers</li>
        <li><strong>@DynamicPropertySource:</strong> Configure application properties from containers at runtime</li>
        <li><strong>assertThatThrownBy():</strong> AssertJ method for testing expected exceptions</li>
      </ul>
    </div>

    <h2>Production Tips</h2>
    
    <div class="explanation-list">
      <ul>
        <li>Use profiles (dev, test, prod) for environment-specific configuration</li>
        <li>Implement proper logging with structured JSON format</li>
        <li>Add monitoring with Micrometer and Prometheus</li>
        <li>Use database migration tools like Flyway or Liquibase</li>
        <li>Implement circuit breakers with Resilience4j</li>
        <li>Set up distributed tracing with Zipkin or Jaeger</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Write comprehensive unit tests with JUnit and Mockito",
    "Implement integration tests using TestContainers",
    "Configure applications for production deployment",
    "Create Docker containers for Spring Boot applications",
    "Deploy to Kubernetes with proper health checks and monitoring",
  ],
  practiceInstructions: [
    "Add testing dependencies to your project",
    "Write unit tests for your service classes using Mockito",
    "Create integration tests with TestContainers",
    "Configure production properties with environment variables",
    "Build Docker image and test with docker-compose",
  ],
  hints: [
    "Use @MockBean for Spring context testing",
    "TestContainers provides real database for integration tests",
    "Environment variables keep sensitive data secure",
    "Health checks are crucial for container orchestration",
  ],
  solution: `// Complete test example
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void shouldCreateUser_WhenValidDataProvided() {
        // Given
        User user = new User("john", "john@example.com", "password");
        when(userRepository.save(any(User.class))).thenReturn(user);
        
        // When
        User result = userService.createUser(user);
        
        // Then
        assertThat(result.getUsername()).isEqualTo("john");
        verify(userRepository).save(user);
    }
}`,
};
