import { LessonData } from "../types";

const intro: LessonData = {
  title: "PHP & Laravel Project Setup",
  difficulty: "Beginner",
  description:
    "Learn to set up a complete PHP development environment with Laravel framework, Composer package management, and MySQL database integration. Master modern PHP development practices and Laravel's elegant syntax.",
  objectives: [
    "Install PHP 8+ and Composer for dependency management",
    "Create new Laravel project with Artisan CLI",
    "Configure database connections and environment variables",
    "Understand Laravel directory structure and MVC architecture",
  ],
  content: `
    <div class="lesson-content">
      <h2>PHP & Laravel Development Setup</h2>
      
      <div class="info-box">
        <h3>What You'll Learn</h3>
        <p>This lesson covers setting up a complete PHP development environment using Laravel framework. You'll learn to use Composer for dependency management, Artisan for project scaffolding, and configure Laravel for database operations.</p>
      </div>

      <h3>1. Prerequisites</h3>
      <p>Before starting, ensure you have:</p>
      <ul>
        <li>PHP 8.1 or later installed</li>
        <li>Composer for PHP dependency management</li>
        <li>MySQL or PostgreSQL database server</li>
        <li>Code editor with PHP support (VS Code with PHP extensions)</li>
      </ul>

      <h3>2. Installing Laravel</h3>
      <p>Laravel provides two ways to create new projects. The Laravel installer is the recommended approach:</p>
      
      <div class="code-example">
        <h4>Laravel Installer Method</h4>
        <pre><code># Install Laravel installer globally via Composer
composer global require laravel/installer

# Create new Laravel project
laravel new laravel-api

# Or using Composer create-project
composer create-project laravel/laravel laravel-api

# Navigate to project directory
cd laravel-api</code></pre>
      </div>

      <h3>3. Project Structure Overview</h3>
      <p>Understanding Laravel's directory structure is crucial for effective development:</p>
      
      <div class="code-example">
        <h4>Laravel Directory Structure</h4>
        <pre><code>laravel-api/
├── app/                 # Application core files
│   ├── Http/
│   │   ├── Controllers/ # Request handling logic
│   │   ├── Middleware/  # HTTP middleware
│   │   └── Requests/    # Form request validation
│   ├── Models/          # Eloquent models
│   └── Providers/       # Service providers
├── bootstrap/           # Application bootstrapping
├── config/             # Configuration files
├── database/
│   ├── migrations/     # Database migrations
│   ├── seeders/        # Database seeders
│   └── factories/      # Model factories
├── public/             # Public web files
├── resources/          # Views and assets
├── routes/
│   ├── api.php         # API routes
│   └── web.php         # Web routes
├── storage/            # File storage
├── tests/              # Unit and feature tests
├── vendor/             # Composer dependencies
├── .env                # Environment variables
├── artisan             # Command line interface
└── composer.json       # PHP dependencies</code></pre>
      </div>

      <h3>4. Environment Configuration</h3>
      <p>Configure your application environment variables in the .env file:</p>
      
      <div class="code-example">
        <h4>.env Configuration</h4>
        <pre><code># Application Configuration
APP_NAME="Laravel API"
APP_ENV=local
APP_KEY=base64:generated-key-here
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_api
DB_USERNAME=root
DB_PASSWORD=your_password

# Mail Configuration (for notifications)
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null

# Cache and Session
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync</code></pre>
      </div>

      <h3>5. Database Setup</h3>
      <p>Laravel includes powerful database tools for migrations and seeding:</p>
      
      <div class="code-example">
        <h4>Database Commands</h4>
        <pre><code># Generate application key
php artisan key:generate

# Create database (MySQL example)
mysql -u root -p
CREATE DATABASE laravel_api;
exit;

# Run database migrations
php artisan migrate

# Create a new migration
php artisan make:migration create_users_table

# Create model with migration
php artisan make:model Post -m</code></pre>
      </div>

      <h3>6. Starting the Development Server</h3>
      <p>Laravel includes a built-in development server powered by PHP:</p>
      
      <div class="code-example">
        <h4>Development Server</h4>
        <pre><code># Start Laravel development server
php artisan serve

# Server will start at http://localhost:8000

# Start with custom host and port
php artisan serve --host=0.0.0.0 --port=8080</code></pre>
      </div>

      <div class="tip-box">
        <h4>💡 Pro Tip</h4>
        <p>Use <code>php artisan tinker</code> to interact with your Laravel application through an interactive shell. It's perfect for testing models, relationships, and experimenting with code.</p>
      </div>

      <h3>7. Essential Artisan Commands</h3>
      <p>Laravel's Artisan CLI provides many helpful commands for development:</p>
      
      <div class="code-example">
        <h4>Common Artisan Commands</h4>
        <pre><code># Create controllers, models, migrations
php artisan make:controller UserController
php artisan make:model User -mcr  # model, migration, controller, resource
php artisan make:request StoreUserRequest

# Database operations
php artisan migrate:fresh --seed
php artisan db:seed
php artisan migrate:rollback

# Clear application cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# View routes and configuration
php artisan route:list
php artisan config:show database</code></pre>
      </div>

      <h3>8. Next Steps</h3>
      <p>With your Laravel environment set up, you're ready to:</p>
      <ul>
        <li>Create Eloquent models and database migrations</li>
        <li>Build controllers and define API routes</li>
        <li>Implement authentication with Laravel Sanctum</li>
        <li>Write comprehensive tests with PHPUnit</li>
      </ul>
    </div>
  `,
  practiceInstructions: [
    "Install PHP 8+ and Composer on your system",
    "Create a new Laravel project using the Laravel installer",
    "Configure the .env file with your database credentials",
    "Run database migrations and start the development server",
  ],
  hints: [
    "Use 'composer global require laravel/installer' to install Laravel globally",
    "Make sure to generate an application key with 'php artisan key:generate'",
    "Test your database connection by running 'php artisan migrate'",
    "Visit http://localhost:8000 to see the Laravel welcome page",
  ],
  solution: `# Complete Laravel setup solution:

# Install Laravel installer globally
composer global require laravel/installer

# Create new project
laravel new laravel-api
cd laravel-api

# Configure environment
cp .env.example .env
php artisan key:generate

# Set up database in .env file
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_api
DB_USERNAME=root
DB_PASSWORD=your_password

# Run migrations and start server
php artisan migrate
php artisan serve

# Your Laravel application is now running at http://localhost:8000`,
};

export default intro;
