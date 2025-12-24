import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Machine Learning & AI Cheat Sheet",
  description:
    "Comprehensive reference for machine learning algorithms, deep learning architectures, and best practices.",
  difficulty: "Advanced",
  content: `<div class="lesson-content">
    <p>A complete reference guide covering essential ML algorithms, deep learning techniques, and deployment strategies.</p>

    <h2>🤖 ML Algorithm Selection Guide</h2>
    
    <div class="code-block">
      <pre><code># Classification Problems
# Binary: Logistic Regression, SVM, Random Forest, XGBoost, Neural Networks
# Multi-class: Softmax Regression, Decision Trees, Random Forest, Neural Networks
# Multi-label: Binary Relevance, Classifier Chains, Label Powerset

# Regression Problems
# Linear Regression, Ridge, Lasso, ElasticNet
# Tree-based: Decision Tree, Random Forest, XGBoost, LightGBM
# Neural Networks (for complex patterns)

# Clustering
# K-Means, DBSCAN, Hierarchical, Gaussian Mixture Models

# Dimensionality Reduction
# PCA, t-SNE, UMAP, LDA, Autoencoders

# Time Series
# ARIMA, Prophet, LSTM, GRU, Temporal Convolutions</code></pre>
    </div>

    <h2>📊 Scikit-learn Quick Reference</h2>
    
    <div class="code-block">
      <pre><code>from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, MinMaxScaler, LabelEncoder
from sklearn.metrics import accuracy_score, f1_score, confusion_matrix

# Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Scaling
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)  # Fit on training only!
X_test_scaled = scaler.transform(X_test)  # Transform test

# Common Models
from sklearn.linear_model import LogisticRegression, Ridge, Lasso
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC, SVR
from sklearn.neighbors import KNeighborsClassifier

# Quick Training Pattern
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)

# Cross-Validation
scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
print(f"CV Scores: {scores.mean():.3f} (+/- {scores.std() * 2:.3f})")

# Grid Search
from sklearn.model_selection import GridSearchCV
param_grid = {'max_depth': [5, 10, 15], 'n_estimators': [50, 100, 200]}
grid = GridSearchCV(model, param_grid, cv=5, scoring='accuracy')
grid.fit(X_train, y_train)
best_model = grid.best_estimator_</code></pre>
    </div>

    <h2>🧠 TensorFlow/Keras Quick Reference</h2>
    
    <div class="code-block">
      <pre><code>import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Sequential Model
model = keras.Sequential([
    layers.Dense(128, activation='relu', input_shape=(input_dim,)),
    layers.Dropout(0.3),
    layers.Dense(64, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(num_classes, activation='softmax')
])

# Compile
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',  # or 'categorical_crossentropy'
    metrics=['accuracy']
)

# Callbacks
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

callbacks = [
    EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True),
    ModelCheckpoint('best_model.h5', save_best_only=True, monitor='val_accuracy')
]

# Train
history = model.fit(
    X_train, y_train,
    epochs=50,
    batch_size=32,
    validation_split=0.2,
    callbacks=callbacks
)

# CNN Architecture
cnn = keras.Sequential([
    layers.Conv2D(32, (3,3), activation='relu', input_shape=(28,28,1)),
    layers.MaxPooling2D((2,2)),
    layers.Conv2D(64, (3,3), activation='relu'),
    layers.MaxPooling2D((2,2)),
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(10, activation='softmax')
])

# LSTM Architecture
lstm = keras.Sequential([
    layers.Embedding(vocab_size, embedding_dim, input_length=max_length),
    layers.LSTM(64, return_sequences=True),
    layers.LSTM(32),
    layers.Dense(64, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(num_classes, activation='softmax')
])

# Custom Training Loop
@tf.function
def train_step(x, y):
    with tf.GradientTape() as tape:
        predictions = model(x, training=True)
        loss = loss_fn(y, predictions)
    gradients = tape.gradient(loss, model.trainable_variables)
    optimizer.apply_gradients(zip(gradients, model.trainable_variables))
    return loss</code></pre>
    </div>

    <h2>📈 Evaluation Metrics</h2>
    
    <div class="code-block">
      <pre><code># Classification Metrics
from sklearn.metrics import (
    accuracy_score,      # (TP + TN) / Total
    precision_score,     # TP / (TP + FP)
    recall_score,        # TP / (TP + FN) - Sensitivity
    f1_score,           # 2 * (precision * recall) / (precision + recall)
    roc_auc_score,      # Area under ROC curve
    confusion_matrix,
    classification_report
)

# For multi-class
precision = precision_score(y_true, y_pred, average='weighted')
recall = recall_score(y_true, y_pred, average='weighted')
f1 = f1_score(y_true, y_pred, average='weighted')

# Confusion Matrix
cm = confusion_matrix(y_true, y_pred)
# [[TN, FP],
#  [FN, TP]]

# Regression Metrics
from sklearn.metrics import (
    mean_squared_error,      # MSE
    mean_absolute_error,     # MAE
    r2_score                # R² Score
)

mse = mean_squared_error(y_true, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_true, y_pred)
r2 = r2_score(y_true, y_pred)

# Custom Metrics
from sklearn.metrics import make_scorer
def custom_metric(y_true, y_pred):
    return your_calculation
scorer = make_scorer(custom_metric)</code></pre>
    </div>

    <h2>🔧 Data Preprocessing</h2>
    
    <div class="code-block">
      <pre><code>import pandas as pd
import numpy as np

# Handling Missing Values
df.isnull().sum()                    # Count missing values
df.dropna()                          # Drop rows with missing values
df.fillna(df.mean())                 # Fill with mean
df.fillna(method='ffill')            # Forward fill

from sklearn.impute import SimpleImputer
imputer = SimpleImputer(strategy='mean')  # 'median', 'most_frequent', 'constant'
X_imputed = imputer.fit_transform(X)

# Encoding Categorical Variables
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

# Label Encoding (ordinal)
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# One-Hot Encoding (nominal)
pd.get_dummies(df, columns=['category_col'])

# Feature Scaling
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler

# Standardization (mean=0, std=1)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Normalization (min-max to [0,1])
min_max = MinMaxScaler()
X_normalized = min_max.fit_transform(X)

# Robust Scaler (handles outliers)
robust = RobustScaler()
X_robust = robust.fit_transform(X)

# Feature Engineering
# Polynomial Features
from sklearn.preprocessing import PolynomialFeatures
poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly.fit_transform(X)

# Binning
pd.cut(df['age'], bins=[0, 18, 35, 60, 100], labels=['child', 'young', 'adult', 'senior'])

# Date Features
df['year'] = df['date'].dt.year
df['month'] = df['date'].dt.month
df['day_of_week'] = df['date'].dt.dayofweek</code></pre>
    </div>

    <h2>🎯 Hyperparameter Tuning</h2>
    
    <div class="code-block">
      <pre><code># Grid Search
from sklearn.model_selection import GridSearchCV

param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [5, 10, 15, None],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

grid_search = GridSearchCV(
    estimator=RandomForestClassifier(),
    param_grid=param_grid,
    cv=5,
    scoring='accuracy',
    n_jobs=-1,
    verbose=1
)

grid_search.fit(X_train, y_train)
print(f"Best params: {grid_search.best_params_}")
print(f"Best score: {grid_search.best_score_:.3f}")

# Random Search (faster)
from sklearn.model_selection import RandomizedSearchCV

random_search = RandomizedSearchCV(
    estimator=RandomForestClassifier(),
    param_distributions=param_grid,
    n_iter=20,
    cv=5,
    random_state=42,
    n_jobs=-1
)

# Bayesian Optimization
from sklearn.model_selection import BayesSearchCV

opt = BayesSearchCV(
    estimator,
    search_spaces,
    n_iter=50,
    cv=5
)</code></pre>
    </div>

    <h2>💾 Model Persistence</h2>
    
    <div class="code-block">
      <pre><code># Scikit-learn
import joblib

# Save
joblib.dump(model, 'model.pkl')
joblib.dump({'model': model, 'scaler': scaler}, 'pipeline.pkl')

# Load
model = joblib.load('model.pkl')

# Alternative: pickle
import pickle
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

# TensorFlow/Keras
# Save entire model
model.save('my_model.h5')
model.save('my_model/')  # SavedModel format

# Load
from tensorflow.keras.models import load_model
model = load_model('my_model.h5')

# Save weights only
model.save_weights('weights.h5')
model.load_weights('weights.h5')</code></pre>
    </div>

    <h2>🚀 Deployment Patterns</h2>
    
    <div class="code-block">
      <pre><code># Flask API
from flask import Flask, request, jsonify

app = Flask(__name__)
model = joblib.load('model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = np.array(data['features']).reshape(1, -1)
    prediction = model.predict(features)
    return jsonify({'prediction': int(prediction[0])})

# FastAPI (Modern)
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class PredictRequest(BaseModel):
    features: list

@app.post("/predict")
async def predict(request: PredictRequest):
    features = np.array(request.features).reshape(1, -1)
    prediction = model.predict(features)
    return {"prediction": int(prediction[0])}

# Docker
# Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]

# Build and run
docker build -t ml-api .
docker run -p 5000:5000 ml-api</code></pre>
    </div>

    <h2>📊 Common Issues & Solutions</h2>
    
    <div class="code-block">
      <pre><code># Overfitting Solutions
# 1. More training data
# 2. Regularization (L1, L2, Dropout)
# 3. Reduce model complexity
# 4. Cross-validation
# 5. Early stopping

# For neural networks
model.add(layers.Dropout(0.5))  # Dropout
model.add(layers.Dense(64, kernel_regularizer=keras.regularizers.l2(0.01)))

# For scikit-learn
from sklearn.linear_model import Ridge, Lasso
ridge = Ridge(alpha=1.0)  # L2 regularization
lasso = Lasso(alpha=1.0)  # L1 regularization

# Underfitting Solutions
# 1. Increase model complexity
# 2. Add more features
# 3. Reduce regularization
# 4. Train longer

# Imbalanced Classes
from sklearn.utils.class_weight import compute_class_weight
from imblearn.over_sampling import SMOTE
from imblearn.under_sampling import RandomUnderSampler

# Class weights
class_weights = compute_class_weight('balanced', classes=np.unique(y), y=y)

# SMOTE
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)

# For neural networks
model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy'],
    class_weight={0: 1, 1: 10}  # Weight for minority class
)</code></pre>
    </div>

    <h2>🎓 Best Practices</h2>
    
    <div class="code-block">
      <pre><code># 1. Always split before preprocessing
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# 2. Fit on training, transform on test
scaler.fit(X_train)
X_train_scaled = scaler.transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 3. Use pipelines
from sklearn.pipeline import Pipeline

pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('classifier', RandomForestClassifier())
])
pipeline.fit(X_train, y_train)

# 4. Save preprocessing objects
joblib.dump({'model': model, 'scaler': scaler}, 'complete_pipeline.pkl')

# 5. Version your experiments
import mlflow
with mlflow.start_run():
    mlflow.log_params(params)
    mlflow.log_metrics(metrics)
    mlflow.sklearn.log_model(model, "model")

# 6. Monitor in production
def log_prediction(features, prediction, timestamp):
    # Log to database/file for monitoring
    pass

# 7. Set random seeds for reproducibility
np.random.seed(42)
tf.random.set_seed(42)
random.seed(42)</code></pre>
    </div>

  </div>`,
  objectives: [
    "Quick reference for ML algorithms",
    "Common preprocessing techniques",
    "Model evaluation methods",
    "Deployment patterns",
  ],
  practiceInstructions: [],
  hints: [],
  solution: "",
  starterCode: "",
};
