import { LessonData } from "../types";

const intro: LessonData = {
  title: "Modern C++ & Crow Framework Setup",
  difficulty: "Intermediate",
  description:
    "Set up a modern C++ development environment and create your first web server using the Crow framework for high-performance backend applications.",
  objectives: [
    "Install modern C++ compiler and CMake build system",
    "Set up Crow framework for web development",
    "Create your first HTTP server with routing",
    "Understand modern C++ features and best practices",
    "Configure development environment and build tools",
  ],
  content: `<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8 text-white">
          <h1 class="text-3xl font-bold mb-2">Modern C++ & Crow Framework Setup</h1>
          <p class="text-purple-100 text-lg">Set up a high-performance C++ web development environment with Crow framework</p>
        </div>

        <!-- Main Content -->
        <div class="p-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Content Column -->
            <div class="lg:col-span-2 space-y-8">
              
              <section class="bg-blue-50 rounded-lg p-6">
                <h2 class="text-2xl font-semibold text-blue-800 mb-4 flex items-center">
                  <span class="bg-blue-200 w-8 h-8 rounded-full flex items-center justify-center text-blue-800 font-bold mr-3">1</span>
                  Development Environment Setup
                </h2>
                <div class="bg-white rounded-lg p-4 mb-4">
                  <h3 class="text-lg font-semibold text-gray-800 mb-3">Modern C++ Toolchain</h3>
                  <p class="text-gray-700 mb-4">C++ remains one of the most powerful languages for high-performance applications. With modern C++ (C++17/20) and frameworks like Crow, we can build extremely efficient web servers.</p>
                  <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-4">
                      <h4 class="font-medium text-gray-700 mb-2">Ubuntu/Debian Setup</h4>
                      <pre class="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto"><code># Install essential build tools
sudo apt update
sudo apt install build-essential cmake git pkg-config
sudo apt install gcc-11 g++-11 clang-12
sudo apt install libboost-all-dev

# macOS setup (with Homebrew)
brew install cmake boost pkg-config
xcode-select --install

# Install vcpkg package manager
git clone https://github.com/Microsoft/vcpkg.git
cd vcpkg
./bootstrap-vcpkg.sh
./vcpkg integrate install

# Install Crow framework
./vcpkg install crow</code></pre>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <h4 class="font-medium text-gray-700 mb-2">CMakeLists.txt Configuration</h4>
                      <pre class="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto"><code>cmake_minimum_required(VERSION 3.15)
project(CrowApp)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Crow CONFIG REQUIRED)
find_package(Threads REQUIRED)

add_executable(crow_app main.cpp)
target_link_libraries(crow_app Crow::Crow Threads::Threads)</code></pre>
                    </div>
                  </div>
                </div>
              </section>

              <section class="bg-green-50 rounded-lg p-6">
                <h2 class="text-2xl font-semibold text-green-800 mb-4 flex items-center">
                  <span class="bg-green-200 w-8 h-8 rounded-full flex items-center justify-center text-green-800 font-bold mr-3">2</span>
                  First Crow Web Server
                </h2>
                <div class="bg-white rounded-lg p-4 mb-4">
                  <h3 class="text-lg font-semibold text-gray-800 mb-3">Modern C++ Server Implementation</h3>
                  <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-4">
                      <h4 class="font-medium text-gray-700 mb-2">main.cpp - Complete Server Setup</h4>
                      <pre class="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto"><code>#include "crow.h"
#include &lt;memory&gt;
#include &lt;string&gt;
#include &lt;chrono&gt;

class WebServer {
private:
    crow::SimpleApp app;
    
public:
    WebServer() {
        setupRoutes();
    }
    
    void setupRoutes() {
        // Health check endpoint
        CROW_ROUTE(app, "/health")
        ([]() {
            crow::json::wvalue response;
            response["status"] = "healthy";
            response["timestamp"] = getCurrentTimestamp();
            response["version"] = "1.0.0";
            return response;
        });
        
        // API root endpoint
        CROW_ROUTE(app, "/api")
        ([]() {
            crow::json::wvalue response;
            response["message"] = "Welcome to Crow C++ API";
            response["framework"] = "Crow";
            response["language"] = "C++17";
            return response;
        });
        
        // POST endpoint with JSON body
        CROW_ROUTE(app, "/api/users").methods("POST"_method)
        ([](const crow::request&amp; req) {
            try {
                auto json_data = crow::json::load(req.body);
                if (!json_data) {
                    return crow::response(400, "Invalid JSON");
                }
                
                crow::json::wvalue response;
                response["id"] = generateUserId();
                response["name"] = json_data["name"].s();
                response["email"] = json_data["email"].s();
                response["created_at"] = getCurrentTimestamp();
                
                return crow::response(201, response);
            } catch (const std::exception&amp; e) {
                return crow::response(500, "Internal server error");
            }
        });
    }
    
    void run() {
        app.port(8080).multithreaded().run();
    }

private:
    std::string getCurrentTimestamp() {
        auto now = std::chrono::system_clock::now();
        auto time_t = std::chrono::system_clock::to_time_t(now);
        return std::to_string(time_t);
    }
    
    int generateUserId() {
        static int counter = 1000;
        return ++counter;
    }
};

int main() {
    WebServer server;
    std::cout << "Starting Crow server on port 8080..." << std::endl;
    server.run();
    return 0;
}</code></pre>
                    </div>
                  </div>
                </div>
              </section>

              <section class="bg-yellow-50 rounded-lg p-6">
                <h2 class="text-2xl font-semibold text-yellow-800 mb-4 flex items-center">
                  <span class="bg-yellow-200 w-8 h-8 rounded-full flex items-center justify-center text-yellow-800 font-bold mr-3">3</span>
                  Building & Testing
                </h2>
                <div class="bg-white rounded-lg p-4 mb-4">
                  <h3 class="text-lg font-semibold text-gray-800 mb-3">Build and Performance Testing</h3>
                  <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-4">
                      <h4 class="font-medium text-gray-700 mb-2">Build & Run Commands</h4>
                      <pre class="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto"><code># Create build directory
mkdir build && cd build

# Configure with CMake
cmake .. -DCMAKE_TOOLCHAIN_FILE=[path to vcpkg]/scripts/buildsystems/vcpkg.cmake

# Build the application
make -j$(nproc)

# Run the server
./crow_app</code></pre>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <h4 class="font-medium text-gray-700 mb-2">API Testing Commands</h4>
                      <pre class="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto"><code># Test health endpoint
curl http://localhost:8080/health

# Test API root
curl http://localhost:8080/api

# Test user creation
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'

# Performance testing with Apache Bench
ab -n 10000 -c 100 http://localhost:8080/api</code></pre>
                    </div>
                  </div>
                </div>
              </section>

            </div>

            <!-- Sidebar -->
            <div class="lg:col-span-1 space-y-6">
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">🚀 Performance Benefits</h3>
                <ul class="space-y-3 text-sm text-gray-600">
                  <li class="flex items-start">
                    <span class="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
                    <span>50,000+ requests per second with minimal memory usage</span>
                  </li>
                  <li class="flex items-start">
                    <span class="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
                    <span>Perfect for high-throughput microservices</span>
                  </li>
                  <li class="flex items-start">
                    <span class="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
                    <span>Ideal for performance-critical backend systems</span>
                  </li>
                </ul>
              </div>

              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">🛠️ Development Tools</h3>
                <ul class="space-y-3 text-sm text-gray-600">
                  <li class="flex items-start">
                    <span class="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">✓</span>
                    <span>CMake for cross-platform builds</span>
                  </li>
                  <li class="flex items-start">
                    <span class="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">✓</span>
                    <span>vcpkg for package management</span>
                  </li>
                  <li class="flex items-start">
                    <span class="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">✓</span>
                    <span>Modern C++17/20 features</span>
                  </li>
                </ul>
              </div>

              <div class="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-purple-800 mb-4">💡 Pro Tips</h3>
                <ul class="space-y-3 text-sm text-purple-700">
                  <li class="flex items-start">
                    <span class="text-purple-500 mr-2">•</span>
                    <span>Use smart pointers for memory management</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-purple-500 mr-2">•</span>
                    <span>Enable multithreading for better performance</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-purple-500 mr-2">•</span>
                    <span>Crow provides Flask-like syntax with C++ speed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Next Steps -->
          <div class="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">🎯 What You've Accomplished</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-700 mb-3">Environment Setup</h3>
                <ul class="space-y-2 text-gray-600">
                  <li>✅ Modern C++ toolchain installation</li>
                  <li>✅ Crow framework integration</li>
                  <li>✅ CMake build system configuration</li>
                  <li>✅ vcpkg package management</li>
                </ul>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-700 mb-3">Web Server Development</h3>
                <ul class="space-y-2 text-gray-600">
                  <li>✅ HTTP server with routing</li>
                  <li>✅ JSON API endpoints</li>
                  <li>✅ POST request handling</li>
                  <li>✅ Performance optimization</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>`,
  practiceInstructions: [
    "Install C++17 compiler and CMake build system",
    "Set up Crow framework using vcpkg package manager",
    "Create a basic HTTP server with health check endpoint",
    "Implement REST API endpoints with JSON responses",
    "Add error handling and middleware for CORS",
    "Test performance with curl and Apache Bench",
  ],
  hints: [
    "Use CMake for cross-platform C++ project management",
    "Enable C++17 standard for modern language features",
    "Crow provides Flask-like routing with C++ performance",
    "Use crow::json::wvalue for JSON response construction",
    "Enable multithreading for better performance",
  ],
  solution: `# Complete C++ Crow setup and basic server
mkdir cpp-server && cd cpp-server
git clone https://github.com/Microsoft/vcpkg.git
cd vcpkg && ./bootstrap-vcpkg.sh
./vcpkg install crow
cd .. && mkdir build && cd build
cmake .. && make
./crow_app`,
};

export default intro;