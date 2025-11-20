import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Error & Exception Handling in Python",
  description:
    "Master Python exception handling with try-except blocks, custom exceptions, error logging, and best practices for building robust applications.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <h2>Understanding Exceptions in Python</h2>
    <p>Exceptions are events that disrupt the normal flow of a program. Python uses exceptions to handle errors gracefully rather than crashing your application.</p>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🔍 How Python Exceptions Work</h4>
      <p class="text-sm text-blue-800 mb-2">
        When an error occurs, Python creates an exception object and "raises" it. If not caught, the exception propagates up the call stack until it crashes the program.
      </p>
      <ul class="text-sm text-blue-800 space-y-1 ml-4">
        <li>• <strong>try:</strong> Code that might raise an exception</li>
        <li>• <strong>except:</strong> Code to handle the exception</li>
        <li>• <strong>else:</strong> Code that runs if no exception occurred</li>
        <li>• <strong>finally:</strong> Code that always runs (cleanup)</li>
      </ul>
    </div>

    <h2>Basic Exception Handling</h2>
    <p>Use try-except blocks to catch and handle exceptions:</p>

    <pre class="code-block">
      <code>
# Basic try-except
def divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        print("Error: Cannot divide by zero!")
        return None

# Catching multiple exceptions
def process_data(data):
    try:
        value = int(data)
        result = 100 / value
        return result
    except ValueError:
        print("Error: Invalid number format")
        return None
    except ZeroDivisionError:
        print("Error: Cannot divide by zero")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

# Multiple exceptions in one line
def safe_convert(value):
    try:
        return int(value)
    except (ValueError, TypeError) as e:
        print(f"Conversion error: {e}")
        return 0
      </code>
    </pre>

    <h2>Common Built-in Exceptions</h2>
    <div class="complexity-table bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-gray-900 mb-3">📋 Python Exception Types</h4>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-300">
            <th class="text-left py-2">Exception</th>
            <th class="text-left py-2">When It Occurs</th>
            <th class="text-left py-2">Example</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>ValueError</code></td>
            <td class="py-2">Invalid value</td>
            <td class="py-2">int("abc")</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>TypeError</code></td>
            <td class="py-2">Wrong type</td>
            <td class="py-2">"2" + 2</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>KeyError</code></td>
            <td class="py-2">Missing dict key</td>
            <td class="py-2">d["missing"]</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>IndexError</code></td>
            <td class="py-2">Invalid list index</td>
            <td class="py-2">list[999]</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>FileNotFoundError</code></td>
            <td class="py-2">File doesn't exist</td>
            <td class="py-2">open("missing.txt")</td>
          </tr>
          <tr class="border-b border-gray-200">
            <td class="py-2"><code>AttributeError</code></td>
            <td class="py-2">Missing attribute</td>
            <td class="py-2">obj.missing_method()</td>
          </tr>
          <tr>
            <td class="py-2"><code>ImportError</code></td>
            <td class="py-2">Import fails</td>
            <td class="py-2">import nonexistent</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>Try-Except-Else-Finally</h2>
    <p>Complete exception handling with all clauses:</p>

    <pre class="code-block">
      <code>
def read_config_file(filename):
    file = None
    try:
        # Try to open and read file
        file = open(filename, 'r')
        config = file.read()
        data = eval(config)  # Potentially dangerous!
        return data
    except FileNotFoundError:
        print(f"Config file '{filename}' not found")
        return {}
    except SyntaxError as e:
        print(f"Invalid config syntax: {e}")
        return {}
    except Exception as e:
        print(f"Unexpected error reading config: {e}")
        return {}
    else:
        # Only runs if no exception occurred
        print("Config loaded successfully")
    finally:
        # Always runs - cleanup code
        if file:
            file.close()
            print("File closed")

# Using context manager (better approach)
def read_config_safe(filename):
    try:
        with open(filename, 'r') as file:
            config = file.read()
            return eval(config)
    except FileNotFoundError:
        print(f"File not found: {filename}")
        return {}
    except Exception as e:
        print(f"Error: {e}")
        return {}
    # No finally needed - 'with' handles closing
      </code>
    </pre>

    <h2>Raising Exceptions</h2>
    <p>You can raise exceptions to signal errors in your code:</p>

    <pre class="code-block">
      <code>
def validate_age(age):
    """Validate user age"""
    if not isinstance(age, int):
        raise TypeError("Age must be an integer")
    
    if age < 0:
        raise ValueError("Age cannot be negative")
    
    if age > 150:
        raise ValueError("Age seems unrealistic")
    
    return True

# Using raise without exception (re-raise)
def process_user_data(data):
    try:
        age = data['age']
        validate_age(age)
    except KeyError:
        print("Missing age field")
        raise  # Re-raise the same exception
    except (TypeError, ValueError) as e:
        print(f"Invalid age: {e}")
        raise  # Re-raise for caller to handle

