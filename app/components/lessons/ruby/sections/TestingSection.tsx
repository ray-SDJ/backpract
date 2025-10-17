import React from "react";
import { TestTube } from "lucide-react";

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

export const TestingSection = {
  id: "testing",
  title: "Testing & Deployment",
  icon: TestTube,
  overview: "Write RSpec tests and deploy your Rails application to production",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">Testing with RSpec</h3>
        <p className="text-gray-700 mb-3">
          RSpec is the most popular testing framework for Rails. Write
          comprehensive tests to ensure your API works correctly.
        </p>
        <CodeExplanation
          code={`# Gemfile (in test group)
group :development, :test do
  gem 'rspec-rails'
  gem 'factory_bot_rails'
  gem 'faker'
end

# Install RSpec
$ rails generate rspec:install

# spec/factories/users.rb
FactoryBot.define do
  factory :user do
    name { Faker::Name.name }
    email { Faker::Internet.unique.email }
    password { 'password123' }
    
    trait :with_posts do
      after(:create) do |user|
        create_list(:post, 3, user: user)
      end
    end
  end
end

# spec/factories/posts.rb
FactoryBot.define do
  factory :post do
    title { Faker::Lorem.sentence }
    content { Faker::Lorem.paragraphs(number: 3).join("\\n") }
    published { true }
    association :user
    
    trait :draft do
      published { false }
    end
  end
end

# spec/models/post_spec.rb
require 'rails_helper'

RSpec.describe Post, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:content) }
    it { should validate_length_of(:title).is_at_least(3) }
  end
  
  describe 'associations' do
    it { should belong_to(:user) }
    it { should have_many(:comments).dependent(:destroy) }
  end
  
  describe 'scopes' do
    let!(:published_post) { create(:post, published: true) }
    let!(:draft_post) { create(:post, :draft) }
    
    it 'returns only published posts' do
      expect(Post.published).to include(published_post)
      expect(Post.published).not_to include(draft_post)
    end
  end
  
  describe '#publish!' do
    it 'sets published to true' do
      post = create(:post, :draft)
      post.publish!
      expect(post.published).to be true
    end
  end
end`}
          explanation={[
            {
              label: "FactoryBot.define",
              desc: "Defines test data factories for creating model instances",
            },
            {
              label: "trait :with_posts",
              desc: "Defines variations of factories for different test scenarios",
            },
            {
              label: "it { should validate_presence_of(:title) }",
              desc: "Tests model validations using shoulda-matchers syntax",
            },
            {
              label: "let!(:published_post)",
              desc: "Creates test data before each test (! forces immediate creation)",
            },
            {
              label: "create(:post, :draft)",
              desc: "Uses factory to create a draft post for testing",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">API Integration Tests</h3>
        <CodeExplanation
          code={`# spec/requests/api/posts_spec.rb
require 'rails_helper'

RSpec.describe 'Api::Posts', type: :request do
  let(:user) { create(:user) }
  let(:auth_headers) { 
    { 'Authorization' => "Bearer #{user.generate_jwt}" }
  }
  
  describe 'GET /api/posts' do
    let!(:posts) { create_list(:post, 3, published: true) }
    
    it 'returns list of published posts' do
      get '/api/posts'
      
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      
      expect(json['data']['posts'].length).to eq(3)
      expect(json['status']).to eq('success')
    end
  end
  
  describe 'POST /api/posts' do
    let(:valid_params) do
      {
        post: {
          title: 'Test Post',
          content: 'This is test content',
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
        
        expect(json['data']['title']).to eq('Test Post')
        expect(json['data']['author']['id']).to eq(user.id)
      end
      
      it 'returns validation errors for invalid data' do
        invalid_params = { post: { title: '', content: 'x' } }
        
        post '/api/posts', params: invalid_params, headers: auth_headers
        
        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        
        expect(json['errors']).to be_present
      end
    end
    
    context 'when not authenticated' do
      it 'returns unauthorized error' do
        post '/api/posts', params: valid_params
        
        expect(response).to have_http_status(:unauthorized)
        json = JSON.parse(response.body)
        
        expect(json['error']).to eq('No token provided')
      end
    end
  end
  
  describe 'PUT /api/posts/:id' do
    let(:post_record) { create(:post, user: user) }
    
    it 'updates own post' do
      put "/api/posts/#{post_record.id}",
          params: { post: { title: 'Updated' } },
          headers: auth_headers
      
      expect(response).to have_http_status(:ok)
      expect(post_record.reload.title).to eq('Updated')
    end
  end
  
  describe 'DELETE /api/posts/:id' do
    let!(:post_record) { create(:post, user: user) }
    
    it 'deletes the post' do
      expect {
        delete "/api/posts/#{post_record.id}", headers: auth_headers
      }.to change(Post, :count).by(-1)
      
      expect(response).to have_http_status(:no_content)
    end
  end
end

# Run tests
$ bundle exec rspec
$ bundle exec rspec spec/models/post_spec.rb
$ bundle exec rspec --format documentation`}
          explanation={[
            {
              label: "type: :request",
              desc: "Integration tests that test full HTTP request/response cycle",
            },
            {
              label: "expect { }.to change(Post, :count).by(1)",
              desc: "Tests that an action changes the database count",
            },
            {
              label: "JSON.parse(response.body)",
              desc: "Parses JSON response for assertions",
            },
            {
              label: "context 'when authenticated'",
              desc: "Groups related tests with shared setup",
            },
            {
              label: "have_http_status(:ok)",
              desc: "RSpec matcher for testing HTTP status codes",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">Deployment to Production</h3>
        <CodeExplanation
          code={`# Dockerfile
FROM ruby:3.1

WORKDIR /app

# Install dependencies
RUN apt-get update -qq && apt-get install -y \\
  nodejs postgresql-client

# Install gems
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Copy app files
COPY . .

# Precompile assets (if needed)
# RUN bundle exec rails assets:precompile

EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]

# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  web:
    build: .
    command: bundle exec rails server -b 0.0.0.0
    volumes:
      - .:/app
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      DATABASE_URL: postgres://postgres:password@db:5432/myapp_development

volumes:
  postgres_data:

# config/environments/production.rb
Rails.application.configure do
  config.cache_classes = true
  config.eager_load = true
  
  # Force HTTPS
  config.force_ssl = true
  
  # Use Redis for caching
  config.cache_store = :redis_cache_store, {
    url: ENV['REDIS_URL']
  }
  
  # Logging
  config.log_level = :info
  
  # Database
  config.active_record.dump_schema_after_migration = false
end

# Deploy to Heroku
$ heroku create my-rails-api
$ git push heroku main
$ heroku run rails db:migrate
$ heroku ps:scale web=1

# Environment variables
$ heroku config:set RAILS_MASTER_KEY=your_master_key
$ heroku config:set DATABASE_URL=postgresql://...`}
          explanation={[
            {
              label: "FROM ruby:3.1",
              desc: "Base Docker image with Ruby installed",
            },
            {
              label: "bundle install",
              desc: "Installs all gems specified in Gemfile",
            },
            {
              label: "config.force_ssl = true",
              desc: "Ensures all requests use HTTPS in production",
            },
            {
              label: "heroku run rails db:migrate",
              desc: "Runs database migrations on Heroku",
            },
            {
              label: "RAILS_MASTER_KEY",
              desc: "Used to decrypt credentials.yml.enc file",
            },
          ]}
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">
          🚀 Production Tips
        </h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Write tests for all critical functionality</li>
          <li>• Use Docker for consistent environments</li>
          <li>• Enable SSL/HTTPS in production</li>
          <li>• Set up monitoring with services like New Relic or Datadog</li>
          <li>• Use background jobs (Sidekiq) for long-running tasks</li>
          <li>• Implement proper logging and error tracking (Sentry)</li>
        </ul>
      </div>
    </div>
  ),
};
