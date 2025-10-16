import React from "react";
import { Database } from "lucide-react";

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

export const DatabaseSection = {
  id: "data",
  title: "Spring Data JPA",
  icon: Database,
  overview:
    "Integrate with databases using Spring Data JPA. Learn about entities, repositories, queries, and database relationships.",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">JPA Entities & Relationships</h3>
        <CodeExplanation
          code={`// Add to pom.xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>

// application.properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2database.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.h2.console.enabled=true

package com.example.demo.entity;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

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

@Entity
@Table(name = "posts")
public class Post {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Lob // Large object for long text
    @Column(nullable = false)
    private String content;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Many-to-One relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
    
    // Many-to-Many relationship
    @ManyToMany
    @JoinTable(
        name = "post_tags",
        joinColumns = @JoinColumn(name = "post_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors, getters, setters...
}

@Entity
@Table(name = "tags")
public class Tag {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 50)
    private String name;
    
    @ManyToMany(mappedBy = "tags")
    private List<Post> posts = new ArrayList<>();
    
    // Constructors, getters, setters...
}`}
          explanation={[
            {
              label: "@Entity",
              desc: "Marks class as JPA entity that maps to database table",
            },
            {
              label: "@GeneratedValue(strategy = GenerationType.IDENTITY)",
              desc: "Auto-increment primary key using database identity column",
            },
            {
              label: "@Column(unique = true, nullable = false)",
              desc: "Column constraints for database schema",
            },
            {
              label: "@OneToMany(mappedBy = 'author')",
              desc: "One user has many posts. 'mappedBy' indicates owning side",
            },
            {
              label: "@PrePersist, @PreUpdate",
              desc: "Lifecycle callbacks executed before database operations",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">Spring Data Repositories</h3>
        <CodeExplanation
          code={`package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    
    // Query methods (Spring Data generates implementation)
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    List<User> findByAgeGreaterThan(Integer age);
    
    List<User> findByUsernameContainingIgnoreCase(String username);
    
    Page<User> findByAgeGreaterThanEqual(Integer minAge, Pageable pageable);
    
    List<User> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    long countByAgeGreaterThan(Integer age);
    
    void deleteByUsername(String username);
    
    // Custom JPQL queries
    @Query("SELECT u FROM User u WHERE u.age BETWEEN :minAge AND :maxAge")
    List<User> findUsersByAgeRange(@Param("minAge") Integer minAge, @Param("maxAge") Integer maxAge);
    
    @Query("SELECT u FROM User u JOIN u.posts p WHERE p.title LIKE %:keyword%")
    List<User> findUsersWithPostsContaining(@Param("keyword") String keyword);
    
    // Native SQL queries
    @Query(value = "SELECT * FROM users WHERE created_at > :date", nativeQuery = true)
    List<User> findUsersCreatedAfter(@Param("date") LocalDateTime date);
    
    // Modifying queries
    @Modifying
    @Query("UPDATE User u SET u.age = :age WHERE u.id = :id")
    int updateUserAge(@Param("id") Long id, @Param("age") Integer age);
}

public interface PostRepository extends JpaRepository<Post, Long> {
    
    List<Post> findByAuthorId(Long authorId);
    
    Page<Post> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    @Query("SELECT p FROM Post p JOIN p.tags t WHERE t.name = :tagName")
    List<Post> findByTagName(@Param("tagName") String tagName);
    
    @Query("SELECT p FROM Post p WHERE p.author.username = :username ORDER BY p.createdAt DESC")
    List<Post> findRecentPostsByUsername(@Param("username") String username);
}

// Service layer
@Service
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    
    public UserService(UserRepository userRepository, PostRepository postRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }
    
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public User createUser(User user) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new DuplicateUserException(user.getUsername());
        }
        
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new DuplicateUserException("Email already exists: " + user.getEmail());
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
    
    @Transactional(readOnly = true)
    public List<Post> getUserPosts(Long userId) {
        return postRepository.findByAuthorId(userId);
    }
}`}
          explanation={[
            {
              label: "JpaRepository<User, Long>",
              desc: "Provides CRUD operations and query methods for User entity",
            },
            {
              label: "findByUsername(String username)",
              desc: "Spring Data generates query from method name",
            },
            {
              label: "@Query with JPQL",
              desc: "Custom queries using Java Persistence Query Language",
            },
            {
              label: "@Transactional",
              desc: "Ensures database consistency across multiple operations",
            },
            {
              label: "Pageable parameter",
              desc: "Built-in pagination and sorting support",
            },
          ]}
        />
      </div>
    </div>
  ),
};
