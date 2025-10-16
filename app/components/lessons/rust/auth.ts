import { LessonData } from "../types";

const lesson: LessonData = {
  title: "Authentication & Security in Rust",
  difficulty: "Advanced",
  description:
    "Implement JWT authentication, password hashing, and security best practices in Rust applications",
  objectives: [
    "Implement JWT token-based authentication",
    "Hash and verify passwords securely",
    "Create authentication middleware",
    "Handle user sessions and authorization",
    "Apply security best practices",
  ],
  content: `# Authentication & Security in Rust

Security is critical for web applications. Rust's type system helps prevent many security issues, but we still need proper authentication and authorization.

## Dependencies

Add to Cargo.toml:
\`\`\`toml
[dependencies]
jsonwebtoken = "8.0"
bcrypt = "0.14"
chrono = { version = "0.4", features = ["serde"] }
serde = { version = "1.0", features = ["derive"] }
actix-web = "4.0"
actix-web-httpauth = "0.8"
uuid = { version = "1.0", features = ["v4", "serde"] }
\`\`\`

## User Model with Password Hashing

\`\`\`rust
use bcrypt::{hash, verify, DEFAULT_COST};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    pub username: String,
    #[serde(skip_serializing)]
    pub password_hash: String,
    pub created_at: DateTime<Utc>,
    pub is_active: bool,
    pub roles: Vec<String>,
}

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    pub username: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

impl User {
    pub fn new(email: String, username: String, password: &str) -> Result<Self, bcrypt::BcryptError> {
        let password_hash = hash(password, DEFAULT_COST)?;
        
        Ok(User {
            id: Uuid::new_v4(),
            email,
            username,
            password_hash,
            created_at: Utc::now(),
            is_active: true,
            roles: vec!["user".to_string()],
        })
    }
    
    pub fn verify_password(&self, password: &str) -> bool {
        verify(password, &self.password_hash).unwrap_or(false)
    }
    
    pub fn has_role(&self, role: &str) -> bool {
        self.roles.contains(&role.to_string())
    }
}
\`\`\`

## JWT Token Management

\`\`\`rust
use jsonwebtoken::{encode, decode, Header, Algorithm, Validation, EncodingKey, DecodingKey};
use serde::{Deserialize, Serialize};
use chrono::{Utc, Duration};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // Subject (user id)
    pub username: String,
    pub email: String,
    pub roles: Vec<String>,
    pub exp: i64, // Expiration time
    pub iat: i64, // Issued at
}

pub struct JwtManager {
    encoding_key: EncodingKey,
    decoding_key: DecodingKey,
}

impl JwtManager {
    pub fn new(secret: &[u8]) -> Self {
        Self {
            encoding_key: EncodingKey::from_secret(secret),
            decoding_key: DecodingKey::from_secret(secret),
        }
    }
    
    pub fn generate_token(&self, user: &User) -> Result<String, jsonwebtoken::errors::Error> {
        let now = Utc::now();
        let expires_at = now + Duration::hours(24); // Token valid for 24 hours
        
        let claims = Claims {
            sub: user.id.to_string(),
            username: user.username.clone(),
            email: user.email.clone(),
            roles: user.roles.clone(),
            exp: expires_at.timestamp(),
            iat: now.timestamp(),
        };
        
        encode(&Header::default(), &claims, &self.encoding_key)
    }
    
    pub fn validate_token(&self, token: &str) -> Result<Claims, jsonwebtoken::errors::Error> {
        let validation = Validation::new(Algorithm::HS256);
        decode::<Claims>(token, &self.decoding_key, &validation)
            .map(|data| data.claims)
    }
}
\`\`\`

## Authentication Middleware

\`\`\`rust
use actix_web::{
    dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform},
    Error, HttpMessage, HttpResponse,
};
use actix_web_httpauth::extractors::bearer::BearerAuth;
use futures_util::future::LocalBoxFuture;
use std::rc::Rc;

pub struct AuthMiddleware {
    jwt_manager: Rc<JwtManager>,
}

impl AuthMiddleware {
    pub fn new(jwt_manager: JwtManager) -> Self {
        Self {
            jwt_manager: Rc::new(jwt_manager),
        }
    }
}

impl<S, B> Transform<S, ServiceRequest> for AuthMiddleware
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Transform = AuthMiddlewareService<S>;
    type InitError = ();
    type Future = std::future::Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        std::future::ready(Ok(AuthMiddlewareService {
            service,
            jwt_manager: self.jwt_manager.clone(),
        }))
    }
}

pub struct AuthMiddlewareService<S> {
    service: S,
    jwt_manager: Rc<JwtManager>,
}

impl<S, B> Service<ServiceRequest> for AuthMiddlewareService<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    forward_ready!(service);

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let jwt_manager = self.jwt_manager.clone();
        
        Box::pin(async move {
            // Extract Bearer token
            if let Some(auth_header) = req.headers().get("Authorization") {
                if let Ok(auth_str) = auth_header.to_str() {
                    if auth_str.starts_with("Bearer ") {
                        let token = &auth_str[7..];
                        
                        match jwt_manager.validate_token(token) {
                            Ok(claims) => {
                                // Add claims to request extensions
                                req.extensions_mut().insert(claims);
                                return self.service.call(req).await;
                            }
                            Err(_) => {
                                return Ok(req.into_response(
                                    HttpResponse::Unauthorized()
                                        .json(serde_json::json!({"error": "Invalid token"}))
                                        .into_body()
                                ));
                            }
                        }
                    }
                }
            }
            
            // No valid token found
            Ok(req.into_response(
                HttpResponse::Unauthorized()
                    .json(serde_json::json!({"error": "Missing or invalid authentication"}))
                    .into_body()
            ))
        })
    }
}
\`\`\`

## Authentication Handlers

\`\`\`rust
use actix_web::{web, HttpResponse, Result};

async fn register(
    request: web::Json<RegisterRequest>,
    jwt_manager: web::Data<JwtManager>,
    // user_repository: web::Data<UserRepository>, // Your database layer
) -> Result<HttpResponse> {
    // Validate input
    if request.password.len() < 8 {
        return Ok(HttpResponse::BadRequest().json(serde_json::json!({
            "error": "Password must be at least 8 characters"
        })));
    }
    
    // Check if user already exists (implement with your database)
    // if user_repository.find_by_email(&request.email).await.is_ok() {
    //     return Ok(HttpResponse::Conflict().json(serde_json::json!({
    //         "error": "User already exists"
    //     })));
    // }
    
    // Create new user
    match User::new(request.email.clone(), request.username.clone(), &request.password) {
        Ok(user) => {
            // Save user to database
            // user_repository.create(&user).await?;
            
            // Generate JWT token
            match jwt_manager.generate_token(&user) {
                Ok(token) => Ok(HttpResponse::Created().json(serde_json::json!({
                    "user": user,
                    "token": token
                }))),
                Err(_) => Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                    "error": "Failed to generate token"
                })))
            }
        }
        Err(_) => Ok(HttpResponse::InternalServerError().json(serde_json::json!({
            "error": "Failed to create user"
        })))
    }
}

async fn login(
    request: web::Json<LoginRequest>,
    jwt_manager: web::Data<JwtManager>,
    // user_repository: web::Data<UserRepository>,
) -> Result<HttpResponse> {
    // Find user by email (implement with your database)
    // let user = match user_repository.find_by_email(&request.email).await {
    //     Ok(user) => user,
    //     Err(_) => return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
    //         "error": "Invalid credentials"
    //     })))
    // };
    
    // For demo purposes, create a mock user
    let user = User::new(
        request.email.clone(),
        "demo_user".to_string(),
        &request.password
    ).unwrap();
    
    // Verify password
    if !user.verify_password(&request.password) {
        return Ok(HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Invalid credentials"
        })));
    }
    
    // Generate JWT token
    match jwt_manager.generate_token(&user) {
        Ok(token) => Ok(HttpResponse::Ok().json(serde_json::json!({
            "user": user,
            "token": token
        }))),
        Err(_) => Ok(HttpResponse::InternalServerError().json(serde_json::json!({
            "error": "Failed to generate token"
        })))
    }
}

async fn profile(req: actix_web::HttpRequest) -> Result<HttpResponse> {
    // Extract claims from middleware
    if let Some(claims) = req.extensions().get::<Claims>() {
        Ok(HttpResponse::Ok().json(serde_json::json!({
            "user_id": claims.sub,
            "username": claims.username,
            "email": claims.email,
            "roles": claims.roles
        })))
    } else {
        Ok(HttpResponse::Unauthorized().json(serde_json::json!({
            "error": "Authentication required"
        })))
    }
}
\`\`\``,
  practiceInstructions: [
    "Set up bcrypt for password hashing",
    "Implement JWT token generation and validation",
    "Create User model with secure password storage",
    "Build authentication middleware",
    "Implement register and login endpoints",
    "Test the complete authentication flow",
  ],
  hints: [
    "Never store plain text passwords - always hash them",
    "Use a strong secret key for JWT signing",
    "Set appropriate token expiration times",
    "Validate all user input thoroughly",
    "Use HTTPS in production for token transmission",
  ],
  solution: `// Complete authentication system
use actix_web::{web, App, HttpServer, HttpResponse, Result, middleware::Logger};
use serde_json::json;
use std::env;

// Main application setup
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    
    // JWT secret (use environment variable in production)
    let jwt_secret = env::var("JWT_SECRET")
        .unwrap_or_else(|_| "your-secret-key".to_string());
    
    let jwt_manager = web::Data::new(JwtManager::new(jwt_secret.as_bytes()));
    
    println!("Starting authentication server at http://localhost:8080");
    println!("Endpoints:");
    println!("  POST /auth/register - Register new user");
    println!("  POST /auth/login    - Login user");
    println!("  GET  /auth/profile  - Get user profile (requires token)");
    
    HttpServer::new(move || {
        App::new()
            .app_data(jwt_manager.clone())
            .wrap(Logger::default())
            .service(
                web::scope("/auth")
                    .route("/register", web::post().to(register))
                    .route("/login", web::post().to(login))
                    .route("/profile", web::get().to(profile))
                        .wrap(AuthMiddleware::new(/* jwt_manager */))
            )
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}

// Usage example with curl:
// Register: curl -X POST http://localhost:8080/auth/register -H "Content-Type: application/json" -d '{"email":"user@example.com","username":"testuser","password":"password123"}'
// Login: curl -X POST http://localhost:8080/auth/login -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"password123"}'
// Profile: curl -X GET http://localhost:8080/auth/profile -H "Authorization: Bearer YOUR_JWT_TOKEN"`,
};

export default lesson;
