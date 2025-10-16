import { LessonData } from "../types";

const lesson: LessonData = {
  title: "Database Integration with SQLite & Modern C++",
  difficulty: "Advanced",
  description:
    "Integrate SQLite database with modern C++ using SQLiteCpp library and implement RAII patterns",
  objectives: [
    "Set up SQLite database with SQLiteCpp wrapper",
    "Implement CRUD operations with prepared statements",
    "Use RAII patterns for resource management",
    "Create a simple ORM-like interface",
    "Handle database transactions and error handling",
  ],
  content: `# Database Integration with SQLite & Modern C++

SQLite is perfect for C++ applications due to its simplicity and performance. We'll use SQLiteCpp, a modern wrapper around SQLite.

## Dependencies Setup

Add to CMakeLists.txt:
\`\`\`cmake
# Find SQLite3
find_package(SQLite3 REQUIRED)

# Add SQLiteCpp as subdirectory or find_package
find_package(SQLiteCpp REQUIRED)

target_link_libraries(\${PROJECT_NAME} 
    PRIVATE 
    SQLiteCpp
    SQLite::SQLite3
)
\`\`\`

## Database Schema and Models

Create \`include/models/User.h\`:
\`\`\`cpp
#pragma once
#include <string>
#include <optional>
#include <chrono>
#include <nlohmann/json.hpp>

class User {
public:
    int id;
    std::string username;
    std::string email;
    std::string password_hash;
    std::chrono::system_clock::time_point created_at;
    bool is_active;

    // Constructors
    User() = default;
    User(const std::string& username, const std::string& email, 
         const std::string& password_hash);

    // JSON serialization
    nlohmann::json toJson() const;
    static User fromJson(const nlohmann::json& j);

    // Validation
    bool isValid() const;
};
\`\`\`

## Database Connection Manager

Create \`include/database/Database.h\`:
\`\`\`cpp
#pragma once
#include <SQLiteCpp/SQLiteCpp.h>
#include <memory>
#include <string>
#include <vector>
#include <optional>
#include "models/User.h"

class Database {
private:
    std::unique_ptr<SQLite::Database> db;
    
public:
    explicit Database(const std::string& db_path);
    ~Database() = default;

    // Database initialization
    void initialize();
    void createTables();

    // User operations
    std::optional<User> createUser(const User& user);
    std::optional<User> getUserById(int id);
    std::optional<User> getUserByUsername(const std::string& username);
    std::vector<User> getAllUsers();
    bool updateUser(const User& user);
    bool deleteUser(int id);

    // Utility methods
    bool userExists(const std::string& username);
    int getUserCount();
};
\`\`\`

## Implementation

Create \`src/models/User.cpp\`:
\`\`\`cpp
#include "models/User.h"
#include <regex>

User::User(const std::string& username, const std::string& email, 
           const std::string& password_hash)
    : username(username), email(email), password_hash(password_hash),
      created_at(std::chrono::system_clock::now()), is_active(true) {}

nlohmann::json User::toJson() const {
    auto time_t = std::chrono::system_clock::to_time_t(created_at);
    
    return nlohmann::json{
        {"id", id},
        {"username", username},
        {"email", email},
        {"created_at", time_t},
        {"is_active", is_active}
        // Note: password_hash is excluded from JSON for security
    };
}

User User::fromJson(const nlohmann::json& j) {
    User user;
    user.id = j.at("id");
    user.username = j.at("username");
    user.email = j.at("email");
    user.is_active = j.value("is_active", true);
    
    if (j.contains("created_at")) {
        std::time_t time_t_val = j.at("created_at");
        user.created_at = std::chrono::system_clock::from_time_t(time_t_val);
    }
    
    return user;
}

bool User::isValid() const {
    // Username validation
    if (username.empty() || username.length() < 3 || username.length() > 50) {
        return false;
    }

    // Email validation (basic regex)
    const std::regex email_regex(
        R"(^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$)"
    );
    if (!std::regex_match(email, email_regex)) {
        return false;
    }

    // Password hash should not be empty
    if (password_hash.empty()) {
        return false;
    }

    return true;
}
\`\`\`

Create \`src/database/Database.cpp\`:
\`\`\`cpp
#include "database/Database.h"
#include <iostream>
#include <stdexcept>

Database::Database(const std::string& db_path) {
    try {
        db = std::make_unique<SQLite::Database>(
            db_path, 
            SQLite::OPEN_READWRITE | SQLite::OPEN_CREATE
        );
        std::cout << "Database opened successfully: " << db_path << std::endl;
    } catch (const std::exception& e) {
        throw std::runtime_error("Failed to open database: " + std::string(e.what()));
    }
}

void Database::initialize() {
    createTables();
}

void Database::createTables() {
    try {
        const std::string create_users_table = R"(
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT 1
            );
        )";

        db->exec(create_users_table);
        std::cout << "Users table created successfully" << std::endl;

    } catch (const std::exception& e) {
        throw std::runtime_error("Failed to create tables: " + std::string(e.what()));
    }
}

std::optional<User> Database::createUser(const User& user) {
    if (!user.isValid()) {
        return std::nullopt;
    }

    try {
        SQLite::Statement query(*db, R"(
            INSERT INTO users (username, email, password_hash, is_active) 
            VALUES (?, ?, ?, ?)
        )");
        
        query.bind(1, user.username);
        query.bind(2, user.email);
        query.bind(3, user.password_hash);
        query.bind(4, user.is_active);

        query.exec();
        
        // Return the created user with ID
        int user_id = static_cast<int>(db->getLastInsertRowid());
        return getUserById(user_id);

    } catch (const SQLite::Exception& e) {
        std::cerr << "Database error creating user: " << e.what() << std::endl;
        return std::nullopt;
    }
}

std::optional<User> Database::getUserById(int id) {
    try {
        SQLite::Statement query(*db, 
            "SELECT id, username, email, password_hash, created_at, is_active "
            "FROM users WHERE id = ?");
        
        query.bind(1, id);

        if (query.executeStep()) {
            User user;
            user.id = query.getColumn(0);
            user.username = query.getColumn(1);
            user.email = query.getColumn(2);
            user.password_hash = query.getColumn(3);
            
            // Parse datetime
            std::string datetime_str = query.getColumn(4);
            // TODO: Implement proper datetime parsing
            
            user.is_active = query.getColumn(5).getInt() != 0;
            
            return user;
        }
        
        return std::nullopt;

    } catch (const SQLite::Exception& e) {
        std::cerr << "Database error getting user: " << e.what() << std::endl;
        return std::nullopt;
    }
}

std::vector<User> Database::getAllUsers() {
    std::vector<User> users;
    
    try {
        SQLite::Statement query(*db, 
            "SELECT id, username, email, password_hash, created_at, is_active "
            "FROM users ORDER BY created_at DESC");

        while (query.executeStep()) {
            User user;
            user.id = query.getColumn(0);
            user.username = query.getColumn(1);
            user.email = query.getColumn(2);
            user.password_hash = query.getColumn(3);
            user.is_active = query.getColumn(5).getInt() != 0;
            
            users.push_back(user);
        }

    } catch (const SQLite::Exception& e) {
        std::cerr << "Database error getting all users: " << e.what() << std::endl;
    }
    
    return users;
}

bool Database::updateUser(const User& user) {
    if (!user.isValid()) {
        return false;
    }

    try {
        SQLite::Statement query(*db, R"(
            UPDATE users 
            SET username = ?, email = ?, password_hash = ?, is_active = ? 
            WHERE id = ?
        )");
        
        query.bind(1, user.username);
        query.bind(2, user.email);
        query.bind(3, user.password_hash);
        query.bind(4, user.is_active);
        query.bind(5, user.id);

        return query.exec() > 0;

    } catch (const SQLite::Exception& e) {
        std::cerr << "Database error updating user: " << e.what() << std::endl;
        return false;
    }
}

bool Database::deleteUser(int id) {
    try {
        SQLite::Statement query(*db, "DELETE FROM users WHERE id = ?");
        query.bind(1, id);
        
        return query.exec() > 0;

    } catch (const SQLite::Exception& e) {
        std::cerr << "Database error deleting user: " << e.what() << std::endl;
        return false;
    }
}
\`\`\``,
  practiceInstructions: [
    "Install SQLiteCpp library and configure CMake",
    "Create User model class with validation",
    "Implement Database class with CRUD operations",
    "Test database operations with sample data",
    "Add proper error handling and logging",
    "Implement database migrations for schema changes",
  ],
  hints: [
    "Use RAII principles for automatic resource management",
    "Always use prepared statements to prevent SQL injection",
    "Handle SQLite exceptions appropriately",
    "Consider using std::optional for operations that might fail",
    "Implement proper datetime handling for cross-platform compatibility",
  ],
  solution: `// Complete database integration with connection pooling and transactions

#include "database/Database.h"
#include <thread>
#include <mutex>
#include <queue>
#include <condition_variable>

// Connection pool for better performance
class DatabasePool {
private:
    std::queue<std::unique_ptr<Database>> available_connections;
    std::mutex pool_mutex;
    std::condition_variable condition;
    size_t pool_size;
    std::string db_path;

public:
    DatabasePool(const std::string& path, size_t size = 5) 
        : pool_size(size), db_path(path) {
        for (size_t i = 0; i < pool_size; ++i) {
            auto db = std::make_unique<Database>(db_path);
            db->initialize();
            available_connections.push(std::move(db));
        }
    }

    std::unique_ptr<Database> acquire() {
        std::unique_lock<std::mutex> lock(pool_mutex);
        condition.wait(lock, [this] { return !available_connections.empty(); });
        
        auto db = std::move(available_connections.front());
        available_connections.pop();
        return db;
    }

    void release(std::unique_ptr<Database> db) {
        std::lock_guard<std::mutex> lock(pool_mutex);
        available_connections.push(std::move(db));
        condition.notify_one();
    }
};

// Transaction manager
class Transaction {
private:
    SQLite::Database& db;
    bool committed = false;

public:
    explicit Transaction(SQLite::Database& database) : db(database) {
        db.exec("BEGIN TRANSACTION");
    }

    ~Transaction() {
        if (!committed) {
            db.exec("ROLLBACK");
        }
    }

    void commit() {
        db.exec("COMMIT");
        committed = true;
    }

    void rollback() {
        if (!committed) {
            db.exec("ROLLBACK");
            committed = true;
        }
    }
};`,
};

export default lesson;
