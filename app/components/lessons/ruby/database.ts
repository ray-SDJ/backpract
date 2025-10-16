import { LessonData } from "../types";

const database: LessonData = {
  title: "Active Record ORM & Database Management",
  difficulty: "Intermediate",
  description:
    "Master Active Record ORM for database operations, create migrations, define model associations, and implement advanced querying.",
  objectives: [
    "Create Rails migrations and models",
    "Define Active Record associations",
    "Implement database queries with Active Record",
    "Use Rails console for database testing",
  ],
  content: `Active Record ORM content with migrations, model associations, and querying techniques.`,
  practiceInstructions: [
    "Generate models with rails generate model",
    "Create database migrations",
    "Define has_many and belongs_to relationships",
    "Test queries in Rails console",
  ],
  hints: [
    "Use rails generate migration for schema changes",
    "Active Record follows naming conventions",
    "Use rails db:migrate to run migrations",
    "Test associations in rails console",
  ],
  solution: `rails generate model Post title:string content:text\nrails db:migrate\nrails console`,
};

export default database;
