import React from "react";
import { Shield } from "lucide-react";

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

export const AuthSection = {
  id: "auth",
  title: "Authentication & Security",
  icon: <Shield className="w-5 h-5 text-red-600" />,
  overview:
    "Implement JWT authentication, password hashing, and security best practices in Crow applications.",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">
          JWT Authentication Implementation
        </h3>
        <CodeExplanation
          code={`#include "crow_all.h"
#include <jwt-cpp/jwt.h>
#include <openssl/sha.h>
#include <iomanip>
#include <sstream>

// Simple password hashing utility
std::string hashPassword(const std::string& password) {
    unsigned char hash[SHA_DIGEST_LENGTH];
    SHA1(reinterpret_cast<unsigned char*>(const_cast<char*>(password.c_str())),
         password.length(), hash);
    
    std::stringstream ss;
    for (int i = 0; i < SHA_DIGEST_LENGTH; i++) {
        ss << std::hex << std::setw(2) << std::setfill('0') << (int)hash[i];
    }
    return ss.str();
}

// JWT token generation
std::string generateToken(int userId, const std::string& secret) {
    auto token = jwt::create<jwt::traits::nlohmann_json>()
        .set_issuer("crow-app")
        .set_subject(std::to_string(userId))
        .set_issued_at(std::chrono::system_clock::now())
        .set_expires_at(std::chrono::system_clock::now() + std::chrono::hours{24})
        .sign(jwt::algorithm::hs256{secret});
    return token;
}

// JWT token verification
bool verifyToken(const std::string& token, const std::string& secret) {
    try {
        auto decoded = jwt::decode(token);
        auto verifier = jwt::verify()
            .allow_algorithm(jwt::algorithm::hs256{secret})
            .with_issuer("crow-app");
        verifier.verify(decoded);
        return true;
    } catch (...) {
        return false;
    }
}

// Authentication middleware
struct AuthMiddleware {
    struct context {
        int userId = -1;
        bool authenticated = false;
    };

    void before_handle(crow::request& req, crow::response& res, context& ctx) {
        auto auth_header = req.get_header_value("Authorization");
        
        if (auth_header.empty()) {
            ctx.authenticated = false;
            return;
        }

        auto token = auth_header.substr(7); // Remove "Bearer "
        std::string secret = "your-secret-key";
        
        if (verifyToken(token, secret)) {
            ctx.authenticated = true;
            auto decoded = jwt::decode(token);
            ctx.userId = std::stoi(decoded.get_subject());
        }
    }

    void after_handle(crow::request& req, crow::response& res, context& ctx) {}
};

int main() {
    crow::App<AuthMiddleware> app;
    std::string secret = "your-secret-key";
    
    // User storage (use database in production)
    std::map<std::string, std::pair<std::string, std::string>> users; // username -> (hashed_password, email)

    // POST /auth/register - Register new user
    CROW_ROUTE(app, "/auth/register").methods("POST"_method)
    ([&users, &secret](const crow::request& req) {
        auto json = crow::json::load(req.body);
        std::string username = json["username"].s();
        std::string password = json["password"].s();
        std::string email = json["email"].s();

        if (users.find(username) != users.end()) {
            return crow::response(409, "User already exists");
        }

        users[username] = {hashPassword(password), email};

        crow::json::wvalue response;
        response["message"] = "User registered successfully";
        return crow::response(201, response);
    });

    // POST /auth/login - User login
    CROW_ROUTE(app, "/auth/login").methods("POST"_method)
    ([&users, &secret](const crow::request& req) {
        auto json = crow::json::load(req.body);
        std::string username = json["username"].s();
        std::string password = json["password"].s();

        auto it = users.find(username);
        if (it == users.end() || it->second.first != hashPassword(password)) {
            return crow::response(401, "Invalid credentials");
        }

        std::string token = generateToken(1, secret);

        crow::json::wvalue response;
        response["token"] = token;
        response["message"] = "Login successful";
        return crow::response(response);
    });

    // GET /api/protected - Protected route
    CROW_ROUTE(app, "/api/protected")
    ([](const crow::request& req) {
        auto& ctx = app.get_context<AuthMiddleware>(req);
        if (!ctx.authenticated) {
            return crow::response(401, "Unauthorized");
        }

        crow::json::wvalue response;
        response["message"] = "Access granted";
        response["userId"] = ctx.userId;
        return crow::response(response);
    });

    app.port(8080).multithreaded().run();
    return 0;
}`}
          explanation={[
            {
              label: "hashPassword()",
              desc: "Secure password hashing using SHA-1 algorithm",
            },
            {
              label: "jwt::create()",
              desc: "Generate JWT token with issuer, subject, and expiration",
            },
            {
              label: "jwt::verify()",
              desc: "Verify JWT token signature and expiration",
            },
            {
              label: "AuthMiddleware context",
              desc: "Store authenticated user data across request lifecycle",
            },
            {
              label: "Authorization header",
              desc: "Extract Bearer token from request headers for validation",
            },
          ]}
        />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">
          Security Best Practices
        </h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Use bcrypt or Argon2 for password hashing in production</li>
          <li>• Store JWT secret as environment variable, never hardcode</li>
          <li>• Implement token refresh mechanisms for long-lived sessions</li>
          <li>• Use HTTPS in production to protect token transmission</li>
          <li>• Add rate limiting on authentication endpoints</li>
        </ul>
      </div>
    </div>
  ),
};
