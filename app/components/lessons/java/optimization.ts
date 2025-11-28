import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Java & Spring Boot Performance Optimization",
  description:
    "Master Java and Spring Boot optimization techniques including caching, JPA optimization, JVM tuning, and concurrency best practices.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <h1 class="text-3xl font-bold mb-6">Java & Spring Boot Performance Optimization</h1>
    
    <p class="mb-4">Learn advanced optimization techniques for building high-performance Java and Spring Boot applications.</p>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🚀 Caching Strategies</h2>
    
    <h3 class="text-xl font-semibold mt-6 mb-3">Spring Cache with Redis</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// Add dependencies to pom.xml
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-cache&lt;/artifactId&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-data-redis&lt;/artifactId&gt;
&lt;/dependency&gt;

// Configuration
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;

@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(5))
            .disableCachingNullValues();
        
        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(config)
            .build();
    }
}

// Service with caching
import org.springframework.cache.annotation.*;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    // Cache method result
    @Cacheable(value = "users", key = "#id")
    public User getUserById(Long id) {
        System.out.println("Fetching user from database: " + id);
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    // Cache with conditional
    @Cacheable(value = "users", key = "#email", unless = "#result == null")
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    
    // Update cache after method execution
    @CachePut(value = "users", key = "#user.id")
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    // Remove from cache
    @CacheEvict(value = "users", key = "#id")
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    // Clear entire cache
    @CacheEvict(value = "users", allEntries = true)
    public void clearUserCache() {
        System.out.println("User cache cleared");
    }
    
    // Multiple cache operations
    @Caching(
        cacheable = {
            @Cacheable(value = "users", key = "#id")
        },
        evict = {
            @CacheEvict(value = "userStats", key = "#id")
        }
    )
    public User refreshUser(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
      </code>
    </pre>

    <h3 class="text-xl font-semibold mt-6 mb-3">Caffeine In-Memory Cache</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// Add dependency
&lt;dependency&gt;
    &lt;groupId&gt;com.github.ben-manes.caffeine&lt;/groupId&gt;
    &lt;artifactId&gt;caffeine&lt;/artifactId&gt;
&lt;/dependency&gt;

import com.github.benmanes.caffeine.cache.*;
import java.util.concurrent.TimeUnit;

@Configuration
public class CaffeineConfig {
    
    @Bean
    public Cache<String, Object> cache() {
        return Caffeine.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .expireAfterAccess(3, TimeUnit.MINUTES)
            .recordStats()
            .build();
    }
    
    @Bean
    public LoadingCache<Long, User> userCache(UserRepository userRepository) {
        return Caffeine.newBuilder()
            .maximumSize(500)
            .expireAfterWrite(10, TimeUnit.MINUTES)
            .build(key -> userRepository.findById(key).orElse(null));
    }
}

// Usage
@Service
public class ProductService {
    
    @Autowired
    private Cache<String, Object> cache;
    
    public Product getProduct(Long id) {
        String key = "product:" + id;
        
        return (Product) cache.get(key, k -> {
            // This is called only if not in cache
            return productRepository.findById(id).orElse(null);
        });
    }
    
    public void invalidateProduct(Long id) {
        cache.invalidate("product:" + id);
    }
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🗄️ JPA & Hibernate Optimization</h2>
    
    <h3 class="text-xl font-semibold mt-6 mb-3">Query Optimization</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
import org.springframework.data.jpa.repository.*;
import javax.persistence.*;

public interface UserRepository extends JpaRepository<User, Long> {
    
    // BAD: Triggers N+1 query problem
    List<User> findAll();  // Then accessing user.getPosts() causes new queries
    
    // GOOD: Fetch join to load associations
    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.posts")
    List<User> findAllWithPosts();
    
    // Entity graphs for complex scenarios
    @EntityGraph(attributePaths = {"posts", "posts.comments", "roles"})
    List<User> findByIsActiveTrue();
    
    // Pagination
    Page<User> findByIsActive(boolean isActive, Pageable pageable);
    
    // Projection - load only needed columns
    @Query("SELECT new com.example.dto.UserDTO(u.id, u.username, u.email) FROM User u")
    List<UserDTO> findAllProjected();
    
    // Batch fetching
    @Query("SELECT u FROM User u WHERE u.id IN :ids")
    List<User> findByIdIn(@Param("ids") List<Long> ids);
}

// Entity optimization
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_username", columnList = "username"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 100)
    private String email;
    
    // Lazy loading by default (better performance)
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Post> posts = new ArrayList<>();
    
    // Use @BatchSize to reduce queries
    @OneToMany(mappedBy = "user")
    @BatchSize(size = 10)
    private List<Order> orders = new ArrayList<>();
}

// Service layer optimization
@Service
@Transactional(readOnly = true)
public class PostService {
    
    @Autowired
    private PostRepository postRepository;
    
    // Read-only transaction (optimization)
    public List<Post> getAllPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return postRepository.findAll(pageable).getContent();
    }
    
    // Write transaction
    @Transactional
    public Post createPost(Post post) {
        return postRepository.save(post);
    }
    
    // Bulk operations
    @Transactional
    public void bulkUpdateStatus(List<Long> postIds, String status) {
        postRepository.bulkUpdateStatus(postIds, status);
    }
}

// Custom repository with QueryDSL
public interface CustomPostRepository {
    List<Post> findWithDynamicFilters(PostFilterDTO filters);
}

@Repository
public class CustomPostRepositoryImpl implements CustomPostRepository {
    
    @PersistenceContext
    private EntityManager em;
    
    @Override
    public List<Post> findWithDynamicFilters(PostFilterDTO filters) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Post> query = cb.createQuery(Post.class);
        Root<Post> root = query.from(Post.class);
        
        List<Predicate> predicates = new ArrayList<>();
        
        if (filters.getTitle() != null) {
            predicates.add(cb.like(root.get("title"), "%" + filters.getTitle() + "%"));
        }
        
        if (filters.getAuthorId() != null) {
            predicates.add(cb.equal(root.get("author").get("id"), filters.getAuthorId()));
        }
        
        query.where(predicates.toArray(new Predicate[0]));
        
        return em.createQuery(query)
            .setMaxResults(100)
            .getResultList();
    }
}
      </code>
    </pre>

    <h3 class="text-xl font-semibold mt-6 mb-3">Second-Level Cache</h3>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// application.properties
