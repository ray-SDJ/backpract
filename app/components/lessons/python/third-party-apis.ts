import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Working with Third-Party APIs",
  description:
    "Learn how to integrate external APIs like Google Gemini, Claude, OpenAI, and other services into your Python Flask applications.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>Third-party APIs enable you to leverage external services in your Python applications. Learn HTTP requests, authentication, and response handling for AI APIs, payment services, and more.</p>

    <h2>Understanding Third-Party APIs in Python</h2>
    
    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🐍 Python HTTP Libraries</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>requests:</strong> Most popular HTTP library (simple, powerful)</li>
        <li><strong>httpx:</strong> Modern async HTTP client (supports async/await)</li>
        <li><strong>urllib:</strong> Built-in Python library (no installation needed)</li>
        <li><strong>aiohttp:</strong> Async HTTP for high-performance applications</li>
      </ul>
    </div>

    <h2>Making HTTP Requests with Requests Library</h2>
    
    <p>The requests library is the standard for HTTP in Python:</p>

    <pre class="code-block">
      <code>
# Install requests: pip install requests
# requests = most popular Python HTTP library
import requests
import json  # Built-in module for JSON handling

# Making a GET request
# def = define function in Python
def get_user_data(user_id):
    # try = attempt code that might raise exception
    try:
        # requests.get() sends HTTP GET request
        # Returns Response object with status_code, headers, text, json(), etc.
        response = requests.get(f'https://api.example.com/users/{user_id}')
        
        # response.raise_for_status() raises exception for 4xx/5xx errors
        # Automatically handles 404, 500, etc. (cleaner than checking status_code)
        response.raise_for_status()
        
        # response.json() parses JSON response body to Python dict
        # Equivalent to json.loads(response.text)
        data = response.json()
        
        # response.status_code = HTTP status (200, 404, 500, etc.)
        print(f'Status Code: {response.status_code}')
        
        return data
        
    # except = catch exception (like JavaScript catch)
    # requests.exceptions.RequestException = base exception for all requests errors
    except requests.exceptions.RequestException as e:
        # f-string = formatted string (f'{variable}' inserts value)
        print(f'Error fetching user: {e}')
        # raise = re-throw exception to caller
        raise

# Making a POST request with JSON data
def create_user(user_data):
    try:
        # requests.post(url, json=data, headers=headers)
        response = requests.post(
            'https://api.example.com/users',
            # json=data automatically:
            # 1. Converts dict to JSON string
            # 2. Sets Content-Type: application/json header
            json={
                'name': user_data['name'],
                'email': user_data['email'],
                'age': user_data['age']
            },
            # headers = dict of HTTP headers
            headers={
                'Authorization': f"Bearer {os.environ.get('API_KEY')}"
            },
            # timeout = seconds before request fails (prevents hanging)
            timeout=10  # 10 second timeout
        )
        
        response.raise_for_status()
        return response.json()
        
    except requests.exceptions.Timeout:
        # Timeout = request took too long
        print('Request timed out')
        raise
    except requests.exceptions.RequestException as e:
        print(f'Error creating user: {e}')
        raise
      </code>
    </pre>

    <h2>Integrating Google Gemini AI API</h2>
    
    <p>Let's integrate Google's Gemini AI in Flask:</p>

    <pre class="code-block">
      <code>
# Install: pip install google-generativeai flask python-dotenv
# google-generativeai = official Google SDK for Gemini
# python-dotenv = loads environment variables from .env file
import google.generativeai as genai
from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv

# Load environment variables from .env file
# load_dotenv() reads .env and sets environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure Gemini with API key
# os.environ.get() = get environment variable (returns None if not found)
# Store API keys in .env file, NEVER in code!
genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))

