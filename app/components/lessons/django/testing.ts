import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Testing Django Applications",
  description:
    "Learn how to write unit tests, integration tests, and API tests for Django applications using Django's testing framework.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>Testing ensures your Django application works correctly and helps prevent regressions when making changes.</p>

    <h2>Django Test Framework</h2>
    
    <pre class="code-block">
      <code>
# tests.py
from django.test import TestCase
from .models import Post
from django.contrib.auth.models import User

class PostModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Run once for entire test class
        cls.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
    
    def setUp(self):
        # Run before each test method
        self.post = Post.objects.create(
            title='Test Post',
            content='Test content',
            author=self.user
        )
    
    def test_post_creation(self):
        # Test model creation
        self.assertEqual(self.post.title, 'Test Post')
        self.assertEqual(self.post.author.username, 'testuser')
    
    def test_str_method(self):
        # Test __str__ method
        self.assertEqual(str(self.post), 'Test Post')
    
    def test_get_excerpt(self):
        # Test custom method
        excerpt = self.post.get_excerpt()
        self.assertTrue(len(excerpt) <= 100)

# Run tests
python manage.py test
python manage.py test blog  # Test specific app
python manage.py test blog.tests.PostModelTest  # Test specific class
      </code>
    </pre>

    <h2>Testing Views</h2>
    
    <pre class="code-block">
      <code>
from django.test import TestCase, Client
from django.urls import reverse

class PostViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.post = Post.objects.create(
            title='Test Post',
            content='Test content',
            author=self.user
        )
    
    def test_post_list_view(self):
        # Test GET request
        response = self.client.get(reverse('post_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test Post')
        self.assertTemplateUsed(response, 'blog/post_list.html')
    
    def test_post_detail_view(self):
        # Test with URL parameter
        url = reverse('post_detail', args=[self.post.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.post.title)
    
    def test_protected_view(self):
        # Test login required view
        url = reverse('create_post')
        
        # Without login - should redirect
        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)
        
        # With login - should work
        self.client.login(username='testuser', password='testpass123')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
    
    def test_post_creation(self):
        # Test POST request
        self.client.login(username='testuser', password='testpass123')
        response = self.client.post(reverse('create_post'), {
            'title': 'New Post',
            'content': 'New content'
        })
        self.assertEqual(response.status_code, 302)  # Redirect after success
        self.assertEqual(Post.objects.count(), 2)
      </code>
    </pre>

    <h2>Testing APIs (DRF)</h2>
    
    <pre class="code-block">
      <code>
from rest_framework.test import APITestCase
from rest_framework import status

class PostAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
    
    def test_list_posts(self):
        # Test GET /api/posts/
        url = reverse('post-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_create_post(self):
        # Test POST /api/posts/
        self.client.force_authenticate(user=self.user)
        url = reverse('post-list')
        data = {
            'title': 'API Post',
            'content': 'Created via API'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 1)
        self.assertEqual(response.data['title'], 'API Post')
    
    def test_unauthorized_create(self):
        # Test without authentication
        url = reverse('post-list')
        data = {'title': 'Test', 'content': 'Test'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
      </code>
    </pre>

    <h2>Test Fixtures</h2>
    
    <pre class="code-block">
      <code>
# Create fixture data
python manage.py dumpdata blog.Post --indent 2 > blog/fixtures/posts.json

# Use fixtures in tests
class PostTest(TestCase):
    fixtures = ['posts.json']
    
    def test_with_fixtures(self):
        posts = Post.objects.all()
        self.assertGreater(posts.count(), 0)
      </code>
    </pre>

    <h2>Test Coverage</h2>
    
    <pre class="code-block">
      <code>
# Install coverage
pip install coverage

# Run tests with coverage
coverage run --source='.' manage.py test

# View coverage report
coverage report

# Generate HTML report
coverage html
# Open htmlcov/index.html in browser
      </code>
    </pre>

    <div class="tip-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-2">💡 Best Practices</h4>
      <ul class="space-y-1">
        <li>Write tests for all models, views, and API endpoints</li>
        <li>Use setUpTestData() for data that doesn't change</li>
        <li>Test both success and failure scenarios</li>
        <li>Test edge cases and validation</li>
        <li>Aim for high test coverage (80%+)</li>
        <li>Use factories (factory_boy) for complex test data</li>
      </ul>
    </div>
  </div>`,

  objectives: [
    "Write unit tests for Django models",
    "Test views and URL routing",
    "Write API tests for DRF endpoints",
    "Use fixtures and test data effectively",
    "Measure test coverage",
  ],

  practiceInstructions: [
    "Create a test case for a Django model",
    "Test the model's creation and methods",
    "Test a view that requires authentication",
  ],

  starterCode: `from django.test import TestCase
from .models import Book
from django.contrib.auth.models import User

class BookModelTest(TestCase):
    def setUp(self):
        # TODO: Create a test book
        pass
    
    def test_book_creation(self):
        # TODO: Test book was created correctly
        pass
    
    def test_str_method(self):
        # TODO: Test __str__ returns book title
        pass`,

  solution: `from django.test import TestCase, Client
from django.urls import reverse
from .models import Book
from django.contrib.auth.models import User

class BookModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
    
    def setUp(self):
        self.book = Book.objects.create(
            title='Test Book',
            author='Test Author',
            price=29.99
        )
    
    def test_book_creation(self):
        self.assertEqual(self.book.title, 'Test Book')
        self.assertEqual(self.book.author, 'Test Author')
        self.assertEqual(self.book.price, 29.99)
    
    def test_str_method(self):
        self.assertEqual(str(self.book), 'Test Book')

class BookViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.book = Book.objects.create(
            title='Test Book',
            author='Test Author',
            price=29.99
        )
    
    def test_book_list_view(self):
        response = self.client.get(reverse('book_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test Book')

# Run tests
# python manage.py test`,

  hints: [
    "Use TestCase as the base class for tests",
    "setUp() runs before each test method",
    "Use assertEqual() to compare values",
    "Use assertContains() to check response content",
    "Use self.client to make requests in view tests",
  ],
};

export default lessonData;
