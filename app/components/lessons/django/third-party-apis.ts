import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Working with Third-Party APIs",
  description:
    "Learn how to integrate external APIs like Google Gemini, Claude, OpenAI, and other services into your Django applications.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>Third-party APIs enable powerful integrations in Django applications. Learn how to make HTTP requests, handle authentication, and process responses from AI services, payment gateways, and external data sources.</p>

    <h2>Understanding Third-Party APIs in Django</h2>
    
    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🎸 Django API Integration</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>requests:</strong> Most popular Python HTTP library</li>
        <li><strong>Django REST Framework:</strong> Build APIs that call other APIs</li>
        <li><strong>Celery:</strong> Background tasks for slow API calls</li>
        <li><strong>django-environ:</strong> Manage environment variables securely</li>
      </ul>
    </div>

    <h2>Setting Up Environment Variables</h2>
    
    <p>First, let's configure Django to use environment variables:</p>

    <pre class="code-block">
      <code>
# Install: pip install python-dotenv requests
# python-dotenv = loads .env file into environment
# requests = HTTP client library

# settings.py
# Import dotenv at top of file
from pathlib import Path
import os
from dotenv import load_dotenv

# Load .env file
# load_dotenv() reads .env and sets environment variables
load_dotenv()

# Access environment variables
# os.environ.get('KEY') = get environment variable
# Second argument = default value if not found
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
CLAUDE_API_KEY = os.environ.get('CLAUDE_API_KEY')
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')

# .env file (create in project root):
# GEMINI_API_KEY=your_gemini_key_here
# CLAUDE_API_KEY=your_claude_key_here
# STRIPE_SECRET_KEY=your_stripe_key_here

# IMPORTANT: Add .env to .gitignore!
# Never commit API keys to version control
      </code>
    </pre>

    <h2>Making HTTP Requests in Django Views</h2>
    
    <p>Using the requests library in Django views:</p>

    <pre class="code-block">
      <code>
# views.py
# Import Django modules
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import requests
import json

# @require_http_methods() = only allow specific HTTP methods
# Similar to Flask's methods=['POST']
@require_http_methods(['POST'])
# @csrf_exempt = disable CSRF protection for API endpoint
# CSRF = Cross-Site Request Forgery protection
# Disable for external API calls (enable for forms)
@csrf_exempt
def fetch_external_data(request):
    # try = attempt code that might raise exception
    try:
        # json.loads() = parse JSON string to Python dict
        # request.body = raw request body (bytes)
        # decode() = convert bytes to string
        data = json.loads(request.body.decode('utf-8'))
        
        # Extract user_id from request
        user_id = data.get('user_id')
        
        # Validate input
        if not user_id:
            # JsonResponse() = Django's JSON response helper
            # status=400 = Bad Request
            return JsonResponse(
                {'error': 'user_id is required'}, 
                status=400
            )
        
        # Make GET request to external API
        # f-string = formatted string (f'{variable}' inserts value)
        # timeout=10 = request fails if takes longer than 10 seconds
        response = requests.get(
            f'https://api.example.com/users/{user_id}',
            # headers = dict of HTTP headers
            headers={
                'Authorization': f'Bearer {settings.GEMINI_API_KEY}',
                'Content-Type': 'application/json'
            },
            timeout=10
        )
        
        # response.raise_for_status() = raise exception for 4xx/5xx errors
        # Automatically handles 404, 500, etc.
        response.raise_for_status()
        
        # response.json() = parse JSON response to dict
        external_data = response.json()
        
        # Return successful response
        return JsonResponse({
            'success': True,
            'data': external_data
        })
        
    # except = catch exception (like JavaScript catch)
    # requests.exceptions.Timeout = request took too long
    except requests.exceptions.Timeout:
        return JsonResponse(
            {'error': 'Request timed out'}, 
            status=504  # 504 = Gateway Timeout
        )
    # requests.exceptions.RequestException = base exception for all requests errors
    except requests.exceptions.RequestException as e:
        return JsonResponse(
            {'error': f'API request failed: {str(e)}'}, 
            status=500  # 500 = Internal Server Error
        )
    except json.JSONDecodeError:
        # JSONDecodeError = invalid JSON in request body
        return JsonResponse(
            {'error': 'Invalid JSON in request body'}, 
            status=400
        )
      </code>
    </pre>

    <h2>Integrating Google Gemini AI</h2>
    
    <p>Let's create a Django view for Gemini AI text generation:</p>

    <pre class="code-block">
      <code>
