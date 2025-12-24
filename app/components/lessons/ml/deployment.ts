import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Model Deployment and MLOps",
  description:
    "Learn how to deploy machine learning models to production and implement MLOps best practices for maintaining ML systems.",
  difficulty: "Advanced",
  objectives: [
    "Understand ML deployment strategies and architectures",
    "Learn to create REST APIs for ML models",
    "Deploy models using Docker and cloud platforms",
    "Implement model monitoring and versioning",
    "Apply MLOps best practices",
  ],
  content: `<div class="lesson-content">
    <h2>🚀 Model Deployment Overview</h2>
    <p>
      Deploying a machine learning model means making it available for use in production environments where it can serve predictions to users or systems. This involves several challenges beyond just training a good model.
    </p>

    <h3>Deployment Considerations</h3>
    <ul>
      <li><strong>Scalability:</strong> Handle multiple concurrent requests</li>
      <li><strong>Latency:</strong> Fast response times</li>
      <li><strong>Reliability:</strong> High availability and fault tolerance</li>
      <li><strong>Monitoring:</strong> Track model performance over time</li>
      <li><strong>Versioning:</strong> Manage multiple model versions</li>
      <li><strong>Security:</strong> Protect models and data</li>
    </ul>

    <h2>🌐 Creating a REST API with Flask</h2>

    <h3>Basic Flask API</h3>
    <div class="code-block">
      <pre><code>from flask import Flask, request, jsonify
import joblib
import numpy as np

# Load model
model = joblib.load('model.pkl')
scaler = joblib.load('scaler.pkl')

# Create Flask app
app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200

@app.route('/predict', methods=['POST'])
def predict():
    """Prediction endpoint"""
    try:
        # Get data from request
        data = request.get_json()
        features = np.array(data['features']).reshape(1, -1)
        
        # Preprocess
        features_scaled = scaler.transform(features)
        
        # Predict
        prediction = model.predict(features_scaled)
        probability = model.predict_proba(features_scaled)
        
        # Return response
        response = {
            'prediction': int(prediction[0]),
            'probability': probability[0].tolist(),
            'model_version': '1.0.0'
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/batch-predict', methods=['POST'])
def batch_predict():
    """Batch prediction endpoint"""
    try:
        data = request.get_json()
        features = np.array(data['features'])
        
        # Preprocess and predict
        features_scaled = scaler.transform(features)
        predictions = model.predict(features_scaled)
        
        return jsonify({
            'predictions': predictions.tolist(),
            'count': len(predictions)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)</code></pre>
    </div>

    <h3>FastAPI - Modern Alternative</h3>
    <div class="code-block">
      <pre><code>from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
from typing import List

# Define request/response models
class PredictionRequest(BaseModel):
    features: List[float]

class PredictionResponse(BaseModel):
    prediction: int
    probability: List[float]
    model_version: str

# Load model
model = joblib.load('model.pkl')
scaler = joblib.load('scaler.pkl')

# Create FastAPI app
app = FastAPI(title="ML Model API", version="1.0.0")

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    try:
        # Preprocess
        features = np.array(request.features).reshape(1, -1)
        features_scaled = scaler.transform(features)
        
        # Predict
        prediction = model.predict(features_scaled)
        probability = model.predict_proba(features_scaled)
        
        return PredictionResponse(
            prediction=int(prediction[0]),
            probability=probability[0].tolist(),
            model_version="1.0.0"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Run with: uvicorn main:app --host 0.0.0.0 --port 8000</code></pre>
    </div>

    <h2>🐳 Docker Deployment</h2>

    <h3>Dockerfile</h3>
    <div class="code-block">
      <pre><code># Dockerfile
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY app.py .
COPY model.pkl .
COPY scaler.pkl .

# Expose port
EXPOSE 5000

# Run application
CMD ["python", "app.py"]</code></pre>
    </div>

    <h3>requirements.txt</h3>
    <div class="code-block">
      <pre><code>flask==2.3.0
scikit-learn==1.3.0
numpy==1.24.0
joblib==1.3.0
gunicorn==21.2.0</code></pre>
    </div>

    <h3>Build and Run Docker</h3>
    <div class="code-block">
      <pre><code># Build image
docker build -t ml-model-api:v1 .

# Run container
docker run -d -p 5000:5000 --name ml-api ml-model-api:v1

# Test API
curl -X POST http://localhost:5000/predict \\
  -H "Content-Type: application/json" \\
  -d '{"features": [1.5, 2.3, 3.1, 4.2]}'

# Check logs
docker logs ml-api

# Stop container
docker stop ml-api</code></pre>
    </div>

    <h2>☁️ Cloud Deployment</h2>

    <h3>AWS SageMaker</h3>
    <div class="code-block">
      <pre><code>import boto3
import sagemaker
from sagemaker.sklearn import SKLearnModel

# Initialize SageMaker
sagemaker_session = sagemaker.Session()
role = 'arn:aws:iam::ACCOUNT:role/SageMakerRole'

# Create model artifact
import joblib
joblib.dump(model, 'model.joblib')

# Upload to S3
model_data = sagemaker_session.upload_data(
    path='model.joblib',
    key_prefix='models'
)

# Deploy model
sklearn_model = SKLearnModel(
    model_data=model_data,
    role=role,
    entry_point='inference.py',
    framework_version='1.0-1'
)

predictor = sklearn_model.deploy(
    initial_instance_count=1,
    instance_type='ml.t2.medium'
)

# Make predictions
result = predictor.predict(data)</code></pre>
    </div>

    <h3>Google Cloud AI Platform</h3>
    <div class="code-block">
      <pre><code>from google.cloud import aiplatform

# Initialize
aiplatform.init(project='your-project', location='us-central1')

# Upload model
model = aiplatform.Model.upload(
    display_name='my-model',
    artifact_uri='gs://your-bucket/model/',
    serving_container_image_uri='gcr.io/your-project/model-server'
)

# Deploy to endpoint
endpoint = model.deploy(
    machine_type='n1-standard-4',
    min_replica_count=1,
    max_replica_count=10
)

# Predict
predictions = endpoint.predict(instances=test_data)</code></pre>
    </div>

    <h3>Azure ML</h3>
    <div class="code-block">
      <pre><code>from azureml.core import Workspace, Model
from azureml.core.webservice import AciWebservice, Webservice
from azureml.core.model import InferenceConfig

# Connect to workspace
ws = Workspace.from_config()

# Register model
model = Model.register(
    workspace=ws,
    model_path='model.pkl',
    model_name='my-model'
)

# Configure deployment
inference_config = InferenceConfig(
    entry_script='score.py',
    environment=environment
)

deployment_config = AciWebservice.deploy_configuration(
    cpu_cores=1,
    memory_gb=1
)

# Deploy
service = Model.deploy(
    workspace=ws,
    name='ml-service',
    models=[model],
    inference_config=inference_config,
    deployment_config=deployment_config
)

# Get scoring URI
print(service.scoring_uri)</code></pre>
    </div>

    <h2>📊 Model Monitoring</h2>

    <div class="code-block">
      <pre><code>import logging
from datetime import datetime
import json

# Setup logging
logging.basicConfig(
    filename='model_predictions.log',
    level=logging.INFO,
    format='%(asctime)s - %(message)s'
)

def log_prediction(features, prediction, probability, latency):
    """Log prediction for monitoring"""
    log_data = {
        'timestamp': datetime.now().isoformat(),
        'features': features.tolist(),
        'prediction': int(prediction),
        'probability': probability.tolist(),
        'latency_ms': latency,
        'model_version': '1.0.0'
    }
    logging.info(json.dumps(log_data))

# Monitor data drift
from scipy.stats import ks_2samp

def detect_data_drift(reference_data, new_data, threshold=0.05):
    """Detect data drift using Kolmogorov-Smirnov test"""
    drift_detected = {}
    
    for i in range(reference_data.shape[1]):
        statistic, p_value = ks_2samp(
            reference_data[:, i],
            new_data[:, i]
        )
        drift_detected[f'feature_{i}'] = p_value < threshold
    
    return drift_detected

# Monitor model performance
class ModelMonitor:
    def __init__(self):
        self.predictions = []
        self.true_labels = []
        self.timestamps = []
    
    def log(self, prediction, true_label=None):
        self.predictions.append(prediction)
        if true_label is not None:
            self.true_labels.append(true_label)
        self.timestamps.append(datetime.now())
    
    def calculate_metrics(self):
        if not self.true_labels:
            return None
        
        from sklearn.metrics import accuracy_score, precision_score
        
        return {
            'accuracy': accuracy_score(self.true_labels, self.predictions),
            'precision': precision_score(
                self.true_labels,
                self.predictions,
                average='weighted'
            ),
            'total_predictions': len(self.predictions)
        }</code></pre>
    </div>

    <h2>🔄 Model Versioning</h2>

    <div class="code-block">
      <pre><code>import mlflow
import mlflow.sklearn

# Start MLflow run
with mlflow.start_run():
    # Train model
    model.fit(X_train, y_train)
    
    # Log parameters
    mlflow.log_param("n_estimators", 100)
    mlflow.log_param("max_depth", 10)
    
    # Log metrics
    accuracy = model.score(X_test, y_test)
    mlflow.log_metric("accuracy", accuracy)
    
    # Log model
    mlflow.sklearn.log_model(
        model,
        "model",
        registered_model_name="RandomForestClassifier"
    )

# Load specific version
model_uri = "models:/RandomForestClassifier/1"
loaded_model = mlflow.sklearn.load_model(model_uri)

# Transition model to production
from mlflow.tracking import MlflowClient

client = MlflowClient()
client.transition_model_version_stage(
    name="RandomForestClassifier",
    version=1,
    stage="Production"
)</code></pre>
    </div>

    <h2>🔧 CI/CD for ML</h2>

    <h3>GitHub Actions Workflow</h3>
    <div class="code-block">
      <pre><code># .github/workflows/ml-pipeline.yml
name: ML Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  train-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: '3.9'
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
    
    - name: Run tests
      run: |
        pytest tests/
    
    - name: Train model
      run: |
        python train.py
    
    - name: Evaluate model
      run: |
        python evaluate.py
    
    - name: Build Docker image
      run: |
        docker build -t ml-model:\\$\\{\\{ github.sha \\}\\} .
    
    - name: Push to registry
      run: |
        docker push ml-model:\\$\\{\\{ github.sha \\}\\}
    
    - name: Deploy to production
      if: github.ref == 'refs/heads/main'
      run: |
        kubectl apply -f deployment.yaml</code></pre>
    </div>

    <div class="success-callout">
      <h4>💡 MLOps Best Practices</h4>
      <ul>
        <li>Automate model training and deployment pipelines</li>
        <li>Version control for code, data, and models</li>
        <li>Implement comprehensive monitoring and alerting</li>
        <li>Use A/B testing for model updates</li>
        <li>Maintain model documentation and lineage</li>
        <li>Implement proper security and access controls</li>
        <li>Regular model retraining to prevent drift</li>
        <li>Disaster recovery and rollback plans</li>
      </ul>
    </div>
  </div>`,
  practiceInstructions: [
    "Create a simple Flask API for serving ML predictions",
    "1. Create a Flask app with two endpoints: /health and /predict",
    "2. The /health endpoint should return a JSON status message",
    "3. The /predict endpoint should accept POST requests with 'features' array",
    "4. Return a prediction and confidence score",
    "5. Include error handling",
  ],
  hints: [
    "Use Flask's request.get_json() to get data",
    "Use jsonify() to return JSON responses",
    "Wrap prediction code in try-except blocks",
    "Return appropriate HTTP status codes",
  ],
  solution: `from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)

# Mock model for demonstration
class MockModel:
    def predict(self, X):
        return np.array([1 if x.sum() > 0 else 0 for x in X])
    
    def predict_proba(self, X):
        predictions = self.predict(X)
        return np.array([[1-p, p] for p in predictions])

model = MockModel()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'model': 'ready'}), 200

@app.route('/predict', methods=['POST'])
def predict():
    """Prediction endpoint"""
    try:
        # Get data
        data = request.get_json()
        
        if 'features' not in data:
            return jsonify({'error': 'Missing features'}), 400
        
        # Prepare features
        features = np.array(data['features']).reshape(1, -1)
        
        # Make prediction
        prediction = model.predict(features)
        probability = model.predict_proba(features)
        
        # Return response
        return jsonify({
            'prediction': int(prediction[0]),
            'confidence': float(probability[0][1]),
            'status': 'success'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

# Test with:
# curl -X POST http://localhost:5000/predict \\
#   -H "Content-Type: application/json" \\
#   -d '{"features": [1.5, 2.3, 3.1]}'`,
  starterCode: `from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)

# TODO: Load your model here
# model = joblib.load('model.pkl')

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    # Your code here
    pass

@app.route('/predict', methods=['POST'])
def predict():
    """Prediction endpoint"""
    try:
        # Your code here
        # 1. Get features from request
        # 2. Make prediction
        # 3. Return response
        pass
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)`,
  validationCriteria: {
    requiredIncludes: [
      "Flask",
      "@app.route",
      "def health",
      "def predict",
      "jsonify",
    ],
    forbiddenIncludes: ["pass"],
    minLines: 15,
  },
};
