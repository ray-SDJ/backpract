import { LessonData } from "../types";

const auth: LessonData = {
  title: "Laravel Authentication & API Security",
  difficulty: "Advanced",
  description:
    "Implement secure authentication with Laravel Sanctum for API tokens. Learn user registration, login, JWT alternatives, role-based access control, and security best practices.",
  objectives: [
    "Set up Laravel Sanctum for API authentication",
    "Implement user registration and login endpoints",
    "Create protected routes with middleware",
    "Add role-based permissions and authorization",
  ],
  content: `
    <div class="lesson-content">
      <h2>Laravel Authentication & API Security</h2>
      
      <div class="info-box">
        <h3>Laravel Sanctum Overview</h3>
        <p>Laravel Sanctum provides a featherweight authentication system for SPAs and simple APIs. It allows each user to generate multiple API tokens with specific abilities and scopes.</p>
      </div>

      <h3>1. Laravel Sanctum Setup</h3>
      <p>Install and configure Laravel Sanctum for API authentication:</p>
      
      <div class="code-example">
        <h4>Sanctum Installation</h4>
        <pre><code># Install Sanctum via Composer
composer require laravel/sanctum

# Publish Sanctum configuration
php artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider"

# Run migrations to create personal access tokens table
php artisan migrate</code></pre>
      </div>

      <h3>2. Authentication Controller</h3>
      <p>Create authentication endpoints for registration and login:</p>
      
      <div class="code-example">
        <h4>Auth Controller Implementation</h4>
        <pre><code><?php
// app/Http/Controllers/Api/AuthController.php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\LoginRequest;
use App\\Http\\Requests\\RegisterRequest;
use App\\Http\\Resources\\UserResource;
use App\\Models\\User;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Support\\Facades\\Hash;
use Illuminate\\Validation\\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('api-token', ['posts:read', 'posts:write'])->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'user' => new UserResource($user),
            'token' => $token,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Revoke existing tokens
        $user->tokens()->delete();

        // Create new token with abilities
        $token = $user->createToken('api-token', [
            'posts:read',
            'posts:write',
            'comments:read',
            'comments:write'
        ])->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    public function logout(): JsonResponse
    {
        auth()->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful',
        ]);
    }

    public function user(): JsonResponse
    {
        return response()->json([
            'user' => new UserResource(auth()->user()),
        ]);
    }
}</code></pre>
      </div>

      <h3>3. Request Validation</h3>
      <p>Create validation requests for authentication:</p>
      
      <div class="code-example">
        <h4>Registration Request Validation</h4>
        <pre><code><?php
// app/Http/Requests/RegisterRequest.php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ];
    }
}</code></pre>
      </div>

      <h3>4. Protected Routes & Middleware</h3>
      <p>Protect API routes with Sanctum authentication:</p>
      
      <div class="code-example">
        <h4>Protected API Routes</h4>
        <pre><code><?php
// routes/api.php

use Laravel\\Sanctum\\Http\\Middleware\\EnsureFrontendRequestsAreStateful;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Posts with token abilities
    Route::middleware(['ability:posts:write'])->group(function () {
        Route::post('/posts', [PostController::class, 'store']);
        Route::put('/posts/{post}', [PostController::class, 'update']);
        Route::delete('/posts/{post}', [PostController::class, 'destroy']);
    });
    
    Route::middleware(['ability:posts:read'])->group(function () {
        Route::get('/posts', [PostController::class, 'index']);
        Route::get('/posts/{post}', [PostController::class, 'show']);
    });
});</code></pre>
      </div>

      <h3>5. Role-Based Authorization</h3>
      <p>Implement role-based access control with policies:</p>
      
      <div class="code-example">
        <h4>Post Policy</h4>
        <pre><code><?php
// app/Policies/PostPolicy.php

namespace App\\Policies;

use App\\Models\\Post;
use App\\Models\\User;

class PostPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(?User $user, Post $post): bool
    {
        return $post->status === 'published' || $user?->id === $post->user_id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('writer') || $user->hasRole('admin');
    }

    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || $user->hasRole('admin');
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || $user->hasRole('admin');
    }
}</code></pre>
      </div>

      <div class="tip-box">
        <h4>🔒 Security Best Practice</h4>
        <p>Always validate token abilities and implement proper authorization checks. Use HTTPS in production and consider implementing token refresh mechanisms for long-lived applications.</p>
      </div>

      <h3>6. User Model Enhancement</h3>
      <p>Add role functionality to the User model:</p>
      
      <div class="code-example">
        <h4>Enhanced User Model</h4>
        <pre><code><?php
// app/Models/User.php

use Laravel\\Sanctum\\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function canWrite(): bool
    {
        return in_array($this->role, ['writer', 'editor', 'admin']);
    }
}</code></pre>
      </div>
    </div>
  `,
  practiceInstructions: [
    "Install Laravel Sanctum and run the migration",
    "Create authentication controller with register, login, and logout methods",
    "Implement token-based authentication for API routes",
    "Test authentication flow with registration, login, and protected endpoints",
  ],
  hints: [
    "Use 'composer require laravel/sanctum' to install authentication package",
    "Remember to add HasApiTokens trait to your User model",
    "Test authentication with Postman or curl using Bearer token authorization",
    "Implement proper token abilities for fine-grained access control",
  ],
  solution: `# Complete Laravel authentication setup:

# Install Sanctum
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider"
php artisan migrate

# Test authentication flow:
# 1. Register user
curl -X POST http://localhost:8000/api/register -H "Content-Type: application/json" -d '{"name":"John","email":"john@example.com","password":"password123","password_confirmation":"password123"}'

# 2. Use returned token for protected routes
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/user`,
};

export default auth;
