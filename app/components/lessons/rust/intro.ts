import { LessonData } from "../types";

const lesson: LessonData = {
  title: "Rust & Actix Web Setup",
  difficulty: "Beginner",
  description:
    "Set up your Rust development environment and create your first Actix Web application with proper async handling and JSON responses",
  objectives: [
    "Install Rust development environment using rustup",
    "Create a new Actix Web project with Cargo",
    "Understand Rust ownership and borrowing fundamentals",
    "Build a basic HTTP server with health endpoint",
    "Learn async/await patterns in Rust",
  ],
  content: `# Rust & Actix Web Setup

Rust is a systems programming language focused on safety, speed, and concurrency. Actix Web is one of the fastest web frameworks for Rust, built on the Actor model.

## Prerequisites

First, install Rust using rustup:
\`\`\`bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
\`\`\`

## Project Setup

Create a new Rust project:
\`\`\`bash
cargo new my-actix-app
cd my-actix-app
\`\`\`

Add dependencies to Cargo.toml:
\`\`\`toml
[package]
name = "my-actix-app"
version = "0.1.0"
edition = "2021"

[dependencies]
actix-web = "4.0"
tokio = { version = "1.0", features = ["macros", "rt-multi-thread"] }
serde = { version = "1.0", features = ["derive"] }
chrono = { version = "0.4", features = ["serde"] }
\`\`\`

## Basic Server Implementation

\`\`\`rust
use actix_web::{web, App, HttpResponse, HttpServer, Result};
use serde::Serialize;

#[derive(Serialize)]
struct HealthCheck {
    status: String,
    timestamp: i64,
}

async fn health() -> Result<HttpResponse> {
    let health = HealthCheck {
        status: "OK".to_string(),
        timestamp: chrono::Utc::now().timestamp(),
    };
    Ok(HttpResponse::Ok().json(health))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Starting Actix Web server on http://localhost:8080");
    
    HttpServer::new(|| {
        App::new()
            .route("/health", web::get().to(health))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
\`\`\`

## Key Rust Concepts

- **Ownership**: Rust's unique approach to memory management
- **Borrowing**: References that allow you to use a value without taking ownership
- **Async/Await**: Rust's approach to asynchronous programming
- **Result Types**: Rust's way of handling errors without exceptions`,
  practiceInstructions: [
    "Create the project structure using cargo new",
    "Add the required dependencies to Cargo.toml",
    "Implement the health endpoint as shown",
    "Run the server with 'cargo run'",
    "Test the endpoint with curl or a browser at http://localhost:8080/health",
    "Experiment with adding more routes and JSON responses",
  ],
  hints: [
    "Make sure to add chrono dependency for timestamps",
    "Use #[derive(Serialize)] to make structs JSON-serializable",
    "The #[actix_web::main] macro sets up the async runtime",
    "HttpResponse::Ok().json() automatically serializes to JSON",
    "Use Result<HttpResponse> for error handling",
  ],
  solution: `// Complete working solution in src/main.rs
use actix_web::{web, App, HttpResponse, HttpServer, Result, middleware::Logger};
use serde::Serialize;

#[derive(Serialize)]
struct HealthCheck {
    status: String,
    timestamp: i64,
    version: String,
}

#[derive(Serialize)]
struct ApiInfo {
    name: String,
    version: String,
    description: String,
}

async fn health() -> Result<HttpResponse> {
    let health = HealthCheck {
        status: "OK".to_string(),
        timestamp: chrono::Utc::now().timestamp(),
        version: "1.0.0".to_string(),
    };
    Ok(HttpResponse::Ok().json(health))
}

async fn info() -> Result<HttpResponse> {
    let info = ApiInfo {
        name: "My Actix App".to_string(),
        version: "1.0.0".to_string(),
        description: "A simple Actix Web application".to_string(),
    };
    Ok(HttpResponse::Ok().json(info))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    
    println!("Starting Actix Web server on http://localhost:8080");
    
    HttpServer::new(|| {
        App::new()
            .wrap(Logger::default())
            .route("/health", web::get().to(health))
            .route("/info", web::get().to(info))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}`,
};

export default lesson;
