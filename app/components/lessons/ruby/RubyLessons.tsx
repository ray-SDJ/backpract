"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Zap,
  Database,
  Lock,
  Code2,
  ChevronDown,
} from "lucide-react";

// TypeScript interfaces
interface CodeExplanationProps {
  code: string;
  explanation: Array<{ label: string; desc: string }>;
}

interface SectionProps {
  section: {
    id: string;
    title: string;
    icon: React.ElementType;
    overview: string;
    content: React.ReactNode;
  };
}

export default function RubyTutorial() {
  const [expandedSection, setExpandedSection] = useState<string>("intro");

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

  const sections = [
    {
      id: "intro",
      title: "Introduction to Ruby on Rails",
      icon: BookOpen,
      overview:
        "Ruby on Rails is a server-side web application framework that emphasizes convention over configuration and follows the DRY (Don&apos;t Repeat Yourself) principle.",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">What is Ruby on Rails?</h3>
            <p className="text-gray-700 mb-3">
              Ruby on Rails (Rails) is a full-stack web framework written in
              Ruby that follows the Model-View-Controller (MVC) architectural
              pattern. It&apos;s designed for programmer happiness and
              sustainable productivity.
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
              <li>
                <strong>Convention over Configuration:</strong> Sensible
                defaults reduce decisions
              </li>
              <li>
                <strong>DRY Principle:</strong> Don&apos;t repeat yourself -
                write once, use everywhere
              </li>
              <li>
                <strong>Active Record:</strong> Elegant ORM with intuitive
                database interactions
              </li>
              <li>
                <strong>Built-in testing:</strong> Testing framework included
                out of the box
              </li>
              <li>
                <strong>Rapid development:</strong> Get applications up and
                running quickly
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">
              Your First Rails Application
            </h3>
            <CodeExplanation
              code={`# Install Rails
$ gem install rails

# Create new Rails app
$ rails new blog --api --database=postgresql
$ cd blog
$ rails server

# Generate API controller
$ rails generate controller Api::Posts index show create update destroy

# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    resources :posts
  end
  
  # Health check endpoint
  get '/health', to: proc { [200, {}, ['OK']] }
end

# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  before_action :set_default_response_format
  
  private
  
  def set_default_response_format
    request.format = :json
  end
  
  def render_error(message, status = :unprocessable_entity)
    render json: { error: message }, status: status
  end
  
  def render_success(data, status = :ok)
    render json: { data: data }, status: status
  end
end

# app/controllers/api/posts_controller.rb
class Api::PostsController < ApplicationController
  before_action :set_post, only: [:show, :update, :destroy]
  
  # GET /api/posts
  def index
    @posts = Post.published.recent.includes(:author)
    
    render_success({
      posts: @posts.map(&:as_json_summary),
      count: @posts.count,
      timestamp: Time.current.iso8601
    })
  end
  
  # GET /api/posts/1
  def show
    render_success(@post.as_json_detailed)
  end
  
  # POST /api/posts
  def create
    @post = Post.new(post_params)
    
    if @post.save
      render_success(@post.as_json_detailed, :created)
    else
      render_error(@post.errors.full_messages.join(', '))
    end
  end
  
  private
  
  def set_post
    @post = Post.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render_error('Post not found', :not_found)
  end
  
  def post_params
    params.require(:post).permit(:title, :content, :published)
  end
end`}
              explanation={[
                {
                  label: "rails new blog --api",
                  desc: "Create API-only Rails app without views and frontend assets",
                },
                {
                  label: "namespace :api",
                  desc: "Group routes under /api prefix for API versioning",
                },
                {
                  label: "before_action :set_post",
                  desc: "Run callback before specified controller actions",
                },
                {
                  label: "params.require(:post).permit()",
                  desc: "Strong parameters for mass assignment protection",
                },
                {
                  label: "ActiveRecord::RecordNotFound",
                  desc: "Handle database record not found exceptions",
                },
              ]}
            />
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">💡 Quick Test</h4>
            <p className="text-sm text-green-800">
              Run with{" "}
              <code className="bg-white px-2 py-1 rounded">rails server</code>,
              then visit{" "}
              <code className="bg-white px-2 py-1 rounded">
                http://localhost:3000/api/posts
              </code>
            </p>
          </div>
        </div>
      ),
    },

    {
      id: "activerecord",
      title: "Active Record & Database",
      icon: Database,
      overview:
        "Master Rails&apos; Active Record ORM for elegant database interactions, associations, validations, and queries.",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Models & Migrations</h3>
            <CodeExplanation
              code={`# Generate model with migration
$ rails generate model Post title:string content:text published:boolean author:references

# db/migrate/create_posts.rb
class CreatePosts < ActiveRecord::Migration[7.0]
  def change
    create_table :posts do |t|
      t.string :title, null: false
      t.text :content, null: false
      t.boolean :published, default: false
      t.references :author, null: false, foreign_key: { to_table: :users }
      t.string :slug
      t.integer :views_count, default: 0
      t.timestamps
    end
    
    add_index :posts, :slug, unique: true
    add_index :posts, [:published, :created_at]
    add_index :posts, :author_id
  end
end

# app/models/post.rb
class Post < ApplicationRecord
  belongs_to :author, class_name: 'User'
  has_many :comments, dependent: :destroy
  has_and_belongs_to_many :tags
  
  # Validations
  validates :title, presence: true, length: { minimum: 3, maximum: 100 }
  validates :content, presence: true, length: { minimum: 10 }
  validates :slug, uniqueness: true, allow_blank: true
  
  # Callbacks
  before_validation :generate_slug, if: :title_changed?
  after_create :increment_author_posts_count
  
  # Scopes
  scope :published, -> { where(published: true) }
  scope :recent, -> { order(created_at: :desc) }
  scope :by_author, ->(author) { where(author: author) }
  scope :with_tags, -> { joins(:tags).distinct }
  
  # Instance methods
  def published?
    published
  end
  
  def excerpt(limit = 150)
    content.truncate(limit)
  end
  
  def reading_time
    words_per_minute = 200
    word_count = content.split.size
    (word_count / words_per_minute.to_f).ceil
  end
  
  def as_json_summary
    {
      id: id,
      title: title,
      slug: slug,
      excerpt: excerpt,
      published: published?,
      views_count: views_count,
      reading_time: reading_time,
      created_at: created_at.iso8601,
      author: {
        id: author.id,
        name: author.name
      }
    }
  end
  
  def as_json_detailed
    as_json_summary.merge({
      content: content,
      updated_at: updated_at.iso8601,
      tags: tags.pluck(:name),
      comments_count: comments.count
    })
  end
  
  private
  
  def generate_slug
    self.slug = title.parameterize if title.present?
  end
  
  def increment_author_posts_count
    author.increment!(:posts_count)
  end
end

# app/models/user.rb
class User < ApplicationRecord
  has_many :posts, foreign_key: 'author_id', dependent: :destroy
  has_many :comments, dependent: :destroy
  
  validates :name, presence: true, length: { minimum: 2, maximum: 50 }
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  
  # Virtual attributes
  def full_name
    "\#{first_name} \#{last_name}".strip
  end
  
  def published_posts
    posts.published
  end
end

# app/models/tag.rb
class Tag < ApplicationRecord
  has_and_belongs_to_many :posts
  
  validates :name, presence: true, uniqueness: true
  
  scope :popular, -> { joins(:posts).group('tags.id').order('COUNT(posts.id) DESC') }
end`}
              explanation={[
                {
                  label: "belongs_to :author, class_name: 'User'",
                  desc: "Define association with custom class name mapping",
                },
                {
                  label: "has_many :comments, dependent: :destroy",
                  desc: "Delete associated records when parent is deleted",
                },
                {
                  label: "before_validation :generate_slug",
                  desc: "Run callback before validation occurs",
                },
                {
                  label: "scope :published, -> { where(published: true) }",
                  desc: "Define reusable query scopes with lambda syntax",
                },
                {
                  label: "validates :title, presence: true",
                  desc: "Add validation rules for model attributes",
                },
              ]}
            />
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">
              Advanced Queries & Performance
            </h3>
            <CodeExplanation
              code={`# Updated Posts Controller with advanced queries
class Api::PostsController < ApplicationController
  before_action :set_post, only: [:show, :update, :destroy]
  
  def index
    @posts = Post.includes(:author, :tags)
                 .published
                 .recent
    
    # Search functionality
    if params[:search].present?
      @posts = @posts.where("title ILIKE ? OR content ILIKE ?", 
                           "%\#{params[:search]}%", "%\#{params[:search]}%")
    end
    
    # Filter by tag
    if params[:tag].present?
      @posts = @posts.joins(:tags).where(tags: { name: params[:tag] })
    end
    
    # Filter by author
    if params[:author_id].present?
      @posts = @posts.where(author_id: params[:author_id])
    end
    
    # Pagination
    page = params[:page]&.to_i || 1
    per_page = params[:per_page]&.to_i || 10
    per_page = [per_page, 50].min # Limit max per_page
    
    @posts = @posts.limit(per_page).offset((page - 1) * per_page)
    total_count = Post.published.count
    
    render_success({
      posts: @posts.map(&:as_json_summary),
      pagination: {
        current_page: page,
        per_page: per_page,
        total_count: total_count,
        total_pages: (total_count.to_f / per_page).ceil
      }
    })
  end
  
  def show
    # Increment view count
    @post.increment!(:views_count)
    
    render_success(@post.as_json_detailed)
  end
  
  def create
    @post = Post.new(post_params)
    @post.author = current_user # Assuming authentication
    
    Post.transaction do
      if @post.save
        # Associate tags
        if params[:tag_names].present?
          tag_names = params[:tag_names].split(',').map(&:strip)
          tags = tag_names.map { |name| Tag.find_or_create_by(name: name) }
          @post.tags = tags
        end
        
        render_success(@post.as_json_detailed, :created)
      else
        render_error(@post.errors.full_messages.join(', '))
      end
    end
  rescue => e
    Rails.logger.error "Post creation failed: \#{e.message}"
    render_error('Failed to create post', :internal_server_error)
  end
  
  def update
    Post.transaction do
      if @post.update(post_params)
        # Update tags if provided
        if params[:tag_names].present?
          tag_names = params[:tag_names].split(',').map(&:strip)
          tags = tag_names.map { |name| Tag.find_or_create_by(name: name) }
          @post.tags = tags
        end
        
        render_success(@post.as_json_detailed)
      else
        render_error(@post.errors.full_messages.join(', '))
      end
    end
  end
  
  def destroy
    @post.destroy
    head :no_content
  end
  
  private
  
  def set_post
    @post = Post.includes(:author, :tags, :comments)
                .find_by(id: params[:id])
    
    render_error('Post not found', :not_found) unless @post
  end
  
  def post_params
    params.require(:post).permit(:title, :content, :published)
  end
end

# Add to config/application.rb for better performance
config.active_record.strict_loading_by_default = true

# Database indexes for better query performance
class AddIndexesToPosts < ActiveRecord::Migration[7.0]
  def change
    add_index :posts, [:author_id, :published, :created_at]
    add_index :posts, :slug
    add_index :posts, "to_tsvector('english', title || ' ' || content)", 
              using: :gin, name: 'posts_search_idx'
  end
end`}
              explanation={[
                {
                  label: "Post.includes(:author, :tags)",
                  desc: "Eager load associations to prevent N+1 queries",
                },
                {
                  label: "where('title ILIKE ?')",
                  desc: "Case-insensitive search with parameterized queries",
                },
                {
                  label: "Post.transaction do",
                  desc: "Wrap multiple database operations in transaction",
                },
                {
                  label: "Tag.find_or_create_by(name: name)",
                  desc: "Find existing record or create new one atomically",
                },
                {
                  label: "strict_loading_by_default = true",
                  desc: "Prevent N+1 queries by raising errors on lazy loading",
                },
              ]}
            />
          </div>
        </div>
      ),
    },

    {
      id: "authentication",
      title: "Authentication & Authorization",
      icon: Lock,
      overview:
        "Implement secure authentication with JWT tokens and role-based authorization in Rails applications.",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">JWT Authentication Setup</h3>
            <CodeExplanation
              code={`# Gemfile
gem 'jwt'
gem 'bcrypt'

# app/models/user.rb
class User < ApplicationRecord
  has_secure_password
  
  has_many :posts, foreign_key: 'author_id', dependent: :destroy
  
  validates :email, presence: true, uniqueness: true, 
                   format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true, length: { minimum: 2, maximum: 50 }
  validates :password, length: { minimum: 6 }, if: :password_required?
  
  enum role: { user: 0, admin: 1, moderator: 2 }
  
  # Generate JWT token
  def generate_jwt_token
    payload = {
      user_id: id,
      email: email,
      role: role,
      exp: 24.hours.from_now.to_i
    }
    
    JWT.encode(payload, Rails.application.secret_key_base)
  end
  
  # Decode JWT token
  def self.decode_jwt_token(token)
    decoded = JWT.decode(token, Rails.application.secret_key_base).first
    find(decoded['user_id'])
  rescue JWT::DecodeError, ActiveRecord::RecordNotFound
    nil
  end
  
  def as_json_auth
    {
      id: id,
      email: email,
      name: name,
      role: role,
      created_at: created_at.iso8601
    }
  end
  
  private
  
  def password_required?
    new_record? || password.present?
  end
end

# app/controllers/api/auth_controller.rb
class Api::AuthController < ApplicationController
  before_action :authenticate_user!, only: [:me, :logout]
  
  # POST /api/auth/register
  def register
    @user = User.new(user_params)
    
    if @user.save
      token = @user.generate_jwt_token
      
      render_success({
        user: @user.as_json_auth,
        token: token,
        token_type: 'Bearer'
      }, :created)
    else
      render_error(@user.errors.full_messages.join(', '))
    end
  end
  
  # POST /api/auth/login
  def login
    @user = User.find_by(email: params[:email])
    
    if @user&.authenticate(params[:password])
      token = @user.generate_jwt_token
      
      render_success({
        user: @user.as_json_auth,
        token: token,
        token_type: 'Bearer'
      })
    else
      render_error('Invalid email or password', :unauthorized)
    end
  end
  
  # GET /api/auth/me
  def me
    render_success(current_user.as_json_auth)
  end
  
  # DELETE /api/auth/logout
  def logout
    # JWT is stateless, so logout is handled client-side
    render_success({ message: 'Successfully logged out' })
  end
  
  private
  
  def user_params
    params.require(:user).permit(:email, :name, :password, :password_confirmation)
  end
end`}
              explanation={[
                {
                  label: "has_secure_password",
                  desc: "Rails method that adds password encryption and validation",
                },
                {
                  label: "enum role: { user: 0, admin: 1 }",
                  desc: "Define enumerated values for user roles",
                },
                {
                  label: "JWT.encode(payload, secret)",
                  desc: "Create JWT token with payload and secret key",
                },
                {
                  label: "@user&.authenticate(password)",
                  desc: "Safe navigation and password verification",
                },
                {
                  label: "before_action :authenticate_user!",
                  desc: "Require authentication for specific controller actions",
                },
              ]}
            />
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">
              Authentication Middleware & Authorization
            </h3>
            <CodeExplanation
              code={`# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  before_action :set_default_response_format
  
  attr_reader :current_user
  
  private
  
  def set_default_response_format
    request.format = :json
  end
  
  def authenticate_user!
    token = extract_token_from_header
    
    if token.blank?
      render_error('No token provided', :unauthorized)
      return
    end
    
    @current_user = User.decode_jwt_token(token)
    
    if @current_user.nil?
      render_error('Invalid or expired token', :unauthorized)
      return
    end
  end
  
  def require_admin!
    authenticate_user!
    return if performed? # Stop if authentication failed
    
    unless current_user.admin?
      render_error('Admin access required', :forbidden)
    end
  end
  
  def require_owner_or_admin!(resource)
    authenticate_user!
    return if performed?
    
    unless resource.author == current_user || current_user.admin?
      render_error('Access denied', :forbidden)
    end
  end
  
  def extract_token_from_header
    auth_header = request.headers['Authorization']
    return nil unless auth_header&.start_with?('Bearer ')
    
    auth_header.split(' ').last
  end
  
  def render_error(message, status = :unprocessable_entity)
    render json: { 
      error: message,
      timestamp: Time.current.iso8601
    }, status: status
  end
  
  def render_success(data, status = :ok)
    render json: { 
      data: data,
      timestamp: Time.current.iso8601
    }, status: status
  end
end

# Updated Posts Controller with authorization
class Api::PostsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :set_post, only: [:show, :update, :destroy]
  before_action :check_post_ownership!, only: [:update, :destroy]
  
  def index
    # Public endpoint - no authentication required
    @posts = Post.includes(:author, :tags).published.recent
    
    # Apply filters and pagination as before...
    render_success({
      posts: @posts.map(&:as_json_summary),
      pagination: pagination_data
    })
  end
  
  def show
    # Public endpoint - increment view count
    @post.increment!(:views_count)
    render_success(@post.as_json_detailed)
  end
  
  def create
    @post = current_user.posts.build(post_params)
    
    if @post.save
      # Handle tags...
      render_success(@post.as_json_detailed, :created)
    else
      render_error(@post.errors.full_messages.join(', '))
    end
  end
  
  def update
    if @post.update(post_params)
      render_success(@post.as_json_detailed)
    else
      render_error(@post.errors.full_messages.join(', '))
    end
  end
  
  def destroy
    @post.destroy
    head :no_content
  end
  
  private
  
  def set_post
    @post = Post.includes(:author, :tags).find_by(id: params[:id])
    render_error('Post not found', :not_found) unless @post
  end
  
  def check_post_ownership!
    return if performed? # Stop if set_post failed
    
    unless @post.author == current_user || current_user.admin?
      render_error('You can only modify your own posts', :forbidden)
    end
  end
  
  def post_params
    params.require(:post).permit(:title, :content, :published)
  end
end

# Admin-only controller
class Api::Admin::PostsController < ApplicationController
  before_action :require_admin!
  
  def index
    @posts = Post.includes(:author, :tags).recent
    render_success(@posts.map(&:as_json_detailed))
  end
  
  def destroy
    @post = Post.find(params[:id])
    @post.destroy
    head :no_content
  end
end`}
              explanation={[
                {
                  label: "attr_reader :current_user",
                  desc: "Create getter method for current_user instance variable",
                },
                {
                  label: "return if performed?",
                  desc: "Stop execution if response has already been rendered",
                },
                {
                  label: "current_user.posts.build()",
                  desc: "Build new post associated with current user",
                },
                {
                  label: "unless current_user.admin?",
                  desc: "Check user role for authorization",
                },
                {
                  label: "before_action :check_post_ownership!",
                  desc: "Ensure user can only modify their own resources",
                },
              ]}
            />
          </div>
        </div>
      ),
    },

    {
      id: "testing",
      title: "Testing & API Documentation",
      icon: Zap,
      overview:
        "Write comprehensive tests with RSpec and document your APIs for better maintainability and collaboration.",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">RSpec Testing Setup</h3>
            <CodeExplanation
              code={`# Gemfile (test group)
group :development, :test do
  gem 'rspec-rails'
  gem 'factory_bot_rails'
  gem 'faker'
end

group :test do
  gem 'shoulda-matchers'
  gem 'database_cleaner-active_record'
end

# Generate RSpec configuration
$ rails generate rspec:install

# spec/rails_helper.rb
require 'spec_helper'
ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
abort("The Rails environment is running in production mode!") if Rails.env.production?
require 'rspec/rails'

# Database cleaner configuration
RSpec.configure do |config|
  config.use_transactional_fixtures = false
  config.include FactoryBot::Syntax::Methods
  
  config.before(:suite) do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.clean_with(:truncation)
  end
  
  config.around(:each) do |example|
    DatabaseCleaner.cleaning do
      example.run
    end
  end
end

# Shoulda matchers configuration
Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
  end
end

# spec/factories/users.rb
FactoryBot.define do
  factory :user do
    name { Faker::Name.name }
    email { Faker::Internet.unique.email }
    password { 'password123' }
    password_confirmation { 'password123' }
    
    trait :admin do
      role { 'admin' }
    end
    
    trait :with_posts do
      after(:create) do |user|
        create_list(:post, 3, author: user)
      end
    end
  end
end

# spec/factories/posts.rb
FactoryBot.define do
  factory :post do
    title { Faker::Lorem.sentence(word_count: 4) }
    content { Faker::Lorem.paragraphs(number: 3).join("\\n\\n") }
    published { true }
    association :author, factory: :user
    
    trait :draft do
      published { false }
    end
    
    trait :with_tags do
      after(:create) do |post|
        post.tags = create_list(:tag, 2)
      end
    end
  end
end

# spec/models/post_spec.rb
RSpec.describe Post, type: :model do
  describe 'associations' do
    it { should belong_to(:author).class_name('User') }
    it { should have_many(:comments).dependent(:destroy) }
    it { should have_and_belong_to_many(:tags) }
  end
  
  describe 'validations' do
    it { should validate_presence_of(:title) }
    it { should validate_length_of(:title).is_at_least(3).is_at_most(100) }
    it { should validate_presence_of(:content) }
    it { should validate_length_of(:content).is_at_least(10) }
    it { should validate_uniqueness_of(:slug).allow_blank }
  end
  
  describe 'scopes' do
    let!(:published_post) { create(:post, published: true) }
    let!(:draft_post) { create(:post, published: false) }
    
    it 'returns only published posts' do
      expect(Post.published).to include(published_post)
      expect(Post.published).not_to include(draft_post)
    end
    
    it 'orders posts by creation date descending' do
      older_post = create(:post, created_at: 1.day.ago)
      newer_post = create(:post, created_at: 1.hour.ago)
      
      expect(Post.recent.first).to eq(newer_post)
      expect(Post.recent.last).to eq(older_post)
    end
  end
  
  describe 'callbacks' do
    it 'generates slug from title' do
      post = create(:post, title: 'My Amazing Post')
      expect(post.slug).to eq('my-amazing-post')
    end
  end
  
  describe 'instance methods' do
    let(:post) { create(:post) }
    
    describe '#excerpt' do
      it 'returns truncated content' do
        post.update(content: 'A' * 200)
        expect(post.excerpt(50).length).to be <= 53 # includes '...'
      end
    end
    
    describe '#reading_time' do
      it 'calculates reading time based on word count' do
        post.update(content: 'word ' * 400) # 400 words
        expect(post.reading_time).to eq(2) # 400/200 = 2 minutes
      end
    end
  end
end`}
              explanation={[
                {
                  label: "FactoryBot.define",
                  desc: "Define factories for creating test objects with realistic data",
                },
                {
                  label: "trait :admin",
                  desc: "Define variations of factory objects for different test scenarios",
                },
                {
                  label: "it { should validate_presence_of(:title) }",
                  desc: "Shoulda matchers for concise validation testing",
                },
                {
                  label: "let!(:published_post)",
                  desc: "Create objects before each test (! forces immediate creation)",
                },
                {
                  label: "expect(Post.published).to include(published_post)",
                  desc: "Test that scope returns expected records",
                },
              ]}
            />
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">API Integration Tests</h3>
            <CodeExplanation
              code={`# spec/requests/api/posts_spec.rb
RSpec.describe 'Api::Posts', type: :request do
  let(:user) { create(:user) }
  let(:admin) { create(:user, :admin) }
  let(:auth_headers) { { 'Authorization' => "Bearer \#{user.generate_jwt_token}" } }
  let(:admin_headers) { { 'Authorization' => "Bearer \#{admin.generate_jwt_token}" } }
  
  describe 'GET /api/posts' do
    let!(:published_posts) { create_list(:post, 3, published: true) }
    let!(:draft_posts) { create_list(:post, 2, published: false) }
    
    it 'returns only published posts' do
      get '/api/posts'
      
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      
      expect(json['data']['posts'].length).to eq(3)
      expect(json['data']['posts'].all? { |p| p['published'] }).to be true
    end
    
    it 'supports search functionality' do
      searchable_post = create(:post, title: 'Unique Search Title', published: true)
      
      get '/api/posts', params: { search: 'Unique Search' }
      
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      
      expect(json['data']['posts'].length).to eq(1)
      expect(json['data']['posts'].first['title']).to eq('Unique Search Title')
    end
    
    it 'supports pagination' do
      create_list(:post, 15, published: true)
      
      get '/api/posts', params: { page: 2, per_page: 5 }
      
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      
      expect(json['data']['posts'].length).to eq(5)
      expect(json['data']['pagination']['current_page']).to eq(2)
      expect(json['data']['pagination']['per_page']).to eq(5)
    end
  end
  
  describe 'POST /api/posts' do
    let(:valid_attributes) do
      {
        post: {
          title: 'New Post Title',
          content: 'This is the content of the new post.',
          published: true
        }
      }
    end
    
    context 'when authenticated' do
      it 'creates a new post' do
        expect {
          post '/api/posts', params: valid_attributes, headers: auth_headers
        }.to change(Post, :count).by(1)
        
        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        
        expect(json['data']['title']).to eq('New Post Title')
        expect(json['data']['author']['id']).to eq(user.id)
      end
      
      it 'returns validation errors for invalid data' do
        invalid_attributes = { post: { title: '', content: 'x' } }
        
        post '/api/posts', params: invalid_attributes, headers: auth_headers
        
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        
        expect(json['error']).to include('Title')
        expect(json['error']).to include('Content')
      end
    end
    
    context 'when not authenticated' do
      it 'returns unauthorized error' do
        post '/api/posts', params: valid_attributes
        
        expect(response).to have_http_status(:unauthorized)
        json = JSON.parse(response.body)
        
        expect(json['error']).to eq('No token provided')
      end
    end
  end
  
  describe 'PUT /api/posts/:id' do
    let(:post_record) { create(:post, author: user) }
    let(:other_user_post) { create(:post) }
    
    it 'updates own post' do
      put "/api/posts/\#{post_record.id}", 
          params: { post: { title: 'Updated Title' } },
          headers: auth_headers
      
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      
      expect(json['data']['title']).to eq('Updated Title')
      expect(post_record.reload.title).to eq('Updated Title')
    end
    
    it 'prevents updating other users posts' do
      put "/api/posts/\#{other_user_post.id}",
          params: { post: { title: 'Hacked Title' } },
          headers: auth_headers
      
      expect(response).to have_http_status(:forbidden)
      json = JSON.parse(response.body)
      
      expect(json['error']).to include('modify your own posts')
    end
    
    it 'allows admin to update any post' do
      put "/api/posts/\#{other_user_post.id}",
          params: { post: { title: 'Admin Updated' } },
          headers: admin_headers
      
      expect(response).to have_http_status(:ok)
      expect(other_user_post.reload.title).to eq('Admin Updated')
    end
  end
end`}
              explanation={[
                {
                  label: "type: :request",
                  desc: "Integration tests that test full HTTP request/response cycle",
                },
                {
                  label: "let(:auth_headers)",
                  desc: "Create authentication headers with JWT token",
                },
                {
                  label: "expect { ... }.to change(Post, :count).by(1)",
                  desc: "Test that action changes database record count",
                },
                {
                  label: "JSON.parse(response.body)",
                  desc: "Parse JSON response for assertions",
                },
                {
                  label: "context 'when authenticated'",
                  desc: "Group related tests with shared context",
                },
              ]}
            />
          </div>
        </div>
      ),
    },

    {
      id: "production",
      title: "Production & Deployment",
      icon: Code2,
      overview:
        "Deploy Rails applications to production with proper configuration, caching, monitoring, and performance optimization.",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Production Configuration</h3>
            <CodeExplanation
              code={`# config/environments/production.rb
Rails.application.configure do
  config.cache_classes = true
  config.eager_load = true
  config.consider_all_requests_local = false
  config.public_file_server.enabled = true
  
  # Caching
  config.cache_store = :redis_cache_store, {
    url: ENV['REDIS_URL'],
    pool_size: 5,
    pool_timeout: 5
  }
  config.action_controller.perform_caching = true
  
  # Security
  config.force_ssl = true
  config.ssl_options = { redirect: { exclude: ->(request) { request.path =~ /health/ } } }
  
  # Logging
  config.log_level = :info
  config.log_formatter = ::Logger::Formatter.new
  
  if ENV["RAILS_LOG_TO_STDOUT"].present?
    logger = ActiveSupport::Logger.new(STDOUT)
    logger.formatter = config.log_formatter
    config.logger = ActiveSupport::TaggedLogging.new(logger)
  end
  
  # Active Record
  config.active_record.dump_schema_after_migration = false
  config.active_record.strict_loading_by_default = true
end

# config/database.yml
production:
  <<: *default
  database: <%= ENV['DATABASE_NAME'] %>
  username: <%= ENV['DATABASE_USERNAME'] %>
  password: <%= ENV['DATABASE_PASSWORD'] %>
  host: <%= ENV['DATABASE_HOST'] %>
  port: <%= ENV['DATABASE_PORT'] || 5432 %>
  pool: <%= ENV['RAILS_MAX_THREADS'] || 5 %>

# config/puma.rb (production settings)
max_threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
min_threads_count = ENV.fetch("RAILS_MIN_THREADS") { max_threads_count }
threads min_threads_count, max_threads_count

worker_timeout 3600 if ENV.fetch("RAILS_ENV", "development") == "development"

port ENV.fetch("PORT") { 3000 }
environment ENV.fetch("RAILS_ENV") { "development" }

workers ENV.fetch("WEB_CONCURRENCY") { 2 }
preload_app!

on_worker_boot do
  ActiveRecord::Base.establish_connection
end

# config/initializers/redis.rb
Redis.current = Redis.new(
  url: ENV['REDIS_URL'],
  ssl_params: { verify_mode: OpenSSL::SSL::VERIFY_NONE }
)

# Sidekiq configuration
Sidekiq.configure_server do |config|
  config.redis = { url: ENV['REDIS_URL'] }
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV['REDIS_URL'] }
end

# Dockerfile
FROM ruby:3.1.0-alpine

# Install dependencies
RUN apk add --no-cache \\
    build-base \\
    postgresql-dev \\
    git \\
    nodejs \\
    npm \\
    tzdata

# Set working directory
WORKDIR /app

# Copy Gemfile and install gems
COPY Gemfile Gemfile.lock ./
RUN bundle config --global frozen 1 \\
 && bundle install --without development test

# Copy application files
COPY . .

# Precompile assets (if using)
# RUN bundle exec rails assets:precompile

# Create user for security
RUN adduser -D -s /bin/sh rails
RUN chown -R rails:rails /app
USER rails

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1

# Start server
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]`}
              explanation={[
                {
                  label: "config.cache_store = :redis_cache_store",
                  desc: "Use Redis for caching in production for better performance",
                },
                {
                  label: "config.force_ssl = true",
                  desc: "Enforce HTTPS connections in production",
                },
                {
                  label: "preload_app!",
                  desc: "Load application in master process for faster worker forking",
                },
                {
                  label: "bundle install --without development test",
                  desc: "Install only production gems in Docker image",
                },
                {
                  label: "USER rails",
                  desc: "Run container as non-root user for security",
                },
              ]}
            />
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Caching & Performance</h3>
            <CodeExplanation
              code={`# app/controllers/api/posts_controller.rb (with caching)
class Api::PostsController < ApplicationController
  before_action :set_post, only: [:show, :update, :destroy]
  
  def index
    cache_key = "posts/index/\#{cache_params_key}"
    
    @posts_data = Rails.cache.fetch(cache_key, expires_in: 15.minutes) do
      posts = Post.includes(:author, :tags)
                  .published
                  .recent
      
      # Apply filters...
      
      {
        posts: posts.map(&:as_json_summary),
        pagination: build_pagination_data(posts)
      }
    end
    
    render_success(@posts_data)
  end
  
  def show
    cache_key = "posts/\#{@post.id}/\#{@post.updated_at.to_i}"
    
    @post_data = Rails.cache.fetch(cache_key, expires_in: 1.hour) do
      @post.as_json_detailed
    end
    
    # Increment view count asynchronously
    IncrementViewCountJob.perform_later(@post.id)
    
    render_success(@post_data)
  end
  
  def create
    @post = current_user.posts.build(post_params)
    
    if @post.save
      # Clear related caches
      clear_posts_cache
      
      render_success(@post.as_json_detailed, :created)
    else
      render_error(@post.errors.full_messages.join(', '))
    end
  end
  
  private
  
  def cache_params_key
    Digest::MD5.hexdigest([
      params[:search],
      params[:tag],
      params[:page],
      params[:per_page]
    ].compact.join('-'))
  end
  
  def clear_posts_cache
    Rails.cache.delete_matched("posts/index/*")
    Rails.cache.delete_matched("posts/\#{@post.id}/*")
  end
end

# Background job for async processing
class IncrementViewCountJob < ApplicationJob
  queue_as :default
  
  def perform(post_id)
    post = Post.find_by(id: post_id)
    return unless post
    
    # Use atomic increment to avoid race conditions
    Post.where(id: post_id).update_all('views_count = views_count + 1')
    
    # Clear cache after increment
    Rails.cache.delete_matched("posts/\#{post_id}/*")
  end
end

# Fragment caching in models
class Post < ApplicationRecord
  after_update :expire_cache
  after_destroy :expire_cache
  
  def cache_key_with_version
    "\#{super}/\#{author.updated_at.to_i}"
  end
  
  private
  
  def expire_cache
    Rails.cache.delete_matched("posts/\#{id}/*")
    Rails.cache.delete_matched("posts/index/*")
  end
end

# Database query optimization
class Post < ApplicationRecord
  # Add database indexes
  # db/migrate/add_performance_indexes.rb
  def change
    add_index :posts, [:published, :created_at], order: { created_at: :desc }
    add_index :posts, [:author_id, :published]
    add_index :posts, :slug, unique: true
    
    # Full-text search index
    add_index :posts, "to_tsvector('english', title || ' ' || content)", 
              using: :gin, name: 'posts_full_text_search'
  end
  
  # Optimized scopes
  scope :published_with_author, -> { 
    joins(:author)
      .where(published: true)
      .includes(:author)
      .select('posts.*, users.name as author_name')
  }
  
  scope :search_content, ->(query) {
    where("to_tsvector('english', title || ' ' || content) @@ plainto_tsquery(?)", query)
  }
end

# config/application.rb - Performance settings
config.active_record.database_selector = { delay: 2.seconds }
config.active_record.database_resolver = ActiveRecord::Middleware::DatabaseSelector::Resolver
config.active_record.database_resolver_context = ActiveRecord::Middleware::DatabaseSelector::Resolver::Session

# Connection pooling
config.active_record.connection_pool_size = ENV.fetch("RAILS_MAX_THREADS") { 5 }.to_i`}
              explanation={[
                {
                  label: "Rails.cache.fetch(cache_key, expires_in: 15.minutes)",
                  desc: "Cache expensive operations with automatic expiration",
                },
                {
                  label: "IncrementViewCountJob.perform_later",
                  desc: "Process non-critical operations asynchronously",
                },
                {
                  label: "Rails.cache.delete_matched('posts/index/*')",
                  desc: "Clear multiple related cache entries with pattern matching",
                },
                {
                  label: "update_all('views_count = views_count + 1')",
                  desc: "Atomic database updates to prevent race conditions",
                },
                {
                  label: "to_tsvector('english', title || ' ' || content)",
                  desc: "PostgreSQL full-text search for better search performance",
                },
              ]}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              🚀 Production Tips
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • Use Heroku, AWS, or DigitalOcean for hosting Rails
                applications
              </li>
              <li>• Implement proper monitoring with New Relic or DataDog</li>
              <li>
                • Use CDN for static assets and implement proper caching headers
              </li>
              <li>• Set up background job processing with Sidekiq and Redis</li>
              <li>• Configure database read replicas for better performance</li>
              <li>
                • Use Rails credentials for secure configuration management
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const Section: React.FC<SectionProps> = ({ section }) => {
    const Icon = section.icon;
    const isExpanded = expandedSection === section.id;

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setExpandedSection(isExpanded ? "" : section.id)}
          className="w-full p-6 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Icon className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {section.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{section.overview}</p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {isExpanded && (
          <div className="border-t border-gray-200 bg-gray-50 p-6">
            {section.content}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-red-600 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Ruby on Rails Tutorial
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Master elegant web development with Ruby on Rails - from rapid
            prototyping to scalable production applications.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}
