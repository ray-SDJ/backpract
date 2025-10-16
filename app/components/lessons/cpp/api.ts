import { LessonData } from "../types";

const lesson: LessonData = {
  title: "REST API Development with Crow",
  difficulty: "Advanced",
  description:
    "Build a complete REST API with Crow framework, including routing, middleware, and JSON handling",
  objectives: [
    "Design RESTful endpoints with proper HTTP methods",
    "Implement request/response handling with JSON",
    "Add custom middleware for logging and validation",
    "Handle file uploads and multipart data",
    "Implement API versioning and documentation",
  ],
  content: `# REST API Development with Crow Framework

Crow provides excellent support for building high-performance REST APIs with modern C++.

## Advanced API Structure

\`\`\`cpp
#include <crow.h>
#include <nlohmann/json.hpp>
#include "database/Database.h"
#include "models/User.h"

class UserController {
private:
    std::shared_ptr<Database> db;

public:
    explicit UserController(std::shared_ptr<Database> database) 
        : db(std::move(database)) {}

    // GET /api/users
    crow::response getAllUsers() {
        try {
            auto users = db->getAllUsers();
            nlohmann::json response = nlohmann::json::array();
            
            for (const auto& user : users) {
                response.push_back(user.toJson());
            }
            
            return crow::response(200, response.dump(2));
        } catch (const std::exception& e) {
            return crow::response(500, "Internal server error");
        }
    }

    // GET /api/users/<id>
    crow::response getUserById(int id) {
        auto user = db->getUserById(id);
        if (user) {
            return crow::response(200, user->toJson().dump(2));
        }
        return crow::response(404, "User not found");
    }

    // POST /api/users
    crow::response createUser(const crow::request& req) {
        try {
            auto json_body = nlohmann::json::parse(req.body);
            
            User user;
            user.username = json_body.at("username");
            user.email = json_body.at("email");
            user.password_hash = json_body.at("password"); // In real app, hash this!
            
            auto created_user = db->createUser(user);
            if (created_user) {
                return crow::response(201, created_user->toJson().dump(2));
            }
            
            return crow::response(400, "Failed to create user");
        } catch (const std::exception& e) {
            return crow::response(400, "Invalid JSON data");
        }
    }
};
\`\`\`

## Middleware Implementation

\`\`\`cpp
// Request logging middleware
struct RequestLogger : crow::ILocalMiddleware {
    struct context {};
    
    void before_handle(crow::request& req, crow::response& res, context& ctx) {
        std::cout << "[" << getCurrentTime() << "] " 
                  << req.method_string() << " " << req.url 
                  << " from " << req.get_header_value("User-Agent") << std::endl;
    }
    
private:
    std::string getCurrentTime() {
        auto now = std::chrono::system_clock::now();
        auto time_t = std::chrono::system_clock::to_time_t(now);
        return std::asctime(std::localtime(&time_t));
    }
};

// API versioning middleware
struct ApiVersioning : crow::ILocalMiddleware {
    struct context {
        std::string version;
    };
    
    void before_handle(crow::request& req, crow::response& res, context& ctx) {
        std::string version = req.get_header_value("API-Version");
        if (version.empty()) {
            version = "v1"; // Default version
        }
        ctx.version = version;
        
        // Add version to response header
        res.set_header("API-Version", version);
    }
};
\`\`\`

## Complete API Server

\`\`\`cpp
int main() {
    crow::App<RequestLogger, ApiVersioning> app;
    
    // Initialize database
    auto database = std::make_shared<Database>("app.db");
    database->initialize();
    
    // Initialize controllers
    UserController userController(database);
    
    // API Routes
    CROW_ROUTE(app, "/api/v1/users").methods("GET"_method)
    ([&userController](const crow::request& req) {
        return userController.getAllUsers();
    });
    
    CROW_ROUTE(app, "/api/v1/users/<int>").methods("GET"_method)
    ([&userController](const crow::request& req, int id) {
        return userController.getUserById(id);
    });
    
    CROW_ROUTE(app, "/api/v1/users").methods("POST"_method)
    ([&userController](const crow::request& req) {
        return userController.createUser(req);
    });
    
    // Health and status endpoints
    CROW_ROUTE(app, "/health")
    ([]() {
        nlohmann::json health = {
            {"status", "healthy"},
            {"timestamp", std::time(nullptr)},
            {"version", "1.0.0"}
        };
        return crow::response(200, health.dump(2));
    });
    
    app.port(8080).multithreaded().run();
    return 0;
}
\`\`\``,
  practiceInstructions: [
    "Implement UserController with CRUD operations",
    "Add custom middleware for logging and API versioning",
    "Test all endpoints with different HTTP methods",
    "Add proper error handling and status codes",
    "Implement request validation middleware",
    "Add API documentation and health checks",
  ],
  hints: [
    "Use smart pointers for dependency injection",
    "Validate JSON input before processing",
    "Return appropriate HTTP status codes",
    "Use middleware for cross-cutting concerns",
    "Consider using connection pooling for database access",
  ],
  solution: `// Production-ready API implementation with comprehensive features
#include <crow.h>
#include <nlohmann/json.hpp>
#include <memory>
#include <regex>
#include "database/Database.h"

class ApiResponse {
public:
    static crow::response success(const nlohmann::json& data, int status = 200) {
        nlohmann::json response = {
            {"success", true},
            {"data", data},
            {"timestamp", std::time(nullptr)}
        };
        
        crow::response res(status);
        res.set_header("Content-Type", "application/json");
        res.write(response.dump(2));
        return res;
    }
    
    static crow::response error(const std::string& message, int status = 400) {
        nlohmann::json response = {
            {"success", false},
            {"error", message},
            {"timestamp", std::time(nullptr)}
        };
        
        crow::response res(status);
        res.set_header("Content-Type", "application/json");
        res.write(response.dump(2));
        return res;
    }
};

// Input validation middleware
struct InputValidator : crow::ILocalMiddleware {
    struct context {};
    
    void before_handle(crow::request& req, crow::response& res, context& ctx) {
        if (req.method == crow::HTTPMethod::Post || req.method == crow::HTTPMethod::Put) {
            if (req.get_header_value("Content-Type").find("application/json") == std::string::npos) {
                res = ApiResponse::error("Content-Type must be application/json", 400);
                return;
            }
            
            if (req.body.empty()) {
                res = ApiResponse::error("Request body cannot be empty", 400);
                return;
            }
        }
    }
};`,
};

export default lesson;