spring.jpa.properties.hibernate.cache.use_second_level_cache=true
spring.jpa.properties.hibernate.cache.region.factory_class=org.hibernate.cache.jcache.JCacheRegionFactory
spring.jpa.properties.hibernate.cache.use_query_cache=true

// Enable caching on entities
@Entity
@Cacheable
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private BigDecimal price;
    
    // Cached collection
    @OneToMany(mappedBy = "product")
    @org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private List<Review> reviews = new ArrayList<>();
}

// Query cache
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    @QueryHints(@QueryHint(name = "org.hibernate.cacheable", value = "true"))
    List<Product> findByCategory(String category);
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">⚡ Async & Concurrency</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
import org.springframework.scheduling.annotation.*;
import java.util.concurrent.*;

// Enable async
@Configuration
@EnableAsync
public class AsyncConfig {
    
    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }
}

// Async service
@Service
public class NotificationService {
    
    @Async
    public CompletableFuture<String> sendEmail(String to, String subject, String body) {
        // Simulate email sending
        try {
            Thread.sleep(1000);
            System.out.println("Email sent to: " + to);
            return CompletableFuture.completedFuture("Email sent");
        } catch (InterruptedException e) {
            return CompletableFuture.failedFuture(e);
        }
    }
    
    @Async
    public void processInBackground(Long orderId) {
        // Long-running background task
        System.out.println("Processing order: " + orderId);
    }
}

// Parallel execution
@RestController
@RequestMapping("/api")
public class DashboardController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PostService postService;
    
    @Autowired
    private StatsService statsService;
    
    @GetMapping("/dashboard")
    public DashboardDTO getDashboard() {
        // BAD: Sequential execution
        // List<User> users = userService.getRecentUsers();
        // List<Post> posts = postService.getRecentPosts();
        // Stats stats = statsService.getStats();
        
        // GOOD: Parallel execution
        CompletableFuture<List<User>> usersFuture = 
            CompletableFuture.supplyAsync(() -> userService.getRecentUsers());
        
        CompletableFuture<List<Post>> postsFuture = 
            CompletableFuture.supplyAsync(() -> postService.getRecentPosts());
        
        CompletableFuture<Stats> statsFuture = 
            CompletableFuture.supplyAsync(() -> statsService.getStats());
        
        // Wait for all to complete
        CompletableFuture.allOf(usersFuture, postsFuture, statsFuture).join();
        
        return new DashboardDTO(
            usersFuture.join(),
            postsFuture.join(),
            statsFuture.join()
        );
    }
}

