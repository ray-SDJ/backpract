import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Flask Deployment",
  description:
    "Learn how to deploy Flask applications to production using Gunicorn, Docker, and cloud platforms.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <p>In this lesson, you'll learn how to deploy your Flask application to production environments with proper security, performance, and scalability considerations.</p>

    <h2>Production WSGI Server (Gunicorn)</h2>
    
    <p>Flask's built-in development server is not suitable for production. Use Gunicorn as your WSGI server:</p>

    <pre class="code-block">
      <code>
# Install Gunicorn
pip install gunicorn

# Basic Gunicorn command
gunicorn -w 4 -b 0.0.0.0:8000 app:app

# With configuration file
gunicorn -c gunicorn.conf.py app:app
      </code>
    </pre>

    <p>Create a Gunicorn configuration file:</p>

    <pre class="code-block">
      <code>
# gunicorn.conf.py
import multiprocessing

# Server socket
bind = "0.0.0.0:8000"
backlog = 2048

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2

# Restart workers after this many requests
max_requests = 1000
max_requests_jitter = 50

# Logging
accesslog = "/var/log/gunicorn/access.log"
errorlog = "/var/log/gunicorn/error.log"
loglevel = "info"

# Process naming
proc_name = "flask_app"

# Server mechanics
daemon = False
pidfile = "/var/run/gunicorn/gunicorn.pid"
user = "www-data"
group = "www-data"
      </code>
    </pre>

    <h2>Environment Configuration</h2>
    
    <p>Set up environment-specific configurations:</p>

    <pre class="code-block">
      <code>
# config.py
import os
from datetime import timedelta

class Config:
    """Base configuration"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Email configuration
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 587)
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'true').lower() in ['true', 'on', '1']
    
    # Session configuration
    PERMANENT_SESSION_LIFETIME = timedelta(hours=1)

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    
    # Use PostgreSQL in production
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://user:pass@localhost/proddb'
    
    # Security headers
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') or 'sqlite:///dev.db'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
      </code>
    </pre>

    <h2>Environment Variables</h2>
    
    <p>Use environment variables for sensitive configuration:</p>

    <pre class="code-block">
      <code>
# .env (for development - never commit to version control)
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost/myapp
MAIL_SERVER=smtp.gmail.com
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Load environment variables in your app
from dotenv import load_dotenv
import os

# Load environment variables
if os.path.exists('.env'):
    load_dotenv('.env')

def create_app(config_name=None):
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'default')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    return app
      </code>
    </pre>

    <h2>Docker Deployment</h2>
    
    <p>Containerize your Flask application with Docker:</p>

    <pre class="code-block">
      <code>
# Dockerfile
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV FLASK_ENV production

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \\
    postgresql-client && \\
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /app/

# Create user for security
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Start Gunicorn
CMD ["gunicorn", "-c", "gunicorn.conf.py", "app:app"]
      </code>
    </pre>

    <pre class="code-block">
      <code>
# docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/flask_app
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=flask_app
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - web

volumes:
  postgres_data:
      </code>
    </pre>

    <h2>Nginx Configuration</h2>
    
    <p>Use Nginx as a reverse proxy for production:</p>

    <pre class="code-block">
      <code>
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream flask_app {
        server web:8000;
    }

    server {
        listen 80;
        server_name your-domain.com;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;

        # Static files
        location /static {
            alias /app/static;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Main application
        location / {
            proxy_pass http://flask_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }
    }
}
      </code>
    </pre>

    <h2>Database Migrations in Production</h2>
    
    <p>Handle database migrations safely in production:</p>

    <pre class="code-block">
      <code>
# Production deployment script
#!/bin/bash
# deploy.sh

set -e

echo "Starting deployment..."

# Pull latest code
git pull origin main

# Install/update dependencies
pip install -r requirements.txt

# Run database migrations
flask db upgrade

# Restart application
sudo systemctl restart gunicorn
sudo systemctl restart nginx

echo "Deployment complete!"

# Health check endpoint
@app.route('/health')
def health_check():
    """Application health check"""
    try:
        # Check database connection
        db.session.execute('SELECT 1')
        
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow(),
            'version': '1.0.0'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 503
      </code>
    </pre>

    <h2>Monitoring and Logging</h2>
    
    <p>Set up proper logging and monitoring:</p>

    <pre class="code-block">
      <code>
# app/logging_config.py
import logging
import os
from logging.handlers import RotatingFileHandler

def setup_logging(app):
    """Configure application logging"""
    if not app.debug and not app.testing:
        # Create logs directory
        if not os.path.exists('logs'):
            os.mkdir('logs')
        
        # File handler for errors
        file_handler = RotatingFileHandler(
            'logs/flask_app.log', 
            maxBytes=10240000, 
            backupCount=10
        )
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        
        app.logger.setLevel(logging.INFO)
        app.logger.info('Flask application startup')

# requirements.txt for production
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
Flask-Migrate==4.0.5
python-dotenv==1.0.0
gunicorn==21.2.0
psycopg2-binary==2.9.7
redis==4.6.0
      </code>
    </pre>

    <div class="explanation-box bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-yellow-900 mb-3">🚀 Production Checklist</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Security:</strong> Use HTTPS, secure cookies, environment variables for secrets</li>
        <li><strong>Database:</strong> Use PostgreSQL, connection pooling, proper backups</li>
        <li><strong>Monitoring:</strong> Set up logging, health checks, and error tracking</li>
        <li><strong>Performance:</strong> Use CDN, caching, database optimization</li>
      </ul>
    </div>

    <div class="quick-test bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-2">💡 Quick Test</h4>
      <p class="text-sm text-green-800">
        Deploy a Flask application using Docker and Nginx. Set up proper environment configuration, 
        database migrations, logging, and health checks. Test the deployment with load testing tools.
      </p>
    </div>
  </div>`,
  objectives: [
    "Configure Flask applications for production environments",
    "Deploy applications using Gunicorn and Nginx",
    "Containerize Flask apps with Docker and Docker Compose",
    "Implement proper security and environment management",
    "Set up monitoring, logging, and health checks",
  ],
  practiceInstructions: [
    "Set up production configuration with environment variables",
    "Create Gunicorn configuration for optimal performance",
    "Build Docker containers for your Flask application",
    "Configure Nginx as a reverse proxy with security headers",
    "Implement database migrations and deployment scripts",
    "Set up logging and health check endpoints",
  ],
  hints: [
    "Never use Flask's development server in production",
    "Store all secrets in environment variables, not in code",
    "Use PostgreSQL or MySQL for production databases",
    "Implement proper error handling and logging",
    "Set up SSL/TLS certificates for HTTPS",
    "Test your deployment thoroughly before going live",
  ],
  solution: `# Production deployment with Docker
# Dockerfile
FROM python:3.11-slim
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
RUN adduser --disabled-password appuser
RUN chown -R appuser:appuser /app
USER appuser
EXPOSE 8000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "app:app"]

# docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports: ["8000:8000"]
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/flask_app
    depends_on: [db]
  
  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=flask_app
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes: [postgres_data:/var/lib/postgresql/data]

volumes:
  postgres_data:

# Deploy with: docker-compose up -d`,
};
