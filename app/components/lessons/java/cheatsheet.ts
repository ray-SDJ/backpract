import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Java Cheat Sheet - Complete Reference",
  description:
    "Comprehensive cheat sheet covering Java String methods, Collections (List, Map, Set), Stream API, and Spring Boot backend methods.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <p>A complete reference guide for Java covering essential language methods and Spring Boot backend operations.</p>

    <h2>📝 String Methods</h2>
    
    <div class="code-block">
      <pre><code>String text = "Hello World";

// Case Conversion
text.toUpperCase()              // "HELLO WORLD"
text.toLowerCase()              // "hello world"

// Search & Check
text.length()                   // 11
text.charAt(0)                  // 'H'
text.indexOf("World")           // 6
text.lastIndexOf("o")          // 7
text.contains("World")          // true
text.startsWith("Hello")        // true
text.endsWith("World")          // true
text.isEmpty()                  // false
text.isBlank()                  // false (Java 11+)

// Substring & Replace
text.substring(0, 5)            // "Hello"
text.substring(6)               // "World"
text.replace("World", "Java")   // "Hello Java"
text.replaceAll("\\\\s", "_")    // "Hello_World"
text.replaceFirst("l", "L")     // "HeLlo World"

// Splitting & Joining
text.split(" ")                 // ["Hello", "World"]
String.join("-", "a", "b", "c") // "a-b-c"
String.join(", ", Arrays.asList("a", "b"))

// Trimming
"  hello  ".trim()              // "hello"
"  hello  ".strip()             // "hello" (Java 11+)
"  hello  ".stripLeading()      // "hello  "
"  hello  ".stripTrailing()     // "  hello"

// Formatting
String.format("Name: %s, Age: %d", "Alice", 30)
"Hello %s".formatted("World")   // Java 15+

// Comparison
text.equals("Hello World")      // true
text.equalsIgnoreCase("hello world")  // true
text.compareTo("Hello World")   // 0 (equal)

// Other
text.repeat(3)                  // "Hello WorldHello WorldHello World" (Java 11+)
text.lines()                    // Stream of lines (Java 11+)
text.toCharArray()              // ['H', 'e', 'l', 'l', 'o', ...]</code></pre>
    </div>

    <h2>📋 ArrayList Methods</h2>
    
    <div class="code-block">
      <pre><code>import java.util.*;

List<Integer> nums = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));

// Adding Elements
nums.add(6);                    // [1, 2, 3, 4, 5, 6]
nums.add(0, 0);                 // [0, 1, 2, 3, 4, 5, 6]
nums.addAll(Arrays.asList(7, 8)); // Add multiple

// Accessing Elements
nums.get(0)                     // 0
nums.set(0, 10)                 // Replace at index
nums.indexOf(3)                 // Find first index
nums.lastIndexOf(3)             // Find last index

// Removing Elements
nums.remove(0)                  // Remove by index
nums.remove(Integer.valueOf(3)) // Remove by value
nums.removeIf(n -> n > 5)       // Remove matching elements
nums.clear()                    // Remove all

// Checking
nums.contains(3)                // true
nums.isEmpty()                  // false
nums.size()                     // Length

// Sorting & Reversing
Collections.sort(nums);                      // Sort ascending
Collections.sort(nums, Collections.reverseOrder()); // Descending
nums.sort(Comparator.naturalOrder());
nums.sort(Comparator.reverseOrder());
Collections.reverse(nums);

// Conversion
Integer[] array = nums.toArray(new Integer[0]);
List<Integer> copy = new ArrayList<>(nums);

// Sublist
List<Integer> sublist = nums.subList(1, 3);  // From index 1 to 2

// Iteration
for (Integer num : nums) { }
nums.forEach(num -> System.out.println(num));
nums.forEach(System.out::println);

// Stream Operations
nums.stream()
    .filter(n -> n > 2)
    .map(n -> n * 2)
    .collect(Collectors.toList());</code></pre>
    </div>

    <h2>🗺️ HashMap Methods</h2>
    
    <div class="code-block">
      <pre><code>Map<String, Integer> map = new HashMap<>();

// Adding/Updating
map.put("Alice", 30);
map.put("Bob", 25);
map.putIfAbsent("Alice", 35);   // Only if key doesn't exist
map.putAll(otherMap);

