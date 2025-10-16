// Piston API integration for code execution
// Piston is an open-source code execution engine

interface PistonExecuteRequest {
  language: string;
  version: string;
  files: {
    name: string;
    content: string;
  }[];
  stdin?: string;
  args?: string[];
  compile_timeout?: number;
  run_timeout?: number;
}

interface PistonExecuteResponse {
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  language: string;
  version: string;
}

interface PistonRuntimesResponse {
  language: string;
  version: string;
  aliases: string[];
  runtime?: string;
}

// Language mapping for Piston - Major Backend Languages
const LANGUAGE_MAP: Record<
  string,
  { language: string; version: string; extension: string }
> = {
  // Core Backend Languages
  javascript: { language: "javascript", version: "18.15.0", extension: "js" },
  typescript: { language: "typescript", version: "5.0.3", extension: "ts" },
  python: { language: "python", version: "3.10.0", extension: "py" },
  java: { language: "java", version: "15.0.2", extension: "java" },

  // .NET Family
  csharp: { language: "csharp", version: "6.12.0", extension: "cs" },
  "csharp-dotnet": {
    language: "csharp.net",
    version: "5.0.201",
    extension: "cs",
  },

  // Systems Languages
  cpp: { language: "c++", version: "10.2.0", extension: "cpp" },
  c: { language: "c", version: "10.2.0", extension: "c" },
  rust: { language: "rust", version: "1.68.2", extension: "rs" },
  go: { language: "go", version: "1.16.2", extension: "go" },

  // Web Backend Languages
  php: { language: "php", version: "8.2.3", extension: "php" },
  ruby: { language: "ruby", version: "3.0.1", extension: "rb" },

  // JVM Languages
  kotlin: { language: "kotlin", version: "1.8.20", extension: "kt" },
  scala: { language: "scala", version: "3.2.2", extension: "scala" },

  // Functional Languages
  haskell: { language: "haskell", version: "9.0.1", extension: "hs" },
  ocaml: { language: "ocaml", version: "4.12.0", extension: "ml" },

  // Apple
  swift: { language: "swift", version: "5.3.3", extension: "swift" },

  // Scripting
  perl: { language: "perl", version: "5.36.0", extension: "pl" },
  bash: { language: "bash", version: "5.2.0", extension: "sh" },
};

// Default Piston API URL - use local proxy to avoid CORS issues
const PISTON_API_URL = process.env.NEXT_PUBLIC_PISTON_URL || "/api";

export class PistonService {
  private apiUrl: string;

  constructor(apiUrl: string = PISTON_API_URL) {
    this.apiUrl = apiUrl;
  }

