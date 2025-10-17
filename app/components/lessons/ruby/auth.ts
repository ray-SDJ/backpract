import { LessonData } from "../types";

const auth: LessonData = {
  title: "JWT Authentication & API Security",
  difficulty: "Advanced",
  description:
    "Implement secure JWT (JSON Web Token) authentication for Rails APIs, add authorization middleware, and follow security best practices for API endpoints.",
  objectives: [
    "Implement JWT token-based authentication",
    "Create secure user registration and login endpoints",
    "Add authentication middleware for protected routes",
    "Implement role-based authorization",
    "Follow API security best practices",
  ],
  content: `<div class="lesson-content">
    <h2>JWT Authentication & API Security</h2>
    
    <p>JWT (JSON Web Tokens) are a stateless authentication method perfect for APIs. Unlike traditional session-based authentication, JWTs contain all necessary information encoded in the token itself, making them ideal for distributed systems and mobile apps.</p>

    <h3>Setting Up JWT Authentication</h3>
    
    <p>First, let's add the JWT gem and set up our User model with secure password handling:</p>

    <pre class="code-block">
      <code>
# Gemfile
gem 'jwt'
gem 'bcrypt'  # For password encryption

# Bundle install
$ bundle install

# Generate User model
$ rails generate model User name:string email:string:uniq password_digest:string
$ rails db:migrate

# app/models/user.rb
class User < ApplicationRecord
  has_secure_password
  
  validates :name, presence: true, length: { minimum: 2 }
  validates :email, presence: true, uniqueness: true,
            format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }
  
  # JWT token generation
  def generate_jwt
    payload = {
      user_id: id,
      name: name,
      email: email,
      exp: 24.hours.from_now.to_i  # Token expires in 24 hours
    }
    
    JWT.encode(payload, Rails.application.secret_key_base)
  end
  
  # JWT token verification
  def self.from_jwt(token)
    begin
      payload = JWT.decode(token, Rails.application.secret_key_base).first
      find(payload['user_id'])
    rescue JWT::DecodeError => e
      Rails.logger.error "JWT Decode Error: #{e.message}"
      nil
    end
  end
  
  def as_json(options = {})
    super(options.merge(except: [:password_digest]))
  end
end
      </code>
    </pre>

    <h3>Authentication Controller</h3>
    
    <p>Create authentication endpoints for user registration and login:</p>

    <pre class="code-block">
      <code>
# app/controllers/api/auth_controller.rb
class Api::AuthController < ApplicationController
  skip_before_action :authenticate_user!, only: [:register, :login]
  
  # POST /api/auth/register
  def register
    user = User.new(user_params)
    
    if user.save
      token = user.generate_jwt
      
      render json: {
        status: 'success',
        message: 'User registered successfully',
        data: {
          user: user.as_json,
          token: token
        }
      }, status: :created
    else
      render json: {
        status: 'error',
        message: 'Registration failed',
        errors: user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
  
  # POST /api/auth/login
  def login
    user = User.find_by(email: params[:email])
    
    if user && user.authenticate(params[:password])
      token = user.generate_jwt
      
      render json: {
        status: 'success',
        message: 'Login successful',
        data: {
          user: user.as_json,
          token: token
        }
      }
    else
      render json: {
        status: 'error',
        message: 'Invalid email or password'
      }, status: :unauthorized
    end
  end
  
  # GET /api/auth/me (protected route)
  def me
    render json: {
      status: 'success',
      data: {
        user: current_user.as_json
      }
    }
  end
  
  private
  
  def user_params
    params.permit(:name, :email, :password, :password_confirmation)
  end
end
      </code>
    </pre>

    <h3>Authentication Middleware</h3>
    
    <p>Add authentication middleware to protect API endpoints:</p>

    <pre class="code-block">
      <code>
# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  before_action :authenticate_user!
  
  attr_reader :current_user
  
  private
  
  def authenticate_user!
    token = extract_token_from_header
    
    unless token
      render json: {
        status: 'error',
        message: 'No token provided'
      }, status: :unauthorized
      return
    end
    
    @current_user = User.from_jwt(token)
    
    unless @current_user
      render json: {
        status: 'error',
        message: 'Invalid or expired token'
      }, status: :unauthorized
    end
  end
  
  def extract_token_from_header
    auth_header = request.headers['Authorization']
    return nil unless auth_header
    
    # Extract token from "Bearer TOKEN_HERE" format
    auth_header.split(' ').last if auth_header.start_with?('Bearer ')
  end
  
  # Skip authentication for specific actions
  def skip_authentication
    skip_before_action :authenticate_user!
  end
end
      </code>
    </pre>

    <h3>Protected API Controller</h3>
    
    <p>Update your PostsController to use authentication and authorization:</p>

    <pre class="code-block">
      <code>
# app/controllers/api/posts_controller.rb
class Api::PostsController < ApplicationController
  before_action :set_post, only: [:show, :update, :destroy]
  before_action :authorize_post_owner!, only: [:update, :destroy]
  
  # GET /api/posts (public)
  def index
    posts = Post.published.includes(:user).limit(20)
    
    render json: {
      status: 'success',
      data: {
        posts: posts.map(&:as_json_with_author)
      }
    }
  end
  
  # POST /api/posts (requires authentication)
  def create
    post = current_user.posts.build(post_params)
    
    if post.save
      render json: {
        status: 'success',
        message: 'Post created successfully',
        data: post.as_json_with_author
      }, status: :created
    else
      render json: {
        status: 'error',
        message: 'Failed to create post',
        errors: post.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
  
  # PUT /api/posts/:id (requires ownership)
  def update
    if @post.update(post_params)
      render json: {
        status: 'success',
        message: 'Post updated successfully',
        data: @post.as_json_with_author
      }
    else
      render json: {
        status: 'error',
        errors: @post.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
  
  private
  
  def set_post
    @post = Post.find(params[:id])
  end
  
  def post_params
    params.require(:post).permit(:title, :content, :published)
  end
  
  def authorize_post_owner!
    unless @post.user == current_user
      render json: {
        status: 'error',
        message: 'You can only modify your own posts'
      }, status: :forbidden
    end
  end
end
      </code>
    </pre>

    <h3>API Routes Configuration</h3>
    
    <p>Set up authentication routes and protect API endpoints:</p>

    <pre class="code-block">
      <code>
# config/routes.rb
Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    # Authentication routes (public)
    namespace :auth do
      post :register
      post :login
      get :me      # Protected route
    end
    
    # Protected API resources
    resources :posts, except: [:new, :edit]
    resources :users, only: [:index, :show]
  end
end

# Check routes
$ rails routes --grep api
      </code>
    </pre>

    <h3>Testing Authentication Flow</h3>
    
    <p>Test the complete authentication workflow:</p>

    <pre class="code-block">
      <code>
# 1. Register a new user
curl -X POST http://localhost:3000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'

# Response includes token:
# {"status":"success","data":{"user":{...},"token":"JWT_TOKEN_HERE"}}

# 2. Login existing user
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# 3. Access protected route with token
curl -X GET http://localhost:3000/api/auth/me \\
  -H "Authorization: Bearer JWT_TOKEN_HERE"

# 4. Create post with authentication
curl -X POST http://localhost:3000/api/posts \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer JWT_TOKEN_HERE" \\
  -d '{
    "post": {
      "title": "My Authenticated Post",
      "content": "This post was created by an authenticated user"
    }
  }'

# 5. Try accessing protected route without token (should fail)
curl -X GET http://localhost:3000/api/auth/me
# Response: {"status":"error","message":"No token provided"}
      </code>
    </pre>

    <h3>Security Best Practices</h3>
    
    <div class="feature-list">
      <h4>Essential security measures:</h4>
      <ul>
        <li><strong>Token Expiration:</strong> Set reasonable expiration times (24 hours max)</li>
        <li><strong>HTTPS Only:</strong> Never send tokens over HTTP in production</li>
        <li><strong>Strong Passwords:</strong> Enforce minimum password requirements</li>
        <li><strong>Rate Limiting:</strong> Prevent brute force attacks on login endpoints</li>
        <li><strong>Input Validation:</strong> Always validate and sanitize user input</li>
        <li><strong>Secret Management:</strong> Use environment variables for JWT secrets</li>
      </ul>
    </div>

    <p>JWT authentication provides a scalable, stateless solution for API security while maintaining good user experience and system performance.</p>
  </div>`,
  practiceInstructions: [
    "Add jwt and bcrypt gems to your Gemfile",
    "Generate User model with name, email, and password_digest",
    "Implement JWT generation and verification methods in User model",
    "Create Api::AuthController with register, login, and me endpoints",
    "Add authentication middleware to ApplicationController",
    "Test registration, login, and protected route access with curl",
    "Implement authorization in PostsController for user-owned resources",
  ],
  hints: [
    "Use has_secure_password for password encryption",
    "Store JWT secret in Rails.application.secret_key_base",
    "Extract tokens from Authorization header with Bearer format",
    "Set token expiration to prevent indefinite access",
    "Always validate user input and return proper error messages",
  ],
  solution: `# Install gems
gem 'jwt'
bundle install

# Generate and test authentication
rails generate model User name:string email:string password_digest:string
rails db:migrate

# Test registration
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"name":"Test","email":"test@example.com","password":"password123"}'

# Test login and use token for protected routes
curl -X POST http://localhost:3000/api/auth/login -d '{"email":"test@example.com","password":"password123"}'`,
};

export default auth;
