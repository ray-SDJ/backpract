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

export default function PHPTutorial() {
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
      title: "Introduction to PHP & Laravel",
      icon: BookOpen,
      overview:
        "PHP is a popular server-side scripting language, and Laravel is an elegant PHP framework that makes web development enjoyable and creative.",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">What is PHP & Laravel?</h3>
            <p className="text-gray-700 mb-3">
              PHP (PHP: Hypertext Preprocessor) is a server-side scripting
              language designed for web development. Laravel is a modern PHP
              framework that follows the MVC pattern and provides elegant syntax
              and powerful features.
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
              <li>
                <strong>Eloquent ORM:</strong> Beautiful, simple ActiveRecord
                implementation
              </li>
              <li>
                <strong>Artisan CLI:</strong> Powerful command-line interface
              </li>
              <li>
                <strong>Blade Templating:</strong> Simple yet powerful
                templating engine
              </li>
              <li>
                <strong>Built-in features:</strong> Routing, middleware,
                authentication, caching
              </li>
              <li>
                <strong>Composer:</strong> Dependency management made easy
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">
              Your First Laravel Application
            </h3>
            <CodeExplanation
              code={`// Install Laravel via Composer
$ composer global require laravel/installer
$ laravel new blog
$ cd blog
$ php artisan serve

// routes/web.php
<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\PostController;

Route::get('/', function () {
    return response()->json([
        'message' => 'Welcome to Laravel!',
        'version' => app()->version(),
        'timestamp' => now()->toISOString()
    ]);
});

Route::get('/posts', [PostController::class, 'index']);
Route::post('/posts', [PostController::class, 'store']);
Route::get('/posts/{id}', [PostController::class, 'show']);
Route::put('/posts/{id}', [PostController::class, 'update']);
Route::delete('/posts/{id}', [PostController::class, 'destroy']);

// app/Http/Controllers/PostController.php
<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;

class PostController extends Controller
{
    public function index(): JsonResponse
    {
        $posts = [
            ['id' => 1, 'title' => 'First Post', 'content' => 'Hello World!'],
            ['id' => 2, 'title' => 'Second Post', 'content' => 'Laravel is awesome!']
        ];
        
        return response()->json([
            'data' => $posts,
            'count' => count($posts)
        ]);
    }
    
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string'
        ]);
        
        // In real app, save to database
        $post = [
            'id' => rand(1000, 9999),
            'title' => $validated['title'],
            'content' => $validated['content'],
            'created_at' => now()->toISOString()
        ];
        
        return response()->json($post, 201);
    }
}`}
              explanation={[
                {
                  label: "Route::get('/', function)",
                  desc: "Define routes with closures or controller methods",
                },
                {
                  label: "response()->json()",
                  desc: "Return JSON responses with proper headers",
                },
                {
                  label: "[PostController::class, 'index']",
                  desc: "Route to controller method using array syntax",
                },
                {
                  label: "$request->validate()",
                  desc: "Built-in validation with rules and automatic error responses",
                },
                {
                  label: "now()->toISOString()",
                  desc: "Laravel's Carbon date helper for easy date manipulation",
                },
              ]}
            />
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">💡 Quick Test</h4>
            <p className="text-sm text-green-800">
              Run with{" "}
              <code className="bg-white px-2 py-1 rounded">
                php artisan serve
              </code>
              , then visit{" "}
              <code className="bg-white px-2 py-1 rounded">
                http://localhost:8000
              </code>
            </p>
          </div>
        </div>
      ),
    },

    {
      id: "eloquent",
      title: "Eloquent ORM & Database",
      icon: Database,
      overview:
        "Master Laravel's Eloquent ORM for elegant database interactions, relationships, and migrations.",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Models & Migrations</h3>
            <CodeExplanation
              code={`// Create model with migration
$ php artisan make:model Post -m

// database/migrations/create_posts_table.php
<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('slug')->unique();
            $table->boolean('published')->default(false);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            
            $table->index(['published', 'created_at']);
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('posts');
    }
};

// app/Models/Post.php
<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\SoftDeletes;

class Post extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $fillable = [
        'title',
        'content', 
        'slug',
        'published',
        'user_id'
    ];
    
    protected $casts = [
        'published' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];
    
    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    
    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
    
    // Accessors & Mutators
    public function getExcerptAttribute(): string
    {
        return substr($this->content, 0, 100) . '...';
    }
    
    public function setTitleAttribute($value)
    {
        $this->attributes['title'] = $value;
        $this->attributes['slug'] = str()->slug($value);
    }
    
    // Scopes
    public function scopePublished($query)
    {
        return $query->where('published', true);
    }
    
    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
}`}
              explanation={[
                {
                  label: "Schema::create()",
                  desc: "Laravel's schema builder for creating database tables",
                },
                {
                  label: "$table->foreignId()->constrained()",
                  desc: "Create foreign key with automatic constraints",
                },
                {
                  label: "protected $fillable",
                  desc: "Mass assignment protection - only these fields can be filled",
                },
                {
                  label: "protected $casts",
                  desc: "Automatically cast attributes to specific types",
                },
                {
                  label: "belongsTo(), hasMany()",
                  desc: "Define Eloquent relationships between models",
                },
              ]}
            />
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">
              Advanced Queries & Relationships
            </h3>
            <CodeExplanation
              code={`// Updated PostController with Eloquent
<?php

namespace App\\Http\\Controllers;

use App\\Models\\Post;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;

class PostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Post::with(['user:id,name', 'tags:id,name'])
                     ->published()
                     ->recent();
        
        // Search functionality
        if ($search = $request->get('search')) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }
        
        // Filter by tag
        if ($tag = $request->get('tag')) {
            $query->whereHas('tags', function($q) use ($tag) {
                $q->where('name', $tag);
            });
        }
        
        $posts = $query->paginate(10);
        
        return response()->json([
            'data' => $posts->items(),
            'pagination' => [
                'current_page' => $posts->currentPage(),
                'total' => $posts->total(),
                'per_page' => $posts->perPage(),
                'last_page' => $posts->lastPage()
            ]
        ]);
    }
    
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:posts',
            'content' => 'required|string|min:10',
            'published' => 'boolean',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id'
        ]);
        
        $post = auth()->user()->posts()->create($validated);
        
        // Attach tags
        if (isset($validated['tags'])) {
            $post->tags()->attach($validated['tags']);
        }
        
        return response()->json(
            $post->load(['user:id,name', 'tags:id,name']), 
            201
        );
    }
    
    public function show(int $id): JsonResponse
    {
        $post = Post::with(['user:id,name,email', 'tags', 'comments.user'])
                   ->findOrFail($id);
        
        return response()->json($post);
    }
    
    public function update(Request $request, int $id): JsonResponse
    {
        $post = Post::findOrFail($id);
        
        // Authorization check
        if ($post->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $validated = $request->validate([
            'title' => 'string|max:255|unique:posts,title,' . $id,
            'content' => 'string|min:10',
            'published' => 'boolean'
        ]);
        
        $post->update($validated);
        
        return response()->json($post->fresh(['user:id,name', 'tags']));
    }
    
    public function destroy(int $id): JsonResponse
    {
        $post = Post::findOrFail($id);
        
        if ($post->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $post->delete(); // Soft delete if using SoftDeletes trait
        
        return response()->json(['message' => 'Post deleted successfully']);
    }
}`}
              explanation={[
                {
                  label: "Post::with(['user:id,name'])",
                  desc: "Eager loading relationships with selected columns",
                },
                {
                  label: "whereHas('tags', function)",
                  desc: "Query based on existence of related models",
                },
                {
                  label: "$query->paginate(10)",
                  desc: "Built-in pagination with metadata",
                },
                {
                  label: "auth()->user()->posts()->create()",
                  desc: "Create related model through relationship",
                },
                {
                  label: "$post->tags()->attach()",
                  desc: "Attach many-to-many relationships",
                },
              ]}
            />
          </div>
        </div>
      ),
    },

    {
      id: "middleware",
      title: "Middleware & Authentication",
      icon: Lock,
      overview:
        "Implement authentication, authorization, and custom middleware to secure your Laravel applications.",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">
              Laravel Sanctum Authentication
            </h3>
            <CodeExplanation
              code={`// Install Sanctum
$ composer require laravel/sanctum
$ php artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider"
$ php artisan migrate

// config/sanctum.php (configure as needed)
// app/Models/User.php
<?php

namespace App\\Models;

use Laravel\\Sanctum\\HasApiTokens;
use Illuminate\\Foundation\\Auth\\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens;
    
    protected $fillable = [
        'name',
        'email', 
        'password',
    ];
    
    protected $hidden = [
        'password',
        'remember_token',
    ];
    
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}

// app/Http/Controllers/AuthController.php
<?php

namespace App\\Http\\Controllers;

use App\\Models\\User;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Support\\Facades\\Hash;
use Illuminate\\Validation\\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed'
        ]);
        
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password'])
        ]);
        
        $token = $user->createToken('auth_token')->plainTextToken;
        
        return response()->json([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer'
        ], 201);
    }
    
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);
        
        $user = User::where('email', $request->email)->first();
        
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.']
            ]);
        }
        
        // Revoke all existing tokens
        $user->tokens()->delete();
        
        $token = $user->createToken('auth_token')->plainTextToken;
        
        return response()->json([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer'
        ]);
    }
    
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json(['message' => 'Successfully logged out']);
    }
    
    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }
}`}
              explanation={[
                {
                  label: "use HasApiTokens",
                  desc: "Trait that adds token authentication capabilities to User model",
                },
                {
                  label: "Hash::make($password)",
                  desc: "Securely hash passwords using bcrypt",
                },
                {
                  label: "$user->createToken('auth_token')",
                  desc: "Create API token for authentication",
                },
                {
                  label: "ValidationException::withMessages",
                  desc: "Throw validation exceptions with custom error messages",
                },
                {
                  label: "$request->user()",
                  desc: "Get authenticated user from request (via middleware)",
                },
              ]}
            />
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">
              Custom Middleware & Route Protection
            </h3>
            <CodeExplanation
              code={`// Create custom middleware
$ php artisan make:middleware AdminMiddleware

// app/Http/Middleware/AdminMiddleware.php
<?php

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        if (!auth()->user()->is_admin) {
            return response()->json(['error' => 'Forbidden'], 403);
        }
        
        return $next($request);
    }
}

// Register middleware in app/Http/Kernel.php
protected $routeMiddleware = [
    // ... other middleware
    'admin' => \\App\\Http\\Middleware\\AdminMiddleware::class,
];

// routes/api.php
<?php

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\AuthController;
use App\\Http\\Controllers\\PostController;
use App\\Http\\Controllers\\AdminController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Post management
    Route::post('/posts', [PostController::class, 'store']);
    Route::put('/posts/{id}', [PostController::class, 'update']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);
});

// Admin only routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'users']);
    Route::get('/analytics', [AdminController::class, 'analytics']);
    Route::delete('/posts/{id}/force', [AdminController::class, 'forceDeletePost']);
});

// Rate limiting
Route::middleware(['throttle:60,1'])->group(function () {
    Route::post('/contact', [ContactController::class, 'send']);
});

// Resource controllers (automatic CRUD routes)
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('tags', TagController::class)->except(['destroy']);
});`}
              explanation={[
                {
                  label: "Route::middleware('auth:sanctum')",
                  desc: "Apply Sanctum authentication middleware to route group",
                },
                {
                  label: "Route::prefix('admin')",
                  desc: "Add prefix to all routes in the group",
                },
                {
                  label: "Route::apiResource()",
                  desc: "Generate standard CRUD routes for a resource",
                },
                {
                  label: "throttle:60,1",
                  desc: "Rate limiting: 60 requests per minute",
                },
                {
                  label: "$next($request)",
                  desc: "Continue to next middleware or controller in chain",
                },
              ]}
            />
          </div>
        </div>
      ),
    },

    {
      id: "advanced",
      title: "Advanced Features & API Design",
      icon: Zap,
      overview:
        "Master advanced Laravel features including API resources, jobs, events, and testing for production-ready applications.",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">
              API Resources & Transformations
            </h3>
            <CodeExplanation
              code={`// Create API resources
$ php artisan make:resource PostResource
$ php artisan make:resource PostCollection

// app/Http/Resources/PostResource.php
<?php

namespace App\\Http\\Resources;

use Illuminate\\Http\\Resources\\Json\\JsonResource;

class PostResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->when($request->routeIs('posts.show'), $this->content),
            'published' => $this->published,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'author' => new UserResource($this->whenLoaded('user')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'comments_count' => $this->whenCounted('comments'),
            'read_time' => $this->getReadTimeAttribute(),
            'links' => [
                'self' => route('posts.show', $this->id),
                'author' => route('users.show', $this->user_id)
            ]
        ];
    }
    
    public function with($request)
    {
        return [
            'meta' => [
                'version' => '1.0',
                'timestamp' => now()->toISOString()
            ]
        ];
    }
}

// app/Http/Resources/PostCollection.php
<?php

namespace App\\Http\\Resources;

use Illuminate\\Http\\Resources\\Json\\ResourceCollection;

class PostCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return [
            'data' => $this->collection,
            'links' => [
                'self' => $request->url(),
            ],
            'meta' => [
                'total' => $this->total(),
                'count' => $this->count(),
                'per_page' => $this->perPage(),
                'current_page' => $this->currentPage(),
                'total_pages' => $this->lastPage()
            ]
        ];
    }
}

// Updated PostController using resources
public function index(Request $request): JsonResponse
{
    $posts = Post::with(['user:id,name', 'tags'])
                 ->withCount('comments')
                 ->published()
                 ->recent()
                 ->paginate(10);
    
    return (new PostCollection($posts))->response();
}

public function show(int $id)
{
    $post = Post::with(['user', 'tags', 'comments.user'])
               ->findOrFail($id);
    
    return new PostResource($post);
}`}
              explanation={[
                {
                  label: "JsonResource",
                  desc: "Transform models into JSON API responses with consistent structure",
                },
                {
                  label: "$this->when(condition, value)",
                  desc: "Conditionally include fields in API response",
                },
                {
                  label: "$this->whenLoaded('user')",
                  desc: "Only include relationship if it was eager loaded",
                },
                {
                  label: "ResourceCollection",
                  desc: "Transform collections with pagination and metadata",
                },
                {
                  label: "with() method",
                  desc: "Add global metadata to all resource responses",
                },
              ]}
            />
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Jobs, Events & Testing</h3>
            <CodeExplanation
              code={`// Create job for heavy processing
$ php artisan make:job ProcessPostCreation

// app/Jobs/ProcessPostCreation.php
<?php

namespace App\\Jobs;

use App\\Models\\Post;
use Illuminate\\Bus\\Queueable;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Foundation\\Bus\\Dispatchable;
use Illuminate\\Queue\\InteractsWithQueue;
use Illuminate\\Queue\\SerializesModels;

class ProcessPostCreation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    
    protected $post;
    
    public function __construct(Post $post)
    {
        $this->post = $post;
    }
    
    public function handle()
    {
        // Generate SEO metadata
        $this->post->update([
            'meta_description' => substr(strip_tags($this->post->content), 0, 160),
            'read_time' => $this->calculateReadTime($this->post->content)
        ]);
        
        // Send notifications
        // Generate sitemap
        // Process images
    }
    
    private function calculateReadTime(string $content): int
    {
        $wordCount = str_word_count(strip_tags($content));
        return max(1, round($wordCount / 200)); // Assuming 200 WPM
    }
}

// Dispatch job in controller
public function store(Request $request): JsonResponse
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'content' => 'required|string|min:10'
    ]);
    
    $post = auth()->user()->posts()->create($validated);
    
    // Dispatch background job
    ProcessPostCreation::dispatch($post);
    
    return new PostResource($post->load('user'));
}

// Feature test
// tests/Feature/PostControllerTest.php
<?php

namespace Tests\\Feature;

use App\\Models\\User;
use App\\Models\\Post;
use Illuminate\\Foundation\\Testing\\RefreshDatabase;
use Tests\\TestCase;

class PostControllerTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_authenticated_user_can_create_post()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user, 'sanctum')
                        ->postJson('/api/posts', [
                            'title' => 'Test Post',
                            'content' => 'This is a test post content.'
                        ]);
        
        $response->assertStatus(201)
                ->assertJson([
                    'data' => [
                        'title' => 'Test Post',
                        'author' => [
                            'name' => $user->name
                        ]
                    ]
                ]);
        
        $this->assertDatabaseHas('posts', [
            'title' => 'Test Post',
            'user_id' => $user->id
        ]);
    }
    
    public function test_guest_cannot_create_post()
    {
        $response = $this->postJson('/api/posts', [
            'title' => 'Test Post',
            'content' => 'Content'
        ]);
        
        $response->assertStatus(401);
    }
    
    public function test_post_requires_validation()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user, 'sanctum')
                        ->postJson('/api/posts', [
                            'title' => '', // Invalid
                            'content' => 'xx' // Too short
                        ]);
        
        $response->assertStatus(422)
                ->assertJsonValidationErrors(['title', 'content']);
    }
}`}
              explanation={[
                {
                  label: "implements ShouldQueue",
                  desc: "Mark job for background processing via queue",
                },
                {
                  label: "ProcessPostCreation::dispatch($post)",
                  desc: "Add job to queue for background execution",
                },
                {
                  label: "use RefreshDatabase",
                  desc: "Reset database between tests for isolation",
                },
                {
                  label: "$this->actingAs($user, 'sanctum')",
                  desc: "Authenticate user for testing protected routes",
                },
                {
                  label: "assertJsonValidationErrors()",
                  desc: "Assert that specific validation errors occurred",
                },
              ]}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              🚀 Production Tips
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use Laravel Horizon for queue monitoring in production</li>
              <li>• Implement API versioning with route prefixes or headers</li>
              <li>• Use Laravel Telescope for debugging and monitoring</li>
              <li>• Cache frequently accessed data with Redis</li>
              <li>• Implement proper logging with different channels</li>
              <li>• Use Laravel Octane for improved performance</li>
            </ul>
          </div>
        </div>
      ),
    },

    {
      id: "deployment",
      title: "Production & Deployment",
      icon: Code2,
      overview:
        "Deploy Laravel applications to production with proper configuration, optimization, and monitoring.",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Production Configuration</h3>
            <CodeExplanation
              code={`// .env.production
APP_NAME="My Laravel App"
APP_ENV=production
APP_KEY=base64:generated-key-here
APP_DEBUG=false
APP_URL=https://myapp.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=production_db
DB_USERNAME=app_user
DB_PASSWORD=secure_password

# Cache & Sessions
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Email
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=postmaster@mg.myapp.com
MAIL_PASSWORD=mailgun-password

# Docker deployment
# Dockerfile
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \\
    git \\
    curl \\
    libpng-dev \\
    libxml2-dev \\
    zip \\
    unzip \\
    nodejs \\
    npm

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader
RUN npm install && npm run production

# Set permissions
RUN chown -R www-data:www-data /var/www \\
    && chmod -R 755 /var/www/storage

# Optimize Laravel
RUN php artisan config:cache \\
    && php artisan route:cache \\
    && php artisan view:cache

EXPOSE 9000
CMD ["php-fpm"]`}
              explanation={[
                {
                  label: "APP_DEBUG=false",
                  desc: "Disable debug mode in production for security and performance",
                },
                {
                  label: "CACHE_DRIVER=redis",
                  desc: "Use Redis for better caching performance in production",
                },
                {
                  label: "--optimize-autoloader",
                  desc: "Optimize Composer autoloader for better performance",
                },
                {
                  label: "php artisan config:cache",
                  desc: "Cache configuration files for faster bootstrap",
                },
                {
                  label: "chown -R www-data:www-data",
                  desc: "Set proper file permissions for web server",
                },
              ]}
            />
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Nginx & Docker Compose</h3>
            <CodeExplanation
              code={`# nginx.conf
server {
    listen 80;
    server_name myapp.com;
    root /var/www/public;
    index index.php index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \\.php$ {
        fastcgi_pass app:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Cache static assets
    location ~* \\.(css|js|gif|ico|jpeg|jpg|png|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    container_name: laravel-app
    restart: unless-stopped
    working_dir: /var/www
    volumes:
      - ./:/var/www
      - ./docker/php/local.ini:/usr/local/etc/php/conf.d/local.ini
    networks:
      - laravel

  nginx:
    image: nginx:alpine
    container_name: laravel-nginx
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./:/var/www
      - ./docker/nginx:/etc/nginx/conf.d
    networks:
      - laravel

  mysql:
    image: mysql:8.0
    container_name: laravel-mysql
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: laravel
      MYSQL_ROOT_PASSWORD: root
      MYSQL_PASSWORD: password
      MYSQL_USER: laravel
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - laravel

  redis:
    image: redis:alpine
    container_name: laravel-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    networks:
      - laravel

networks:
  laravel:
    driver: bridge

volumes:
  mysql_data:`}
              explanation={[
                {
                  label: "fastcgi_pass app:9000",
                  desc: "Forward PHP requests to PHP-FPM container",
                },
                {
                  label: "expires 1y",
                  desc: "Cache static assets for better performance",
                },
                {
                  label: "restart: unless-stopped",
                  desc: "Automatically restart containers on failure",
                },
                {
                  label: "volumes: mysql_data",
                  desc: "Persist database data between container restarts",
                },
                {
                  label: "networks: laravel",
                  desc: "Connect containers in isolated network",
                },
              ]}
            />
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
            <div className="p-2 bg-purple-100 rounded-lg">
              <Icon className="w-5 h-5 text-purple-600" />
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-purple-600 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              PHP & Laravel Tutorial
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Master modern PHP web development with Laravel - from elegant APIs
            to scalable production applications.
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
