"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Code2, Sparkles, Rocket } from "lucide-react";

interface WelcomeScreenProps {
  onStart: (technology: string) => void;
}

const technologies = [
  {
    id: "nodejs",
    name: "Node.js & Express",
    description: "Build backend APIs with JavaScript",
    icon: "🟢",
  },
  {
    id: "python",
    name: "Python & Flask",
    description: "Create web services with Python",
    icon: "🐍",
  },
  {
    id: "django",
    name: "Django Framework",
    description: "Full-featured Python web framework",
    icon: "🎸",
  },
  {
    id: "java",
    name: "Java & Spring Boot",
    description: "Enterprise Java development",
    icon: "☕",
  },
  {
    id: "csharp",
    name: "C# & .NET Core",
    description: "Modern .NET applications",
    icon: "🔷",
  },
  {
    id: "go",
    name: "Go Programming",
    description: "Fast and efficient Go services",
    icon: "🔵",
  },
  {
    id: "rust",
    name: "Rust Programming",
    description: "Systems programming with Rust",
    icon: "🦀",
  },
  {
    id: "php",
    name: "PHP Development",
    description: "Web development with PHP",
    icon: "🐘",
  },
  {
    id: "ruby",
    name: "Ruby on Rails",
    description: "Rapid web app development",
    icon: "💎",
  },
  {
    id: "nextjs",
    name: "Next.js & React",
    description: "Full-stack React framework",
    icon: "⚡",
  },
  {
    id: "sql",
    name: "SQL Databases",
    description: "Master relational database queries",
    icon: "🗄️",
  },
  {
    id: "mongodb",
    name: "MongoDB & NoSQL",
    description: "Document-based database operations",
    icon: "🍃",
  },
  {
    id: "graphql",
    name: "GraphQL APIs",
    description: "Build flexible, type-safe APIs",
    icon: "📊",
  },
];

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const handleStart = () => {
    if (selectedTech) {
      onStart(selectedTech);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-4">
            <Code2 className="w-8 h-8 md:w-12 md:h-12 text-blue-600" />
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
              Backend Practice
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-600 mb-2 px-4">
            Master Backend Development Through Practice
          </p>
          <p className="text-sm md:text-base text-gray-500 px-4">
            Choose your language, complete hands-on lessons, and become a
            backend expert
          </p>
        </div>

        {/* Technology Selection */}
        <div className="mb-6 md:mb-8 px-2">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
            Choose Your Technology
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {technologies.map((tech) => (
              <Card
                key={tech.id}
                className={`p-3 md:p-6 cursor-pointer transition-all hover:shadow-lg border-2 ${
                  selectedTech === tech.id
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => setSelectedTech(tech.id)}
              >
                <div className="text-center">
                  <div className="text-2xl md:text-4xl mb-2 md:mb-3">
                    {tech.icon}
                  </div>
                  <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-1 md:mb-2">
                    {tech.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 hidden sm:block">
                    {tech.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center px-4">
          <Button
            onClick={handleStart}
            disabled={!selectedTech}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            <Rocket className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Start Learning{" "}
            <span className="hidden sm:inline">
              {selectedTech
                ? technologies.find((t) => t.id === selectedTech)?.name
                : ""}
            </span>
          </Button>

          {!selectedTech && (
            <p className="text-xs md:text-sm text-gray-500 mt-4">
              Please select a technology to get started
            </p>
          )}
        </div>

        {/* Features */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4">
          <div className="text-center p-3 md:p-4">
            <div className="text-2xl md:text-3xl mb-2">📚</div>
            <h3 className="font-semibold text-sm md:text-base text-gray-800 mb-1">
              Structured Lessons
            </h3>
            <p className="text-xs md:text-sm text-gray-600">
              Follow a clear learning path from basics to advanced
            </p>
          </div>
          <div className="text-center p-3 md:p-4">
            <div className="text-2xl md:text-3xl mb-2">💻</div>
            <h3 className="font-semibold text-sm md:text-base text-gray-800 mb-1">
              Hands-On Practice
            </h3>
            <p className="text-xs md:text-sm text-gray-600">
              Write real code and validate your solutions
            </p>
          </div>
          <div className="text-center p-3 md:p-4">
            <div className="text-2xl md:text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-sm md:text-base text-gray-800 mb-1">
              Track Progress
            </h3>
            <p className="text-xs md:text-sm text-gray-600">
              Monitor your learning journey and achievements
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
