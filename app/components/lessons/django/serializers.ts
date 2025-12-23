import { LessonData } from "../types";

export const lessonData: LessonData = {
  title: "Serializers & Validation",
  description:
    "Master Django REST Framework serializers for data validation, transformation, and complex relationships.",
  difficulty: "Intermediate",
  content: `<div class="lesson-content">
    <p>Serializers convert complex data types (model instances, querysets) to Python data types that can be rendered into JSON, XML, or other formats.</p>

    <h2>Custom Validation</h2>
    
    <pre class="code-block">
      <code>
from rest_framework import serializers

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
    
    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("Title too short")
        return value
    
    def validate(self, data):
        if data['title'] == data['content']:
            raise serializers.ValidationError("Title and content cannot be the same")
        return data
      </code>
    </pre>

    <h2>Nested Serializers</h2>
    
    <pre class="code-block">
      <code>
class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name', 'email']

class BookSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    author_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'author_id']
      </code>
    </pre>
  </div>`,

  objectives: [
    "Implement custom field validation",
    "Create nested serializers",
    "Handle read-only and write-only fields",
  ],

  practiceInstructions: [
    "Create a serializer with custom validation",
    "Add a field-level validator to check minimum length",
    "Add an object-level validator",
  ],

  starterCode: `from rest_framework import serializers

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'text', 'rating']
    
    # TODO: Add validate_text method
    # Ensure text is at least 10 characters
    
    # TODO: Add validate method
    # Ensure rating is between 1 and 5`,

  solution: `from rest_framework import serializers

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'text', 'rating']
    
    def validate_text(self, value):
        if len(value) < 10:
            raise serializers.ValidationError("Comment must be at least 10 characters long")
        return value
    
    def validate(self, data):
        if data['rating'] < 1 or data['rating'] > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return data`,

  hints: [
    "Use validate_<field_name> for field-level validation",
    "Use validate() for object-level validation",
    "Raise serializers.ValidationError for invalid data",
    "Always return the value/data after validation",
  ],
};

export default lessonData;
