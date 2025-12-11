"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Play, RotateCcw, Copy, Check } from "lucide-react";
import { Button } from "./ui/button";

interface CodeEditorProps {
  onRunCode: (code: string, language: string) => void;
  currentTechnology?: string;
  currentLessonId?: string;
  initialCode?: string;
  onCodeChange?: (code: string) => void;
}

// Language mapping from technology to executor language
const TECH_TO_LANGUAGE: Record<string, string> = {
  nodejs: "javascript",
  python: "python",
  java: "java",
  csharp: "csharp",
  go: "go",
  rust: "rust",
  php: "php",
  ruby: "ruby",
  typescript: "typescript",
  kotlin: "kotlin",
  swift: "swift",
  cpp: "cpp",
  scala: "scala",
  haskell: "haskell",
  ocaml: "ocaml",
  nextjs: "typescript",
  sql: "sql",
  mongodb: "javascript",
};

// Default starter code templates
const DEFAULT_CODE: Record<string, string> = {
  javascript: `// JavaScript/Node.js
console.log("Hello from Node.js!");

// Write your code here...
`,
  python: `# Python
print("Hello from Python!")

# Write your code here...
`,
  typescript: `// TypeScript
console.log("Hello from TypeScript!");

// Write your code here...
`,
  java: `// Java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        
        // Write your code here...
    }
}`,
  csharp: `// C#
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello from C#!");
        
        // Write your code here...
    }
}`,
  go: `// Go
package main

import "fmt"

func main() {
    fmt.Println("Hello from Go!")
    
    // Write your code here...
}`,
  rust: `// Rust
fn main() {
    println!("Hello from Rust!");
    
    // Write your code here...
}`,
  php: `<?php
// PHP
echo "Hello from PHP!\\n";

// Write your code here...
?>`,
  ruby: `# Ruby
puts "Hello from Ruby!"

# Write your code here...
`,
  cpp: `// C++
#include <iostream>

int main() {
    std::cout << "Hello from C++!" << std::endl;
    
    // Write your code here...
    
    return 0;
}`,
  kotlin: `// Kotlin
fun main() {
    println("Hello from Kotlin!")
    
    // Write your code here...
}`,
  swift: `// Swift
print("Hello from Swift!")

// Write your code here...
`,
  sql: `-- SQL
SELECT 'Hello from SQL!' as message;

-- Write your queries here...
`,
};

export function CodeEditor({
  onRunCode,
  currentTechnology = "nodejs",
  initialCode,
  onCodeChange,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);

  // Get language from technology
  const language = TECH_TO_LANGUAGE[currentTechnology] || "javascript";

  // Initialize code
  const [code, setCode] = useState(() => {
    if (initialCode) return initialCode;
    return DEFAULT_CODE[language] || DEFAULT_CODE.javascript;
  });

  // Update code when initialCode changes
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

  // Notify parent of code changes
  useEffect(() => {
    onCodeChange?.(code);
  }, [code, onCodeChange]);

  // Handle code execution
  const handleRun = useCallback(() => {
    onRunCode(code, language);
  }, [code, language, onRunCode]);

  // Handle reset
  const handleReset = () => {
    const resetCode =
      initialCode || DEFAULT_CODE[language] || DEFAULT_CODE.javascript;
    setCode(resetCode);
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRun]);

  // Handle tab key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);

      // Set cursor position after the inserted tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  // Get language display name
  const getLanguageName = () => {
    const names: Record<string, string> = {
      javascript: "JavaScript",
      python: "Python",
      java: "Java",
      csharp: "C#",
      go: "Go",
      rust: "Rust",
      php: "PHP",
      ruby: "Ruby",
      typescript: "TypeScript",
      cpp: "C++",
      kotlin: "Kotlin",
      swift: "Swift",
      sql: "SQL",
    };
    return names[language] || language.toUpperCase();
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm font-medium text-slate-300">
            {getLanguageName()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 px-3 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-3 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
            title="Reset code"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={handleRun}
            className="h-8 px-4 bg-green-600 hover:bg-green-700 text-white font-medium"
            title="Run code (Ctrl+Enter)"
          >
            <Play className="w-4 h-4 mr-1.5" />
            Run
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-auto">
        <div className="relative h-full">
          {/* Line numbers */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-800 border-r border-slate-700 py-4 overflow-hidden select-none">
            <div className="text-right pr-3 text-xs text-slate-500 font-mono leading-6">
              {code.split("\n").map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          </div>

          {/* Code textarea */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-full pl-14 pr-4 py-4 bg-transparent text-slate-100 font-mono text-sm leading-6 resize-none focus:outline-none"
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder={`Write your ${getLanguageName()} code here...`}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-t border-slate-700">
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>Lines: {code.split("\n").length}</span>
          <span>Characters: {code.length}</span>
        </div>
        <div className="text-xs text-slate-400">
          Press{" "}
          <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">
            Ctrl+Enter
          </kbd>{" "}
          to run
        </div>
      </div>
    </div>
  );
}