# Install: pip install google-generativeai
# views.py
import google.generativeai as genai
from django.http import JsonResponse, StreamingHttpResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json

# Configure Gemini with API key
# genai.configure() = set API key globally
genai.configure(api_key=settings.GEMINI_API_KEY)

@require_http_methods(['POST'])
@csrf_exempt
def generate_ai_text(request):
    try:
        # Parse request body
        data = json.loads(request.body.decode('utf-8'))
        prompt = data.get('prompt')
        
        # Validate input
        if not prompt:
            return JsonResponse(
                {'error': 'Prompt is required'}, 
                status=400
            )
        
        # Get Gemini model
        # GenerativeModel = class representing AI model
        # 'gemini-pro' = text-only model
        # Other models: 'gemini-pro-vision' (images)
        model = genai.GenerativeModel('gemini-pro')
        
        # Generate content
        # generate_content() sends prompt to Gemini
        # Returns GenerateContentResponse object
        response = model.generate_content(prompt)
        
        # Extract generated text
        # response.text = AI-generated text as string
        generated_text = response.text
        
        # Return response
        return JsonResponse({
            'success': True,
            'response': generated_text,
            'model': 'gemini-pro'
        })
        
    except Exception as e:
        # Log error (use Django's logging in production)
        print(f'Gemini API Error: {e}')
        
        return JsonResponse({
            'error': 'Failed to generate AI response',
            'message': str(e)
        }, status=500)

# Advanced: Streaming responses
@require_http_methods(['POST'])
@csrf_exempt
def stream_ai_text(request):
    # Define generator function for streaming
    # Generator = function that yields values one at a time
    def generate_stream():
        try:
            # Parse request
            data = json.loads(request.body.decode('utf-8'))
            prompt = data.get('prompt')
            
            if not prompt:
                # yield = return value and pause (can resume later)
                yield f"data: {json.dumps({'error': 'Prompt required'})}\\n\\n"
                return
            
            model = genai.GenerativeModel('gemini-pro')
            
            # generate_content(stream=True) = returns iterator
            # Iterator yields chunks as they're generated
            response = model.generate_content(prompt, stream=True)
            
            # Iterate over response chunks
            # for chunk in response = loop through each chunk
            for chunk in response:
                # chunk.text = text from current chunk
                chunk_text = chunk.text
                
                # Server-Sent Events (SSE) format
                # data: prefix required by SSE protocol
                # \\n\\n = two newlines signal end of message
                yield f"data: {json.dumps({'text': chunk_text})}\\n\\n"
                
        except Exception as e:
            print(f'Streaming Error: {e}')
            yield f"data: {json.dumps({'error': str(e)})}\\n\\n"
    
    # StreamingHttpResponse = Django response for streaming
    # generate_stream() = generator function
    return StreamingHttpResponse(
        generate_stream(),
        content_type='text/event-stream',  # SSE content type
        headers={
            'Cache-Control': 'no-cache',       # Don't cache stream
            'X-Accel-Buffering': 'no'          # Disable nginx buffering
        }
    )
      </code>
    </pre>

    <h2>Integrating Anthropic Claude AI</h2>
    
    <p>Working with Claude AI in Django:</p>

    <pre class="code-block">
      <code>
# Install: pip install anthropic
from anthropic import Anthropic
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json

# Initialize Claude client
# Anthropic() creates client instance
client = Anthropic(api_key=settings.CLAUDE_API_KEY)

