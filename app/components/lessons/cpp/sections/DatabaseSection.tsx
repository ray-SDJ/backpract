import React from "react";
import { Database } from "lucide-react";

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

export const DatabaseSection = {
  id: "database",
  title: "Database Integration & ORM",
  icon: Database,
  overview:
    "Integrate with SQLite/PostgreSQL databases using modern C++ libraries and ORM patterns.",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">
          SQLite Integration with sqlite3
        </h3>
        <CodeExplanation
          code={`#include "crow_all.h"
#include <sqlite3.h>
#include <string>
#include <vector>

class UserDatabase {
private:
    sqlite3* db;

public:
    UserDatabase(const std::string& dbPath) {
        int rc = sqlite3_open(dbPath.c_str(), &db);
        if (rc != SQLITE_OK) {
            CROW_LOG_ERROR << "Cannot open database";
            return;
        }
        initDatabase();
    }

    ~UserDatabase() {
        if (db) sqlite3_close(db);
    }

    void initDatabase() {
        const char* sql = R"(
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                age INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        )";

        char* errMsg = 0;
        int rc = sqlite3_exec(db, sql, 0, 0, &errMsg);
        if (rc != SQLITE_OK) {
            CROW_LOG_ERROR << "SQL error: " << errMsg;
            sqlite3_free(errMsg);
        }
    }

    crow::json::wvalue getAllUsers() {
        const char* sql = "SELECT id, username, email, age FROM users";
        sqlite3_stmt* stmt;
        crow::json::wvalue response;
        int index = 0;

        if (sqlite3_prepare_v2(db, sql, -1, &stmt, 0) == SQLITE_OK) {
            while (sqlite3_step(stmt) == SQLITE_ROW) {
                response["users"][index]["id"] = sqlite3_column_int(stmt, 0);
                response["users"][index]["username"] = 
                    std::string(reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1)));
                response["users"][index]["email"] = 
                    std::string(reinterpret_cast<const char*>(sqlite3_column_text(stmt, 2)));
                response["users"][index]["age"] = sqlite3_column_int(stmt, 3);
                index++;
            }
        }
        sqlite3_finalize(stmt);
        return response;
    }

    crow::json::wvalue getUserById(int userId) {
        const char* sql = "SELECT id, username, email, age FROM users WHERE id = ?";
        sqlite3_stmt* stmt;
        crow::json::wvalue response;

        if (sqlite3_prepare_v2(db, sql, -1, &stmt, 0) == SQLITE_OK) {
            sqlite3_bind_int(stmt, 1, userId);
            if (sqlite3_step(stmt) == SQLITE_ROW) {
                response["id"] = sqlite3_column_int(stmt, 0);
                response["username"] = 
                    std::string(reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1)));
                response["email"] = 
                    std::string(reinterpret_cast<const char*>(sqlite3_column_text(stmt, 2)));
                response["age"] = sqlite3_column_int(stmt, 3);
            } else {
                response["error"] = "User not found";
            }
        }
        sqlite3_finalize(stmt);
        return response;
    }

    bool createUser(const std::string& username, const std::string& email, int age) {
        const char* sql = "INSERT INTO users (username, email, age) VALUES (?, ?, ?)";
        sqlite3_stmt* stmt;

        if (sqlite3_prepare_v2(db, sql, -1, &stmt, 0) == SQLITE_OK) {
            sqlite3_bind_text(stmt, 1, username.c_str(), -1, SQLITE_STATIC);
            sqlite3_bind_text(stmt, 2, email.c_str(), -1, SQLITE_STATIC);
            sqlite3_bind_int(stmt, 3, age);

            if (sqlite3_step(stmt) == SQLITE_DONE) {
                sqlite3_finalize(stmt);
                return true;
            }
        }
        sqlite3_finalize(stmt);
        return false;
    }

    bool deleteUser(int userId) {
        const char* sql = "DELETE FROM users WHERE id = ?";
        sqlite3_stmt* stmt;

        if (sqlite3_prepare_v2(db, sql, -1, &stmt, 0) == SQLITE_OK) {
            sqlite3_bind_int(stmt, 1, userId);
            if (sqlite3_step(stmt) == SQLITE_DONE) {
                sqlite3_finalize(stmt);
                return true;
            }
        }
        sqlite3_finalize(stmt);
        return false;
    }
};

int main() {
    crow::SimpleApp app;
    UserDatabase db("users.db");

    CROW_ROUTE(app, "/api/users")
    ([&db]() {
        return crow::response(db.getAllUsers());
    });

    CROW_ROUTE(app, "/api/users/<int>")
    ([&db](int userId) {
        return crow::response(db.getUserById(userId));
    });

    CROW_ROUTE(app, "/api/users").methods("POST"_method)
    ([&db](const crow::request& req) {
        auto json = crow::json::load(req.body);
        if (db.createUser(json["username"].s(), json["email"].s(), json["age"].i())) {
            return crow::response(201, "User created");
        }
        return crow::response(400, "Failed to create user");
    });

    CROW_ROUTE(app, "/api/users/<int>").methods("DELETE"_method)
    ([&db](int userId) {
        if (db.deleteUser(userId)) {
            return crow::response(204);
        }
        return crow::response(404, "User not found");
    });

    app.port(8080).multithreaded().run();
    return 0;
}`}
          explanation={[
            {
              label: "sqlite3_open()",
              desc: "Open or create SQLite database connection",
            },
            {
              label: "sqlite3_prepare_v2()",
              desc: "Compile SQL statement into bytecode for execution",
            },
            {
              label: "sqlite3_bind_*",
              desc: "Bind parameters to prevent SQL injection vulnerabilities",
            },
            {
              label: "sqlite3_step()",
              desc: "Execute prepared statement and retrieve results",
            },
            {
              label: "sqlite3_column_*",
              desc: "Extract column values from current result row",
            },
          ]}
        />
      </div>
    </div>
  ),
};
