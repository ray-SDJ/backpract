import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "GraphQL APIs with Java",
  description:
    "Master GraphQL with Java - build type-safe, flexible APIs using GraphQL Java and Spring Boot with queries, mutations, and advanced features.",
  difficulty: "Intermediate",
  objectives: [
    "Understand GraphQL fundamentals and how it differs from REST",
    "Set up GraphQL Java with Spring Boot",
    "Define GraphQL schemas with SDL (Schema Definition Language)",
    "Implement DataFetchers for queries and mutations",
    "Work with GraphQL DataLoader for N+1 problem",
    "Add authentication and authorization",
    "Implement subscriptions with WebSocket",
    "Handle errors and implement best practices",
  ],
  practiceInstructions: [
    "Add Spring Boot GraphQL starter dependency",
    "Create schema.graphqls file with User and Post types",
    "Define GraphQL schema with queries and mutations",
    "Implement QueryResolver and MutationResolver classes",
    "Create DataFetcher methods for each field",
    "Configure GraphQL endpoint and test at /graphiql",
    "Add DataLoader to optimize database queries",
  ],
  hints: [
    "Schema file goes in src/main/resources/graphql/schema.graphqls",
    "Use @QueryMapping and @MutationMapping annotations",
    "DataLoader batches multiple requests into one query",
    "GraphQL Java validates schema at startup",
    "Use @SchemaMapping to resolve relationships",
  ],
  content: `<div class="lesson-content">
    <p>GraphQL with Java provides enterprise-grade GraphQL APIs with strong typing and excellent tooling. Learn how to use GraphQL Java with Spring Boot to build scalable, maintainable GraphQL services.</p>

    <h2>Why GraphQL with Java?</h2>
    
    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🚀 Java + GraphQL Benefits</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Type Safety:</strong> Both GraphQL schema and Java types are strongly typed</li>
        <li><strong>Spring Integration:</strong> Works seamlessly with Spring Boot ecosystem</li>
        <li><strong>Scalability:</strong> Enterprise-grade performance and reliability</li>
        <li><strong>DataLoader:</strong> Built-in N+1 query problem solution</li>
        <li><strong>Tooling:</strong> Excellent IDE support and code generation</li>
      </ul>
    </div>

    <h2>Setting Up GraphQL Java</h2>
    
    <p>Configure Spring Boot project with GraphQL:</p>

    <pre class="code-block">
      <code>
<!-- pom.xml -->
<!-- Add Spring Boot GraphQL starter dependency -->
<dependencies>
    <!-- spring-boot-starter-graphql = GraphQL support for Spring Boot -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-graphql</artifactId>
    </dependency>
    
    <!-- spring-boot-starter-web = REST API support -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- spring-boot-starter-data-jpa = Database access -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- H2 database for development -->
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
</dependencies>

# application.properties
# Configure GraphQL endpoint
# spring.graphql.graphiql.enabled = Enable GraphiQL UI
spring.graphql.graphiql.enabled=true
# spring.graphql.path = GraphQL endpoint path
spring.graphql.path=/graphql

# Database configuration
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
      </code>
    </pre>

    <h2>Defining GraphQL Schema</h2>
    
    <p>Create GraphQL schema with SDL:</p>

    <pre class="code-block">
      <code>
# src/main/resources/graphql/schema.graphqls
# GraphQL Schema Definition Language (SDL)

# User type definition
# type = Custom object type
# ! = Required/non-nullable field
type User {
    id: ID!          # ID! = Required unique identifier
    name: String!    # String! = Required text field
    email: String!
    age: Int         # Int = Optional integer
    posts: [Post!]!  # [Post!]! = Required array of non-null Posts
}

# Post type with relationship to User
type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    authorId: ID!
    author: User!    # Relationship: every post has a User author
    createdAt: String!
}

# Comment type
type Comment {
    id: ID!
    text: String!
    postId: ID!
    authorId: ID!
    post: Post!
    author: User!
    createdAt: String!
}

# Query type defines all read operations
type Query {
    # Get all users
    users: [User!]!
    
    # Get single user by ID
    # (id: ID!) = Required parameter named 'id' of type ID
    user(id: ID!): User
    
    # Get all posts with optional filtering
    posts(published: Boolean, authorId: ID): [Post!]!
    
    # Get single post
    post(id: ID!): Post
    
    # Search posts by keyword
    searchPosts(keyword: String!): [Post!]!
}

# Mutation type defines all write operations
type Mutation {
    # Create new user
    createUser(name: String!, email: String!, age: Int): User!
    
    # Update existing user
    updateUser(id: ID!, name: String, email: String, age: Int): User!
    
    # Delete user
    deleteUser(id: ID!): Boolean!
    
    # Create new post
    createPost(title: String!, content: String!, authorId: ID!): Post!
    
    # Update existing post
    updatePost(id: ID!, title: String, content: String, published: Boolean): Post!
    
    # Delete post
    deletePost(id: ID!): Boolean!
    
    # Create comment
    createComment(text: String!, postId: ID!, authorId: ID!): Comment!
}

# Subscription type for real-time updates
type Subscription {
    # Subscribe to new posts
    postCreated: Post!
    
    # Subscribe to post updates
    postUpdated(id: ID!): Post!
}
      </code>
    </pre>

    <h2>Creating Entity Models</h2>
    
    <p>Define JPA entities for database:</p>

    <pre class="code-block">
      <code>
// User.java
package com.example.graphql.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

// @Entity = JPA entity (database table)
@Entity
// @Table = Specify table name
@Table(name = "users")
public class User {
    // @Id = Primary key
    @Id
    // @GeneratedValue = Auto-generate ID
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // @Column = Database column
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    private Integer age;
    
    // @OneToMany = One user has many posts
    // mappedBy = Field name in Post entity
    // cascade = Cascade operations to posts
    // orphanRemoval = Delete posts when removed from user
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts = new ArrayList<>();
    
    // Constructors
    public User() {}
    
    public User(String name, String email, Integer age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    
    public List<Post> getPosts() { return posts; }
    public void setPosts(List<Post> posts) { this.posts = posts; }
}

// Post.java
package com.example.graphql.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, length = 5000)
    private String content;
    
    @Column(nullable = false)
    private Boolean published = false;
    
    // @ManyToOne = Many posts belong to one user
    // @JoinColumn = Foreign key column
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Constructors
    public Post() {}
    
    public Post(String title, String content, User author) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public Boolean getPublished() { return published; }
    public void setPublished(Boolean published) { this.published = published; }
    
    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

// UserRepository.java
package com.example.graphql.repository;

import com.example.graphql.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// @Repository = Spring Data repository
@Repository
// JpaRepository<User, Long> = Repository for User entity with Long ID
public interface UserRepository extends JpaRepository<User, Long> {
    // findByEmail = Custom query method
    // Spring Data generates query automatically
    User findByEmail(String email);
}

// PostRepository.java
package com.example.graphql.repository;

import com.example.graphql.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // findByPublished = Find posts by published status
    List<Post> findByPublished(Boolean published);
    
    // findByAuthorId = Find posts by author
    List<Post> findByAuthorId(Long authorId);
    
    // findByTitleContainingOrContentContaining = Search posts
    List<Post> findByTitleContainingOrContentContaining(String title, String content);
}
      </code>
    </pre>

    <h2>Implementing Resolvers</h2>
    
    <p>Create resolvers for queries and mutations:</p>

    <pre class="code-block">
      <code>
// UserController.java
package com.example.graphql.controller;

import com.example.graphql.model.User;
import com.example.graphql.model.Post;
import com.example.graphql.repository.UserRepository;
import com.example.graphql.repository.PostRepository;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;
import java.util.List;

// @Controller = Spring GraphQL controller
@Controller
public class UserController {
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    
    // Constructor injection
    public UserController(UserRepository userRepository, PostRepository postRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }
    
    // Query resolvers
    // @QueryMapping = Maps to Query type in schema
    // Method name matches field name in schema
    @QueryMapping
    public List<User> users() {
        // userRepository.findAll() = Get all users from database
        return userRepository.findAll();
    }
    
    // @QueryMapping(name = "user") = Explicitly specify field name
    @QueryMapping
    // @Argument = Map method parameter to GraphQL argument
    public User user(@Argument Long id) {
        // findById() = Get user by ID
        // orElse(null) = Return null if not found
        return userRepository.findById(id).orElse(null);
    }
    
    // Mutation resolvers
    // @MutationMapping = Maps to Mutation type in schema
    @MutationMapping
    public User createUser(
        @Argument String name,
        @Argument String email,
        @Argument Integer age
    ) {
        User user = new User(name, email, age);
        // userRepository.save() = Save to database
        return userRepository.save(user);
    }
    
    @MutationMapping
    public User updateUser(
        @Argument Long id,
        @Argument String name,
        @Argument String email,
        @Argument Integer age
    ) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Update fields if provided
        if (name != null) user.setName(name);
        if (email != null) user.setEmail(email);
        if (age != null) user.setAge(age);
        
        return userRepository.save(user);
    }
    
    @MutationMapping
    public Boolean deleteUser(@Argument Long id) {
        if (!userRepository.existsById(id)) {
            return false;
        }
        userRepository.deleteById(id);
        return true;
    }
    
    // Field resolver for User.posts
    // @SchemaMapping = Resolve field on specific type
    // typeName = Type name in schema
    // field = Field name in schema
    @SchemaMapping(typeName = "User", field = "posts")
    public List<Post> posts(User user) {
        // user = Parent object (from users() or user() query)
        // postRepository.findByAuthorId() = Get posts for this user
        return postRepository.findByAuthorId(user.getId());
    }
}

// PostController.java
package com.example.graphql.controller;

import com.example.graphql.model.Post;
import com.example.graphql.model.User;
import com.example.graphql.repository.PostRepository;
import com.example.graphql.repository.UserRepository;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;
import java.util.List;

@Controller
public class PostController {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    
    public PostController(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }
    
    @QueryMapping
    public List<Post> posts(
        @Argument Boolean published,
        @Argument Long authorId
    ) {
        // Filter posts based on arguments
        if (published != null && authorId != null) {
            return postRepository.findByAuthorId(authorId).stream()
                .filter(post -> post.getPublished().equals(published))
                .toList();
        } else if (published != null) {
            return postRepository.findByPublished(published);
        } else if (authorId != null) {
            return postRepository.findByAuthorId(authorId);
        }
        return postRepository.findAll();
    }
    
    @QueryMapping
    public Post post(@Argument Long id) {
        return postRepository.findById(id).orElse(null);
    }
    
    @QueryMapping
    public List<Post> searchPosts(@Argument String keyword) {
        // Search in title or content
        return postRepository.findByTitleContainingOrContentContaining(keyword, keyword);
    }
    
    @MutationMapping
    public Post createPost(
        @Argument String title,
        @Argument String content,
        @Argument Long authorId
    ) {
        User author = userRepository.findById(authorId)
            .orElseThrow(() -> new RuntimeException("Author not found"));
        
        Post post = new Post(title, content, author);
        return postRepository.save(post);
    }
    
    @MutationMapping
    public Post updatePost(
        @Argument Long id,
        @Argument String title,
        @Argument String content,
        @Argument Boolean published
    ) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (title != null) post.setTitle(title);
        if (content != null) post.setContent(content);
        if (published != null) post.setPublished(published);
        
        return postRepository.save(post);
    }
    
    @MutationMapping
    public Boolean deletePost(@Argument Long id) {
        if (!postRepository.existsById(id)) {
            return false;
        }
        postRepository.deleteById(id);
        return true;
    }
    
    // Field resolver for Post.author
    @SchemaMapping(typeName = "Post", field = "author")
    public User author(Post post) {
        // post.getAuthor() returns User from database
        return post.getAuthor();
    }
}
      </code>
    </pre>

    <h2>DataLoader for N+1 Problem</h2>
    
    <p>Optimize queries with DataLoader:</p>

    <pre class="code-block">
      <code>
// DataLoaderConfiguration.java
package com.example.graphql.config;

import com.example.graphql.model.User;
import com.example.graphql.repository.UserRepository;
import org.dataloader.DataLoader;
import org.dataloader.DataLoaderRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.execution.BatchLoaderRegistry;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// @Component = Spring component for DI
@Component
public class DataLoaderConfiguration {
    
    // Register batch loaders
    // BatchLoaderRegistry = Registry for batch loaders
    public DataLoaderConfiguration(
        BatchLoaderRegistry registry,
        UserRepository userRepository
    ) {
        // registerBatchLoader = Register loader for User type
        // "userLoader" = Loader name
        registry.forTypePair(Long.class, User.class)
            .registerBatchLoader((userIds, env) -> {
                // Batch fetch all users by IDs in one query
                // This solves the N+1 problem
                List<User> users = userRepository.findAllById(userIds);
                
                // Create map of ID -> User for DataLoader
                Map<Long, User> userMap = users.stream()
                    .collect(Collectors.toMap(User::getId, user -> user));
                
                // Return users in same order as requested IDs
                return Mono.just(
                    userIds.stream()
                        .map(userMap::get)
                        .toList()
                );
            });
    }
}

// Using DataLoader in resolver
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.graphql.execution.BatchLoaderRegistry;
import java.util.concurrent.CompletableFuture;

@Controller
public class PostController {
    
    @SchemaMapping(typeName = "Post", field = "author")
    public CompletableFuture<User> author(
        Post post,
        // DataLoader<Long, User> = Loader fetches User by Long ID
        DataLoader<Long, User> userLoader
    ) {
        // userLoader.load() = Queue user ID for batch loading
        // Multiple calls batched into single query
        return userLoader.load(post.getAuthor().getId());
    }
}

// Example: Without DataLoader (N+1 problem)
// Query:
{
  posts {        # 1 query to get all posts
    title
    author {     # N queries (one per post) to get each author
      name       # This is the N+1 problem!
    }
  }
}

// With DataLoader:
{
  posts {        # 1 query to get all posts
    title
    author {     # 1 batched query to get all authors at once
      name       # Total: 2 queries instead of N+1
    }
  }
}
      </code>
    </pre>

    <h2>Error Handling and Validation</h2>
    
    <p>Handle errors and validate input:</p>

    <pre class="code-block">
      <code>
// GraphQLExceptionHandler.java
package com.example.graphql.exception;

import graphql.GraphQLError;
import graphql.GraphqlErrorBuilder;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.graphql.execution.DataFetcherExceptionResolverAdapter;
import org.springframework.stereotype.Component;

// @Component = Exception handler component
@Component
public class GraphQLExceptionHandler extends DataFetcherExceptionResolverAdapter {
    
    @Override
    protected GraphQLError resolveToSingleError(
        Throwable ex,
        DataFetchingEnvironment env
    ) {
        // Create custom GraphQL error
        return GraphqlErrorBuilder.newError()
            .message(ex.getMessage())
            .path(env.getExecutionStepInfo().getPath())
            .location(env.getField().getSourceLocation())
            .build();
    }
}

// Input validation with Bean Validation
import jakarta.validation.constraints.*;

// CreateUserInput.java
package com.example.graphql.input;

public record CreateUserInput(
    // @NotBlank = Not null and not empty
    @NotBlank(message = "Name is required")
    String name,
    
    // @Email = Valid email format
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    String email,
    
    // @Min/@Max = Integer range validation
    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 120, message = "Age must not exceed 120")
    Integer age
) {}

// Use validated input in resolver
@MutationMapping
public User createUser(@Argument @Valid CreateUserInput input) {
    // @Valid = Trigger validation
    // Validation errors automatically returned to client
    User user = new User(input.name(), input.email(), input.age());
    return userRepository.save(user);
}

// Custom exceptions
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(Long id) {
        super("User not found with id: " + id);
    }
}

public class PostNotFoundException extends RuntimeException {
    public PostNotFoundException(Long id) {
        super("Post not found with id: " + id);
    }
}

// Use in resolvers
@QueryMapping
public User user(@Argument Long id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new UserNotFoundException(id));
}
      </code>
    </pre>

    <h2>Testing GraphQL API</h2>
    
    <p>Query examples for testing:</p>

    <pre class="code-block">
      <code>
# Access GraphiQL at http://localhost:8080/graphiql

# Query 1: Get all users with their posts
{
  users {
    id
    name
    email
    posts {
      id
      title
      published
    }
  }
}

# Query 2: Get single user by ID
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    age
    posts {
      title
      content
      createdAt
    }
  }
}

# Variables:
{
  "id": "1"
}

# Mutation 1: Create user
mutation CreateUser {
  createUser(name: "John Doe", email: "john@example.com", age: 30) {
    id
    name
    email
  }
}

# Mutation 2: Create post
mutation CreatePost {
  createPost(
    title: "GraphQL with Java"
    content: "Learning GraphQL is fun!"
    authorId: "1"
  ) {
    id
    title
    content
    author {
      name
    }
  }
}

# Query 3: Search posts
query SearchPosts($keyword: String!) {
  searchPosts(keyword: $keyword) {
    id
    title
    content
    author {
      name
    }
  }
}

# Variables:
{
  "keyword": "GraphQL"
}

# Mutation 3: Update post
mutation UpdatePost($id: ID!, $published: Boolean!) {
  updatePost(id: $id, published: $published) {
    id
    title
    published
  }
}
      </code>
    </pre>

    <div class="practice-box bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
      <h3 class="font-semibold text-green-900 mb-4">🎯 Practice Exercise</h3>
      <p class="mb-4">Create a complete Java GraphQL API with:</p>
      <ul class="list-disc pl-6 space-y-2">
        <li>Spring Boot project with GraphQL dependency</li>
        <li>schema.graphqls with User and Post types</li>
        <li>JPA entities: User, Post with relationships</li>
        <li>Repositories: UserRepository, PostRepository</li>
        <li>Controllers with @QueryMapping and @MutationMapping</li>
        <li>Field resolvers with @SchemaMapping</li>
        <li>DataLoader configuration for N+1 optimization</li>
        <li>Test at /graphiql endpoint</li>
      </ul>
    </div>

    <div class="tip-box bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
      <h4 class="font-semibold text-yellow-900 mb-2">💡 Key Takeaways</h4>
      <ul class="list-disc pl-6 space-y-1 text-sm">
        <li>GraphQL schema defined in .graphqls file using SDL</li>
        <li>@QueryMapping and @MutationMapping map to schema operations</li>
        <li>@SchemaMapping resolves fields on types (relationships)</li>
        <li>@Argument maps method parameters to GraphQL arguments</li>
        <li>DataLoader solves N+1 problem by batching queries</li>
        <li>Spring Data JPA repositories simplify database access</li>
        <li>Bean Validation provides input validation</li>
        <li>GraphiQL provides interactive API testing interface</li>
        <li>Type safety from both GraphQL schema and Java types</li>
      </ul>
    </div>
  </div>`,

  starterCode: `// Add to pom.xml:
// <dependency>
//   <groupId>org.springframework.boot</groupId>
//   <artifactId>spring-boot-starter-graphql</artifactId>
// </dependency>

// src/main/resources/graphql/schema.graphqls
type Query {
    hello: String
}

// UserController.java
package com.example.graphql.controller;

import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
public class UserController {
    // Implement your GraphQL resolvers here
}`,

  solution: `// schema.graphqls
type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
}

type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    author: User!
}

type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
}

type Mutation {
    createUser(name: String!, email: String!): User!
    createPost(title: String!, content: String!, authorId: ID!): Post!
}

// UserController.java
@Controller
public class UserController {
    private final UserRepository userRepository;
    
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @QueryMapping
    public List<User> users() {
        return userRepository.findAll();
    }
    
    @QueryMapping
    public User user(@Argument Long id) {
        return userRepository.findById(id).orElse(null);
    }
    
    @MutationMapping
    public User createUser(@Argument String name, @Argument String email) {
        User user = new User(name, email);
        return userRepository.save(user);
    }
}`,

  validationCriteria: {
    requiredIncludes: [
      "@Controller",
      "@QueryMapping",
      "graphql",
      "type",
      "Query",
    ],
    requiredPatterns: [
      /@QueryMapping|@MutationMapping/,
      /type\s+\w+\s*{/,
      /@Argument/,
    ],
    minLines: 15,
  },
};
