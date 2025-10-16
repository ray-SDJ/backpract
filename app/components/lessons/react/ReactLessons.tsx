"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Zap,
  Database,
  Lock,
  Code2,
  ChevronDown,
} from "lucide-react";

// TypeScript interfaces
interface CodeExplanationProps {
  code: string;
  explanation: Array<{ label: string; desc: string }>;
}

interface SectionProps {
  section: {
    id: string;
    title: string;
    icon: React.ElementType;
    overview: string;
    content: React.ReactNode;
  };
}

export default function ReactTutorial() {
  const [expandedSection, setExpandedSection] = useState<string>("intro");

  const CodeExplanation: React.FC<CodeExplanationProps> = ({
    code,
    explanation,
  }) => (
    <div className="mt-4 space-y-3">
      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-3">Code Explanation:</h4>
        <div className="space-y-2">
          {explanation.map((item, index) => (
            <div key={index} className="flex gap-3">
              <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono whitespace-nowrap">
                {item.label}
              </code>
              <span className="text-blue-700 text-sm">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const sections = [
    {
      id: "intro",
      title: "Introduction to React",
      icon: BookOpen,
      overview:
        "React is a powerful JavaScript library for building user interfaces. It uses a component-based architecture and virtual DOM for efficient rendering.",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">What is React?</h3>
            <p className="text-gray-700 mb-3">
              React is a declarative, component-based library that makes it easy
              to build interactive UIs. You describe what your UI should look
              like for different states, and React efficiently updates the DOM
              when data changes.
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
              <li>
                <strong>Component-based:</strong> Build encapsulated components
                that manage their own state
              </li>
              <li>
                <strong>Virtual DOM:</strong> Efficient updates through virtual
                representation
              </li>
              <li>
                <strong>Unidirectional data flow:</strong> Predictable state
                management
              </li>
              <li>
                <strong>JSX:</strong> Write HTML-like syntax directly in
                JavaScript
              </li>
              <li>
                <strong>Ecosystem:</strong> Rich ecosystem with tools like
                Redux, Router, etc.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">
              Your First React Component
            </h3>
            <CodeExplanation
              code={`// Install React (with Create React App)
$ npx create-react-app my-app
$ cd my-app
$ npm start

// App.js
import React, { useState } from 'react';

function Welcome({ name, age }) {
  return (
    <div className="welcome-card">
      <h2>Hello, {name}!</h2>
      <p>You are {age} years old.</p>
    </div>
  );
}

function Counter() {
  // useState Hook - adds state to functional component
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div className="counter">
      <h3>Counter: {count}</h3>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Welcome name="John" age={25} />
      <Welcome name="Sarah" age={30} />
      <Counter />
    </div>
  );
}

export default App;`}
              explanation={[
                {
                  label: "function Welcome({ name, age })",
                  desc: "Functional component with props destructuring",
                },
                {
                  label: "useState(0)",
                  desc: "Hook that adds state to functional components. Returns [value, setter]",
                },
                {
                  label: "{count}",
                  desc: "JSX expression - JavaScript values inside curly braces",
                },
                {
                  label: "onClick={increment}",
                  desc: "Event handler - function reference, not function call",
                },
                {
                  label: "<Welcome name='John' />",
                  desc: "Component usage with props. Self-closing tag for components without children",
                },
              ]}
            />
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">💡 Quick Test</h4>
            <p className="text-sm text-green-800">
              The code above creates a reusable Welcome component and a stateful
              Counter. Try changing the props or adding more counter instances!
            </p>
          </div>
        </div>
      ),
    },

    {
      id: "hooks",
      title: "React Hooks",
      icon: Zap,
      overview:
        "Hooks let you use state and lifecycle features in functional components. Master useState, useEffect, and custom hooks.",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">useState Hook</h3>
            <CodeExplanation
              code={`import React, { useState } from 'react';

function UserForm() {
  // Multiple state variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  // Object state
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });

  // Array state
  const [items, setItems] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.includes('@')) newErrors.email = 'Invalid email';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', { name, email });
      // Reset form
      setName('');
      setEmail('');
    }
  };

  // Update object state (important: always create new object)
  const updateUser = (field, value) => {
    setUser(prevUser => ({
      ...prevUser,  // Spread previous state
      [field]: value // Update specific field
    }));
  };

  // Update array state
  const addItem = (newItem) => {
    setItems(prevItems => [...prevItems, newItem]);
  };

  const removeItem = (index) => {
    setItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>
      
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      
      <button type="submit">Submit</button>
    </form>
  );
}`}
              explanation={[
                {
                  label: "const [name, setName] = useState('')",
                  desc: "Destructuring array returned by useState. First is value, second is setter",
                },
                {
                  label: "prevUser => ({ ...prevUser, [field]: value })",
                  desc: "Function update with spread operator. Always return new object for state",
                },
                {
                  label: "onChange={(e) => setName(e.target.value)}",
                  desc: "Controlled component - React manages the input value through state",
                },
                {
                  label: "Object.keys(newErrors).length === 0",
                  desc: "Check if errors object is empty before submitting",
                },
              ]}
            />
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">useEffect Hook</h3>
            <CodeExplanation
              code={`import React, { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect runs after every render (no dependency array)
  useEffect(() => {
    console.log('Component rendered');
  });

  // Effect runs only on mount (empty dependency array)
  useEffect(() => {
    console.log('Component mounted');
    
    // Cleanup function (runs on unmount)
    return () => {
      console.log('Component will unmount');
    };
  }, []); // Empty dependency array

  // Effect runs when specific values change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.example.com/users');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Run once on mount

  // Effect with cleanup (for subscriptions, timers)
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Timer tick');
    }, 1000);

    // Cleanup timer on unmount
    return () => {
      clearInterval(timer);
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h3>Data:</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

// Custom Hook
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}

// Using custom hook
function CounterApp() {
  const { count, increment, decrement, reset } = useCounter(10);

  return (
    <div>
      <h3>Count: {count}</h3>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}`}
              explanation={[
                {
                  label: "useEffect(() => {}, [])",
                  desc: "Empty array means effect runs once on mount, cleanup on unmount",
                },
                {
                  label: "return () => { cleanup }",
                  desc: "Cleanup function prevents memory leaks from timers/subscriptions",
                },
                {
                  label: "async () => { await fetch() }",
                  desc: "Async function inside useEffect for API calls",
                },
                {
                  label: "Custom hook (useCounter)",
                  desc: "Reusable logic that uses other hooks. Must start with 'use'",
                },
              ]}
            />
          </div>
        </div>
      ),
    },

    {
      id: "state",
      title: "State Management",
      icon: Database,
      overview:
        "Learn different approaches to manage state: Context API for global state, useReducer for complex state, and state lifting patterns.",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Context API</h3>
            <CodeExplanation
              code={`import React, { createContext, useContext, useState } from 'react';

// 1. Create Context
const UserContext = createContext();

// 2. Create Provider Component
function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const contextValue = {
    user,
    isAuthenticated,
    login,
    logout,
    updateProfile
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

// 3. Custom hook to use context
function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}

// 4. Using context in components
function LoginForm() {
  const { login } = useUser();
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
    login({ 
      id: 1, 
      username: credentials.username, 
      email: credentials.username + '@example.com' 
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={credentials.username}
        onChange={(e) => setCredentials(prev => ({
          ...prev,
          username: e.target.value
        }))}
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials(prev => ({
          ...prev,
          password: e.target.value
        }))}
      />
      <button type="submit">Login</button>
    </form>
  );
}

function Profile() {
  const { user, isAuthenticated, logout } = useUser();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div>
      <h3>Welcome, {user.username}!</h3>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// 5. App with Provider
function App() {
  return (
    <UserProvider>
      <div className="App">
        <Profile />
      </div>
    </UserProvider>
  );
}`}
              explanation={[
                {
                  label: "createContext()",
                  desc: "Create a context object for sharing data across component tree",
                },
                {
                  label: "<UserContext.Provider value={contextValue}>",
                  desc: "Provider component that supplies context value to child components",
                },
                {
                  label: "useContext(UserContext)",
                  desc: "Hook to consume context value in any child component",
                },
                {
                  label: "Custom hook pattern",
                  desc: "Wrapper hook that adds error checking and cleaner API",
                },
              ]}
            />
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">
              useReducer for Complex State
            </h3>
            <CodeExplanation
              code={`import React, { useReducer } from 'react';

// 1. Define action types
const ACTIONS = {
  ADD_TODO: 'add_todo',
  TOGGLE_TODO: 'toggle_todo',
  DELETE_TODO: 'delete_todo',
  SET_FILTER: 'set_filter',
  CLEAR_COMPLETED: 'clear_completed'
};

// 2. Reducer function
function todoReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TODO:
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload.text,
            completed: false,
            createdAt: new Date()
          }
        ]
      };

    case ACTIONS.TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };

    case ACTIONS.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id)
      };

    case ACTIONS.SET_FILTER:
      return {
        ...state,
        filter: action.payload.filter
      };

    case ACTIONS.CLEAR_COMPLETED:
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      };

    default:
      return state;
  }
}

// 3. Initial state
const initialState = {
  todos: [],
  filter: 'all' // 'all', 'active', 'completed'
};

// 4. Todo App Component
function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [newTodoText, setNewTodoText] = useState('');

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      dispatch({
        type: ACTIONS.ADD_TODO,
        payload: { text: newTodoText.trim() }
      });
      setNewTodoText('');
    }
  };

  const toggleTodo = (id) => {
    dispatch({
      type: ACTIONS.TOGGLE_TODO,
      payload: { id }
    });
  };

  const deleteTodo = (id) => {
    dispatch({
      type: ACTIONS.DELETE_TODO,
      payload: { id }
    });
  };

  // Filter todos based on current filter
  const filteredTodos = state.todos.filter(todo => {
    switch (state.filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const completedCount = state.todos.filter(todo => todo.completed).length;
  const activeCount = state.todos.length - completedCount;

  return (
    <div className="todo-app">
      <h1>Todo App</h1>
      
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add new todo..."
        />
        <button type="submit">Add</button>
      </form>

      <div className="filters">
        {['all', 'active', 'completed'].map(filter => (
          <button
            key={filter}
            className={state.filter === filter ? 'active' : ''}
            onClick={() => dispatch({
              type: ACTIONS.SET_FILTER,
              payload: { filter }
            })}
          >
            {filter}
          </button>
        ))}
      </div>

      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className={todo.completed ? 'completed' : ''}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <div className="stats">
        <span>{activeCount} active, {completedCount} completed</span>
        {completedCount > 0 && (
          <button onClick={() => dispatch({ type: ACTIONS.CLEAR_COMPLETED })}>
            Clear Completed
          </button>
        )}
      </div>
    </div>
  );
}`}
              explanation={[
                {
                  label: "useReducer(reducer, initialState)",
                  desc: "Alternative to useState for complex state logic. Returns [state, dispatch]",
                },
                {
                  label: "dispatch({ type, payload })",
                  desc: "Send action to reducer. Type identifies action, payload contains data",
                },
                {
                  label: "switch (action.type)",
                  desc: "Reducer handles different action types and returns new state",
                },
                {
                  label: "...state, todos: [...state.todos, newTodo]",
                  desc: "Always return new state object with spread operator for immutability",
                },
              ]}
            />
          </div>
        </div>
      ),
    },

    {
      id: "routing",
      title: "React Router & Navigation",
      icon: Lock,
      overview:
        "Build single-page applications with React Router. Learn about routes, navigation, protected routes, and URL parameters.",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Setting Up React Router</h3>
            <CodeExplanation
              code={`// Install React Router
$ npm install react-router-dom

// App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useParams,
  useLocation
} from 'react-router-dom';

// Components
function Home() {
  return (
    <div>
      <h2>Home Page</h2>
      <p>Welcome to our React app!</p>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About Page</h2>
      <p>Learn more about us here.</p>
    </div>
  );
}

function Contact() {
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Process form...
    alert('Message sent!');
    navigate('/'); // Programmatic navigation
  };

  return (
    <div>
      <h2>Contact Page</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Your name" required />
        <textarea placeholder="Your message" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

// Navigation Component
function Navigation() {
  const location = useLocation();

  return (
    <nav>
      <ul>
        <li>
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/about"
            className={location.pathname === '/about' ? 'active' : ''}
          >
            About
          </Link>
        </li>
        <li>
          <Link 
            to="/contact"
            className={location.pathname === '/contact' ? 'active' : ''}
          >
            Contact
          </Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
      </ul>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/admin/*" element={<AdminPanel />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}`}
              explanation={[
                {
                  label: "<BrowserRouter>",
                  desc: "Wrapper component that enables routing using browser's history API",
                },
                {
                  label: "<Routes> and <Route>",
                  desc: "Define which component renders for specific URL paths",
                },
                {
                  label: "<Link to='/path'>",
                  desc: "Navigation component that prevents page refresh",
                },
                {
                  label: "useNavigate()",
                  desc: "Hook for programmatic navigation (form submissions, etc.)",
                },
                {
                  label: "useLocation()",
                  desc: "Hook to access current location object with pathname, search, etc.",
                },
              ]}
            />
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">
              URL Parameters & Protected Routes
            </h3>
            <CodeExplanation
              code={`// User Detail Component with URL params
function UserDetail() {
  const { id } = useParams(); // Extract :id from URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(\`/api/users/\${id}\`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]); // Re-fetch when ID changes

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>ID: {user.id}</p>
    </div>
  );
}

// User List Component
function UserList() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
  ];

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <Link to={'/users/\${user.id}'}>
              {user.name} - {user.email}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useUser(); // From context
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Login Component
function Login() {
  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page user was trying to access
  const from = location.state?.from?.pathname || '/';

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    login({ id: 1, username: 'user' });
    navigate(from, { replace: true });
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input type="text" placeholder="Username" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
}

// Admin Panel with Nested Routes
function AdminPanel() {
  return (
    <div className="admin-panel">
      <nav className="admin-nav">
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/users">Manage Users</Link>
        <Link to="/admin/settings">Settings</Link>
      </nav>
      
      <div className="admin-content">
        <Routes>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

// Updated App with protected routes
function AppWithAuth() {
  return (
    <Router>
      <UserProvider>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
      </UserProvider>
    </Router>
  );
}`}
              explanation={[
                {
                  label: "useParams()",
                  desc: "Extract URL parameters (:id) from current route",
                },
                {
                  label: "<Navigate to='/login' replace />",
                  desc: "Programmatically redirect. 'replace' prevents back button issues",
                },
                {
                  label: "location.state?.from",
                  desc: "Access state passed during navigation (return URL after login)",
                },
                {
                  label: "Nested Routes",
                  desc: "Routes inside components for complex layouts like admin panels",
                },
              ]}
            />
          </div>
        </div>
      ),
    },

    {
      id: "performance",
      title: "Performance & Best Practices",
      icon: Code2,
      overview:
        "Optimize React apps with memo, useMemo, useCallback, code splitting, and performance monitoring techniques.",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">React.memo & useCallback</h3>
            <CodeExplanation
              code={`import React, { useState, useCallback, useMemo, memo } from 'react';

// Expensive component that should only re-render when props change
const ExpensiveChild = memo(function ExpensiveChild({ items, onItemClick }) {
  console.log('ExpensiveChild rendered'); // Debug rendering
  
  // Simulate expensive computation
  const processedItems = items.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }));

  return (
    <ul>
      {processedItems.map(item => (
        <li key={item.id} onClick={() => onItemClick(item.id)}>
          {item.name} - {item.processed ? 'Processed' : 'Raw'}
        </li>
      ))}
    </ul>
  );
});

// Parent component
function ParentComponent() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ]);
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState('');

  // ❌ This function is recreated on every render
  // const handleItemClick = (id) => {
  //   console.log('Item clicked:', id);
  // };

  // ✅ useCallback prevents recreation if dependencies haven't changed
  const handleItemClick = useCallback((id) => {
    console.log('Item clicked:', id);
    // If this function used state, include it in dependencies
  }, []); // Empty dependencies = never recreate

  // ✅ useMemo prevents recalculation if dependencies haven't changed
  const filteredItems = useMemo(() => {
    console.log('Filtering items...'); // Debug expensive operation
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]); // Recalculate only when items or filter change

  // ✅ Complex calculation memoized
  const expensiveValue = useMemo(() => {
    console.log('Expensive calculation...');
    return items.reduce((sum, item) => sum + item.id, 0) * 1000;
  }, [items]);

  return (
    <div>
      <h2>Performance Demo</h2>
      
      {/* This counter won't cause ExpensiveChild to re-render */}
      <div>
        <button onClick={() => setCount(count + 1)}>
          Count: {count}
        </button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Filter items..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div>Expensive value: {expensiveValue}</div>

      {/* Only re-renders when filteredItems or handleItemClick changes */}
      <ExpensiveChild 
        items={filteredItems} 
        onItemClick={handleItemClick} 
      />

      <button onClick={() => setItems([...items, { 
        id: Date.now(), 
        name: \`Item \${items.length + 1}\` 
      }])}>
        Add Item
      </button>
    </div>
  );
}`}
              explanation={[
                {
                  label: "React.memo()",
                  desc: "Prevents re-rendering if props haven't changed (shallow comparison)",
                },
                {
                  label: "useCallback(fn, deps)",
                  desc: "Memoizes function to prevent recreation on every render",
                },
                {
                  label: "useMemo(fn, deps)",
                  desc: "Memoizes expensive calculations or object creation",
                },
                {
                  label: "Dependencies array",
                  desc: "Controls when memoized values should be recalculated",
                },
              ]}
            />
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">
              Code Splitting & Lazy Loading
            </h3>
            <CodeExplanation
              code={`import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// ✅ Lazy load components - only loaded when needed
const Dashboard = lazy(() => import('./components/Dashboard'));
const UserProfile = lazy(() => import('./components/UserProfile'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));

// ✅ Lazy load with named export
const Settings = lazy(() => 
  import('./components/Settings').then(module => ({
    default: module.Settings
  }))
);

// Loading component
function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

// Error boundary for lazy loaded components
class LazyLoadErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lazy load error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong loading this page.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// App with code splitting
function App() {
  return (
    <div className="App">
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/settings">Settings</Link>
      </nav>

      <main>
        <LazyLoadErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Suspense>
        </LazyLoadErrorBoundary>
      </main>
    </div>
  );
}

// ✅ Performance monitoring hook
function usePerformanceMonitor(componentName) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(\`\${componentName} was mounted for \${endTime - startTime}ms\`);
    };
  }, [componentName]);

  useEffect(() => {
    console.log(\`\${componentName} rendered at\`, new Date().toISOString());
  });
}

// ✅ Image lazy loading component
function LazyImage({ src, alt, placeholder, ...props }) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState();

  useEffect(() => {
    let observer;
    
    if (imageRef && imageSrc === placeholder) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(imageRef);
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(imageRef);
    }
    
    return () => {
      if (observer && observer.unobserve) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, imageSrc, placeholder, src]);

  return (
    <img
      {...props}
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      loading="lazy"
    />
  );
}`}
              explanation={[
                {
                  label: "lazy(() => import())",
                  desc: "Dynamic import for code splitting. Component loaded only when needed",
                },
                {
                  label: "<Suspense fallback={}>",
                  desc: "Shows loading UI while lazy component loads",
                },
                {
                  label: "Error Boundary",
                  desc: "Catches errors in lazy loaded components",
                },
                {
                  label: "IntersectionObserver",
                  desc: "Lazy load images when they enter viewport",
                },
              ]}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              🚀 Production Tips
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • Use React DevTools Profiler to identify performance
                bottlenecks
              </li>
              <li>
                • Implement virtual scrolling for large lists (react-window)
              </li>
              <li>
                • Use service workers for caching and offline functionality
              </li>
              <li>• Optimize bundle size with webpack-bundle-analyzer</li>
              <li>
                • Consider SSR/SSG with Next.js for better SEO and performance
              </li>
              <li>
                • Use CDN for static assets and implement proper caching headers
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const Section: React.FC<SectionProps> = ({ section }) => {
    const Icon = section.icon;
    const isExpanded = expandedSection === section.id;

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setExpandedSection(isExpanded ? "" : section.id)}
          className="w-full p-6 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Icon className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {section.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{section.overview}</p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {isExpanded && (
          <div className="border-t border-gray-200 bg-gray-50 p-6">
            {section.content}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-cyan-600 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">React Tutorial</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Master modern React development - from components and hooks to
            performance optimization and production best practices.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}
