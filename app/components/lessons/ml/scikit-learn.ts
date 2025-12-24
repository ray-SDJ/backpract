import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Scikit-learn: Building Your First ML Model",
  description:
    "Learn to build, train, and evaluate machine learning models using Scikit-learn, the most popular ML library in Python.",
  difficulty: "Intermediate",
  objectives: [
    "Understand the Scikit-learn API and workflow",
    "Learn data preprocessing and feature scaling",
    "Build classification and regression models",
    "Evaluate model performance with metrics",
    "Implement train-test split and cross-validation",
  ],
  content: `<div class="lesson-content">
    <h2>🛠️ Introduction to Scikit-learn</h2>
    <p>
      Scikit-learn is the most popular machine learning library in Python. It provides simple and efficient tools for data analysis and modeling, built on NumPy, SciPy, and Matplotlib.
    </p>

    <h3>Key Features:</h3>
    <ul>
      <li>Simple and consistent API</li>
      <li>Wide range of algorithms (classification, regression, clustering)</li>
      <li>Built-in preprocessing and feature selection tools</li>
      <li>Model evaluation and validation</li>
      <li>Excellent documentation and community support</li>
    </ul>

    <h2>📝 The Scikit-learn Workflow</h2>

    <div class="code-block">
      <pre><code>from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# 1. Load and prepare data
X, y = load_data()  # Features and labels

# 2. Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 3. Preprocess data
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 4. Create and train model
model = LogisticRegression()
model.fit(X_train_scaled, y_train)

# 5. Make predictions
y_pred = model.predict(X_test_scaled)

# 6. Evaluate model
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2f}")</code></pre>
    </div>

    <h2>🔧 Data Preprocessing</h2>

    <h3>1. Handling Missing Data</h3>
    <div class="code-block">
      <pre><code>from sklearn.impute import SimpleImputer
import numpy as np

# Create sample data with missing values
X = np.array([[1, 2], [np.nan, 3], [7, 6], [4, np.nan]])

# Impute missing values with mean
imputer = SimpleImputer(strategy='mean')
X_imputed = imputer.fit_transform(X)

# Other strategies: 'median', 'most_frequent', 'constant'</code></pre>
    </div>

    <h3>2. Feature Scaling</h3>
    <div class="code-block">
      <pre><code>from sklearn.preprocessing import StandardScaler, MinMaxScaler

# StandardScaler: Mean = 0, Std = 1
scaler = StandardScaler()
X_standardized = scaler.fit_transform(X_train)

# MinMaxScaler: Scale to [0, 1]
min_max_scaler = MinMaxScaler()
X_normalized = min_max_scaler.fit_transform(X_train)

# Always fit on training data, transform both train and test!
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)  # Use same scaler</code></pre>
    </div>

    <h3>3. Encoding Categorical Variables</h3>
    <div class="code-block">
      <pre><code>from sklearn.preprocessing import LabelEncoder, OneHotEncoder
import pandas as pd

# LabelEncoder: For ordinal categories
le = LabelEncoder()
labels = ['low', 'medium', 'high', 'low']
encoded = le.fit_transform(labels)  # [1, 2, 0, 1]

# OneHotEncoder: For nominal categories
categories = [['cat'], ['dog'], ['cat'], ['bird']]
ohe = OneHotEncoder(sparse=False)
one_hot = ohe.fit_transform(categories)
# [[1, 0, 0], [0, 1, 0], [1, 0, 0], [0, 0, 1]]

# Using Pandas get_dummies (easier)
df = pd.DataFrame({'animal': ['cat', 'dog', 'cat', 'bird']})
encoded_df = pd.get_dummies(df, columns=['animal'])</code></pre>
    </div>

    <h2>🎯 Classification Models</h2>

    <h3>Logistic Regression</h3>
    <div class="code-block">
      <pre><code>from sklearn.linear_model import LogisticRegression
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix

# Load dataset
iris = load_iris()
X, y = iris.data, iris.target

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create and train model
lr = LogisticRegression(max_iter=200)
lr.fit(X_train, y_train)

# Predictions
y_pred = lr.predict(X_test)
y_prob = lr.predict_proba(X_test)  # Probability scores

# Evaluation
accuracy = accuracy_score(y_test, y_pred)
cm = confusion_matrix(y_test, y_pred)

print(f"Accuracy: {accuracy:.2f}")
print(f"Confusion Matrix:\\n{cm}")</code></pre>
    </div>

    <h3>Decision Trees and Random Forests</h3>
    <div class="code-block">
      <pre><code>from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

# Decision Tree
dt = DecisionTreeClassifier(max_depth=5, random_state=42)
dt.fit(X_train, y_train)
dt_accuracy = dt.score(X_test, y_test)

# Random Forest (ensemble of decision trees)
rf = RandomForestClassifier(
    n_estimators=100,  # Number of trees
    max_depth=5,
    random_state=42
)
rf.fit(X_train, y_train)
rf_accuracy = rf.score(X_test, y_test)

# Feature importance
feature_importance = rf.feature_importances_
for i, importance in enumerate(feature_importance):
    print(f"Feature {i}: {importance:.3f}")</code></pre>
    </div>

    <h3>Support Vector Machines (SVM)</h3>
    <div class="code-block">
      <pre><code>from sklearn.svm import SVC

# SVM with different kernels
svm_linear = SVC(kernel='linear')
svm_rbf = SVC(kernel='rbf', gamma='scale')
svm_poly = SVC(kernel='poly', degree=3)

# Train
svm_rbf.fit(X_train, y_train)

# Predict
y_pred = svm_rbf.predict(X_test)
accuracy = svm_rbf.score(X_test, y_test)</code></pre>
    </div>

    <h2>📈 Regression Models</h2>

    <h3>Linear Regression</h3>
    <div class="code-block">
      <pre><code>from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

# Generate sample data
np.random.seed(42)
X = np.random.rand(100, 1) * 10
y = 2 * X.ravel() + np.random.randn(100) * 2

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create and train model
lr = LinearRegression()
lr.fit(X_train, y_train)

# Predictions
y_pred = lr.predict(X_test)

# Evaluation
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print(f"MSE: {mse:.2f}")
print(f"RMSE: {rmse:.2f}")
print(f"R² Score: {r2:.2f}")
print(f"Coefficients: {lr.coef_}")
print(f"Intercept: {lr.intercept_:.2f}")</code></pre>
    </div>

    <h3>Polynomial Regression</h3>
    <div class="code-block">
      <pre><code>from sklearn.preprocessing import PolynomialFeatures

# Create polynomial features
poly = PolynomialFeatures(degree=2)
X_poly_train = poly.fit_transform(X_train)
X_poly_test = poly.transform(X_test)

# Train linear regression on polynomial features
poly_reg = LinearRegression()
poly_reg.fit(X_poly_train, y_train)

# Predictions
y_pred_poly = poly_reg.predict(X_poly_test)
r2_poly = r2_score(y_test, y_pred_poly)</code></pre>
    </div>

    <h2>📊 Model Evaluation</h2>

    <h3>Classification Metrics</h3>
    <div class="code-block">
      <pre><code>from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
    roc_auc_score,
    roc_curve
)

# Calculate metrics
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, average='weighted')
recall = recall_score(y_test, y_pred, average='weighted')
f1 = f1_score(y_test, y_pred, average='weighted')

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)

# Detailed report
report = classification_report(y_test, y_pred)
print(report)

# ROC AUC (for binary classification)
auc = roc_auc_score(y_test, y_prob[:, 1])
fpr, tpr, thresholds = roc_curve(y_test, y_prob[:, 1])</code></pre>
    </div>

    <h3>Cross-Validation</h3>
    <div class="code-block">
      <pre><code>from sklearn.model_selection import cross_val_score, cross_validate

# Simple cross-validation
scores = cross_val_score(
    model, X, y,
    cv=5,  # 5-fold cross-validation
    scoring='accuracy'
)

print(f"CV Scores: {scores}")
print(f"Mean: {scores.mean():.2f} (+/- {scores.std() * 2:.2f})")

# Multiple metrics
scoring = ['accuracy', 'precision_weighted', 'recall_weighted']
scores = cross_validate(model, X, y, cv=5, scoring=scoring)

print(f"Accuracy: {scores['test_accuracy'].mean():.2f}")
print(f"Precision: {scores['test_precision_weighted'].mean():.2f}")
print(f"Recall: {scores['test_recall_weighted'].mean():.2f}")</code></pre>
    </div>

    <h2>🔍 Hyperparameter Tuning</h2>

    <div class="code-block">
      <pre><code>from sklearn.model_selection import GridSearchCV, RandomizedSearchCV

# Define parameter grid
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [5, 10, 15, None],
    'min_samples_split': [2, 5, 10]
}

# Grid Search
grid_search = GridSearchCV(
    RandomForestClassifier(),
    param_grid,
    cv=5,
    scoring='accuracy',
    n_jobs=-1  # Use all processors
)

grid_search.fit(X_train, y_train)

# Best parameters and score
print(f"Best parameters: {grid_search.best_params_}")
print(f"Best score: {grid_search.best_score_:.2f}")

# Use best model
best_model = grid_search.best_estimator_
y_pred = best_model.predict(X_test)</code></pre>
    </div>

    <h2>💾 Saving and Loading Models</h2>

    <div class="code-block">
      <pre><code>import joblib

# Save model
joblib.dump(model, 'model.pkl')

# Save multiple objects
joblib.dump({
    'model': model,
    'scaler': scaler,
    'feature_names': feature_names
}, 'ml_pipeline.pkl')

# Load model
loaded_model = joblib.load('model.pkl')

# Make predictions with loaded model
predictions = loaded_model.predict(X_new)</code></pre>
    </div>

    <div class="success-callout">
      <h4>💡 Best Practices</h4>
      <ul>
        <li>Always split your data before any preprocessing</li>
        <li>Fit scalers and encoders on training data only</li>
        <li>Use cross-validation for better model evaluation</li>
        <li>Start with simple models before trying complex ones</li>
        <li>Monitor for overfitting (training vs. validation performance)</li>
        <li>Save preprocessing objects along with your model</li>
      </ul>
    </div>
  </div>`,
  practiceInstructions: [
    "Build a complete machine learning pipeline using Scikit-learn",
    "1. Create a classification dataset using make_classification",
    "2. Split the data into train and test sets (80/20 split)",
    "3. Scale the features using StandardScaler",
    "4. Train a Random Forest classifier",
    "5. Evaluate the model and print accuracy and confusion matrix",
  ],
  hints: [
    "Use sklearn.datasets.make_classification to generate data",
    "Remember to fit the scaler on training data and transform both train and test",
    "Use n_estimators=100 for the Random Forest",
    "Use sklearn.metrics for evaluation",
  ],
  solution: `from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix

def build_ml_pipeline():
    """
    Build a complete ML pipeline from data to evaluation.
    """
    # 1. Create dataset
    X, y = make_classification(
        n_samples=1000,
        n_features=20,
        n_classes=2,
        random_state=42
    )
    
    # 2. Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # 3. Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # 4. Train model
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train_scaled, y_train)
    
    # 5. Evaluate
    y_pred = rf.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)
    
    print(f"Accuracy: {accuracy:.2f}")
    print(f"\\nConfusion Matrix:\\n{cm}")
    
    return rf, scaler

# Run the pipeline
model, scaler = build_ml_pipeline()`,
  starterCode: `from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix

def build_ml_pipeline():
    """
    Build a complete ML pipeline from data to evaluation.
    """
    # Your code here
    # 1. Create dataset with make_classification
    # 2. Split into train/test
    # 3. Scale features
    # 4. Train Random Forest
    # 5. Evaluate and print results
    pass

# Run the pipeline
model, scaler = build_ml_pipeline()`,
  validationCriteria: {
    requiredIncludes: [
      "make_classification",
      "train_test_split",
      "StandardScaler",
      "RandomForestClassifier",
      "accuracy_score",
    ],
    forbiddenIncludes: ["pass"],
    minLines: 15,
  },
};
