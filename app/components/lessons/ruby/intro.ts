import { LessonData } from "../types";

const intro: LessonData = {
  title: "Ruby on Rails Project Setup & MVC Architecture",
  difficulty: "Beginner",
  description:
    "Learn to set up a Ruby on Rails development environment, create new Rails API projects, and understand the MVC architecture with Rails conventions.",
  objectives: [
    "Install Ruby and Rails framework",
    "Create new Rails API project with generators",
    "Understand Rails directory structure and MVC pattern",
    "Configure database and create your first controller",
    "Run Rails server and test your API endpoints",
  ],
  content: `<div class="lesson-content">
    <h2>Ruby on Rails Introduction</h2>
    
    <p>Ruby on Rails (often just called "Rails") is a powerful web application framework written in Ruby. It follows the MVC (Model-View-Controller) architecture and emphasizes convention over configuration, making web development faster and more enjoyable.</p>

    <h3>Installing Ruby and Rails</h3>
    
    <p>First, let's set up our development environment:</p>

    <pre class="code-block">
      <code>
# Install Ruby (using rbenv - recommended)
$ curl -fsSL https://github.com/rbenv/rbenv-installer/raw/HEAD/bin/rbenv-installer | bash
$ rbenv install 3.1.0
$ rbenv global 3.1.0

# Verify Ruby installation
$ ruby --version
ruby 3.1.0

# Install Rails gem
$ gem install rails
$ rails --version
Rails 7.0.0

# Install bundler for managing dependencies
$ gem install bundler
      </code>
    </pre>

    <h3>Creating Your First Rails API</h3>
    
    <p>Let's create a new Rails application configured as an API (no views or frontend):</p>

    <pre class="code-block">
      <code>
# Create new Rails API project
$ rails new my_api --api --database=postgresql

# Navigate to project directory
$ cd my_api

# Install dependencies
$ bundle install

# Create database
$ rails db:create

# Start the Rails server
$ rails server
# Server runs on http://localhost:3000
      </code>
    </pre>

    <h3>Rails Directory Structure</h3>
    
    <p>Understanding the Rails directory structure is crucial:</p>

    <pre class="code-block">
      <code>
my_api/
├── app/                    # Main application code
│   ├── controllers/        # Handle HTTP requests (Controller)
│   ├── models/            # Business logic & database (Model)
│   ├── mailers/           # Email handling
│   └── jobs/              # Background jobs
├── config/                # Configuration files
│   ├── routes.rb          # URL routing
│   ├── database.yml       # Database configuration
│   └── environments/      # Environment-specific settings
├── db/                    # Database files
│   ├── migrate/           # Database migrations
│   └── seeds.rb           # Sample data
├── Gemfile                # Ruby dependencies
└── Gemfile.lock          # Locked dependency versions
      </code>
    </pre>

    <h3>Creating Your First Controller</h3>
    
    <p>Let's create a simple API controller to handle HTTP requests:</p>

    <pre class="code-block">
      <code>
# Generate a controller
$ rails generate controller Api::Posts index show create update destroy

# This creates app/controllers/api/posts_controller.rb
class Api::PostsController < ApplicationController
  # GET /api/posts
  def index
    posts = [
      { id: 1, title: "Getting Started with Rails", content: "Rails is awesome!" },
      { id: 2, title: "Building APIs", content: "APIs are the future!" }
    ]
    
    render json: {
      status: 'success',
      data: { posts: posts },
      message: 'Posts retrieved successfully'
    }
  end
  
  # GET /api/posts/:id
  def show
    post = { id: params[:id], title: "Sample Post", content: "Post content here" }
    
    render json: {
      status: 'success', 
      data: post,
      message: 'Post retrieved successfully'
    }
  end
  
  # POST /api/posts
  def create
    # Simulate creating a post
    post = { 
      id: rand(1000),
      title: params[:title], 
      content: params[:content],
      created_at: Time.current
    }
    
    render json: {
      status: 'success',
      data: post,
      message: 'Post created successfully'
    }, status: :created
  end
end
      </code>
    </pre>

    <h3>Setting Up Routes</h3>
    
    <p>Configure your API routes in config/routes.rb:</p>

    <pre class="code-block">
      <code>
# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    resources :posts, only: [:index, :show, :create, :update, :destroy]
  end
  
  # This creates the following routes:
  # GET    /api/posts          -> Api::PostsController#index
  # GET    /api/posts/:id      -> Api::PostsController#show  
  # POST   /api/posts          -> Api::PostsController#create
  # PATCH  /api/posts/:id      -> Api::PostsController#update
  # DELETE /api/posts/:id      -> Api::PostsController#destroy
end

# Check your routes
$ rails routes --grep posts
      </code>
    </pre>

    <h3>Testing Your API</h3>
    
    <p>Start your Rails server and test the endpoints:</p>

    <pre class="code-block">
      <code>
# Start server
$ rails server

# Test endpoints using curl or Postman
$ curl http://localhost:3000/api/posts
$ curl http://localhost:3000/api/posts/1
$ curl -X POST http://localhost:3000/api/posts \\
  -H "Content-Type: application/json" \\
  -d '{"title":"New Post","content":"Post content"}'
      </code>
    </pre>

    <h3>Rails Conventions</h3>
    
    <div class="feature-list">
      <h4>Key Rails principles:</h4>
      <ul>
        <li><strong>Convention over Configuration:</strong> Follow naming patterns, less config needed</li>
        <li><strong>DRY (Don't Repeat Yourself):</strong> Avoid code duplication</li>
        <li><strong>RESTful Routes:</strong> Standard HTTP methods for CRUD operations</li>
        <li><strong>ActiveRecord:</strong> Object-relational mapping for database interactions</li>
      </ul>
    </div>

    <p>Rails makes web development productive by providing sensible defaults and powerful generators that create the boilerplate code for you.</p>
  </div>`,
  practiceInstructions: [
    "Install Ruby 3.0+ using rbenv or your preferred method",
    "Install Rails 7+ gem",
    "Create a new Rails API project using rails new --api",
    "Generate an Api::Posts controller with standard REST actions",
    "Configure routes for your API endpoints",
    "Start the Rails server and test endpoints with curl or Postman",
  ],
  hints: [
    "Use --api flag when creating Rails projects for API-only applications",
    "Rails follows REST conventions: index (GET all), show (GET one), create (POST), etc.",
    "Use namespace :api in routes to organize API endpoints",
    "Check rails routes command to see all available routes",
    "Rails server runs on http://localhost:3000 by default",
  ],
  solution: `# Install and setup
gem install rails
rails new my_api --api --database=postgresql
cd my_api
bundle install
rails db:create

# Generate controller
rails generate controller Api::Posts index show create

# Start server
rails server

# Test endpoint
curl http://localhost:3000/api/posts`,
};

export default intro;
