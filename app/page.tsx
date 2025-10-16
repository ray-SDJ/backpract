"use client";

import { useState } from "react";
import { Header } from "./components/Header";
import { CourseSidebar } from "./components/CourseSidebar";
import LessonContent from "./components/LessonContent";
import { CodeEditor } from "./components/CodeEditor";
import { OutputConsole } from "./components/OutputConsole";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import { pistonService } from "../lib/piston";

export default function App() {
  const [currentLessonId, setCurrentLessonId] = useState("1-3");
  const [currentTechnology, setCurrentTechnology] = useState("nodejs");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [exitCode, setExitCode] = useState<number | undefined>();

  const handleLessonSelect = (lessonId: string) => {
    setCurrentLessonId(lessonId);
    // Clear output when switching lessons
    setOutput("");
    setError(undefined);
    setExitCode(undefined);
  };

  const handleRunCode = async (code: string, language: string) => {
    console.log("🚀 Running code:", {
      code: code.substring(0, 100) + "...",
      language,
    });
    setIsRunning(true);
    setError(undefined);
    setExitCode(undefined);

    try {
      // Execute code using Piston
      console.log("📡 Calling Piston API...");
      const result = await pistonService.executeCode(code, language);
      console.log("✅ Piston response:", result);

      const formatted = pistonService.formatExecutionResult(result);
      console.log("📋 Formatted result:", formatted);

      setOutput(formatted.output);
      setError(formatted.error);
      setExitCode(formatted.exitCode);
    } catch (error) {
      console.error("❌ Code execution error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to execute code"
      );
      setExitCode(1);
      setOutput("");
    } finally {
      setIsRunning(false);
    }
  };

  const handleTechnologyChange = (technology: string) => {
    setCurrentTechnology(technology);
    // Reset lesson when switching technologies
    setCurrentLessonId("1-1");
    setOutput("");
    setError(undefined);
    setExitCode(undefined);
  };

  return (
    <div className="flex h-screen bg-white flex-col">
      {/* Header */}
      <Header
        currentTechnology={currentTechnology}
        onTechnologyChange={handleTechnologyChange}
      />

      <div className="flex flex-1">
        {/* Course Sidebar */}
        <CourseSidebar
          currentLessonId={currentLessonId}
          currentTechnology={currentTechnology}
          onLessonSelect={handleLessonSelect}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <ResizablePanelGroup direction="vertical">
            {/* Lesson Content Section */}
            <ResizablePanel defaultSize={45} minSize={30}>
              <LessonContent
                lessonId={currentLessonId}
                currentTechnology={currentTechnology}
              />
            </ResizablePanel>

            <ResizableHandle className="h-1 bg-slate-200 hover:bg-blue-400 transition-colors" />

            {/* Code Editor and Output Section */}
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}
