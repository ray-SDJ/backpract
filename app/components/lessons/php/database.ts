import { LessonData } from "../types";

const database: LessonData = {
  title: "Laravel Eloquent ORM & Database Management",
  difficulty: "Intermediate",
  description:
    "Master Laravel's Eloquent ORM for database operations. Learn to create migrations, define model relationships, and implement advanced querying techniques for robust data management.",
  objectives: [
    "Create and run Laravel database migrations",
    "Define Eloquent models with relationships",
    "Implement CRUD operations with Eloquent",
    "Use model factories and seeders for testing data",
  ],
  content: `
    <div class="lesson-content">
      <h2>Laravel Eloquent ORM & Database Management</h2>
      
      <div class="info-box">
        <h3>Eloquent ORM Overview</h3>
        <p>Laravel's Eloquent ORM provides a beautiful, simple ActiveRecord implementation for working with your database. Each database table has a corresponding Model which is used to interact with that table.</p>
      </div>

      <h3>1. Creating Models and Migrations</h3>
      <p>Generate models with migrations using Artisan commands:</p>
      
      <div class="code-example">
        <h4>Model and Migration Generation</h4>
        <pre><code># Create model with migration, controller, and resource controller
php artisan make:model Post -mcr

# Create migration only
php artisan make:migration create_posts_table

# Create model with migration and factory
php artisan make:model Comment -mf</code></pre>
      </div>

      <h3>2. Database Migrations</h3>
      <p>Define your database schema using Laravel migrations:</p>
      
      <div class="code-example">
        <h4>Migration Example - Posts Table</h4>
        <pre><code><?php
// database/migrations/xxxx_xx_xx_create_posts_table.php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('status')->default('draft');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            
            // Add indexes for performance
            $table->index(['status', 'published_at']);
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};</code></pre>
      </div>

      <h3>3. Eloquent Model Definition</h3>
      <p>Create Eloquent models with proper attributes and relationships:</p>
      
      <div class="code-example">
        <h4>Post Model with Relationships</h4>
        <pre><code><?php
// app/Models/Post.php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'status',
        'user_id',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                    ->whereNotNull('published_at');
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
}</code></pre>
      </div>

      <h3>4. Model Relationships</h3>
      <p>Laravel supports various relationship types for modeling your data:</p>
      
      <div class="code-example">
        <h4>User Model with Relationships</h4>
        <pre><code><?php
// app/Models/User.php

class User extends Authenticatable
{
    // One-to-Many: User has many posts
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    // One-to-Many: User has many comments
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    // Many-to-Many: User can have many roles
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)->withTimestamps();
    }

    // Has One Through: User has one latest post
    public function latestPost(): HasOneThrough
    {
        return $this->hasOneThrough(Post::class, Comment::class)
                    ->latest();
    }
}</code></pre>
      </div>

      <h3>5. Model Factories</h3>
      <p>Create model factories for generating test data:</p>
      
      <div class="code-example">
        <h4>Post Factory</h4>
        <pre><code><?php
// database/factories/PostFactory.php

namespace Database\\Factories;

use App\\Models\\User;
use Illuminate\\Database\\Eloquent\\Factories\\Factory;

class PostFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(),
            'content' => fake()->paragraphs(3, true),
            'status' => fake()->randomElement(['draft', 'published']),
            'user_id' => User::factory(),
            'published_at' => fake()->optional(0.7)->dateTimeBetween('-1 year'),
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => fake()->dateTimeBetween('-1 year'),
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }
}</code></pre>
      </div>

      <div class="tip-box">
        <h4>💡 Performance Tip</h4>
        <p>Use eager loading with <code>with()</code> to avoid N+1 query problems. For example: <code>Post::with(['user', 'comments'])->get()</code> loads all related data in just 3 queries instead of potentially hundreds.</p>
      </div>

      <h3>6. Database Seeders</h3>
      <p>Create seeders to populate your database with initial data:</p>
      
      <div class="code-example">
        <h4>Database Seeder</h4>
        <pre><code><?php
// database/seeders/DatabaseSeeder.php

namespace Database\\Seeders;

use App\\Models\\User;
use App\\Models\\Post;
use Illuminate\\Database\\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'email_verified_at' => now(),
        ]);

        // Create regular users with posts
        User::factory(10)
            ->has(Post::factory(3)->published())
            ->create();

        // Create posts for admin
        Post::factory(5)
            ->published()
            ->for($admin)
            ->create();
    }
}</code></pre>
      </div>

      <h3>7. Advanced Querying</h3>
      <p>Leverage Eloquent's query builder for complex database operations:</p>
      
      <div class="code-example">
        <h4>Advanced Query Examples</h4>
        <pre><code># Eager loading with constraints
$posts = Post::with(['comments' => function ($query) {
    $query->where('approved', true)->latest();
}])->published()->paginate(10);

# Subqueries and aggregates
$users = User::withCount(['posts', 'comments'])
    ->withAvg('posts', 'rating')
    ->having('posts_count', '>', 5)
    ->get();

# Raw queries when needed
$popularPosts = Post::selectRaw('*, (likes_count + comments_count) as engagement')
    ->orderBy('engagement', 'desc')
    ->limit(10)
    ->get();</code></pre>
      </div>
    </div>
  `,
  practiceInstructions: [
    "Create Post and Comment models with appropriate migrations",
    "Define relationships between User, Post, and Comment models",
    "Create model factories for generating test data",
    "Run migrations and seed the database with sample data",
  ],
  hints: [
    "Use 'php artisan make:model Post -mcrf' to create model, migration, controller, resource, and factory",
    "Always define inverse relationships for proper Eloquent functionality",
    "Use $fillable or $guarded properties to control mass assignment",
    "Test your relationships in tinker: 'php artisan tinker' then 'User::find(1)->posts'",
  ],
  solution: `# Complete Laravel database setup:

# Create models with migrations and factories
php artisan make:model Post -mcrf
php artisan make:model Comment -mcrf

# Define relationships in models and run migrations
php artisan migrate

# Create and run seeders
php artisan make:seeder PostSeeder
php artisan db:seed

# Test in tinker
php artisan tinker
>>> User::with('posts')->first()
>>> Post::published()->count()`,
};

export default database;