// Virtual threads (Java 21+)
@Configuration
public class VirtualThreadConfig {
    
    @Bean
    public Executor virtualThreadExecutor() {
        return Executors.newVirtualThreadPerTaskExecutor();
    }
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🔧 Spring Boot Optimization</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// application.properties optimization
# Server
server.compression.enabled=true
server.compression.mime-types=application/json,application/xml,text/html,text/xml,text/plain

# Connection pool (HikariCP - default in Spring Boot)
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000

# JPA
spring.jpa.open-in-view=false
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true
spring.jpa.properties.hibernate.jdbc.batch_versioned_data=true

# Jackson
spring.jackson.default-property-inclusion=non_null

// Response compression
import org.springframework.http.converter.json.*;

@Configuration
public class JacksonConfig {
    
    @Bean
    public MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        mapper.registerModule(new JavaTimeModule());
        
        MappingJackson2HttpMessageConverter converter = 
            new MappingJackson2HttpMessageConverter(mapper);
        
        return converter;
    }
}

// Rate limiting
import io.github.bucket4j.*;

@Service
public class RateLimitService {
    
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();
    
    public Bucket resolveBucket(String key) {
        return cache.computeIfAbsent(key, k -> createNewBucket());
    }
    
    private Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1)));
        return Bucket.builder()
            .addLimit(limit)
            .build();
    }
}

@Component
public class RateLimitInterceptor implements HandlerInterceptor {
    
    @Autowired
    private RateLimitService rateLimitService;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, 
                            Object handler) throws Exception {
        String key = request.getRemoteAddr();
        Bucket bucket = rateLimitService.resolveBucket(key);
        
        if (bucket.tryConsume(1)) {
            return true;
        }
        
        response.setStatus(429);
        response.getWriter().write("Too many requests");
        return false;
    }
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">📊 JVM Tuning</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
# Recommended JVM flags for production

# Heap size (adjust based on available memory)
-Xms2g
-Xmx2g

# Garbage collection (G1GC - good for most cases)
-XX:+UseG1GC
-XX:MaxGCPauseMillis=200
-XX:G1HeapRegionSize=16m

# Or ZGC for low latency (Java 15+)
-XX:+UseZGC
-XX:+ZGenerational

# GC logging
-Xlog:gc*:file=gc.log:time,uptime,level,tags

# Performance monitoring
-XX:+FlightRecorder
-XX:StartFlightRecording=duration=60s,filename=recording.jfr

# String deduplication (saves memory)
-XX:+UseStringDeduplication

# Large pages (if OS supports)
-XX:+UseLargePages

// Monitor GC with JFR
import jdk.jfr.*;

@Configuration
public class JfrConfig {
    
    @Bean
    public CommandLineRunner jfrMonitor() {
        return args -> {
            Recording recording = new Recording();
            recording.enable("jdk.GarbageCollection");
            recording.enable("jdk.ObjectAllocationSample");
            recording.start();
            
            // Stop after some time or on shutdown
            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                recording.stop();
                try {
                    recording.dump(Paths.get("recording.jfr"));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }));
        };
    }
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🌐 API Optimization</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
// Pagination
@GetMapping("/posts")
public Page<PostDTO> getPosts(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @RequestParam(defaultValue = "createdAt,desc") String[] sort
) {
    Pageable pageable = PageRequest.of(page, size, Sort.by(parseSort(sort)));
    return postService.findAll(pageable);
}

// ETags for conditional requests
@GetMapping("/users/{id}")
public ResponseEntity<UserDTO> getUser(@PathVariable Long id, 
                                       @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch) {
    User user = userService.findById(id);
    String etag = generateETag(user);
    
    if (etag.equals(ifNoneMatch)) {
        return ResponseEntity.status(HttpStatus.NOT_MODIFIED).build();
    }
    
    return ResponseEntity.ok()
        .eTag(etag)
        .cacheControl(CacheControl.maxAge(5, TimeUnit.MINUTES))
        .body(userMapper.toDTO(user));
}

// Batch endpoints
@PostMapping("/users/batch")
public List<UserDTO> getUsersBatch(@RequestBody List<Long> userIds) {
    return userService.findByIdIn(userIds);
}

