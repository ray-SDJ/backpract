import { LessonData } from "../types";

const testing: LessonData = {
  title: "RSpec Testing & Production Deployment",
  difficulty: "Advanced",
  description:
    "Master comprehensive testing with RSpec, FactoryBot, and request specs. Learn to deploy Rails applications to production with Docker, environment configuration, and performance optimization.",
  objectives: [
    "Write comprehensive tests with RSpec and FactoryBot",
    "Implement model validations, controller, and integration tests",
    "Set up test factories and mock external dependencies",
    "Configure Rails for production environment",
    "Deploy Rails API to cloud platforms with Docker",
  ],
  content: `<div class="lesson-content">
    <h2>Testing with RSpec & Production Deployment</h2>
    
    <p>Testing is crucial for maintaining reliable Rails applications. RSpec is the most popular testing framework for Rails, providing a clean, readable syntax for behavior-driven development (BDD).</p>

    <h3>Setting Up RSpec and Testing Tools</h3>
    
    <p>Let's install and configure a complete testing environment:</p>

    <pre class="code-block">
      <code>
# Gemfile - add to development and test groups
group :development, :test do
  gem 'rspec-rails'
  gem 'factory_bot_rails'
  gem 'faker'
  gem 'shoulda-matchers'
end

group :test do
  gem 'database_cleaner-active_record'
  gem 'webmock'
  gem 'vcr'
end

# Install gems and generate RSpec configuration
$ bundle install
$ rails generate rspec:install

# This creates:
# spec/spec_helper.rb       - RSpec configuration
# spec/rails_helper.rb      - Rails-specific configuration
# .rspec                    - Default RSpec options
      </code>
    </pre>

    <h3>Test Factories with FactoryBot</h3>
    
    <p>Create factories for generating test data:</p>

    <pre class="code-block">
      <code>
# spec/factories/users.rb
FactoryBot.define do
  factory :user do
    name { Faker::Name.name }
    email { Faker::Internet.unique.email }
    password { 'password123' }
    password_confirmation { 'password123' }
    
    trait :with_posts do
      after(:create) do |user|
        create_list(:post, 3, user: user)
      end
    end
    
    trait :admin do
      role { 'admin' }
    end
  end
end

# spec/factories/posts.rb
FactoryBot.define do
  factory :post do
    title { Faker::Lorem.sentence(word_count: 4) }
    content { Faker::Lorem.paragraphs(number: 3).join("\\n") }
    published { true }
    association :user
    
    trait :draft do
      published { false }
    end
    
    trait :with_long_content do
      content { Faker::Lorem.paragraphs(number: 10).join("\\n") }
    end
  end
end

# spec/support/factory_bot.rb
RSpec.configure do |config|
  config.include FactoryBot::Syntax::Methods
end
      </code>
    </pre>

    <h3>Model Testing</h3>
    
    <p>Write comprehensive tests for model validations, associations, and business logic:</p>

    <pre class="code-block">
      <code>
# spec/models/user_spec.rb
require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email).case_insensitive }
    it { should validate_length_of(:name).is_at_least(2) }
    it { should validate_length_of(:password).is_at_least(6) }
    
    it 'validates email format' do
      user = build(:user, email: 'invalid_email')
      expect(user).to_not be_valid
      expect(user.errors[:email]).to include('is invalid')
    end
  end
  
  describe 'associations' do
    it { should have_many(:posts).dependent(:destroy) }
  end
  
  describe 'JWT methods' do
    let(:user) { create(:user) }
    
    describe '#generate_jwt' do
      it 'generates a valid JWT token' do
        token = user.generate_jwt
        expect(token).to be_present
        
        # Verify token contains user data
        decoded = JWT.decode(token, Rails.application.secret_key_base).first
        expect(decoded['user_id']).to eq(user.id)
        expect(decoded['email']).to eq(user.email)
      end
    end
    
    describe '.from_jwt' do
      it 'returns user from valid token' do
        token = user.generate_jwt
        found_user = User.from_jwt(token)
        expect(found_user).to eq(user)
      end
      
      it 'returns nil for invalid token' do
        invalid_token = 'invalid.jwt.token'
        expect(User.from_jwt(invalid_token)).to be_nil
      end
    end
  end
end

# spec/models/post_spec.rb
RSpec.describe Post, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:content) }
    it { should validate_length_of(:title).is_at_least(3) }
    it { should validate_length_of(:content).is_at_least(10) }
  end
  
  describe 'associations' do
    it { should belong_to(:user) }
  end
  
  describe 'scopes' do
    let!(:published_post) { create(:post, published: true) }
    let!(:draft_post) { create(:post, :draft) }
    
    it 'returns only published posts' do
      expect(Post.published).to include(published_post)
      expect(Post.published).not_to include(draft_post)
    end
  end
  
  describe 'instance methods' do
    let(:post) { create(:post, :with_long_content) }
    
    describe '#excerpt' do
      it 'truncates content to specified length' do
        excerpt = post.excerpt(50)
        expect(excerpt.length).to be <= 50
        expect(excerpt).to end_with('...')
      end
    end
    
    describe '#read_time' do
      it 'calculates estimated reading time' do
        expect(post.read_time).to be > 0
      end
    end
  end
end
      </code>
    </pre>

    <h3>API Controller Testing</h3>
    
    <p>Test API endpoints with request specs:</p>

    <pre class="code-block">
      <code>
# spec/requests/api/posts_spec.rb
require 'rails_helper'

RSpec.describe 'Api::Posts', type: :request do
  let(:user) { create(:user) }
  let(:auth_headers) { 
    { 'Authorization' => "Bearer #{user.generate_jwt}" }
  }
  
  describe 'GET /api/posts' do
    let!(:published_posts) { create_list(:post, 3, published: true) }
    let!(:draft_posts) { create_list(:post, 2, :draft) }
    
    it 'returns published posts' do
      get '/api/posts'
      
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      
      expect(json['status']).to eq('success')
      expect(json['data']['posts'].length).to eq(3)
      
      # Verify only published posts are returned
      returned_ids = json['data']['posts'].map { |p| p['id'] }
      expect(returned_ids).to match_array(published_posts.map(&:id))
    end
  end
  
  describe 'POST /api/posts' do
    let(:valid_params) do
      {
        post: {
          title: 'Test Post Title',
          content: 'This is the test post content that is long enough.',
          published: true
        }
      }
    end
    
    context 'when authenticated' do
      it 'creates a new post' do
        expect {
          post '/api/posts', params: valid_params, headers: auth_headers
        }.to change(Post, :count).by(1)
        
        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        
        expect(json['status']).to eq('success')
        expect(json['data']['title']).to eq('Test Post Title')
        expect(json['data']['user']['id']).to eq(user.id)
      end
      
      it 'returns validation errors for invalid data' do
        invalid_params = { post: { title: '', content: 'x' } }
        
        post '/api/posts', params: invalid_params, headers: auth_headers
        
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        
        expect(json['status']).to eq('error')
        expect(json['errors']).to be_present
      end
    end
    
    context 'when not authenticated' do
      it 'returns unauthorized error' do
        post '/api/posts', params: valid_params
        
        expect(response).to have_http_status(:unauthorized)
        json = JSON.parse(response.body)
        
        expect(json['status']).to eq('error')
        expect(json['message']).to eq('No token provided')
      end
    end
  end
  
  describe 'PUT /api/posts/:id' do
    let(:post_record) { create(:post, user: user) }
    let(:other_user_post) { create(:post) }
    
    context 'when updating own post' do
      it 'updates the post successfully' do
        put "/api/posts/#{post_record.id}",
            params: { post: { title: 'Updated Title' } },
            headers: auth_headers
        
        expect(response).to have_http_status(:ok)
        expect(post_record.reload.title).to eq('Updated Title')
      end
    end
    
    context 'when trying to update another users post' do
      it 'returns forbidden error' do
        put "/api/posts/#{other_user_post.id}",
            params: { post: { title: 'Hacked Title' } },
            headers: auth_headers
        
        expect(response).to have_http_status(:forbidden)
        json = JSON.parse(response.body)
        expect(json['message']).to include('only modify your own posts')
      end
    end
  end
end
      </code>
    </pre>

    <h3>Production Configuration & Deployment</h3>
    
    <p>Configure Rails for production environment and deploy with Docker:</p>

    <pre class="code-block">
      <code>
# config/environments/production.rb
Rails.application.configure do
  config.cache_classes = true
  config.eager_load = true
  
  # Force all access to the app over SSL
  config.force_ssl = true
  
  # Use Redis for caching and session store
  config.cache_store = :redis_cache_store, {
    url: ENV['REDIS_URL']
  }
  
  # Logging
  config.log_level = :info
  config.log_tags = [:request_id]
  
  # Database configuration
  config.active_record.dump_schema_after_migration = false
  
  # Active Job configuration
  config.active_job.queue_adapter = :sidekiq
end

# Dockerfile
FROM ruby:3.1-alpine

# Install dependencies
RUN apk add --no-cache \\
  build-base \\
  postgresql-dev \\
  nodejs \\
  tzdata

WORKDIR /app

# Install gems
COPY Gemfile Gemfile.lock ./
RUN bundle config --global frozen 1 \\
 && bundle install --without development test

# Copy application
COPY . .

# Create non-root user
RUN addgroup -g 1000 -S appuser \\
 && adduser -u 1000 -S appuser -G appuser \\
 && chown -R appuser:appuser /app
USER appuser

EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]

# docker-compose.production.yml
version: '3.8'

services:
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_PASSWORD: \${DB_PASSWORD}
      POSTGRES_DB: \${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

  web:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      RAILS_ENV: production
      DATABASE_URL: postgres://postgres:\${DB_PASSWORD}@db:5432/\${DB_NAME}
      REDIS_URL: redis://redis:6379/1
      RAILS_MASTER_KEY: \${RAILS_MASTER_KEY}
    ports:
      - "3000:3000"
    depends_on:
      - db
      - redis
    restart: unless-stopped

volumes:
  postgres_data:
      </code>
    </pre>

    <h3>Running Tests and Deployment Commands</h3>
    
    <pre class="code-block">
      <code>
# Run all tests
$ bundle exec rspec

# Run specific test files
$ bundle exec rspec spec/models/user_spec.rb
$ bundle exec rspec spec/requests/api/posts_spec.rb

# Run tests with coverage
$ COVERAGE=true bundle exec rspec

# Build and deploy with Docker
$ docker build -t my-rails-api .
$ docker-compose -f docker-compose.production.yml up -d

# Deploy to Heroku
$ heroku create my-rails-api-production
$ heroku addons:create heroku-postgresql:hobby-dev
$ heroku addons:create heroku-redis:hobby-dev
$ heroku config:set RAILS_MASTER_KEY=$(cat config/master.key)
$ git push heroku main
$ heroku run rails db:migrate
$ heroku run rails db:seed

# Environment variables for production
export DATABASE_URL="postgresql://user:pass@localhost/myapp_production"
export REDIS_URL="redis://localhost:6379/1"
export RAILS_MASTER_KEY="your_master_key_here"
export SECRET_KEY_BASE="your_secret_key_base"
      </code>
    </pre>

    <h3>Performance and Monitoring</h3>
    
    <div class="feature-list">
      <h4>Production best practices:</h4>
      <ul>
        <li><strong>Database Optimization:</strong> Add indexes, use connection pooling</li>
        <li><strong>Caching:</strong> Implement Redis caching for expensive operations</li>
        <li><strong>Background Jobs:</strong> Use Sidekiq for email sending and heavy processing</li>
        <li><strong>Monitoring:</strong> Set up application performance monitoring (APM)</li>
        <li><strong>Security:</strong> Enable force SSL, security headers, and rate limiting</li>
        <li><strong>Logging:</strong> Structured logging for debugging and monitoring</li>
      </ul>
    </div>

    <p>Comprehensive testing with RSpec ensures your Rails API works correctly, while proper deployment practices ensure reliable production performance.</p>
  </div>`,
  practiceInstructions: [
    "Add RSpec, FactoryBot, and testing gems to your Gemfile",
    "Generate RSpec configuration and create user/post factories",
    "Write model tests for validations, associations, and business logic",
    "Create request specs for your API endpoints with authentication",
    "Test both success and error scenarios (validation, authorization)",
    "Set up production configuration with environment variables",
    "Create Dockerfile and deploy your Rails API to a cloud platform",
  ],
  hints: [
    "Use shoulda-matchers for concise validation testing",
    "Test factories first to ensure your test data is valid",
    "Use let and let! for setting up test data efficiently",
    "Test authentication, authorization, and error handling separately",
    "Use environment variables for all sensitive configuration in production",
  ],
  solution: `# Install testing gems
gem 'rspec-rails'
gem 'factory_bot_rails'
bundle install
rails generate rspec:install

# Run tests
bundle exec rspec

# Deploy with Docker
docker build -t my-api .
docker run -p 3000:3000 my-api

# Deploy to Heroku
heroku create my-app
git push heroku main`,
};

export default testing;
