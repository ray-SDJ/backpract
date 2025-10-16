import { LessonData } from "../types";

const api: LessonData = {
  title: "Rails RESTful API Development",
  difficulty: "Intermediate",
  description:
    "Build RESTful APIs with Rails controllers, implement JSON responses, add validation, and handle errors properly.",
  objectives: [
    "Create API controllers with Rails",
    "Implement RESTful routes and actions",
    "Add JSON serialization and responses",
    "Handle API errors and validation",
  ],
  content: `Rails API development content with controllers, routes, serializers, and error handling.`,
  practiceInstructions: [
    "Generate API controllers",
    "Define routes in config/routes.rb",
    "Implement CRUD actions",
    "Test API endpoints",
  ],
  hints: [
    "Use rails generate controller for API controllers",
    "Rails routes follow RESTful conventions",
    "Use render json: for API responses",
    "Add strong parameters for security",
  ],
  solution: `rails generate controller Api::Posts\n# Add routes and controller actions\ncurl http://localhost:3000/api/posts`,
};

export default api;
