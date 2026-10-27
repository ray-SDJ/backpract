"use client";

import { useState } from "react";
import { Trophy, CheckCircle2, Circle } from "lucide-react";
import { Progress } from "./ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { getLessonsForTechnology } from "./CourseSidebar";
import { SessionManager } from "../services/SessionManager";

interface ProgressModalProps {
  children: React.ReactNode;
  currentTechnology: string;
  technologyName: string;
}

const formatDuration = (minutes: number) =>
  minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

export function ProgressModal({
  children,
  currentTechnology,
  technologyName,
}: ProgressModalProps) {
  // Progress lives in localStorage, so read it fresh each time the modal opens
  const [snapshot, setSnapshot] = useState<{
    lessons: ReturnType<typeof getLessonsForTechnology>;
    sessionMinutes: number;
  } | null>(null);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setSnapshot({
        lessons: getLessonsForTechnology(currentTechnology),
        sessionMinutes: SessionManager.getSessionDuration(),
      });
    }
  };

  const lessons = snapshot?.lessons ?? [];
  const completedCount = lessons.filter((l) => l.completed).length;
  const progressPercentage = lessons.length
    ? Math.round((completedCount / lessons.length) * 100)
    : 0;

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Your Progress
          </DialogTitle>
          <DialogDescription>
            Your progress in {technologyName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                {completedCount}/{lessons.length}
              </div>
              <div className="text-sm text-slate-600">Lessons Completed</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {progressPercentage}%
              </div>
              <div className="text-sm text-slate-600">Course Complete</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatDuration(snapshot?.sessionMinutes ?? 0)}
              </div>
              <div className="text-sm text-slate-600">This Session</div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Overall Completion</span>
              <span className="text-sm font-medium">
                {completedCount}/{lessons.length} lessons
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Lessons</h3>
            <div className="space-y-2">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    lesson.completed
                      ? "bg-green-50 border-green-200"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  {lesson.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400" />
                  )}
                  <span className="text-sm">{lesson.title}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Lessons are marked complete when you pass &ldquo;Validate
              Code&rdquo; on the Practice tab.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
