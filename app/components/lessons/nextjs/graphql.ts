import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "GraphQL with Next.js",
  description:
    "Master GraphQL in Next.js - build full-stack GraphQL applications with Apollo Client, API routes, server components, and real-time features.",
  difficulty: "Intermediate",
  objectives: [
    "Understand GraphQL fundamentals and integration with Next.js",
    "Set up Apollo Client for data fetching in Next.js",
    "Create GraphQL API routes with Next.js API handlers",
    "Use GraphQL in Server Components and Client Components",
    "Implement mutations and optimistic updates",
    "Handle caching and revalidation with GraphQL",
    "Build real-time features with subscriptions",
  ],
  practiceInstructions: [
    "Install @apollo/client and graphql packages",
    "Create Apollo Client wrapper for Next.js",
    "Build GraphQL API route in app/api/graphql",
    "Implement queries in Server Components",
    "Add mutations in Client Components with 'use client'",
    "Configure caching and revalidation",
    "Test both server and client-side GraphQL operations",
  ],
  hints: [
    "Use Apollo Client's SSR support for Server Components",
    "API routes in app/api can serve GraphQL endpoints",
    "Client Components need 'use client' directive for hooks",
    "Cache normalization improves performance significantly",
    "Use Next.js revalidation with GraphQL queries",
  ],
  content: `<div class="lesson-content">
    <p>GraphQL in Next.js combines the power of GraphQL's flexible data fetching with Next.js's server-side rendering and API routes. Learn how to build full-stack GraphQL applications that leverage both client and server capabilities.</p>

    <h2>Why GraphQL with Next.js?</h2>
    
    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🚀 Next.js + GraphQL Benefits</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Full-Stack:</strong> GraphQL API routes and client in one project</li>
        <li><strong>Server Components:</strong> Fetch GraphQL data on the server without client bundle</li>
        <li><strong>Type Safety:</strong> GraphQL + TypeScript for end-to-end types</li>
        <li><strong>Caching:</strong> Combine Next.js cache with Apollo cache</li>
        <li><strong>Streaming:</strong> Use React Suspense with GraphQL queries</li>
      </ul>
    </div>

    <h2>Setting Up Apollo Client</h2>
    
    <p>Install and configure Apollo Client for Next.js:</p>

    <pre class="code-block">
      <code>
# Install dependencies
# npm install @apollo/client graphql @apollo/experimental-nextjs-app-support
# @apollo/client = GraphQL client with caching
# graphql = Core GraphQL implementation
# @apollo/experimental-nextjs-app-support = App Router support

# lib/apollo-client.ts
# Create Apollo Client for Next.js App Router

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';

# getClient() for Server Components
# registerApolloClient = Register client for RSC
export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    # cache = InMemoryCache for normalized caching
    cache: new InMemoryCache(),
    # link = HttpLink connects to GraphQL endpoint
    link: new HttpLink({
      # uri = GraphQL endpoint URL
      # Use absolute URL for server-side requests
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/api/graphql',
      # fetchOptions for SSR
      fetchOptions: { cache: 'no-store' },
    }),
  });
});

# lib/apollo-provider.tsx
# Apollo Provider for Client Components
'use client';

import { ApolloLink, HttpLink } from '@apollo/client';
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr';

# makeClient() creates client for Client Components
function makeClient() {
  const httpLink = new HttpLink({
    # Use relative URL for client-side
    uri: '/api/graphql',
  });

  return new NextSSRApolloClient({
    # NextSSRInMemoryCache = SSR-compatible cache
    cache: new NextSSRInMemoryCache(),
    link:
      # typeof window === 'undefined' = Check if server-side
      typeof window === 'undefined'
        ? ApolloLink.from([
            # SSRMultipartLink for server-side multipart responses
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
  });
}

# ApolloWrapper component wraps app with Apollo Provider
export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    # ApolloNextAppProvider = Provider for Next.js App Router
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}

# app/layout.tsx
# Wrap app with Apollo Provider
import { ApolloWrapper } from '@/lib/apollo-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
          {children}
        </ApolloWrapper>
      </body>
    </html>
  );
}
      </code>
    </pre>

    <h2>Creating GraphQL API Route</h2>
    
    <p>Build GraphQL server in Next.js API route:</p>

    <pre class="code-block">
      <code>
# app/api/graphql/route.ts
# GraphQL API route handler

import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';
import { NextRequest } from 'next/server';

# Define GraphQL schema
# typeDefs = Type definitions (schema structure)
const typeDefs = gql\`
  # User type definition
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }
  
  # Post type definition
  type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    authorId: String!
    author: User!
  }
  
  # Query type - read operations
  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
  }
  
  # Mutation type - write operations
  type Mutation {
    createUser(name: String!, email: String!): User!
    createPost(title: String!, content: String!, authorId: String!): Post!
    updatePost(id: ID!, title: String, content: String, published: Boolean): Post!
    deletePost(id: ID!): Boolean!
  }
\`;

# Mock data (replace with database)
let users = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

let posts = [
  { id: '1', title: 'First Post', content: 'Hello GraphQL!', published: true, authorId: '1' },
  { id: '2', title: 'Second Post', content: 'Next.js is great!', published: false, authorId: '1' },
];

# resolvers = Functions that fetch data for schema fields
const resolvers = {
  # Query resolvers - handle read operations
  Query: {
    # users resolver - returns all users
    users: () => users,
    
    # user resolver - returns single user by ID
    # (_parent, args) = Standard resolver signature
    # _parent = Parent object (not used in top-level)
    # args = Query arguments (contains id)
    user: (_parent: any, args: { id: string }) => {
      return users.find((user) => user.id === args.id);
    },
    
    posts: () => posts,
    
    post: (_parent: any, args: { id: string }) => {
      return posts.find((post) => post.id === args.id);
    },
  },
  
  # Mutation resolvers - handle write operations
  Mutation: {
    # createUser mutation - creates new user
    createUser: (_parent: any, args: { name: string; email: string }) => {
      const newUser = {
        id: String(users.length + 1),
        name: args.name,
        email: args.email,
      };
      users.push(newUser);
      return newUser;
    },
    
    # createPost mutation
    createPost: (_parent: any, args: { title: string; content: string; authorId: string }) => {
      const newPost = {
        id: String(posts.length + 1),
        title: args.title,
        content: args.content,
        published: false,
        authorId: args.authorId,
      };
      posts.push(newPost);
      return newPost;
    },
    
    # updatePost mutation
    updatePost: (_parent: any, args: { id: string; title?: string; content?: string; published?: boolean }) => {
      const post = posts.find((p) => p.id === args.id);
      if (!post) throw new Error('Post not found');
      
      # Update fields if provided
      if (args.title !== undefined) post.title = args.title;
      if (args.content !== undefined) post.content = args.content;
      if (args.published !== undefined) post.published = args.published;
      
      return post;
    },
    
    # deletePost mutation
    deletePost: (_parent: any, args: { id: string }) => {
      const index = posts.findIndex((p) => p.id === args.id);
      if (index === -1) return false;
      
      posts.splice(index, 1);
      return true;
    },
  },
  
  # Type resolvers - resolve relationships
  # User.posts = Resolver for posts field on User type
  User: {
    # posts resolver for User type
    # parent = User object (from Query.user or Query.users)
    posts: (parent: { id: string }) => {
      # Filter posts by authorId
      return posts.filter((post) => post.authorId === parent.id);
    },
  },
  
  # Post.author = Resolver for author field on Post type
  Post: {
    author: (parent: { authorId: string }) => {
      return users.find((user) => user.id === parent.authorId);
    },
  },
};

# Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

# Create Next.js handler
# startServerAndCreateNextHandler = Creates route handler
const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => ({ req }),
});

# Export GET and POST handlers
export { handler as GET, handler as POST };
      </code>
    </pre>

    <h2>GraphQL in Server Components</h2>
    
    <p>Fetch GraphQL data in Server Components:</p>

    <pre class="code-block">
      <code>
# app/users/page.tsx
# Server Component with GraphQL query

import { getClient } from '@/lib/apollo-client';
import { gql } from '@apollo/client';

# Define GraphQL query
# GET_USERS = Query to fetch users with posts
const GET_USERS = gql\`
  query GetUsers {
    users {
      id
      name
      email
      posts {
        id
        title
        published
      }
    }
  }
\`;

# UsersPage is a Server Component (default in App Router)
export default async function UsersPage() {
  # getClient() = Get Apollo Client for Server Components
  const client = getClient();
  
  # client.query() = Execute GraphQL query
  # Runs on server, no client-side JavaScript
  const { data } = await client.query({
    query: GET_USERS,
  });

  return (
    <div>
      <h1>Users</h1>
      <div>
        {data.users.map((user: any) => (
          <div key={user.id}>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <h3>Posts ({user.posts.length})</h3>
            <ul>
              {user.posts.map((post: any) => (
                <li key={post.id}>
                  {post.title} {post.published ? '✓' : '✗'}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

# With Next.js caching and revalidation
export const revalidate = 60; # Revalidate every 60 seconds

# Or use dynamic rendering
export const dynamic = 'force-dynamic'; # Always fetch fresh data
      </code>
    </pre>

    <h2>GraphQL in Client Components</h2>
    
    <p>Use Apollo hooks in Client Components:</p>

    <pre class="code-block">
      <code>
# app/components/CreatePost.tsx
# Client Component with GraphQL mutation
'use client';

import { useMutation, gql } from '@apollo/client';
import { useState } from 'react';

# Define GraphQL mutation
const CREATE_POST = gql\`
  mutation CreatePost($title: String!, $content: String!, $authorId: String!) {
    createPost(title: $title, content: $content, authorId: $authorId) {
      id
      title
      content
      published
    }
  }
\`;

# Define query to refetch after mutation
const GET_POSTS = gql\`
  query GetPosts {
    posts {
      id
      title
      content
      published
    }
  }
\`;

export default function CreatePost({ authorId }: { authorId: string }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  # useMutation hook for GraphQL mutations
  # createPost = Mutation function
  # loading, error, data = Mutation state
  const [createPost, { loading, error, data }] = useMutation(CREATE_POST, {
    # refetchQueries = Queries to refetch after mutation
    refetchQueries: [{ query: GET_POSTS }],
    # onCompleted = Callback after successful mutation
    onCompleted: () => {
      setTitle('');
      setContent('');
      alert('Post created successfully!');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    # Execute mutation with variables
    await createPost({
      variables: {
        title,
        content,
        authorId,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Post</h2>
      
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Post'}
      </button>
      
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}

# app/components/PostList.tsx
# Client Component with GraphQL query
'use client';

import { useQuery, useMutation, gql } from '@apollo/client';

const GET_POSTS = gql\`
  query GetPosts {
    posts {
      id
      title
      content
      published
      author {
        name
      }
    }
  }
\`;

const UPDATE_POST = gql\`
  mutation UpdatePost($id: ID!, $published: Boolean!) {
    updatePost(id: $id, published: $published) {
      id
      published
    }
  }
\`;

export default function PostList() {
  # useQuery hook for GraphQL queries
  # loading = Query in progress
  # error = Query error
  # data = Query result
  const { loading, error, data, refetch } = useQuery(GET_POSTS);
  
  const [updatePost] = useMutation(UPDATE_POST, {
    # optimisticResponse = Update UI immediately
    # Cache will be updated before server responds
    optimisticResponse: (vars) => ({
      updatePost: {
        __typename: 'Post',
        id: vars.id,
        published: vars.published,
      },
    }),
  });

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const togglePublished = async (id: string, published: boolean) => {
    await updatePost({
      variables: { id, published: !published },
    });
  };

  return (
    <div>
      <h2>Posts</h2>
      <button onClick={() => refetch()}>Refresh</button>
      
      {data.posts.map((post: any) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>By: {post.author.name}</p>
          <button onClick={() => togglePublished(post.id, post.published)}>
            {post.published ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      ))}
    </div>
  );
}
      </code>
    </pre>

    <h2>Advanced Features</h2>
    
    <p>Caching, fragments, and real-time updates:</p>

    <pre class="code-block">
      <code>
# GraphQL Fragments for reusability
const USER_FRAGMENT = gql\`
  fragment UserFields on User {
    id
    name
    email
  }
\`;

const GET_USER = gql\`
  \${USER_FRAGMENT}
  
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserFields
      posts {
        id
        title
      }
    }
  }
\`;

# Apollo Cache configuration
import { InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache({
  # typePolicies = Configure caching behavior per type
  typePolicies: {
    Query: {
      fields: {
        # posts field merge strategy
        posts: {
          # merge = How to merge incoming data with cache
          merge(existing = [], incoming) {
            return [...incoming];
          },
        },
      },
    },
    Post: {
      # keyFields = Unique identifier for cache normalization
      keyFields: ['id'],
    },
  },
});

# Polling for real-time updates
function PostListWithPolling() {
  const { data } = useQuery(GET_POSTS, {
    # pollInterval = Refetch every X milliseconds
    pollInterval: 5000, # Poll every 5 seconds
  });
  
  return <PostList posts={data?.posts || []} />;
}

# Subscriptions (requires WebSocket setup)
import { WebSocketLink } from '@apollo/client/link/ws';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

# Split link for subscriptions vs queries/mutations
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: { reconnect: true },
});

const httpLink = new HttpLink({
  uri: '/api/graphql',
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

# Use subscription hook
import { useSubscription, gql } from '@apollo/client';

const POST_CREATED = gql\`
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

function NewPostNotification() {
  const { data, loading } = useSubscription(POST_CREATED);
  
  if (loading) return <p>Listening for new posts...</p>;
  if (data) {
    return <p>New post: {data.postCreated.title} by {data.postCreated.author.name}</p>;
  }
  return null;
}

# Error handling and loading states
function UserProfile({ userId }: { userId: string }) {
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: userId },
    # errorPolicy = How to handle errors
    errorPolicy: 'all', # Return both data and errors
    # fetchPolicy = Cache behavior
    fetchPolicy: 'cache-first', # Use cache if available
  });

  if (loading) return <Skeleton />;
  
  if (error) {
    return (
      <div>
        <h3>Error loading user</h3>
        <p>{error.message}</p>
        <button onClick={() => refetch()}>Try Again</button>
      </div>
    );
  }

  return <UserCard user={data.user} />;
}

# Code generation with GraphQL Code Generator
# npm install -D @graphql-codegen/cli @graphql-codegen/typescript
# Creates TypeScript types from GraphQL schema

# codegen.yml
schema: http://localhost:3000/api/graphql
documents: './app/**/*.tsx'
generates:
  ./lib/generated/graphql.ts:
    plugins:
      - typescript
      - typescript-operations
      - typescript-react-apollo

# Generated types provide full type safety:
import { useGetUsersQuery, useCreatePostMutation } from '@/lib/generated/graphql';

function Users() {
  # Fully typed query hook
  const { data, loading } = useGetUsersQuery();
  
  # data.users is fully typed!
  return data?.users.map(user => <div>{user.name}</div>);
}
      </code>
    </pre>

    <div class="practice-box bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
      <h3 class="font-semibold text-green-900 mb-4">🎯 Practice Exercise</h3>
      <p class="mb-4">Build a complete Next.js GraphQL application with:</p>
      <ul class="list-disc pl-6 space-y-2">
        <li>GraphQL API route with User and Post types</li>
        <li>Server Component displaying users (with caching)</li>
        <li>Client Component for creating posts with mutations</li>
        <li>Client Component for post list with optimistic updates</li>
        <li>Apollo Client configuration with SSR support</li>
        <li>Proper error handling and loading states</li>
        <li>Test queries at /api/graphql</li>
      </ul>
    </div>

    <div class="tip-box bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
      <h4 class="font-semibold text-yellow-900 mb-2">💡 Key Takeaways</h4>
      <ul class="list-disc pl-6 space-y-1 text-sm">
        <li>Next.js API routes can serve as GraphQL endpoints</li>
        <li>Server Components fetch GraphQL data at build/request time</li>
        <li>Client Components use Apollo hooks (useQuery, useMutation)</li>
        <li>Cache normalization dramatically improves performance</li>
        <li>Optimistic updates provide instant UI feedback</li>
        <li>Fragments reduce duplication in queries</li>
        <li>GraphQL Code Generator provides end-to-end type safety</li>
        <li>Combine Next.js revalidation with Apollo cache for optimal caching</li>
      </ul>
    </div>
  </div>`,

  starterCode: `// Install: npm install @apollo/client graphql @as-integrations/next

// app/api/graphql/route.ts
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';

const typeDefs = gql\`
  type Query {
    hello: String
  }
\`;

const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL!',
  },
};

// Create your GraphQL server and handlers here`,

  solution: `// app/api/graphql/route.ts
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';

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
    published: Boolean!
    authorId: String!
    author: User!
  }
  
  type Query {
    users: [User!]!
    posts: [Post!]!
  }
  
  type Mutation {
    createPost(title: String!, content: String!, authorId: String!): Post!
  }
\`;

let users = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
];

let posts = [
  { id: '1', title: 'First Post', content: 'Hello!', published: true, authorId: '1' },
];

const resolvers = {
  Query: {
    users: () => users,
    posts: () => posts,
  },
  Mutation: {
    createPost: (_: any, args: any) => {
      const post = { id: String(posts.length + 1), ...args, published: false };
      posts.push(post);
      return post;
    },
  },
  User: {
    posts: (parent: any) => posts.filter(p => p.authorId === parent.id),
  },
  Post: {
    author: (parent: any) => users.find(u => u.id === parent.authorId),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };`,

  validationCriteria: {
    requiredIncludes: [
      "ApolloServer",
      "typeDefs",
      "resolvers",
      "gql",
      "Query",
      "startServerAndCreateNextHandler",
    ],
    requiredPatterns: [
      /type\s+\w+\s*{/,
      /const\s+resolvers\s*=/,
      /new\s+ApolloServer/,
    ],
    minLines: 20,
  },
};
