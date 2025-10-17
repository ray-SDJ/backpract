import React from "react";
import { Shield } from "lucide-react";

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

export const AuthSection = {
  id: "auth",
  title: "Rails Authentication & Security",
  icon: Shield,
  overview:
    "Implement JWT authentication, password hashing, and secure your Rails API",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">JWT Authentication in Rails</h3>
        <p className="text-gray-700 mb-3">
          Implement token-based authentication using JSON Web Tokens (JWT) for
          stateless API authentication.
        </p>
        <CodeExplanation
          code={`# Gemfile
gem 'bcrypt'
gem 'jwt'

# app/models/user.rb
class User < ApplicationRecord
  has_secure_password
  
  has_many :posts, dependent: :destroy
  
  validates :email, presence: true, uniqueness: true,
                    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true, length: { minimum: 2 }
  validates :password, length: { minimum: 6 }, if: :password_digest_changed?
  
  # Generate JWT token
  def generate_jwt
    payload = {
      user_id: id,
      email: email,
      exp: 24.hours.from_now.to_i
    }
    
    JWT.encode(payload, Rails.application.secret_key_base)
  end
  
  # Decode and find user from token
  def self.from_jwt(token)
    decoded = JWT.decode(token, Rails.application.secret_key_base).first
    find_by(id: decoded['user_id'])
  rescue JWT::DecodeError, ActiveRecord::RecordNotFound
    nil
  end
  
  def as_json_auth
    {
      id: id,
      email: email,
      name: name,
      created_at: created_at.iso8601
    }
  end
end

# app/controllers/api/auth_controller.rb
class Api::AuthController < ApplicationController
  skip_before_action :authenticate_user!, only: [:register, :login]
  
  # POST /api/auth/register
  def register
    user = User.new(user_params)
    
    if user.save
      token = user.generate_jwt
      render json: {
        user: user.as_json_auth,
        token: token
      }, status: :created
    else
      render json: { 
        errors: user.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end
  
  # POST /api/auth/login
  def login
    user = User.find_by(email: params[:email])
    
    if user&.authenticate(params[:password])
      token = user.generate_jwt
      render json: {
        user: user.as_json_auth,
        token: token
      }
    else
      render json: { 
        error: 'Invalid email or password' 
      }, status: :unauthorized
    end
  end
  
  # GET /api/auth/me
  def me
    render json: { user: current_user.as_json_auth }
  end
  
  private
  
  def user_params
    params.require(:user).permit(:email, :name, :password, :password_confirmation)
  end
end`}
          explanation={[
            {
              label: "has_secure_password",
              desc: "Rails method that adds password encryption using bcrypt",
            },
            {
              label: "JWT.encode(payload, secret)",
              desc: "Creates a signed token with user data and expiration",
            },
            {
              label: "user&.authenticate(password)",
              desc: "Safe navigation operator checks if user exists then verifies password",
            },
            {
              label: "skip_before_action :authenticate_user!",
              desc: "Allows unauthenticated access to register and login",
            },
            {
              label: "exp: 24.hours.from_now.to_i",
              desc: "Token expires 24 hours from creation",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">Authentication Middleware</h3>
        <CodeExplanation
          code={`# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  before_action :authenticate_user!
  
  attr_reader :current_user
  
  private
  
  def authenticate_user!
    token = extract_token_from_header
    
    unless token
      render json: { error: 'No token provided' }, status: :unauthorized
      return
    end
    
    @current_user = User.from_jwt(token)
    
    unless @current_user
      render json: { error: 'Invalid or expired token' }, status: :unauthorized
    end
  end
  
  def extract_token_from_header
    auth_header = request.headers['Authorization']
    return nil unless auth_header&.start_with?('Bearer ')
    
    auth_header.split(' ').last
  end
  
  def require_admin!
    unless current_user&.admin?
      render json: { error: 'Admin access required' }, status: :forbidden
    end
  end
end

# app/controllers/api/posts_controller.rb
class Api::PostsController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show]
  before_action :set_post, only: [:show, :update, :destroy]
  before_action :authorize_post_owner!, only: [:update, :destroy]
  
  def create
    post = current_user.posts.build(post_params)
    
    if post.save
      render json: { data: post.as_json_detailed }, status: :created
    else
      render json: { errors: post.errors.full_messages }, 
             status: :unprocessable_entity
    end
  end
  
  def update
    if @post.update(post_params)
      render json: { data: @post.as_json_detailed }
    else
      render json: { errors: @post.errors.full_messages },
             status: :unprocessable_entity
    end
  end
  
  def destroy
    @post.destroy
    head :no_content
  end
  
  private
  
  def authorize_post_owner!
    unless @post.user_id == current_user.id
      render json: { 
        error: 'You can only modify your own posts' 
      }, status: :forbidden
    end
  end
  
  def set_post
    @post = Post.find(params[:id])
  end
  
  def post_params
    params.require(:post).permit(:title, :content, :published)
  end
end`}
          explanation={[
            {
              label: "before_action :authenticate_user!",
              desc: "Runs authentication check before every controller action",
            },
            {
              label: "attr_reader :current_user",
              desc: "Creates getter method for @current_user instance variable",
            },
            {
              label: "skip_before_action :authenticate_user!",
              desc: "Skips authentication for public endpoints",
            },
            {
              label: "authorize_post_owner!",
              desc: "Custom authorization to ensure users can only edit their own posts",
            },
            {
              label: "current_user.posts.build",
              desc: "Automatically associates new post with authenticated user",
            },
          ]}
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">
          🔒 Security Best Practices
        </h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>
            • Never store passwords in plain text - use has_secure_password
          </li>
          <li>• Use strong secret keys for JWT signing</li>
          <li>• Implement token expiration (24 hours recommended)</li>
          <li>• Use HTTPS in production to protect tokens in transit</li>
          <li>• Implement role-based authorization (admin, user, etc.)</li>
          <li>• Enable CORS properly for API access</li>
        </ul>
      </div>
    </div>
  ),
};
