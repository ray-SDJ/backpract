import React from "react";
import { Database } from "lucide-react";

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

export const DatabaseSection = {
  id: "database",
  title: "Active Record & Database",
  icon: Database,
  overview:
    "Master Rails ORM with models, migrations, validations, and associations",
  content: (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-2">
          Active Record Models & Migrations
        </h3>
        <p className="text-gray-700 mb-3">
          Active Record is Rails&apos; Object-Relational Mapping (ORM) system.
          It maps database tables to Ruby classes, making database operations
          intuitive and Ruby-like.
        </p>
        <CodeExplanation
          code={`# Generate a Post model with fields
$ rails generate model Post title:string content:text published:boolean user:references

# This creates:
# db/migrate/20240101_create_posts.rb
class CreatePosts < ActiveRecord::Migration[7.0]
  def change
    create_table :posts do |t|
      t.string :title, null: false
      t.text :content
      t.boolean :published, default: false
      t.references :user, null: false, foreign_key: true
      
      t.timestamps
    end
    
    add_index :posts, :title
    add_index :posts, [:published, :created_at]
  end
end

# app/models/post.rb
class Post < ApplicationRecord
  belongs_to :user
  has_many :comments, dependent: :destroy
  
  # Validations
  validates :title, presence: true, length: { minimum: 3, maximum: 100 }
  validates :content, presence: true, length: { minimum: 10 }
  validates :user, presence: true
  
  # Scopes
  scope :published, -> { where(published: true) }
  scope :recent, -> { order(created_at: :desc) }
  scope :by_user, ->(user) { where(user: user) }
  
  # Callbacks
  before_save :sanitize_content
  after_create :notify_followers
  
  # Instance methods
  def publish!
    update(published: true)
  end
  
  def preview(length = 100)
    content.truncate(length)
  end
  
  private
  
  def sanitize_content
    self.content = ActionController::Base.helpers.sanitize(content)
  end
  
  def notify_followers
    # Send notifications
  end
end

# Run migrations
$ rails db:migrate`}
          explanation={[
            {
              label: "belongs_to :user",
              desc: "Defines a many-to-one relationship with User model",
            },
            {
              label: "has_many :comments",
              desc: "Defines one-to-many relationship, dependent: :destroy deletes comments when post is deleted",
            },
            {
              label: "validates :title, presence: true",
              desc: "Ensures title field is not empty before saving",
            },
            {
              label: "scope :published",
              desc: "Creates reusable query method: Post.published",
            },
            {
              label: "before_save :sanitize_content",
              desc: "Runs callback before record is saved to database",
            },
          ]}
        />
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2">Working with Active Record</h3>
        <CodeExplanation
          code={`# Creating records
post = Post.new(title: 'My Post', content: 'Content here')
post.user = current_user
post.save

# Or use create
post = Post.create(
  title: 'Another Post',
  content: 'More content',
  user: current_user,
  published: true
)

# Querying records
posts = Post.all
published_posts = Post.published.recent
user_posts = Post.by_user(current_user)

# Finding specific records
post = Post.find(1)
post = Post.find_by(title: 'My Post')
posts = Post.where(published: true).limit(10)

# Updating records
post.update(title: 'Updated Title')
post.publish!

# Deleting records
post.destroy

# Advanced queries with includes (prevents N+1 queries)
posts = Post.includes(:user, :comments)
            .where(published: true)
            .order(created_at: :desc)
            .limit(20)

# Aggregations
Post.count
Post.where(published: true).count
Post.group(:user_id).count
Post.average(:views_count)`}
          explanation={[
            {
              label: "Post.new vs Post.create",
              desc: ".new creates object in memory, .create saves immediately",
            },
            {
              label: "Post.includes(:user)",
              desc: "Eager loads associations to prevent N+1 query problems",
            },
            {
              label: "where(published: true)",
              desc: "Filters records with SQL WHERE clause",
            },
            {
              label: "post.update(attrs)",
              desc: "Updates and saves record with validations",
            },
            {
              label: "post.destroy",
              desc: "Deletes record and runs callbacks",
            },
          ]}
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">💡 Pro Tips</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Use scopes for reusable queries</li>
          <li>
            • Always add database indexes on foreign keys and frequently queried
            columns
          </li>
          <li>• Use includes() to avoid N+1 query problems</li>
          <li>• Add validations in models to ensure data integrity</li>
        </ul>
      </div>
    </div>
  ),
};
