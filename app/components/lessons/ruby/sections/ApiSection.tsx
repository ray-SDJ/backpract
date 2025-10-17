import React from "react";
import { Globe } from "lucide-react";

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

export const ApiSection = {
  id: "api",
  title: "Rails API Development",
  icon: Globe,
  overview:
    "Build production-ready RESTful APIs with proper error handling and JSON responses",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">Building a Complete REST API</h3>
        <p className="text-gray-700 mb-3">
          Rails makes it easy to build RESTful APIs with its resourceful routing
          and built-in JSON serialization.
        </p>
        <CodeExplanation
          code={`# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :record_invalid
  
  private
  
  def record_not_found(error)
    render json: { 
      error: error.message,
      status: 404
    }, status: :not_found
  end
  
  def record_invalid(error)
    render json: { 
      errors: error.record.errors.full_messages,
      status: 422
    }, status: :unprocessable_entity
  end
  
  def render_success(data, status = :ok)
    render json: { 
      data: data,
      status: 'success'
    }, status: status
  end
  
  def render_error(message, status = :bad_request)
    render json: { 
      error: message,
      status: 'error'
    }, status: status
  end
end

# app/controllers/api/posts_controller.rb
class Api::PostsController < ApplicationController
  before_action :set_post, only: [:show, :update, :destroy]
  
  # GET /api/posts
  def index
    posts = Post.includes(:user)
                .published
                .recent
                .page(params[:page])
                .per(params[:per_page] || 10)
    
    render_success({
      posts: posts.map(&:as_json_summary),
      pagination: {
        current_page: posts.current_page,
        total_pages: posts.total_pages,
        total_count: posts.total_count
      }
    })
  end
  
  # GET /api/posts/:id
  def show
    render_success(@post.as_json_detailed)
  end
  
  # POST /api/posts
  def create
    post = Post.new(post_params)
    post.user = current_user
    
    if post.save
      render_success(post.as_json_detailed, :created)
    else
      render json: { 
        errors: post.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end
  
  # PUT /api/posts/:id
  def update
    if @post.update(post_params)
      render_success(@post.as_json_detailed)
    else
      render json: { 
        errors: @post.errors.full_messages 
      }, status: :unprocessable_entity
    end
  end
  
  # DELETE /api/posts/:id
  def destroy
    @post.destroy
    head :no_content
  end
  
  private
  
  def set_post
    @post = Post.find(params[:id])
  end
  
  def post_params
    params.require(:post).permit(:title, :content, :published)
  end
end`}
          explanation={[
            {
              label: "before_action :set_post",
              desc: "Runs set_post method before specified actions",
            },
            {
              label: "rescue_from ActiveRecord::RecordNotFound",
              desc: "Global error handler for when records aren't found",
            },
            {
              label: "params.require(:post).permit(...)",
              desc: "Strong parameters - whitelist allowed attributes",
            },
            {
              label: "render json: data, status: :ok",
              desc: "Sends JSON response with HTTP status code",
            },
            {
              label: "head :no_content",
              desc: "Returns 204 No Content response (for DELETE)",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">JSON Serialization</h3>
        <CodeExplanation
          code={`# app/models/post.rb
class Post < ApplicationRecord
  belongs_to :user
  has_many :comments
  
  # Custom JSON methods
  def as_json_summary
    {
      id: id,
      title: title,
      preview: content.truncate(100),
      published: published,
      created_at: created_at.iso8601,
      author: {
        id: user.id,
        name: user.name
      }
    }
  end
  
  def as_json_detailed
    as_json_summary.merge({
      content: content,
      updated_at: updated_at.iso8601,
      comments_count: comments.count,
      tags: tags.pluck(:name)
    })
  end
end

# Or use Active Model Serializers (gem)
# app/serializers/post_serializer.rb
class PostSerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :published, :created_at
  
  belongs_to :user
  has_many :comments
  
  def created_at
    object.created_at.iso8601
  end
end

# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :posts do
        resources :comments, only: [:index, :create]
      end
      resources :users, only: [:index, :show]
    end
  end
  
  # Health check
  get '/health', to: proc { [200, {}, ['OK']] }
end`}
          explanation={[
            {
              label: "as_json_summary",
              desc: "Custom method to format model data for JSON responses",
            },
            {
              label: "created_at.iso8601",
              desc: "Formats datetime in ISO 8601 standard format",
            },
            {
              label: "namespace :api",
              desc: "Groups routes under /api/v1 for versioning",
            },
            {
              label: "resources :posts",
              desc: "Creates all 7 RESTful routes automatically",
            },
            {
              label: "ActiveModel::Serializer",
              desc: "Gem for more advanced JSON serialization",
            },
          ]}
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">
          💡 API Best Practices
        </h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>
            • Use proper HTTP status codes (200, 201, 204, 400, 404, 422, 500)
          </li>
          <li>• Implement pagination for list endpoints</li>
          <li>• Version your API (v1, v2) for backward compatibility</li>
          <li>
            • Use strong parameters to prevent mass assignment vulnerabilities
          </li>
          <li>• Add global error handlers in ApplicationController</li>
        </ul>
      </div>
    </div>
  ),
};
