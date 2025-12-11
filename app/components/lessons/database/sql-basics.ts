import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "SQL Fundamentals & Queries",
  description:
    "Master SQL (Structured Query Language) for relational databases. Learn to query, insert, update, and delete data using PostgreSQL/MySQL.",
  difficulty: "Beginner",
  objectives: [
    "Understand relational database concepts and SQL syntax",
    "Write SELECT queries with filtering, sorting, and joins",
    "Insert, update, and delete data with SQL commands",
    "Use aggregate functions and GROUP BY clauses",
    "Create and manage database tables and relationships",
  ],
  content: `<div class="lesson-content">
    <h2>📊 Introduction to SQL</h2>
    <p>
      SQL (Structured Query Language) is the standard language for working with relational databases. 
      It's used by PostgreSQL, MySQL, Oracle, SQL Server, SQLite, and many other database systems.
    </p>

    <div class="explanation-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-blue-900 mb-3">🔑 Key Concepts</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Tables:</strong> Data stored in rows and columns (like spreadsheets)</li>
        <li><strong>Schemas:</strong> Structure defining table columns and data types</li>
        <li><strong>Primary Key:</strong> Unique identifier for each row</li>
        <li><strong>Foreign Key:</strong> Reference to data in another table</li>
        <li><strong>Relationships:</strong> One-to-Many, Many-to-Many connections</li>
      </ul>
    </div>

    <h2>📖 Part 1: Basic SELECT Queries</h2>
    <p>The SELECT statement retrieves data from one or more tables.</p>

    <pre class="code-block">
      <code>
-- Select all columns from a table
SELECT * FROM users;

-- Select specific columns
SELECT id, username, email FROM users;

-- Select with alias (rename columns)
SELECT 
  id AS user_id,
  username AS name,
  email AS contact_email
FROM users;

-- Select distinct values (no duplicates)
SELECT DISTINCT country FROM users;

-- Count total rows
SELECT COUNT(*) FROM users;
      </code>
    </pre>

    <h2>🔍 Part 2: Filtering with WHERE</h2>
    <p>Use WHERE clause to filter rows based on conditions.</p>

    <pre class="code-block">
      <code>
-- Simple equality
SELECT * FROM users WHERE country = 'USA';

-- Comparison operators
SELECT * FROM products WHERE price > 100;
SELECT * FROM products WHERE price <= 50;
SELECT * FROM products WHERE stock != 0;

-- Multiple conditions with AND/OR
SELECT * FROM users 
WHERE country = 'USA' AND age >= 18;

SELECT * FROM products 
WHERE category = 'Electronics' OR category = 'Computers';

-- Pattern matching with LIKE
SELECT * FROM users WHERE email LIKE '%@gmail.com';
SELECT * FROM products WHERE name LIKE 'iPhone%';

-- IN operator (match multiple values)
SELECT * FROM users 
WHERE country IN ('USA', 'Canada', 'Mexico');

-- BETWEEN operator (range)
SELECT * FROM products 
WHERE price BETWEEN 50 AND 200;

-- NULL checks
SELECT * FROM users WHERE phone IS NULL;
SELECT * FROM users WHERE phone IS NOT NULL;
      </code>
    </pre>

    <h2>📊 Part 3: Sorting and Limiting</h2>
    <p>Control the order and number of results.</p>

    <pre class="code-block">
      <code>
-- Sort ascending (A-Z, 0-9)
SELECT * FROM users ORDER BY username ASC;

-- Sort descending (Z-A, 9-0)
SELECT * FROM products ORDER BY price DESC;

-- Multiple sort columns
SELECT * FROM users 
ORDER BY country ASC, age DESC;

-- Limit number of results
SELECT * FROM products 
ORDER BY price DESC 
LIMIT 10;

-- Pagination with OFFSET
SELECT * FROM users 
ORDER BY id 
LIMIT 20 OFFSET 40;  -- Skip first 40, get next 20
      </code>
    </pre>

    <h2>🔢 Part 4: Aggregate Functions</h2>
    <p>Perform calculations on groups of rows.</p>

    <pre class="code-block">
      <code>
-- COUNT: Number of rows
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(phone) FROM users;  -- Only non-NULL values

-- SUM: Total of numeric column
SELECT SUM(price) AS total_revenue FROM orders;

-- AVG: Average value
SELECT AVG(price) AS average_price FROM products;

-- MIN and MAX: Smallest and largest values
SELECT MIN(price) AS cheapest FROM products;
SELECT MAX(price) AS most_expensive FROM products;

-- GROUP BY: Aggregate by category
SELECT 
  country,
  COUNT(*) AS user_count
FROM users
GROUP BY country
ORDER BY user_count DESC;

-- GROUP BY with multiple aggregates
SELECT 
  category,
  COUNT(*) AS product_count,
  AVG(price) AS avg_price,
  MIN(price) AS min_price,
  MAX(price) AS max_price
FROM products
GROUP BY category;

-- HAVING: Filter grouped results
SELECT 
  country,
  COUNT(*) AS user_count
FROM users
GROUP BY country
HAVING COUNT(*) > 100
ORDER BY user_count DESC;
      </code>
    </pre>

    <h2>🔗 Part 5: Joining Tables</h2>
    <p>Combine data from multiple tables based on relationships.</p>

    <pre class="code-block">
      <code>
-- INNER JOIN: Only matching rows from both tables
SELECT 
  users.username,
  orders.order_date,
  orders.total
FROM users
INNER JOIN orders ON users.id = orders.user_id;

-- LEFT JOIN: All rows from left table, matching from right
SELECT 
  users.username,
  orders.order_date
FROM users
LEFT JOIN orders ON users.id = orders.user_id;

-- Multiple joins
SELECT 
  users.username,
  orders.order_date,
  products.name AS product_name,
  order_items.quantity
FROM users
INNER JOIN orders ON users.id = orders.user_id
INNER JOIN order_items ON orders.id = order_items.order_id
INNER JOIN products ON order_items.product_id = products.id;

-- Join with WHERE
SELECT 
  users.username,
  COUNT(orders.id) AS order_count
FROM users
LEFT JOIN orders ON users.id = orders.user_id
WHERE users.country = 'USA'
GROUP BY users.id, users.username
HAVING COUNT(orders.id) > 5;
      </code>
    </pre>

    <h2>✍️ Part 6: Inserting Data</h2>
    <p>Add new rows to tables.</p>

    <pre class="code-block">
      <code>
-- Insert single row
INSERT INTO users (username, email, age, country)
VALUES ('johndoe', 'john@example.com', 28, 'USA');

-- Insert multiple rows
INSERT INTO products (name, category, price, stock)
VALUES 
  ('Laptop', 'Electronics', 999.99, 50),
  ('Mouse', 'Accessories', 29.99, 200),
  ('Keyboard', 'Accessories', 79.99, 150);

-- Insert with returning the new row
INSERT INTO users (username, email)
VALUES ('jane', 'jane@example.com')
RETURNING id, username;

-- Insert from SELECT
INSERT INTO premium_users (user_id, username)
SELECT id, username FROM users WHERE age >= 18;
      </code>
    </pre>

    <h2>🔄 Part 7: Updating Data</h2>
    <p>Modify existing rows in tables.</p>

    <pre class="code-block">
      <code>
-- Update single column
UPDATE users 
SET email = 'newemail@example.com' 
WHERE id = 1;

-- Update multiple columns
UPDATE products 
SET price = 899.99, stock = 75 
WHERE id = 10;

-- Update with calculation
UPDATE products 
SET price = price * 1.1 
WHERE category = 'Electronics';

-- Update based on join
UPDATE users 
SET premium = true 
WHERE id IN (
  SELECT user_id FROM orders 
  GROUP BY user_id 
  HAVING COUNT(*) > 10
);

-- Update with RETURNING
UPDATE users 
SET last_login = NOW() 
WHERE id = 5
RETURNING id, username, last_login;
      </code>
    </pre>

    <h2>🗑️ Part 8: Deleting Data</h2>
    <p>Remove rows from tables.</p>

    <pre class="code-block">
      <code>
-- Delete specific rows
DELETE FROM users WHERE id = 10;

-- Delete with multiple conditions
DELETE FROM products 
WHERE stock = 0 AND discontinued = true;

-- Delete with subquery
DELETE FROM order_items 
WHERE order_id IN (
  SELECT id FROM orders 
  WHERE created_at < '2020-01-01'
);

-- Delete all rows (use with caution!)
DELETE FROM temp_data;

-- TRUNCATE (faster for deleting all rows)
TRUNCATE TABLE temp_data;
      </code>
    </pre>

    <h2>🏗️ Part 9: Creating Tables</h2>
    <p>Define database schema and table structure.</p>

    <pre class="code-block">
      <code>
-- Create basic table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  age INTEGER,
  country VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table with foreign key
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create junction table (many-to-many)
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create index for faster queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Alter table (add column)
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Alter table (modify column)
ALTER TABLE users ALTER COLUMN age SET NOT NULL;

-- Drop table
DROP TABLE IF EXISTS temp_table;
      </code>
    </pre>

    <h2>🎯 Practice: Using the Countries API Database</h2>
    <p>Let's practice SQL queries with our Countries database!</p>

    <div class="explanation-box bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-green-900 mb-3">📊 Database Schema</h4>
      <pre class="code-block">
        <code>
-- Countries table
countries (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100),
  code VARCHAR(3),
  capital VARCHAR(100),
  continent VARCHAR(50),
  population INTEGER
)

-- Cities table
cities (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100),
  population INTEGER,
  is_capital BOOLEAN,
  country_id INTEGER REFERENCES countries(id)
)

-- Languages table
languages (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100),
  native_name VARCHAR(100),
  iso_code VARCHAR(10),
  speakers INTEGER
)
        </code>
      </pre>
    </div>

    <h3>Practice Task 1: Find All European Countries</h3>
    <pre class="code-block">
      <code>
-- Get all countries in Europe, sorted by population
SELECT name, capital, population 
FROM countries 
WHERE continent = 'Europe' 
ORDER BY population DESC;
      </code>
    </pre>

    <h3>Practice Task 2: Find Capital Cities</h3>
    <pre class="code-block">
      <code>
-- Get all capital cities with their country names
SELECT 
  cities.name AS city_name,
  cities.population,
  countries.name AS country_name
FROM cities
INNER JOIN countries ON cities.country_id = countries.id
WHERE cities.is_capital = true
ORDER BY cities.population DESC;
      </code>
    </pre>

    <h3>Practice Task 3: Count Cities per Country</h3>
    <pre class="code-block">
      <code>
-- Count how many cities each country has
SELECT 
  countries.name,
  COUNT(cities.id) AS city_count,
  SUM(cities.population) AS total_city_population
FROM countries
LEFT JOIN cities ON countries.id = cities.country_id
GROUP BY countries.id, countries.name
ORDER BY city_count DESC;
      </code>
    </pre>

    <h3>Practice Task 4: Find Megacities</h3>
    <pre class="code-block">
      <code>
-- Find cities with population over 10 million
SELECT 
  cities.name,
  cities.population,
  countries.name AS country,
  countries.continent
FROM cities
INNER JOIN countries ON cities.country_id = countries.id
WHERE cities.population > 10000000
ORDER BY cities.population DESC;
      </code>
    </pre>

    <h3>Practice Task 5: Language Statistics by Continent</h3>
    <pre class="code-block">
      <code>
-- Total speakers per continent (requires language_countries junction table)
SELECT 
  countries.continent,
  languages.name AS language,
  SUM(languages.speakers) AS total_speakers
FROM languages
INNER JOIN language_countries ON languages.id = language_countries.language_id
INNER JOIN countries ON language_countries.country_id = countries.id
GROUP BY countries.continent, languages.name
HAVING SUM(languages.speakers) > 100000000
ORDER BY countries.continent, total_speakers DESC;
      </code>
    </pre>

    <div class="explanation-box bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-yellow-900 mb-3">💪 Challenge Exercises</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Challenge 1:</strong> Find countries with more than 3 cities in the database</li>
        <li><strong>Challenge 2:</strong> Calculate the average population of capital cities vs non-capital cities</li>
        <li><strong>Challenge 3:</strong> Find all countries where English is spoken, ordered by total population</li>
        <li><strong>Challenge 4:</strong> Create a query that shows the population density (total population / number of cities) per country</li>
      </ul>
    </div>

    <div class="explanation-box bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-purple-900 mb-3">✅ SQL Best Practices</h4>
      <ul class="explanation-list space-y-2">
        <li><strong>Use explicit column names</strong> instead of SELECT *</li>
        <li><strong>Always use WHERE</strong> when updating or deleting</li>
        <li><strong>Create indexes</strong> on frequently queried columns</li>
        <li><strong>Use transactions</strong> for multiple related operations</li>
        <li><strong>Avoid N+1 queries</strong> by using JOINs instead of multiple queries</li>
        <li><strong>Test queries</strong> with EXPLAIN to check performance</li>
      </ul>
    </div>
  </div>`,
  practiceInstructions: [
    "Write a SELECT query to get all users from a specific country",
    "Use WHERE with multiple conditions (AND/OR)",
    "Create a query with GROUP BY and aggregate functions",
    "Write a JOIN query to combine data from two tables",
    "Practice INSERT, UPDATE, and DELETE statements",
  ],
  hints: [
    "Use WHERE to filter rows based on conditions",
    "Aggregate functions work with GROUP BY for summaries",
    "INNER JOIN requires matching values in both tables",
    "Always test DELETE and UPDATE with SELECT first",
    "Use LIMIT and OFFSET for pagination",
  ],
  solution: `-- Complete SQL practice solution

-- 1. Select users from USA
SELECT * FROM users WHERE country = 'USA';

-- 2. Complex WHERE with AND/OR
SELECT * FROM products 
WHERE (category = 'Electronics' OR category = 'Computers')
  AND price < 1000
  AND stock > 0;

-- 3. GROUP BY with aggregates
SELECT 
  country,
  COUNT(*) AS user_count,
  AVG(age) AS average_age
FROM users
WHERE age >= 18
GROUP BY country
HAVING COUNT(*) > 10
ORDER BY user_count DESC;

-- 4. JOIN query
SELECT 
  users.username,
  users.email,
  COUNT(orders.id) AS total_orders,
  SUM(orders.total) AS total_spent
FROM users
LEFT JOIN orders ON users.id = orders.user_id
GROUP BY users.id, users.username, users.email
HAVING COUNT(orders.id) > 0
ORDER BY total_spent DESC
LIMIT 10;

-- 5. INSERT, UPDATE, DELETE
INSERT INTO users (username, email, country)
VALUES ('testuser', 'test@example.com', 'USA');

UPDATE users 
SET last_login = CURRENT_TIMESTAMP 
WHERE username = 'testuser';

DELETE FROM users 
WHERE username = 'testuser' 
  AND last_login < NOW() - INTERVAL '30 days';`,
};

export default lessonData;
