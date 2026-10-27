"use client";

import { Code, Trophy, HelpCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { ProgressModal } from "./ProgressModal";
import { HelpModal } from "./HelpModal";

interface HeaderProps {
  currentTechnology: string;
  onTechnologyChange: (tech: string) => void;
  onHome: () => void;
}

// Move technologies array outside component to prevent re-creation on every render
const technologies = [
  // Primary Backend Languages
  {
    id: "nodejs",
    name: "Node.js",
    icon: "🟢",
    description: "JavaScript backend with Express",
  },
  {
    id: "python",
    name: "Python",
    icon: "🐍",
    description: "Flask web framework",
  },
  {
    id: "django",
    name: "Django",
    icon: "🎸",
    description: "Python web framework",
  },
  {
    id: "java",
    name: "Java",
    icon: "☕",
    description: "Spring Boot framework",
  },
  {
    id: "csharp",
    name: "C#",
    icon: "🔷",
    description: ".NET Core & ASP.NET",
  },
  {
    id: "go",
    name: "Go",
    icon: "🐹",
    description: "High-performance backend",
  },
  {
    id: "rust",
    name: "Rust",
    icon: "🦀",
    description: "Systems programming & web",
  },
  {
    id: "php",
    name: "PHP",
    icon: "🐘",
    description: "Laravel & Symfony",
  },
  {
    id: "ruby",
    name: "Ruby",
    icon: "💎",
    description: "Ruby on Rails",
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: "🔷",
    description: "Type-safe Node.js backend",
  },
  {
    id: "cpp",
    name: "C++",
    icon: "⚡",
    description: "High-performance backends",
  },
  {
    id: "nextjs",
    name: "Next.js",
    icon: "⚡",
    description: "Full-stack React framework",
  },
  {
    id: "sql",
    name: "SQL",
    icon: "🗄️",
    description: "Relational database queries",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    icon: "🍃",
    description: "Document-based NoSQL",
  },
  {
    id: "graphql",
    name: "GraphQL",
    icon: "📊",
    description: "Flexible, type-safe APIs",
  },
  {
    id: "ml",
    name: "Machine Learning",
    icon: "🤖",
    description: "Intelligent applications with ML",
  },
];

export function Header({
  currentTechnology,
  onTechnologyChange,
  onHome,
}: HeaderProps) {
  const currentTech =
    technologies.find((t) => t.id === currentTechnology) || technologies[0];

  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-3 md:px-6 flex-shrink-0">
      <div className="flex items-center gap-2 md:gap-4">
        <button
          type="button"
          onClick={onHome}
          title="Back to homepage"
          className="flex items-center gap-1 md:gap-2 cursor-pointer"
        >
          <Code className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
          <h1 className="text-base md:text-xl font-semibold hidden sm:block">
            Backend Practice
          </h1>
          <h1 className="text-base md:text-xl font-semibold sm:hidden">
            BackPract
          </h1>
          <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
            v1.0
          </Badge>
        </button>

        <div className="h-6 w-px bg-slate-300 hidden sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="gap-1 md:gap-2 text-sm md:text-base"
            >
              <span className="text-base md:text-lg">{currentTech.icon}</span>
              <span className="hidden sm:inline">{currentTech.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>Choose Technology</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {technologies.map((tech) => (
              <DropdownMenuItem
                key={tech.id}
                onClick={() => onTechnologyChange(tech.id)}
                className={`cursor-pointer ${
                  tech.id === currentTechnology ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">{tech.icon}</span>
                  <div>
                    <div className="font-medium">{tech.name}</div>
                    <div className="text-xs text-slate-500">
                      {tech.description}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <ProgressModal
          currentTechnology={currentTechnology}
          technologyName={currentTech.name}
        >
          <Button variant="ghost" size="sm" className="gap-1 md:gap-2">
            <Trophy className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">Progress</span>
          </Button>
        </ProgressModal>
        <HelpModal>
          <Button variant="ghost" size="sm" className="gap-1 md:gap-2">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">Help</span>
          </Button>
        </HelpModal>{" "}
      </div>
    </header>
  );
}
