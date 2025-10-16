import { LessonData } from "../types";

const lesson: LessonData = {
  title: "Diesel ORM & Database Operations",
  difficulty: "Intermediate",
  description:
    "Learn to use Diesel ORM for type-safe database operations in Rust with PostgreSQL",
  objectives: [
    "Set up Diesel ORM with PostgreSQL",
    "Create and run database migrations",
    "Define models and schema",
    "Perform CRUD operations with type safety",
    "Understand Diesel's query builder",
  ],
  content: `# Diesel ORM & Database Operations

Diesel is Rust's most popular ORM, providing compile-time guarantees and type safety for database operations.

## Setup

Add Diesel to Cargo.toml:
\`\`\`toml
[dependencies]
diesel = { version = "2.0", features = ["postgres", "chrono"] }
dotenv = "0.15"
chrono = { version = "0.4", features = ["serde"] }

[dev-dependencies]
diesel_migrations = "2.0"
\`\`\`

Install Diesel CLI:
\`\`\`bash
cargo install diesel_cli --no-default-features --features postgres
\`\`\`

## Database Setup

Create .env file:
\`\`\`
DATABASE_URL=postgres://username:password@localhost/myapp
\`\`\`

Initialize Diesel:
\`\`\`bash
diesel setup
diesel migration generate create_users
\`\`\`

## Migration Example

migrations/xxxx_create_users/up.sql:
\`\`\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
\`\`\`

migrations/xxxx_create_users/down.sql:
\`\`\`sql
DROP TABLE users;
\`\`\`

Run migration:
\`\`\`bash
diesel migration run
\`\`\`

## Model Definition

\`\`\`rust
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use chrono::NaiveDateTime;

#[derive(Queryable, Serialize, Debug)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub created_at: NaiveDateTime,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = users)]
pub struct NewUser {
    pub name: String,
    pub email: String,
}

// Schema (auto-generated)
diesel::table! {
    users (id) {
        id -> Int4,
        name -> Varchar,
        email -> Varchar,
        created_at -> Timestamp,
    }
}
\`\`\`

## Database Operations

\`\`\`rust
use diesel::pg::PgConnection;
use diesel::prelude::*;
use dotenv::dotenv;
use std::env;

pub fn establish_connection() -> PgConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

// Create user
pub fn create_user(conn: &mut PgConnection, name: &str, email: &str) -> User {
    use crate::schema::users;
    
    let new_user = NewUser {
        name: name.to_string(),
        email: email.to_string(),
    };
    
    diesel::insert_into(users::table)
        .values(&new_user)
        .get_result(conn)
        .expect("Error saving new user")
}

// Read users
pub fn get_users(conn: &mut PgConnection) -> Vec<User> {
    use crate::schema::users::dsl::*;
    
    users.load::<User>(conn)
        .expect("Error loading users")
}

// Update user
pub fn update_user(conn: &mut PgConnection, user_id: i32, new_name: &str) -> User {
    use crate::schema::users::dsl::*;
    
    diesel::update(users.find(user_id))
        .set(name.eq(new_name))
        .get_result(conn)
        .expect("Error updating user")
}

// Delete user
pub fn delete_user(conn: &mut PgConnection, user_id: i32) -> bool {
    use crate::schema::users::dsl::*;
    
    let num_deleted = diesel::delete(users.find(user_id))
        .execute(conn)
        .expect("Error deleting user");
    
    num_deleted > 0
}
\`\`\``,
  practiceInstructions: [
    "Install PostgreSQL and create a database",
    "Set up Diesel CLI and initialize the project",
    "Create a users table migration",
    "Define User and NewUser models",
    "Implement CRUD operations",
    "Test all database operations",
  ],
  hints: [
    "Use #[derive(Queryable)] for structs that represent database rows",
    "Use #[derive(Insertable)] for structs used to insert data",
    "The schema.rs file is auto-generated, don't edit it manually",
    "Use .get_result() for operations that return a single row",
    "Use .load() for operations that return multiple rows",
  ],
  solution: `// Complete database module example
use diesel::prelude::*;
use diesel::pg::PgConnection;
use serde::{Deserialize, Serialize};
use chrono::NaiveDateTime;
use dotenv::dotenv;
use std::env;

// Models
#[derive(Queryable, Serialize, Debug, Clone)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub created_at: NaiveDateTime,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = users)]
pub struct NewUser {
    pub name: String,
    pub email: String,
}

#[derive(AsChangeset, Deserialize)]
#[diesel(table_name = users)]
pub struct UpdateUser {
    pub name: Option<String>,
    pub email: Option<String>,
}

// Schema
diesel::table! {
    users (id) {
        id -> Int4,
        name -> Varchar,
        email -> Varchar,
        created_at -> Timestamp,
    }
}

// Database connection
pub fn establish_connection() -> PgConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

// Repository
pub struct UserRepository;

impl UserRepository {
    pub fn create(conn: &mut PgConnection, new_user: &NewUser) -> QueryResult<User> {
        diesel::insert_into(users::table)
            .values(new_user)
            .get_result(conn)
    }
    
    pub fn find_all(conn: &mut PgConnection) -> QueryResult<Vec<User>> {
        users::table.load::<User>(conn)
    }
    
    pub fn find_by_id(conn: &mut PgConnection, user_id: i32) -> QueryResult<User> {
        users::table.find(user_id).first(conn)
    }
    
    pub fn update(conn: &mut PgConnection, user_id: i32, changes: &UpdateUser) -> QueryResult<User> {
        diesel::update(users::table.find(user_id))
            .set(changes)
            .get_result(conn)
    }
    
    pub fn delete(conn: &mut PgConnection, user_id: i32) -> QueryResult<usize> {
        diesel::delete(users::table.find(user_id)).execute(conn)
    }
}`,
};

export default lesson;
