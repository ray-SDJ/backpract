import { LessonData } from "../types";

const lesson: LessonData = {
  title: "Building REST APIs with Actix Web",
  difficulty: "Intermediate",
  description:
    "Create robust REST APIs using Actix Web with proper error handling, validation, and JSON responses",
  objectives: [
    "Design RESTful API endpoints",
    "Implement request/response handling",
    "Add input validation and error handling",
    "Structure API with proper middleware",
    "Handle different HTTP methods and status codes",
  ],
  content: `# Building REST APIs with Actix Web

Actix Web provides powerful tools for building fast and reliable REST APIs with excellent performance.

## API Structure Setup

\`\`\`rust
use actix_web::{web, App, HttpServer, middleware::Logger, Result};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use std::collections::HashMap;

// Data models
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct User {
    pub id: u32,
    pub name: String,
    pub email: String,
}

#[derive(Deserialize)]
pub struct CreateUserRequest {
    pub name: String,
    pub email: String,
}

#[derive(Deserialize)]
pub struct UpdateUserRequest {
    pub name: Option<String>,
    pub email: Option<String>,
}

// Application state
pub struct AppState {
    users: Mutex<HashMap<u32, User>>,
    next_id: Mutex<u32>,
}
\`\`\`

## CRUD Handlers

\`\`\`rust
use actix_web::{HttpResponse, web::Path, web::Json, web::Data};

// GET /users - List all users
async fn get_users(data: Data<AppState>) -> Result<HttpResponse> {
    let users = data.users.lock().unwrap();
    let users_vec: Vec<User> = users.values().cloned().collect();
    Ok(HttpResponse::Ok().json(users_vec))
}

// GET /users/{id} - Get user by ID
async fn get_user(path: Path<u32>, data: Data<AppState>) -> Result<HttpResponse> {
    let user_id = path.into_inner();
    let users = data.users.lock().unwrap();
    
    match users.get(&user_id) {
        Some(user) => Ok(HttpResponse::Ok().json(user)),
        None => Ok(HttpResponse::NotFound().json(serde_json::json!({
            "error": "User not found"
        })))
    }
}

// POST /users - Create new user
async fn create_user(
    request: Json<CreateUserRequest>,
    data: Data<AppState>
) -> Result<HttpResponse> {
    let mut users = data.users.lock().unwrap();
    let mut next_id = data.next_id.lock().unwrap();
    
    let user = User {
        id: *next_id,
        name: request.name.clone(),
        email: request.email.clone(),
    };
    
    users.insert(*next_id, user.clone());
    *next_id += 1;
    
    Ok(HttpResponse::Created().json(user))
}

// PUT /users/{id} - Update user
async fn update_user(
    path: Path<u32>,
    request: Json<UpdateUserRequest>,
    data: Data<AppState>
) -> Result<HttpResponse> {
    let user_id = path.into_inner();
    let mut users = data.users.lock().unwrap();
    
    match users.get_mut(&user_id) {
        Some(user) => {
            if let Some(name) = &request.name {
                user.name = name.clone();
            }
            if let Some(email) = &request.email {
                user.email = email.clone();
            }
            Ok(HttpResponse::Ok().json(user))
        }
        None => Ok(HttpResponse::NotFound().json(serde_json::json!({
            "error": "User not found"
        })))
    }
}

// DELETE /users/{id} - Delete user
async fn delete_user(path: Path<u32>, data: Data<AppState>) -> Result<HttpResponse> {
    let user_id = path.into_inner();
    let mut users = data.users.lock().unwrap();
    
    match users.remove(&user_id) {
        Some(_) => Ok(HttpResponse::NoContent().finish()),
        None => Ok(HttpResponse::NotFound().json(serde_json::json!({
            "error": "User not found"
        })))
    }
}
\`\`\`

## Error Handling

\`\`\`rust
use actix_web::{ResponseError, HttpResponse};
use serde_json::json;
use std::fmt;

#[derive(Debug)]
pub enum ApiError {
    ValidationError(String),
    NotFound(String),
    InternalError(String),
}

impl fmt::Display for ApiError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ApiError::ValidationError(msg) => write!(f, "Validation Error: {}", msg),
            ApiError::NotFound(msg) => write!(f, "Not Found: {}", msg),
            ApiError::InternalError(msg) => write!(f, "Internal Error: {}", msg),
        }
    }
}

impl ResponseError for ApiError {
    fn error_response(&self) -> HttpResponse {
        match self {
            ApiError::ValidationError(msg) => {
                HttpResponse::BadRequest().json(json!({"error": msg}))
            }
            ApiError::NotFound(msg) => {
                HttpResponse::NotFound().json(json!({"error": msg}))
            }
            ApiError::InternalError(msg) => {
                HttpResponse::InternalServerError().json(json!({"error": msg}))
            }
        }
    }
}
\`\`\`

## Main Application

\`\`\`rust
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    
    let app_state = Data::new(AppState {
        users: Mutex::new(HashMap::new()),
        next_id: Mutex::new(1),
    });
    
    println!("Starting server at http://localhost:8080");
    
    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .wrap(Logger::default())
            .service(
                web::scope("/api/v1")
                    .route("/users", web::get().to(get_users))
                    .route("/users", web::post().to(create_user))
                    .route("/users/{id}", web::get().to(get_user))
                    .route("/users/{id}", web::put().to(update_user))
                    .route("/users/{id}", web::delete().to(delete_user))
            )
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
\`\`\``,
  practiceInstructions: [
    "Set up the basic API structure with AppState",
    "Implement all CRUD operations (GET, POST, PUT, DELETE)",
    "Add proper error handling for all endpoints",
    "Test each endpoint with curl or Postman",
    "Add input validation for create and update operations",
    "Implement proper HTTP status codes for all responses",
  ],
  hints: [
    "Use web::Data<AppState> to share state between handlers",
    "Path<T> extracts path parameters automatically",
    "Json<T> deserializes request body to structs",
    "Return appropriate HTTP status codes (200, 201, 404, etc.)",
    "Use Mutex for thread-safe access to shared data",
  ],
  solution: `// Complete REST API implementation
use actix_web::{
    web::{self, Data, Json, Path},
    App, HttpResponse, HttpServer, Result, middleware::Logger,
    ResponseError, http::StatusCode
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::collections::HashMap;
use std::sync::Mutex;
use std::fmt;
use validator::{Validate, ValidationError};

// Models with validation
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct User {
    pub id: u32,
    pub name: String,
    pub email: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Deserialize, Validate)]
pub struct CreateUserRequest {
    #[validate(length(min = 2, max = 50))]
    pub name: String,
    #[validate(email)]
    pub email: String,
}

#[derive(Deserialize, Validate)]
pub struct UpdateUserRequest {
    #[validate(length(min = 2, max = 50))]
    pub name: Option<String>,
    #[validate(email)]
    pub email: Option<String>,
}

// Application state
pub struct AppState {
    users: Mutex<HashMap<u32, User>>,
    next_id: Mutex<u32>,
}

// Custom error types
#[derive(Debug)]
pub enum ApiError {
    ValidationError(String),
    NotFound(String),
    Conflict(String),
    InternalError(String),
}

impl fmt::Display for ApiError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ApiError::ValidationError(msg) => write!(f, "Validation Error: {}", msg),
            ApiError::NotFound(msg) => write!(f, "Not Found: {}", msg),
            ApiError::Conflict(msg) => write!(f, "Conflict: {}", msg),
            ApiError::InternalError(msg) => write!(f, "Internal Error: {}", msg),
        }
    }
}

impl ResponseError for ApiError {
    fn status_code(&self) -> StatusCode {
        match self {
            ApiError::ValidationError(_) => StatusCode::BAD_REQUEST,
            ApiError::NotFound(_) => StatusCode::NOT_FOUND,
            ApiError::Conflict(_) => StatusCode::CONFLICT,
            ApiError::InternalError(_) => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    fn error_response(&self) -> HttpResponse {
        let status = self.status_code();
        HttpResponse::build(status).json(json!({
            "error": self.to_string(),
            "status": status.as_u16()
        }))
    }
}

// Handlers with comprehensive error handling
async fn get_users(data: Data<AppState>) -> Result<HttpResponse, ApiError> {
    let users = data.users.lock().map_err(|_| {
        ApiError::InternalError("Failed to lock users".to_string())
    })?;
    
    let users_vec: Vec<User> = users.values().cloned().collect();
    Ok(HttpResponse::Ok().json(json!({
        "users": users_vec,
        "total": users_vec.len()
    })))
}

async fn get_user(path: Path<u32>, data: Data<AppState>) -> Result<HttpResponse, ApiError> {
    let user_id = path.into_inner();
    let users = data.users.lock().map_err(|_| {
        ApiError::InternalError("Failed to lock users".to_string())
    })?;
    
    users.get(&user_id)
        .cloned()
        .map(|user| HttpResponse::Ok().json(user))
        .ok_or_else(|| ApiError::NotFound(format!("User with id {} not found", user_id)))
}

async fn create_user(
    request: Json<CreateUserRequest>,
    data: Data<AppState>
) -> Result<HttpResponse, ApiError> {
    // Validate input
    request.validate().map_err(|e| {
        ApiError::ValidationError(format!("Invalid input: {:?}", e))
    })?;
    
    let mut users = data.users.lock().map_err(|_| {
        ApiError::InternalError("Failed to lock users".to_string())
    })?;
    
    let mut next_id = data.next_id.lock().map_err(|_| {
        ApiError::InternalError("Failed to lock next_id".to_string())
    })?;
    
    // Check if email already exists
    if users.values().any(|u| u.email == request.email) {
        return Err(ApiError::Conflict("Email already exists".to_string()));
    }
    
    let user = User {
        id: *next_id,
        name: request.name.clone(),
        email: request.email.clone(),
        created_at: chrono::Utc::now(),
    };
    
    users.insert(*next_id, user.clone());
    *next_id += 1;
    
    Ok(HttpResponse::Created().json(user))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    
    let app_state = Data::new(AppState {
        users: Mutex::new(HashMap::new()),
        next_id: Mutex::new(1),
    });
    
    println!("Starting REST API server at http://localhost:8080");
    println!("API endpoints:");
    println!("  GET    /api/v1/users");
    println!("  POST   /api/v1/users");
    println!("  GET    /api/v1/users/{{id}}");
    println!("  PUT    /api/v1/users/{{id}}");
    println!("  DELETE /api/v1/users/{{id}}");
    
    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .wrap(Logger::default())
            .service(
                web::scope("/api/v1")
                    .route("/users", web::get().to(get_users))
                    .route("/users", web::post().to(create_user))
                    .route("/users/{id}", web::get().to(get_user))
                    // Add other routes here
            )
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}`,
};

export default lesson;