  /**
   * Get available runtimes from Piston
   */
  async getRuntimes(): Promise<PistonRuntimesResponse[]> {
    try {
      const response = await fetch(`${this.apiUrl}/runtimes`);
      if (!response.ok) {
        throw new Error(`Failed to fetch runtimes: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching Piston runtimes:", error);
      throw error;
    }
  }

  /**
   * Execute code using Piston
   */
  async executeCode(
    code: string,
    language: string,
    stdin?: string
  ): Promise<PistonExecuteResponse> {
    const langConfig = LANGUAGE_MAP[language.toLowerCase()];

    if (!langConfig) {
      throw new Error(`Unsupported language: ${language}`);
    }

    // Special handling for different languages
    let fileName = `main.${langConfig.extension}`;
    const processedCode = code;

    // For Java, we need to extract the class name
    if (language.toLowerCase() === "java") {
      const classMatch = code.match(/public\s+class\s+(\w+)/);
      if (classMatch) {
        fileName = `${classMatch[1]}.java`;
      }
    }

    const request: PistonExecuteRequest = {
      language: langConfig.language,
      version: langConfig.version,
      files: [
        {
          name: fileName,
          content: processedCode,
        },
      ],
    };

    // Only add optional fields if they have values
    if (stdin) {
      request.stdin = stdin;
    }

    // Add reasonable timeouts
    request.compile_timeout = 10000; // 10 seconds
    request.run_timeout = 3000; // 3 seconds

    console.log("🔧 Piston request:", JSON.stringify(request, null, 2));
    console.log("🌐 API URL:", `${this.apiUrl}/execute`);
    console.log(
      "🔍 Request body size:",
      JSON.stringify(request).length,
      "bytes"
    );

    try {
      console.log("📡 Making fetch request...");
      const response = await fetch(`${this.apiUrl}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      console.log("📡 Response status:", response.status, response.statusText);

      if (!response.ok) {
        let errorText = "";
        try {
          errorText = await response.text();
        } catch {
          errorText = "Could not read error response";
        }
        console.error("❌ API Error Response:", errorText);
        console.error(
          "❌ Response headers:",
          Object.fromEntries(response.headers)
        );
        throw new Error(
          `Piston API error: ${response.status} ${response.statusText}${
            errorText ? ` - ${errorText}` : ""
          }`
        );
      }

      const result: PistonExecuteResponse = await response.json();
      console.log("✅ Piston result:", result);
      return result;
    } catch (error) {
      console.error("❌ Error executing code with Piston:", error);
      throw error;
    }
  }

  /**
   * Format the execution result for display
   */
  formatExecutionResult(result: PistonExecuteResponse): {
    output: string;
    error?: string;
    exitCode: number;
  } {
    let output = "";
    let error: string | undefined;

    // If compilation failed, show compile errors
    if (result.compile && result.compile.code !== 0) {
      error = `Compilation Error:\n${
        result.compile.stderr || result.compile.output
      }`;
      return {
        output: result.compile.stdout || "",
        error,
        exitCode: result.compile.code,
      };
    }

    // Show runtime output
    output = result.run.stdout || result.run.output || "";

    // If runtime failed, show runtime errors
    if (result.run.code !== 0) {
      const stderr = result.run.stderr || "";
      if (stderr) {
        error = `Runtime Error (Exit Code ${result.run.code}):\n${stderr}`;
      }
    }

    return {
      output,
      error,
      exitCode: result.run.code,
    };
  }

  /**
   * Create sample code templates for different backend scenarios
   */
  getTemplateCode(
    language: string,
    template: "basic" | "api" | "hello"
  ): string {
    const lang = language.toLowerCase();

    if (template === "hello") {
      switch (lang) {
        // JavaScript/TypeScript
        case "javascript":
          return 'console.log("Hello, World!");';
        case "typescript":
          return 'console.log("Hello, World!");';

        // Python
        case "python":
          return 'print("Hello, World!")';

        // Java
        case "java":
          return `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`;

        // C# / .NET
        case "csharp":
        case "csharp-dotnet":
          return `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`;

        // C/C++
        case "c":
          return `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`;
        case "cpp":
          return `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`;

        // Modern Systems Languages
        case "rust":
          return `fn main() {
    println!("Hello, World!");
}`;
        case "go":
          return `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`;

        // Web Backend Languages
        case "php":
          return `<?php
echo "Hello, World!\\n";
?>`;
        case "ruby":
          return 'puts "Hello, World!"';

        // JVM Languages
        case "kotlin":
          return `fun main() {
    println("Hello, World!")
}`;
        case "scala":
          return `object Main extends App {
    println("Hello, World!")
}`;

        // Functional Languages
        case "haskell":
          return `main :: IO ()
main = putStrLn "Hello, World!"`;
        case "ocaml":
          return `print_endline "Hello, World!";;`;

        // Apple
        case "swift":
          return `print("Hello, World!")`;

        // Scripting
        case "perl":
          return 'print "Hello, World!\\n";';
        case "bash":
          return 'echo "Hello, World!"';

        default:
          return 'console.log("Hello, World!");';
      }
    }

    // Return empty template for practice
    return "";
  }
}

// Export singleton instance
export const pistonService = new PistonService();
