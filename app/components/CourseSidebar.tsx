import { CheckCircle2, Circle, Lock, PlayCircle } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Progress } from "./ui/progress";
import { ValidationService } from "./lessons/ValidationService";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseSidebarProps {
  currentLessonId: string;
  currentTechnology: string;
  onLessonSelect: (lessonId: string) => void;
}

// Technology-specific lesson modules
const technologyModules: Record<string, Module[]> = {
  // JavaScript/Node.js lessons
  nodejs: [
    {
      id: "1",
      title: "Backend Development Basics",
      lessons: [
        {
          id: "1-1",
          title: "What is Backend Development?",
          duration: "10 min",
          completed: true,
          locked: false,
        },
        {
          id: "1-2",
          title: "HTTP Basics",
          duration: "15 min",
          completed: true,
          locked: false,
        },
        {
          id: "1-3",
          title: "REST API Fundamentals",
          duration: "20 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "2",
      title: "Express.js Development",
      lessons: [
        {
          id: "2-1",
          title: "Getting Started with Express",
          duration: "20 min",
          completed: false,
          locked: false,
        },
        {
          id: "2-2",
          title: "Building Your First API",
          duration: "25 min",
          completed: false,
          locked: false,
        },
        {
          id: "2-3",
          title: "Express Routing & Middleware",
          duration: "30 min",
          completed: false,
          locked: false,
        },
        {
          id: "controllers",
          title: "Controllers & MVC Pattern",
          duration: "35 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "3",
      title: "Database Integration",
      lessons: [
        {
          id: "3-1",
          title: "MongoDB with Mongoose",
          duration: "25 min",
          completed: false,
          locked: false,
        },
        {
          id: "3-2",
          title: "CRUD Operations",
          duration: "30 min",
          completed: false,
          locked: false,
        },
        {
          id: "optimization",
          title: "Performance Optimization",
          duration: "48 min",
          completed: false,
          locked: false,
        },
        {
          id: "seo",
          title: "SEO Best Practices",
          duration: "45 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "4",
      title: "Error & Exception Handling",
      lessons: [
        {
          id: "errors",
          title: "Node.js Error Handling",
          duration: "35 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "5",
      title: "Reference & Cheat Sheets",
      lessons: [
        {
          id: "cheatsheet",
          title: "Node.js Complete Cheat Sheet",
          duration: "Reference",
          completed: false,
          locked: false,
        },
      ],
    },
  ],

  // Python/Flask lessons
  python: [
    {
      id: "1",
      title: "Backend Development Basics",
      lessons: [
        {
          id: "1-1",
          title: "What is Backend Development?",
          duration: "10 min",
          completed: true,
          locked: false,
        },
        {
          id: "1-2",
          title: "HTTP Basics",
          duration: "15 min",
          completed: true,
          locked: false,
        },
        {
          id: "1-3",
          title: "REST API Fundamentals",
          duration: "20 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "2",
      title: "Python Flask Development",
      lessons: [
        {
          id: "3-1",
          title: "Flask Setup & Basic App",
          duration: "15 min",
          completed: false,
          locked: false,
        },
        {
          id: "3-2",
          title: "Flask REST API & JSON",
          duration: "22 min",
          completed: false,
          locked: false,
        },
        {
          id: "3-3",
          title: "Flask Forms & Validation",
          duration: "28 min",
          completed: false,
          locked: false,
        },
        {
          id: "controllers",
          title: "Flask Controllers & Blueprints",
          duration: "35 min",
          completed: false,
          locked: false,
        },
        {
          id: "3-4",
          title: "Flask Database Integration",
          duration: "30 min",
          completed: false,
          locked: false,
        },
        {
          id: "models",
          title: "Creating Database Models",
          duration: "40 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "3",
      title: "Advanced Flask",
      lessons: [
        {
          id: "3-5",
          title: "Flask Blueprints",
          duration: "25 min",
          completed: false,
          locked: false,
        },
        {
          id: "3-6",
          title: "Flask Testing",
          duration: "30 min",
          completed: false,
          locked: false,
        },
        {
          id: "3-7",
          title: "Deployment with Gunicorn",
          duration: "28 min",
          completed: false,
          locked: false,
        },
        {
          id: "optimization",
          title: "Performance Optimization",
          duration: "50 min",
          completed: false,
          locked: false,
        },
        {
          id: "seo",
          title: "SEO Best Practices",
          duration: "48 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "4",
      title: "Data Structures & Algorithms",
      lessons: [
        {
          id: "dsa",
          title: "Python DSA Fundamentals",
          duration: "45 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "5",
      title: "Error & Exception Handling",
      lessons: [
        {
          id: "errors",
          title: "Python Exception Handling",
          duration: "35 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "6",
      title: "Reference & Cheat Sheets",
      lessons: [
        {
          id: "cheatsheet",
          title: "Python Complete Cheat Sheet",
          duration: "Reference",
          completed: false,
          locked: false,
        },
      ],
    },
  ],

  // Django Framework lessons
  django: [
    {
      id: "1",
      title: "Backend Development Basics",
      lessons: [
        {
          id: "1-1",
          title: "What is Backend Development?",
          duration: "10 min",
          completed: true,
          locked: false,
        },
        {
          id: "1-2",
          title: "HTTP Basics",
          duration: "15 min",
          completed: true,
          locked: false,
        },
        {
          id: "1-3",
          title: "REST API Fundamentals",
          duration: "20 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "2",
      title: "Django Fundamentals",
      lessons: [
        {
          id: "intro",
          title: "Introduction to Django",
          duration: "25 min",
          completed: false,
          locked: false,
        },
        {
          id: "models",
          title: "Django Models & ORM",
          duration: "30 min",
          completed: false,
          locked: false,
        },
        {
          id: "views",
          title: "Views & URL Routing",
          duration: "28 min",
          completed: false,
          locked: false,
        },
        {
          id: "templates",
          title: "Django Templates",
          duration: "25 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "3",
      title: "Django REST Framework",
      lessons: [
        {
          id: "api",
          title: "Building REST APIs",
          duration: "35 min",
          completed: false,
          locked: false,
        },
        {
          id: "serializers",
          title: "Serializers & Validation",
          duration: "30 min",
          completed: false,
          locked: false,
        },
        {
          id: "viewsets",
          title: "ViewSets & Routers",
          duration: "32 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "4",
      title: "Authentication & Security",
      lessons: [
        {
          id: "auth",
          title: "Django Authentication",
          duration: "35 min",
          completed: false,
          locked: false,
        },
        {
          id: "permissions",
          title: "Permissions & Authorization",
          duration: "30 min",
          completed: false,
          locked: false,
        },
        {
          id: "jwt",
          title: "JWT Authentication",
          duration: "32 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "5",
      title: "Database & Advanced Topics",
      lessons: [
        {
          id: "database",
          title: "Database Optimization",
          duration: "35 min",
          completed: false,
          locked: false,
        },
        {
          id: "migrations",
          title: "Django Migrations",
          duration: "25 min",
          completed: false,
          locked: false,
        },
        {
          id: "testing",
          title: "Testing Django Apps",
          duration: "30 min",
          completed: false,
          locked: false,
        },
      ],
    },
  ],

  // Java/Spring Boot lessons
  java: [
    {
      id: "1",
      title: "Backend Development Basics",
      lessons: [
        {
          id: "1-1",
          title: "What is Backend Development?",
          duration: "10 min",
          completed: true,
          locked: false,
        },
        {
          id: "1-2",
          title: "HTTP Basics",
          duration: "15 min",
          completed: true,
          locked: false,
        },
        {
          id: "1-3",
          title: "REST API Fundamentals",
          duration: "20 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "2",
      title: "Spring Boot Fundamentals",
      lessons: [
        {
          id: "intro",
          title: "Introduction to Spring Boot",
          duration: "25 min",
          completed: false,
          locked: false,
        },
        {
          id: "mvc",
          title: "Spring MVC & RESTful APIs",
          duration: "30 min",
          completed: false,
          locked: false,
        },
        {
          id: "data",
          title: "Spring Data JPA",
          duration: "35 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "3",
      title: "Advanced Spring Boot",
      lessons: [
        {
          id: "security",
          title: "Spring Security & JWT",
          duration: "40 min",
          completed: false,
          locked: false,
        },
        {
          id: "testing",
          title: "Testing & Production",
          duration: "35 min",
          completed: false,
          locked: false,
        },
        {
          id: "optimization",
          title: "Performance Optimization",
          duration: "52 min",
          completed: false,
          locked: false,
        },
        {
          id: "seo",
          title: "SEO Best Practices",
          duration: "50 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "4",
      title: "Data Structures & Algorithms",
      lessons: [
        {
          id: "dsa",
          title: "Java DSA Fundamentals",
          duration: "45 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "5",
      title: "Error & Exception Handling",
      lessons: [
        {
          id: "errors",
          title: "Java Exception Handling",
          duration: "40 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "6",
      title: "Reference & Cheat Sheets",
      lessons: [
        {
          id: "cheatsheet",
          title: "Java Complete Cheat Sheet",
          duration: "Reference",
          completed: false,
          locked: false,
        },
      ],
    },
  ],

  // C# lessons
  csharp: [
    {
      id: "1",
      title: "Backend Development Basics",
      lessons: [
        {
          id: "1-1",
          title: "What is Backend Development?",
          duration: "10 min",
          completed: true,
          locked: false,
        },
        {
          id: "1-2",
          title: "HTTP Basics",
          duration: "15 min",
          completed: true,
          locked: false,
        },
        {
          id: "1-3",
          title: "REST API Fundamentals",
          duration: "20 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "2",
      title: "ASP.NET Core Fundamentals",
      lessons: [
        {
          id: "intro",
          title: "ASP.NET Core Setup",
          duration: "25 min",
          completed: false,
          locked: false,
        },
        {
          id: "controllers",
          title: "ASP.NET Core Controllers",
          duration: "40 min",
          completed: false,
          locked: false,
        },
        {
          id: "database",
          title: "Entity Framework & Models",
          duration: "30 min",
          completed: false,
          locked: false,
        },
        {
          id: "api",
          title: "ASP.NET Web API & Controllers",
          duration: "35 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "3",
      title: "Advanced ASP.NET Core",
      lessons: [
        {
          id: "auth",
          title: "JWT Authentication & Security",
          duration: "40 min",
          completed: false,
          locked: false,
        },
        {
          id: "testing",
          title: "Testing & Production Deployment",
          duration: "35 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "4",
      title: "Data Structures & Algorithms",
      lessons: [
        {
          id: "dsa",
          title: "C# DSA Fundamentals",
          duration: "45 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "5",
      title: "Error & Exception Handling",
      lessons: [
        {
          id: "errors",
          title: "C# Exception Handling",
          duration: "38 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "6",
      title: "Reference & Cheat Sheets",
      lessons: [
        {
          id: "cheatsheet",
          title: "C# Complete Cheat Sheet",
          duration: "Reference",
          completed: false,
          locked: false,
        },
      ],
    },
  ],

  // Go lessons
  go: [
    {
      id: "1",
      title: "Go Backend Development",
      lessons: [
        {
          id: "intro",
          title: "Go Project Setup & Environment",
          duration: "25 min",
          completed: true,
          locked: false,
        },
        {
          id: "database",
          title: "Database Setup with GORM",
          duration: "35 min",
          completed: false,
          locked: false,
        },
        {
          id: "api",
          title: "REST APIs with Fiber",
          duration: "40 min",
          completed: false,
          locked: false,
        },
        {
          id: "auth",
          title: "JWT Authentication & Security",
          duration: "45 min",
          completed: false,
          locked: false,
        },
        {
          id: "testing",
          title: "Testing & Production Deployment",
          duration: "50 min",
          completed: false,
          locked: false,
        },
      ],
    },
  ],

  // PHP lessons
  php: [
    {
      id: "1",
      title: "PHP & Laravel Fundamentals",
      lessons: [
        {
          id: "intro",
          title: "Laravel Setup & Environment",
          duration: "25 min",
          completed: false,
          locked: false,
        },
        {
          id: "database",
          title: "Eloquent ORM & Database",
          duration: "30 min",
          completed: false,
          locked: false,
        },
        {
          id: "api",
          title: "Laravel API Development",
          duration: "35 min",
          completed: false,
          locked: false,
        },
        {
          id: "auth",
          title: "Laravel Sanctum & Security",
          duration: "40 min",
          completed: false,
          locked: false,
        },
        {
          id: "testing",
          title: "PHPUnit Testing & Production",
          duration: "35 min",
          completed: false,
          locked: false,
        },
      ],
    },
  ],

  // Ruby lessons
  ruby: [
    {
      id: "1",
      title: "Ruby on Rails Development",
      lessons: [
        {
          id: "intro",
          title: "Rails Setup & MVC Architecture",
          duration: "25 min",
          completed: false,
          locked: false,
        },
        {
          id: "database",
          title: "Active Record & Database",
          duration: "30 min",
          completed: false,
          locked: false,
        },
        {
          id: "api",
          title: "Rails API Development",
          duration: "35 min",
          completed: false,
          locked: false,
        },
        {
          id: "auth",
          title: "Devise Authentication",
          duration: "40 min",
          completed: false,
          locked: false,
        },
        {
          id: "testing",
          title: "RSpec Testing & Deployment",
          duration: "35 min",
          completed: false,
          locked: false,
        },
      ],
    },
  ],

  // Rust lessons
  rust: [
    {
      id: "1",
      title: "Rust Backend Development",
      lessons: [
        {
          id: "intro",
          title: "Rust & Actix Web Setup",
          duration: "30 min",
          completed: false,
          locked: false,
        },
        {
          id: "database",
          title: "Diesel ORM & Database",
          duration: "35 min",
          completed: false,
          locked: false,
        },
        {
          id: "api",
          title: "Async REST API Development",
          duration: "40 min",
          completed: false,
          locked: false,
        },
        {
          id: "auth",
          title: "JWT Authentication & Security",
          duration: "45 min",
          completed: false,
          locked: false,
        },
        {
          id: "testing",
          title: "Testing & Performance Optimization",
          duration: "40 min",
          completed: false,
          locked: false,
        },
      ],
    },
  ],

  // TypeScript & Node.js lessons
  typescript: [
    {
      id: "1",
      title: "TypeScript & Node.js Development",
      lessons: [
        {
          id: "intro",
          title: "TypeScript Setup & Express",
          duration: "25 min",
          completed: false,
          locked: false,
        },
        {
          id: "database",
          title: "TypeORM & Database Integration",
          duration: "30 min",
          completed: false,
          locked: false,
        },
        {
          id: "api",
          title: "REST API with Express & TypeScript",
          duration: "35 min",
          completed: false,
          locked: false,
        },
        {
          id: "auth",
          title: "JWT Authentication & Security",
          duration: "40 min",
          completed: false,
          locked: false,
        },
        {
          id: "testing",
          title: "Jest Testing & Production Deployment",
          duration: "35 min",
          completed: false,
          locked: false,
        },
      ],
    },
  ],

  // Next.js lessons
  nextjs: [
    {
      id: "1",
      title: "Backend Development Basics",
      lessons: [
        {
          id: "1-1",
          title: "What is Backend Development?",
          duration: "10 min",
          completed: true,
          locked: false,
        },
        {
          id: "1-2",
          title: "HTTP Basics",
          duration: "15 min",
          completed: true,
          locked: false,
        },
        {
          id: "1-3",
          title: "REST API Fundamentals",
          duration: "20 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "2",
      title: "Next.js App Router & API Routes",
      lessons: [
        {
          id: "intro",
          title: "Next.js Setup & Project Structure",
          duration: "25 min",
          completed: false,
          locked: false,
        },
        {
          id: "api",
          title: "API Routes & Route Handlers",
          duration: "30 min",
          completed: false,
          locked: false,
        },
        {
          id: "database",
          title: "Database Integration with Prisma",
          duration: "35 min",
          completed: false,
          locked: false,
        },
        {
          id: "prisma",
          title: "Prisma Database Models & Schema",
          duration: "45 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "3",
      title: "Advanced Next.js Backend",
      lessons: [
        {
          id: "auth",
          title: "Authentication with NextAuth.js",
          duration: "40 min",
          completed: false,
          locked: false,
        },
        {
          id: "serveractions",
          title: "Server Actions & Mutations",
          duration: "35 min",
          completed: false,
          locked: false,
        },
        {
          id: "deployment",
          title: "Deployment & Production Best Practices",
          duration: "30 min",
          completed: false,
          locked: false,
        },
        {
          id: "optimization",
          title: "Performance Optimization",
          duration: "55 min",
          completed: false,
          locked: false,
        },
        {
          id: "seo",
          title: "SEO Best Practices",
          duration: "52 min",
          completed: false,
          locked: false,
        },
      ],
    },
  ],

  // C++ lessons
  cpp: [
    {
      id: "1",
      title: "Modern C++ Backend Development",
      lessons: [
        {
          id: "intro",
          title: "Modern C++ & Crow Framework",
          duration: "30 min",
          completed: false,
          locked: false,
        },
        {
          id: "database",
          title: "SQLite Integration & SQLiteCpp",
          duration: "35 min",
          completed: false,
          locked: false,
        },
        {
          id: "api",
          title: "REST API with Crow Framework",
          duration: "40 min",
          completed: false,
          locked: false,
        },
        {
          id: "auth",
          title: "JWT Authentication & bcrypt",
          duration: "45 min",
          completed: false,
          locked: false,
        },
        {
          id: "testing",
          title: "Google Test & Deployment",
          duration: "40 min",
          completed: false,
          locked: false,
        },
      ],
    },
  ],

  // SQL Database lessons
  sql: [
    {
      id: "1",
      title: "SQL Fundamentals",
      lessons: [
        {
          id: "sql-basics",
          title: "SQL Query Basics",
          duration: "60 min",
          completed: false,
          locked: false,
        },
      ],
    },
  ],

  // MongoDB & NoSQL lessons
  mongodb: [
    {
      id: "1",
      title: "NoSQL & MongoDB",
      lessons: [
        {
          id: "nosql-mongodb",
          title: "MongoDB Fundamentals",
          duration: "55 min",
          completed: false,
          locked: false,
        },
      ],
    },
  ],
};

// Apply dynamic lesson states based on ValidationService
const applyDynamicLessonStates = (
  modules: Module[],
  technology: string
): Module[] => {
  return modules.map((module) => ({
    ...module,
    lessons: module.lessons.map((lesson) => {
      // Only check if lesson was completed by the user
      const completed = ValidationService.isLessonCompleted(
        lesson.id,
        technology
      );

      return {
        ...lesson,
        completed,
        locked: false, // All lessons are always unlocked
      };
    }),
  }));
};

// Fallback lessons for languages without specific modules
const getModulesForTechnology = (technology: string): Module[] => {
  // Check if we have specific lessons for this technology
  if (technologyModules[technology]) {
    return applyDynamicLessonStates(technologyModules[technology], technology);
  }

  // Generate basic structure for other technologies
  const technologyNames: Record<string, string> = {
    typescript: "TypeScript & Node.js",
    kotlin: "Kotlin Backend",
    swift: "Server-Side Swift",
    scala: "Scala Backend",
    haskell: "Haskell Web",
    ocaml: "OCaml Backend",
  };

  const techName =
    technologyNames[technology] ||
    technology.charAt(0).toUpperCase() + technology.slice(1);

  return [
    {
      id: "1",
      title: "Backend Development Basics",
      lessons: [
        {
          id: "1-1",
          title: "What is Backend Development?",
          duration: "10 min",
          completed: true,
          locked: false,
        },
        {
          id: "1-2",
          title: "HTTP Basics",
          duration: "15 min",
          completed: true,
          locked: false,
        },
        {
          id: "1-3",
          title: "REST API Fundamentals",
          duration: "20 min",
          completed: false,
          locked: false,
        },
      ],
    },
    // Create the fallback modules structure
    {
      id: "3",
      title: `Advanced ${techName}`,
      lessons: [
        {
          id: "8-4",
          title: "Database Integration",
          duration: "30 min",
          completed: false,
          locked: false,
        },
        {
          id: "8-5",
          title: "Authentication",
          duration: "25 min",
          completed: false,
          locked: false,
        },
        {
          id: "8-6",
          title: "Production Deployment",
          duration: "35 min",
          completed: false,
          locked: false,
        },
      ],
    },
  ];

  // Apply dynamic states to fallback lessons too
  const fallbackModules = [
    {
      id: "1",
      title: "Backend Development Basics",
      lessons: [
        {
          id: "1-1",
          title: "What is Backend Development?",
          duration: "10 min",
          completed: true,
          locked: false,
        },
        {
          id: "1-2",
          title: "HTTP Basics",
          duration: "15 min",
          completed: false,
          locked: false,
        },
        {
          id: "1-3",
          title: "REST API Fundamentals",
          duration: "20 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "2",
      title: `${techName} Fundamentals`,
      lessons: [
        {
          id: "2-1",
          title: `Getting Started with ${techName}`,
          duration: "15 min",
          completed: false,
          locked: false,
        },
        {
          id: "2-2",
          title: "Basic Server Setup",
          duration: "20 min",
          completed: false,
          locked: false,
        },
        {
          id: "2-3",
          title: "Routing & Middleware",
          duration: "25 min",
          completed: false,
          locked: false,
        },
      ],
    },
    {
      id: "3",
      title: "Advanced Topics",
      lessons: [
        {
          id: "3-1",
          title: "Database Integration",
          duration: "30 min",
          completed: false,
          locked: false,
        },
        {
          id: "3-2",
          title: "Authentication",
          duration: "25 min",
          completed: false,
          locked: false,
        },
        {
          id: "3-3",
          title: "Testing & Deployment",
          duration: "35 min",
          completed: false,
          locked: false,
        },
      ],
    },
  ];

  return applyDynamicLessonStates(fallbackModules, technology);
};

export function CourseSidebar({
  currentLessonId,
  currentTechnology,
  onLessonSelect,
}: CourseSidebarProps) {
  // Get modules specific to the current technology
  const courseModules = getModulesForTechnology(currentTechnology);

  const totalLessons = courseModules.reduce(
    (acc: number, module: Module) => acc + module.lessons.length,
    0
  );
  const completedLessons = courseModules.reduce(
    (acc: number, module: Module) =>
      acc + module.lessons.filter((l: Lesson) => l.completed).length,
    0
  );
  const progressPercentage = (completedLessons / totalLessons) * 100;

  // Get technology display name
  const getTechnologyDisplayName = (tech: string): string => {
    const techNames: Record<string, string> = {
      nodejs: "Node.js & Express",
      python: "Python & Flask",
      java: "Java & Spring Boot",
      csharp: "C# & .NET Core",
      go: "Go Programming",
      rust: "Rust Programming",
      php: "PHP & Laravel",
      ruby: "Ruby on Rails",
      typescript: "TypeScript & Node.js",
      kotlin: "Kotlin Backend",
      swift: "Server-Side Swift",
      cpp: "C++ Backend",
      scala: "Scala Backend",
      haskell: "Haskell Web",
      ocaml: "OCaml Backend",
      sql: "SQL Databases",
      mongodb: "MongoDB & NoSQL",
    };
    return techNames[tech] || tech.charAt(0).toUpperCase() + tech.slice(1);
  };

  return (
    <div className="w-80 border-r bg-slate-50 flex flex-col h-screen">
      <div className="p-6 border-b bg-white">
        <h2 className="mb-1">{getTechnologyDisplayName(currentTechnology)}</h2>
        <p className="text-slate-600 text-sm mb-4">
          Master backend development with{" "}
          {getTechnologyDisplayName(currentTechnology)}
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Your Progress</span>
            <span className="text-slate-900">
              {completedLessons}/{totalLessons} lessons
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {courseModules.map((module) => (
            <div key={module.id} className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm text-slate-900">{module.title}</h3>
              </div>
              <div className="space-y-1">
                {module.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => !lesson.locked && onLessonSelect(lesson.id)}
                    disabled={lesson.locked}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentLessonId === lesson.id
                        ? "bg-blue-50 border border-blue-200"
                        : lesson.locked
                        ? "bg-white opacity-60 cursor-not-allowed"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {lesson.locked ? (
                          <Lock className="w-4 h-4 text-slate-400" />
                        ) : lesson.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : currentLessonId === lesson.id ? (
                          <PlayCircle className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-slate-900 mb-1">
                          {lesson.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {lesson.duration}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
