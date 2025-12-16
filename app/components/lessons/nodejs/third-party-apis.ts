import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Working with Third-Party APIs",
  description:
    "Learn how to integrate external APIs like Google Gemini, Claude, OpenAI, and other services into your Node.js applications.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>Third-party APIs allow you to leverage external services and data in your applications. Learn how to make HTTP requests, handle authentication, and process responses from services like AI APIs, payment gateways, and more.</p>

    <h2>Understanding Third-Party APIs</h2>
    
    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🌐 What are Third-Party APIs?</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>External Services:</strong> APIs provided by other companies/services</li>
        <li><strong>Not Your Server:</strong> Data and logic exist on external servers</li>
        <li><strong>HTTP Requests:</strong> Communicate using REST, GraphQL, or other protocols</li>
        <li><strong>Authentication:</strong> Usually requires API keys or OAuth tokens</li>
        <li><strong>Examples:</strong> Google APIs, Stripe, Twilio, OpenAI, Claude AI</li>
      </ul>
    </div>

    <h2>Making HTTP Requests with Axios</h2>
    
    <p>Axios is a popular HTTP client for making API requests:</p>

    <pre class="code-block">
      <code>
// Install axios: npm install axios
// axios = HTTP client library (cleaner than fetch)
const axios = require('axios');