@require_http_methods(['POST'])
@csrf_exempt
def claude_chat(request):
    try:
        # Parse request body
        data = json.loads(request.body.decode('utf-8'))
        message = data.get('message')
        system_prompt = data.get('system_prompt')
        
        # Validate input
        if not message:
            return JsonResponse(
                {'error': 'Message is required'}, 
                status=400
            )
        
        # Call Claude API
        # client.messages.create() = send conversation to Claude
        response = client.messages.create(
            # model = which Claude model to use
            # claude-3-opus = most capable (best quality)
            # claude-3-sonnet = balanced (good quality, faster)
            # claude-3-haiku = fastest (lower quality, cheapest)
            model='claude-3-sonnet-20240229',
            
            # max_tokens = maximum response length
            # Claude charges per token (1 token ≈ 4 characters)
            max_tokens=1024,
            
            # system = instructions for Claude's behavior
            # Optional: guides personality and response style
            system=system_prompt or 'You are a helpful assistant.',
            
            # messages = list of conversation messages
            # Each message is dict with 'role' and 'content'
            messages=[
                {
                    'role': 'user',      # 'user' = human, 'assistant' = AI
                    'content': message   # Message text
                }
            ]
        )
        
        # Extract response text
        # response.content = list of content blocks
        # [0] = first block (usually only one)
        # .text = text content from block
        response_text = response.content[0].text
        
        # Return response
        return JsonResponse({
            'success': True,
            'response': response_text,
            'model': response.model,
            # usage = token usage (for monitoring costs)
            'usage': {
                'input_tokens': response.usage.input_tokens,
                'output_tokens': response.usage.output_tokens
            }
        })
        
    except Exception as e:
        print(f'Claude API Error: {e}')
        
        # Check for rate limiting
        # hasattr() = check if object has attribute
        if hasattr(e, 'status_code') and e.status_code == 429:
            # 429 = Too Many Requests (rate limit)
            return JsonResponse({
                'error': 'Rate limit exceeded. Please try again later.'
            }, status=429)
        
        return JsonResponse({
            'error': 'Failed to generate response',
            'message': str(e)
        }, status=500)

# Multi-turn conversation with context
@require_http_methods(['POST'])
@csrf_exempt
def claude_conversation(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        # conversation_history = list of previous messages
        # Maintains context across multiple requests
        conversation_history = data.get('conversation_history', [])
        new_message = data.get('new_message')
        
        if not new_message:
            return JsonResponse(
                {'error': 'New message is required'}, 
                status=400
            )
        
        # Build messages list with history
        # conversation_history + [...] = concatenate lists
        messages = conversation_history + [
            {'role': 'user', 'content': new_message}
        ]
        
        response = client.messages.create(
            model='claude-3-sonnet-20240229',
            max_tokens=1024,
            messages=messages  # Full conversation history
        )
        
        response_text = response.content[0].text
        
        # Return response with updated history
        return JsonResponse({
            'success': True,
            'response': response_text,
            # Include assistant's response in history
            'updated_history': messages + [
                {'role': 'assistant', 'content': response_text}
            ]
        })
        
    except Exception as e:
        print(f'Conversation Error: {e}')
        return JsonResponse(
            {'error': str(e)}, 
            status=500
        )
      </code>
    </pre>

    <h2>Django URL Configuration</h2>
    
    <p>Register your API endpoints in urls.py:</p>

    <pre class="code-block">
      <code>
# urls.py
from django.urls import path
from . import views

# urlpatterns = list of URL patterns
urlpatterns = [
    # path() = define URL route
    # First argument = URL pattern
    # Second argument = view function
    # Third argument = name for reverse URL lookup
    path('api/ai/generate/', views.generate_ai_text, name='ai_generate'),
    path('api/ai/stream/', views.stream_ai_text, name='ai_stream'),
    path('api/claude/chat/', views.claude_chat, name='claude_chat'),
    path('api/claude/conversation/', views.claude_conversation, name='claude_conversation'),
]
      </code>
    </pre>

    <h2>Using Django REST Framework</h2>
    
    <p>For more structured API views, use Django REST Framework:</p>

    <pre class="code-block">
      <code>
# Install: pip install djangorestframework
# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import google.generativeai as genai
from django.conf import settings

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)

