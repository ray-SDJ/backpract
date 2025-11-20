import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Node.js Cheat Sheet - Complete Reference",
  description:
    "Comprehensive cheat sheet covering JavaScript/Node.js string methods, array operations, objects, and Express.js backend methods.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <p>A complete reference guide for Node.js covering essential JavaScript methods and Express.js backend operations.</p>

    <h2>📝 String Methods</h2>
    
    <div class="code-block">
      <pre><code>const text = "Hello World";

// Case Conversion
text.toUpperCase()              // "HELLO WORLD"
text.toLowerCase()              // "hello world"

// Search & Check
text.length                     // 11
text.charAt(0)                  // 'H'
text.charCodeAt(0)              // 72 (Unicode value)
text.indexOf("World")           // 6
text.lastIndexOf("o")          // 7
text.includes("World")          // true
text.startsWith("Hello")        // true
text.endsWith("World")          // true

// Substring & Slice
text.substring(0, 5)            // "Hello"
text.substring(6)               // "World"
text.slice(0, 5)                // "Hello"
text.slice(-5)                  // "World" (from end)
text.substr(0, 5)               // "Hello" (deprecated)

// Replace
text.replace("World", "Node")   // "Hello Node"
text.replaceAll("l", "L")       // "HeLLo WorLd"
text.replace(/l/g, "L")         // "HeLLo WorLd" (regex)

// Splitting & Joining
text.split(" ")                 // ["Hello", "World"]
text.split("")                  // ["H", "e", "l", "l", "o", ...]
["a", "b", "c"].join("-")       // "a-b-c"

// Trimming
"  hello  ".trim()              // "hello"
"  hello  ".trimStart()         // "hello  "
"  hello  ".trimEnd()           // "  hello"

// Padding
"5".padStart(3, "0")            // "005"
"5".padEnd(3, "0")              // "500"

// Repeat
"ha".repeat(3)                  // "hahaha"

