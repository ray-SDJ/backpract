import { LessonData } from "../types";

const testing: LessonData = {
  title: "Laravel Testing & Production Deployment",
  difficulty: "Advanced",
  description:
    "Master Laravel testing with PHPUnit and Laravel's testing tools. Learn deployment strategies, performance optimization, caching, and production environment best practices.",
  objectives: [
    "Write comprehensive tests with PHPUnit and Laravel testing helpers",
    "Implement feature tests for API endpoints",
    "Configure production environment with caching and optimization",
    "Deploy Laravel applications with zero-downtime strategies",
  ],
  content: `
    <div class="lesson-content">
      <h2>Laravel Testing & Production Deployment</h2>
      
      <div class="info-box">
        <h3>Laravel Testing Overview</h3>
        <p>Laravel provides excellent testing support with PHPUnit integration, database factories, and testing helpers. Write tests to ensure your application works correctly and maintains quality over time.</p>
      </div>

      <h3>1. PHPUnit Configuration</h3>
      <p>Laravel comes pre-configured with PHPUnit for testing:</p>
      
      <div class="code-example">
        <h4>phpunit.xml Configuration</h4>
        <pre><code><?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="./vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         colors="true">
    <testsuites>
        <testsuite name="Unit">
            <directory suffix="Test.php">./tests/Unit</directory>
        </testsuite>
        <testsuite name="Feature">
            <directory suffix="Test.php">./tests/Feature</directory>
        </testsuite>
    </testsuites>
    <php>
        <env name="APP_ENV" value="testing"/>
        <env name="BCRYPT_ROUNDS" value="4"/>
        <env name="CACHE_DRIVER" value="array"/>
        <env name="DB_CONNECTION" value="sqlite"/>
        <env name="DB_DATABASE" value=":memory:"/>
        <env name="MAIL_MAILER" value="array"/>
        <env name="QUEUE_CONNECTION" value="sync"/>
        <env name="SESSION_DRIVER" value="array"/>
    </php>
</phpunit></code></pre>
      </div>

      <h3>2. Feature Testing for APIs</h3>
      <p>Test your API endpoints with Laravel's HTTP testing tools:</p>
      
      <div class="code-example">
        <h4>API Feature Test</h4>
        <pre><code><?php
// tests/Feature/PostApiTest.php

namespace Tests\\Feature;

use App\\Models\\Post;
use App\\Models\\User;
use Illuminate\\Foundation\\Testing\\RefreshDatabase;
use Laravel\\Sanctum\\Sanctum;
use Tests\\TestCase;

class PostApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_create_post(): void
    {
        $response = $this->postJson('/api/posts', [
            'title' => 'Test Post',
            'content' => 'Test content',
        ]);

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_create_post(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['posts:write']);

        $postData = [
            'title' => 'Test Post',
            'content' => 'This is test content for the post.',
            'status' => 'published',
        ];

        $response = $this->postJson('/api/posts', $postData);

        $response->assertStatus(201)
                ->assertJson([
                    'message' => 'Post created successfully',
                ])
                ->assertJsonStructure([
                    'data' => [
                        'id', 'title', 'content', 'status', 'created_at'
                    ]
                ]);

        $this->assertDatabaseHas('posts', [
            'title' => 'Test Post',
            'user_id' => $user->id,
        ]);
    }

    public function test_user_can_only_update_own_posts(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $post = Post::factory()->for($user1)->create();

        Sanctum::actingAs($user2, ['posts:write']);

        $response = $this->putJson("/api/posts/{$post->id}", [
            'title' => 'Updated Title',
        ]);

        $response->assertStatus(403);
    }

    public function test_posts_are_paginated(): void
    {
        Post::factory(25)->create(['status' => 'published']);

        $response = $this->getJson('/api/posts');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => ['*' => ['id', 'title', 'content']],
                    'links',
                    'meta' => ['current_page', 'total'],
                ]);
    }
}</code></pre>
      </div>

      <h3>3. Unit Testing</h3>
      <p>Write unit tests for your models and business logic:</p>
      
      <div class="code-example">
        <h4>Model Unit Test</h4>
        <pre><code><?php
// tests/Unit/PostTest.php

namespace Tests\\Unit;

use App\\Models\\Post;
use App\\Models\\User;
use Illuminate\\Foundation\\Testing\\RefreshDatabase;
use Tests\\TestCase;

class PostTest extends TestCase
{
    use RefreshDatabase;

    public function test_post_belongs_to_user(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->for($user)->create();

        $this->assertInstanceOf(User::class, $post->user);
        $this->assertEquals($user->id, $post->user->id);
    }

    public function test_published_scope_only_returns_published_posts(): void
    {
        Post::factory()->create(['status' => 'draft']);
        Post::factory()->create(['status' => 'published']);
        Post::factory()->create(['status' => 'published']);

        $publishedPosts = Post::published()->get();

        $this->assertCount(2, $publishedPosts);
        $publishedPosts->each(function ($post) {
            $this->assertEquals('published', $post->status);
        });
    }

    public function test_post_excerpt_is_generated_correctly(): void
    {
        $content = str_repeat('Lorem ipsum dolor sit amet. ', 20);
        $post = Post::factory()->create(['content' => $content]);

        $excerpt = $post->excerpt;

        $this->assertTrue(strlen($excerpt) <= 150);
        $this->assertStringContainsString('Lorem ipsum', $excerpt);
    }
}</code></pre>
      </div>

      <h3>4. Database Testing</h3>
      <p>Use factories and seeders for consistent test data:</p>
      
      <div class="code-example">
        <h4>Test Database Setup</h4>
        <pre><code><?php
// tests/TestCase.php

namespace Tests;

use Illuminate\\Foundation\\Testing\\TestCase as BaseTestCase;
use Illuminate\\Foundation\\Testing\\RefreshDatabase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Seed basic data for all tests
        $this->seed([
            UserSeeder::class,
        ]);
    }

    protected function authenticatedUser(): User
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        return $user;
    }

    protected function authenticatedApiUser(array $abilities = ['*']): User
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user, $abilities);
        return $user;
    }
}</code></pre>
      </div>

      <div class="tip-box">
        <h4>🧪 Testing Best Practice</h4>
        <p>Follow the AAA pattern: Arrange (set up test data), Act (perform the action), Assert (verify the result). Use descriptive test method names that explain what is being tested.</p>
      </div>

      <h3>5. Production Optimization</h3>
      <p>Optimize your Laravel application for production performance:</p>
      
      <div class="code-example">
        <h4>Production Optimization Commands</h4>
        <pre><code># Optimize configuration caching
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimize Composer autoloader
composer install --optimize-autoloader --no-dev

# Queue worker configuration for production
php artisan queue:work --sleep=3 --tries=3 --max-time=3600

# Set up Redis for caching and sessions
# config/cache.php
'default' => env('CACHE_DRIVER', 'redis'),
'stores' => [
    'redis' => [
        'driver' => 'redis',
        'connection' => 'cache',
    ],
],</code></pre>
      </div>

      <h3>6. Docker Production Setup</h3>
      <p>Containerize your Laravel application for consistent deployments:</p>
      
      <div class="code-example">
        <h4>Production Dockerfile</h4>
        <pre><code># Dockerfile
FROM php:8.2-fpm-alpine

# Install dependencies
RUN apk add --no-cache \\
    nginx \\
    supervisor \\
    curl \\
    postgresql-dev \\
    zip \\
    unzip

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install dependencies
RUN composer install --optimize-autoloader --no-dev

# Set permissions
RUN chown -R www-data:www-data /var/www/html \\
    && chmod -R 755 /var/www/html/storage

# Expose port
EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]</code></pre>
      </div>

      <h3>7. CI/CD Pipeline</h3>
      <p>Set up continuous integration and deployment:</p>
      
      <div class="code-example">
        <h4>GitHub Actions Workflow</h4>
        <pre><code># .github/workflows/laravel.yml
name: Laravel CI/CD

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: password
          MYSQL_DATABASE: laravel_test
        options: --health-cmd="mysqladmin ping" --health-interval=10s
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: 8.2
        
    - name: Install dependencies
      run: composer install --prefer-dist --no-progress
      
    - name: Copy environment file
      run: cp .env.example .env
      
    - name: Generate application key
      run: php artisan key:generate
      
    - name: Run tests
      run: php artisan test
      
    - name: Run static analysis
      run: ./vendor/bin/phpstan analyse</code></pre>
      </div>
    </div>
  `,
  practiceInstructions: [
    "Write feature tests for all your API endpoints",
    "Create unit tests for model relationships and business logic",
    "Set up production optimization with caching and configuration",
    "Deploy your application using Docker or cloud platform",
  ],
  hints: [
    "Use 'php artisan make:test PostApiTest' to create feature tests",
    "Run tests with 'php artisan test' or 'vendor/bin/phpunit'",
    "Use in-memory SQLite database for faster test execution",
    "Always test both success and failure scenarios",
  ],
  solution: `# Complete Laravel testing and deployment:

# Run all tests
php artisan test

# Create production optimizations
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Deploy with zero downtime
php artisan down --retry=60
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan up

# Your Laravel application is fully tested and production-ready`,
};

export default testing;
