import { LessonData } from "../types";

const database: LessonData = {
  title: "SQLite Integration & Database ORM",
  difficulty: "Intermediate",
  description:
    "Integrate SQLite database with C++ using modern libraries like SQLiteCpp for type-safe database operations and ORM patterns.",
  objectives: [
    "Set up SQLite database with SQLiteCpp library",
    "Create strongly-typed database models and schemas",
    "Implement CRUD operations with proper error handling",
    "Handle database migrations and connection pooling",
    "Build type-safe database services and repositories",
  ],
  content: `<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8 text-white">
          <h1 class="text-3xl font-bold mb-2">SQLite Integration & Database ORM</h1>
          <p class="text-purple-100 text-lg">Build robust database integration with SQLiteCpp and modern C++ patterns</p>
        </div>

        <!-- Main Content -->
        <div class="p-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Content Column -->
            <div class="lg:col-span-2 space-y-8">
              
              <section class="bg-blue-50 rounded-lg p-6">
                <h2 class="text-2xl font-semibold text-blue-800 mb-4 flex items-center">
                  <span class="bg-blue-200 w-8 h-8 rounded-full flex items-center justify-center text-blue-800 font-bold mr-3">1</span>
                  SQLiteCpp Setup & Configuration
                </h2>
                <div class="bg-white rounded-lg p-4 mb-4">
                  <h3 class="text-lg font-semibold text-gray-800 mb-3">Dependencies Setup</h3>
                  <p class="text-gray-700 mb-4">SQLite is perfect for C++ applications due to its simplicity and performance. We'll use SQLiteCpp, a modern C++ wrapper around SQLite.</p>
                  <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-4">
                      <h4 class="font-medium text-gray-700 mb-2">CMakeLists.txt Configuration</h4>
                      <pre class="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto"><code># Find SQLite3 and SQLiteCpp
find_package(SQLite3 REQUIRED)
find_package(SQLiteCpp REQUIRED)

# Alternative: Use vcpkg
./vcpkg install sqlitecpp

target_link_libraries(\${PROJECT_NAME} 
    PRIVATE 
    SQLiteCpp
    SQLite::SQLite3
)</code></pre>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <h4 class="font-medium text-gray-700 mb-2">Database Manager Header</h4>
                      <pre class="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto"><code>#pragma once
#include &lt;SQLiteCpp/SQLiteCpp.h&gt;
#include &lt;memory&gt;
#include &lt;vector&gt;
#include &lt;optional&gt;
#include &lt;string&gt;

struct User {
    int id;
    std::string username;
    std::string email;
    std::string password_hash;
    std::string created_at;
};

class DatabaseManager {
private:
    std::unique_ptr&lt;SQLite::Database&gt; db;
    
public:
    explicit DatabaseManager(const std::string&amp; db_path);
    void initialize();
    
    // User operations
    bool createUser(const User&amp; user);
    std::optional&lt;User&gt; getUserById(int id);
    std::optional&lt;User&gt; getUserByUsername(const std::string&amp; username);
    std::vector&lt;User&gt; getAllUsers();
    bool updateUser(const User&amp; user);
    bool deleteUser(int id);
    
    // Utility methods
    bool userExists(const std::string&amp; username);
    int getUserCount();
};</code></pre>
                    </div>
                  </div>
                </div>
              </section>

              <section class="bg-green-50 rounded-lg p-6">
                <h2 class="text-2xl font-semibold text-green-800 mb-4 flex items-center">
                  <span class="bg-green-200 w-8 h-8 rounded-full flex items-center justify-center text-green-800 font-bold mr-3">2</span>
                  Database Implementation
                </h2>
                <div class="bg-white rounded-lg p-4 mb-4">
                  <h3 class="text-lg font-semibold text-gray-800 mb-3">Complete Database Manager</h3>
                  <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-4">
                      <h4 class="font-medium text-gray-700 mb-2">DatabaseManager.cpp - Core Implementation</h4>
                      <pre class="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto"><code>#include "DatabaseManager.h"
#include &lt;stdexcept&gt;
#include &lt;chrono&gt;
#include &lt;sstream&gt;
#include &lt;iomanip&gt;

DatabaseManager::DatabaseManager(const std::string&amp; db_path) {
    try {
        db = std::make_unique&lt;SQLite::Database&gt;(db_path, 
            SQLite::OPEN_READWRITE | SQLite::OPEN_CREATE);
    } catch (const std::exception&amp; e) {
        throw std::runtime_error("Failed to open database: " + std::string(e.what()));
    }
}

void DatabaseManager::initialize() {
    try {
        // Create users table
        db-&gt;exec(R"(
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        )");
        
        // Create indexes for performance
        db-&gt;exec("CREATE INDEX IF NOT EXISTS idx_username ON users(username)");
        db-&gt;exec("CREATE INDEX IF NOT EXISTS idx_email ON users(email)");
        
    } catch (const std::exception&amp; e) {
        throw std::runtime_error("Failed to initialize database: " + std::string(e.what()));
    }
}</code></pre>
                    </div>
                  </div>
                </div>
              </section>

              <section class="bg-yellow-50 rounded-lg p-6">
                <h2 class="text-2xl font-semibold text-yellow-800 mb-4 flex items-center">
                  <span class="bg-yellow-200 w-8 h-8 rounded-full flex items-center justify-center text-yellow-800 font-bold mr-3">3</span>
                  CRUD Operations
                </h2>
                <div class="bg-white rounded-lg p-4 mb-4">
                  <h3 class="text-lg font-semibold text-gray-800 mb-3">Database Query Methods</h3>
                  <div class="space-y-4">
                    <div class="bg-gray-50 rounded-lg p-4">
                      <h4 class="font-medium text-gray-700 mb-2">Create & Read Operations</h4>
                      <pre class="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto"><code>bool DatabaseManager::createUser(const User&amp; user) {
    try {
        SQLite::Statement query(*db, 
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
        
        query.bind(1, user.username);
        query.bind(2, user.email);
        query.bind(3, user.password_hash);
        
        return query.exec() == 1;
    } catch (const SQLite::Exception&amp; e) {
        if (e.getErrorCode() == SQLITE_CONSTRAINT) {
            return false; // Username or email already exists
        }
        throw;
    }
}

std::optional&lt;User&gt; DatabaseManager::getUserByUsername(const std::string&amp; username) {
    try {
        SQLite::Statement query(*db, 
            "SELECT id, username, email, password_hash, created_at FROM users WHERE username = ?");
        query.bind(1, username);
        
        if (query.executeStep()) {
            User user;
            user.id = query.getColumn(0);
            user.username = query.getColumn(1);
            user.email = query.getColumn(2);
            user.password_hash = query.getColumn(3);
            user.created_at = query.getColumn(4);
            return user;
        }
        return std::nullopt;
    } catch (const std::exception&amp; e) {
        throw std::runtime_error("Failed to get user: " + std::string(e.what()));
    }
}</code></pre>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <h4 class="font-medium text-gray-700 mb-2">Update & Delete Operations</h4>
                      <pre class="bg-gray-800 text-green-400 p-4 rounded-lg text-sm overflow-x-auto"><code>bool DatabaseManager::updateUser(const User&amp; user) {
    try {
        SQLite::Statement query(*db, 
            "UPDATE users SET username = ?, email = ? WHERE id = ?");
        
        query.bind(1, user.username);
        query.bind(2, user.email);
        query.bind(3, user.id);
        
        return query.exec() == 1;
    } catch (const std::exception&amp; e) {
        return false;
    }
}

bool DatabaseManager::deleteUser(int id) {
    try {
        SQLite::Statement query(*db, "DELETE FROM users WHERE id = ?");
        query.bind(1, id);
        
        return query.exec() == 1;
    } catch (const std::exception&amp; e) {
        return false;
    }
}</code></pre>
                    </div>
                  </div>
                </div>
              </section>

            </div>

            <!-- Sidebar -->
            <div class="lg:col-span-1 space-y-6">
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">🗃️ SQLiteCpp Features</h3>
                <ul class="space-y-3 text-sm text-gray-600">
                  <li class="flex items-start">
                    <span class="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
                    <span>Type-safe database operations</span>
                  </li>
                  <li class="flex items-start">
                    <span class="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
                    <span>RAII-based resource management</span>
                  </li>
                  <li class="flex items-start">
                    <span class="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
                    <span>Exception-based error handling</span>
                  </li>
                </ul>
              </div>

              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">⚡ Performance Tips</h3>
                <ul class="space-y-3 text-sm text-gray-600">
                  <li class="flex items-start">
                    <span class="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">✓</span>
                    <span>Use prepared statements for repeated queries</span>
                  </li>
                  <li class="flex items-start">
                    <span class="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">✓</span>
                    <span>Create indexes on frequently queried columns</span>
                  </li>
                  <li class="flex items-start">
                    <span class="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">✓</span>
                    <span>Use transactions for bulk operations</span>
                  </li>
                </ul>
              </div>

              <div class="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-purple-800 mb-4">💡 Best Practices</h3>
                <ul class="space-y-3 text-sm text-purple-700">
                  <li class="flex items-start">
                    <span class="text-purple-500 mr-2">•</span>
                    <span>Always use parameterized queries to prevent SQL injection</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-purple-500 mr-2">•</span>
                    <span>Handle SQLite exceptions appropriately</span>
                  </li>
                  <li class="flex items-start">
                    <span class="text-purple-500 mr-2">•</span>
                    <span>Use std::optional for nullable return values</span>
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
                <h3 class="text-lg font-semibold text-gray-700 mb-3">Database Setup</h3>
                <ul class="space-y-2 text-gray-600">
                  <li>✅ SQLiteCpp library integration</li>
                  <li>✅ Database schema creation</li>
                  <li>✅ Connection management</li>
                  <li>✅ Error handling patterns</li>
                </ul>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-700 mb-3">CRUD Operations</h3>
                <ul class="space-y-2 text-gray-600">
                  <li>✅ Type-safe query execution</li>
                  <li>✅ Prepared statements</li>
                  <li>✅ Result set handling</li>
                  <li>✅ Transaction management</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>`,
  practiceInstructions: [
    "Install SQLiteCpp library and configure CMake",
    "Create User model class with validation",
    "Implement DatabaseManager class with CRUD operations",
    "Test database operations with sample data",
    "Add error handling and connection pooling",
  ],
  hints: [
    "Use RAII principles for automatic resource management",
    "Always use prepared statements to prevent SQL injection",
    "Handle SQLite exceptions appropriately",
    "Consider using std::optional for nullable return values",
    "Create indexes on frequently queried columns",
  ],
  solution: `# Complete SQLiteCpp database integration
./vcpkg install sqlitecpp
mkdir build && cd build
cmake .. -DCMAKE_TOOLCHAIN_FILE=[vcpkg]/scripts/buildsystems/vcpkg.cmake
make && ./database_test`,
};

export default database;
