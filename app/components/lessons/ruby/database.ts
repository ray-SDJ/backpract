import { LessonData } from "../types";

const database: LessonData = {
  title: "Active Record ORM & Database Management",
  difficulty: "Intermediate",
  description:
    "Master Active Record ORM for database operations, create migrations, define model associations, and implement advanced querying.",
  objectives: [
    "Create Rails migrations and models",
    "Define Active Record associations (belongs_to, has_many, has_one)",
    "Implement database queries with Active Record methods",
    "Use scopes and callbacks for business logic",
    "Test database operations in Rails console",
  ],
  content: `<div class="lesson-content">
    <h2>Active Record ORM & Database Management</h2>
    
    <p>Active Record is Rails' Object-Relational Mapping (ORM) layer that sits between your Ruby code and the database. It follows the Active Record pattern where a model class maps to a database table, and an instance of that class represents a row in the table.</p>

    <h3>Creating Models and Migrations</h3>
    
    <p>In Rails, you generate models and their corresponding database migrations together:</p>

    <pre class="code-block">
      <code>
# Generate a User model with attributes
$ rails generate model User name:string email:string:uniq
$ rails generate model Post title:string content:text published:boolean user:references

# This creates:
# - app/models/user.rb (User model class)
# - db/migrate/xxx_create_users.rb (migration file)

# Run migrations to update database
$ rails db:migrate

# Check migration status
$ rails db:migrate:status
      </code>
    </pre>

    <h3>Model Associations</h3>
    
    <p>Active Record associations define relationships between different models:</p>

    <pre class="code-block">
      <code>
# app/models/user.rb
class User < ApplicationRecord
  # Validations
  validates :name, presence: true, length: { minimum: 2 }
  validates :email, presence: true, uniqueness: true, 
            format: { with: URI::MailTo::EMAIL_REGEXP }
  
  # Associations
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  
  # Scopes
  scope :active, -> { where(active: true) }
  scope :recent, -> { order(created_at: :desc) }
  
  # Callbacks
  before_save :normalize_email
  after_create :send_welcome_email
  
  private
  
  def normalize_email
    self.email = email.downcase.strip
  end
  
  def send_welcome_email
    UserMailer.welcome(self).deliver_later
  end
end

# app/models/post.rb
class Post < ApplicationRecord
  # Associations
  belongs_to :user
  has_many :comments, dependent: :destroy
  
  # Validations
  validates :title, presence: true, length: { minimum: 3 }
  validates :content, presence: true, length: { minimum: 10 }
  
  # Scopes
  scope :published, -> { where(published: true) }
  scope :by_user, ->(user) { where(user: user) }
  
  # Instance methods
  def publish!
    update!(published: true, published_at: Time.current)
  end
  
  def excerpt(limit = 100)
    content.truncate(limit)
  end
end
      </code>
    </pre>

    <h3>Advanced Querying</h3>
    
    <p>Active Record provides a rich API for database queries:</p>

    <pre class="code-block">
      <code>
# Basic queries
User.all                           # SELECT * FROM users
User.first                         # SELECT * FROM users LIMIT 1
User.find(1)                       # SELECT * FROM users WHERE id = 1
User.find_by(email: 'user@example.com')  # WHERE email = '...'

# Chainable queries
User.where(active: true).order(:name).limit(10)
Post.includes(:user).where(published: true)  # Eager loading
Post.joins(:user).where(users: { active: true })

# Aggregations
User.count                         # COUNT(*)
Post.where(published: true).count
User.group(:status).count          # GROUP BY status

# Advanced queries with conditions
Post.where('title ILIKE ?', '%rails%')
Post.where(created_at: 1.week.ago..Time.current)
User.where.not(email: nil)

# Using scopes
User.active.recent.limit(5)
Post.published.by_user(current_user)

# Raw SQL when needed
User.find_by_sql("SELECT * FROM users WHERE custom_condition")
      </code>
    </pre>

    <h3>Database Operations</h3>
    
    <pre class="code-block">
      <code>
# Creating records
user = User.new(name: 'John', email: 'john@example.com')
user.save                          # INSERT INTO users...

# Or in one step
user = User.create!(name: 'John', email: 'john@example.com')

# Updating records
user.update!(name: 'John Doe')     # UPDATE users SET...
User.where(active: false).update_all(status: 'inactive')

# Deleting records
user.destroy                       # DELETE FROM users WHERE id = ?
Post.where(published: false).destroy_all

# Transactions for data consistency
ActiveRecord::Base.transaction do
  user.save!
  post.save!
  # If any fails, both are rolled back
end
      </code>
    </pre>

    <h3>Rails Console for Testing</h3>
    
    <pre class="code-block">
      <code>
# Start Rails console
$ rails console

# Test your models interactively
> user = User.create!(name: 'Test User', email: 'test@example.com')
> user.posts.create!(title: 'My Post', content: 'Post content', published: true)
> user.posts.published.count
> Post.includes(:user).where(published: true).map(&:title)

# Inspect SQL queries
> User.where(active: true).to_sql
=> "SELECT \\"users\\".* FROM \\"users\\" WHERE \\"users\\".\\"active\\" = $1"

# Check associations
> user.posts.loaded?               # false - not loaded yet
> user.posts.load                  # Loads the association
> user.posts.loaded?               # true - now loaded
      </code>
    </pre>

    <p>Active Record provides a powerful and intuitive way to work with databases in Rails applications, abstracting away complex SQL while still giving you the flexibility to write custom queries when needed.</p>
  </div>`,
  practiceInstructions: [
    "Generate a User model with name and email attributes",
    "Generate a Post model that belongs to User",
    "Add validations to both models (presence, length, format)",
    "Create associations (User has_many posts, Post belongs_to user)",
    "Test the relationships in Rails console",
    "Practice querying with scopes and Active Record methods",
  ],
  hints: [
    "Use rails generate model ModelName attribute:type for new models",
    "Always run rails db:migrate after generating migrations",
    "Test associations in rails console: user.posts, post.user",
    "Use includes() for eager loading to avoid N+1 queries",
    "Scopes are chainable and reusable query methods",
  ],
  solution: `# Generate models
rails generate model User name:string email:string:uniq active:boolean
rails generate model Post title:string content:text published:boolean user:references
rails db:migrate

# Test in Rails console
user = User.create!(name: 'John', email: 'john@example.com', active: true)
post = user.posts.create!(title: 'My First Post', content: 'This is the content', published: true)
User.active.includes(:posts).where(posts: { published: true })`,
};

export default database;
