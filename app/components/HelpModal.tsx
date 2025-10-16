"use client";

import { HelpCircle, BookOpen, Code2, Lightbulb, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";

interface HelpModalProps {
  children: React.ReactNode;
}

export function HelpModal({ children }: HelpModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Help & Documentation
          </DialogTitle>
          <DialogDescription>
            Get started with BackPract and learn how to make the most of your
            backend learning journey
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="technologies">Technologies</TabsTrigger>
            <TabsTrigger value="tips">Tips & Tricks</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Welcome to BackPract!
              </h3>
              <p className="text-slate-600 mb-4">
                BackPract is your interactive platform for learning backend
                development with Node.js, Python Flask, and Java Spring Boot.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Step 1: Choose Your Technology
                </h4>
                <p className="text-sm text-blue-800">
                  Use the technology selector in the header to switch between
                  Node.js, Python Flask, and Java Spring Boot.
                </p>
              </div>

              <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">
                  Step 2: Follow the Lessons
                </h4>
                <p className="text-sm text-green-800">
                  Work through lessons sequentially. Each lesson includes
                  theory, coding challenges, and solutions.
                </p>
              </div>

              <div className="border border-purple-200 bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">
                  Step 3: Practice Coding
                </h4>
                <p className="text-sm text-purple-800">
                  Use the integrated code editor to write and test your backend
                  code. Run your code to see real-time results.
                </p>
              </div>

              <div className="border border-orange-200 bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">
                  Step 4: Track Progress
                </h4>
                <p className="text-sm text-orange-800">
                  Monitor your learning progress, earn achievements, and build
                  your backend development skills.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Platform Features</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium">Interactive Code Editor</h4>
                </div>
                <p className="text-sm text-slate-600">
                  Write and execute backend code directly in the browser with
                  syntax highlighting and auto-completion.
                </p>
              </div>

              <div className="border p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium">Comprehensive Lessons</h4>
                </div>
                <p className="text-sm text-slate-600">
                  Learn from structured lessons covering everything from basics
                  to advanced backend concepts.
                </p>
              </div>

              <div className="border p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  <h4 className="font-medium">Hints System</h4>
                </div>
                <p className="text-sm text-slate-600">
                  Get helpful hints when you&apos;re stuck, designed to guide
                  your learning without giving away solutions.
                </p>
              </div>

              <div className="border p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <h4 className="font-medium">Real-time Execution</h4>
                </div>
                <p className="text-sm text-slate-600">
                  Run your backend code instantly and see outputs, making
                  learning interactive and engaging.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="technologies" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Supported Technologies
              </h3>
            </div>

            <div className="space-y-4">
              <div className="border p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🟢</span>
                  <div>
                    <h4 className="font-medium">Node.js & Express</h4>
                    <Badge variant="secondary" className="text-xs">
                      JavaScript
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  Learn server-side JavaScript with Node.js and the Express
                  framework. Perfect for beginners and those familiar with
                  JavaScript.
                </p>
                <div className="text-xs text-slate-500">
                  <strong>Topics:</strong> HTTP servers, routing, middleware,
                  REST APIs, authentication
                </div>
              </div>

              <div className="border p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🐍</span>
                  <div>
                    <h4 className="font-medium">Python Flask</h4>
                    <Badge variant="secondary" className="text-xs">
                      Python
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  Build lightweight and flexible web applications with Flask.
                  Great for rapid prototyping and learning backend fundamentals.
                </p>
                <div className="text-xs text-slate-500">
                  <strong>Topics:</strong> Flask apps, routing, templates,
                  forms, database integration
                </div>
              </div>

              <div className="border p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">☕</span>
                  <div>
                    <h4 className="font-medium">Java Spring Boot</h4>
                    <Badge variant="secondary" className="text-xs">
                      Java
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  Master enterprise-level backend development with Spring Boot.
                  Industry-standard framework for large-scale applications.
                </p>
                <div className="text-xs text-slate-500">
                  <strong>Topics:</strong> Spring MVC, REST controllers,
                  dependency injection, JPA
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tips" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Learning Tips & Best Practices
              </h3>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  💡 Start with the Basics
                </h4>
                <p className="text-sm text-blue-800">
                  Even if you&apos;re experienced with frontend, backend
                  concepts are different. Start from the beginning to build a
                  solid foundation.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">
                  🔄 Practice Regularly
                </h4>
                <p className="text-sm text-green-800">
                  Consistency is key. Try to practice a little bit every day
                  rather than long sessions once a week.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">
                  🛠️ Experiment with Code
                </h4>
                <p className="text-sm text-purple-800">
                  Don&apos;t just copy the solutions. Modify the code, try
                  different approaches, and see what breaks and what works.
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">
                  📚 Read the Hints
                </h4>
                <p className="text-sm text-orange-800">
                  Use the hints system when stuck. It&apos;s designed to guide
                  your thinking without spoiling the solution.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">
                  🎯 Focus on Understanding
                </h4>
                <p className="text-sm text-red-800">
                  Don&apos;t rush to complete lessons. Make sure you understand
                  each concept before moving to the next one.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
