import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "NoSQL & MongoDB Query Language",
  description:
    "Master MongoDB Query Language (MQL) for NoSQL databases. Learn document-based data modeling, CRUD operations, aggregation pipelines, and indexing.",
  difficulty: "Beginner",
  objectives: [
    "Understand NoSQL document-based data models",
    "Write MongoDB queries to find, insert, update, and delete documents",
    "Use MongoDB operators for filtering and comparison",
    "Build aggregation pipelines for complex data transformations",
    "Implement indexing strategies for query optimization",
  ],
  content: `<div class="lesson-content">
    <h2>🍃 Introduction to MongoDB & NoSQL</h2>
    <p>
      MongoDB is a document-oriented NoSQL database that stores data in flexible, JSON-like documents. 
      Unlike SQL databases with tables and rows, MongoDB uses collections and documents.
    </p>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🔑 Key Concepts</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Database:</strong> Container for collections (like SQL database)</li>
        <li><strong>Collection:</strong> Group of documents (like SQL table)</li>
        <li><strong>Document:</strong> JSON-like object with key-value pairs (like SQL row)</li>
        <li><strong>Field:</strong> Key-value pair in a document (like SQL column)</li>
        <li><strong>_id:</strong> Unique identifier automatically created for each document</li>
        <li><strong>Embedded Documents:</strong> Documents nested within other documents</li>
      </ul>
    </div>

    <h2>📝 Document Structure Example</h2>
    <pre class="code-block">
      <code>
// MongoDB document (JSON-like)
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "username": "johndoe",
  "email": "john@example.com",
  "age": 28,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  },
  "interests": ["coding", "music", "travel"],
  "created_at": ISODate("2024-01-15T10:30:00Z")
}
      </code>
    </pre>

    <h2>📖 Part 1: Basic Find Queries</h2>
    <p>Use <code>find()</code> to retrieve documents from a collection.</p>

    <pre class="code-block">
      <code>
// Find all documents
db.users.find()

// Find with pretty formatting
db.users.find().pretty()

// Find with filter (equality)
db.users.find({ country: "USA" })

// Find one document
db.users.findOne({ username: "johndoe" })

// Find with multiple conditions (AND)
db.users.find({
  country: "USA",
  age: { $gte: 18 }
})

// Find with OR condition
db.users.find({
  $or: [
    { country: "USA" },
    { country: "Canada" }
  ]
})

// Select specific fields (projection)
db.users.find(
  { country: "USA" },
  { username: 1, email: 1, _id: 0 }
)

// Count documents
db.users.countDocuments({ country: "USA" })
      </code>
    </pre>

    <h2>🔍 Part 2: Query Operators</h2>
    <p>MongoDB provides powerful operators for filtering and comparison.</p>

    <pre class="code-block">
      <code>
// Comparison operators
db.products.find({ price: { $gt: 100 } })        // Greater than
db.products.find({ price: { $gte: 100 } })       // Greater than or equal
db.products.find({ price: { $lt: 50 } })         // Less than
db.products.find({ price: { $lte: 50 } })        // Less than or equal
db.products.find({ price: { $ne: 99.99 } })      // Not equal
db.products.find({ price: { $in: [10, 20, 30] } }) // In array
db.products.find({ price: { $nin: [10, 20] } })  // Not in array

// Range query
db.products.find({
  price: { $gte: 50, $lte: 200 }
})

// Pattern matching with regex
db.users.find({ email: /gmail.com$/ })
db.products.find({ name: /^iPhone/ })

// Array operators
db.users.find({ interests: "coding" })           // Contains element
db.users.find({ interests: { $all: ["coding", "music"] } }) // Contains all
db.users.find({ interests: { $size: 3 } })       // Array size
db.users.find({ "tags.0": "featured" })          // Array element at index

// Existence checks
db.users.find({ phone: { $exists: true } })
db.users.find({ phone: { $exists: false } })

// Type checks
db.users.find({ age: { $type: "number" } })
db.users.find({ age: { $type: "string" } })

// Nested document queries
db.users.find({ "address.city": "New York" })
db.users.find({ "address.country": "USA", "address.city": "Los Angeles" })
      </code>
    </pre>

    <h2>📊 Part 3: Sorting, Limiting, and Skipping</h2>
    <p>Control the order and number of results.</p>

    <pre class="code-block">
      <code>
// Sort ascending (1) or descending (-1)
db.users.find().sort({ age: 1 })               // Ascending
db.users.find().sort({ age: -1 })              // Descending

// Sort by multiple fields
db.users.find().sort({ country: 1, age: -1 })

// Limit results
db.products.find().sort({ price: -1 }).limit(10)

// Skip results (pagination)
db.users.find()
  .sort({ _id: 1 })
  .skip(20)
  .limit(10)  // Skip first 20, get next 10

// Count with filter
db.users.find({ country: "USA" }).count()
      </code>
    </pre>

    <h2>✍️ Part 4: Inserting Documents</h2>
    <p>Add new documents to collections.</p>

    <pre class="code-block">
      <code>
// Insert single document
db.users.insertOne({
  username: "janedoe",
  email: "jane@example.com",
  age: 25,
  country: "Canada",
  interests: ["photography", "hiking"],
  created_at: new Date()
})

// Insert multiple documents
db.products.insertMany([
  {
    name: "Laptop",
    category: "Electronics",
    price: 999.99,
    stock: 50
  },
  {
    name: "Mouse",
    category: "Accessories",
    price: 29.99,
    stock: 200
  },
  {
    name: "Keyboard",
    category: "Accessories",
    price: 79.99,
    stock: 150
  }
])

// Insert with custom _id
db.users.insertOne({
  _id: "user_12345",
  username: "customid",
  email: "custom@example.com"
})
      </code>
    </pre>

    <h2>🔄 Part 5: Updating Documents</h2>
    <p>Modify existing documents in collections.</p>

    <pre class="code-block">
      <code>
// Update one document
db.users.updateOne(
  { username: "johndoe" },
  { $set: { email: "newemail@example.com" } }
)

// Update multiple documents
db.products.updateMany(
  { category: "Electronics" },
  { $set: { featured: true } }
)

// Update operators
db.users.updateOne(
  { username: "johndoe" },
  {
    $set: { email: "new@example.com" },    // Set field
    $unset: { temp_field: "" },            // Remove field
    $inc: { age: 1 },                      // Increment number
    $push: { interests: "gaming" },        // Add to array
    $pull: { interests: "music" },         // Remove from array
    $addToSet: { tags: "verified" }        // Add to array (no duplicates)
  }
)

// Update with array operators
db.users.updateOne(
  { username: "johndoe" },
  {
    $push: { 
      orders: {
        $each: [
          { id: 1, total: 99.99 },
          { id: 2, total: 149.99 }
        ]
      }
    }
  }
)

// Update nested documents
db.users.updateOne(
  { username: "johndoe" },
  { $set: { "address.city": "San Francisco" } }
)

// Replace entire document
db.users.replaceOne(
  { username: "johndoe" },
  {
    username: "johndoe",
    email: "john@new.com",
    country: "USA"
  }
)

// Upsert (insert if not exists, update if exists)
db.users.updateOne(
  { username: "newuser" },
  { $set: { email: "new@example.com", country: "UK" } },
  { upsert: true }
)
      </code>
    </pre>

    <h2>🗑️ Part 6: Deleting Documents</h2>
    <p>Remove documents from collections.</p>

    <pre class="code-block">
      <code>
// Delete one document
db.users.deleteOne({ username: "johndoe" })

// Delete multiple documents
db.products.deleteMany({ stock: 0 })

// Delete with filter
db.users.deleteMany({
  country: "USA",
  created_at: { $lt: new Date("2020-01-01") }
})

// Delete all documents in collection
db.temp_data.deleteMany({})

// Drop entire collection
db.temp_data.drop()
      </code>
    </pre>

    <h2>📊 Part 7: Aggregation Pipeline</h2>
    <p>Powerful framework for data transformation and analysis.</p>

    <pre class="code-block">
      <code>
// Basic aggregation: count by country
db.users.aggregate([
  {
    $group: {
      _id: "$country",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } }
])

// Multiple stages
db.orders.aggregate([
  // Stage 1: Filter
  { $match: { status: "completed" } },
  
  // Stage 2: Group and calculate
  {
    $group: {
      _id: "$user_id",
      total_orders: { $sum: 1 },
      total_spent: { $sum: "$total" },
      avg_order: { $avg: "$total" }
    }
  },
  
  // Stage 3: Filter groups
  { $match: { total_orders: { $gte: 5 } } },
  
  // Stage 4: Sort
  { $sort: { total_spent: -1 } },
  
  // Stage 5: Limit
  { $limit: 10 }
])

// Lookup (join with another collection)
db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user_info"
    }
  },
  { $unwind: "$user_info" },
  {
    $project: {
      order_date: 1,
      total: 1,
      "user_info.username": 1,
      "user_info.email": 1
    }
  }
])

// Complex aggregation with multiple operations
db.products.aggregate([
  { $match: { category: "Electronics" } },
  {
    $group: {
      _id: "$brand",
      product_count: { $sum: 1 },
      avg_price: { $avg: "$price" },
      min_price: { $min: "$price" },
      max_price: { $max: "$price" },
      total_stock: { $sum: "$stock" }
    }
  },
  {
    $project: {
      brand: "$_id",
      product_count: 1,
      avg_price: { $round: ["$avg_price", 2] },
      price_range: {
        $concat: [
          "$", { $toString: "$min_price" },
          " - $", { $toString: "$max_price" }
        ]
      },
      total_stock: 1
    }
  },
  { $sort: { product_count: -1 } }
])
      </code>
    </pre>

    <h2>🚀 Part 8: Indexing</h2>
    <p>Create indexes to speed up queries.</p>

    <pre class="code-block">
      <code>
// Create single field index
db.users.createIndex({ email: 1 })

// Create compound index
db.users.createIndex({ country: 1, age: -1 })

// Create unique index
db.users.createIndex({ username: 1 }, { unique: true })

// Create text index for search
db.products.createIndex({ name: "text", description: "text" })

// Use text search
db.products.find({ $text: { $search: "laptop gaming" } })

// List all indexes
db.users.getIndexes()

// Drop index
db.users.dropIndex("email_1")

// Explain query (see index usage)
db.users.find({ country: "USA" }).explain("executionStats")
      </code>
    </pre>

    <h2>🎯 Practice: MongoDB with Countries Data</h2>
    <p>Let's practice MongoDB queries with our Countries database!</p>

    <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-3">📊 Collections Structure</h4>
      <pre class="code-block">
        <code>
// countries collection
{
  "_id": ObjectId("..."),
  "name": "Japan",
  "code": "JP",
  "capital": "Tokyo",
  "continent": "Asia",
  "population": 125000000,
  "languages": ["Japanese"],
  "cities": [
    { "name": "Tokyo", "population": 13960000, "isCapital": true },
    { "name": "Osaka", "population": 2750000, "isCapital": false }
  ]
}
        </code>
      </pre>
    </div>

    <h3>Practice Task 1: Find All Asian Countries</h3>
    <pre class="code-block">
      <code>
// Get all countries in Asia, sorted by population
db.countries.find(
  { continent: "Asia" },
  { name: 1, capital: 1, population: 1, _id: 0 }
).sort({ population: -1 })
      </code>
    </pre>

    <h3>Practice Task 2: Find Countries with Large Populations</h3>
    <pre class="code-block">
      <code>
// Find countries with population over 100 million
db.countries.find({
  population: { $gte: 100000000 }
}).sort({ population: -1 })
      </code>
    </pre>

    <h3>Practice Task 3: Find Countries by Language</h3>
    <pre class="code-block">
      <code>
// Find all countries where Spanish is spoken
db.countries.find({
  languages: "Spanish"
}, {
  name: 1,
  capital: 1,
  population: 1
})
      </code>
    </pre>

    <h3>Practice Task 4: Aggregate Countries by Continent</h3>
    <pre class="code-block">
      <code>
// Count countries and total population per continent
db.countries.aggregate([
  {
    $group: {
      _id: "$continent",
      country_count: { $sum: 1 },
      total_population: { $sum: "$population" },
      avg_population: { $avg: "$population" }
    }
  },
  { $sort: { total_population: -1 } }
])
      </code>
    </pre>

    <h3>Practice Task 5: Find Capital Cities</h3>
    <pre class="code-block">
      <code>
// Get all capital cities with their country info
db.countries.aggregate([
  { $unwind: "$cities" },
  { $match: { "cities.isCapital": true } },
  {
    $project: {
      country: "$name",
      capital: "$cities.name",
      population: "$cities.population",
      continent: 1
    }
  },
  { $sort: { population: -1 } }
])
      </code>
    </pre>

    <h3>Practice Task 6: Update Country Data</h3>
    <pre class="code-block">
      <code>
// Add a new city to Japan
db.countries.updateOne(
  { name: "Japan" },
  {
    $push: {
      cities: {
        name: "Kyoto",
        population: 1475000,
        isCapital: false
      }
    }
  }
)

// Update population
db.countries.updateOne(
  { name: "USA" },
  { $set: { population: 335000000 } }
)
      </code>
    </pre>

    <h3>Practice Task 7: Complex Aggregation</h3>
    <pre class="code-block">
      <code>
// Find total city population per continent
db.countries.aggregate([
  { $unwind: "$cities" },
  {
    $group: {
      _id: "$continent",
      total_city_population: { $sum: "$cities.population" },
      city_count: { $sum: 1 },
      avg_city_size: { $avg: "$cities.population" }
    }
  },
  {
    $project: {
      continent: "$_id",
      total_city_population: 1,
      city_count: 1,
      avg_city_size: { $round: ["$avg_city_size", 0] }
    }
  },
  { $sort: { total_city_population: -1 } }
])
      </code>
    </pre>

    <div class="explanation-box bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-yellow-900 mb-3">💪 Challenge Exercises</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Challenge 1:</strong> Find countries that have more than 3 cities in their cities array</li>
        <li><strong>Challenge 2:</strong> Calculate the average population of capital cities vs non-capital cities</li>
        <li><strong>Challenge 3:</strong> Find the continent with the most languages spoken</li>
        <li><strong>Challenge 4:</strong> Create an aggregation that shows city population as a percentage of country population</li>
      </ul>
    </div>

    <div class="explanation-box bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-purple-900 mb-3">✅ MongoDB Best Practices</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Design for queries:</strong> Structure documents based on how you'll query them</li>
        <li><strong>Embed related data:</strong> Use embedded documents for 1-to-few relationships</li>
        <li><strong>Use references:</strong> Use references for 1-to-many or many-to-many relationships</li>
        <li><strong>Index frequently queried fields:</strong> Create indexes on fields used in queries</li>
        <li><strong>Use aggregation pipelines:</strong> For complex data transformations and analytics</li>
        <li><strong>Avoid deep nesting:</strong> Keep document structure relatively flat</li>
        <li><strong>Use projection:</strong> Only return fields you need to reduce network traffic</li>
      </ul>
    </div>

    <h2>🔄 SQL vs MongoDB Comparison</h2>
    <div class="explanation-box bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <table class="min-w-full">
        <thead>
          <tr>
            <th class="px-4 py-2 border">SQL</th>
            <th class="px-4 py-2 border">MongoDB</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="px-4 py-2 border">Database</td>
            <td class="px-4 py-2 border">Database</td>
          </tr>
          <tr>
            <td class="px-4 py-2 border">Table</td>
            <td class="px-4 py-2 border">Collection</td>
          </tr>
          <tr>
            <td class="px-4 py-2 border">Row</td>
            <td class="px-4 py-2 border">Document</td>
          </tr>
          <tr>
            <td class="px-4 py-2 border">Column</td>
            <td class="px-4 py-2 border">Field</td>
          </tr>
          <tr>
            <td class="px-4 py-2 border">SELECT</td>
            <td class="px-4 py-2 border">find()</td>
          </tr>
          <tr>
            <td class="px-4 py-2 border">INSERT</td>
            <td class="px-4 py-2 border">insertOne() / insertMany()</td>
          </tr>
          <tr>
            <td class="px-4 py-2 border">UPDATE</td>
            <td class="px-4 py-2 border">updateOne() / updateMany()</td>
          </tr>
          <tr>
            <td class="px-4 py-2 border">DELETE</td>
            <td class="px-4 py-2 border">deleteOne() / deleteMany()</td>
          </tr>
          <tr>
            <td class="px-4 py-2 border">JOIN</td>
            <td class="px-4 py-2 border">$lookup (aggregation)</td>
          </tr>
          <tr>
            <td class="px-4 py-2 border">GROUP BY</td>
            <td class="px-4 py-2 border">$group (aggregation)</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`,
  practiceInstructions: [
    "Write a find() query to get all documents with a specific field value",
    "Use comparison operators ($gt, $lt, $in) to filter documents",
    "Create an aggregation pipeline with $group and $match stages",
    "Practice insertOne(), updateOne(), and deleteOne() operations",
    "Use $lookup to join data from different collections",
  ],
  hints: [
    "Use dot notation to query nested document fields: 'address.city'",
    "Aggregation pipelines process documents in stages",
    "$match should be used early in the pipeline for better performance",
    "Use $unwind to deconstruct array fields",
    "Create indexes on fields you query frequently",
  ],
  solution: `// Complete MongoDB practice solution

// 1. Find with filter
db.users.find({ country: "USA" })

// 2. Complex query with operators
db.products.find({
  $and: [
    { price: { $gte: 50, $lte: 500 } },
    { category: { $in: ["Electronics", "Computers"] } },
    { stock: { $gt: 0 } }
  ]
}).sort({ price: -1 })

// 3. Aggregation pipeline
db.orders.aggregate([
  { $match: { status: "completed" } },
  {
    $group: {
      _id: "$user_id",
      total_orders: { $sum: 1 },
      total_spent: { $sum: "$total" },
      avg_order: { $avg: "$total" }
    }
  },
  { $match: { total_orders: { $gte: 5 } } },
  { $sort: { total_spent: -1 } },
  { $limit: 10 }
])

// 4. CRUD operations
db.users.insertOne({
  username: "testuser",
  email: "test@example.com",
  country: "USA",
  interests: ["coding", "gaming"]
})

db.users.updateOne(
  { username: "testuser" },
  {
    $set: { last_login: new Date() },
    $push: { interests: "music" }
  }
)

db.users.deleteOne({ username: "testuser" })

// 5. Lookup (join)
db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user_details"
    }
  },
  { $unwind: "$user_details" },
  {
    $project: {
      order_date: 1,
      total: 1,
      "user_details.username": 1,
      "user_details.email": 1
    }
  }
])`,
};

export default lessonData;
