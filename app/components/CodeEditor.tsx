"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, RotateCcw, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { pistonService } from "../../lib/piston";

interface CodeEditorProps {
  onRunCode: (code: string, language: string) => void;
  currentTechnology?: string;
  currentLessonId?: string;
  initialCode?: string; // External code to initialize with
  onCodeChange?: (code: string) => void; // Callback when code changes
}

const starterCode: Record<string, string> = {
  // Core Backend Languages
  javascript: `// Node.js Basic Example - Click Run to test!
console.log("🚀 Welcome to Backend Practice!");
console.log("This is Node.js JavaScript execution");

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

console.log("\\n📊 Sample API Response:");
console.log(JSON.stringify({
  success: true,
  data: users,
  message: "Users retrieved successfully"
}, null, 2));

// TODO: Replace this with your Express server code
console.log("\\n✨ Ready to build your Express API!");`,

  typescript: `// TypeScript Basic Example - Click Run to test!
console.log("🚀 Welcome to Backend Practice!");
console.log("This is TypeScript execution");

interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

console.log("\\n📊 Sample API Response:");
console.log(JSON.stringify({
  success: true,
  data: users,
  message: "Users retrieved successfully"
}, null, 2));

// TODO: Build your TypeScript backend!
console.log("\\n✨ Ready to build with TypeScript!");`,

  python: `# Python Flask Example - Click Run to test!
print("🐍 Welcome to Backend Practice!")
print("This is Python execution")

users = [
    {'id': 1, 'name': 'John Doe', 'email': 'john@example.com'},
    {'id': 2, 'name': 'Jane Smith', 'email': 'jane@example.com'}
]

print("\\n📊 Sample API Response:")
import json
response = {
    'success': True,
    'data': users,
    'message': 'Users retrieved successfully'
}
print(json.dumps(response, indent=2))

# TODO: Replace this with your Flask server code
print("\\n✨ Ready to build your Flask API!")`,

  java: `// Java Spring Boot Example - Click Run to test!
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("☕ Welcome to Backend Practice!");
        System.out.println("This is Java execution");
        
        List<Map<String, Object>> users = Arrays.asList(
            Map.of("id", 1, "name", "John Doe", "email", "john@example.com"),
            Map.of("id", 2, "name", "Jane Smith", "email", "jane@example.com")
        );
        
        System.out.println("\\n📊 Sample API Response:");
        Map<String, Object> response = Map.of(
            "success", true,
            "data", users,
            "message", "Users retrieved successfully"
        );
        System.out.println(response);
        
        System.out.println("\\n✨ Ready to build your Spring Boot API!");
    }
}`,

  // .NET Family
  csharp: `// C# Backend Example - Click Run to test!
using System;
using System.Collections.Generic;

class Program {
    static void Main() {
        Console.WriteLine("🚀 Welcome to Backend Practice!");
        Console.WriteLine("This is C# execution");
        
        var users = new[] {
            new { id = 1, name = "John Doe", email = "john@example.com" },
            new { id = 2, name = "Jane Smith", email = "jane@example.com" }
        };
        
        Console.WriteLine("\\n📊 Sample API Response:");
        Console.WriteLine("{ \\"success\\": true, \\"data\\": [...] }");
        
        Console.WriteLine("\\n✨ Ready to build your ASP.NET API!");
    }
}`,

  "csharp-dotnet": `// C# .NET Core Backend - Click Run to test!
using System;
using System.Collections.Generic;

class Program {
    static void Main() {
        Console.WriteLine("🚀 Welcome to Backend Practice!");
        Console.WriteLine("This is C# .NET Core execution");
        
        var users = new[] {
            new { id = 1, name = "John Doe", email = "john@example.com" },
            new { id = 2, name = "Jane Smith", email = "jane@example.com" }
        };
        
        Console.WriteLine("\\n📊 Sample API Response:");
        Console.WriteLine("{ \\"success\\": true, \\"data\\": [...] }");
        
        Console.WriteLine("\\n✨ Ready to build your .NET Core API!");
    }
}`,

  // Systems Languages
  cpp: `// C++ Backend Example - Click Run to test!
#include <iostream>
#include <vector>
#include <string>

struct User {
    int id;
    std::string name;
    std::string email;
};

int main() {
    std::cout << "🚀 Welcome to Backend Practice!" << std::endl;
    std::cout << "This is C++ execution" << std::endl;
    
    std::vector<User> users = {
        {1, "John Doe", "john@example.com"},
        {2, "Jane Smith", "jane@example.com"}
    };
    
    std::cout << "\\n📊 Sample API Response:" << std::endl;
    std::cout << "{ \\"success\\": true, \\"data\\": [...] }" << std::endl;
    
    std::cout << "\\n✨ Ready to build with C++!" << std::endl;
    
    return 0;
}`,

  go: `// Go Backend Example - Click Run to test!
package main

import (
    "encoding/json"
    "fmt"
)

type User struct {
    ID    int    \`json:"id"\`
    Name  string \`json:"name"\`
    Email string \`json:"email"\`
}

func main() {
    fmt.Println("🚀 Welcome to Backend Practice!")
    fmt.Println("This is Go execution")
    
    users := []User{
        {1, "John Doe", "john@example.com"},
        {2, "Jane Smith", "jane@example.com"},
    }
    
    response := map[string]interface{}{
        "success": true,
        "data":    users,
        "message": "Users retrieved successfully",
    }
    
    fmt.Println("\\n📊 Sample API Response:")
    jsonData, _ := json.MarshalIndent(response, "", "  ")
    fmt.Println(string(jsonData))
    
    fmt.Println("\\n✨ Ready to build your Go API!")
}`,

  rust: `// Rust Backend Example - Click Run to test!
fn main() {
    println!("🚀 Welcome to Backend Practice!");
    println!("This is Rust execution");
    
    let users = vec![
        ("John Doe", "john@example.com"),
        ("Jane Smith", "jane@example.com"),
    ];
    
    println!("\\n📊 Sample API Response:");
    println!("{{ \\"success\\": true, \\"data\\": [...] }}");
    
    println!("\\n✨ Ready to build with Rust!");
}`,

  // Web Backend
  php: `<?php
// PHP Backend Example - Click Run to test!
echo "🚀 Welcome to Backend Practice!\\n";
echo "This is PHP execution\\n";

$users = [
    ['id' => 1, 'name' => 'John Doe', 'email' => 'john@example.com'],
    ['id' => 2, 'name' => 'Jane Smith', 'email' => 'jane@example.com']
];

echo "\\n📊 Sample API Response:\\n";
echo json_encode([
    'success' => true,
    'data' => $users,
    'message' => 'Users retrieved successfully'
], JSON_PRETTY_PRINT);

echo "\\n\\n✨ Ready to build your PHP API!\\n";
?>`,

  ruby: `# Ruby Backend Example - Click Run to test!
puts "🚀 Welcome to Backend Practice!"
puts "This is Ruby execution"

users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
]

puts "\\n📊 Sample API Response:"
require 'json'
response = {
  success: true,
  data: users,
  message: 'Users retrieved successfully'
}
puts JSON.pretty_generate(response)

puts "\\n✨ Ready to build your Ruby on Rails API!"`,

  // Default for other languages
  c: `// C Backend Example
#include <stdio.h>

int main() {
    printf("🚀 Welcome to Backend Practice!\\n");
    printf("This is C execution\\n");
    return 0;
}`,

  kotlin: `// Kotlin Backend Example
fun main() {
    println("🚀 Welcome to Backend Practice!")
    println("This is Kotlin execution")
    
    val users = listOf(
        mapOf("id" to 1, "name" to "John Doe", "email" to "john@example.com"),
        mapOf("id" to 2, "name" to "Jane Smith", "email" to "jane@example.com")
    )
    
    println("\\n📊 Sample API Response:")
    println("{ \\"success\\": true, \\"data\\": [...] }")
    
    println("\\n✨ Ready to build with Kotlin!")
}`,

  swift: `// Swift Backend Example
print("🚀 Welcome to Backend Practice!")
print("This is Swift execution")

let users = [
    ["id": 1, "name": "John Doe", "email": "john@example.com"],
    ["id": 2, "name": "Jane Smith", "email": "jane@example.com"]
]

print("\\n📊 Sample API Response:")
print("{ \\"success\\": true, \\"data\\": [...] }")

print("\\n✨ Ready to build with Swift!")`,

  // JVM Languages
  scala: `// Scala Backend Example - Click Run to test!
object Main extends App {
  println("🚀 Welcome to Backend Practice!")
  println("This is Scala execution")
  
  case class User(id: Int, name: String, email: String)
  
  val users = List(
    User(1, "John Doe", "john@example.com"),
    User(2, "Jane Smith", "jane@example.com")
  )
  
  println("\\n📊 Sample API Response:")
  println("{ \\"success\\": true, \\"data\\": [...] }")
  
  println("\\n✨ Ready to build with Scala and Akka HTTP!")
}`,

  // Functional Languages
  haskell: `-- Haskell Backend Example - Click Run to test!
main = do
    putStrLn "🚀 Welcome to Backend Practice!"
    putStrLn "This is Haskell execution"
    
    let users = [("John Doe", "john@example.com"), 
                 ("Jane Smith", "jane@example.com")]
    
    putStrLn "\\n📊 Sample API Response:"
    putStrLn "{ \\"success\\": true, \\"data\\": [...] }"
    
    putStrLn "\\n✨ Ready to build with Haskell and Servant!"`,

  ocaml: `(* OCaml Backend Example - Click Run to test! *)
let () =
  Printf.printf "🚀 Welcome to Backend Practice!\\n";
  Printf.printf "This is OCaml execution\\n";
  
  let users = [
    (1, "John Doe", "john@example.com");
    (2, "Jane Smith", "jane@example.com")
  ] in
  
  Printf.printf "\\n📊 Sample API Response:\\n";
  Printf.printf "{ \\"success\\": true, \\"data\\": [...] }\\n";
  
  Printf.printf "\\n✨ Ready to build with OCaml and Dream!"`,

  // Scripting languages for completeness
  bash: `#!/bin/bash
# Bash Backend Scripting Example
echo "🚀 Welcome to Backend Practice!"
echo "This is Bash execution"

echo "\\n📊 Sample API Response:"
echo '{ "success": true, "data": [...] }'

echo "\\n✨ Ready to build shell scripts!"`,

  perl: `# Perl Backend Example
print "🚀 Welcome to Backend Practice!\\n";
print "This is Perl execution\\n";

my @users = (
    { id => 1, name => 'John Doe', email => 'john@example.com' },
    { id => 2, name => 'Jane Smith', email => 'jane@example.com' }
);

print "\\n📊 Sample API Response:\\n";
print "{ \\"success\\": true, \\"data\\": [...] }\\n";

print "\\n✨ Ready to build with Perl!\\n";`,
};