# Create endpoint for AI text generation
# @app.route() = Flask decorator to define route
# methods=['POST'] = only accept POST requests
@app.route('/api/ai/generate', methods=['POST'])
def generate_text():
    # try-except = error handling
    try:
        # request.json = parsed JSON from request body
        # request.get_json() is alternative (with error handling)
        data = request.json
        
        # data.get('prompt') = get 'prompt' key from dict
        # .get() returns None if key doesn't exist (safer than data['prompt'])
        prompt = data.get('prompt')
        
        # Validate input
        # not prompt = checks if prompt is None, empty string, etc.
        if not prompt:
            # jsonify() converts dict to JSON response
            # 400 = Bad Request status code
            return jsonify({'error': 'Prompt is required'}), 400
        
        # Get Gemini model
        # GenerativeModel = class representing AI model
        # 'gemini-pro' = model name (text-only model)
        # Other models: gemini-pro-vision (images), gemini-ultra (most capable)
        model = genai.GenerativeModel('gemini-pro')
        
        # Generate content
        # generate_content() sends prompt to Gemini, waits for response
        # Returns GenerateContentResponse object
        response = model.generate_content(prompt)
        
        # Extract text from response
        # response.text = generated text as string
        generated_text = response.text
        
        # Return successful response
        return jsonify({
            'success': True,
            'response': generated_text,
            'model': 'gemini-pro'
        })
        
    # Exception = catches all exceptions (broad catch)
    # Better: catch specific exceptions (ValueError, KeyError, etc.)
    except Exception as e:
        # Log error for debugging
        print(f'Gemini API Error: {e}')
        
        # Return 500 Internal Server Error
        # str(e) = convert exception to string
        return jsonify({
            'error': 'Failed to generate AI response',
            'message': str(e)
        }), 500

# Advanced: Streaming responses
@app.route('/api/ai/stream', methods=['POST'])
def stream_text():
    # Define generator function for streaming
    # def generator() = regular function
    # yield = makes it a generator (returns values one at a time)
    def generate():
        try:
            data = request.json
            prompt = data.get('prompt')
            
            if not prompt:
                # yield = return value and pause (can resume later)
                yield f"data: {json.dumps({'error': 'Prompt required'})}\\n\\n"
                return
            
            model = genai.GenerativeModel('gemini-pro')
            
            # generate_content(stream=True) = returns iterator
            # Iterator yields chunks as they're generated (real-time)
            response = model.generate_content(prompt, stream=True)
            
            # for chunk in response = iterate over response chunks
            # Each chunk contains partial text
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
    
    # Response() = create custom Flask response
    # generate() = generator function (called repeatedly)
    # mimetype = content type for response
    from flask import Response
    return Response(
        generate(),
        mimetype='text/event-stream',  # SSE content type
        headers={
            'Cache-Control': 'no-cache',      # Don't cache stream
            'Connection': 'keep-alive'        # Keep connection open
        }
    )
      </code>
    </pre>

    <h2>Integrating Anthropic Claude API</h2>
    
    <p>Working with Claude AI in Python:</p>

    <pre class="code-block">
      <code>
# Install: pip install anthropic
# anthropic = official SDK for Claude AI
from anthropic import Anthropic
from flask import Flask, request, jsonify

app = Flask(__name__)

# Initialize Claude client
# Anthropic() creates client instance
client = Anthropic(
    # API key from environment variable
    api_key=os.environ.get('CLAUDE_API_KEY')
)

