"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { LessonRegistry } from "./LessonRegistry";

export function DiagnosticTest() {
  const [result, setResult] = useState<string>("");

  const testJavaLessons = async () => {
    const lessons = ["intro", "mvc", "data", "security", "testing"];
    const results: string[] = [];

    for (const lessonId of lessons) {
      try {
        const data = await LessonRegistry.getLessonData(lessonId, "java");
        if (data) {
          results.push(`✅ ${lessonId}: ${data.title} (${data.difficulty})`);
        } else {
          results.push(`❌ ${lessonId}: Failed to load`);
        }
      } catch (error) {
        results.push(`❌ ${lessonId}: ${error}`);
      }
    }

    setResult(results.join("\n"));
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-bold mb-2">Java Lessons Diagnostic</h3>
      <Button onClick={testJavaLessons}>Test Java Lessons</Button>
      {result && (
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm whitespace-pre-wrap">
          {result}
        </pre>
      )}
    </div>
  );
}
