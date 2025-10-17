import { LessonData } from "../types";

const api: LessonData = {
  title: "Rails RESTful API Development",
  difficulty: "Intermediate",
  description:
    "Build comprehensive RESTful APIs with Rails controllers, implement proper JSON responses, add validation, error handling, and API best practices.",
  objectives: [
    "Create API controllers following REST conventions",
    "Implement full CRUD operations (Create, Read, Update, Delete)",
    "Add proper JSON serialization and response formatting",
    "Handle API errors and validation with proper HTTP status codes",
    "Implement strong parameters for security",
  ],
  content: `<div class="lesson-content">
    <h2>Building RESTful APIs with Rails</h2>
    
    <p>REST (Representational State Transfer) is an architectural pattern for building web services. Rails makes it easy to create RESTful APIs that follow standard HTTP methods and conventions.</p>

    <h3>Setting Up the Application Controller</h3>
    
    <p>First, let's create a base controller for all API controllers with common functionality:</p>

    <pre class="code-block">
      <code>
# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  # Global error handling
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :record_invalid
  rescue_from ActionController::ParameterMissing, with: :parameter_missing
  
  private
  
  def record_not_found(exception)
    render json: {
      status: 'error',
      message: 'Record not found',
      details: exception.message
    }, status: :not_found
  end
  
  def record_invalid(exception)
    render json: {
      status: 'error',
      message: 'Validation failed',
      errors: exception.record.errors.full_messages
    }, status: :unprocessable_entity
  end
  
  def parameter_missing(exception)
    render json: {
      status: 'error',
      message: 'Missing required parameter',
      details: exception.message
    }, status: :bad_request
  end
  
  # Standardized success response
  def success_response(data, message, status = :ok)
    render json: {
      status: 'success',
      data: data,
      message: message
    }, status: status
  end
end
      </code>
    </pre>

    <h3>Creating a Full CRUD API Controller</h3>
    
    <p>Let's build a complete Posts API controller with all CRUD operations:</p>

    <pre class="code-block">
      <code>
# app/controllers/api/posts_controller.rb
class Api::PostsController < ApplicationController
  before_action :set_post, only: [:show, :update, :destroy]
  
  # GET /api/posts
  def index
    posts = Post.includes(:user).published.page(params[:page])
    
    success_response({
      posts: posts.map(&:as_json_with_author),
      pagination: {
        current_page: posts.current_page,
        total_pages: posts.total_pages,
        total_count: posts.total_count
      }
    }, 'Posts retrieved successfully')
  end
  
  # GET /api/posts/:id
  def show
    success_response(
      @post.as_json_with_author,
      'Post retrieved successfully'
    )
  end
  
  # POST /api/posts
  def create
    post = current_user.posts.build(post_params)
    
    if post.save
      success_response(
        post.as_json_with_author,
        'Post created successfully',
        :created
      )
    else
      render json: {
        status: 'error',
        message: 'Failed to create post',
        errors: post.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
  
  # PATCH/PUT /api/posts/:id
  def update
    authorize_post_owner!
    
    if @post.update(post_params)
      success_response(
        @post.as_json_with_author,
        'Post updated successfully'
      )
    else
      render json: {
        status: 'error',
        message: 'Failed to update post',
        errors: @post.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
  
  # DELETE /api/posts/:id
  def destroy
    authorize_post_owner!
    
    @post.destroy
    render json: {
      status: 'success',
      message: 'Post deleted successfully'
    }, status: :no_content
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

    <h3>Custom JSON Serialization</h3>
    
    <p>Add custom JSON methods to your models for clean API responses:</p>

    <pre class="code-block">
      <code>
# app/models/post.rb
class Post < ApplicationRecord
  belongs_to :user
  
  validates :title, presence: true, length: { minimum: 3 }
  validates :content, presence: true, length: { minimum: 10 }
  
  scope :published, -> { where(published: true) }
  
  def as_json_with_author(options = {})
    as_json(options.merge(
      only: [:id, :title, :content, :published, :created_at, :updated_at],
      include: {
        user: { only: [:id, :name, :email] }
      },
      methods: [:excerpt, :read_time]
    ))
  end
  
  def excerpt(limit = 100)
    content.truncate(limit)
  end
  
  def read_time
    # Estimate reading time (200 words per minute)
    word_count = content.split.length
    (word_count / 200.0).ceil
  end
end

# app/models/user.rb
class User < ApplicationRecord
  has_many :posts, dependent: :destroy
  
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  
  def as_json(options = {})
    super(options.merge(except: [:password_digest]))
  end
end
      </code>
    </pre>

    <h3>Advanced API Routes</h3>
    
    <p>Set up comprehensive routes with nested resources and custom actions:</p>

    <pre class="code-block">
      <code>
# config/routes.rb
Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :posts do
        member do
          patch :publish      # PATCH /api/v1/posts/:id/publish
          patch :unpublish    # PATCH /api/v1/posts/:id/unpublish
        end
        
        collection do
          get :search         # GET /api/v1/posts/search?q=query
          get :popular        # GET /api/v1/posts/popular
        end
      end
      
      resources :users, only: [:index, :show] do
        resources :posts, only: [:index]  # GET /api/v1/users/:id/posts
      end
      
      # Health check endpoint
      get :health, to: 'health#check'
    end
  end
end

# Additional controller actions
class Api::V1::PostsController < ApplicationController
  # PATCH /api/v1/posts/:id/publish
  def publish
    @post.update!(published: true, published_at: Time.current)
    success_response(@post, 'Post published successfully')
  end
  
  # GET /api/v1/posts/search?q=rails
  def search
    query = params[:q]
    posts = Post.published.where(
      'title ILIKE ? OR content ILIKE ?', 
      "%#{query}%", "%#{query}%"
    ).limit(20)
    
    success_response(
      posts.map(&:as_json_with_author),
      "Found #{posts.count} posts matching '#{query}'"
    )
  end
end
      </code>
    </pre>

    <h3>API Testing with Curl</h3>
    
    <p>Test your API endpoints using curl commands:</p>

    <pre class="code-block">
      <code>
# GET all posts
curl -X GET http://localhost:3000/api/v1/posts \\
  -H "Content-Type: application/json"

# GET specific post
curl -X GET http://localhost:3000/api/v1/posts/1

# CREATE new post
curl -X POST http://localhost:3000/api/v1/posts \\
  -H "Content-Type: application/json" \\
  -d '{
    "post": {
      "title": "My New Post",
      "content": "This is the content of my post",
      "published": true
    }
  }'

# UPDATE post
curl -X PATCH http://localhost:3000/api/v1/posts/1 \\
  -H "Content-Type: application/json" \\
  -d '{
    "post": {
      "title": "Updated Post Title"
    }
  }'

# DELETE post
curl -X DELETE http://localhost:3000/api/v1/posts/1

# SEARCH posts
curl -X GET "http://localhost:3000/api/v1/posts/search?q=rails"
      </code>
    </pre>

    <h3>API Best Practices</h3>
    
    <div class="feature-list">
      <h4>Key API design principles:</h4>
      <ul>
        <li><strong>Consistent Response Format:</strong> Always return status, data, and message</li>
        <li><strong>Proper HTTP Status Codes:</strong> 200 (OK), 201 (Created), 422 (Validation Error), etc.</li>
        <li><strong>Strong Parameters:</strong> Use permit() to whitelist allowed parameters</li>
        <li><strong>Error Handling:</strong> Catch and handle common exceptions gracefully</li>
        <li><strong>Pagination:</strong> Don't return all records at once</li>
        <li><strong>Versioning:</strong> Use /api/v1/ namespace for future compatibility</li>
      </ul>
    </div>

    <p>Following REST conventions and Rails patterns makes your API predictable, maintainable, and easy to consume by frontend applications and other services.</p>
  </div>`,
  practiceInstructions: [
    "Set up ApplicationController with global error handling",
    "Generate Api::PostsController with standard REST actions",
    "Implement strong parameters with post_params method",
    "Add custom JSON serialization methods to your models",
    "Configure routes with namespace :api and resources :posts",
    "Test all CRUD endpoints using curl or Postman",
    "Add custom actions like publish/unpublish and search",
  ],
  hints: [
    "Use rescue_from in ApplicationController for consistent error handling",
    "Always validate user input with strong parameters",
    "Return appropriate HTTP status codes (200, 201, 422, 404, etc.)",
    "Use includes() to avoid N+1 queries when loading associations",
    "Add pagination for index endpoints to improve performance",
  ],
  solution: `# Generate controller
rails generate controller Api::Posts index show create update destroy

# Test endpoints
curl http://localhost:3000/api/posts
curl -X POST http://localhost:3000/api/posts -H "Content-Type: application/json" -d '{"post":{"title":"Test","content":"Content"}}'
curl -X PATCH http://localhost:3000/api/posts/1 -d '{"post":{"title":"Updated"}}'
curl -X DELETE http://localhost:3000/api/posts/1`,
};

export default api;
