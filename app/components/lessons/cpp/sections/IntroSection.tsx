import React from "react";
import { Code } from "lucide-react";

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

export const IntroSection = {
  id: "intro",
  title: "Modern C++ & Crow Framework Setup",
  icon: Code,
  overview:
    "Get started with modern C++ development using the Crow framework for building high-performance web applications.",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">What is Crow Framework?</h3>
        <p className="text-gray-700 mb-3">
          Crow is a modern C++ web framework designed for building REST APIs
          with minimal overhead. It provides a clean, intuitive interface
          inspired by Flask while leveraging C++&apos;s performance
          capabilities.
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
          <li>
            <strong>Header-only library:</strong> Easy integration with minimal
            dependencies
          </li>
          <li>
            <strong>High performance:</strong> Comparable to Go and Rust
            frameworks
          </li>
          <li>
            <strong>Simple routing:</strong> Intuitive endpoint definition and
            handling
          </li>
          <li>
            <strong>Built-in features:</strong> JSON support, middleware,
            WebSocket support
          </li>
          <li>
            <strong>Cross-platform:</strong> Works on Linux, macOS, and Windows
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">
          Setting Up Your First Crow Application
        </h3>
        <CodeExplanation
          code={`// CMakeLists.txt
cmake_minimum_required(VERSION 3.10)
project(crow_app)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

// Include Crow header-only library
include_directories(\${CMAKE_CURRENT_SOURCE_DIR}/crow/include)

add_executable(crow_app main.cpp)

// main.cpp
#include "crow_all.h"
#include <iostream>
#include <chrono>

int main() {
    crow::SimpleApp app;

    // GET /
    CROW_ROUTE(app, "/")
    ([]() {
        return "Hello, World!";
    });

    // GET /hello
    CROW_ROUTE(app, "/hello")
    ([]() {
        auto response = crow::response();
        response.set_header("Content-Type", "application/json");
        response.body = R"({"message":"Hello from Crow!","timestamp":")" + 
                       std::to_string(std::chrono::system_clock::now().time_since_epoch().count()) + 
                       R"("})";
        return response;
    });

    // GET /hello/<n>
    CROW_ROUTE(app, "/hello/<string>")
    ([](std::string name) {
        auto response = crow::response();
        response.set_header("Content-Type", "application/json");
        response.body = R"({"message":"Hello, )" + name + R"(!","name":")" + name + R"("})";
        return response;
    });

    // POST /hello
    CROW_ROUTE(app, "/hello").methods("POST"_method)
    ([](const crow::request& req) {
        auto json_data = crow::json::load(req.body);
        if (!json_data) {
            return crow::response(400, "Invalid JSON");
        }
        
        std::string name = json_data["name"].s();
        auto response = crow::response();
        response.set_header("Content-Type", "application/json");
        response.body = R"({"greeting":"Hello, )" + name + R"(!","received":")" + name + R"("})";
        return response;
    });

    app.port(8080).multithreaded().run();
    return 0;
}`}
          explanation={[
            {
              label: "crow::SimpleApp",
              desc: "Main Crow application instance for defining routes and handlers",
            },
            {
              label: "CROW_ROUTE(app, path)",
              desc: "Macro for defining HTTP route handlers with path patterns",
            },
            {
              label: "crow::response()",
              desc: "Create HTTP responses with custom headers and body content",
            },
            {
              label: "crow::json::load()",
              desc: "Parse JSON from request body for data extraction",
            },
            {
              label: ".multithreaded().run()",
              desc: "Enable multithreading and start the server on specified port",
            },
          ]}
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">Quick Start</h4>
        <p className="text-sm text-green-800">
          Compile with{" "}
          <code className="bg-white px-2 py-1 rounded">cmake . && make</code>,
          then run{" "}
          <code className="bg-white px-2 py-1 rounded">./crow_app</code>. Visit{" "}
          <code className="bg-white px-2 py-1 rounded">
            http://localhost:8080/hello
          </code>
        </p>
      </div>
    </div>
  ),
};
