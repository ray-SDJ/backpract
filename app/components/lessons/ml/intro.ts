import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Introduction to Machine Learning",
  description:
    "Learn the fundamentals of machine learning, understand key concepts, and explore different types of ML algorithms.",
  difficulty: "Beginner",
  objectives: [
    "Understand what machine learning is and why it's important",
    "Learn the difference between supervised, unsupervised, and reinforcement learning",
    "Understand the ML workflow and pipeline",
    "Explore real-world applications of machine learning",
  ],
  content: `<div class="lesson-content">
    <h2>🤖 What is Machine Learning?</h2>
    <p>
      Machine Learning (ML) is a subset of artificial intelligence that enables computers to learn from data and improve their performance without being explicitly programmed. Instead of following predefined rules, ML algorithms identify patterns in data to make predictions or decisions.
    </p>

    <h3>Why Machine Learning?</h3>
    <ul>
      <li><strong>Automation:</strong> Automate complex tasks that are difficult to program manually</li>
      <li><strong>Pattern Recognition:</strong> Discover hidden patterns in large datasets</li>
      <li><strong>Predictions:</strong> Make accurate predictions based on historical data</li>
      <li><strong>Personalization:</strong> Create personalized experiences for users</li>
      <li><strong>Efficiency:</strong> Optimize processes and reduce operational costs</li>
    </ul>

    <h2>📊 Types of Machine Learning</h2>

    <h3>1. Supervised Learning</h3>
    <p>
      The algorithm learns from labeled training data. It makes predictions and is corrected when those predictions are wrong. The learning process continues until the model achieves the desired level of accuracy.
    </p>
    
    <div class="code-block">
      <pre><code># Example: Classification
# Training data has labels (e.g., spam/not spam)
X_train = [[feature1, feature2, ...]]  # Features
y_train = [0, 1, 0, 1, ...]           # Labels

# Common algorithms:
# - Linear Regression (prediction)
# - Logistic Regression (classification)
# - Decision Trees
# - Random Forest
# - Support Vector Machines (SVM)
# - Neural Networks</code></pre>
    </div>

    <h3>2. Unsupervised Learning</h3>
    <p>
      The algorithm learns from unlabeled data by finding patterns and structures on its own, without specific guidance.
    </p>
    
    <div class="code-block">
      <pre><code># Example: Clustering
# No labels provided, algorithm finds patterns
X_data = [[feature1, feature2, ...]]

# Common algorithms:
# - K-Means Clustering
# - Hierarchical Clustering
# - Principal Component Analysis (PCA)
# - Anomaly Detection
# - Association Rules</code></pre>
    </div>

    <h3>3. Reinforcement Learning</h3>
    <p>
      The algorithm learns by interacting with an environment, receiving rewards or penalties for actions, and adjusting its strategy to maximize cumulative reward.
    </p>
    
    <div class="code-block">
      <pre><code># Example: Game AI
# Agent takes actions in environment
# Receives rewards/penalties
# Learns optimal strategy

# Common applications:
# - Game playing (Chess, Go, video games)
# - Robotics
# - Autonomous vehicles
# - Resource management</code></pre>
    </div>

    <h2>🔄 The Machine Learning Workflow</h2>

    <div class="code-block">
      <pre><code>1. Problem Definition
   └─> Define the problem you want to solve
   └─> Determine if ML is the right approach

2. Data Collection
   └─> Gather relevant data
   └─> Ensure data quality and quantity

3. Data Preparation
   └─> Clean data (handle missing values)
   └─> Feature engineering
   └─> Split into training/validation/test sets

4. Model Selection
   └─> Choose appropriate algorithm
   └─> Consider trade-offs (accuracy vs. speed)

5. Model Training
   └─> Feed training data to the model
   └─> Adjust hyperparameters
   └─> Validate on validation set

6. Model Evaluation
   └─> Test on unseen data
   └─> Calculate performance metrics
   └─> Analyze errors and biases

7. Model Deployment
   └─> Deploy to production
   └─> Monitor performance
   └─> Retrain as needed</code></pre>
    </div>

    <h2>🌟 Real-World Applications</h2>

    <h3>Computer Vision</h3>
    <ul>
      <li>Image classification and object detection</li>
      <li>Facial recognition systems</li>
      <li>Medical image analysis (X-rays, MRIs)</li>
      <li>Autonomous vehicles</li>
    </ul>

    <h3>Natural Language Processing (NLP)</h3>
    <ul>
      <li>Sentiment analysis</li>
      <li>Machine translation</li>
      <li>Chatbots and virtual assistants</li>
      <li>Text summarization</li>
    </ul>

    <h3>Recommendation Systems</h3>
    <ul>
      <li>E-commerce product recommendations</li>
      <li>Content recommendations (Netflix, YouTube)</li>
      <li>Music suggestions (Spotify)</li>
    </ul>

    <h3>Financial Services</h3>
    <ul>
      <li>Fraud detection</li>
      <li>Credit scoring</li>
      <li>Algorithmic trading</li>
      <li>Risk assessment</li>
    </ul>

    <h3>Healthcare</h3>
    <ul>
      <li>Disease diagnosis</li>
      <li>Drug discovery</li>
      <li>Patient monitoring</li>
      <li>Personalized treatment plans</li>
    </ul>

    <h2>🎯 Key Concepts</h2>

    <div class="code-block">
      <pre><code># Features: Input variables used for predictions
# Labels: Output variable we want to predict
# Training: Process of learning from data
# Testing: Evaluating model on unseen data
# Overfitting: Model performs well on training data but poorly on new data
# Underfitting: Model is too simple to capture patterns
# Bias-Variance Tradeoff: Balance between model complexity and generalization</code></pre>
    </div>

    <h2>📚 Getting Started</h2>
    <p>
      To begin your ML journey, you'll need:
    </p>
    <ul>
      <li><strong>Python:</strong> The most popular language for ML</li>
      <li><strong>Math Foundation:</strong> Linear algebra, calculus, statistics</li>
      <li><strong>Libraries:</strong> NumPy, Pandas, Scikit-learn, TensorFlow/PyTorch</li>
      <li><strong>Practice:</strong> Work on projects and datasets</li>
    </ul>

    <div class="success-callout">
      <h4>💡 Pro Tip</h4>
      <p>
        Start with simple problems and gradually move to more complex ones. Understanding the fundamentals is crucial before diving into advanced topics like deep learning.
      </p>
    </div>
  </div>`,
  practiceInstructions: [
    "Write a Python function that categorizes ML problems as 'supervised', 'unsupervised', or 'reinforcement' based on a description",
    "The function should take a problem description string and return the ML type",
    "Consider keywords like 'labels', 'prediction', 'clustering', 'rewards' to determine the type",
  ],
  hints: [
    "Use string methods like 'in' or 'find()' to check for keywords",
    "Convert the description to lowercase for case-insensitive matching",
    "Return 'supervised' if keywords like 'predict', 'classify', 'labels' are present",
    "Return 'unsupervised' if keywords like 'cluster', 'pattern', 'group' are present",
    "Return 'reinforcement' if keywords like 'reward', 'action', 'agent' are present",
  ],
  solution: `def categorize_ml_problem(description):
    """
    Categorize a machine learning problem based on its description.
    
    Args:
        description (str): Description of the ML problem
        
    Returns:
        str: 'supervised', 'unsupervised', or 'reinforcement'
    """
    desc_lower = description.lower()
    
    # Check for reinforcement learning keywords
    reinforcement_keywords = ['reward', 'action', 'agent', 'environment', 'policy']
    if any(keyword in desc_lower for keyword in reinforcement_keywords):
        return 'reinforcement'
    
    # Check for supervised learning keywords
    supervised_keywords = ['predict', 'classify', 'label', 'regression', 'classification']
    if any(keyword in desc_lower for keyword in supervised_keywords):
        return 'supervised'
    
    # Check for unsupervised learning keywords
    unsupervised_keywords = ['cluster', 'pattern', 'group', 'segment', 'anomaly']
    if any(keyword in desc_lower for keyword in unsupervised_keywords):
        return 'unsupervised'
    
    # Default to supervised as it's most common
    return 'supervised'

# Test cases
print(categorize_ml_problem("Predict house prices based on features"))  # supervised
print(categorize_ml_problem("Group customers into segments"))  # unsupervised
print(categorize_ml_problem("Train an agent to play chess"))  # reinforcement`,
  starterCode: `def categorize_ml_problem(description):
    """
    Categorize a machine learning problem based on its description.
    
    Args:
        description (str): Description of the ML problem
        
    Returns:
        str: 'supervised', 'unsupervised', or 'reinforcement'
    """
    # Your code here
    pass

# Test your function
print(categorize_ml_problem("Predict house prices based on features"))
print(categorize_ml_problem("Group customers into segments"))
print(categorize_ml_problem("Train an agent to play chess"))`,
  validationCriteria: {
    requiredIncludes: ["def categorize_ml_problem", "return"],
    forbiddenIncludes: ["pass"],
    minLines: 5,
  },
};
