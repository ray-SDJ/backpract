import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Deep Learning with TensorFlow & Keras",
  description:
    "Master neural networks and deep learning using TensorFlow and Keras. Build and train deep learning models for complex tasks.",
  difficulty: "Advanced",
  objectives: [
    "Understand neural networks and deep learning concepts",
    "Learn TensorFlow and Keras APIs",
    "Build and train neural networks",
    "Implement CNNs for image recognition",
    "Work with RNNs and LSTMs for sequential data",
  ],
  content: `<div class="lesson-content">
    <h2>🧠 Introduction to Deep Learning</h2>
    <p>
      Deep Learning is a subset of machine learning based on artificial neural networks. It excels at learning complex patterns from large amounts of data and has revolutionized fields like computer vision, natural language processing, and speech recognition.
    </p>

    <h3>Why Deep Learning?</h3>
    <ul>
      <li><strong>Automatic feature learning:</strong> No need for manual feature engineering</li>
      <li><strong>Scalability:</strong> Performance improves with more data</li>
      <li><strong>Versatility:</strong> Works for images, text, audio, and more</li>
      <li><strong>State-of-the-art:</strong> Best performance on many challenging tasks</li>
    </ul>

    <h2>🔧 TensorFlow and Keras</h2>
    <p>
      TensorFlow is an open-source deep learning framework developed by Google. Keras is a high-level API built on top of TensorFlow that makes building neural networks simple and intuitive.
    </p>

    <div class="code-block">
      <pre><code># Installation
pip install tensorflow

# Import libraries
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

print(f"TensorFlow version: {tf.__version__}")</code></pre>
    </div>

    <h2>🏗️ Building Neural Networks</h2>

    <h3>Basic Neural Network Architecture</h3>
    <div class="code-block">
      <pre><code>from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout

# Sequential API - Linear stack of layers
model = Sequential([
    Dense(128, activation='relu', input_shape=(784,)),  # Input layer
    Dropout(0.2),                                       # Regularization
    Dense(64, activation='relu'),                       # Hidden layer
    Dropout(0.2),
    Dense(10, activation='softmax')                     # Output layer
])

# Model summary
model.summary()

# Compile model
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# Train model
history = model.fit(
    X_train, y_train,
    epochs=10,
    batch_size=32,
    validation_split=0.2,
    verbose=1
)

# Evaluate
test_loss, test_accuracy = model.evaluate(X_test, y_test)
print(f"Test accuracy: {test_accuracy:.2f}")</code></pre>
    </div>

    <h3>Functional API - More Flexible</h3>
    <div class="code-block">
      <pre><code>from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, concatenate

# For complex architectures with multiple inputs/outputs
input_a = Input(shape=(32,), name='input_a')
input_b = Input(shape=(32,), name='input_b')

# Process inputs separately
x = Dense(64, activation='relu')(input_a)
y = Dense(64, activation='relu')(input_b)

# Combine
combined = concatenate([x, y])

# Output
output = Dense(10, activation='softmax')(combined)

# Create model
model = Model(inputs=[input_a, input_b], outputs=output)

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)</code></pre>
    </div>

    <h2>📸 Convolutional Neural Networks (CNNs)</h2>
    <p>
      CNNs are specialized for processing grid-like data (images). They use convolutional layers to automatically learn spatial hierarchies of features.
    </p>

    <div class="code-block">
      <pre><code>from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten

# CNN for image classification
model = Sequential([
    # Convolutional layers
    Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
    MaxPooling2D((2, 2)),
    
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    
    Conv2D(64, (3, 3), activation='relu'),
    
    # Flatten and fully connected layers
    Flatten(),
    Dense(64, activation='relu'),
    Dropout(0.5),
    Dense(10, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# Load and preprocess images
from tensorflow.keras.datasets import mnist
(X_train, y_train), (X_test, y_test) = mnist.load_data()

# Reshape and normalize
X_train = X_train.reshape(-1, 28, 28, 1).astype('float32') / 255
X_test = X_test.reshape(-1, 28, 28, 1).astype('float32') / 255

# Train
history = model.fit(
    X_train, y_train,
    epochs=5,
    batch_size=128,
    validation_data=(X_test, y_test)
)</code></pre>
    </div>

    <h3>Transfer Learning with Pre-trained Models</h3>
    <div class="code-block">
      <pre><code>from tensorflow.keras.applications import VGG16, ResNet50, MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Load pre-trained model (without top layers)
base_model = MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights='imagenet'
)

# Freeze base model layers
base_model.trainable = False

# Add custom layers
model = Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(256, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(num_classes, activation='softmax')
])

# Compile and train on your custom dataset
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Data augmentation
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

# Train
history = model.fit(
    train_datagen.flow(X_train, y_train, batch_size=32),
    epochs=10,
    validation_data=(X_val, y_val)
)</code></pre>
    </div>

    <h2>🔄 Recurrent Neural Networks (RNNs)</h2>
    <p>
      RNNs are designed for sequential data (text, time series, audio). They maintain a "memory" of previous inputs through their internal state.
    </p>

    <h3>LSTM for Text Classification</h3>
    <div class="code-block">
      <pre><code>from tensorflow.keras.layers import LSTM, Embedding, Bidirectional
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Prepare text data
tokenizer = Tokenizer(num_words=10000)
tokenizer.fit_on_texts(texts)

sequences = tokenizer.texts_to_sequences(texts)
X = pad_sequences(sequences, maxlen=100)

# Build LSTM model
model = Sequential([
    Embedding(input_dim=10000, output_dim=128, input_length=100),
    LSTM(64, return_sequences=True),
    LSTM(32),
    Dense(64, activation='relu'),
    Dropout(0.5),
    Dense(1, activation='sigmoid')  # Binary classification
])

model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# Train
history = model.fit(
    X_train, y_train,
    epochs=10,
    batch_size=32,
    validation_split=0.2
)</code></pre>
    </div>

    <h3>Bidirectional LSTM</h3>
    <div class="code-block">
      <pre><code># Process sequences in both directions
model = Sequential([
    Embedding(10000, 128, input_length=100),
    Bidirectional(LSTM(64, return_sequences=True)),
    Bidirectional(LSTM(32)),
    Dense(64, activation='relu'),
    Dropout(0.5),
    Dense(num_classes, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)</code></pre>
    </div>

    <h2>⚙️ Training Optimization</h2>

    <h3>Callbacks</h3>
    <div class="code-block">
      <pre><code>from tensorflow.keras.callbacks import (
    EarlyStopping,
    ModelCheckpoint,
    ReduceLROnPlateau,
    TensorBoard
)

# Early stopping
early_stop = EarlyStopping(
    monitor='val_loss',
    patience=5,
    restore_best_weights=True
)

# Save best model
checkpoint = ModelCheckpoint(
    'best_model.h5',
    monitor='val_accuracy',
    save_best_only=True,
    mode='max'
)

# Reduce learning rate when stuck
reduce_lr = ReduceLROnPlateau(
    monitor='val_loss',
    factor=0.5,
    patience=3,
    min_lr=0.00001
)

# TensorBoard logging
tensorboard = TensorBoard(log_dir='./logs')

# Train with callbacks
history = model.fit(
    X_train, y_train,
    epochs=50,
    batch_size=32,
    validation_split=0.2,
    callbacks=[early_stop, checkpoint, reduce_lr, tensorboard]
)</code></pre>
    </div>

    <h3>Custom Training Loop</h3>
    <div class="code-block">
      <pre><code>import tensorflow as tf

# Define optimizer and loss
optimizer = tf.keras.optimizers.Adam()
loss_fn = tf.keras.losses.SparseCategoricalCrossentropy()

# Training step
@tf.function
def train_step(x, y):
    with tf.GradientTape() as tape:
        predictions = model(x, training=True)
        loss = loss_fn(y, predictions)
    
    gradients = tape.gradient(loss, model.trainable_variables)
    optimizer.apply_gradients(zip(gradients, model.trainable_variables))
    
    return loss

# Training loop
for epoch in range(epochs):
    for batch, (x_batch, y_batch) in enumerate(train_dataset):
        loss = train_step(x_batch, y_batch)
        
        if batch % 100 == 0:
            print(f"Epoch {epoch}, Batch {batch}, Loss: {loss:.4f}")</code></pre>
    </div>

    <h2>💾 Saving and Loading Models</h2>

    <div class="code-block">
      <pre><code># Save entire model
model.save('my_model.h5')
model.save('my_model')  # SavedModel format (recommended)

# Load model
loaded_model = tf.keras.models.load_model('my_model.h5')

# Save only weights
model.save_weights('model_weights.h5')

# Load weights
model.load_weights('model_weights.h5')

# Save architecture only
json_config = model.to_json()
with open('model_architecture.json', 'w') as f:
    f.write(json_config)

# Recreate model from JSON
from tensorflow.keras.models import model_from_json
with open('model_architecture.json', 'r') as f:
    json_config = f.read()
model = model_from_json(json_config)</code></pre>
    </div>

    <h2>🎨 Visualization</h2>

    <div class="code-block">
      <pre><code>import matplotlib.pyplot as plt

# Plot training history
def plot_history(history):
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
    
    # Accuracy
    ax1.plot(history.history['accuracy'], label='Train')
    ax1.plot(history.history['val_accuracy'], label='Validation')
    ax1.set_title('Model Accuracy')
    ax1.set_xlabel('Epoch')
    ax1.set_ylabel('Accuracy')
    ax1.legend()
    
    # Loss
    ax2.plot(history.history['loss'], label='Train')
    ax2.plot(history.history['val_loss'], label='Validation')
    ax2.set_title('Model Loss')
    ax2.set_xlabel('Epoch')
    ax2.set_ylabel('Loss')
    ax2.legend()
    
    plt.tight_layout()
    plt.show()

plot_history(history)</code></pre>
    </div>

    <div class="success-callout">
      <h4>💡 Deep Learning Best Practices</h4>
      <ul>
        <li>Start with a simple architecture and gradually increase complexity</li>
        <li>Use pre-trained models when possible (transfer learning)</li>
        <li>Implement early stopping to prevent overfitting</li>
        <li>Normalize/standardize your input data</li>
        <li>Use data augmentation for image tasks</li>
        <li>Monitor training with TensorBoard</li>
        <li>Experiment with different optimizers and learning rates</li>
        <li>Use GPU/TPU for faster training</li>
      </ul>
    </div>
  </div>`,
  practiceInstructions: [
    "Build a simple neural network using Keras",
    "1. Create a Sequential model with 3 Dense layers",
    "2. First layer: 128 neurons with ReLU activation",
    "3. Second layer: 64 neurons with ReLU activation",
    "4. Output layer: 10 neurons with softmax activation",
    "5. Compile the model with 'adam' optimizer and 'sparse_categorical_crossentropy' loss",
    "6. Print the model summary",
  ],
  hints: [
    "Use Sequential([...]) to create the model",
    "Each Dense layer needs units and activation parameters",
    "Don't forget to specify input_shape in the first layer",
    "Use model.compile() to configure the model",
    "Use model.summary() to print the architecture",
  ],
  solution: `from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

def create_neural_network():
    """
    Create a simple neural network for classification.
    
    Returns:
        model: Compiled Keras model
    """
    # Build model
    model = Sequential([
        Dense(128, activation='relu', input_shape=(784,)),
        Dense(64, activation='relu'),
        Dense(10, activation='softmax')
    ])
    
    # Compile model
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Print summary
    print("Model Architecture:")
    model.summary()
    
    return model

# Create the model
model = create_neural_network()

# Example usage (with MNIST data)
# from tensorflow.keras.datasets import mnist
# (X_train, y_train), (X_test, y_test) = mnist.load_data()
# X_train = X_train.reshape(-1, 784).astype('float32') / 255
# X_test = X_test.reshape(-1, 784).astype('float32') / 255
# model.fit(X_train, y_train, epochs=5, validation_split=0.2)`,
  starterCode: `from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

def create_neural_network():
    """
    Create a simple neural network for classification.
    
    Returns:
        model: Compiled Keras model
    """
    # Your code here
    # 1. Create Sequential model with 3 Dense layers
    # 2. Layer 1: 128 units, relu, input_shape=(784,)
    # 3. Layer 2: 64 units, relu
    # 4. Layer 3: 10 units, softmax
    # 5. Compile with adam and sparse_categorical_crossentropy
    # 6. Print summary
    pass

# Create the model
model = create_neural_network()`,
  validationCriteria: {
    requiredIncludes: ["Sequential", "Dense", "compile", "summary", "return"],
    forbiddenIncludes: ["pass"],
    minLines: 10,
  },
};
