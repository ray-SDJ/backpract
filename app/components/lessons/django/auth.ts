import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Django Authentication",
  description:
    "Learn how to implement user authentication, registration, login, and session management in Django applications.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>Django provides a robust authentication system out of the box for handling users, permissions, and sessions.</p>

    <h2>User Model</h2>
    
    <pre class="code-block">
      <code>
from django.contrib.auth.models import User

# Create user
user = User.objects.create_user(
    username='john',
    email='john@example.com',
    password='secretpass123'
)

# Authenticate user
from django.contrib.auth import authenticate, login, logout

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            return render(request, 'login.html', {'error': 'Invalid credentials'})
    
    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    return redirect('login')
      </code>
    </pre>

    <h2>Login Required Decorator</h2>
    
    <pre class="code-block">
      <code>
from django.contrib.auth.decorators import login_required

@login_required
def profile(request):
    return render(request, 'profile.html', {'user': request.user})

@login_required(login_url='/login/')
def dashboard(request):
    return render(request, 'dashboard.html')
      </code>
    </pre>

    <h2>Custom User Model</h2>
    
    <pre class="code-block">
      <code>
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    bio = models.TextField(blank=True)
    birth_date = models.DateField(null=True, blank=True)

# settings.py
AUTH_USER_MODEL = 'myapp.CustomUser'
      </code>
    </pre>
  </div>`,

  objectives: [
    "Implement user registration and login",
    "Use Django's authentication system",
    "Protect views with login_required decorator",
    "Create custom user models",
  ],

  practiceInstructions: [
    "Create a login view that authenticates users",
    "Add login_required decorator to a view",
    "Handle successful and failed login attempts",
  ],

  starterCode: `from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

def login_view(request):
    # TODO: Implement login logic
    # Check if POST request
    # Get username and password from request.POST
    # Authenticate user
    # Login if successful, show error if not
    pass

@login_required
def dashboard(request):
    # TODO: Return dashboard template with user data
    pass`,

  solution: `from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            return render(request, 'login.html', {
                'error': 'Invalid username or password'
            })
    
    return render(request, 'login.html')

@login_required(login_url='/login/')
def dashboard(request):
    return render(request, 'dashboard.html', {
        'user': request.user
    })`,

  hints: [
    "Use authenticate() to verify credentials",
    "Use login() to log the user in",
    "Check request.method == 'POST' for form submissions",
    "@login_required automatically redirects unauthenticated users",
    "Access the current user with request.user",
  ],
};

export default lessonData;