# Raising with custom message
def withdraw(balance, amount):
    if amount > balance:
        raise ValueError(
            f"Insufficient funds: balance={balance}, "
            f"withdrawal={amount}"
        )
    return balance - amount
      </code>
    </pre>

    <h2>Custom Exceptions</h2>
    <p>Create your own exception classes for domain-specific errors:</p>

    <pre class="code-block">
      <code>
# Basic custom exception
class DatabaseError(Exception):
    """Base exception for database errors"""
    pass

class ConnectionError(DatabaseError):
    """Database connection failed"""
    pass

class QueryError(DatabaseError):
    """Invalid database query"""
    pass

# Custom exception with attributes
class ValidationError(Exception):
    """Validation failed with details"""
    
    def __init__(self, field, message):
        self.field = field
        self.message = message
        super().__init__(f"{field}: {message}")

class InsufficientFundsError(Exception):
    """Insufficient funds for transaction"""
    
    def __init__(self, balance, amount):
        self.balance = balance
        self.amount = amount
        self.shortfall = amount - balance
        super().__init__(
            f"Insufficient funds: need \${amount}, "
            f"have \${balance} (short \${self.shortfall})"
        )

# Using custom exceptions
def transfer_money(from_account, to_account, amount):
    try:
        if from_account.balance < amount:
            raise InsufficientFundsError(
                from_account.balance, 
                amount
            )
        
        from_account.withdraw(amount)
        to_account.deposit(amount)
        
    except InsufficientFundsError as e:
        print(f"Transfer failed: {e}")
        print(f"Shortfall: \${e.shortfall}")
        raise
      </code>
    </pre>

    <h2>Exception Handling in Flask/APIs</h2>
    <p>Proper error handling in web applications:</p>

    <pre class="code-block">
      <code>
from flask import Flask, jsonify, request

app = Flask(__name__)

# Custom API exceptions
class APIError(Exception):
    """Base API error"""
    status_code = 500
    
    def __init__(self, message, status_code=None, payload=None):
        super().__init__()
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload
    
    def to_dict(self):
        rv = dict(self.payload or ())
        rv['error'] = self.message
        return rv

class NotFoundError(APIError):
    status_code = 404

class ValidationError(APIError):
    status_code = 400