# @api_view() = DRF decorator for function-based views
# Handles request parsing, authentication, etc.
@api_view(['POST'])
def generate_text_drf(request):
    # request.data = parsed request body (JSON, form data, etc.)
    # DRF automatically parses based on Content-Type header
    prompt = request.data.get('prompt')
    
    # Validate input
    if not prompt:
        # Response() = DRF response class
        # status.HTTP_400_BAD_REQUEST = 400 status code constant
        return Response(
            {'error': 'Prompt is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        
        # Return successful response
        # DRF automatically serializes dict to JSON
        return Response({
            'success': True,
            'response': response.text
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Class-based view with DRF
from rest_framework.views import APIView

# APIView = base class for DRF class-based views
class GeminiAPIView(APIView):
    # post() = handle POST requests
    # self = instance reference (like 'this' in JavaScript)
    def post(self, request):
        prompt = request.data.get('prompt')
        
        if not prompt:
            return Response(
                {'error': 'Prompt is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content(prompt)
            
            return Response({
                'success': True,
                'response': response.text
            })
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
      </code>
    </pre>

    <h2>Best Practices for Django API Integration</h2>
    
    <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-3">✅ Django API Best Practices</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Use django-environ:</strong> Better environment variable management</li>
        <li><strong>Celery for slow APIs:</strong> Run API calls in background tasks</li>
        <li><strong>Cache responses:</strong> Use Django's cache framework to reduce API calls</li>
        <li><strong>Rate limiting:</strong> Use django-ratelimit to prevent abuse</li>
        <li><strong>Django REST Framework:</strong> More structured API development</li>
        <li><strong>Logging:</strong> Use Django's logging framework for debugging</li>
        <li><strong>Settings organization:</strong> Use separate settings for dev/prod</li>
      </ul>
    </div>

    <h2>Asynchronous API Calls with Celery</h2>
    
    <pre class="code-block">
      <code>
# Install: pip install celery redis
# tasks.py - Celery tasks for background processing

from celery import shared_task
import google.generativeai as genai
from django.conf import settings

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)

# @shared_task = decorator to create Celery task
# Task = function that runs in background worker
@shared_task
def generate_ai_response_async(prompt, user_id):
    # This runs in separate worker process
    # Won't block Django web server
    try:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        
        # Save result to database
        # Import here to avoid circular imports
        from .models import AIResponse
        AIResponse.objects.create(
            user_id=user_id,
            prompt=prompt,
            response=response.text
        )
        
        return {'success': True, 'response': response.text}
        
    except Exception as e:
        return {'success': False, 'error': str(e)}

# views.py - Trigger background task
from .tasks import generate_ai_response_async

@require_http_methods(['POST'])
@csrf_exempt
def generate_async(request):
    data = json.loads(request.body.decode('utf-8'))
    prompt = data.get('prompt')
    user_id = data.get('user_id')
    
    # .delay() = execute task asynchronously
    # Returns task ID immediately (doesn't wait for completion)
    task = generate_ai_response_async.delay(prompt, user_id)
    
    # Return task ID to client
    # Client can poll /api/task-status/<task_id>/ to check progress
    return JsonResponse({
        'task_id': task.id,
        'status': 'processing'
    })
      </code>
    </pre>

    <div class="explanation-box bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-orange-900 mb-3">⚠️ Django API Security</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>CSRF Protection:</strong> Use @csrf_exempt carefully (only for external APIs)</li>
        <li><strong>Authentication:</strong> Add authentication to API endpoints</li>
        <li><strong>Rate Limiting:</strong> Prevent abuse with django-ratelimit</li>
        <li><strong>HTTPS Only:</strong> Always use HTTPS in production</li>
        <li><strong>Input Validation:</strong> Validate all user input before API calls</li>
        <li><strong>Secret Rotation:</strong> Rotate API keys periodically</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Configure Django to use environment variables for API keys",
    "Make HTTP requests to external APIs from Django views",
    "Integrate AI services like Google Gemini and Anthropic Claude",
    "Use Django REST Framework for structured API development",
    "Implement background tasks with Celery for slow API calls",
  ],
  practiceInstructions: [
    "Install required packages: pip install requests google-generativeai python-dotenv",
    "Create a .env file with GEMINI_API_KEY",
    "Create a Django view that calls Gemini AI to generate text",
    "Add URL pattern for your API endpoint in urls.py",
    "Test your endpoint with curl or Postman",
  ],
  hints: [
    "Use @csrf_exempt decorator for external API endpoints",
    "Load environment variables with python-dotenv in settings.py",
    "Use JsonResponse for JSON responses in Django views",
    "Always add try-except blocks for external API calls",
    "Use Django REST Framework for cleaner API code",
  ],
  solution: `# Complete Django view with Gemini AI
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import google.generativeai as genai
import json

genai.configure(api_key=settings.GEMINI_API_KEY)

@require_http_methods(['POST'])
@csrf_exempt
def generate_text(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        prompt = data.get('prompt')
        
        if not prompt:
            return JsonResponse({'error': 'Prompt is required'}, status=400)
        
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        
        return JsonResponse({
            'success': True,
            'response': response.text
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)`,
};

export default lessonData;
