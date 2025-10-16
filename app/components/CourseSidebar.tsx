import { CheckCircle2, Circle, Lock, PlayCircle } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Progress } from "./ui/progress";

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
      title: "Node.js & Express Fundamentals",
      lessons: [
        {
          id: "2-1",
          title: "Setting Up Node.js Project",
          duration: "12 min",
          completed: false,
          locked: false,
        },
        {
          id: "2-2",
          title: "Your First Express Server",
          duration: "18 min",
          completed: false,
          locked: false,
        },
        {
          id: "2-3",
          title: "Express Routing & Middleware",
          duration: "25 min",
          completed: false,
          locked: false,
        },
        {
          id: "2-4",
          title: "Error Handling in Express",
          duration: "20 min",
          completed: false,
          locked: true,
        },
        {
          id: "2-5",
          title: "Building RESTful APIs",
          duration: "35 min",
          completed: false,
          locked: true,
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
          locked: true,
        },
        {
          id: "3-2",
          title: "CRUD Operations",
          duration: "30 min",
          completed: false,
          locked: true,
        },
        {
          id: "3-3",
          title: "Database Relations",
          duration: "28 min",
          completed: false,
          locked: true,
        },
      ],
    },
    {
      id: "4",
      title: "Authentication & Security",
      lessons: [
        {
          id: "4-1",
          title: "JWT Authentication",
          duration: "30 min",
          completed: false,
          locked: true,
        },
        {
          id: "4-2",
          title: "Passport.js Integration",
          duration: "25 min",
          completed: false,
          locked: true,
        },
        {
          id: "4-3",
          title: "API Security Best Practices",
          duration: "28 min",
          completed: false,
          locked: true,
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
          locked: true,
        },
        {
          id: "3-4",
          title: "Flask Database Integration",
          duration: "30 min",
          completed: false,
          locked: true,
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
          locked: true,
        },
        {
          id: "3-6",
          title: "Flask Testing",
          duration: "30 min",
          completed: false,
          locked: true,
        },
        {
          id: "3-7",
          title: "Deployment with Gunicorn",
          duration: "28 min",
          completed: false,
          locked: true,
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
          locked: true,
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
          locked: true,
        },
        {
          id: "testing",
          title: "Testing & Production",
          duration: "35 min",
          completed: false,
          locked: true,
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
          locked: true,
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
          locked: true,
        },
        {
          id: "testing",
          title: "Testing & Production Deployment",
          duration: "35 min",
          completed: false,
          locked: true,
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
};

// Fallback lessons for languages without specific modules
const getModulesForTechnology = (technology: string): Module[] => {
  // Check if we have specific lessons for this technology
  if (technologyModules[technology]) {
    return technologyModules[technology];
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
    {
      id: "2",
      title: `${techName} Fundamentals`,
      lessons: [
        {
          id: "8-1",
          title: `${techName} Setup`,
          duration: "15 min",
          completed: false,
          locked: false,
        },
        {
          id: "8-2",
          title: "First Web Server",
          duration: "20 min",
          completed: false,
          locked: true,
        },
        {
          id: "8-3",
          title: "REST API Development",
          duration: "25 min",
          completed: false,
          locked: true,
        },
      ],
    },
    {
      id: "3",
      title: `Advanced ${techName}`,
      lessons: [
        {
          id: "8-4",
          title: "Database Integration",
          duration: "30 min",
          completed: false,
          locked: true,
        },
        {
          id: "8-5",
          title: "Authentication",
          duration: "25 min",
          completed: false,
          locked: true,
        },
        {
          id: "8-6",
          title: "Production Deployment",
          duration: "35 min",
          completed: false,
          locked: true,
        },
      ],
    },
  ];
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
