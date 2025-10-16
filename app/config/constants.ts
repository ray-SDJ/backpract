export const APP_CONFIG = {
  name: "BackPract",
  version: "1.0.0",
  description: "Interactive Backend Development Learning Platform",
  technologies: ["Node.js", "Python Flask", "Java Spring Boot"],
  features: [
    "Interactive Code Editor",
    "Real-time Code Execution",
    "Progress Tracking",
    "Comprehensive Lessons",
    "Multi-Technology Support",
  ],
  author: "BackPract Team",
  repository: "https://github.com/your-username/backpract",
} as const;

export const LESSON_CATEGORIES = {
  FUNDAMENTALS: "fundamentals",
  API_DEVELOPMENT: "api-development",
  DATABASE: "database",
  AUTHENTICATION: "authentication",
  ADVANCED: "advanced",
} as const;

export const TECHNOLOGIES = {
  NODEJS: "nodejs",
  PYTHON: "python",
  JAVA: "java",
} as const;
