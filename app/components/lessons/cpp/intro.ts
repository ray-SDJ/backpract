import { LessonData } from "../types";

const lesson: LessonData = {
  title: "Modern C++ & Crow Framework Setup",
  difficulty: "Intermediate",
  description:
    "Set up a modern C++ development environment and create your first web server using the Crow framework",
  objectives: [
    "Install modern C++ compiler and build tools",
    "Set up CMake build system for C++ projects",
    "Create a basic HTTP server with Crow framework",
    "Understand modern C++ features (C++17/20)",
    "Learn C++ package management with Conan or vcpkg",
  ],
  content: `# Modern C++ & Crow Framework Setup

C++ remains one of the most powerful languages for systems programming and high-performance applications. With modern C++ (C++17/20) and frameworks like Crow, we can build efficient web servers.

## Prerequisites

Install a modern C++ compiler and build tools:

### On Ubuntu/Debian:
\`\`\`bash
sudo apt update
sudo apt install build-essential cmake git
sudo apt install g++-10 clang-12
\`\`\`

### On macOS:
\`\`\`bash
brew install cmake git
xcode-select --install
\`\`\`

### On Windows:
- Install Visual Studio 2019/2022 with C++ workload
- Install CMake from https://cmake.org/

## Project Setup

Create a new C++ project structure:
\`\`\`bash
mkdir my-cpp-server
cd my-cpp-server
mkdir src include tests
\`\`\`

Create CMakeLists.txt:
\`\`\`cmake
cmake_minimum_required(VERSION 3.16)
project(MyCppServer VERSION 1.0)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find packages
find_package(Threads REQUIRED)

# Include directories
include_directories(include)

# Add executable
add_executable(\${PROJECT_NAME} src/main.cpp)

# Link libraries
target_link_libraries(\${PROJECT_NAME} PRIVATE Threads::Threads)

# Compiler-specific options
if(MSVC)
    target_compile_options(\${PROJECT_NAME} PRIVATE /W4)
else()
    target_compile_options(\${PROJECT_NAME} PRIVATE -Wall -Wextra -Wpedantic)
endif()
\`\`\`

## Installing Crow Framework

### Method 1: Using vcpkg (Recommended)
\`\`\`bash
git clone https://github.com/Microsoft/vcpkg.git
cd vcpkg
./bootstrap-vcpkg.sh  # On Windows: .\\bootstrap-vcpkg.bat
./vcpkg install crow[ssl]
\`\`\`

### Method 2: Manual Installation
\`\`\`bash
git clone https://github.com/CrowCpp/Crow.git
cd Crow
mkdir build
cd build
cmake .. -DCROW_BUILD_EXAMPLES=OFF
make -j4
sudo make install
\`\`\`

## Basic Crow Server Implementation

Create \`src/main.cpp\`:
\`\`\`cpp
#include <crow.h>
#include <nlohmann/json.hpp>
#include <iostream>
#include <chrono>
#include <iomanip>
#include <sstream>

using json = nlohmann::json;

// Utility function to get current timestamp
std::string getCurrentTimestamp() {
    auto now = std::chrono::system_clock::now();
    auto time_t = std::chrono::system_clock::to_time_t(now);
    std::stringstream ss;
    ss << std::put_time(std::gmtime(&time_t), "%Y-%m-%dT%H:%M:%SZ");
    return ss.str();
}

int main() {
    crow::SimpleApp app;

    // Health check endpoint
    CROW_ROUTE(app, "/health").methods("GET"_method)
    ([](const crow::request& req) {
        json response = {
            {"status", "OK"},
            {"timestamp", getCurrentTimestamp()},
            {"version", "1.0.0"},
            {"service", "C++ Crow Server"}
        };
        
        crow::response res(200);
        res.set_header("Content-Type", "application/json");
        res.write(response.dump(2));
        return res;
    });

    // API info endpoint
    CROW_ROUTE(app, "/api/info").methods("GET"_method)
    ([](const crow::request& req) {
        json response = {
            {"name", "My C++ Server"},
            {"framework", "Crow"},
            {"language", "C++17"},
            {"description", "High-performance web server built with modern C++"},
            {"features", {"Fast routing", "JSON support", "Middleware", "Threading"}}
        };
        
        crow::response res(200);
        res.set_header("Content-Type", "application/json");
        res.write(response.dump(2));
        return res;
    });

    // Echo endpoint for testing
    CROW_ROUTE(app, "/api/echo").methods("POST"_method)
    ([](const crow::request& req) {
        try {
            auto body_json = json::parse(req.body);
            
            json response = {
                {"received", body_json},
                {"timestamp", getCurrentTimestamp()},
                {"method", "POST"},
                {"content_type", req.get_header_value("Content-Type")}
            };
            
            crow::response res(200);
            res.set_header("Content-Type", "application/json");
            res.write(response.dump(2));
            return res;
        } catch (const std::exception& e) {
            json error_response = {
                {"error", "Invalid JSON"},
                {"message", e.what()},
                {"timestamp", getCurrentTimestamp()}
            };
            
            crow::response res(400);
            res.set_header("Content-Type", "application/json");
            res.write(error_response.dump(2));
            return res;
        }
    });

    // CORS middleware for development
    app.get_middleware<crow::CORSHandler>().global()
        .headers("Content-Type", "Authorization")
        .methods("GET"_method, "POST"_method, "PUT"_method, "DELETE"_method)
        .origin("*");

    // Configure server
    app.port(8080)
       .multithreaded(4)  // Use 4 threads
       .run();

    return 0;
}
\`\`\`

## Updated CMakeLists.txt with Dependencies

\`\`\`cmake
cmake_minimum_required(VERSION 3.16)
project(MyCppServer VERSION 1.0)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find required packages
find_package(Threads REQUIRED)
find_package(PkgConfig REQUIRED)

# Find Crow
find_package(Crow REQUIRED)

# Find nlohmann_json
find_package(nlohmann_json 3.2.0 REQUIRED)

# Include directories
include_directories(include)

# Add executable
add_executable(\${PROJECT_NAME} src/main.cpp)

# Link libraries
target_link_libraries(\${PROJECT_NAME} 
    PRIVATE 
    Crow::Crow
    nlohmann_json::nlohmann_json
    Threads::Threads
)

# Compiler-specific options
if(MSVC)
    target_compile_options(\${PROJECT_NAME} PRIVATE /W4 /std:c++17)
else()
    target_compile_options(\${PROJECT_NAME} PRIVATE -Wall -Wextra -Wpedantic -O2)
endif()

# Add debug symbols for development
set(CMAKE_BUILD_TYPE Debug)
\`\`\`

## Building and Running

\`\`\`bash
mkdir build && cd build
cmake ..
make -j4  # On Windows: cmake --build . --config Release
./MyCppServer  # On Windows: .\\MyCppServer.exe
\`\`\`

## Modern C++ Features Used

- **Auto keyword**: Type deduction for cleaner code
- **Lambda functions**: Inline route handlers
- **Smart pointers**: Automatic memory management
- **Range-based for loops**: Cleaner iteration
- **Structured bindings**: Multiple return values
- **std::chrono**: Modern time handling
- **constexpr**: Compile-time evaluation`,
  practiceInstructions: [
    "Set up the development environment with C++17 support",
    "Install Crow framework using vcpkg or manual compilation",
    "Create the basic project structure with CMake",
    "Implement the health check and info endpoints",
    "Test the server with curl or Postman",
    "Add proper error handling and logging",
  ],
  hints: [
    "Use modern C++ features like auto, lambda, and smart pointers",
    "CMake is the standard build system for C++ projects",
    "Crow supports multithreading out of the box",
    "nlohmann/json library makes JSON handling much easier",
    "Always handle exceptions in web request handlers",
  ],
  solution: `// Complete modern C++ Crow server with error handling and logging

#include <crow.h>
#include <nlohmann/json.hpp>
#include <iostream>
#include <chrono>
#include <iomanip>
#include <sstream>
#include <fstream>
#include <memory>

using json = nlohmann::json;

// Custom logger class
class Logger {
public:
    enum Level { DEBUG, INFO, WARN, ERROR };
    
    static void log(Level level, const std::string& message) {
        auto now = std::chrono::system_clock::now();
        auto time_t = std::chrono::system_clock::to_time_t(now);
        
        std::cout << "[" << std::put_time(std::localtime(&time_t), "%Y-%m-%d %H:%M:%S") 
                  << "] [" << levelToString(level) << "] " << message << std::endl;
    }
    
private:
    static std::string levelToString(Level level) {
        switch(level) {
            case DEBUG: return "DEBUG";
            case INFO:  return "INFO";
            case WARN:  return "WARN";
            case ERROR: return "ERROR";
            default:    return "UNKNOWN";
        }
    }
};

// Application configuration
struct Config {
    int port = 8080;
    int threads = 4;
    bool enable_cors = true;
    std::string log_level = "INFO";
};

// Response helper
class ResponseHelper {
public:
    static crow::response jsonResponse(int status_code, const json& data) {
        crow::response res(status_code);
        res.set_header("Content-Type", "application/json");
        res.write(data.dump(2));
        return res;
    }
    
    static crow::response errorResponse(int status_code, const std::string& message) {
        json error = {
            {"error", true},
            {"message", message},
            {"timestamp", getCurrentTimestamp()},
            {"status_code", status_code}
        };
        return jsonResponse(status_code, error);
    }
    
private:
    static std::string getCurrentTimestamp() {
        auto now = std::chrono::system_clock::now();
        auto time_t = std::chrono::system_clock::to_time_t(now);
        std::stringstream ss;
        ss << std::put_time(std::gmtime(&time_t), "%Y-%m-%dT%H:%M:%SZ");
        return ss.str();
    }
};

int main() {
    Logger::log(Logger::INFO, "Starting C++ Crow Server...");
    
    Config config;
    crow::SimpleApp app;
    
    // Middleware for logging requests
    struct LoggingMiddleware : crow::ILocalMiddleware {
        void before_handle(crow::request& req, crow::response& res, context& ctx) override {
            Logger::log(Logger::INFO, 
                "Request: " + req.method_string() + " " + req.url + 
                " from " + req.get_header_value("User-Agent"));
        }
        
        void after_handle(crow::request& req, crow::response& res, context& ctx) override {
            Logger::log(Logger::INFO, 
                "Response: " + std::to_string(res.code) + " for " + req.url);
        }
        
        struct context {};
    };
    
    // Enable CORS if configured
    if (config.enable_cors) {
        app.get_middleware<crow::CORSHandler>().global()
            .headers("Content-Type", "Authorization", "X-Requested-With")
            .methods("GET"_method, "POST"_method, "PUT"_method, "DELETE"_method, "OPTIONS"_method)
            .origin("*");
    }
    
    // Health check endpoint
    CROW_ROUTE(app, "/health").methods("GET"_method)
    ([](const crow::request& req) -> crow::response {
        try {
            json response = {
                {"status", "healthy"},
                {"timestamp", ResponseHelper::getCurrentTimestamp()},
                {"version", "1.0.0"},
                {"service", "C++ Crow Server"},
                {"uptime", "TODO: implement uptime tracking"}
            };
            return ResponseHelper::jsonResponse(200, response);
        } catch (const std::exception& e) {
            Logger::log(Logger::ERROR, "Health check failed: " + std::string(e.what()));
            return ResponseHelper::errorResponse(500, "Internal server error");
        }
    });
    
    // Start server
    Logger::log(Logger::INFO, 
        "Server starting on port " + std::to_string(config.port) + 
        " with " + std::to_string(config.threads) + " threads");
    
    app.port(config.port)
       .multithreaded(config.threads)
       .run();
    
    return 0;
}`,
};

export default lesson;
