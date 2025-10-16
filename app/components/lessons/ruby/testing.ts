import { LessonData } from "../types";

const testing: LessonData = {
  title: "Rails Testing & Production Deployment",
  difficulty: "Advanced",
  description:
    "Master testing with RSpec and Rails testing tools, deploy Rails applications, and optimize for production environments.",
  objectives: [
    "Write tests with RSpec and Rails testing",
    "Implement feature and unit tests",
    "Configure production environment",
    "Deploy Rails applications",
  ],
  content: `Rails testing and deployment content with RSpec, production optimization, and deployment strategies.`,
  practiceInstructions: [
    "Install RSpec gem",
    "Write model and controller tests",
    "Configure production environment",
    "Deploy to cloud platform",
  ],
  hints: [
    "Use RSpec for behavior-driven testing",
    "Test controllers and models separately",
    "Use FactoryBot for test data",
    "Configure environment variables for production",
  ],
  solution: `gem 'rspec-rails'\nbundle install\nrails generate rspec:install\nrspec`,
};

export default testing;
