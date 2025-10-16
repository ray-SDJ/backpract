import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Spring Data JPA",
  description:
    "Integrate with databases using Spring Data JPA. Learn about entities, repositories, queries, and database relationships.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>Spring Data JPA simplifies database operations by providing a powerful abstraction layer over JPA. Learn to work with entities, repositories, and complex queries.</p>

    <h2>Setting up JPA</h2>
    
    <p>Add the necessary dependencies to your pom.xml:</p>

    <pre class="code-block">
      <code>
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-data-jpa&lt;/artifactId&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
    &lt;groupId&gt;com.h2database&lt;/groupId&gt;
    &lt;artifactId&gt;h2&lt;/artifactId&gt;
    &lt;scope&gt;runtime&lt;/scope&gt;
&lt;/dependency&gt;
      </code>
    </pre>

    <h2>Database Configuration</h2>
    
    <p>Configure your database in application.properties:</p>

    <pre class="code-block">
      <code>
# H2 Database (for development)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2database.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.h2.console.enabled=true
      </code>
    </pre>

    <h2>Creating JPA Entities</h2>
    
    <pre class="code-block">
      <code>
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 50)
    private String username;
    
    @Column(unique = true, nullable = false, length = 100)
    private String email;
    
    @Column(nullable = false)
    private Integer age;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // One-to-Many relationship
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Post> posts = new ArrayList<>();
    
    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Constructors, getters, setters...
}
      </code>
    </pre>

    <h2>Spring Data Repositories</h2>
    
    <p>Create repository interfaces that extend JpaRepository:</p>

    <pre class="code-block">
      <code>
public interface UserRepository extends JpaRepository&lt;User, Long&gt; {
    
    // Query methods (Spring Data generates implementation automatically)
    Optional&lt;User&gt; findByUsername(String username);
    Optional&lt;User&gt; findByEmail(String email);
    List&lt;User&gt; findByAgeGreaterThan(Integer age);
    List&lt;User&gt; findByUsernameContainingIgnoreCase(String username);
    Page&lt;User&gt; findByAgeGreaterThanEqual(Integer minAge, Pageable pageable);
    
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    // Custom JPQL queries
    @Query("SELECT u FROM User u WHERE u.age BETWEEN :minAge AND :maxAge")
    List&lt;User&gt; findUsersByAgeRange(@Param("minAge") Integer minAge, @Param("maxAge") Integer maxAge);
    
    // Native SQL queries
    @Query(value = "SELECT * FROM users WHERE created_at > :date", nativeQuery = true)
    List&lt;User&gt; findUsersCreatedAfter(@Param("date") LocalDateTime date);
    
    // Modifying queries
    @Modifying
    @Query("UPDATE User u SET u.age = :age WHERE u.id = :id")
    int updateUserAge(@Param("id") Long id, @Param("age") Integer age);
}
      </code>
    </pre>

    <h2>Service Layer</h2>
    
    <p>Implement business logic in service classes:</p>

    <pre class="code-block">
      <code>
@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public Page&lt;User&gt; getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }
    
    public Optional&lt;User&gt; getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public User createUser(User user) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new DuplicateUserException(user.getUsername());
        }
        
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new DuplicateUserException("Email already exists");
        }
        
        return userRepository.save(user);
    }
    
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
        
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setAge(userDetails.getAge());
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException(id);
        }
        userRepository.deleteById(id);
    }
}
      </code>
    </pre>

    <h2>Key JPA Annotations</h2>
    
    <div class="explanation-list">
      <ul>
        <li><strong>@Entity:</strong> Marks class as JPA entity that maps to database table</li>
        <li><strong>@GeneratedValue:</strong> Auto-increment primary key using database identity column</li>
        <li><strong>@Column:</strong> Configure column constraints and properties</li>
        <li><strong>@OneToMany/@ManyToOne:</strong> Define entity relationships</li>
        <li><strong>@PrePersist/@PreUpdate:</strong> Lifecycle callbacks executed before database operations</li>
        <li><strong>@Transactional:</strong> Ensures database consistency across multiple operations</li>
      </ul>
    </div>

    <h2>Query Methods</h2>
    
    <p>Spring Data JPA generates queries based on method names:</p>
    
    <ul>
      <li><strong>findBy:</strong> Find entities by property</li>
      <li><strong>existsBy:</strong> Check if entity exists</li>
      <li><strong>countBy:</strong> Count entities matching criteria</li>
      <li><strong>deleteBy:</strong> Delete entities matching criteria</li>
    </ul>
  </div>`,
  objectives: [
    "Set up Spring Data JPA with database configuration",
    "Create JPA entities with proper annotations and relationships",
    "Build repository interfaces extending JpaRepository",
    "Write custom queries using @Query annotation",
    "Implement service layer with transaction management",
  ],
  practiceInstructions: [
    "Add JPA and H2 database dependencies to pom.xml",
    "Configure database properties in application.properties",
    "Create a User entity with @Entity annotation",
    "Build UserRepository extending JpaRepository",
    "Implement UserService with CRUD operations and transaction management",
  ],
  hints: [
    "Use @GeneratedValue for auto-increment primary keys",
    "JpaRepository provides basic CRUD methods out of the box",
    "Query method names follow specific conventions",
    "@Transactional ensures data consistency across operations",
  ],
  solution: `// Complete User entity with relationships
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private Integer age;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors, getters, setters...
}

// Repository with custom queries
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    List<User> findByAgeGreaterThan(Integer age);
    
    @Query("SELECT u FROM User u WHERE u.username LIKE %:name%")
    List<User> findByUsernameContaining(@Param("name") String name);
}`,
};