// Making a GET request
// async = function returns a Promise (can use await inside)
async function getUserData(userId) {
    try {
        // await = wait for Promise to resolve before continuing
        // axios.get() sends HTTP GET request
        // Returns response object with data, status, headers, etc.
        const response = await axios.get(\`https://api.example.com/users/\${userId}\`);
        
        // response.data = parsed JSON response body
        // axios automatically parses JSON (unlike fetch)
        console.log('User data:', response.data);
        
        // response.status = HTTP status code (200, 404, 500, etc.)
        console.log('Status code:', response.status);
        
        return response.data;
    } catch (error) {
        // error.response = response object if request succeeded but got error status
        // error.message = error description if request failed
        console.error('Error fetching user:', error.message);
        
        // error.response?.status = optional chaining (won't crash if undefined)
        if (error.response?.status === 404) {
            console.log('User not found');
        }
        
        throw error;  // Re-throw to let caller handle it
    }
}

// Making a POST request with data
async function createUser(userData) {
    try {
        // axios.post(url, data, config)
        // Second argument = request body (automatically converted to JSON)
        const response = await axios.post(
            'https://api.example.com/users',
            {
                name: userData.name,     // Request body data
                email: userData.email,
                age: userData.age
            },
            {
                // Third argument = config object (optional)
                headers: {
                    'Content-Type': 'application/json',  // Tell server we're sending JSON
                    'Authorization': \`Bearer \${process.env.API_KEY}\`  // API authentication
                }
            }
        );
        
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error.message);
        throw error;
    }
}
      </code>
    </pre>

    <h2>Integrating Google Gemini AI API</h2>
    
    <p>Let's integrate Google's Gemini AI for text generation:</p>

    <pre class="code-block">
      <code>
// Install: npm install @google/generative-ai
// Google's official SDK for Gemini AI
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client
// process.env.GEMINI_API_KEY = environment variable (keep secret!)
// Store API keys in .env file, NEVER in code
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create an endpoint to generate AI responses
// Express route handler
app.post('/api/ai/generate', async (req, res) => {
    try {
        // req.body.prompt = user's input text from request body
        const { prompt } = req.body;
        
        // Validate input
        // !prompt checks if prompt is null, undefined, or empty string
        if (!prompt) {
            // Return 400 Bad Request if input missing
            return res.status(400).json({ 
                error: 'Prompt is required' 
            });
        }
        
        // Get the Gemini model
        // 'gemini-pro' = model name (like GPT-4, Claude, etc.)
        // Different models have different capabilities and pricing
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        // Generate content
        // generateContent() sends prompt to Gemini and gets response
        // Returns Promise that resolves with AI-generated text
        const result = await model.generateContent(prompt);
        
        // result.response = object containing AI response
        // .text() = method to extract plain text from response
        const response = await result.response;
        const text = response.text();
        
        // Send AI response back to client
        res.json({ 
            success: true,
            response: text,
            model: 'gemini-pro'
        });
        
    } catch (error) {
        // Log error for debugging
        console.error('Gemini API Error:', error);
        
        // Return 500 Internal Server Error
        // Don't expose internal error details to client (security)
        res.status(500).json({ 
            error: 'Failed to generate AI response',
            message: error.message 
        });
    }
});

// Advanced: Streaming responses for real-time output
app.post('/api/ai/stream', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        // generateContentStream() = returns stream instead of waiting for full response
        // Useful for long responses (shows text as it's generated)
        const result = await model.generateContentStream(prompt);
        
        // Set headers for Server-Sent Events (SSE)
        // SSE = protocol for server to push updates to client
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        // Stream response chunks to client
        // for await...of = iterate over async iterable
        // Each chunk contains part of the AI response
        for await (const chunk of result.stream) {
            // chunk.text() = get text from current chunk
            const chunkText = chunk.text();
            
            // Send chunk to client in SSE format
            // data: prefix required by SSE protocol
            // \\n\\n = two newlines to signal end of message
            res.write(\`data: \${JSON.stringify({ text: chunkText })}\\n\\n\`);
        }
        
        // End the stream
        res.end();
        
    } catch (error) {
        console.error('Streaming Error:', error);
        res.status(500).json({ error: 'Streaming failed' });
    }
});
      </code>
    </pre>

    <h2>Integrating Anthropic Claude API</h2>
    
    <p>Working with Claude AI for intelligent responses:</p>

    <pre class="code-block">
      <code>
// Install: npm install @anthropic-ai/sdk
// Anthropic's official SDK for Claude AI
const Anthropic = require('@anthropic-ai/sdk');

// Initialize Claude client
// API key should be in environment variable
const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY
});

// Create endpoint for Claude AI
app.post('/api/claude/chat', async (req, res) => {
    try {
        // req.body = parsed JSON from request
        const { message, systemPrompt } = req.body;
        
        // Validate required fields
        if (!message) {
            return res.status(400).json({ 
                error: 'Message is required' 
            });
        }
        
        // Call Claude API
        // messages.create() = send conversation to Claude
        const completion = await anthropic.messages.create({
            // model = which Claude model to use
            // claude-3-sonnet = balanced model (speed + quality)
            // claude-3-opus = most capable (slower, more expensive)
            // claude-3-haiku = fastest (less capable)
            model: 'claude-3-sonnet-20240229',
            
            // max_tokens = maximum length of response
            // Claude charges per token (input + output)
            max_tokens: 1024,
            
            // system = instructions for Claude's behavior
            // Optional: guides how Claude responds
            system: systemPrompt || 'You are a helpful assistant.',
            
            // messages = conversation history (array)
            // Each message has 'role' (user/assistant) and 'content' (text)
            messages: [
                {
                    role: 'user',      // 'user' = from human, 'assistant' = from AI
                    content: message   // The actual message text
                }
            ]
        });
        
        // Extract response
        // completion.content = array of content blocks
        // [0] = first block (usually only one)
        // .text = extract text from content block
        const responseText = completion.content[0].text;
        
        // Return structured response
        res.json({
            success: true,
            response: responseText,
            model: completion.model,
            // usage = token counts (for billing/monitoring)
            usage: {
                inputTokens: completion.usage.input_tokens,
                outputTokens: completion.usage.output_tokens
            }
        });
        
    } catch (error) {
        console.error('Claude API Error:', error);
        
        // Handle rate limiting
        // error.status = HTTP status code from Claude
        if (error.status === 429) {
            // 429 = Too Many Requests (rate limit exceeded)
            return res.status(429).json({ 
                error: 'Rate limit exceeded. Please try again later.' 
            });
        }
        
        res.status(500).json({ 
            error: 'Failed to generate response',
            message: error.message 
        });
    }
});

// Advanced: Multi-turn conversation with Claude
app.post('/api/claude/conversation', async (req, res) => {
    try {
        // conversationHistory = array of previous messages
        // Allows Claude to remember context
        const { conversationHistory, newMessage } = req.body;
        
        // Build messages array from history
        // ...conversationHistory = spread operator (copies array elements)
        const messages = [
            ...conversationHistory,  // Previous messages
            { role: 'user', content: newMessage }  // New message
        ];
        
        const completion = await anthropic.messages.create({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1024,
            messages: messages  // Full conversation context
        });
        
        const responseText = completion.content[0].text;
        
        // Return response with updated history
        res.json({
            success: true,
            response: responseText,
            // Include assistant's response in history for next request
            updatedHistory: [
                ...messages,
                { role: 'assistant', content: responseText }
            ]
        });
        
    } catch (error) {
        console.error('Conversation Error:', error);
        res.status(500).json({ error: 'Failed to continue conversation' });
    }
});
      </code>
    </pre>

    <h2>Working with Payment APIs (Stripe)</h2>
    
    <p>Integrating payment processing:</p>

    <pre class="code-block">
      <code>
// Install: npm install stripe
// Stripe = payment processing platform
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent (charge customer)
app.post('/api/payments/create-intent', async (req, res) => {
    try {
        // amount = payment amount in cents (100 = $1.00)
        // currency = three-letter code (usd, eur, gbp, etc.)
        const { amount, currency, description } = req.body;
        
        // Validate amount
        if (!amount || amount < 50) {
            // Stripe minimum is usually 50 cents
            return res.status(400).json({ 
                error: 'Amount must be at least 50 cents' 
            });
        }
        
        // Create PaymentIntent
        // PaymentIntent = Stripe object representing payment attempt
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,           // Amount in smallest currency unit
            currency: currency || 'usd',
            description: description,
            
            // automatic_payment_methods = let Stripe handle payment method details
            automatic_payment_methods: {
                enabled: true
            },
            
            // metadata = custom data stored with payment (not shown to customer)
            // Useful for tracking orders, user IDs, etc.
            metadata: {
                orderId: req.body.orderId,
                userId: req.user?.id
            }
        });
        
        // Return client secret to frontend
        // clientSecret = token used by frontend to complete payment
        // NEVER share secret key with frontend (security risk!)
        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
        
    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ 
            error: 'Payment intent creation failed',
            message: error.message 
        });
    }
});

// Webhook to handle payment events
// Webhooks = Stripe notifies your server when events occur
app.post('/api/webhooks/stripe', async (req, res) => {
    // req.body = raw request body (Buffer)
    // Need raw body for signature verification (security)
    const sig = req.headers['stripe-signature'];
    
    let event;
    
    try {
        // Verify webhook signature
        // constructEvent() = validates request came from Stripe
        // Prevents attackers from faking webhook events
        event = stripe.webhooks.constructEvent(
            req.body,  // Raw body
            sig,       // Signature from header
            process.env.STRIPE_WEBHOOK_SECRET  // Secret from Stripe dashboard
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        // Return 400 if signature invalid
        return res.status(400).send(\`Webhook Error: \${err.message}\`);
    }
    
    // Handle different event types
    // event.type = what happened (payment succeeded, failed, etc.)
    switch (event.type) {
        case 'payment_intent.succeeded':
            // Payment completed successfully
            const paymentIntent = event.data.object;
            console.log('Payment succeeded:', paymentIntent.id);
            
            // Update database: mark order as paid
            // Send confirmation email
            // Grant access to purchased content
            // etc.
            break;
            
        case 'payment_intent.payment_failed':
            // Payment failed
            const failedPayment = event.data.object;
            console.log('Payment failed:', failedPayment.id);
            
            // Notify customer
            // Update order status to failed
            break;
            
        default:
            // Unhandled event type
            console.log(\`Unhandled event type: \${event.type}\`);
    }
    
    // Return 200 to acknowledge receipt
    // Stripe retries if not 200 (assumes webhook failed)
    res.json({ received: true });
});
      </code>
    </pre>

    <h2>Best Practices for Third-Party APIs</h2>
    
    <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-3">✅ Security & Best Practices</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Environment Variables:</strong> Store API keys in .env file, never in code</li>
        <li><strong>Rate Limiting:</strong> Implement rate limits to avoid hitting API quotas</li>
        <li><strong>Error Handling:</strong> Always use try-catch blocks and handle failures gracefully</li>
        <li><strong>Timeouts:</strong> Set request timeouts to prevent hanging requests</li>
        <li><strong>Retry Logic:</strong> Implement exponential backoff for failed requests</li>
        <li><strong>Caching:</strong> Cache responses when possible to reduce API calls</li>
        <li><strong>Logging:</strong> Log API requests for debugging and monitoring</li>
        <li><strong>Validation:</strong> Validate input before sending to external APIs</li>
      </ul>
    </div>

    <h2>Advanced: Request Timeout & Retry Logic</h2>
    
    <pre class="code-block">
      <code>
// Configure axios with timeout and retry
const axios = require('axios');

// Create axios instance with default config
// Instance = pre-configured axios client
const apiClient = axios.create({
    baseURL: 'https://api.example.com',  // Base URL for all requests
    timeout: 10000,  // 10 second timeout (request fails if takes longer)
    headers: {
        'Authorization': \`Bearer \${process.env.API_KEY}\`
    }
});

// Retry logic with exponential backoff
// Exponential backoff = wait longer between each retry
async function makeRequestWithRetry(url, options = {}, maxRetries = 3) {
    // Attempt counter starts at 0
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            // Try making the request
            const response = await apiClient.get(url, options);
            return response.data;  // Success - return data
            
        } catch (error) {
            // Check if we should retry
            const shouldRetry = 
                attempt < maxRetries - 1 &&  // Not last attempt
                (
                    error.code === 'ECONNABORTED' ||  // Timeout
                    error.response?.status >= 500     // Server error (500, 502, 503, etc.)
                );
            
            if (shouldRetry) {
                // Calculate wait time: 1s, 2s, 4s, 8s, etc.
                // Math.pow(2, attempt) = 2^attempt (exponential growth)
                const waitTime = Math.pow(2, attempt) * 1000;
                
                console.log(\`Retry attempt \${attempt + 1} after \${waitTime}ms\`);
                
                // Wait before retrying
                // new Promise with setTimeout = delay execution
                await new Promise(resolve => setTimeout(resolve, waitTime));
                
            } else {
                // Don't retry - throw error
                throw error;
            }
        }
    }
}

// Usage in route
app.get('/api/external-data', async (req, res) => {
    try {
        // Will automatically retry on failure
        const data = await makeRequestWithRetry('/users');
        res.json(data);
    } catch (error) {
        console.error('All retry attempts failed:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});
      </code>
    </pre>

    <div class="explanation-box bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-orange-900 mb-3">⚠️ Common Pitfalls</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Exposing API Keys:</strong> Never commit .env files to Git (use .gitignore)</li>
        <li><strong>No Error Handling:</strong> Always assume external APIs can fail</li>
        <li><strong>Ignoring Rate Limits:</strong> Respect API quotas or get blocked</li>
        <li><strong>Synchronous Calls:</strong> Always use async/await, never block event loop</li>
        <li><strong>Missing Timeouts:</strong> Set timeouts to prevent infinite waiting</li>
        <li><strong>No Validation:</strong> Validate responses from external APIs (don't trust blindly)</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Understand how to make HTTP requests to external APIs using Axios",
    "Integrate AI services like Google Gemini and Anthropic Claude",
    "Implement payment processing with Stripe API",
    "Handle webhooks and real-time events from third-party services",
    "Apply best practices for API security, error handling, and retry logic",
  ],
  practiceInstructions: [
    "Set up environment variables for API keys in a .env file",
    "Create an endpoint that calls Google Gemini AI to generate text",
    "Implement error handling with try-catch blocks",
    "Add request timeout and retry logic for resilient API calls",
    "Test your API integration with different inputs and error scenarios",
  ],
  hints: [
    "Install axios: npm install axios",
    "Store API keys in .env file and use process.env.API_KEY",
    "Always use async/await when calling external APIs",
    "Set timeouts to prevent hanging requests: timeout: 10000",
    "Implement exponential backoff for retry logic",
  ],
  solution: `// Complete example with Gemini AI integration
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/ai/generate', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ 
            success: true,
            response: text 
        });
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            error: 'Failed to generate response' 
        });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});`,
};

export default lessonData;
