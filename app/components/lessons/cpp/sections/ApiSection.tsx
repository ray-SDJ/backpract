import React from "react";
import { TestTube } from "lucide-react";

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

export const TestingSection = {
  id: "testing",
  title: "Testing & Deployment",
  icon: <TestTube className="w-5 h-5 text-blue-600" />,
  overview:
    "Write comprehensive tests with Catch2, and deploy to production with containerization and best practices.",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">Unit Testing with Catch2</h3>
        <CodeExplanation
          code={`// CMakeLists.txt with Catch2
cmake_minimum_required(VERSION 3.10)
project(crow_tests)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

// Include dependencies
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/crow/include)

// Add Catch2
find_package(Catch2 3 REQUIRED)

// Add test executable
add_executable(tests tests.cpp)
target_link_libraries(tests Catch2::Catch2WithMain)

// tests.cpp
#define CATCH_CONFIG_MAIN
#include <catch2/catch_all.hpp>
#include "crow_all.h"
#include <string>

// Utility function to test
std::string hashPassword(const std::string& password) {
    return password + "_hashed";
}

TEST_CASE("Password hashing", "[security]") {
    REQUIRE(hashPassword("test123") == "test123_hashed");
    REQUIRE(hashPassword("") != "");
}

TEST_CASE("JSON parsing") {
    auto json = crow::json::load(R"({"name":"John","age":30})");
    REQUIRE(json["name"].s() == "John");
    REQUIRE(json["age"].i() == 30);
}

TEST_CASE("User validation") {
    SECTION("Valid user data") {
        auto json = crow::json::load(R"({"username":"john","email":"john@example.com","age":25})");
        REQUIRE(json.has("username"));
        REQUIRE(json["age"].i() >= 18);
    }

    SECTION("Invalid email format") {
        auto json = crow::json::load(R"({"username":"john","email":"invalid","age":25})");
        REQUIRE(!json["email"].s().find("@") != std::string::npos);
    }

    SECTION("Underage user") {
        auto json = crow::json::load(R"({"username":"john","email":"john@example.com","age":15})");
        REQUIRE(json["age"].i() < 18);
    }
}

TEST_CASE("Response handling", "[api]") {
    crow::SimpleApp app;
    
    CROW_ROUTE(app, "/test")
    ([]() {
        return crow::response(200, "Success");
    });

    auto res = crow::response(200, "Success");
    REQUIRE(res.code == 200);
    REQUIRE(res.body == "Success");
}

TEST_CASE("API endpoints", "[integration]") {
    crow::SimpleApp app;
    std::map<int, std::string> items;
    int nextId = 1;

    CROW_ROUTE(app, "/items").methods("POST"_method)
    ([&items, &nextId](const crow::request& req) {
        auto json = crow::json::load(req.body);
        items[nextId] = json["name"].s();
        crow::json::wvalue response;
        response["id"] = nextId;
        response["name"] = items[nextId];
        nextId++;
        return crow::response(201, response);
    });

    REQUIRE(items.empty());
}`}
          explanation={[
            {
              label: "CATCH_CONFIG_MAIN",
              desc: "Catch2 macro that generates main function for tests",
            },
            {
              label: "TEST_CASE(name, tags)",
              desc: "Define individual test case with optional tag categories",
            },
            {
              label: "SECTION(name)",
              desc: "Organize test code into logical sections within TEST_CASE",
            },
            {
              label: "REQUIRE(condition)",
              desc: "Assert that condition is true, fail test if false",
            },
            {
              label: "find_package(Catch2)",
              desc: "Locate Catch2 testing framework for linking",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">
          Docker Deployment & Production Setup
        </h3>
        <CodeExplanation
          code={`# Dockerfile
FROM ubuntu:22.04

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \\
    build-essential \\
    cmake \\
    libssl-dev \\
    libsqlite3-dev \\
    curl \\
    && rm -rf /var/lib/apt/lists/*

# Copy source code
COPY . .

# Build application
RUN mkdir build && cd build && \\
    cmake .. && \\
    make -j$(nproc)

# Create non-root user
RUN useradd -m -u 1000 appuser && \\
    chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \\
    CMD curl -f http://localhost:8080/health || exit 1

# Run application
CMD ["/app/build/crow_app"]

# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - JWT_SECRET=your-secret-key
      - DATABASE_PATH=/app/data/app.db
    volumes:
      - ./data:/app/data
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: unless-stopped

volumes:
  data:

# CMakeLists.txt for production build
cmake_minimum_required(VERSION 3.10)
project(crow_app_prod)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_FLAGS_RELEASE "-O3 -march=native -DNDEBUG")

include_directories(${CMAKE_CURRENT_SOURCE_DIR}/crow/include)

link_directories(/usr/lib/x86_64-linux-gnu)

add_executable(crow_app 
    src/main.cpp
    src/database.cpp
    src/auth.cpp
)

target_link_libraries(crow_app
    ssl
    crypto
    sqlite3
    pthread
)

set_property(TARGET crow_app PROPERTY INTERPROCEDURAL_OPTIMIZATION TRUE)

# main.cpp with production setup
#include "crow_all.h"
#include <iostream>
#include <cstdlib>

int main() {
    crow::SimpleApp app;

    // Health check endpoint
    CROW_ROUTE(app, "/health")
    ([]() {
        crow::json::wvalue response;
        response["status"] = "healthy";
        return crow::response(response);
    });

    CROW_ROUTE(app, "/metrics")
    ([]() {
        crow::json::wvalue response;
        response["uptime"] = 12345;
        response["requests"] = 1000;
        return crow::response(response);
    });

    // Get configuration from environment
    const char* port_str = std::getenv("PORT");
    int port = port_str ? std::stoi(port_str) : 8080;
    
    const char* threads_str = std::getenv("WORKER_THREADS");
    int threads = threads_str ? std::stoi(threads_str) : 4;

    CROW_LOG_INFO << "Starting server on port " << port;
    CROW_LOG_INFO << "Worker threads: " << threads;

    app.port(port).concurrency(threads).run();
    return 0;
}`}
          explanation={[
            {
              label: "FROM ubuntu:22.04",
              desc: "Base image with essential build tools pre-installed",
            },
            {
              label: "RUN useradd appuser",
              desc: "Create non-root user for security best practices",
            },
            {
              label: "HEALTHCHECK",
              desc: "Container health monitoring for orchestration systems",
            },
            {
              label: "-O3 -march=native",
              desc: "Compiler flags for aggressive optimization in production",
            },
            {
              label: "std::getenv()",
              desc: "Read environment variables for runtime configuration",
            },
          ]}
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">Production Tips</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>
            • Run <code className="bg-white px-1 rounded">cmake . && make</code>{" "}
            with release flags for optimization
          </li>
          <li>• Use Docker multi-stage builds to reduce image size</li>
          <li>• Implement proper logging with structured formats</li>
          <li>• Add monitoring endpoints for health and metrics</li>
          <li>• Use reverse proxy (Nginx) for SSL termination</li>
          <li>• Implement rate limiting and request validation</li>
        </ul>
      </div>
    </div>
  ),
};
