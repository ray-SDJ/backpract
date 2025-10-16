// Base types for all lesson components
export interface LessonData {
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  objectives: string[];
  content: string;
  practiceInstructions: string[];
  hints: string[];
  solution: string;
}

export interface LessonComponentProps {
  lessonId: string;
}

// Language-specific lesson data
export interface LanguageLessonRegistry {
  [lessonId: string]: LessonData;
}

// Supported programming languages
export type ProgrammingLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "csharp"
  | "go"
  | "rust"
  | "cpp"
  | "php"
  | "ruby"
  | "kotlin"
  | "swift"
  | "scala"
  | "haskell"
  | "ocaml";

// Technology mapping (maps course technology to programming languages)
export const TECHNOLOGY_TO_LANGUAGE_MAP: Record<string, ProgrammingLanguage> = {
  // JavaScript/Node.js ecosystem
  node: "javascript",
  nodejs: "javascript",
  express: "javascript",
  javascript: "javascript",
  js: "javascript",
  react: "javascript",
  vue: "javascript",
  angular: "javascript",
  typescript: "typescript",
  ts: "typescript",

  // Python ecosystem
  python: "python",
  flask: "python",
  django: "python",
  fastapi: "python",

  // Java ecosystem
  java: "java",
  spring: "java",
  springboot: "java",
  "spring boot": "java",
  maven: "java",
  gradle: "java",

  // C# ecosystem
  csharp: "csharp",
  "c#": "csharp",
  dotnet: "csharp",
  ".net": "csharp",
  aspnet: "csharp",

  // Go ecosystem
  go: "go",
  golang: "go",
  gin: "go",
  fiber: "go",

  // Rust ecosystem
  rust: "rust",
  actix: "rust",
  warp: "rust",

  // C++ ecosystem
  cpp: "cpp",
  "c++": "cpp",

  // PHP ecosystem
  php: "php",
  laravel: "php",
  symfony: "php",

  // Ruby ecosystem
  ruby: "ruby",
  rails: "ruby",
  sinatra: "ruby",

  // Other languages
  kotlin: "kotlin",
  swift: "swift",
  scala: "scala",
  haskell: "haskell",
  ocaml: "ocaml",
};