// Accessing
map.get("Alice")                // 30
map.getOrDefault("Charlie", 0)  // 0 (default value)

// Removing
map.remove("Alice")             // Returns 30
map.remove("Bob", 25)           // Remove if value matches
map.clear()

// Checking
map.containsKey("Alice")        // true
map.containsValue(30)           // true
map.isEmpty()
map.size()

// Views
map.keySet()                    // Set of keys
map.values()                    // Collection of values
map.entrySet()                  // Set of key-value pairs

// Iteration
for (String key : map.keySet()) {
    Integer value = map.get(key);
}

for (Map.Entry<String, Integer> entry : map.entrySet()) {
    String key = entry.getKey();
    Integer value = entry.getValue();
}

map.forEach((key, value) -> {
    System.out.println(key + ": " + value);
});

// Compute Methods
map.compute("Alice", (k, v) -> v == null ? 1 : v + 1);
map.computeIfAbsent("Charlie", k -> 0);
map.computeIfPresent("Alice", (k, v) -> v + 1);

// Merge
map.merge("Alice", 5, Integer::sum);  // Add 5 to existing value</code></pre>
    </div>

    <h2>🎯 HashSet Methods</h2>
    
    <div class="code-block">
      <pre><code>Set<Integer> set = new HashSet<>(Arrays.asList(1, 2, 3, 4, 5));

// Adding/Removing
set.add(6);                     // Returns true if added
set.addAll(Arrays.asList(7, 8));
set.remove(1);                  // Returns true if removed
set.removeIf(n -> n > 5);
set.clear();

// Checking
set.contains(3)                 // true
set.isEmpty()
set.size()

// Set Operations
Set<Integer> a = new HashSet<>(Arrays.asList(1, 2, 3));
Set<Integer> b = new HashSet<>(Arrays.asList(3, 4, 5));

Set<Integer> union = new HashSet<>(a);
union.addAll(b);                // {1, 2, 3, 4, 5}

Set<Integer> intersection = new HashSet<>(a);
intersection.retainAll(b);      // {3}

Set<Integer> difference = new HashSet<>(a);
difference.removeAll(b);        // {1, 2}

// Conversion
Integer[] array = set.toArray(new Integer[0]);
List<Integer> list = new ArrayList<>(set);

// Iteration
for (Integer num : set) { }
set.forEach(System.out::println);</code></pre>
    </div>

    <h2>🌊 Stream API</h2>
    
    <div class="code-block">
      <pre><code>List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// Filtering
numbers.stream()
    .filter(n -> n > 5)
    .collect(Collectors.toList());  // [6, 7, 8, 9, 10]

// Mapping
numbers.stream()
    .map(n -> n * 2)
    .collect(Collectors.toList());  // [2, 4, 6, 8, 10, ...]

// FlatMap
List<List<Integer>> nested = Arrays.asList(
    Arrays.asList(1, 2),
    Arrays.asList(3, 4)
);
nested.stream()
    .flatMap(List::stream)
    .collect(Collectors.toList());  // [1, 2, 3, 4]

// Distinct & Sorted
numbers.stream()
    .distinct()
    .sorted()
    .collect(Collectors.toList());

numbers.stream()
    .sorted(Comparator.reverseOrder());

// Limit & Skip
numbers.stream()
    .skip(5)
    .limit(3)
    .collect(Collectors.toList());  // [6, 7, 8]

// Reduction
numbers.stream()
    .reduce(0, Integer::sum);       // Sum all numbers

numbers.stream()
    .reduce(Integer::max);          // Optional<Integer>

// Collectors
numbers.stream()
    .collect(Collectors.toSet());
numbers.stream()
    .collect(Collectors.joining(", "));
numbers.stream()
    .collect(Collectors.groupingBy(n -> n % 2));  // Group by even/odd
numbers.stream()
    .collect(Collectors.partitioningBy(n -> n > 5));

