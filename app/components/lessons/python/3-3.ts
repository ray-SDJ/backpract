import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Flask Forms & Validation",
  description:
    "Learn how to handle forms, validate user input, and work with form data in Flask applications.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>In this lesson, you'll learn how to handle forms, validate user input, and work with form data effectively in Flask.</p>

    <h2>HTML Forms with Flask</h2>
    
    <p>Flask makes it easy to handle form submissions and validate user input.</p>

    <pre class="code-block">
      <code>
from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Required for sessions and flash messages

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Handle form submission
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        
        # Basic validation
        errors = []
        if not username or len(username) &lt; 3:
            errors.append('Username must be at least 3 characters')
        if not email or '@' not in email:
            errors.append('Valid email required')
        if not password or len(password) &lt; 6:
            errors.append('Password must be at least 6 characters')
        
        if errors:
            for error in errors:
                flash(error, 'error')
            return render_template('register.html')
        
        # Process registration
        flash('Registration successful!', 'success')
        return redirect(url_for('login'))
    
    # Show form for GET request
    return render_template('register.html')
      </code>
    </pre>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">💡 Form Handling Concepts</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>request.method:</strong> Check if it's GET (show form) or POST (process form)</li>
        <li><strong>request.form.get():</strong> Extract form data safely (returns None if missing)</li>
        <li><strong>flash():</strong> Store messages to display on next page load</li>
        <li><strong>redirect(url_for()):</strong> Redirect to another route after processing</li>
      </ul>
    </div>

    <h2>WTForms Integration</h2>
    
    <p>WTForms provides advanced form handling with built-in validation and CSRF protection.</p>

    <pre class="code-block">
      <code>
from flask_wtf import FlaskForm
from wtforms import StringField, EmailField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Length, Email, EqualTo

class RegistrationForm(FlaskForm):
    username = StringField('Username', 
                          validators=[DataRequired(), Length(min=3, max=20)])
    email = EmailField('Email', 
                      validators=[DataRequired(), Email()])
    password = PasswordField('Password', 
                            validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField('Confirm Password',
                                   validators=[DataRequired(), 
                                             EqualTo('password')])
    submit = SubmitField('Register')

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    
    if form.validate_on_submit():
        # Form is valid, process data
        username = form.username.data
        email = form.email.data
        password = form.password.data
        
        # Save to database
        flash('Registration successful!', 'success')
        return redirect(url_for('login'))
    
    # Form validation failed or GET request
    return render_template('register.html', form=form)
      </code>
    </pre>

    <h2>HTML Template Example</h2>
    
    <p>Create a template that works with Flask forms and displays validation errors:</p>

    <pre class="code-block">
      <code>
&lt;!-- register.html --&gt;
&lt;form method="POST"&gt;
    {{ form.hidden_tag() }}  &lt;!-- CSRF token --&gt;
    
    &lt;div class="form-group"&gt;
        {{ form.username.label(class="form-label") }}
        {{ form.username(class="form-control") }}
        {% if form.username.errors %}
            &lt;div class="error-messages"&gt;
                {% for error in form.username.errors %}
                    &lt;span class="error"&gt;{{ error }}&lt;/span&gt;
                {% endfor %}
            &lt;/div&gt;
        {% endif %}
    &lt;/div&gt;
    
    &lt;div class="form-group"&gt;
        {{ form.email.label(class="form-label") }}
        {{ form.email(class="form-control") }}
        {% if form.email.errors %}
            &lt;div class="error-messages"&gt;
                {% for error in form.email.errors %}
                    &lt;span class="error"&gt;{{ error }}&lt;/span&gt;
                {% endfor %}
            &lt;/div&gt;
        {% endif %}
    &lt;/div&gt;
    
    {{ form.submit(class="btn btn-primary") }}
&lt;/form&gt;
      </code>
    </pre>

    <h2>Advanced Validation & Custom Validators</h2>
    
    <p>Create custom validators for specific business logic:</p>

    <pre class="code-block">
      <code>
from wtforms.validators import ValidationError
from models import User  # Your user model

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=20)])
    
    def validate_username(self, username):
        """Custom validator to check if username already exists"""
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('Username already taken. Choose a different one.')
    
    def validate_email(self, email):
        """Custom validator to check if email already exists"""
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('Email already registered. Please log in instead.')
      </code>
    </pre>

    <div class="explanation-box bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-yellow-900 mb-3">⚠️ Security Best Practices</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>CSRF Protection:</strong> Always include {{ form.hidden_tag() }} in forms</li>
        <li><strong>Input Sanitization:</strong> WTForms automatically sanitizes input</li>
        <li><strong>Server-side Validation:</strong> Never trust client-side validation alone</li>
        <li><strong>Password Hashing:</strong> Always hash passwords before storing</li>
      </ul>
    </div>

    <div class="quick-test bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-2">💡 Quick Test</h4>
      <p class="text-sm text-green-800">
        Create a contact form with fields for name, email, subject, and message. 
        Add validation to ensure all fields are filled and email is valid. Display success/error messages to users.
      </p>
    </div>
  </div>`,
  objectives: [
    "Handle HTML form submissions in Flask",
    "Implement input validation and error handling",
    "Use WTForms for advanced form handling",
    "Handle file uploads securely",
    "Create custom validation functions",
  ],
  practiceInstructions: [
    "Create a registration form with username, email, and password fields",
    "Implement server-side validation for all form fields",
    "Add WTForms integration with CSRF protection",
    "Create custom validators for business logic",
    "Test form validation with various invalid inputs",
  ],
  hints: [
    "Always validate data on the server side, never trust client input",
    "Use WTForms for built-in validation and CSRF protection",
    "Custom validators follow the pattern validate_fieldname",
    "Flash messages require a secret key to be set",
    "Regular expressions are useful for email and password validation",
  ],
  solution: `from flask import Flask, request, render_template, redirect, url_for, flash
from flask_wtf import FlaskForm
from wtforms import StringField, EmailField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError

app = Flask(__name__)
app.secret_key = 'demo-secret-key'

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=20)])
    email = EmailField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField('Confirm Password', 
                                   validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')
    
    def validate_username(self, username):
        # Custom validation - check if username already exists
        existing_users = ['admin', 'test', 'user']  # Mock data
        if username.data.lower() in existing_users:
            raise ValidationError('Username already taken.')

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    
    if form.validate_on_submit():
        flash(f'Registration successful for {form.username.data}!', 'success')
        return redirect(url_for('register'))
    
    return render_template('register.html', form=form)

if __name__ == '__main__':
    app.run(debug=True)`,
};