# Create endpoint for Claude chat
@app.route('/api/claude/chat', methods=['POST'])
def claude_chat():
    try:
        # Extract data from request
        data = request.json
        message = data.get('message')
        system_prompt = data.get('system_prompt')
        
        # Validate input
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Call Claude API
        # client.messages.create() = send conversation to Claude
        response = client.messages.create(
            # model = which Claude model to use
            # claude-3-opus = most capable (best quality, slowest)
            # claude-3-sonnet = balanced (good quality, faster)
            # claude-3-haiku = fastest (lower quality, cheapest)
            model='claude-3-sonnet-20240229',
            
            # max_tokens = maximum response length
            # Claude charges per token (input + output)
            # 1 token ≈ 4 characters or 0.75 words
            max_tokens=1024,
            
            # system = instructions for Claude's behavior
            # Guides personality, knowledge, and response style
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
        
        # Return structured response
        return jsonify({
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
            return jsonify({
                'error': 'Rate limit exceeded. Please try again later.'
            }), 429
        
        return jsonify({
            'error': 'Failed to generate response',
            'message': str(e)
        }), 500

# Multi-turn conversation with context
@app.route('/api/claude/conversation', methods=['POST'])
def claude_conversation():
    try:
        data = request.json
        # conversation_history = list of previous messages
        # Maintains context across multiple requests
        conversation_history = data.get('conversation_history', [])
        new_message = data.get('new_message')
        
        if not new_message:
            return jsonify({'error': 'New message is required'}), 400
        
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
        return jsonify({
            'success': True,
            'response': response_text,
            # Include assistant's response in history
            'updated_history': messages + [
                {'role': 'assistant', 'content': response_text}
            ]
        })
        
    except Exception as e:
        print(f'Conversation Error: {e}')
        return jsonify({'error': str(e)}), 500
      </code>
    </pre>

    <h2>Working with Payment APIs (Stripe)</h2>
    
    <p>Integrating payment processing in Python:</p>

    <pre class="code-block">
      <code>
# Install: pip install stripe
# stripe = Python SDK for Stripe payment processing
import stripe
from flask import Flask, request, jsonify

app = Flask(__name__)

# Set Stripe API key
# stripe.api_key = global setting for all Stripe operations
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

# Create payment intent
@app.route('/api/payments/create-intent', methods=['POST'])
def create_payment_intent():
    try:
        data = request.json
        # amount = payment amount in cents (100 = $1.00)
        amount = data.get('amount')
        # currency = three-letter ISO code (usd, eur, gbp, etc.)
        currency = data.get('currency', 'usd')
        description = data.get('description')
        
        # Validate amount
        # isinstance() = check if variable is certain type
        if not amount or not isinstance(amount, int) or amount < 50:
            return jsonify({
                'error': 'Amount must be at least 50 cents'
            }), 400
        
        # Create PaymentIntent
        # stripe.PaymentIntent.create() = initiate payment
        # PaymentIntent = Stripe object representing payment attempt
        intent = stripe.PaymentIntent.create(
            amount=amount,              # Amount in smallest currency unit
            currency=currency,
            description=description,
            # automatic_payment_methods = Stripe handles payment details
            automatic_payment_methods={
                'enabled': True         # Enable cards, wallets, etc.
            },
            # metadata = custom data (not shown to customer)
            # Store order IDs, user IDs, etc. for tracking
            metadata={
                'order_id': data.get('order_id'),
                'user_id': data.get('user_id')
            }
        )
        
        # Return client secret to frontend
        # client_secret = token frontend uses to complete payment
        # NEVER expose secret_key to frontend!
        return jsonify({
            'client_secret': intent.client_secret,
            'payment_intent_id': intent.id
        })
        
    except stripe.error.StripeError as e:
        # StripeError = base exception for all Stripe errors
        print(f'Stripe Error: {e}')
        return jsonify({
            'error': 'Payment intent creation failed',
            'message': str(e)
        }), 500

# Webhook endpoint for Stripe events
@app.route('/api/webhooks/stripe', methods=['POST'])
def stripe_webhook():
    # request.data = raw request body (bytes)
    # Need raw body for signature verification
    payload = request.data
    # request.headers.get() = get HTTP header value
    sig_header = request.headers.get('Stripe-Signature')
    
    # Webhook secret from Stripe dashboard
    endpoint_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')
    
    try:
        # Verify webhook signature
        # stripe.Webhook.construct_event() validates request from Stripe
        # Prevents attackers from faking webhook events
        event = stripe.Webhook.construct_event(
            payload,           # Raw request body
            sig_header,        # Signature from header
            endpoint_secret    # Secret key
        )
    except ValueError as e:
        # Invalid payload
        print(f'Invalid payload: {e}')
        return jsonify({'error': 'Invalid payload'}), 400
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        print(f'Invalid signature: {e}')
        return jsonify({'error': 'Invalid signature'}), 400
    
    # Handle event types
    # event['type'] = what happened (payment succeeded, failed, etc.)
    if event['type'] == 'payment_intent.succeeded':
        # Payment completed successfully
        payment_intent = event['data']['object']
        print(f"Payment succeeded: {payment_intent['id']}")
        
        # Update database: mark order as paid
        # Send confirmation email
        # Grant access to purchased content
        
    elif event['type'] == 'payment_intent.payment_failed':
        # Payment failed
        payment_intent = event['data']['object']
        print(f"Payment failed: {payment_intent['id']}")
        
        # Notify customer
        # Update order status
    
    # Return 200 to acknowledge receipt
    # Stripe retries if not 200
    return jsonify({'success': True})
      </code>
    </pre>

    <h2>Best Practices for Third-Party APIs</h2>
    
    <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-3">✅ Python API Best Practices</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Virtual Environments:</strong> Use venv or virtualenv to isolate dependencies</li>
        <li><strong>Environment Variables:</strong> Use python-dotenv to load .env files</li>
        <li><strong>Type Hints:</strong> Add type hints for better code documentation</li>
        <li><strong>Error Handling:</strong> Use specific exceptions (RequestException, JSONDecodeError)</li>
        <li><strong>Logging:</strong> Use logging module instead of print() for production</li>
        <li><strong>Async/Await:</strong> Use httpx or aiohttp for async operations</li>
        <li><strong>Validation:</strong> Use Pydantic for request/response validation</li>
      </ul>
    </div>

    <h2>Advanced: Retry Logic with Exponential Backoff</h2>
    
    <pre class="code-block">
      <code>
# Retry decorator with exponential backoff
import time
from functools import wraps  # Preserves function metadata

# Decorator = function that wraps another function
# @retry decorator can be applied to any function
def retry_with_backoff(max_retries=3, initial_delay=1):
    # Outer function receives decorator parameters
    def decorator(func):
        # wraps() preserves original function name, docstring, etc.
        @wraps(func)
        # Inner function replaces original function
        def wrapper(*args, **kwargs):
            # *args = positional arguments, **kwargs = keyword arguments
            delay = initial_delay
            
            # Loop through retry attempts
            for attempt in range(max_retries):
                try:
                    # Call original function
                    return func(*args, **kwargs)
                except requests.exceptions.RequestException as e:
                    # Check if should retry
                    if attempt == max_retries - 1:
                        # Last attempt - don't retry
                        raise
                    
                    # Log retry attempt
                    print(f'Retry attempt {attempt + 1} after {delay}s')
                    
                    # Wait before retrying
                    # time.sleep() pauses execution
                    time.sleep(delay)
                    
                    # Exponential backoff: double delay each time
                    delay *= 2  # 1s, 2s, 4s, 8s, etc.
        
        return wrapper
    return decorator

# Usage: apply decorator to function
@retry_with_backoff(max_retries=3, initial_delay=1)
def fetch_data(url):
    # This function will automatically retry on failure
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    return response.json()

# Using the function (retries automatically)
try:
    data = fetch_data('https://api.example.com/data')
    print(data)
except requests.exceptions.RequestException as e:
    print(f'All retries failed: {e}')
      </code>
    </pre>

    <div class="explanation-box bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-orange-900 mb-3">⚠️ Common Python API Pitfalls</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Not using raise_for_status():</strong> Always check HTTP status codes</li>
        <li><strong>Missing timeouts:</strong> Set timeout parameter to avoid hanging</li>
        <li><strong>Hardcoded secrets:</strong> Use environment variables, not strings in code</li>
        <li><strong>Ignoring SSL:</strong> Don't disable SSL verification (verify=False)</li>
        <li><strong>Not closing sessions:</strong> Use 'with' statement or close() explicitly</li>
        <li><strong>Blocking operations:</strong> Use async for high-traffic applications</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Make HTTP requests to external APIs using Python's requests library",
    "Integrate AI services like Google Gemini and Anthropic Claude",
    "Implement payment processing with Stripe in Flask applications",
    "Handle webhooks and streaming responses from third-party services",
    "Apply retry logic and error handling for robust API integrations",
  ],
  practiceInstructions: [
    "Install required packages: pip install requests google-generativeai flask python-dotenv",
    "Create a .env file with API keys (GEMINI_API_KEY, CLAUDE_API_KEY)",
    "Build a Flask endpoint that calls Gemini AI to generate text",
    "Add error handling with try-except blocks for all API calls",
    "Implement retry logic with exponential backoff for failed requests",
  ],
  hints: [
    "Use requests.get() for GET requests and requests.post() for POST requests",
    "Always call response.raise_for_status() to catch HTTP errors",
    "Load environment variables with load_dotenv() from python-dotenv",
    "Set timeout parameter: requests.get(url, timeout=10)",
    "Use @wraps decorator to preserve function metadata in decorators",
  ],
  solution: `# Complete Flask app with Gemini AI integration
from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))

@app.route('/api/ai/generate', methods=['POST'])
def generate_text():
    try:
        data = request.json
        prompt = data.get('prompt')
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        
        return jsonify({
            'success': True,
            'response': response.text
        })
        
    except Exception as e:
        print(f'Error: {e}')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)`,
};

export default lessonData;
