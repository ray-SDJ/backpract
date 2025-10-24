"use client";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Trophy, Sparkles, Clock, BookCheck, RotateCcw } from "lucide-react";

interface CompletionScreenProps {
  technology: string;
  completedLessons: number;
  sessionDuration: number;
  onRestart: () => void;
}

const technologyNames: Record<string, string> = {
  nodejs: "Node.js & Express",
  python: "Python & Flask",
  java: "Java & Spring Boot",
  csharp: "C# & .NET Core",
  go: "Go Programming",
  rust: "Rust Programming",
  php: "PHP Development",
  ruby: "Ruby on Rails",
};

export function CompletionScreen({
  technology,
  completedLessons,
  sessionDuration,
  onRestart,
}: CompletionScreenProps) {
  const techName = technologyNames[technology] || technology;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <Card className="p-12 text-center shadow-2xl border-2 border-green-200 bg-white">
          {/* Trophy Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-100 p-6 rounded-full">
              <Trophy className="w-24 h-24 text-yellow-500" />
            </div>
          </div>

          {/* Congratulations Message */}
          <h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-yellow-500" />
            Congratulations!
            <Sparkles className="w-10 h-10 text-yellow-500" />
          </h1>

          <p className="text-2xl text-gray-700 mb-8">
            You&apos;ve completed all{" "}
            <span className="font-bold text-green-600">{techName}</span>{" "}
            lessons!
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <BookCheck className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {completedLessons}
              </div>
              <div className="text-sm text-gray-600">Lessons Completed</div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <Trophy className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-600 mb-1">100%</div>
              <div className="text-sm text-gray-600">Course Progress</div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <Clock className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {sessionDuration}
              </div>
              <div className="text-sm text-gray-600">Minutes Learning</div>
            </div>
          </div>

          {/* Achievement Message */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              🎉 What You&apos;ve Achieved
            </h2>
            <div className="text-left max-w-2xl mx-auto space-y-2">
              <p className="text-gray-700">
                ✓ Mastered {techName} fundamentals
              </p>
              <p className="text-gray-700">
                ✓ Completed hands-on coding exercises
              </p>
              <p className="text-gray-700">
                ✓ Built real-world backend applications
              </p>
              <p className="text-gray-700">
                ✓ Validated your code with automated testing
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onRestart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Start New Journey
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Your progress and session data will be cleared when you start a new
            journey
          </p>
        </Card>

        {/* Next Steps */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Ready for more? Try another technology!
          </p>
        </div>
      </div>
    </div>
  );
}
