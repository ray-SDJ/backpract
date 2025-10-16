import { LessonData } from "../types";

const api: LessonData = {
  title: "Laravel RESTful API Development",
  difficulty: "Intermediate",
  description:
    "Build robust RESTful APIs with Laravel controllers, resources, and proper HTTP responses. Learn API routing, validation, error handling, and response formatting for scalable web services.",
  objectives: [
    "Create API controllers and resource routes",
    "Implement API resources for data transformation",
    "Add request validation and error handling",
    "Format consistent JSON responses with proper HTTP status codes",
  ],
  content: `
    <div class="lesson-content">
      <h2>Laravel RESTful API Development</h2>
      
      <div class="info-box">
        <h3>RESTful API Principles</h3>
        <p>Laravel makes it easy to build RESTful APIs following REST conventions. Use resource controllers, API resources, and proper HTTP methods to create scalable and maintainable web services.</p>
      </div>

      <h3>1. API Routes Setup</h3>
      <p>Define API routes using Laravel's route resources:</p>
      
      <div class="code-example">
        <h4>API Routes - routes/api.php</h4>
        <pre><code><?php
// routes/api.php

use App\\Http\\Controllers\\Api\\PostController;
use App\\Http\\Controllers\\Api\\AuthController;
use Illuminate\\Support\\Facades\\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // API Resource routes
    Route::apiResource('posts', PostController::class);
    Route::get('/posts/{post}/comments', [PostController::class, 'comments']);
});

// Public posts (read-only)
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post}', [PostController::class, 'show']);</code></pre>
      </div>

      <h3>2. API Controller Implementation</h3>
      <p>Create API controllers with proper resource methods:</p>
      
      <div class="code-example">
        <h4>Post API Controller</h4>
        <pre><code><?php
// app/Http/Controllers/Api/PostController.php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\StorePostRequest;
use App\\Http\\Requests\\UpdatePostRequest;
use App\\Http\\Resources\\PostResource;
use App\\Models\\Post;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Resources\\Json\\AnonymousResourceCollection;

class PostController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $posts = Post::with(['user', 'comments'])
            ->published()
            ->latest()
            ->paginate(15);

        return PostResource::collection($posts);
    }

    public function show(Post $post): PostResource
    {
        $post->load(['user', 'comments.user']);
        return new PostResource($post);
    }

    public function store(StorePostRequest $request): JsonResponse
    {
        $post = auth()->user()->posts()->create($request->validated());
        
        return response()->json([
            'message' => 'Post created successfully',
            'data' => new PostResource($post->load('user')),
        ], 201);
    }

    public function update(UpdatePostRequest $request, Post $post): JsonResponse
    {
        $this->authorize('update', $post);
        
        $post->update($request->validated());
        
        return response()->json([
            'message' => 'Post updated successfully',
            'data' => new PostResource($post->fresh(['user'])),
        ]);
    }

    public function destroy(Post $post): JsonResponse
    {
        $this->authorize('delete', $post);
        
        $post->delete();
        
        return response()->json([
            'message' => 'Post deleted successfully',
        ], 204);
    }
}</code></pre>
      </div>

      <h3>3. API Resources for Data Transformation</h3>
      <p>Use API resources to format and transform your model data:</p>
      
      <div class="code-example">
        <h4>Post API Resource</h4>
        <pre><code><?php
// app/Http/Resources/PostResource.php

namespace App\\Http\\Resources;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'status' => $this->status,
            'published_at' => $this->published_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Relationships
            'author' => new UserResource($this->whenLoaded('user')),
            'comments' => CommentResource::collection($this->whenLoaded('comments')),
            
            // Computed attributes
            'excerpt' => $this->when(
                $request->routeIs('posts.index'),
                str($this->content)->limit(150)
            ),
            'comments_count' => $this->whenCounted('comments'),
            
            // Conditional fields
            'edit_url' => $this->when(
                $request->user()?->can('update', $this->resource),
                route('posts.edit', $this->id)
            ),
        ];
    }

    public function with(Request $request): array
    {
        return [
            'meta' => [
                'version' => '1.0',
                'author_url' => 'https://example.com/api/users/' . $this->user_id,
            ],
        ];
    }
}</code></pre>
      </div>

      <h3>4. Request Validation</h3>
      <p>Create form requests for API validation:</p>
      
      <div class="code-example">
        <h4>Store Post Request Validation</h4>
        <pre><code><?php
// app/Http/Requests/StorePostRequest.php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;
use Illuminate\\Contracts\\Validation\\Validator;
use Illuminate\\Http\\Exceptions\\HttpResponseException;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255', 'unique:posts,title'],
            'content' => ['required', 'string', 'min:10'],
            'status' => ['sometimes', 'string', 'in:draft,published'],
            'published_at' => ['nullable', 'date', 'after_or_equal:now'],
            'tags' => ['sometimes', 'array', 'max:5'],
            'tags.*' => ['string', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.unique' => 'A post with this title already exists.',
            'content.min' => 'Post content must be at least 10 characters.',
            'tags.max' => 'You can only add up to 5 tags.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422)
        );
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'status' => $this->status ?? 'draft',
        ]);
    }
}</code></pre>
      </div>

      <h3>5. Error Handling</h3>
      <p>Implement consistent API error responses:</p>
      
      <div class="code-example">
        <h4>API Exception Handler</h4>
        <pre><code><?php
// app/Exceptions/Handler.php

public function register(): void
{
    $this->renderable(function (NotFoundHttpException $e, Request $request) {
        if ($request->is('api/*')) {
            return response()->json([
                'message' => 'Resource not found',
            ], 404);
        }
    });

    $this->renderable(function (AuthorizationException $e, Request $request) {
        if ($request->is('api/*')) {
            return response()->json([
                'message' => 'Forbidden. You do not have permission to access this resource.',
            ], 403);
        }
    });

    $this->renderable(function (ValidationException $e, Request $request) {
        if ($request->is('api/*')) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    });
}</code></pre>
      </div>

      <div class="tip-box">
        <h4>💡 API Best Practice</h4>
        <p>Always return consistent JSON responses with proper HTTP status codes. Use 200 for success, 201 for creation, 422 for validation errors, 404 for not found, and 500 for server errors.</p>
      </div>

      <h3>6. API Middleware</h3>
      <p>Add API-specific middleware for rate limiting and CORS:</p>
      
      <div class="code-example">
        <h4>API Route Middleware</h4>
        <pre><code><?php
// app/Http/Kernel.php

protected $middlewareGroups = [
    'api' => [
        \\Laravel\\Sanctum\\Http\\Middleware\\EnsureFrontendRequestsAreStateful::class,
        'throttle:api',
        \\Illuminate\\Routing\\Middleware\\SubstituteBindings::class,
    ],
];

protected $routeMiddleware = [
    'throttle' => \\Illuminate\\Routing\\Middleware\\ThrottleRequests::class,
];

// config/cors.php - Configure CORS for API
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:3000'], // Your frontend URL
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,</code></pre>
      </div>

      <h3>7. API Testing</h3>
      <p>Test your API endpoints using HTTP clients:</p>
      
      <div class="code-example">
        <h4>API Testing Examples</h4>
        <pre><code># Get all posts
curl -X GET "http://localhost:8000/api/posts" \\
  -H "Accept: application/json"

# Create new post (authenticated)
curl -X POST "http://localhost:8000/api/posts" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "My New Post",
    "content": "This is the content of my new post.",
    "status": "published"
  }'

# Update post
curl -X PUT "http://localhost:8000/api/posts/1" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Updated Post Title"}'

# Delete post
curl -X DELETE "http://localhost:8000/api/posts/1" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN"</code></pre>
      </div>
    </div>
  `,
  practiceInstructions: [
    "Create API routes using Laravel's apiResource method",
    "Build PostController with CRUD methods and proper HTTP responses",
    "Create PostResource for consistent data transformation",
    "Test all API endpoints using curl or Postman",
  ],
  hints: [
    "Use 'php artisan make:controller Api/PostController --api' for API-only controllers",
    "Create resources with 'php artisan make:resource PostResource'",
    "Always validate input data using Form Request classes",
    "Return appropriate HTTP status codes: 200 (OK), 201 (Created), 422 (Validation Error)",
  ],
  solution: `# Complete Laravel API implementation:

# Create API controller and resources
php artisan make:controller Api/PostController --api
php artisan make:resource PostResource
php artisan make:request StorePostRequest

# Add API routes in routes/api.php
Route::apiResource('posts', PostController::class);

# Test the API
curl -H "Accept: application/json" http://localhost:8000/api/posts

# The API should return properly formatted JSON responses with consistent structure`,
};

export default api;
