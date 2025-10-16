import { LessonData } from "../types";

const lesson: LessonData = {
  title: "Testing & Deployment for C++",
  difficulty: "Advanced",
  description:
    "Comprehensive testing strategies and deployment practices for C++ web applications",
  objectives: [
    "Set up Google Test framework for unit testing",
    "Write integration tests for API endpoints",
    "Implement performance benchmarking",
    "Create Docker containers for deployment",
    "Set up CI/CD pipelines for C++ projects",
  ],
  content: `# Testing & Deployment for C++ Applications

Modern C++ development requires comprehensive testing and reliable deployment strategies.

## Testing Framework Setup

Add Google Test to CMakeLists.txt:
\`\`\`cmake
# Google Test
find_package(GTest REQUIRED)
include(GoogleTest)

# Test executable
add_executable(tests
    tests/test_main.cpp
    tests/test_user.cpp
    tests/test_database.cpp
    tests/test_api.cpp
)

target_link_libraries(tests
    PRIVATE
    GTest::gtest
    GTest::gtest_main
    # Your application libraries
)

# Enable testing
enable_testing()
gtest_discover_tests(tests)
\`\`\`

## Unit Testing

Create \`tests/test_user.cpp\`:
\`\`\`cpp
#include <gtest/gtest.h>
#include "models/User.h"
#include "auth/PasswordManager.h"

class UserTest : public ::testing::Test {
protected:
    void SetUp() override {
        // Set up test data
    }
    
    void TearDown() override {
        // Clean up
    }
};

TEST_F(UserTest, ValidUserCreation) {
    User user("testuser", "test@example.com", "hashed_password");
    
    EXPECT_EQ(user.username, "testuser");
    EXPECT_EQ(user.email, "test@example.com");
    EXPECT_TRUE(user.is_active);
}

TEST_F(UserTest, UserValidation) {
    User valid_user("validuser", "valid@example.com", "password123");
    EXPECT_TRUE(valid_user.isValid());
    
    User invalid_user("", "invalid-email", "");
    EXPECT_FALSE(invalid_user.isValid());
}

TEST_F(UserTest, PasswordHashing) {
    std::string password = "TestPassword123!";
    std::string hash = PasswordManager::hashPassword(password);
    
    EXPECT_NE(password, hash);
    EXPECT_TRUE(PasswordManager::verifyPassword(password, hash));
    EXPECT_FALSE(PasswordManager::verifyPassword("wrong_password", hash));
}

TEST_F(UserTest, PasswordStrengthValidation) {
    EXPECT_TRUE(PasswordManager::isSecurePassword("ValidPass123!"));
    EXPECT_FALSE(PasswordManager::isSecurePassword("weak"));
    EXPECT_FALSE(PasswordManager::isSecurePassword("nouppercaseorno123!"));
    EXPECT_FALSE(PasswordManager::isSecurePassword("NOLOWERCASE123!"));
}
\`\`\`

## Integration Testing

Create \`tests/test_api.cpp\`:
\`\`\`cpp
#include <gtest/gtest.h>
#include <crow.h>
#include <thread>
#include <chrono>
#include <curl/curl.h>

class ApiIntegrationTest : public ::testing::Test {
protected:
    static void SetUpTestSuite() {
        // Start test server
        app_thread = std::thread([]() {
            crow::SimpleApp app;
            // Configure test routes
            app.port(8081).run();
        });
        
        // Wait for server to start
        std::this_thread::sleep_for(std::chrono::seconds(1));
    }
    
    static void TearDownTestSuite() {
        // Stop test server
        if (app_thread.joinable()) {
            app_thread.join();
        }
    }
    
    void SetUp() override {
        // Initialize database with test data
        test_db = std::make_unique<Database>(":memory:");
        test_db->initialize();
    }
    
private:
    static std::thread app_thread;
    std::unique_ptr<Database> test_db;
    
    // Helper function to make HTTP requests
    std::string makeRequest(const std::string& url, const std::string& method = "GET", 
                           const std::string& data = "") {
        CURL* curl = curl_easy_init();
        std::string response;
        
        if (curl) {
            curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
            curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
            curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
            
            if (method == "POST") {
                curl_easy_setopt(curl, CURLOPT_POST, 1L);
                curl_easy_setopt(curl, CURLOPT_POSTFIELDS, data.c_str());
            }
            
            curl_easy_perform(curl);
            curl_easy_cleanup(curl);
        }
        
        return response;
    }
    
    static size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* userp) {
        size_t totalSize = size * nmemb;
        userp->append((char*)contents, totalSize);
        return totalSize;
    }
};

std::thread ApiIntegrationTest::app_thread;

TEST_F(ApiIntegrationTest, HealthEndpoint) {
    std::string response = makeRequest("http://localhost:8081/health");
    EXPECT_FALSE(response.empty());
    
    auto json_response = nlohmann::json::parse(response);
    EXPECT_EQ(json_response["status"], "healthy");
}

TEST_F(ApiIntegrationTest, UserRegistration) {
    nlohmann::json user_data = {
        {"username", "testuser"},
        {"email", "test@example.com"},
        {"password", "TestPass123!"}
    };
    
    std::string response = makeRequest(
        "http://localhost:8081/api/v1/auth/register", 
        "POST", 
        user_data.dump()
    );
    
    auto json_response = nlohmann::json::parse(response);
    EXPECT_TRUE(json_response["success"]);
    EXPECT_FALSE(json_response["data"]["token"].empty());
}
\`\`\`

## Performance Benchmarking

Create \`benchmarks/api_benchmark.cpp\`:
\`\`\`cpp
#include <benchmark/benchmark.h>
#include "database/Database.h"
#include "models/User.h"

static void BM_UserCreation(benchmark::State& state) {
    Database db(":memory:");
    db.initialize();
    
    for (auto _ : state) {
        User user("testuser", "test@example.com", "hashed_password");
        benchmark::DoNotOptimize(db.createUser(user));
    }
}
BENCHMARK(BM_UserCreation);

static void BM_PasswordHashing(benchmark::State& state) {
    std::string password = "TestPassword123!";
    
    for (auto _ : state) {
        std::string hash = PasswordManager::hashPassword(password);
        benchmark::DoNotOptimize(hash);
    }
}
BENCHMARK(BM_PasswordHashing);

static void BM_JwtGeneration(benchmark::State& state) {
    JwtManager jwt_manager("test_secret");
    User user("testuser", "test@example.com", "hashed_password");
    user.id = 1;
    
    for (auto _ : state) {
        std::string token = jwt_manager.generateToken(user);
        benchmark::DoNotOptimize(token);
    }
}
BENCHMARK(BM_JwtGeneration);

BENCHMARK_MAIN();
\`\`\`

## Docker Deployment

Create \`Dockerfile\`:
\`\`\`dockerfile
# Multi-stage build for C++ application
FROM ubuntu:22.04 AS builder

# Install dependencies
RUN apt-get update && apt-get install -y \\
    build-essential \\
    cmake \\
    git \\
    libssl-dev \\
    libsqlite3-dev \\
    libcurl4-openssl-dev \\
    pkg-config

WORKDIR /app
COPY . .

# Build application
RUN mkdir build && cd build \\
    && cmake -DCMAKE_BUILD_TYPE=Release .. \\
    && make -j$(nproc)

# Runtime image
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \\
    libssl3 \\
    libsqlite3-0 \\
    libcurl4 \\
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app
COPY --from=builder /app/build/MyCppServer ./
COPY --from=builder /app/config ./config

# Change ownership
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8080

CMD ["./MyCppServer"]
\`\`\`

## CI/CD Pipeline

Create \`.github/workflows/ci.yml\`:
\`\`\`yaml
name: C++ CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        compiler: [gcc-11, clang-14]
        build_type: [Debug, Release]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Install dependencies
      run: |
        sudo apt-get update
        sudo apt-get install -y cmake libssl-dev libsqlite3-dev libgtest-dev libcurl4-openssl-dev
        
    - name: Install Google Test
      run: |
        cd /usr/src/gtest
        sudo cmake CMakeLists.txt
        sudo make
        sudo cp lib/*.a /usr/lib
        
    - name: Configure CMake
      run: |
        cmake -B build -DCMAKE_BUILD_TYPE=\${{ matrix.build_type }}
        
    - name: Build
      run: cmake --build build --config \${{ matrix.build_type }}
      
    - name: Test
      run: |
        cd build
        ctest --output-on-failure
        
    - name: Run benchmarks
      if: matrix.build_type == 'Release'
      run: |
        cd build
        ./benchmarks --benchmark_format=json > benchmark_results.json
        
  docker:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Docker image
      run: |
        docker build -t my-cpp-server:latest .
        
    - name: Test Docker image
      run: |
        docker run -d -p 8080:8080 --name test-container my-cpp-server:latest
        sleep 5
        curl -f http://localhost:8080/health || exit 1
        docker stop test-container
\`\`\``,
  practiceInstructions: [
    "Set up Google Test framework and write unit tests",
    "Create integration tests for all API endpoints",
    "Implement performance benchmarks with Google Benchmark",
    "Create a multi-stage Docker build",
    "Set up CI/CD pipeline with automated testing",
    "Deploy to a cloud platform with proper monitoring",
  ],
  hints: [
    "Use in-memory SQLite for faster test execution",
    "Mock external dependencies in unit tests",
    "Test both success and failure scenarios",
    "Use separate test databases to avoid conflicts",
    "Measure and track performance regression over time",
  ],
  solution: `// Complete testing setup with mocking and comprehensive coverage

#include <gmock/gmock.h>
#include <gtest/gtest.h>

// Mock database for unit testing
class MockDatabase : public Database {
public:
    MOCK_METHOD(std::optional<User>, createUser, (const User& user), (override));
    MOCK_METHOD(std::optional<User>, getUserById, (int id), (override));
    MOCK_METHOD(std::optional<User>, getUserByUsername, (const std::string& username), (override));
    MOCK_METHOD(std::vector<User>, getAllUsers, (), (override));
    MOCK_METHOD(bool, updateUser, (const User& user), (override));
    MOCK_METHOD(bool, deleteUser, (int id), (override));
};

// Test fixture with mock
class AuthControllerTest : public ::testing::Test {
protected:
    void SetUp() override {
        mock_db = std::make_shared<MockDatabase>();
        auth_controller = std::make_unique<AuthController>(mock_db, "test_secret");
    }
    
    std::shared_ptr<MockDatabase> mock_db;
    std::unique_ptr<AuthController> auth_controller;
};

TEST_F(AuthControllerTest, LoginSuccess) {
    User test_user;
    test_user.id = 1;
    test_user.username = "testuser";
    test_user.password_hash = PasswordManager::hashPassword("password123");
    test_user.is_active = true;
    
    EXPECT_CALL(*mock_db, getUserByUsername("testuser"))
        .WillOnce(::testing::Return(test_user));
    
    crow::request req;
    req.body = R"({"username":"testuser","password":"password123"})";
    
    auto response = auth_controller->login(req);
    EXPECT_EQ(response.code, 200);
}

// Memory leak detection
class MemoryLeakTest : public ::testing::Test {
protected:
    void SetUp() override {
        initial_memory = getCurrentMemoryUsage();
    }
    
    void TearDown() override {
        size_t final_memory = getCurrentMemoryUsage();
        EXPECT_LT(final_memory - initial_memory, 1024 * 1024); // Less than 1MB leak
    }
    
private:
    size_t initial_memory;
    
    size_t getCurrentMemoryUsage() {
        // Implementation to get current memory usage
        return 0; // Placeholder
    }
};`,
};

export default lesson;