// GraphQL for flexible queries
@QueryMapping
public List<Post> posts(@Argument int limit, @Argument String sort) {
    return postService.findAll(PageRequest.of(0, limit, Sort.by(sort)));
}
      </code>
    </pre>

    <h2 class="text-2xl font-semibold mt-8 mb-4">💡 Best Practices</h2>
    
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-yellow-900 mb-3">✅ Java Optimization Checklist</h4>
      <ul class="text-yellow-800 space-y-2">
        <li>• <strong>Use caching:</strong> Redis for distributed cache, Caffeine for in-memory</li>
        <li>• <strong>Optimize JPA:</strong> Eager loading, batch fetching, read-only transactions</li>
        <li>• <strong>Connection pooling:</strong> Configure HikariCP for your workload</li>
        <li>• <strong>Async processing:</strong> Use @Async for long-running tasks</li>
        <li>• <strong>Parallel execution:</strong> CompletableFuture for independent operations</li>
        <li>• <strong>Pagination:</strong> Always paginate large result sets</li>
        <li>• <strong>JVM tuning:</strong> Configure heap size and GC appropriately</li>
        <li>• <strong>Rate limiting:</strong> Protect endpoints from abuse</li>
        <li>• <strong>Compression:</strong> Enable response compression</li>
        <li>• <strong>Monitor production:</strong> Use JFR, APM tools for insights</li>
      </ul>
    </div>

    <h2 class="text-2xl font-semibold mt-8 mb-4">🚀 Production Configuration</h2>
    
    <pre class="code-block bg-gray-900 text-white p-4 rounded-lg mb-6">
      <code>
# application-prod.properties
server.port=8080
server.compression.enabled=true

spring.datasource.hikari.maximum-pool-size=20
spring.jpa.open-in-view=false
spring.jpa.properties.hibernate.cache.use_second_level_cache=true

logging.level.root=INFO
logging.level.com.example=WARN

# Run with:
java -Xms2g -Xmx2g -XX:+UseG1GC -jar app.jar --spring.profiles.active=prod
      </code>
    </pre>
  </div>`,
  objectives: [
    "Implement Spring Cache with Redis for distributed caching",
    "Optimize JPA queries with fetch joins and batch fetching",
    "Use async processing with @Async and CompletableFuture",
    "Configure HikariCP connection pooling",
    "Implement rate limiting for API endpoints",
    "Tune JVM settings for production workloads",
  ],
  practiceInstructions: [
    "Add @Cacheable annotations to service methods",
    "Replace findAll() with fetch joins to avoid N+1 queries",
    "Configure second-level cache for frequently accessed entities",
    "Use CompletableFuture for parallel operations",
    "Set up HikariCP with appropriate pool sizes",
    "Configure JVM with G1GC or ZGC",
  ],
  hints: [
    "Use @Cacheable for reads, @CachePut for updates, @CacheEvict for deletes",
    "Entity graphs and fetch joins prevent N+1 query problems",
    "@Transactional(readOnly = true) optimizes read-only queries",
    "CompletableFuture.allOf() waits for all parallel operations to complete",
    "HikariCP is the default connection pool and is already optimized",
    "G1GC is good for most workloads, ZGC for ultra-low latency",
  ],
  solution: `// Complete optimization example

@SpringBootApplication
@EnableCaching
@EnableAsync
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

@Service
@Transactional(readOnly = true)
public class PostService {
    
    @Autowired
    private PostRepository postRepository;
    
    // Cached query with fetch join
    @Cacheable(value = "posts", key = "#page + '-' + #size")
    public Page<Post> getPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findAllWithAuthor(pageable);
    }
    
    // Update cache
    @Transactional
    @CachePut(value = "post", key = "#result.id")
    public Post updatePost(Post post) {
        return postRepository.save(post);
    }
}

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    
    @Query("SELECT DISTINCT p FROM Post p LEFT JOIN FETCH p.author")
    @QueryHints(@QueryHint(name = "org.hibernate.cacheable", value = "true"))
    Page<Post> findAllWithAuthor(Pageable pageable);
}

@RestController
public class DashboardController {
    
    @GetMapping("/dashboard")
    public DashboardDTO getDashboard() {
        CompletableFuture<List<User>> users = 
            CompletableFuture.supplyAsync(() -> userService.getRecent());
        CompletableFuture<List<Post>> posts = 
            CompletableFuture.supplyAsync(() -> postService.getRecent());
        
        CompletableFuture.allOf(users, posts).join();
        
        return new DashboardDTO(users.join(), posts.join());
    }
}`,
};
