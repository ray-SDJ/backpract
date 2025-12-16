import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "GraphQL APIs with Node.js",
  description:
    "Master GraphQL - learn how to build type-safe, flexible APIs with queries, mutations, subscriptions, and advanced features.",
  difficulty: "Intermediate",
  objectives: [
    "Understand GraphQL fundamentals and how it differs from REST",
    "Set up Apollo Server with Express",
    "Define GraphQL schemas with types, queries, and mutations",
    "Implement resolvers for data fetching and manipulation",
    "Work with GraphQL clients and Apollo Client",
    "Implement real-time features with subscriptions",
    "Handle errors and implement best practices",
  ],
  practiceInstructions: [
    "Create an Express app and import apollo-server-express",
    "Define a GraphQL schema with User and Post types",
    "Create Query resolvers for fetching users and posts",
    "Create Mutation resolvers for creating users and posts",
    "Set up Apollo Server with your schema and resolvers",
    "Apply Apollo middleware to Express and start the server",
    "Test your GraphQL API at http://localhost:4000/graphql",
  ],
  hints: [
    "Use gql template literal tag for defining your schema",
    "Remember to include relationships (User has posts, Post has author)",
    "Resolvers take (parent, args, context) parameters",
    "Don't forget to call server.start() before applying middleware",
    "The GraphQL Playground will open automatically in your browser",
  ],
  content: `<div class="lesson-content">
    <p>GraphQL is a query language for APIs that gives clients the power to request exactly the data they need. Learn how to build GraphQL servers, define schemas, resolve queries, and implement advanced features like subscriptions and caching.</p>

    <h2>Why GraphQL?</h2>
    
    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🚀 GraphQL vs REST</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Single Endpoint:</strong> One URL for all operations (vs multiple REST endpoints)</li>
        <li><strong>Precise Data:</strong> Request exactly what you need (no over/under-fetching)</li>
        <li><strong>Type-Safe:</strong> Strong typing with schema validation</li>
        <li><strong>Self-Documenting:</strong> Built-in introspection and documentation</li>
        <li><strong>Real-Time:</strong> Built-in support for subscriptions (WebSockets)</li>
      </ul>
    </div>

    <h2>Setting Up GraphQL Server</h2>
    
    <p>Let's create a GraphQL server with Apollo Server and Express:</p>

    <pre class="code-block">
      <code>
// Install dependencies
// npm install apollo-server-express graphql express
// apollo-server-express = GraphQL server for Express
// graphql = Core GraphQL implementation
// express = Web framework

const express = require('express');
// ApolloServer = GraphQL server class
// gql = Template literal tag for GraphQL schema syntax highlighting
const { ApolloServer, gql } = require('apollo-server-express');

// Define GraphQL schema using Schema Definition Language (SDL)
// typeDefs = Type definitions (schema structure)
// gql\`...\` = Tagged template for GraphQL syntax
const typeDefs = gql\`
  # Schema types define the structure of your data
  
  # type = Custom object type
  # ! = Required/non-nullable field
  type User {
    id: ID!          # ID! = Required unique identifier
    name: String!    # String! = Required text field
    email: String!
    age: Int         # Int = Optional integer (no !)
    posts: [Post!]!  # [Post!]! = Required array of non-null Posts
  }
  
  # Post type with relationship to User
  type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    author: User!    # Relationship: every post has a User author
    createdAt: String!
  }
  
  # Query type defines all read operations
  # These are the "GET" operations of GraphQL
  type Query {
    # Get all users
    users: [User!]!
    
    # Get single user by ID
    # (id: ID!) = Required parameter named 'id' of type ID
    user(id: ID!): User
    
    # Get all posts, optionally filter by published status
    # (published: Boolean) = Optional Boolean parameter
    posts(published: Boolean): [Post!]!
    
    # Get single post
    post(id: ID!): Post
    
    # Search posts by keyword
    searchPosts(keyword: String!): [Post!]!
  }
  
  # Mutation type defines all write operations
  # These are like POST/PUT/DELETE in REST
  type Mutation {
    # Create new user
    # Input parameters define what data is needed
    createUser(name: String!, email: String!, age: Int): User!
    
    # Update existing user
    updateUser(id: ID!, name: String, email: String, age: Int): User!
    
    # Delete user
    deleteUser(id: ID!): Boolean!
    
    # Create new post
    createPost(
      title: String!
      content: String!
      authorId: ID!
      published: Boolean
    ): Post!
    
    # Publish/unpublish a post
    togglePublishPost(id: ID!): Post!
  }
  
  # Subscription type for real-time updates
  # WebSocket-based push notifications
  type Subscription {
    # Subscribe to new posts
    postCreated: Post!
    
    # Subscribe to user updates
    userUpdated: User!
  }
\`;

// Mock database (in real app, use PostgreSQL/MongoDB)
// In-memory data storage for demonstration
let users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 25
  }
];

let posts = [
  {
    id: '1',
    title: 'Introduction to GraphQL',
    content: 'GraphQL is amazing!',
    published: true,
    authorId: '1',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Advanced Node.js',
    content: 'Deep dive into Node.js internals',
    published: false,
    authorId: '2',
    createdAt: new Date().toISOString()
  }
];

// Resolvers define HOW to fetch data for each field
// resolvers = Object matching schema structure
const resolvers = {
  // Query resolvers handle read operations
  Query: {
    // users resolver: return all users
    // () = no arguments needed
    users: () => users,
    
    // user resolver: find user by id
    // (parent, args) = standard resolver signature
    // parent = parent field result (null for root)
    // args = query parameters passed by client
    user: (parent, args) => {
      // args.id = the id parameter from query
      return users.find(user => user.id === args.id);
    },
    
    // posts resolver with optional filtering
    posts: (parent, args) => {
      // If published filter provided, filter posts
      if (args.published !== undefined) {
        return posts.filter(post => post.published === args.published);
      }
      return posts;
    },
    
    post: (parent, args) => {
      return posts.find(post => post.id === args.id);
    },
    
    // Search posts by keyword in title or content
    searchPosts: (parent, args) => {
      const keyword = args.keyword.toLowerCase();
      return posts.filter(post => 
        post.title.toLowerCase().includes(keyword) ||
        post.content.toLowerCase().includes(keyword)
      );
    }
  },
  
  // Mutation resolvers handle write operations
  Mutation: {
    // Create new user
    createUser: (parent, args) => {
      // Generate new ID (in real app, database generates this)
      const newUser = {
        id: String(users.length + 1),
        name: args.name,
        email: args.email,
        age: args.age || null  // Default to null if not provided
      };
      
      users.push(newUser);  // Add to our "database"
      return newUser;       // Return created user
    },
    
    // Update existing user
    updateUser: (parent, args) => {
      const userIndex = users.findIndex(u => u.id === args.id);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      // Update only provided fields (partial update)
      // Spread operator preserves unchanged fields
      users[userIndex] = {
        ...users[userIndex],           // Keep existing fields
        ...(args.name && { name: args.name }),      // Update if provided
        ...(args.email && { email: args.email }),
        ...(args.age !== undefined && { age: args.age })
      };
      
      return users[userIndex];
    },
    
    // Delete user
    deleteUser: (parent, args) => {
      const initialLength = users.length;
      users = users.filter(u => u.id !== args.id);
      
      // Return true if user was deleted
      return users.length < initialLength;
    },
    
    // Create new post
    createPost: (parent, args) => {
      const newPost = {
        id: String(posts.length + 1),
        title: args.title,
        content: args.content,
        authorId: args.authorId,
        published: args.published || false,
        createdAt: new Date().toISOString()
      };
      
      posts.push(newPost);
      
      // In real app, trigger subscription notification here
      // pubsub.publish('POST_CREATED', { postCreated: newPost });
      
      return newPost;
    },
    
    // Toggle post published status
    togglePublishPost: (parent, args) => {
      const post = posts.find(p => p.id === args.id);
      
      if (!post) {
        throw new Error('Post not found');
      }
      
      post.published = !post.published;
      return post;
    }
  },
  
  // Field resolvers for nested relationships
  // These resolve fields on User/Post types
  User: {
    // Resolve posts field on User
    // parent = the User object being resolved
    posts: (parent) => {
      // Find all posts by this user
      return posts.filter(post => post.authorId === parent.id);
    }
  },
  
  Post: {
    // Resolve author field on Post
    // parent = the Post object being resolved
    author: (parent) => {
      // Find the user who authored this post
      return users.find(user => user.id === parent.authorId);
    }
  }
};

// Create Apollo Server instance
// ApolloServer = GraphQL server with schema and resolvers
const server = new ApolloServer({
  typeDefs,    // Schema definition
  resolvers,   // Resolver functions
  
  // Context function runs on every request
  // Share data across all resolvers (auth, database, etc.)
  context: ({ req }) => {
    // Extract auth token from headers
    const token = req.headers.authorization || '';
    
    // In real app, verify token and get user
    // const user = getUserFromToken(token);
    
    // Return context object available to all resolvers
    return {
      token,
      // user,
      // db: database connection
    };
  }
});

// Create Express app
const app = express();

// Start Apollo Server and apply to Express
// async = server initialization is asynchronous
async function startServer() {
  // await server.start() initializes Apollo Server
  await server.start();
  
  // Apply Apollo GraphQL middleware to Express
  // server.applyMiddleware() adds /graphql endpoint
  server.applyMiddleware({ app });
  
  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log(\`🚀 Server ready at http://localhost:\${PORT}\${server.graphqlPath}\`);
    console.log(\`📝 GraphQL Playground available at the same URL\`);
  });
}

startServer();
      </code>
    </pre>

    <h2>Making GraphQL Queries</h2>
    
    <p>Query examples showing GraphQL's flexibility:</p>

    <pre class="code-block">
      <code>
// Example 1: Simple query to get all users
// query = read operation keyword (optional for queries)
// { users { ... } } = Request 'users' field from Query type
{
  users {
    id       # Request only the fields you need
    name
    email
    # age is not requested, so it won't be returned
  }
}

// Response - exactly what we asked for:
{
  "data": {
    "users": [
      {
        "id": "1",
        "name": "John Doe",
        "email": "john@example.com"
      },
      {
        "id": "2",
        "name": "Jane Smith",
        "email": "jane@example.com"
      }
    ]
  }
}

// Example 2: Query with parameters
// query = operation type
// $id = variable declaration ($ = variable prefix)
// ID! = variable type (required ID)
query GetUser($id: ID!) {
  # user(id: $id) = pass variable to query parameter
  user(id: $id) {
    id
    name
    email
    age
    # Nested query - get user's posts too
    posts {
      id
      title
      published
      createdAt
    }
  }
}

// Variables (sent separately in request):
{
  "id": "1"
}

// Response with nested data:
{
  "data": {
    "user": {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "age": 30,
      "posts": [
        {
          "id": "1",
          "title": "Introduction to GraphQL",
          "published": true,
          "createdAt": "2024-01-15T10:30:00Z"
        }
      ]
    }
  }
}

// Example 3: Query with filtering
query GetPublishedPosts {
  # posts(published: true) = filter parameter
  posts(published: true) {
    id
    title
    # Nested query for author info
    author {
      name
      email
    }
  }
}

// Example 4: Multiple queries in one request
# Aliases prevent field name conflicts
query GetMultipleResources {
  # allUsers: users = alias (rename result)
  allUsers: users {
    id
    name
  }
  
  # publishedPosts: posts(...) = another alias
  publishedPosts: posts(published: true) {
    title
  }
  
  # draftPosts: posts(...) = separate result
  draftPosts: posts(published: false) {
    title
  }
}

// Example 5: Search query
query SearchPosts($keyword: String!) {
  searchPosts(keyword: $keyword) {
    id
    title
    content
    author {
      name
    }
  }
}

// Variables:
{
  "keyword": "GraphQL"
}
      </code>
    </pre>

    <h2>GraphQL Mutations</h2>
    
    <p>Mutations handle create, update, and delete operations:</p>

    <pre class="code-block">
      <code>
// Example 1: Create new user
// mutation = write operation keyword (required)
mutation CreateUser($name: String!, $email: String!, $age: Int) {
  # Call createUser mutation with variables
  createUser(name: $name, email: $email, age: $age) {
    # Select fields to return from created user
    id
    name
    email
    age
  }
}

// Variables:
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "age": 28
}

// Response:
{
  "data": {
    "createUser": {
      "id": "3",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "age": 28
    }
  }
}

// Example 2: Update user
mutation UpdateUser($id: ID!, $name: String, $email: String) {
  updateUser(id: $id, name: $name, email: $email) {
    id
    name
    email
    age
    # Also get updated posts
    posts {
      id
      title
    }
  }
}

// Variables (only update name):
{
  "id": "1",
  "name": "John Updated"
}

// Example 3: Create post
mutation CreatePost(
  $title: String!
  $content: String!
  $authorId: ID!
  $published: Boolean
) {
  createPost(
    title: $title
    content: $content
    authorId: $authorId
    published: $published
  ) {
    id
    title
    published
    # Get author info immediately
    author {
      name
    }
  }
}

// Variables:
{
  "title": "My New Post",
  "content": "This is the content",
  "authorId": "1",
  "published": true
}

// Example 4: Delete user
mutation DeleteUser($id: ID!) {
  deleteUser(id: $id)  # Returns Boolean
}

// Variables:
{
  "id": "3"
}

// Response:
{
  "data": {
    "deleteUser": true
  }
}

// Example 5: Multiple mutations in one request
mutation CreateUserAndPost {
  # First mutation
  newUser: createUser(
    name: "Bob Wilson"
    email: "bob@example.com"
    age: 35
  ) {
    id
    name
  }
  
  # Second mutation (runs after first)
  newPost: createPost(
    title: "Bob's First Post"
    content: "Hello World"
    authorId: "4"  # Use the new user's ID
    published: true
  ) {
    id
    title
  }
}
      </code>
    </pre>

    <h2>Client-Side GraphQL with Apollo Client</h2>
    
    <p>Use GraphQL in your frontend applications:</p>

    <pre class="code-block">
      <code>
// Install Apollo Client for frontend
// npm install @apollo/client graphql
// @apollo/client = Full-featured GraphQL client

const { ApolloClient, InMemoryCache, gql, useQuery, useMutation } = require('@apollo/client');

// Create Apollo Client instance
// ApolloClient = Client for making GraphQL requests
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',  // GraphQL endpoint
  cache: new InMemoryCache(),            // Client-side cache
  
  // Add authentication headers
  headers: {
    authorization: \`Bearer \${localStorage.getItem('token')}\`
  }
});

// Define query using gql template
// gql\`...\` = Parse GraphQL query string
const GET_USERS = gql\`
  query GetUsers {
    users {
      id
      name
      email
      posts {
        id
        title
      }
    }
  }
\`;

// Make query request
// client.query() = Send query to server
async function fetchUsers() {
  try {
    // await client.query() returns { data, loading, error }
    const { data } = await client.query({
      query: GET_USERS,
      // fetchPolicy controls caching behavior
      fetchPolicy: 'network-only'  // Always fetch from server
      // 'cache-first' = Use cache if available
      // 'no-cache' = Skip cache completely
    });
    
    console.log('Users:', data.users);
    return data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Query with variables
const GET_USER = gql\`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      age
      posts {
        id
        title
        published
      }
    }
  }
\`;

async function fetchUser(userId) {
  const { data } = await client.query({
    query: GET_USER,
    variables: { id: userId }  // Pass variables object
  });
  
  return data.user;
}

// Define mutation
const CREATE_USER = gql\`
  mutation CreateUser($name: String!, $email: String!, $age: Int) {
    createUser(name: $name, email: $email, age: $age) {
      id
      name
      email
      age
    }
  }
\`;

// Execute mutation
async function createUser(userData) {
  try {
    // client.mutate() sends mutation to server
    const { data } = await client.mutate({
      mutation: CREATE_USER,
      variables: userData,
      
      // Update cache after mutation
      update: (cache, { data: { createUser } }) => {
        // Read current users from cache
        const existingUsers = cache.readQuery({ query: GET_USERS });
        
        // Write updated users back to cache
        cache.writeQuery({
          query: GET_USERS,
          data: {
            users: [...existingUsers.users, createUser]
          }
        });
      }
    });
    
    console.log('Created user:', data.createUser);
    return data.createUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Using in React components (with hooks)
function UserList() {
  // useQuery hook automatically fetches and manages state
  // { data, loading, error } = query result
  const { data, loading, error } = useQuery(GET_USERS);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <ul>
      {data.users.map(user => (
        <li key={user.id}>{user.name} - {user.email}</li>
      ))}
    </ul>
  );
}

function CreateUserForm() {
  // useMutation hook returns mutation function and result
  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Call mutation function
    await createUser({
      variables: {
        name: e.target.name.value,
        email: e.target.email.value,
        age: parseInt(e.target.age.value)
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="age" type="number" placeholder="Age" />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
      </code>
    </pre>

    <h2>Advanced GraphQL Features</h2>
    
    <p>Fragments, directives, and subscriptions:</p>

    <pre class="code-block">
      <code>
// Fragments - Reusable field selections
// fragment = Named set of fields
fragment UserFields on User {
  id
  name
  email
  age
}

fragment PostFields on Post {
  id
  title
  content
  published
  createdAt
}

// Use fragments in queries
query GetUsersWithPosts {
  users {
    ...UserFields    # Spread fragment fields
    posts {
      ...PostFields  # Reuse another fragment
    }
  }
}

// Directives - Conditional field inclusion
// @include(if: Boolean) = Include field if condition is true
// @skip(if: Boolean) = Skip field if condition is true
query GetUser($id: ID!, $includePosts: Boolean!, $skipEmail: Boolean!) {
  user(id: $id) {
    id
    name
    email @skip(if: $skipEmail)        # Conditionally skip email
    age
    posts @include(if: $includePosts) { # Conditionally include posts
      ...PostFields
    }
  }
}

// Variables:
{
  "id": "1",
  "includePosts": true,
  "skipEmail": false
}

// Subscriptions - Real-time updates via WebSockets
// Install: npm install graphql-subscriptions
const { PubSub } = require('graphql-subscriptions');

// Create PubSub instance for pub/sub messaging
// PubSub = Event emitter for subscriptions
const pubsub = new PubSub();

// Add to typeDefs (already shown above)
// type Subscription { postCreated: Post! }

// Subscription resolvers
const resolvers = {
  // ... Query and Mutation resolvers ...
  
  Subscription: {
    postCreated: {
      // subscribe returns AsyncIterator
      // pubsub.asyncIterator() creates subscription channel
      subscribe: () => pubsub.asyncIterator(['POST_CREATED'])
      // 'POST_CREATED' = Event name to listen for
    },
    
    userUpdated: {
      subscribe: () => pubsub.asyncIterator(['USER_UPDATED'])
    }
  }
};

// Publish events in mutations
const resolvers = {
  Mutation: {
    createPost: (parent, args) => {
      const newPost = {
        id: String(posts.length + 1),
        title: args.title,
        content: args.content,
        authorId: args.authorId,
        published: args.published || false,
        createdAt: new Date().toISOString()
      };
      
      posts.push(newPost);
      
      // Publish event to subscribers
      // pubsub.publish(event, payload)
      pubsub.publish('POST_CREATED', {
        postCreated: newPost  // Must match subscription field name
      });
      
      return newPost;
    },
    
    updateUser: (parent, args) => {
      const user = users.find(u => u.id === args.id);
      // ... update logic ...
      
      // Notify subscribers of update
      pubsub.publish('USER_UPDATED', {
        userUpdated: user
      });
      
      return user;
    }
  }
};

// Client-side subscription
const POST_CREATED_SUBSCRIPTION = gql\`
  subscription OnPostCreated {
    postCreated {
      id
      title
      author {
        name
      }
    }
  }
\`;

// In React component
function PostNotifications() {
  // useSubscription hook listens for real-time updates
  const { data, loading } = useSubscription(POST_CREATED_SUBSCRIPTION);
  
  if (loading) return <p>Waiting for posts...</p>;
  
  return (
    <div>
      <h3>New Post!</h3>
      <p>{data.postCreated.title} by {data.postCreated.author.name}</p>
    </div>
  );
}

// Or subscribe programmatically
client.subscribe({
  query: POST_CREATED_SUBSCRIPTION
}).subscribe({
  next: ({ data }) => {
    console.log('New post:', data.postCreated);
    // Update UI, show notification, etc.
  },
  error: (err) => {
    console.error('Subscription error:', err);
  }
});
      </code>
    </pre>

    <h2>Error Handling & Best Practices</h2>
    
    <p>Handle errors properly and follow GraphQL conventions:</p>

    <pre class="code-block">
      <code>
// Custom error handling
const { ApolloError, UserInputError, AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {
    user: (parent, args) => {
      const user = users.find(u => u.id === args.id);
      
      if (!user) {
        // UserInputError = Client sent invalid data (400)
        throw new UserInputError('User not found', {
          argumentName: 'id',
          invalidValue: args.id
        });
      }
      
      return user;
    }
  },
  
  Mutation: {
    createPost: (parent, args, context) => {
      // Check authentication
      if (!context.user) {
        // AuthenticationError = User not authenticated (401)
        throw new AuthenticationError('You must be logged in');
      }
      
      // Validate input
      if (args.title.length < 5) {
        throw new UserInputError('Title too short', {
          argumentName: 'title',
          minLength: 5
        });
      }
      
      // Check authorization
      if (!context.user.canCreatePost) {
        // ForbiddenError = User lacks permissions (403)
        throw new ApolloError('Not authorized', 'FORBIDDEN');
      }
      
      const newPost = {
        id: String(posts.length + 1),
        title: args.title,
        content: args.content,
        authorId: context.user.id,  // Use authenticated user
        published: args.published || false,
        createdAt: new Date().toISOString()
      };
      
      posts.push(newPost);
      return newPost;
    }
  }
};

// Client-side error handling
async function createUserSafely(userData) {
  try {
    const { data } = await client.mutate({
      mutation: CREATE_USER,
      variables: userData
    });
    
    return { success: true, data: data.createUser };
  } catch (error) {
    // error.graphQLErrors = Array of GraphQL errors
    if (error.graphQLErrors) {
      error.graphQLErrors.forEach(({ message, extensions }) => {
        console.error(\`GraphQL Error: \${message}\`);
        
        // extensions.code = Error type (UNAUTHENTICATED, etc.)
        if (extensions.code === 'UNAUTHENTICATED') {
          // Redirect to login
          window.location.href = '/login';
        } else if (extensions.code === 'BAD_USER_INPUT') {
          // Show validation error
          console.error('Invalid input:', extensions);
        }
      });
    }
    
    // error.networkError = Network/server error
    if (error.networkError) {
      console.error('Network error:', error.networkError);
    }
    
    return { success: false, error: error.message };
  }
}

// Best Practices:

// 1. Use DataLoader to prevent N+1 queries
// npm install dataloader
const DataLoader = require('dataloader');

// Create batching loader
// DataLoader batches multiple requests into one
const userLoader = new DataLoader(async (userIds) => {
  // Batch load all requested users at once
  console.log('Batch loading users:', userIds);
  
  // In real app: SELECT * FROM users WHERE id IN (...)
  const loadedUsers = users.filter(u => userIds.includes(u.id));
  
  // Return in same order as userIds
  return userIds.map(id => loadedUsers.find(u => u.id === id));
});

// Use in resolver
const resolvers = {
  Post: {
    author: (parent, args, context) => {
      // Instead of: users.find(u => u.id === parent.authorId)
      // Use DataLoader to batch requests
      return context.loaders.userLoader.load(parent.authorId);
    }
  }
};

// Add to context
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      user: req.user,
      loaders: {
        userLoader: new DataLoader(/* batch function */)
      }
    };
  }
});

// 2. Implement pagination for large datasets
const typeDefs = gql\`
  type Query {
    # Cursor-based pagination
    posts(first: Int, after: String): PostConnection!
  }
  
  type PostConnection {
    edges: [PostEdge!]!
    pageInfo: PageInfo!
  }
  
  type PostEdge {
    node: Post!
    cursor: String!
  }
  
  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }
\`;

// 3. Use input types for complex mutations
const typeDefs = gql\`
  input CreateUserInput {
    name: String!
    email: String!
    age: Int
    address: AddressInput
  }
  
  input AddressInput {
    street: String!
    city: String!
    country: String!
  }
  
  type Mutation {
    createUser(input: CreateUserInput!): User!
  }
\`;

// 4. Enable introspection in development only
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
  playground: process.env.NODE_ENV !== 'production'
});
      </code>
    </pre>

    <div class="practice-box bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
      <h3 class="font-semibold text-green-900 mb-4">🎯 Practice Exercise</h3>
      <p class="mb-4">Create a complete GraphQL API for a blog platform with:</p>
      <ul class="list-disc pl-6 space-y-2">
        <li>User type with id, name, email, bio</li>
        <li>Post type with id, title, content, published, author, comments</li>
        <li>Comment type with id, text, author, post</li>
        <li>Queries: users, user(id), posts, post(id), searchPosts(keyword)</li>
        <li>Mutations: createUser, createPost, createComment, updatePost, deletePost</li>
        <li>Implement proper relationships between User, Post, and Comment</li>
        <li>Add authentication check for mutations</li>
        <li>Handle errors properly with custom error messages</li>
      </ul>
    </div>

    <div class="tip-box bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
      <h4 class="font-semibold text-yellow-900 mb-2">💡 Key Takeaways</h4>
      <ul class="list-disc pl-6 space-y-1 text-sm">
        <li>GraphQL provides a flexible, type-safe alternative to REST APIs</li>
        <li>Clients request exactly the data they need (no over/under-fetching)</li>
        <li>Schema defines types, queries, mutations, and subscriptions</li>
        <li>Resolvers implement the logic for fetching/modifying data</li>
        <li>Apollo Client handles caching, optimistic updates, and state management</li>
        <li>Use DataLoader to prevent N+1 query problems</li>
        <li>Subscriptions enable real-time features via WebSockets</li>
        <li>Proper error handling improves client-side UX</li>
      </ul>
    </div>
  </div>`,

  starterCode: `const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// Define your schema and resolvers here

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
  app.listen(4000, () => console.log('Server running on http://localhost:4000/graphql'));
}

startServer();`,

  solution: `const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = gql\`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }
  
  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }
  
  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
  }
  
  type Mutation {
    createUser(name: String!, email: String!): User!
    createPost(title: String!, content: String!, authorId: ID!): Post!
  }
\`;

let users = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
];

let posts = [
  { id: '1', title: 'GraphQL Tutorial', content: 'Learn GraphQL basics', authorId: '1' }
];

const resolvers = {
  Query: {
    users: () => users,
    user: (_, { id }) => users.find(u => u.id === id),
    posts: () => posts,
    post: (_, { id }) => posts.find(p => p.id === id)
  },
  
  Mutation: {
    createUser: (_, { name, email }) => {
      const user = { id: String(users.length + 1), name, email };
      users.push(user);
      return user;
    },
    createPost: (_, { title, content, authorId }) => {
      const post = { id: String(posts.length + 1), title, content, authorId };
      posts.push(post);
      return post;
    }
  },
  
  User: {
    posts: (parent) => posts.filter(p => p.authorId === parent.id)
  },
  
  Post: {
    author: (parent) => users.find(u => u.id === parent.authorId)
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
  app.listen(4000, () => console.log('🚀 Server running at http://localhost:4000/graphql'));
}

startServer();`,

  validationCriteria: {
    requiredIncludes: [
      "apollo-server-express",
      "express",
      "gql",
      "typeDefs",
      "resolvers",
      "ApolloServer",
      "applyMiddleware",
    ],
    requiredPatterns: [
      /type\s+(User|Post|Query|Mutation)/,
      /new\s+ApolloServer/,
      /(Query|Mutation):/,
    ],
    minLines: 20,
  },
};