# Global error handler
@app.errorhandler(APIError)
def handle_api_error(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# Route with error handling
@app.route('/api/users/<int:user_id>')
def get_user(user_id):
    try:
        user = find_user(user_id)
        if not user:
            raise NotFoundError(f"User {user_id} not found")
        return jsonify(user)
    except DatabaseError as e:
        raise APIError("Database error occurred", status_code=503)
    except Exception as e:
        # Log unexpected errors
        app.logger.error(f"Unexpected error: {e}")
        raise APIError("An unexpected error occurred")

@app.route('/api/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        
        # Validate input
        if not data.get('email'):
            raise ValidationError("Email is required")
        
        if not data.get('name'):
            raise ValidationError("Name is required")
        
        # Create user
        user = create_user_in_db(data)
        return jsonify(user), 201
        
    except ValidationError:
        raise  # Re-raise to be handled by error handler
    except Exception as e:
        app.logger.error(f"User creation failed: {e}")
        raise APIError("Failed to create user")
      </code>
    </pre>

    <h2>Logging Exceptions</h2>
    <p>Use Python's logging module to track errors:</p>

    <pre class="code-block">
      <code>
import logging
import traceback

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def process_transaction(transaction):
    try:
        # Process transaction
        validate_transaction(transaction)
        execute_transaction(transaction)
        logger.info(f"Transaction {transaction.id} completed")
    
    except ValidationError as e:
        logger.warning(f"Validation failed: {e}")
        raise
    
    except DatabaseError as e:
        logger.error(f"Database error: {e}")
        logger.error(traceback.format_exc())
        raise
    
    except Exception as e:
        logger.critical(f"Unexpected error: {e}")
        logger.critical(traceback.format_exc())
        # Send alert to monitoring service
        send_alert(f"Critical error in transaction {transaction.id}")
        raise

# Decorator for exception logging
def log_exceptions(func):
    """Decorator to log exceptions"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(
                f"Exception in {func.__name__}: {e}",
                exc_info=True
            )
            raise
    return wrapper

@log_exceptions
def risky_operation(data):
    # This will log any exceptions
    return process_data(data)
      </code>
    </pre>

    <h2>Best Practices</h2>
    <div class="quick-test bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-2">✅ Exception Handling Best Practices</h4>
      <ul class="text-sm text-green-800 space-y-1">
        <li>✓ <strong>Be specific:</strong> Catch specific exceptions, not just Exception</li>
        <li>✓ <strong>Don't swallow errors:</strong> Log or re-raise exceptions</li>
        <li>✓ <strong>Use finally for cleanup:</strong> Or use context managers (with)</li>
        <li>✓ <strong>Fail fast:</strong> Validate input early and raise exceptions</li>
        <li>✓ <strong>Document exceptions:</strong> Mention in docstrings what exceptions are raised</li>
        <li>✓ <strong>Create custom exceptions:</strong> For domain-specific errors</li>
        <li>✓ <strong>Log exceptions:</strong> Use logging module, not print()</li>
        <li>✓ <strong>Don't use exceptions for flow control:</strong> They're for exceptional cases</li>
      </ul>
    </div>

    <div class="quick-test bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-red-900 mb-2">❌ Common Mistakes to Avoid</h4>
      <ul class="text-sm text-red-800 space-y-1">
        <li>✗ Using bare <code>except:</code> (catches everything, even KeyboardInterrupt)</li>
        <li>✗ Catching <code>Exception</code> without logging or re-raising</li>
        <li>✗ Using exceptions for normal program flow</li>
        <li>✗ Not cleaning up resources (use finally or context managers)</li>
        <li>✗ Raising generic exceptions instead of specific ones</li>
        <li>✗ Including sensitive data in exception messages</li>
      </ul>
    </div>

    <h2>Assertion for Debugging</h2>
    <p>Use assertions to catch programming errors during development:</p>

    <pre class="code-block">
      <code>
def calculate_discount(price, discount_percent):
    # Assertions for sanity checks
    assert price >= 0, "Price cannot be negative"
    assert 0 <= discount_percent <= 100, "Discount must be 0-100%"
    
    discount = price * (discount_percent / 100)
    return price - discount

# Assertions are removed when running with -O flag
# Use for development, not production validation
# For production, use explicit if statements and raise exceptions
      </code>
    </pre>
  </div>`,
  objectives: [
    "Understand Python exception hierarchy and handling",
    "Use try-except-else-finally blocks effectively",
    "Create and raise custom exceptions",
    "Handle errors in Flask APIs with proper HTTP status codes",
    "Log exceptions for debugging and monitoring",
    "Apply exception handling best practices",
  ],
  practiceInstructions: [
    "Create a function that safely reads a JSON file and handles all possible errors",
    "Build a custom ValidationError exception class with field and message attributes",
    "Implement error handling in a Flask API endpoint with proper status codes",
    "Create a decorator that logs exceptions with timestamps",
    "Write a function that uses try-except-else-finally to manage file resources",
  ],
  hints: [
    "Use json.load() which can raise JSONDecodeError",
    "Custom exceptions should inherit from Exception",
    "Flask errorhandlers use @app.errorhandler() decorator",
    "Use logging.error() with exc_info=True for full tracebacks",
    "Context managers (with statement) are better than finally for files",
  ],
  solution: `import json
import logging
from flask import Flask, jsonify

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 1. Safe JSON file reader
def read_json_file(filename):
    """Safely read and parse JSON file"""
    try:
        with open(filename, 'r') as file:
            data = json.load(file)
            return data
    except FileNotFoundError:
        logger.error(f"File not found: {filename}")
        return None
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in {filename}: {e}")
        return None
    except PermissionError:
        logger.error(f"Permission denied: {filename}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error reading {filename}: {e}")
        return None

# 2. Custom ValidationError
class ValidationError(Exception):
    """Validation error with field details"""
    
    def __init__(self, field, message):
        self.field = field
        self.message = message
        super().__init__(f"Validation error in '{field}': {message}")
    
    def to_dict(self):
        return {
            'error': 'Validation failed',
            'field': self.field,
            'message': self.message
        }

# 3. Flask API with error handling
app = Flask(__name__)

@app.errorhandler(ValidationError)
def handle_validation_error(error):
    return jsonify(error.to_dict()), 400

@app.route('/api/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        
        if not data.get('email'):
            raise ValidationError('email', 'Email is required')
        
        if '@' not in data['email']:
            raise ValidationError('email', 'Invalid email format')
        
        # Create user...
        return jsonify({'success': True}), 201
    
    except ValidationError:
        raise  # Handled by errorhandler
    except Exception as e:
        logger.error(f"User creation failed: {e}", exc_info=True)
        return jsonify({'error': 'Internal server error'}), 500

# 4. Exception logging decorator
def log_exceptions(func):
    """Decorator to log exceptions with timestamp"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(
                f"Exception in {func.__name__}: {e}",
                exc_info=True,
                extra={'timestamp': datetime.now().isoformat()}
            )
            raise
    return wrapper

@log_exceptions
def process_data(data):
    # Any exception will be logged
    return data['value'] * 2

# 5. File handling with try-except-else-finally
def process_file(filename):
    """Process file with complete exception handling"""
    file = None
    try:
        file = open(filename, 'r')
        content = file.read()
        lines = content.split('\\n')
        return lines
    except FileNotFoundError:
        print(f"File {filename} not found")
        return []
    except IOError as e:
        print(f"IO Error: {e}")
        return []
    else:
        print(f"Successfully read {len(lines)} lines")
    finally:
        if file:
            file.close()
            print("File closed")

print("All exception handling examples completed!")`,
};