// Template Literals
const name = "Alice";
const age = 30;
\`Name: \${name}, Age: \${age}\`  // "Name: Alice, Age: 30"

// Other
text.concat(" !!!")             // "Hello World !!!"
text.match(/[A-Z]/g)           // ["H", "W"]
text.search(/World/)            // 6
text.localeCompare("Hello")    // 1 (comparison)</code></pre>
    </div>

    <h2>📋 Array Methods</h2>
    
    <div class="code-block">
      <pre><code>const nums = [1, 2, 3, 4, 5];

// Adding Elements
nums.push(6)                    // Add to end, returns new length
nums.unshift(0)                 // Add to start
nums.splice(2, 0, 1.5)         // Insert at index 2

// Removing Elements
nums.pop()                      // Remove from end, returns element
nums.shift()                    // Remove from start
nums.splice(2, 1)              // Remove 1 element at index 2

// Searching
nums.indexOf(3)                 // 2
nums.lastIndexOf(3)            // 2
nums.includes(3)                // true
nums.find(n => n > 3)          // 4 (first match)
nums.findIndex(n => n > 3)     // 3 (index of first match)

// Transformation
nums.map(n => n * 2)           // [2, 4, 6, 8, 10]
nums.filter(n => n > 2)        // [3, 4, 5]
nums.reduce((sum, n) => sum + n, 0)  // 15 (sum)
nums.flatMap(n => [n, n * 2])  // [1, 2, 2, 4, 3, 6, ...]

// Flattening
[[1, 2], [3, 4]].flat()        // [1, 2, 3, 4]
[[1, [2, [3]]]].flat(2)        // [1, 2, 3]

// Sorting & Reversing
nums.sort()                     // Sort as strings
nums.sort((a, b) => a - b)     // Sort numerically ascending
nums.sort((a, b) => b - a)     // Sort descending
nums.reverse()                  // Reverse in place

// Slicing & Joining
nums.slice(1, 3)               // [2, 3]
nums.slice(-2)                 // Last 2 elements
nums.join(", ")                // "1, 2, 3, 4, 5"

// Checking
nums.every(n => n > 0)         // true (all positive)
nums.some(n => n > 4)          // true (at least one > 4)

// Iteration
nums.forEach(n => console.log(n))
for (const num of nums) { }
for (const [i, num] of nums.entries()) { }

// Other
nums.length                     // 5
nums.concat([6, 7])            // [1, 2, 3, 4, 5, 6, 7]
Array.from("hello")            // ["h", "e", "l", "l", "o"]
Array.of(1, 2, 3)              // [1, 2, 3]
Array.isArray(nums)            // true
[...nums]                      // Spread operator (copy)

// ES2023
nums.at(-1)                    // Last element (5)
nums.findLast(n => n > 2)      // 5 (last match)
nums.toReversed()              // New reversed array
nums.toSorted()                // New sorted array
nums.toSpliced(1, 1, 99)       // New array with splice</code></pre>
    </div>

    <h2>🗺️ Object Methods</h2>
    
    <div class="code-block">
      <pre><code>const user = { name: "Alice", age: 30, city: "NYC" };

// Accessing Properties
user.name                       // "Alice"
user["age"]                     // 30
user?.email                     // undefined (optional chaining)

// Adding/Updating
user.email = "alice@email.com";
user["country"] = "USA";

// Removing
delete user.city;

// Checking
"name" in user                  // true
user.hasOwnProperty("age")      // true

// Keys, Values, Entries
Object.keys(user)               // ["name", "age", "email", ...]
Object.values(user)             // ["Alice", 30, "alice@email.com", ...]
Object.entries(user)            // [["name", "Alice"], ["age", 30], ...]

// Iteration
for (const key in user) { }
for (const [key, value] of Object.entries(user)) { }

// Merging Objects
const merged = { ...user, role: "admin" };
Object.assign({}, user, { role: "admin" });

// Object Methods
Object.freeze(user)             // Make immutable
Object.seal(user)               // Prevent adding/removing properties
Object.isFrozen(user)           // Check if frozen
Object.isSealed(user)           // Check if sealed

// Creating Objects
Object.create(prototype)
Object.fromEntries([["a", 1], ["b", 2]])  // {a: 1, b: 2}

// Destructuring
const { name, age } = user;
const { name: userName, age: userAge } = user;
const { email = "N/A" } = user;  // Default value</code></pre>
    </div>

    <h2>🎯 Set & Map</h2>
    
    <div class="code-block">
      <pre><code>// Set
const set = new Set([1, 2, 3, 4, 5]);

set.add(6);
set.has(3);                     // true
set.delete(1);
set.size;                       // Length
set.clear();

for (const value of set) { }
set.forEach(value => { });

// Set Operations
const a = new Set([1, 2, 3]);
const b = new Set([3, 4, 5]);

const union = new Set([...a, ...b]);
const intersection = new Set([...a].filter(x => b.has(x)));
const difference = new Set([...a].filter(x => !b.has(x)));

// Map
const map = new Map();

map.set("name", "Alice");
map.set("age", 30);
map.get("name");                // "Alice"
map.has("email");               // false
map.delete("age");
map.size;
map.clear();

// Iteration
for (const [key, value] of map) { }
map.forEach((value, key) => { });

map.keys();                     // Iterator of keys
map.values();                   // Iterator of values
map.entries();                  // Iterator of [key, value]

// From Object
const map = new Map(Object.entries(user));
const obj = Object.fromEntries(map);</code></pre>
    </div>

    <h2>🌐 Express.js Backend Methods</h2>
    
    <div class="code-block">
      <pre><code>const express = require('express');
const app = express();

// Middleware
app.use(express.json());                    // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded
app.use(express.static('public'));          // Serve static files
app.use(cors());                            // Enable CORS

// Routing
app.get('/api/users', (req, res) => { });
app.post('/api/users', (req, res) => { });
app.put('/api/users/:id', (req, res) => { });
app.patch('/api/users/:id', (req, res) => { });
app.delete('/api/users/:id', (req, res) => { });
app.all('/api/*', (req, res) => { });       // All methods

// Request Object
req.params.id                   // URL parameters
req.query.page                  // Query string (?page=1)
req.body                        // Request body (JSON)
req.headers['authorization']    // Headers
req.cookies.session_id          // Cookies
req.method                      // HTTP method
req.path                        // URL path
req.hostname                    // Host name
req.ip                          // Client IP
req.protocol                    // http or https
req.secure                      // true if HTTPS
req.originalUrl                 // Full URL with query
req.get('Content-Type')         // Get header

// Response Object
res.status(200)                 // Set status code
res.json({ message: "Success" }) // Send JSON
res.send("Hello")               // Send response
res.sendFile('/path/to/file')   // Send file
res.download('/path/to/file')   // Download file
res.redirect('/login')          // Redirect
res.render('view', data)        // Render template
res.cookie('name', 'value')     // Set cookie
res.clearCookie('name')         // Clear cookie
res.set('Content-Type', 'text/html') // Set header
res.end()                       // End response

// Chaining
res.status(201).json({ created: true });

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Router
const router = express.Router();
router.get('/', (req, res) => { });
router.post('/', (req, res) => { });
app.use('/api/users', router);

// Async Error Handling
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
}));</code></pre>
    </div>

    <h2>🗄️ Mongoose (MongoDB) Methods</h2>
    
    <div class="code-block">
      <pre><code>const mongoose = require('mongoose');

// Schema Definition
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 0 },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Create
const user = new User({ username: 'alice', email: 'alice@email.com' });
await user.save();

await User.create({ username: 'bob', email: 'bob@email.com' });

await User.insertMany([
  { username: 'charlie', email: 'charlie@email.com' },
  { username: 'david', email: 'david@email.com' }
]);

// Read
await User.find();                              // All documents
await User.findById(id);                        // By ID
await User.findOne({ username: 'alice' });      // First match

// Filtering
await User.find({ age: { $gte: 18 } });        // age >= 18
await User.find({ age: { $gt: 18, $lt: 65 } }); // 18 < age < 65
await User.find({ username: /^a/i });          // Regex match
await User.find({ email: { $in: ['a@e.com', 'b@e.com'] } });

// Sorting & Limiting
await User.find().sort({ age: -1 });           // Descending
await User.find().limit(10);                    // First 10
await User.find().skip(10).limit(10);          // Pagination

// Projection
await User.find().select('username email');     // Only these fields
await User.find().select('-password');          // Exclude password

// Update
await User.updateOne({ _id: id }, { age: 31 });
await User.updateMany({ age: { $lt: 18 } }, { status: 'minor' });
await User.findByIdAndUpdate(id, { age: 31 }, { new: true });
await User.findOneAndUpdate({ username: 'alice' }, { age: 31 });

// Delete
await User.deleteOne({ _id: id });
await User.deleteMany({ age: { $lt: 18 } });
await User.findByIdAndDelete(id);
await User.findOneAndDelete({ username: 'alice' });

// Count
await User.countDocuments();
await User.countDocuments({ age: { $gte: 18 } });

// Aggregation
await User.aggregate([
  { $match: { age: { $gte: 18 } } },
  { $group: { _id: '$country', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);</code></pre>
    </div>

    <h2>🔐 JWT & Authentication</h2>
    
    <div class="code-block">
      <pre><code>const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Password Hashing
const hashedPassword = await bcrypt.hash('password123', 10);
const isValid = await bcrypt.compare('password123', hashedPassword);

// JWT Token Generation
const token = jwt.sign(
  { userId: user._id, username: user.username },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// JWT Verification
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded.userId);
} catch (err) {
  console.error('Invalid token');
}

// Auth Middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Protected Route
app.get('/api/protected', auth, (req, res) => {
  res.json({ message: 'Authenticated', user: req.user });
});</code></pre>
    </div>

    <h2>📅 Date & Time</h2>
    
    <div class="code-block">
      <pre><code>// Current date/time
const now = new Date();
const timestamp = Date.now();           // Milliseconds since epoch

// Creating dates
const date = new Date('2024-12-25');
const date = new Date(2024, 11, 25);    // Month is 0-indexed
const date = new Date(2024, 11, 25, 10, 30, 0);

// Getting components
date.getFullYear()              // 2024
date.getMonth()                 // 11 (0-indexed)
date.getDate()                  // 25 (day of month)
date.getDay()                   // 0-6 (0 = Sunday)
date.getHours()
date.getMinutes()
date.getSeconds()
date.getTime()                  // Milliseconds since epoch

// Setting components
date.setFullYear(2025)
date.setMonth(0)
date.setDate(1)

// Formatting
date.toISOString()              // "2024-12-25T10:30:00.000Z"
date.toLocaleDateString()       // "12/25/2024"
date.toLocaleTimeString()       // "10:30:00 AM"
date.toLocaleString()           // "12/25/2024, 10:30:00 AM"

// Arithmetic
const tomorrow = new Date(date.getTime() + 24 * 60 * 60 * 1000);
const nextWeek = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);

// Day.js (recommended library)
const dayjs = require('dayjs');
dayjs().format('YYYY-MM-DD')
dayjs().add(1, 'day')
dayjs().subtract(1, 'week')
dayjs().isAfter(otherDate)
dayjs().isBefore(otherDate)</code></pre>
    </div>

    <h2>🔍 Regular Expressions</h2>
    
    <div class="code-block">
      <pre><code>// Creating regex
const regex = /pattern/flags;
const regex = new RegExp('pattern', 'flags');

// Testing
/hello/i.test('Hello World')    // true (case-insensitive)

// Matching
const match = 'Price: 100'.match(/\\d+/);
match[0]                        // "100"

'Price: 100, Tax: 20'.match(/\\d+/g)  // ["100", "20"] (global)

// Replace
'hello world'.replace(/world/i, 'Node')  // "hello Node"
'a1b2c3'.replace(/\\d/g, 'X')   // "aXbXcX"
'hello'.replace(/l/g, (match) => match.toUpperCase())

// Split
'a,b;c'.split(/[,;]/)           // ["a", "b", "c"]

// Common patterns
/\\d/                            // Digit
/\\D/                            // Non-digit
/\\w/                            // Word character
/\\W/                            // Non-word
/\\s/                            // Whitespace
/\\S/                            // Non-whitespace
/./                             // Any character
/^/                             // Start
/$/                             // End
/()/                            // Capture group
/(?:)/                          // Non-capturing group

// Flags
/pattern/i                      // Case-insensitive
/pattern/g                      // Global (all matches)
/pattern/m                      // Multiline</code></pre>
    </div>

    <h2>💡 Best Practices</h2>
    
    <div class="explanation-list">
      <ul>
        <li><strong>Use const/let:</strong> Never use var, prefer const by default</li>
        <li><strong>Arrow functions:</strong> Use for cleaner syntax and lexical this</li>
        <li><strong>Async/await:</strong> Prefer over .then() for asynchronous code</li>
        <li><strong>Destructuring:</strong> Extract values from arrays and objects</li>
        <li><strong>Spread operator:</strong> Use ... for copying and merging</li>
        <li><strong>Template literals:</strong> Use backticks for string interpolation</li>
        <li><strong>Error handling:</strong> Always use try/catch with async/await</li>
        <li><strong>Environment variables:</strong> Use dotenv for configuration</li>
      </ul>
    </div>
  </div>`,
  objectives: [
    "Master JavaScript string manipulation methods",
    "Understand array operations and higher-order functions",
    "Learn object manipulation and destructuring",
    "Use Express.js for building REST APIs",
    "Work with Mongoose for MongoDB operations",
  ],
  practiceInstructions: [
    "Practice string methods on various text inputs",
    "Use array methods like map, filter, and reduce",
    "Manipulate objects with spread and destructuring",
    "Build Express routes with different HTTP methods",
    "Implement CRUD operations with Mongoose",
  ],
  hints: [
    "Array methods like map and filter don't modify the original array",
    "Use async/await for cleaner asynchronous code",
    "Express middleware runs in the order it's added",
    "Mongoose methods return promises - use await or .then()",
    "JWT tokens should be stored securely on the client side",
  ],
  solution: `// String manipulation
const text = "hello world";
console.log(text.toUpperCase());  // "HELLO WORLD"
const words = text.split(" ");

// Array operations
const nums = [1, 2, 3, 4, 5];
const doubled = nums.map(n => n * 2);
const evens = nums.filter(n => n % 2 === 0);
const sum = nums.reduce((acc, n) => acc + n, 0);

// Object destructuring
const user = { name: "Alice", age: 30 };
const { name, age } = user;

// Express route
app.post('/api/users', async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

// Mongoose query
const users = await User.find({ age: { $gte: 18 } })
  .sort({ createdAt: -1 })
  .limit(10);`,
};
