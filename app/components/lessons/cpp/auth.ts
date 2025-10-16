import { LessonData } from "../types";

const lesson: LessonData = {
  title: "Authentication & Security in C++",
  difficulty: "Advanced",
  description:
    "Implement JWT authentication, password hashing, and security best practices in C++ web applications",
  objectives: [
    "Implement password hashing with bcrypt",
    "Generate and validate JWT tokens",
    "Create authentication middleware",
    "Handle user sessions securely",
    "Apply C++ security best practices",
  ],
  content: `# Authentication & Security in C++

Security is crucial in C++ web applications. We'll implement modern authentication patterns with JWT and secure password handling.

## Dependencies

Add to CMakeLists.txt:
\`\`\`cmake
find_package(OpenSSL REQUIRED)
# Add jwt-cpp library
target_link_libraries(\${PROJECT_NAME} PRIVATE OpenSSL::SSL OpenSSL::Crypto)
\`\`\`

## Password Hashing with bcrypt

\`\`\`cpp
#include <bcrypt/BCrypt.hpp>
#include <string>

class PasswordManager {
public:
    static std::string hashPassword(const std::string& password) {
        return BCrypt::generateHash(password, 12); // Cost factor 12
    }
    
    static bool verifyPassword(const std::string& password, const std::string& hash) {
        return BCrypt::validatePassword(password, hash);
    }
    
    static bool isSecurePassword(const std::string& password) {
        // Minimum 8 characters, at least one uppercase, lowercase, digit, special char
        if (password.length() < 8) return false;
        
        bool hasUpper = false, hasLower = false, hasDigit = false, hasSpecial = false;
        
        for (char c : password) {
            if (std::isupper(c)) hasUpper = true;
            else if (std::islower(c)) hasLower = true;
            else if (std::isdigit(c)) hasDigit = true;
            else hasSpecial = true;
        }
        
        return hasUpper && hasLower && hasDigit && hasSpecial;
    }
};
\`\`\`

## JWT Token Management

\`\`\`cpp
#include <jwt-cpp/jwt.h>
#include <chrono>

class JwtManager {
private:
    std::string secret;
    std::chrono::seconds token_lifetime;

public:
    JwtManager(const std::string& jwt_secret, int lifetime_hours = 24) 
        : secret(jwt_secret), token_lifetime(std::chrono::hours(lifetime_hours)) {}

    std::string generateToken(const User& user) {
        auto now = std::chrono::system_clock::now();
        auto exp = now + token_lifetime;
        
        return jwt::create()
            .set_issuer("cpp-server")
            .set_type("JWT")
            .set_payload_claim("user_id", jwt::claim(user.id))
            .set_payload_claim("username", jwt::claim(user.username))
            .set_payload_claim("email", jwt::claim(user.email))
            .set_issued_at(now)
            .set_expires_at(exp)
            .sign(jwt::algorithm::hs256{secret});
    }

    std::optional<jwt::decoded_jwt> validateToken(const std::string& token) {
        try {
            auto verifier = jwt::verify()
                .allow_algorithm(jwt::algorithm::hs256{secret})
                .with_issuer("cpp-server");
            
            auto decoded = jwt::decode(token);
            verifier.verify(decoded);
            
            return decoded;
        } catch (const std::exception&) {
            return std::nullopt;
        }
    }
};
\`\`\`

## Authentication Controller

\`\`\`cpp
class AuthController {
private:
    std::shared_ptr<Database> db;
    JwtManager jwt_manager;

public:
    AuthController(std::shared_ptr<Database> database, const std::string& jwt_secret)
        : db(std::move(database)), jwt_manager(jwt_secret) {}

    crow::response login(const crow::request& req) {
        try {
            auto json_body = nlohmann::json::parse(req.body);
            std::string username = json_body.at("username");
            std::string password = json_body.at("password");

            auto user = db->getUserByUsername(username);
            if (!user || !PasswordManager::verifyPassword(password, user->password_hash)) {
                return ApiResponse::error("Invalid credentials", 401);
            }

            if (!user->is_active) {
                return ApiResponse::error("Account is disabled", 401);
            }

            std::string token = jwt_manager.generateToken(*user);
            
            nlohmann::json response = {
                {"user", user->toJson()},
                {"token", token},
                {"expires_in", 86400} // 24 hours in seconds
            };

            return ApiResponse::success(response);
        } catch (const std::exception& e) {
            return ApiResponse::error("Invalid request format", 400);
        }
    }

    crow::response register_user(const crow::request& req) {
        try {
            auto json_body = nlohmann::json::parse(req.body);
            
            std::string username = json_body.at("username");
            std::string email = json_body.at("email");
            std::string password = json_body.at("password");

            // Validate password strength
            if (!PasswordManager::isSecurePassword(password)) {
                return ApiResponse::error(
                    "Password must be at least 8 characters with uppercase, lowercase, digit, and special character", 
                    400
                );
            }

            // Check if user exists
            if (db->userExists(username)) {
                return ApiResponse::error("Username already exists", 409);
            }

            // Create new user
            User new_user;
            new_user.username = username;
            new_user.email = email;
            new_user.password_hash = PasswordManager::hashPassword(password);
            new_user.is_active = true;

            auto created_user = db->createUser(new_user);
            if (!created_user) {
                return ApiResponse::error("Failed to create user", 500);
            }

            // Generate token for new user
            std::string token = jwt_manager.generateToken(*created_user);
            
            nlohmann::json response = {
                {"user", created_user->toJson()},
                {"token", token}
            };

            return ApiResponse::success(response, 201);
        } catch (const std::exception& e) {
            return ApiResponse::error("Invalid request format", 400);
        }
    }
};
\`\`\`

## Authentication Middleware

\`\`\`cpp
struct AuthMiddleware : crow::ILocalMiddleware {
    struct context {
        std::optional<User> current_user;
        bool authenticated = false;
    };

private:
    JwtManager& jwt_manager;
    std::shared_ptr<Database> db;

public:
    AuthMiddleware(JwtManager& jwt_mgr, std::shared_ptr<Database> database)
        : jwt_manager(jwt_mgr), db(std::move(database)) {}

    void before_handle(crow::request& req, crow::response& res, context& ctx) {
        std::string auth_header = req.get_header_value("Authorization");
        
        if (auth_header.empty() || auth_header.substr(0, 7) != "Bearer ") {
            res = ApiResponse::error("Missing or invalid Authorization header", 401);
            return;
        }

        std::string token = auth_header.substr(7);
        auto decoded_token = jwt_manager.validateToken(token);
        
        if (!decoded_token) {
            res = ApiResponse::error("Invalid or expired token", 401);
            return;
        }

        // Extract user information from token
        int user_id = decoded_token->get_payload_claim("user_id").as_int();
        auto user = db->getUserById(user_id);
        
        if (!user || !user->is_active) {
            res = ApiResponse::error("User not found or disabled", 401);
            return;
        }

        ctx.current_user = *user;
        ctx.authenticated = true;
    }
};
\`\`\``,
  practiceInstructions: [
    "Set up bcrypt for password hashing",
    "Implement JWT token generation and validation",
    "Create secure password validation rules",
    "Build authentication middleware",
    "Implement login and registration endpoints",
    "Test the complete authentication flow",
  ],
  hints: [
    "Use high cost factors for bcrypt (10-12)",
    "Store JWT secrets securely (environment variables)",
    "Validate token expiration and signature",
    "Never return password hashes in API responses",
    "Implement rate limiting for authentication endpoints",
  ],
  solution: `// Complete authentication system with rate limiting and security headers

#include <unordered_map>
#include <chrono>
#include <mutex>

class RateLimiter {
private:
    struct ClientInfo {
        int attempts;
        std::chrono::steady_clock::time_point last_attempt;
    };
    
    std::unordered_map<std::string, ClientInfo> clients;
    std::mutex mutex;
    int max_attempts;
    std::chrono::minutes window;

public:
    RateLimiter(int max_attempts = 5, int window_minutes = 15)
        : max_attempts(max_attempts), window(std::chrono::minutes(window_minutes)) {}

    bool isAllowed(const std::string& client_ip) {
        std::lock_guard<std::mutex> lock(mutex);
        auto now = std::chrono::steady_clock::now();
        
        auto it = clients.find(client_ip);
        if (it == clients.end()) {
            clients[client_ip] = {1, now};
            return true;
        }
        
        if (now - it->second.last_attempt > window) {
            it->second = {1, now};
            return true;
        }
        
        if (it->second.attempts >= max_attempts) {
            return false;
        }
        
        it->second.attempts++;
        it->second.last_attempt = now;
        return true;
    }
};

// Security headers middleware
struct SecurityHeaders : crow::ILocalMiddleware {
    struct context {};
    
    void after_handle(crow::request& req, crow::response& res, context& ctx) {
        res.set_header("X-Content-Type-Options", "nosniff");
        res.set_header("X-Frame-Options", "DENY");
        res.set_header("X-XSS-Protection", "1; mode=block");
        res.set_header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        res.set_header("Content-Security-Policy", "default-src 'self'");
    }
};`,
};

export default lesson;
