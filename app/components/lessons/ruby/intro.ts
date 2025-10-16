import { LessonData } from "../types";

const intro: LessonData = {
  title: "Ruby on Rails Project Setup",
  difficulty: "Beginner",
  description:
    "Learn to set up a Ruby on Rails development environment, create new Rails projects, and understand the MVC architecture with Rails conventions.",
  objectives: [
    "Install Ruby and Rails framework",
    "Create new Rails project with generators",
    "Understand Rails directory structure and MVC pattern",
    "Configure database and run Rails server",
  ],
  content: `Rails project setup content with Ruby installation, Rails new command, and MVC architecture explanation.`,
  practiceInstructions: [
    "Install Ruby 3.0+ and Rails 7+",
    "Create new Rails project",
    "Configure database in config/database.yml",
    "Start Rails server with rails server",
  ],
  hints: [
    "Use rbenv or RVM for Ruby version management",
    "Rails follows convention over configuration",
    "Use rails generate commands for scaffolding",
    "Check Rails version with rails --version",
  ],
  solution: `gem install rails\nrails new rails_api --api\ncd rails_api\nrails server`,
};

export default intro;
