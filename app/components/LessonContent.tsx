import {
  BookOpen,
  Lightbulb,
  CheckCircle,
  Code,
  Loader2,
  Play,
  CheckSquare,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

import { useEffect, useState } from "react";
import { LessonRegistry } from "./lessons/LessonRegistry";
import { LessonData } from "./lessons/types";
import { LessonHTML } from "./lessons/LessonCard";
import { CodeEditor } from "./CodeEditor";
import { OutputConsole } from "./OutputConsole";
import {
  ValidationService,
  ValidationResult,
} from "./lessons/ValidationService";

interface LessonContentProps {
  lessonId: string;
  currentTechnology: string;
  onRunCode: (code: string, language: string) => Promise<void>;
  output: string;
  error: string | undefined;
  isRunning: boolean;
  exitCode: number | undefined;
  currentCode?: string; // Current code in editor
  onCodeChange?: (code: string) => void; // Callback when code changes
  onLessonSelect?: (lessonId: string) => void; // Callback to navigate to next lesson
}

export default function LessonContent({
  lessonId,
  currentTechnology,
  onRunCode,
  output,
  error: codeError,
  isRunning,
  exitCode,
  currentCode = "",
  onCodeChange,
  onLessonSelect,
}: LessonContentProps) {
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isCheckingWork, setIsCheckingWork] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await LessonRegistry.getLessonData(
          lessonId,
          currentTechnology
        );

        if (data) {
          setLessonData(data);
        } else {
          const generalData = await LessonRegistry.getLessonData(lessonId);
          if (generalData) {
            setLessonData(generalData);
          } else {
            setError(`Lesson ${lessonId} not found`);
          }
        }
      } catch (err) {
        console.error("Error loading lesson:", err);
        setError("Failed to load lesson content");
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [lessonId, currentTechnology]);

  // Check lesson completion status
  useEffect(() => {
    const completed = ValidationService.isLessonCompleted(
      lessonId,
      currentTechnology
    );
    setIsLessonCompleted(completed);
  }, [lessonId, currentTechnology]);

  // Validate practice exercise
  const handleValidatePractice = () => {
    if (!lessonData?.validationCriteria || !currentCode) {
      setValidationResult({
        valid: false,
        message: "Please write some code first!",
        completedCriteria: [],
        failedCriteria: ["No code provided"],
      });
      return;
    }

    const result = ValidationService.validateCode(
      currentCode,
      lessonData.validationCriteria
    );
    setValidationResult(result);

    if (result.valid) {
      ValidationService.markLessonCompleted(lessonId, currentTechnology);
      setIsLessonCompleted(true);
    }
  };

  // Check work with AI
  const handleCheckWork = async () => {
    if (!currentCode || !lessonData?.solution) {
      setAiError("No code to check or solution not available");
      return;
    }

    setIsCheckingWork(true);
    setAiError(null);
    setAiFeedback(null);

    try {
      const response = await fetch("/api/compare-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: currentCode,
          lessonSolution: lessonData.solution,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAiFeedback(data.feedback);
      } else {
        setAiError(data.error || "Failed to get AI feedback");
      }
    } catch (error) {
      console.error("Error checking work:", error);
      setAiError("Failed to connect to AI service");
    } finally {
      setIsCheckingWork(false);
    }
  };

  // Get previous lesson ID
  const getPreviousLessonId = (): string | null => {
    // Define lesson sequences for different technologies
    const lessonSequences: Record<string, string[]> = {
      java: [
        "1-1",
        "1-2",
        "1-3",
        "intro",
        "mvc",
        "data",
        "security",
        "testing",
      ],
      csharp: [
        "1-1",
        "1-2",
        "1-3",
        "intro",
        "database",
        "api",
        "auth",
        "testing",
      ],
      go: ["intro", "database", "api", "auth", "testing"],
      php: ["intro", "database", "api", "auth", "testing"],
      ruby: ["intro", "database", "api", "auth", "testing"],
      rust: ["intro", "database", "api", "auth", "testing"],
      typescript: ["intro", "database", "api", "auth", "testing"],
      cpp: ["intro", "database", "api", "auth", "testing"],
      python: [
        "1-1",
        "1-2",
        "1-3",
        "3-1",
        "3-2",
        "3-3",
        "3-4",
        "3-5",
        "3-6",
        "3-7",
      ],
      nodejs: ["1-1", "1-2", "1-3", "3-1", "3-2", "3-3", "4-1", "4-2", "4-3"],
    };

    const sequence = lessonSequences[currentTechnology];
    if (!sequence) return null;

    const currentIndex = sequence.indexOf(lessonId);
    if (currentIndex <= 0) return null;

    return sequence[currentIndex - 1];
  };

  // Get next lesson ID
  const getNextLessonId = (): string | null => {
    // Define lesson sequences for different technologies
    const lessonSequences: Record<string, string[]> = {
      java: [
        "1-1",
        "1-2",
        "1-3",
        "intro",
        "mvc",
        "data",
        "security",
        "testing",
      ],
      csharp: [
        "1-1",
        "1-2",
        "1-3",
        "intro",
        "database",
        "api",
        "auth",
        "testing",
      ],
      go: ["intro", "database", "api", "auth", "testing"],
      php: ["intro", "database", "api", "auth", "testing"],
      ruby: ["intro", "database", "api", "auth", "testing"],
      rust: ["intro", "database", "api", "auth", "testing"],
      typescript: ["intro", "database", "api", "auth", "testing"],
      cpp: ["intro", "database", "api", "auth", "testing"],
      python: [
        "1-1",
        "1-2",
        "1-3",
        "3-1",
        "3-2",
        "3-3",
        "3-4",
        "3-5",
        "3-6",
        "3-7",
      ],
      nodejs: ["1-1", "1-2", "1-3", "3-1", "3-2", "3-3", "4-1", "4-2", "4-3"],
    };

    const sequence = lessonSequences[currentTechnology];
    if (!sequence) return null;

    const currentIndex = sequence.indexOf(lessonId);
    if (currentIndex === -1 || currentIndex >= sequence.length - 1) return null;

    return sequence[currentIndex + 1];
  };

  // Handle previous lesson navigation
  const handlePreviousLesson = () => {
    const previousLessonId = getPreviousLessonId();
    if (previousLessonId && onLessonSelect) {
      onLessonSelect(previousLessonId);
    }
  };

  // Handle next lesson navigation
  const handleNextLesson = () => {
    // Navigate to next lesson without requiring completion
    const nextLessonId = getNextLessonId();
    if (nextLessonId && onLessonSelect) {
      onLessonSelect(nextLessonId);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-slate-600">Loading lesson content...</span>
        </div>
      </div>
    );
  }

  if (error || !lessonData) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Lesson Not Available
          </h3>
          <p className="text-slate-600 mb-4">
            {error || "This lesson is not available yet."}
          </p>
          <div className="text-sm text-slate-500 space-y-1">
            <p>
              <strong>Lesson ID:</strong> {lessonId}
            </p>
            <p>
              <strong>Technology:</strong> {currentTechnology}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b bg-slate-50 px-3 md:px-6 py-3 md:py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 gap-2">
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            <h1 className="text-base md:text-xl font-semibold text-slate-900">
              {lessonData.title}
            </h1>
            <Badge className={getDifficultyColor(lessonData.difficulty)}>
              {lessonData.difficulty}
            </Badge>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              onClick={handlePreviousLesson}
              disabled={!getPreviousLessonId()}
              size="sm"
              variant="outline"
              className="flex items-center gap-1 md:gap-2 flex-1 md:flex-none"
            >
              <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm">Back</span>
            </Button>
            <Button
              onClick={handleNextLesson}
              size="sm"
              className="flex items-center gap-1 md:gap-2 bg-green-600 hover:bg-green-700 flex-1 md:flex-none"
            >
              <span className="text-xs md:text-sm">Next</span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
          </div>
        </div>
        <p className="text-slate-600 text-xs md:text-sm mb-2 md:mb-3">
          {lessonData.description}
        </p>
        <div className="text-xs text-slate-500">
          <span className="font-medium">Technology:</span> {currentTechnology} •
          <span className="font-medium ml-2">Lesson:</span> {lessonId}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="content" className="flex flex-col h-full">
          <div className="border-b px-2 md:px-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger
                value="content"
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm"
              >
                <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Content</span>
              </TabsTrigger>
              <TabsTrigger
                value="objectives"
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm"
              >
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Objectives</span>
              </TabsTrigger>
              <TabsTrigger
                value="practice"
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm"
              >
                <Code className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Practice</span>
              </TabsTrigger>
              <TabsTrigger
                value="hints"
                className="flex items-center gap-1 md:gap-2 text-xs md:text-sm"
              >
                <Lightbulb className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Hints</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="content" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-3 md:p-6">
                  <div className="lesson-content">
                    <LessonHTML content={lessonData.content} />
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="objectives" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-3 md:p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Learning Objectives
                  </h3>
                  <div className="space-y-3">
                    {lessonData.objectives.map((objective, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-1">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        <p className="text-slate-700">{objective}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="practice" className="h-full m-0 flex flex-col">
              {/* Practice Instructions */}
              {lessonData.practiceInstructions?.length > 0 && (
                <div className="p-4 bg-blue-50 border-b border-blue-200">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-600" />
                    Practice Questions
                  </h3>
                  <div className="space-y-2">
                    {lessonData.practiceInstructions.map(
                      (instruction, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 bg-white p-3 rounded-lg border border-blue-100"
                        >
                          <div className="mt-0.5">
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">
                                {index + 1}
                              </span>
                            </div>
                          </div>
                          <p className="text-slate-700 text-sm">
                            {instruction}
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  {/* Check Work Button (AI-powered) */}
                  {lessonData.solution && (
                    <div className="mt-4 pt-3 border-t border-blue-200">
                      <Button
                        onClick={handleCheckWork}
                        disabled={
                          !currentCode ||
                          currentCode.trim() === "" ||
                          isCheckingWork
                        }
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {isCheckingWork ? "Checking..." : "Check Work with AI"}
                      </Button>
                    </div>
                  )}

                  {/* AI Feedback Display */}
                  {aiFeedback && (
                    <div className="mt-3 p-4 rounded-lg border bg-purple-50 border-purple-200">
                      <div className="flex items-start gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-purple-900 mb-2">
                            AI Feedback
                          </h4>
                          <div className="text-sm text-purple-800 whitespace-pre-wrap">
                            {aiFeedback}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Error Display */}
                  {aiError && (
                    <div className="mt-3 p-3 rounded-lg border bg-red-50 border-red-200">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-800">{aiError}</span>
                      </div>
                    </div>
                  )}

                  {/* Validation Controls */}
                  {lessonData?.validationCriteria && (
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-blue-200">
                      <div className="flex items-center gap-2">
                        {isLessonCompleted ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Completed
                          </Badge>
                        ) : (
                          <div className="text-xs text-slate-600">
                            <span className="font-medium">💡 Tip:</span>{" "}
                            Complete validation to mark this lesson as done
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleValidatePractice}
                          disabled={!currentCode || currentCode.trim() === ""}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Validate Code
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Validation Results */}
                  {validationResult && (
                    <div
                      className={`mt-3 p-3 rounded-lg border ${
                        validationResult.valid
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {validationResult.valid ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span
                          className={`font-medium ${
                            validationResult.valid
                              ? "text-green-800"
                              : "text-red-800"
                          }`}
                        >
                          {validationResult.message}
                        </span>
                      </div>

                      {validationResult.completedCriteria.length > 0 && (
                        <div className="space-y-1 mt-2">
                          <h4 className="font-semibold text-xs text-slate-700 mb-1">
                            Completed Requirements:
                          </h4>
                          {validationResult.completedCriteria.map(
                            (criteria, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 text-xs"
                              >
                                <CheckSquare className="w-3 h-3 text-green-600" />
                                <span className="text-green-700">
                                  {criteria}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      )}

                      {validationResult.failedCriteria.length > 0 && (
                        <div className="space-y-1 mt-2">
                          <h4 className="font-semibold text-xs text-slate-700 mb-1">
                            Missing Requirements:
                          </h4>
                          {validationResult.failedCriteria.map(
                            (criteria, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 text-xs"
                              >
                                <div className="w-3 h-3 border-2 border-slate-300 rounded"></div>
                                <span className="text-slate-600">
                                  {criteria}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Code Editor and Output */}
              <div className="flex-1 flex flex-col md:flex-row gap-2 md:gap-0">
                {/* Code Editor */}
                <div className="flex-1 min-h-[400px] md:min-h-0">
                  <CodeEditor
                    onRunCode={onRunCode}
                    currentTechnology={currentTechnology}
                    currentLessonId={lessonId}
                    initialCode={currentCode}
                    onCodeChange={onCodeChange}
                  />
                </div>

                {/* Output Console */}
                <div className="flex-1 min-h-[300px] md:min-h-0">
                  <OutputConsole
                    output={output}
                    error={codeError}
                    isRunning={isRunning}
                    exitCode={exitCode}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hints" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-3 md:p-6 space-y-4 md:space-y-6">
                  <div>
                    <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                      Hints
                    </h3>
                    {lessonData.hints?.length > 0 ? (
                      <div className="space-y-3">
                        {lessonData.hints.map((hint, index) => (
                          <div
                            key={index}
                            className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-xs font-medium text-yellow-600 bg-yellow-200 px-2 py-1 rounded">
                                {index + 1}
                              </span>
                              <p className="text-yellow-800 text-sm">{hint}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm">
                        No hints available for this lesson.
                      </p>
                    )}
                  </div>

                  {lessonData.solution && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Solution
                      </h3>
                      <div className="bg-slate-50 border rounded-lg p-4">
                        <pre className="text-sm font-mono whitespace-pre-wrap text-slate-800 overflow-x-auto">
                          <code>{lessonData.solution}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