// Terminal Operations
numbers.stream().forEach(System.out::println);
numbers.stream().count();
numbers.stream().anyMatch(n -> n > 5);
numbers.stream().allMatch(n -> n > 0);
numbers.stream().noneMatch(n -> n < 0);
numbers.stream().findFirst();
numbers.stream().findAny();
numbers.stream().min(Comparator.naturalOrder());
numbers.stream().max(Comparator.naturalOrder());</code></pre>
    </div>

    <h2>🌐 Spring Boot - RestController</h2>
    
    <div class="code-block">
      <pre><code>import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    // GET - Retrieve all
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(users);
    }

    // GET - Retrieve by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(user);
    }

    // POST - Create
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(createdUser);
    }

    // PUT - Update
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
        @PathVariable Long id,
        @RequestBody User user
    ) {
        return ResponseEntity.ok(updatedUser);
    }

    // DELETE - Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        return ResponseEntity.noContent().build();
    }

    // PATCH - Partial update
    @PatchMapping("/{id}")
    public ResponseEntity<User> patchUser(
        @PathVariable Long id,
        @RequestBody Map<String, Object> updates
    ) {
        return ResponseEntity.ok(updatedUser);
    }

    // Custom endpoint with multiple params
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(
        @RequestParam String query,
        @RequestParam(required = false) Integer minAge,
        @RequestParam(required = false) Integer maxAge
    ) {
        return ResponseEntity.ok(results);
    }

    // Request Headers
    @PostMapping("/upload")
    public ResponseEntity<String> upload(
        @RequestHeader("Authorization") String token,
        @RequestBody MultipartFile file
    ) {
        return ResponseEntity.ok("Uploaded");
    }
}</code></pre>
    </div>

    <h2>🗄️ Spring Data JPA Repository</h2>
    
    <div class="code-block">
      <pre><code>import org.springframework.data.jpa.repository.*;
import org.springframework.data.domain.*;

public interface UserRepository extends JpaRepository<User, Long> {
    
    // Query Methods (auto-generated)
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByAgeGreaterThan(Integer age);
    List<User> findByAgeBetween(Integer minAge, Integer maxAge);
    List<User> findByUsernameContainingIgnoreCase(String username);
    List<User> findByCreatedAtAfter(LocalDateTime date);
    Page<User> findByAgeGreaterThanEqual(Integer age, Pageable pageable);
    
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    long countByAgeGreaterThan(Integer age);
    
    void deleteByUsername(String username);
    
    // Custom JPQL Queries
    @Query("SELECT u FROM User u WHERE u.age BETWEEN :minAge AND :maxAge")
    List<User> findByAgeRange(
        @Param("minAge") Integer minAge,
        @Param("maxAge") Integer maxAge
    );
    
    @Query("SELECT u FROM User u WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<User> searchByUsername(@Param("search") String search);
    
    // Native SQL Queries
    @Query(value = "SELECT * FROM users WHERE created_at > :date", nativeQuery = true)
    List<User> findUsersCreatedAfter(@Param("date") LocalDateTime date);
    
    // Modifying Queries
    @Modifying
    @Query("UPDATE User u SET u.age = :age WHERE u.id = :id")
    int updateAge(@Param("id") Long id, @Param("age") Integer age);
    
    @Modifying
    @Query("DELETE FROM User u WHERE u.lastLogin < :date")
    int deleteInactiveUsers(@Param("date") LocalDateTime date);
    
    // Projection
    @Query("SELECT u.username, u.email FROM User u WHERE u.id = :id")
    UserProjection findProjectionById(@Param("id") Long id);
    
    // Sorting and Pagination
    List<User> findAll(Sort sort);
    Page<User> findAll(Pageable pageable);
}</code></pre>
    </div>

    <h2>🔐 Spring Security</h2>
    
    <div class="code-block">
      <pre><code>import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

// Password Encoding
@Autowired
private PasswordEncoder passwordEncoder;

String hashedPassword = passwordEncoder.encode("password123");
boolean matches = passwordEncoder.matches("password123", hashedPassword);

// Get Current User
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
String username = auth.getName();
UserDetails userDetails = (UserDetails) auth.getPrincipal();

// Method Security
@PreAuthorize("hasRole('ADMIN')")
public void adminOnly() { }

@PreAuthorize("hasAnyRole('ADMIN', 'USER')")
public void authenticatedUsers() { }

@PreAuthorize("#username == authentication.principal.username")
public void ownerOnly(String username) { }

// JWT (with jjwt library)
import io.jsonwebtoken.*;

String token = Jwts.builder()
    .setSubject(username)
    .setIssuedAt(new Date())
    .setExpiration(new Date(System.currentTimeMillis() + 86400000))
    .signWith(SignatureAlgorithm.HS512, secretKey)
    .compact();

Claims claims = Jwts.parser()
    .setSigningKey(secretKey)
    .parseClaimsJws(token)
    .getBody();</code></pre>
    </div>

