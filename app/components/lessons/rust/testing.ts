import { LessonData } from "../types";

const lesson: LessonData = {
  title: "Testing & Deployment in Rust",
  difficulty: "Advanced",
  description:
    "Learn comprehensive testing strategies and deployment practices for Rust web applications",
  objectives: [
    "Write unit and integration tests",
    "Test HTTP endpoints and middleware",
    "Set up continuous integration",
    "Deploy Rust applications to production",
    "Monitor and maintain deployed applications",
  ],
  content: `# Testing & Deployment in Rust

Rust's testing framework and deployment options make it excellent for building reliable, production-ready applications.

## Testing Setup

Add testing dependencies to Cargo.toml:
\`\`\`toml
[dev-dependencies]
actix-web = { version = "4.0", features = ["testing"] }
tokio-test = "0.4"
serde_json = "1.0"
uuid = { version = "1.0", features = ["v4"] }
\`\`\`

## Unit Testing

\`\`\`rust
// lib.rs or separate module
use crate::models::User;
use crate::auth::JwtManager;

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_user_creation() {
        let user = User::new(
            "test@example.com".to_string(),
            "testuser".to_string(),
            "password123"
        ).expect("Failed to create user");
        
        assert_eq!(user.email, "test@example.com");
        assert_eq!(user.username, "testuser");
        assert!(user.is_active);
        assert_eq!(user.roles, vec!["user".to_string()]);
    }
    
    #[test]
    fn test_password_verification() {
        let user = User::new(
            "test@example.com".to_string(),
            "testuser".to_string(),
            "password123"
        ).unwrap();
        
        assert!(user.verify_password("password123"));
        assert!(!user.verify_password("wrongpassword"));
    }
    
    #[test]
    fn test_jwt_token_generation() {
        let jwt_manager = JwtManager::new(b"test-secret");
        let user = User::new(
            "test@example.com".to_string(),
            "testuser".to_string(),
            "password123"
        ).unwrap();
        
        let token = jwt_manager.generate_token(&user).unwrap();
        assert!(!token.is_empty());
        
        // Validate the token
        let claims = jwt_manager.validate_token(&token).unwrap();
        assert_eq!(claims.email, user.email);
        assert_eq!(claims.username, user.username);
    }
}
\`\`\`

## Integration Testing

\`\`\`rust
// tests/integration_test.rs
use actix_web::{test, App, web};
use serde_json::json;
use your_app::{create_app, AppState};
use std::sync::Mutex;
use std::collections::HashMap;

#[actix_web::test]
async fn test_user_registration() {
    let app_state = web::Data::new(AppState {
        users: Mutex::new(HashMap::new()),
        next_id: Mutex::new(1),
    });
    
    let app = test::init_service(
        App::new()
            .app_data(app_state.clone())
            .configure(configure_routes)
    ).await;
    
    let req = test::TestRequest::post()
        .uri("/auth/register")
        .set_json(&json!({
            "email": "test@example.com",
            "username": "testuser",
            "password": "password123"
        }))
        .to_request();
        
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
    
    let body: serde_json::Value = test::read_body_json(resp).await;
    assert_eq!(body["user"]["email"], "test@example.com");
    assert!(body["token"].as_str().is_some());
}

#[actix_web::test]
async fn test_user_login() {
    let app_state = web::Data::new(AppState {
        users: Mutex::new(HashMap::new()),
        next_id: Mutex::new(1),
    });
    
    let app = test::init_service(
        App::new()
            .app_data(app_state.clone())
            .configure(configure_routes)
    ).await;
    
    // First register a user
    let register_req = test::TestRequest::post()
        .uri("/auth/register")
        .set_json(&json!({
            "email": "test@example.com",
            "username": "testuser",
            "password": "password123"
        }))
        .to_request();
        
    test::call_service(&app, register_req).await;
    
    // Then try to login
    let login_req = test::TestRequest::post()
        .uri("/auth/login")
        .set_json(&json!({
            "email": "test@example.com",
            "password": "password123"
        }))
        .to_request();
        
    let resp = test::call_service(&app, login_req).await;
    assert!(resp.status().is_success());
    
    let body: serde_json::Value = test::read_body_json(resp).await;
    assert!(body["token"].as_str().is_some());
}

#[actix_web::test]
async fn test_protected_route() {
    let app_state = web::Data::new(AppState {
        users: Mutex::new(HashMap::new()),
        next_id: Mutex::new(1),
    });
    
    let jwt_manager = JwtManager::new(b"test-secret");
    let user = User::new(
        "test@example.com".to_string(),
        "testuser".to_string(),
        "password123"
    ).unwrap();
    
    let token = jwt_manager.generate_token(&user).unwrap();
    
    let app = test::init_service(
        App::new()
            .app_data(app_state.clone())
            .app_data(web::Data::new(jwt_manager))
            .configure(configure_routes)
    ).await;
    
    let req = test::TestRequest::get()
        .uri("/auth/profile")
        .insert_header(("Authorization", format!("Bearer {}", token)))
        .to_request();
        
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
}
\`\`\`

## Performance Testing

\`\`\`rust
// benches/api_benchmark.rs (requires 'cargo install cargo-criterion')
use criterion::{black_box, criterion_group, criterion_main, Criterion};
use tokio::runtime::Runtime;

fn benchmark_user_creation(c: &mut Criterion) {
    c.bench_function("user_creation", |b| {
        b.iter(|| {
            let user = User::new(
                black_box("test@example.com".to_string()),
                black_box("testuser".to_string()),
                black_box("password123")
            );
            black_box(user)
        })
    });
}

fn benchmark_jwt_operations(c: &mut Criterion) {
    let jwt_manager = JwtManager::new(b"test-secret");
    let user = User::new(
        "test@example.com".to_string(),
        "testuser".to_string(),
        "password123"
    ).unwrap();
    
    c.bench_function("jwt_generation", |b| {
        b.iter(|| {
            let token = jwt_manager.generate_token(black_box(&user));
            black_box(token)
        })
    });
    
    let token = jwt_manager.generate_token(&user).unwrap();
    c.bench_function("jwt_validation", |b| {
        b.iter(|| {
            let claims = jwt_manager.validate_token(black_box(&token));
            black_box(claims)
        })
    });
}

criterion_group!(benches, benchmark_user_creation, benchmark_jwt_operations);
criterion_main!(benches);
\`\`\`

## Docker Deployment

Create a Dockerfile:
\`\`\`dockerfile
# Multi-stage build for smaller image
FROM rust:1.70 as builder

WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src

# Build the application
RUN cargo build --release

# Runtime image
FROM debian:bookworm-slim

# Install SSL certificates and other runtime dependencies
RUN apt-get update && apt-get install -y \\
    ca-certificates \\
    && rm -rf /var/lib/apt/lists/*

# Create app user
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# Copy binary from builder stage
COPY --from=builder /app/target/release/your-app-name ./app

# Change ownership to app user
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8080

CMD ["./app"]
\`\`\`

## CI/CD Pipeline (GitHub Actions)

\`.github/workflows/ci.yml\`:
\`\`\`yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  CARGO_TERM_COLOR: always

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v3
    
    - name: Install Rust
      uses: actions-rs/toolchain@v1
      with:
        toolchain: stable
        components: rustfmt, clippy
        
    - name: Cache dependencies
      uses: actions/cache@v3
      with:
        path: |
          ~/.cargo/bin/
          ~/.cargo/registry/index/
          ~/.cargo/registry/cache/
          ~/.cargo/git/db/
          target/
        key: \${{ runner.os }}-cargo-\${{ hashFiles('**/Cargo.lock') }}
        
    - name: Check formatting
      run: cargo fmt -- --check
      
    - name: Run Clippy
      run: cargo clippy -- -D warnings
      
    - name: Run tests
      run: cargo test
      env:
        DATABASE_URL: postgres://postgres:postgres@localhost:5432/testdb
        
    - name: Run integration tests
      run: cargo test --test integration_test
      
  security:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Security audit
      run: |
        cargo install cargo-audit
        cargo audit

  deploy:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: your-registry/your-app:latest
        
    - name: Deploy to production
      run: |
        # Add your deployment commands here
        echo "Deploying to production..."
\`\`\`

## Production Deployment

Environment configuration:
\`\`\`.env.production
DATABASE_URL=postgresql://user:password@db-host:5432/production_db
JWT_SECRET=your-very-secure-secret-key-here
RUST_LOG=info
PORT=8080
WORKERS=4
\`\`\`

Production optimizations:
\`\`\`rust
// main.rs production setup
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize logging
    env_logger::init();
    
    // Load environment variables
    dotenv::dotenv().ok();
    
    let port = env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse::<u16>()
        .expect("PORT must be a valid number");
        
    let workers = env::var("WORKERS")
        .unwrap_or_else(|_| "4".to_string())
        .parse::<usize>()
        .expect("WORKERS must be a valid number");
    
    println!("Starting server on port {} with {} workers", port, workers);
    
    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .wrap(middleware::DefaultHeaders::new()
                .header("X-Version", "1.0"))
            .configure(configure_routes)
    })
    .workers(workers)
    .bind(("0.0.0.0", port))?
    .run()
    .await
}
\`\`\``,
  practiceInstructions: [
    "Write comprehensive unit tests for all models and utilities",
    "Create integration tests for all API endpoints",
    "Set up a CI/CD pipeline with GitHub Actions",
    "Create a Docker image for your application",
    "Deploy to a cloud platform (AWS, GCP, or Azure)",
    "Set up monitoring and logging for production",
  ],
  hints: [
    "Use #[cfg(test)] to separate test code from production code",
    "Test both success and error scenarios",
    "Use test databases for integration tests",
    "Keep your Docker images small with multi-stage builds",
    "Always use environment variables for sensitive configuration",
  ],
  solution: `// Complete testing and deployment setup

// Comprehensive test suite
#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{test, App, web};
    use serde_json::json;
    
    async fn create_test_app() -> impl actix_web::dev::Service<
        actix_web::dev::ServiceRequest,
        Response = actix_web::dev::ServiceResponse,
        Error = actix_web::Error,
    > {
        let app_state = web::Data::new(AppState::new());
        let jwt_manager = web::Data::new(JwtManager::new(b"test-secret"));
        
        test::init_service(
            App::new()
                .app_data(app_state)
                .app_data(jwt_manager)
                .configure(configure_routes)
        ).await
    }
    
    #[actix_web::test]
    async fn test_complete_auth_flow() {
        let app = create_test_app().await;
        
        // Test registration
        let register_req = test::TestRequest::post()
            .uri("/auth/register")
            .set_json(&json!({
                "email": "test@example.com",
                "username": "testuser",
                "password": "securepassword123"
            }))
            .to_request();
            
        let register_resp = test::call_service(&app, register_req).await;
        assert_eq!(register_resp.status(), 201);
        
        let register_body: serde_json::Value = test::read_body_json(register_resp).await;
        let token = register_body["token"].as_str().unwrap();
        
        // Test protected endpoint with token
        let profile_req = test::TestRequest::get()
            .uri("/auth/profile")
            .insert_header(("Authorization", format!("Bearer {}", token)))
            .to_request();
            
        let profile_resp = test::call_service(&app, profile_req).await;
        assert!(profile_resp.status().is_success());
        
        // Test login
        let login_req = test::TestRequest::post()
            .uri("/auth/login")
            .set_json(&json!({
                "email": "test@example.com",
                "password": "securepassword123"
            }))
            .to_request();
            
        let login_resp = test::call_service(&app, login_req).await;
        assert!(login_resp.status().is_success());
    }
    
    #[actix_web::test]
    async fn test_error_scenarios() {
        let app = create_test_app().await;
        
        // Test invalid registration
        let invalid_req = test::TestRequest::post()
            .uri("/auth/register")
            .set_json(&json!({
                "email": "invalid-email",
                "username": "a", // too short
                "password": "123" // too short
            }))
            .to_request();
            
        let resp = test::call_service(&app, invalid_req).await;
        assert_eq!(resp.status(), 400);
        
        // Test unauthorized access
        let unauthorized_req = test::TestRequest::get()
            .uri("/auth/profile")
            .to_request();
            
        let resp = test::call_service(&app, unauthorized_req).await;
        assert_eq!(resp.status(), 401);
    }
}

// Production deployment configuration
// docker-compose.yml for production
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/production
      - JWT_SECRET=\${JWT_SECRET}
      - RUST_LOG=info
    depends_on:
      - db
      
  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=production
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=\${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      
volumes:
  postgres_data:

// Health check endpoint for monitoring
async fn health_check() -> HttpResponse {
    HttpResponse::Ok().json(json!({
        "status": "healthy",
        "timestamp": chrono::Utc::now(),
        "version": env!("CARGO_PKG_VERSION")
    }))
}

// Metrics endpoint for monitoring
async fn metrics() -> HttpResponse {
    HttpResponse::Ok().json(json!({
        "uptime": "calculate_uptime()",
        "memory_usage": "get_memory_usage()",
        "active_connections": "get_active_connections()"
    }))
}`,
};

export default lesson;
