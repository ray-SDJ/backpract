import { LessonData } from "../types";

const testing: LessonData = {
  title: "Testing & Production Deployment",
  difficulty: "Advanced",
  description:
    "Implement comprehensive testing strategies with Google Test, set up production deployment with Docker, monitoring, and performance optimization for C++ applications.",
  objectives: [
    "Set up Google Test framework with C++ configuration",
    "Write unit tests for services and utilities",
    "Create integration tests for API endpoints",
    "Build production Docker containers and deployment pipelines",
    "Implement monitoring, logging, and performance optimization",
  ],
  content: `<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8 text-white">
          <h1 class="text-3xl font-bold mb-2">Testing & Production Deployment</h1>
          <p class="text-purple-100 text-lg">Master comprehensive testing with Google Test and production deployment strategies</p>
        </div>

        <!-- Main Content -->
        <div class="p-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Content Column -->
            <div class="lg:col-span-2 space-y-8">
              
              <section class="bg-blue-50 rounded-lg p-6">
                <h2 class="text-2xl font-semibold text-blue-800 mb-4 flex items-center">
                  <span class="bg-blue-200 w-8 h-8 rounded-full flex items-center justify-center text-blue-800 font-bold mr-3">1</span>
                  Testing Framework Setup
                </h2>
                <div class="bg-white rounded-lg p-4 mb-4">
                  <h3 class="text-lg font-semibold text-gray-800 mb-3">Google Test Configuration</h3>
                  <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-4">
                      <h4 class="font-medium text-gray-700 mb-2">CMakeLists.txt Testing Setup</h4>
                      <pre class="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto"><code># Enable testing and find Google Test
enable_testing()
find_package(GTest REQUIRED)

# Add test executable
add_executable(app_tests
    tests/test_main.cpp
    tests/test_database.cpp
    tests/test_api.cpp
    tests/test_auth.cpp
)

# Link test dependencies
target_link_libraries(app_tests
    PRIVATE
    GTest::gtest
    GTest::gtest_main
    SQLiteCpp
    jwt-cpp
    pthread
)

# Register tests with CTest
include(GoogleTest)
gtest_discover_tests(app_tests)</code></pre>
                    </div>
                  </div>
                </div>
              </section>

              <section class="bg-green-50 rounded-lg p-6">
                <h2 class="text-2xl font-semibold text-green-800 mb-4 flex items-center">
                  <span class="bg-green-200 w-8 h-8 rounded-full flex items-center justify-center text-green-800 font-bold mr-3">2</span>
                  Unit Testing Implementation
                </h2>
                <div class="bg-white rounded-lg p-4 mb-4">
                  <h3 class="text-lg font-semibold text-gray-800 mb-3">Database Testing with Mocks</h3>
                  <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-4">
                      <h4 class="font-medium text-gray-700 mb-2">test_database.cpp</h4>
                      <pre class="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto"><code>#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "../src/database.h"

class DatabaseTest : public ::testing::Test {
protected:
    void SetUp() override {
        // Use in-memory SQLite for testing
        db = std::make_unique<DatabaseManager>(":memory:");
        db->initialize();
    }
    
    std::unique_ptr<DatabaseManager> db;
};

TEST_F(DatabaseTest, CreateUser) {
    User user{"john_doe", "john@test.com", "hashed_password"};
    
    EXPECT_TRUE(db->createUser(user));
    
    auto retrieved = db->getUserByUsername("john_doe");
    ASSERT_TRUE(retrieved.has_value());
    EXPECT_EQ(retrieved->username, "john_doe");
    EXPECT_EQ(retrieved->email, "john@test.com");
}

TEST_F(DatabaseTest, DuplicateUserFails) {
    User user{"john_doe", "john@test.com", "password"};
    
    EXPECT_TRUE(db->createUser(user));
    EXPECT_FALSE(db->createUser(user)); // Should fail
}</code></pre>
                    </div>
                  </div>
                </div>
              </section>

              <section class="bg-yellow-50 rounded-lg p-6">
                <h2 class="text-2xl font-semibold text-yellow-800 mb-4 flex items-center">
                  <span class="bg-yellow-200 w-8 h-8 rounded-full flex items-center justify-center text-yellow-800 font-bold mr-3">3</span>
                  Integration Testing
                </h2>
                <div class="bg-white rounded-lg p-4 mb-4">
                  <h3 class="text-lg font-semibold text-gray-800 mb-3">API Endpoint Testing</h3>
                  <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-4">
                      <h4 class="font-medium text-gray-700 mb-2">test_api.cpp</h4>
                      <pre class="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto"><code>#include <gtest/gtest.h>
#include <crow.h>
#include <curl/curl.h>
#include "../src/app.h"

class APITest : public ::testing::Test {
protected:
    void SetUp() override {
        app = createApp(); // Factory function
        server_thread = std::thread([this]() {
            app.port(18080).multithreaded().run();
        });
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
    
    void TearDown() override {
        app.stop();
        if (server_thread.joinable()) {
            server_thread.join();
        }
    }
    
    crow::SimpleApp app;
    std::thread server_thread;
    const std::string base_url = "http://localhost:18080";
};

TEST_F(APITest, HealthCheck) {
    auto response = makeRequest("GET", base_url + "/health");
    
    EXPECT_EQ(response.status_code, 200);
    EXPECT_EQ(response.body, R"({"status":"healthy"})");
}

TEST_F(APITest, CreateUserEndpoint) {
    std::string user_data = R"({
        "username": "testuser",
        "email": "test@example.com",
        "password": "securepass123"
    })";
    
    auto response = makeRequest("POST", base_url + "/api/users", user_data);
    
    EXPECT_EQ(response.status_code, 201);
    // Parse JSON response and verify user creation
}</code></pre>
                    </div>
                  </div>
                </div>
              </section>

              <section class="bg-purple-50 rounded-lg p-6">
                <h2 class="text-2xl font-semibold text-purple-800 mb-4 flex items-center">
                  <span class="bg-purple-200 w-8 h-8 rounded-full flex items-center justify-center text-purple-800 font-bold mr-3">4</span>
                  Docker & Deployment
                </h2>
                <div class="bg-white rounded-lg p-4 mb-4">
                  <h3 class="text-lg font-semibold text-gray-800 mb-3">Production Dockerfile</h3>
                  <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-4">
                      <h4 class="font-medium text-gray-700 mb-2">Multi-stage Production Build</h4>
                      <pre class="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto"><code># Multi-stage build for optimized production image
FROM ubuntu:22.04 as builder

# Install build dependencies
RUN apt-get update && apt-get install -y \\
    build-essential \\
    cmake \\
    git \\
    pkg-config \\
    libsqlite3-dev \\
    libssl-dev \\
    curl \\
    zip \\
    unzip \\
    tar

# Install vcpkg
WORKDIR /opt
RUN git clone https://github.com/Microsoft/vcpkg.git
RUN ./vcpkg/bootstrap-vcpkg.sh

# Copy source and build
WORKDIR /app
COPY . .
RUN cmake -B build -S . -DCMAKE_TOOLCHAIN_FILE=/opt/vcpkg/scripts/buildsystems/vcpkg.cmake
RUN cmake --build build --config Release

# Production stage
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y \\
    libsqlite3-0 \\
    libssl3 \\
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app/build/myapp /app/
COPY --from=builder /app/config/ /app/config/

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:8080/health || exit 1

USER 1000:1000
CMD ["./myapp"]</code></pre>
                    </div>
                  </div>
                </div>
              </section>

              <section class="bg-red-50 rounded-lg p-6">
                <h2 class="text-2xl font-semibold text-red-800 mb-4 flex items-center">
                  <span class="bg-red-200 w-8 h-8 rounded-full flex items-center justify-center text-red-800 font-bold mr-3">5</span>
                  Monitoring & Performance
                </h2>
                <div class="bg-white rounded-lg p-4 mb-4">
                  <h3 class="text-lg font-semibold text-gray-800 mb-3">Production Monitoring Setup</h3>
                  <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-4">
                      <h4 class="font-medium text-gray-700 mb-2">Health Monitoring & Metrics</h4>
                      <pre class="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto"><code>#include <prometheus/exposer.h>
#include <prometheus/registry.h>
#include <prometheus/counter.h>
#include <prometheus/histogram.h>

class MetricsCollector {
private:
    std::shared_ptr<prometheus::Registry> registry;
    prometheus::Exposer exposer;
    
    prometheus::Family<prometheus::Counter>& request_counter;
    prometheus::Family<prometheus::Histogram>& response_time_histogram;
    
public:
    MetricsCollector() : 
        registry(std::make_shared<prometheus::Registry>()),
        exposer("0.0.0.0:9090"),
        request_counter(prometheus::BuildCounter()
            .Name("http_requests_total")
            .Help("Total HTTP requests")
            .Register(*registry)),
        response_time_histogram(prometheus::BuildHistogram()
            .Name("http_request_duration_seconds")
            .Help("HTTP request duration")
            .Register(*registry)) {
        
        exposer.RegisterCollectable(registry);
    }
    
    void recordRequest(const std::string& method, const std::string& endpoint) {
        request_counter.Add({{"method", method}, {"endpoint", endpoint}}).Increment();
    }
    
    void recordResponseTime(double duration_seconds) {
        response_time_histogram.Add({}).Observe(duration_seconds);
    }
};</code></pre>
                    </div>
                  </div>
                </div>
              </section>

            </div>

            <!-- Sidebar -->
            <div class="lg:col-span-1 space-y-6">
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">🧪 Testing Best Practices</h3>
                <ul class="space-y-3 text-sm text-gray-600">
                  <li class="flex items-start">
                    <span class="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
                    <span>Use in-memory databases for fast unit tests</span>
                  </li>
                  <li class="flex items-start">
                    <span class="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
                    <span>Mock external dependencies and services</span>
                  </li>
                  <li class="flex items-start">
                    <span class="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
                    <span>Test both success and failure scenarios</span>
                  </li>
                  <li class="flex items-start">
                    <span class="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">4</span>
                    <span>Use fixtures for consistent test data</span>
                  </li>
                </ul>
              </div>

              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">🚀 Deployment Checklist</h3>
                <ul class="space-y-3 text-sm text-gray-600">
                  <li class="flex items-start">
                    <span class="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">✓</span>
                    <span>Multi-stage Docker builds for size optimization</span>
                  </li>
                  <li class="flex items-start">
                    <span class="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">✓</span>
                    <span>Health checks and monitoring endpoints</span>
                  </li>
                  <li class="flex items-start">
                    <span class="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">✓</span>
                    <span>Security hardening and user permissions</span>
                  </li>
                  <li class="flex items-start">
                    <span class="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">✓</span>
                    <span>Metrics collection and alerting</span>
                  </li>
                </ul>
              </div>

              <div class="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-purple-800 mb-4">💡 Pro Tips</h3>
                <ul class="space-y-3 text-sm text-purple-700">
                  <li class="flex items-start">
                    <span class="text-purple-500 mr-2">•</span>
                    <span>Use separate test databases to avoid data conflicts</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-purple-500 mr-2">•</span>
                    <span>Implement circuit breakers for external service calls</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-purple-500 mr-2">•</span>
                    <span>Use Google Benchmark for performance testing</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-purple-500 mr-2">•</span>
                    <span>Set up automated testing in CI/CD pipelines</span>
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
                <h3 class="text-lg font-semibold text-gray-700 mb-3">Testing Mastery</h3>
                <ul class="space-y-2 text-gray-600">
                  <li>✅ Google Test framework integration</li>
                  <li>✅ Unit testing with mocks and fixtures</li>
                  <li>✅ Integration testing for API endpoints</li>
                  <li>✅ Performance benchmarking setup</li>
                </ul>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-700 mb-3">Production Deployment</h3>
                <ul class="space-y-2 text-gray-600">
                  <li>✅ Docker containerization strategy</li>
                  <li>✅ Health monitoring and metrics</li>
                  <li>✅ Security hardening practices</li>
                  <li>✅ CI/CD pipeline integration</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>`,
  practiceInstructions: [
    "Set up Google Test framework and write unit tests",
    "Create integration tests for all API endpoints",
    "Implement performance benchmarks with Google Benchmark",
    "Build Docker containers for production deployment",
    "Set up monitoring and logging infrastructure",
  ],
  hints: [
    "Use in-memory SQLite for faster test execution",
    "Mock external dependencies in unit tests",
    "Test both success and failure scenarios",
    "Use separate test databases to avoid conflicts",
    "Implement proper error handling in tests",
  ],
  solution: `// Complete testing setup with mocking and comprehensive coverage

#include <gmock/gmock.h>
#include <gtest/gtest.h>

// Mock database for unit testing
class MockDatabase : public DatabaseInterface {
public:
    MOCK_METHOD(bool, createUser, (const User& user), (override));
    MOCK_METHOD(std::optional<User>, getUserByUsername, (const std::string& username), (override));
    MOCK_METHOD(bool, deleteUser, (const std::string& username), (override));
};

// Comprehensive test suite
class UserServiceTest : public ::testing::Test {
protected:
    void SetUp() override {
        mock_db = std::make_shared<MockDatabase>();
        user_service = std::make_unique<UserService>(mock_db);
    }
    
    std::shared_ptr<MockDatabase> mock_db;
    std::unique_ptr<UserService> user_service;
};

TEST_F(UserServiceTest, CreateUserSuccess) {
    User test_user{"testuser", "test@example.com", "hashed_password"};
    
    EXPECT_CALL(*mock_db, createUser(testing::_))
        .WillOnce(testing::Return(true));
        
    auto result = user_service->registerUser("testuser", "test@example.com", "password123");
    
    EXPECT_TRUE(result.success);
    EXPECT_EQ(result.message, "User created successfully");
}

TEST_F(UserServiceTest, CreateUserDuplicateEmail) {
    EXPECT_CALL(*mock_db, getUserByUsername("testuser"))
        .WillOnce(testing::Return(User{"existing", "test@example.com", "hash"}));
        
    auto result = user_service->registerUser("testuser", "test@example.com", "password123");
    
    EXPECT_FALSE(result.success);
    EXPECT_EQ(result.message, "User already exists");
}

// Integration test with test server
class APIIntegrationTest : public ::testing::Test {
protected:
    void SetUp() override {
        // Start test server on different port
        app = createTestApp();
        server_thread = std::thread([this]() {
            app.port(19080).run();
        });
        
        // Wait for server to start
        std::this_thread::sleep_for(std::chrono::milliseconds(200));
    }
    
    void TearDown() override {
        app.stop();
        if (server_thread.joinable()) {
            server_thread.join();
        }
    }
    
    crow::SimpleApp app;
    std::thread server_thread;
};

TEST_F(APIIntegrationTest, FullUserWorkflow) {
    // Test user registration
    auto register_response = makeHttpRequest(
        "POST", 
        "http://localhost:19080/api/register",
        R"({"username":"testuser","email":"test@example.com","password":"password123"})"
    );
    
    EXPECT_EQ(register_response.status, 201);
    
    // Test user login
    auto login_response = makeHttpRequest(
        "POST",
        "http://localhost:19080/api/login", 
        R"({"username":"testuser","password":"password123"})"
    );
    
    EXPECT_EQ(login_response.status, 200);
    
    // Extract JWT token from response
    auto token = extractTokenFromResponse(login_response.body);
    EXPECT_FALSE(token.empty());
    
    // Test authenticated endpoint
    auto profile_response = makeHttpRequestWithAuth(
        "GET",
        "http://localhost:19080/api/profile",
        token
    );
    
    EXPECT_EQ(profile_response.status, 200);
    EXPECT_THAT(profile_response.body, testing::HasSubstr("testuser"));
}

// Performance benchmarking
#include <benchmark/benchmark.h>

static void BM_DatabaseQuery(benchmark::State& state) {
    DatabaseManager db(":memory:");
    db.initialize();
    
    // Insert test data
    for (int i = 0; i < 1000; ++i) {
        User user{
            "user" + std::to_string(i),
            "user" + std::to_string(i) + "@test.com",
            "hashed_password"
        };
        db.createUser(user);
    }
    
    for (auto _ : state) {
        auto users = db.getAllUsers();
        benchmark::DoNotOptimize(users);
    }
}
BENCHMARK(BM_DatabaseQuery);

static void BM_PasswordHashing(benchmark::State& state) {
    for (auto _ : state) {
        auto hash = hashPassword("test_password_123");
        benchmark::DoNotOptimize(hash);
    }
}
BENCHMARK(BM_PasswordHashing);

static void BM_JWTGeneration(benchmark::State& state) {
    for (auto _ : state) {
        auto token = generateJWT("testuser", "user");
        benchmark::DoNotOptimize(token);
    }
}
BENCHMARK(BM_JWTGeneration);

// Memory usage monitoring for performance tests
class MemoryMonitor {
private:
    size_t initial_memory;
    
public:
    MemoryMonitor() : initial_memory(getCurrentMemoryUsage()) {}
    
    size_t getMemoryDelta() {
        return getCurrentMemoryUsage() - initial_memory;
    }
    
    size_t getCurrentMemoryUsage() {
        // Implementation to get current memory usage
        return 0; // Placeholder
    }
};`,
};

export default testing;
