"use client";

import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { CourseSidebar } from "./components/CourseSidebar";
import LessonContent from "./components/LessonContent";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { CompletionScreen } from "./components/CompletionScreen";
import { SessionManager } from "./services/SessionManager";
import { pistonService } from "../lib/piston";
import { Sheet, SheetContent, SheetTrigger } from "./components/ui/sheet";
import { Button } from "./components/ui/button";
import { Menu } from "lucide-react";

type AppState = "welcome" | "learning" | "completed";

export default function App() {
  const [appState, setAppState] = useState<AppState>("welcome");
  const [currentLessonId, setCurrentLessonId] = useState("1-1");
  const [currentTechnology, setCurrentTechnology] = useState("nodejs");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [exitCode, setExitCode] = useState<number | undefined>();
  const [currentCode, setCurrentCode] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const session = SessionManager.getSession();
    if (session) {
      setAppState("learning");
      setCurrentTechnology(session.technology);
      setCurrentLessonId(session.currentLessonId);
    }
  }, []);

  // Clear session on browser refresh or close
  useEffect(() => {
    const handleBeforeUnload = () => {
      SessionManager.clearSession();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Check for completion after each lesson
  useEffect(() => {
    if (appState === "learning" && SessionManager.isSessionComplete()) {
      setAppState("completed");
    }
  }, [appState, currentLessonId]);

  const handleStartSession = (technology: string) => {
    // Get total lessons for the technology (simplified - you can enhance this)
    const totalLessons = 5; // Adjust based on your actual lesson count per technology

    SessionManager.startSession(technology, totalLessons);
    setCurrentTechnology(technology);
    setCurrentLessonId("1-1");
    setAppState("learning");
  };

  const handleRestart = () => {
    SessionManager.clearSession();
    setAppState("welcome");
    setCurrentLessonId("1-1");
    setCurrentTechnology("nodejs");
    setOutput("");
    setError(undefined);
    setExitCode(undefined);
    setCurrentCode("");
  };

  const handleLessonSelect = (lessonId: string) => {
    setCurrentLessonId(lessonId);
    SessionManager.updateCurrentLesson(lessonId);
    setIsSidebarOpen(false); // Close mobile sidebar when lesson is selected
    // Clear output when switching lessons
    setOutput("");
    setError(undefined);
    setExitCode(undefined);
    setCurrentCode(""); // Reset code editor
  };

  const handleCodeChange = (code: string) => {
    setCurrentCode(code);
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

  // Render based on app state
  if (appState === "welcome") {
    return <WelcomeScreen onStart={handleStartSession} />;
  }

  if (appState === "completed") {
    const session = SessionManager.getSession();
    return (
      <CompletionScreen
        technology={currentTechnology}
        completedLessons={session?.completedLessons.length || 0}
        sessionDuration={SessionManager.getSessionDuration()}
        onRestart={handleRestart}
      />
    );
  }

  // Learning state - show main app
  return (
    <div className="flex h-screen bg-white flex-col overflow-hidden">
      {/* Header */}
      <Header
        currentTechnology={currentTechnology}
        onTechnologyChange={handleTechnologyChange}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar - Sheet/Drawer */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <CourseSidebar
              currentLessonId={currentLessonId}
              currentTechnology={currentTechnology}
              onLessonSelect={handleLessonSelect}
            />
          </SheetContent>
        </Sheet>

        {/* Course Sidebar - Hidden on mobile, visible on md+ screens */}
        <div className="hidden md:block">
          <CourseSidebar
            currentLessonId={currentLessonId}
            currentTechnology={currentTechnology}
            onLessonSelect={handleLessonSelect}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <LessonContent
            lessonId={currentLessonId}
            currentTechnology={currentTechnology}
            onRunCode={handleRunCode}
            output={output}
            error={error}
            isRunning={isRunning}
            exitCode={exitCode}
            currentCode={currentCode}
            onCodeChange={handleCodeChange}
            onLessonSelect={handleLessonSelect}
          />
        </div>
      </div>
    </div>
  );
}
