"use client";

import { Trophy, Star, Clock, CheckCircle2 } from "lucide-react";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface ProgressModalProps {
  children: React.ReactNode;
}

const achievements = [
  {
    id: 1,
    title: "First Steps",
    description: "Complete your first lesson",
    earned: true,
    icon: "🎯",
  },
  {
    id: 2,
    title: "API Builder",
    description: "Create your first REST API",
    earned: true,
    icon: "🔧",
  },
  {
    id: 3,
    title: "Multi-Tech",
    description: "Try all 3 technologies",
    earned: false,
    icon: "🚀",
  },
  {
    id: 4,
    title: "Speed Runner",
    description: "Complete 5 lessons in one day",
    earned: false,
    icon: "⚡",
  },
  {
    id: 5,
    title: "Problem Solver",
    description: "Complete 10 coding challenges",
    earned: false,
    icon: "🧩",
  },
  {
    id: 6,
    title: "Backend Master",
    description: "Complete all modules",
    earned: false,
    icon: "👑",
  },
];

const stats = {
  totalLessons: 25,
  completedLessons: 2,
  totalTime: "8h 30m",
  studyStreak: 3,
  completionRate: 95,
  averageScore: 87,
};

export function ProgressModal({ children }: ProgressModalProps) {
  const progressPercentage =
    (stats.completedLessons / stats.totalLessons) * 100;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Your Progress
          </DialogTitle>
          <DialogDescription>
            Track your backend development learning journey
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.completedLessons}
              </div>
              <div className="text-sm text-slate-600">Lessons Completed</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.studyStreak}
              </div>
              <div className="text-sm text-slate-600">Day Streak</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.totalTime}
              </div>
              <div className="text-sm text-slate-600">Total Time</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.averageScore}%
              </div>
              <div className="text-sm text-slate-600">Avg Score</div>
            </div>
          </div>

          {/* Course Progress */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Course Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">
                  Overall Completion
                </span>
                <span className="text-sm font-medium">
                  {stats.completedLessons}/{stats.totalLessons} lessons
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🟢</span>
                    <div>
                      <div className="font-medium text-sm">Node.js</div>
                      <div className="text-xs text-slate-500">2/8 lessons</div>
                    </div>
                  </div>
                  <Progress value={25} className="w-16 h-2" />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🐍</span>
                    <div>
                      <div className="font-medium text-sm">Python</div>
                      <div className="text-xs text-slate-500">0/6 lessons</div>
                    </div>
                  </div>
                  <Progress value={0} className="w-16 h-2" />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">☕</span>
                    <div>
                      <div className="font-medium text-sm">Java</div>
                      <div className="text-xs text-slate-500">0/5 lessons</div>
                    </div>
                  </div>
                  <Progress value={0} className="w-16 h-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    achievement.earned
                      ? "border-yellow-200 bg-yellow-50"
                      : "border-slate-200 bg-slate-50 opacity-60"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{achievement.icon}</div>
                    <div
                      className={`font-medium text-sm ${
                        achievement.earned
                          ? "text-yellow-800"
                          : "text-slate-600"
                      }`}
                    >
                      {achievement.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {achievement.description}
                    </div>
                    {achievement.earned && (
                      <Badge className="mt-2 bg-yellow-100 text-yellow-800 text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Earned
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    Completed &ldquo;HTTP Basics&rdquo;
                  </div>
                  <div className="text-xs text-slate-500">2 hours ago</div>
                </div>
                <Star className="w-4 h-4 text-yellow-500" />
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    Completed &ldquo;What is Backend Development?&rdquo;
                  </div>
                  <div className="text-xs text-slate-500">1 day ago</div>
                </div>
                <Star className="w-4 h-4 text-yellow-500" />
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    Started &ldquo;REST API Fundamentals&rdquo;
                  </div>
                  <div className="text-xs text-slate-500">
                    Currently in progress
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
