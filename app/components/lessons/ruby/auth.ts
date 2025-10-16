import { LessonData } from "../types";

const auth: LessonData = {
  title: "Rails Authentication & Security",
  difficulty: "Advanced",
  description:
    "Implement authentication with Devise or JWT tokens, add authorization, and secure Rails applications with best practices.",
  objectives: [
    "Set up Devise authentication gem",
    "Implement JWT token authentication",
    "Add role-based authorization",
    "Secure API endpoints with authentication",
  ],
  content: `Rails authentication content with Devise gem, JWT tokens, and security best practices.`,
  practiceInstructions: [
    "Install Devise gem",
    "Generate User model with Devise",
    "Configure JWT authentication",
    "Protect API routes",
  ],
  hints: [
    "Use Devise for traditional authentication",
    "Consider JWT for API-only applications",
    "Implement role-based access control",
    "Always use HTTPS in production",
  ],
  solution: `gem 'devise'\nbundle install\nrails generate devise:install\nrails generate devise User`,
};

export default auth;
