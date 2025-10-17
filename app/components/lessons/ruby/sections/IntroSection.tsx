import React from "react";
import { Play } from "lucide-react";

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

export const IntroSection = {
  id: "intro",
  title: "Ruby on Rails Setup",
  icon: Play,
  overview:
    "Get started with Ruby on Rails - install, create your first API, and understand the MVC architecture",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">What is Ruby on Rails?</h3>
        <p className="text-gray-700 mb-3">
          Ruby on Rails (Rails) is a server-side web application framework
          written in Ruby. It follows the Model-View-Controller (MVC) pattern
          and emphasizes convention over configuration, making development
          faster and more enjoyable.
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
          <li>
            <strong>Convention over Configuration:</strong> Sensible defaults
            reduce decision fatigue
          </li>
          <li>
            <strong>DRY Principle:</strong> Don&apos;t Repeat Yourself - write
            code once
          </li>
          <li>
            <strong>Active Record ORM:</strong> Intuitive database interactions
          </li>
          <li>
            <strong>RESTful by default:</strong> Built-in support for REST APIs
          </li>
          <li>
            <strong>Rapid development:</strong> Get applications running quickly
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">Your First Rails API</h3>
        <CodeExplanation
          code={`# Install Rails
$ gem install rails

# Create new Rails API project
$ rails new my_api --api --database=postgresql
$ cd my_api

# Generate a Posts controller
$ rails generate controller Api::Posts index show create

# app/controllers/api/posts_controller.rb
class Api::PostsController < ApplicationController
  # GET /api/posts
  def index
    posts = [
      { id: 1, title: 'First Post', content: 'Hello Rails!' },
      { id: 2, title: 'Second Post', content: 'Learning Ruby' }
    ]
    
    render json: { data: posts, status: 'success' }
  end
  
  # GET /api/posts/:id
  def show
    post = { id: params[:id], title: 'My Post', content: 'Content here' }
    render json: { data: post }
  end
  
  # POST /api/posts
  def create
    post = {
      id: rand(1000),
      title: params[:title],
      content: params[:content]
    }
    
    render json: { data: post }, status: :created
  end
end

# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    resources :posts, only: [:index, :show, :create]
  end
  
  get '/health', to: proc { [200, {}, ['OK']] }
end

# Start the server
$ rails server`}
          explanation={[
            {
              label: "rails new my_api --api",
              desc: "Creates API-only Rails app without views and frontend assets",
            },
            {
              label: "namespace :api",
              desc: "Groups routes under /api prefix for API versioning",
            },
            {
              label: "resources :posts",
              desc: "Generates RESTful routes automatically (index, show, create, update, destroy)",
            },
            {
              label: "render json:",
              desc: "Sends JSON response to the client with specified data",
            },
            {
              label: "params[:id]",
              desc: "Accesses URL parameters passed in the request",
            },
          ]}
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">💡 Quick Test</h4>
        <p className="text-sm text-green-800">
          Run with{" "}
          <code className="bg-white px-2 py-1 rounded">rails server</code>, then
          visit{" "}
          <code className="bg-white px-2 py-1 rounded">
            http://localhost:3000/api/posts
          </code>
        </p>
      </div>
    </div>
  ),
};
