import { BookOpen, Lightbulb, CheckCircle, Code, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useState } from "react";
import { LessonRegistry } from "./lessons/LessonRegistry";
import { LessonData } from "./lessons/types";
import { LessonHTML } from "./lessons/LessonCard";

interface LessonContentProps {
  lessonId: string;
  currentTechnology: string;
}

export default function LessonContent({
  lessonId,
  currentTechnology,
}: LessonContentProps) {
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="border-b bg-slate-50 px-6 py-4">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl font-semibold text-slate-900">
            {lessonData.title}
          </h1>
          <Badge className={getDifficultyColor(lessonData.difficulty)}>
            {lessonData.difficulty}
          </Badge>
        </div>
        <p className="text-slate-600 text-sm mb-3">{lessonData.description}</p>
        <div className="text-xs text-slate-500">
          <span className="font-medium">Technology:</span> {currentTechnology} •
          <span className="font-medium ml-2">Lesson:</span> {lessonId}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="content" className="flex flex-col h-full">
          <div className="border-b px-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Content
              </TabsTrigger>
              <TabsTrigger
                value="objectives"
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Objectives
              </TabsTrigger>
              <TabsTrigger value="practice" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Practice
              </TabsTrigger>
              <TabsTrigger value="hints" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Hints
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="content" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-6">
                  <div className="lesson-content">
                    <LessonHTML content={lessonData.content} />
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="objectives" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-6">
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

            <TabsContent value="practice" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Practice Instructions
                  </h3>
                  {lessonData.practiceInstructions?.length > 0 ? (
                    <div className="space-y-3">
                      {lessonData.practiceInstructions.map(
                        (instruction, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="mt-1">
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-xs font-medium text-green-600">
                                  {index + 1}
                                </span>
                              </div>
                            </div>
                            <p className="text-slate-700">{instruction}</p>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Code className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">
                        No specific practice instructions for this lesson.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="hints" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
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
