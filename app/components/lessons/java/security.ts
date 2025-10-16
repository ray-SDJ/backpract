import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Spring Security & JWT",
  description:
    "Secure your Spring Boot application with authentication, authorization, JWT tokens, and role-based access control.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <p>Learn to secure your Spring Boot applications with JWT-based authentication, role-based authorization, and comprehensive security configuration.</p>

    <h2>Adding Security Dependencies</h2>
    
    <p>Add Spring Security and JWT dependencies to your pom.xml:</p>

    <pre class="code-block">
      <code>
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-security&lt;/artifactId&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
    &lt;groupId&gt;io.jsonwebtoken&lt;/groupId&gt;
    &lt;artifactId&gt;jjwt-api&lt;/artifactId&gt;
    &lt;version&gt;0.11.5&lt;/version&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
    &lt;groupId&gt;io.jsonwebtoken&lt;/groupId&gt;
    &lt;artifactId&gt;jjwt-impl&lt;/artifactId&gt;
    &lt;version&gt;0.11.5&lt;/version&gt;
&lt;/dependency&gt;
      </code>
    </pre>

    <h2>JWT Configuration</h2>
    
    <p>Configure JWT properties in application.properties:</p>

    <pre class="code-block">
      <code>
# JWT Configuration
app.jwt.secret=mySecretKey
app.jwt.expiration=86400000
      </code>
    </pre>

    <h2>JWT Utility Class</h2>
    
    <pre class="code-block">
      <code>
@Component
public class JwtUtils {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);
    
    @Value("\${app.jwt.secret}")
    private String jwtSecret;
    
    @Value("\${app.jwt.expiration}")
    private int jwtExpirationMs;
    
    public String generateJwtToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }
    
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }
    
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        }
        return false;
    }
}
      </code>
    </pre>

    <h2>User Entity with Security</h2>
    
    <pre class="code-block">
      <code>
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
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;
    
    // Constructors, getters, setters...
}

public enum Role {
    USER, ADMIN, MODERATOR
}
      </code>
    </pre>

    <h2>UserPrincipal for Spring Security</h2>
    
    <pre class="code-block">
      <code>
public class UserPrincipal implements UserDetails {
    private Long id;
    private String username;
    private String email;
    private String password;
    private Collection&lt;? extends GrantedAuthority&gt; authorities;
    
    public static UserPrincipal create(User user) {
        List&lt;GrantedAuthority&gt; authorities = List.of(
            new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );
        
        return new UserPrincipal(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getPassword(),
            authorities
        );
    }
    
    @Override
    public Collection&lt;? extends GrantedAuthority&gt; getAuthorities() {
        return authorities;
    }
    
    @Override
    public boolean isAccountNonExpired() { return true; }
    
    @Override
    public boolean isAccountNonLocked() { return true; }
    
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    
    @Override
    public boolean isEnabled() { return true; }
}
      </code>
    </pre>

    <h2>Security Configuration</h2>
    
    <pre class="code-block">
      <code>
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) 
            throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
                .antMatchers("/api/auth/**").permitAll()
                .antMatchers(HttpMethod.GET, "/api/posts/**").permitAll()
                .antMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated();
        
        http.addFilterBefore(authenticationJwtTokenFilter(), 
                           UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
      </code>
    </pre>

    <h2>Authentication Controller</h2>
    
    <pre class="code-block">
      <code>
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PasswordEncoder encoder;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @PostMapping("/signin")
    public ResponseEntity&lt;?&gt; authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(), 
                loginRequest.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
        
        return ResponseEntity.ok(new JwtResponse(jwt,
                                               userDetails.getId(),
                                               userDetails.getUsername(),
                                               userDetails.getEmail(),
                                               userDetails.getAuthorities()));
    }
    
    @PostMapping("/signup")
    public ResponseEntity&lt;?&gt; registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        
        if (userService.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Username is already taken!"));
        }
        
        // Create new user account
        User user = new User(signUpRequest.getUsername(),
                           signUpRequest.getEmail(),
                           encoder.encode(signUpRequest.getPassword()));
        
        userService.save(user);
        
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
      </code>
    </pre>

    <h2>Key Security Concepts</h2>
    
    <div class="explanation-list">
      <ul>
        <li><strong>JWT (JSON Web Token):</strong> Stateless authentication mechanism</li>
        <li><strong>@EnableGlobalMethodSecurity:</strong> Enables method-level security annotations</li>
        <li><strong>SecurityFilterChain:</strong> Configures security rules and filter chain</li>
        <li><strong>SessionCreationPolicy.STATELESS:</strong> Disables session creation for JWT</li>
        <li><strong>BCryptPasswordEncoder:</strong> Secure password hashing algorithm</li>
        <li><strong>UserDetails:</strong> Spring Security contract for user authentication details</li>
      </ul>
    </div>

    <h2>Testing Authentication</h2>
    
    <p>Test your authentication endpoints:</p>
    
    <pre class="code-block">
      <code>
# Register a new user
curl -X POST http://localhost:8080/api/auth/signup \\
  -H "Content-Type: application/json" \\
  -d '{"username": "john", "email": "john@example.com", "password": "password123"}'

# Login and get JWT token
curl -X POST http://localhost:8080/api/auth/signin \\
  -H "Content-Type: application/json" \\
  -d '{"username": "john", "password": "password123"}'

# Access protected endpoint with JWT
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  http://localhost:8080/api/protected-endpoint
      </code>
    </pre>
  </div>`,
  objectives: [
    "Implement JWT-based authentication in Spring Boot",
    "Create secure password handling with BCrypt",
    "Configure Spring Security with custom security rules",
    "Build authentication and registration endpoints",
    "Implement role-based access control",
  ],
  practiceInstructions: [
    "Add Spring Security and JWT dependencies",
    "Create JwtUtils class for token generation and validation",
    "Implement UserPrincipal class implementing UserDetails",
    "Configure WebSecurityConfig with security rules",
    "Build AuthController with login and registration endpoints",
  ],
  hints: [
    "Always hash passwords with BCryptPasswordEncoder",
    "JWT tokens should be validated on every request",
    "Use @PreAuthorize for method-level security",
    "Store JWT secret in environment variables for production",
  ],
  solution: `// Complete JWT Authentication setup
@Component
public class JwtUtils {
    @Value("\${app.jwt.secret}")
    private String jwtSecret;
    
    @Value("\${app.jwt.expiration}")
    private int jwtExpirationMs;
    
    public String generateJwtToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }
    
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}`,
};