    <h2>📅 Date & Time (Java 8+)</h2>
    
    <div class="code-block">
      <pre><code>import java.time.*;
import java.time.format.DateTimeFormatter;

// Current date/time
LocalDate today = LocalDate.now();
LocalTime now = LocalTime.now();
LocalDateTime dateTime = LocalDateTime.now();
ZonedDateTime zonedDateTime = ZonedDateTime.now();

// Creating dates
LocalDate date = LocalDate.of(2024, 12, 25);
LocalDate date = LocalDate.of(2024, Month.DECEMBER, 25);
LocalTime time = LocalTime.of(10, 30, 0);
LocalDateTime dt = LocalDateTime.of(2024, 12, 25, 10, 30);

// Parsing
LocalDate date = LocalDate.parse("2024-12-25");
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
LocalDate date = LocalDate.parse("25/12/2024", formatter);

// Formatting
String formatted = date.format(DateTimeFormatter.ISO_DATE);
String formatted = date.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));

// Arithmetic
LocalDate tomorrow = today.plusDays(1);
LocalDate nextWeek = today.plusWeeks(1);
LocalDate nextMonth = today.plusMonths(1);
LocalDate lastYear = today.minusYears(1);

// Comparison
boolean isBefore = date1.isBefore(date2);
boolean isAfter = date1.isAfter(date2);
boolean isEqual = date1.isEqual(date2);

// Components
int year = date.getYear();
Month month = date.getMonth();
int day = date.getDayOfMonth();
DayOfWeek dayOfWeek = date.getDayOfWeek();

// Duration & Period
Duration duration = Duration.between(time1, time2);
Period period = Period.between(date1, date2);
long days = ChronoUnit.DAYS.between(date1, date2);</code></pre>
    </div>

    <h2>💡 Best Practices</h2>
    
    <div class="explanation-list">
      <ul>
        <li><strong>Use StringBuilder:</strong> For multiple string concatenations</li>
        <li><strong>Prefer ArrayList:</strong> Over LinkedList in most cases</li>
        <li><strong>Use Stream API:</strong> For functional-style operations</li>
        <li><strong>Exception handling:</strong> Use specific exceptions, avoid catching Exception</li>
        <li><strong>Use Optional:</strong> To avoid null pointer exceptions</li>
        <li><strong>Method references:</strong> Use :: for cleaner code</li>
        <li><strong>Immutability:</strong> Use final for variables that shouldn't change</li>
        <li><strong>Dependency Injection:</strong> Use @Autowired in Spring</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Master Java String manipulation methods",
    "Understand Collections framework (List, Map, Set)",
    "Learn Stream API for functional programming",
    "Use Spring Boot annotations and methods",
    "Work with Spring Data JPA repositories",
  ],
  practiceInstructions: [
    "Practice String methods on various text inputs",
    "Manipulate Lists using ArrayList methods",
    "Create and query Maps with HashMap",
    "Implement Stream API operations",
    "Build Spring Boot REST endpoints",
  ],
  hints: [
    "Strings are immutable in Java - methods return new strings",
    "Use generics with Collections for type safety",
    "Stream operations are lazy - need terminal operation to execute",
    "@RestController combines @Controller and @ResponseBody",
    "Spring Data JPA generates query implementations from method names",
  ],
  solution: `// String manipulation
String text = "hello world";
System.out.println(text.toUpperCase());  // "HELLO WORLD"
String[] words = text.split(" ");

// List operations
List<Integer> nums = new ArrayList<>(Arrays.asList(1, 2, 3));
nums.add(4);
List<Integer> doubled = nums.stream()
    .map(n -> n * 2)
    .collect(Collectors.toList());

// Map operations
Map<String, Integer> map = new HashMap<>();
map.put("Alice", 30);
map.putIfAbsent("Bob", 25);

// Spring Boot endpoint
@PostMapping
public ResponseEntity<User> create(@RequestBody User user) {
    User created = userService.save(user);
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
}

// JPA Repository
List<User> users = userRepository
    .findByAgeGreaterThan(18);`,
};
