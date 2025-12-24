import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Python for Machine Learning - Essential Libraries",
  description:
    "Master the essential Python libraries for machine learning: NumPy, Pandas, and Matplotlib.",
  difficulty: "Beginner",
  objectives: [
    "Learn NumPy for numerical computations and arrays",
    "Master Pandas for data manipulation and analysis",
    "Understand Matplotlib for data visualization",
    "Work with real-world datasets",
  ],
  content: `<div class="lesson-content">
    <h2>🐍 Python ML Ecosystem</h2>
    <p>
      Python is the dominant language for machine learning due to its rich ecosystem of libraries. The three foundational libraries you must master are:
    </p>
    <ul>
      <li><strong>NumPy:</strong> Numerical computing with arrays</li>
      <li><strong>Pandas:</strong> Data manipulation and analysis</li>
      <li><strong>Matplotlib:</strong> Data visualization</li>
    </ul>

    <h2>🔢 NumPy - Numerical Python</h2>
    <p>
      NumPy is the foundation for numerical computing in Python. It provides fast, efficient operations on arrays and matrices.
    </p>

    <div class="code-block">
      <pre><code>import numpy as np

# Creating arrays
arr1d = np.array([1, 2, 3, 4, 5])
arr2d = np.array([[1, 2, 3], [4, 5, 6]])

# Array creation functions
zeros = np.zeros((3, 3))        # 3x3 array of zeros
ones = np.ones((2, 4))          # 2x4 array of ones
identity = np.eye(3)            # 3x3 identity matrix
random = np.random.rand(3, 3)   # 3x3 random values [0, 1)
range_arr = np.arange(0, 10, 2) # [0, 2, 4, 6, 8]
linspace = np.linspace(0, 1, 5) # 5 evenly spaced values from 0 to 1

# Array properties
print(arr2d.shape)     # (2, 3)
print(arr2d.ndim)      # 2 (dimensions)
print(arr2d.dtype)     # int64
print(arr2d.size)      # 6 (total elements)

# Array operations (vectorized - very fast!)
arr = np.array([1, 2, 3, 4])
print(arr + 10)        # [11, 12, 13, 14]
print(arr * 2)         # [2, 4, 6, 8]
print(arr ** 2)        # [1, 4, 9, 16]
print(np.sqrt(arr))    # [1. 1.414... 1.732... 2.]

# Array indexing and slicing
arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print(arr[0, 1])       # 2 (row 0, column 1)
print(arr[1:, :2])     # Rows 1-2, Columns 0-1
print(arr[arr > 5])    # [6, 7, 8, 9] (boolean indexing)

# Statistical operations
data = np.array([1, 2, 3, 4, 5])
print(np.mean(data))   # 3.0
print(np.median(data)) # 3.0
print(np.std(data))    # 1.414... (standard deviation)
print(np.sum(data))    # 15
print(np.min(data))    # 1
print(np.max(data))    # 5

# Matrix operations
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
print(np.dot(A, B))    # Matrix multiplication
print(A @ B)           # Same as dot product
print(A.T)             # Transpose</code></pre>
    </div>

    <h2>🐼 Pandas - Data Analysis</h2>
    <p>
      Pandas provides powerful data structures (Series and DataFrame) for working with structured data. It's essential for data preprocessing in ML.
    </p>

    <div class="code-block">
      <pre><code>import pandas as pd

# Creating DataFrames
data = {
    'name': ['Alice', 'Bob', 'Charlie', 'David'],
    'age': [25, 30, 35, 28],
    'salary': [50000, 60000, 75000, 55000]
}
df = pd.DataFrame(data)

# Reading data from files
# df = pd.read_csv('data.csv')
# df = pd.read_excel('data.xlsx')
# df = pd.read_json('data.json')

# Basic DataFrame operations
print(df.head())       # First 5 rows
print(df.tail())       # Last 5 rows
print(df.info())       # DataFrame info
print(df.describe())   # Statistical summary
print(df.shape)        # (4, 3)
print(df.columns)      # Column names
print(df.dtypes)       # Data types

# Selecting data
print(df['name'])              # Select column
print(df[['name', 'age']])     # Multiple columns
print(df.loc[0])               # Select row by label
print(df.iloc[0])              # Select row by index
print(df[df['age'] > 28])      # Filter rows

# Data manipulation
df['bonus'] = df['salary'] * 0.1        # Add new column
df['total'] = df['salary'] + df['bonus']
df.drop('bonus', axis=1, inplace=True)  # Remove column
df.rename(columns={'name': 'employee'}) # Rename column

# Handling missing data
df.isnull()            # Check for missing values
df.dropna()            # Drop rows with missing values
df.fillna(0)           # Fill missing values with 0
df.fillna(df.mean())   # Fill with column mean

# Grouping and aggregation
grouped = df.groupby('age')['salary'].mean()
df.groupby('age').agg({
    'salary': ['mean', 'sum', 'count']
})

# Sorting
df.sort_values('salary', ascending=False)
df.sort_values(['age', 'salary'])

# Applying functions
df['age'].apply(lambda x: x + 1)
df.apply(lambda row: row['salary'] * 1.1, axis=1)

# Merging DataFrames
df1 = pd.DataFrame({'id': [1, 2], 'value': [10, 20]})
df2 = pd.DataFrame({'id': [1, 2], 'score': [90, 85]})
merged = pd.merge(df1, df2, on='id')</code></pre>
    </div>

    <h2>📊 Matplotlib - Data Visualization</h2>
    <p>
      Matplotlib is the most popular plotting library in Python. Visualizing data is crucial for understanding patterns and model performance.
    </p>

    <div class="code-block">
      <pre><code>import matplotlib.pyplot as plt
import numpy as np

# Line plot
x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y, label='sin(x)', color='blue', linewidth=2)
plt.xlabel('X-axis')
plt.ylabel('Y-axis')
plt.title('Sine Wave')
plt.legend()
plt.grid(True)
plt.show()

# Scatter plot
x = np.random.rand(50)
y = np.random.rand(50)
colors = np.random.rand(50)
sizes = 1000 * np.random.rand(50)

plt.scatter(x, y, c=colors, s=sizes, alpha=0.5, cmap='viridis')
plt.colorbar()
plt.xlabel('X')
plt.ylabel('Y')
plt.title('Scatter Plot')
plt.show()

# Bar chart
categories = ['A', 'B', 'C', 'D']
values = [23, 45, 56, 78]

plt.bar(categories, values, color='skyblue')
plt.xlabel('Category')
plt.ylabel('Value')
plt.title('Bar Chart')
plt.show()

# Histogram
data = np.random.randn(1000)
plt.hist(data, bins=30, edgecolor='black', alpha=0.7)
plt.xlabel('Value')
plt.ylabel('Frequency')
plt.title('Histogram')
plt.show()

# Multiple subplots
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

axes[0, 0].plot(x, y)
axes[0, 0].set_title('Line Plot')

axes[0, 1].scatter(x, y)
axes[0, 1].set_title('Scatter Plot')

axes[1, 0].bar(categories, values)
axes[1, 0].set_title('Bar Chart')

axes[1, 1].hist(data, bins=20)
axes[1, 1].set_title('Histogram')

plt.tight_layout()
plt.show()

# Heatmap (useful for correlation matrices)
data = np.random.rand(10, 10)
plt.imshow(data, cmap='hot', interpolation='nearest')
plt.colorbar()
plt.title('Heatmap')
plt.show()</code></pre>
    </div>

    <h2>🔗 Putting It All Together</h2>
    <p>
      Here's a complete example of using all three libraries together for data analysis:
    </p>

    <div class="code-block">
      <pre><code>import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Generate sample data
np.random.seed(42)
n_samples = 1000

data = pd.DataFrame({
    'feature1': np.random.randn(n_samples),
    'feature2': np.random.randn(n_samples),
    'target': np.random.choice([0, 1], n_samples)
})

# Data analysis
print("Dataset shape:", data.shape)
print("\\nSummary statistics:")
print(data.describe())

print("\\nCorrelation matrix:")
print(data.corr())

# Visualization
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# Distribution of feature1
axes[0].hist(data['feature1'], bins=30, edgecolor='black')
axes[0].set_title('Feature 1 Distribution')
axes[0].set_xlabel('Value')
axes[0].set_ylabel('Frequency')

# Scatter plot of features
for target in [0, 1]:
    mask = data['target'] == target
    axes[1].scatter(
        data[mask]['feature1'],
        data[mask]['feature2'],
        label=f'Class {target}',
        alpha=0.5
    )
axes[1].set_title('Feature Scatter Plot')
axes[1].set_xlabel('Feature 1')
axes[1].set_ylabel('Feature 2')
axes[1].legend()

# Target distribution
target_counts = data['target'].value_counts()
axes[2].bar(['Class 0', 'Class 1'], target_counts)
axes[2].set_title('Target Distribution')
axes[2].set_ylabel('Count')

plt.tight_layout()
plt.show()</code></pre>
    </div>

    <div class="success-callout">
      <h4>💡 Best Practices</h4>
      <ul>
        <li>Use vectorized operations in NumPy instead of loops for better performance</li>
        <li>Check for missing data and outliers before training models</li>
        <li>Visualize your data before and after preprocessing</li>
        <li>Use meaningful variable names and add comments</li>
        <li>Save and version your datasets</li>
      </ul>
    </div>
  </div>`,
  practiceInstructions: [
    "Create a function that loads a dataset, performs basic analysis, and creates visualizations",
    "The function should: 1) Create a sample DataFrame with at least 100 rows and 3 numeric columns",
    "2) Calculate mean, median, and standard deviation for each column",
    "3) Print the correlation matrix",
    "4) Return a dictionary with the statistics",
  ],
  hints: [
    "Use np.random.randn() to generate random data",
    "Use pandas DataFrame methods like mean(), median(), std()",
    "Use df.corr() to get the correlation matrix",
    "Store statistics in a dictionary with column names as keys",
  ],
  solution: `import numpy as np
import pandas as pd

def analyze_dataset():
    """
    Create and analyze a sample dataset.
    
    Returns:
        dict: Statistics for each column
    """
    # Create sample data
    np.random.seed(42)
    n_samples = 100
    
    df = pd.DataFrame({
        'height': np.random.normal(170, 10, n_samples),
        'weight': np.random.normal(70, 15, n_samples),
        'age': np.random.randint(18, 65, n_samples)
    })
    
    # Calculate statistics
    stats = {}
    for column in df.columns:
        stats[column] = {
            'mean': df[column].mean(),
            'median': df[column].median(),
            'std': df[column].std()
        }
    
    # Print correlation matrix
    print("Correlation Matrix:")
    print(df.corr())
    
    print("\\nStatistics:")
    for col, values in stats.items():
        print(f"\\n{col}:")
        print(f"  Mean: {values['mean']:.2f}")
        print(f"  Median: {values['median']:.2f}")
        print(f"  Std Dev: {values['std']:.2f}")
    
    return stats

# Run the analysis
result = analyze_dataset()`,
  starterCode: `import numpy as np
import pandas as pd

def analyze_dataset():
    """
    Create and analyze a sample dataset.
    
    Returns:
        dict: Statistics for each column
    """
    # Your code here
    # 1. Create a DataFrame with 100 rows and 3 columns
    # 2. Calculate mean, median, std for each column
    # 3. Print correlation matrix
    # 4. Return statistics dictionary
    pass

# Run the analysis
result = analyze_dataset()`,
  validationCriteria: {
    requiredIncludes: [
      "import numpy",
      "import pandas",
      "def analyze_dataset",
      "return",
    ],
    forbiddenIncludes: ["pass"],
    minLines: 10,
  },
};