export function CodeEditor({
  onRunCode,
  currentTechnology = "nodejs",
  initialCode,
  onCodeChange,
}: CodeEditorProps) {
  // Comprehensive mapping from technology to code editor language
  const getLanguageFromTech = (tech: string) => {
    switch (tech) {
      // Primary Backend Languages
      case "nodejs":
        return "javascript";
      case "python":
        return "python";
      case "java":
        return "java";
      case "csharp":
        return "csharp";
      case "go":
        return "go";
      case "rust":
        return "rust";
      case "php":
        return "php";
      case "ruby":
        return "ruby";
      case "typescript":
        return "typescript";
      case "kotlin":
        return "kotlin";
      case "swift":
        return "swift";
      case "cpp":
        return "cpp";
      case "scala":
        return "scala";
      case "haskell":
        return "haskell";
      case "ocaml":
        return "ocaml";
      // Default fallback
      default:
        return "javascript";
    }
  };

  const [language, setLanguage] = useState(
    getLanguageFromTech(currentTechnology)
  );
  const [code, setCode] = useState(
    initialCode || starterCode[getLanguageFromTech(currentTechnology)]
  );

  // Update language and code when technology changes or initialCode changes
  useEffect(() => {
    const newLanguage = getLanguageFromTech(currentTechnology);
    setLanguage(newLanguage);
    const newCode = initialCode || starterCode[newLanguage];
    setCode(newCode);
  }, [currentTechnology, initialCode]);

  // Call onCodeChange when code changes
  useEffect(() => {
    if (onCodeChange) {
      onCodeChange(code);
    }
  }, [code, onCodeChange]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    const newCode =
      initialCode || starterCode[newLanguage as keyof typeof starterCode] || "";
    setCode(newCode);
  };

  const handleReset = () => {
    const resetCode =
      initialCode || starterCode[language as keyof typeof starterCode] || "";
    setCode(resetCode);
  };

  const handleRunCode = useCallback(() => {
    console.log("🎯 CodeEditor - Running code:", {
      code: code.substring(0, 50) + "...",
      language,
      currentTechnology,
    });
    onRunCode(code, language);
  }, [code, language, onRunCode, currentTechnology]);

  const handleTestConnection = async () => {
    const testCode = pistonService.getTemplateCode(language, "hello");
    console.log("🧪 Test Connection:", {
      testCode,
      language,
      currentTechnology,
    });
    onRunCode(testCode, language);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        handleRunCode();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleRunCode]);

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-300">Language:</span>
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-40 h-8 bg-slate-700 border-slate-600 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {/* Core Backend Languages */}
                <SelectItem value="javascript">JavaScript (Node.js)</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>

                {/* .NET Family */}
                <SelectItem value="csharp">C# (Mono)</SelectItem>
                <SelectItem value="csharp-dotnet">C# (.NET Core)</SelectItem>

                {/* Systems Languages */}
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="c">C</SelectItem>
                <SelectItem value="rust">Rust</SelectItem>
                <SelectItem value="go">Go</SelectItem>

                {/* Web Backend */}
                <SelectItem value="php">PHP</SelectItem>
                <SelectItem value="ruby">Ruby</SelectItem>

                {/* JVM Languages */}
                <SelectItem value="kotlin">Kotlin</SelectItem>
                <SelectItem value="scala">Scala</SelectItem>

                {/* Functional */}
                <SelectItem value="haskell">Haskell</SelectItem>
                <SelectItem value="ocaml">OCaml</SelectItem>

                {/* Apple */}
                <SelectItem value="swift">Swift</SelectItem>

                {/* Scripting */}
                <SelectItem value="perl">Perl</SelectItem>
                <SelectItem value="bash">Bash</SelectItem>
              </SelectContent>
            </Select>
            {currentTechnology && (
              <span className="text-xs text-slate-400 bg-slate-600 px-2 py-1 rounded">
                Auto-set from {currentTechnology}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestConnection}
            className="h-8 text-slate-300 border-slate-600 hover:text-slate-100 hover:bg-slate-700"
            title="Test Piston connection with Hello World"
          >
            <Zap className="w-4 h-4 mr-2" />
            Test
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 text-slate-300 hover:text-slate-100 hover:bg-slate-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleRunCode}
            className="h-8 bg-green-600 hover:bg-green-700 text-white"
            title="Run Code (Ctrl+Enter)"
          >
            <Play className="w-4 h-4 mr-2" />
            Run Code
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full min-h-[400px] bg-transparent text-slate-100 font-mono text-sm resize-none focus:outline-none [&]:tab-2"
            spellCheck={false}
            placeholder={`Write your ${
              language === "javascript"
                ? "Node.js/Express"
                : language === "typescript"
                ? "TypeScript"
                : language === "python"
                ? "Flask/Python"
                : language === "java"
                ? "Java/Spring Boot"
                : language === "csharp" || language === "csharp-dotnet"
                ? "C#/.NET"
                : language === "cpp"
                ? "C++"
                : language === "go"
                ? "Go"
                : language === "rust"
                ? "Rust"
                : language === "php"
                ? "PHP"
                : language === "ruby"
                ? "Ruby"
                : language === "kotlin"
                ? "Kotlin"
                : language === "swift"
                ? "Swift"
                : language.charAt(0).toUpperCase() + language.slice(1)
            } code here...\n\n✨ Code executes with Piston engine!\n🔍 Click "Test" for a Hello World example\n⚡ Press Ctrl+Enter to run your code`}
            aria-label="Code editor"
          />
        </div>
      </ScrollArea>
    </div>
  );
}
