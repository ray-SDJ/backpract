import React from "react";
import { Code2 } from "lucide-react";

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

export const ApiSection = {
  id: "api",
  title: "REST API Development",
  icon: Code2,
  overview:
    "Build production-ready REST APIs with Crow framework, including routing, middleware, and JSON handling.",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">RESTful API Design with Crow</h3>
        <p className="text-gray-700 mb-3">
          Crow provides excellent support for building high-performance REST
          APIs with modern C++.
        </p>
        <div className="bg-gray-100 rounded-lg p-4 text-sm space-y-2 font-mono mb-4">
          <div>GET /api/users → Get all users</div>
          <div>GET /api/users/123 → Get user with ID 123</div>
          <div>POST /api/users → Create new user</div>
          <div>PUT /api/users/123 → Update user 123</div>
          <div>DELETE /api/users/123 → Delete user 123</div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">REST API Implementation</h3>
        <CodeExplanation
          code={`#include "crow_all.h"
#include <map>

// User model
struct User {
    int id;
    std::string username;
    std::string email;
};

// User controller class
class UserController {
private:
    std::map<int, User> users;
    int nextId = 1;

public:
    // GET /api/users
    crow::response getAllUsers() {
        crow::json::wvalue response = crow::json::wvalue::list();
        for (const auto& [id, user] : users) {
            crow::json::wvalue userJson;
            userJson["id"] = user.id;
            userJson["username"] = user.username;
            response[response.size()] = std::move(userJson);
        }
        return crow::response(200, response);
    }

    // POST /api/users
    crow::response createUser(const crow::request& req) {
        auto json = crow::json::load(req.body);
        if (!json) {
            return crow::response(400, "Invalid JSON");
        }
        
        User user;
        user.id = nextId++;
        user.username = json["username"].s();
        users[user.id] = user;
        return crow::response(201, "User created");
    }
};`}
          explanation={[
            {
              label: "UserController",
              desc: "Encapsulates all user-related API logic and data management",
            },
            {
              label: "crow::json::wvalue",
              desc: "Crow's JSON write value for building JSON responses",
            },
            {
              label: ".methods('GET'_method)",
              desc: "Restricts route to specific HTTP methods",
            },
            {
              label: "crow::response(code)",
              desc: "Creates HTTP response with status code and body",
            },
          ]}
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">
          💡 API Best Practices
        </h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Use proper HTTP status codes (200, 201, 400, 404, 500)</li>
          <li>• Implement consistent JSON response structure</li>
        </ul>
      </div>
    </div>
  ),
};
