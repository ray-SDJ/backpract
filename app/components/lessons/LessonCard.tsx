"use client";

import React from "react";
import { BookOpen, Code, ExternalLink } from "lucide-react";

interface LessonCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * LessonCard - A consistent card component for all lesson content
 * Provides proper styling for h2, p, code blocks, and other elements
 */
export function LessonCard({ children, className = "" }: LessonCardProps) {
  return (
    <div
      className={`lesson-card bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
    >
      <div className="lesson-content p-6">{children}</div>
    </div>
  );
}

/**
 * LessonSection - A section wrapper within a lesson
 */
interface LessonSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function LessonSection({
  children,
  className = "",
}: LessonSectionProps) {
  return (
    <section className={`lesson-section mb-8 ${className}`}>{children}</section>
  );
}

/**
 * CodeBlock - A styled code block component
 */
interface CodeBlockProps {
  children: React.ReactNode;
  language?: string;
  title?: string;
}

export function CodeBlock({
  children,
  language = "python",
  title,
}: CodeBlockProps) {
  return (
    <div className="code-block-wrapper mb-6">
      {title && (
        <div className="code-block-header bg-gray-800 text-white px-4 py-2 rounded-t-lg flex items-center gap-2">
          <Code className="w-4 h-4" />
          <span className="text-sm font-medium">{title}</span>
          <span className="text-xs text-gray-400 ml-auto">{language}</span>
        </div>
      )}
      <pre
        className={`code-block bg-gray-900 text-green-400 p-4 overflow-x-auto font-mono text-sm ${
          title ? "rounded-b-lg" : "rounded-lg"
        }`}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}

/**
 * FeatureList - A styled list for features/points
 */
interface FeatureListProps {
  title?: string;
  items: Array<{
    label: string;
    description: string;
  }>;
}

export function FeatureList({ title, items }: FeatureListProps) {
  return (
    <div className="feature-list mb-6">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
      )}
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="mt-1.5 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
            <div>
              <span className="font-medium text-gray-900">{item.label}:</span>
              <span className="text-gray-700 ml-1">{item.description}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * ExplanationBox - A highlighted explanation box
 */
interface ExplanationBoxProps {
  title?: string;
  children: React.ReactNode;
  type?: "info" | "tip" | "warning" | "success";
}

export function ExplanationBox({
  title = "Code Explanation",
  children,
  type = "info",
}: ExplanationBoxProps) {
  const typeStyles = {
    info: "bg-blue-50 border-blue-200 text-blue-900",
    tip: "bg-green-50 border-green-200 text-green-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
    success: "bg-emerald-50 border-emerald-200 text-emerald-900",
  };

  const iconStyles = {
    info: "text-blue-600",
    tip: "text-green-600",
    warning: "text-yellow-600",
    success: "text-emerald-600",
  };

  return (
    <div
      className={`explanation-box border rounded-lg p-4 mb-6 ${typeStyles[type]}`}
    >
      <h4
        className={`font-semibold mb-3 flex items-center gap-2 ${iconStyles[type]}`}
      >
        <BookOpen className="w-4 h-4" />
        {title}
      </h4>
      <div className="explanation-content">{children}</div>
    </div>
  );
}

/**
 * QuickTest - A call-to-action test box
 */
interface QuickTestProps {
  children: React.ReactNode;
}

export function QuickTest({ children }: QuickTestProps) {
  return (
    <div className="quick-test bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
        <ExternalLink className="w-4 h-4" />
        💡 Quick Test
      </h4>
      <div className="text-sm text-green-800">{children}</div>
    </div>
  );
}

/**
 * LessonHTML - Component to render HTML or Markdown content with proper styling
 */
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface LessonHTMLProps {
  content: string;
}

export function LessonHTML({ content }: LessonHTMLProps) {
  // Detect if content is Markdown (starts with # or has markdown patterns)
  const isMarkdown =
    content.trim().startsWith("#") ||
    content.includes("```") ||
    (!content.trim().startsWith("<") && !content.includes("<div"));

  if (isMarkdown) {
    return (
      <div className="lesson-markdown-content prose prose-slate max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            // Custom component rendering for better styling
            h1: ({ ...props }) => (
              <h1 className="text-3xl font-bold mb-4 mt-6" {...props} />
            ),
            h2: ({ ...props }) => (
              <h2 className="text-2xl font-bold mb-3 mt-5" {...props} />
            ),
            h3: ({ ...props }) => (
              <h3 className="text-xl font-semibold mb-2 mt-4" {...props} />
            ),
            p: ({ ...props }) => (
              <p className="mb-4 text-slate-700 leading-relaxed" {...props} />
            ),
            ul: ({ ...props }) => (
              <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
            ),
            ol: ({ ...props }) => (
              <ol
                className="list-decimal list-inside mb-4 space-y-2"
                {...props}
              />
            ),
            li: ({ ...props }) => (
              <li className="text-slate-700 ml-4" {...props} />
            ),
            code: ({
              inline,
              className,
              children,
              ...props
            }: React.HTMLProps<HTMLElement> & { inline?: boolean }) =>
              inline ? (
                <code
                  className="bg-slate-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              ) : (
                <code className={`text-sm ${className || ""}`} {...props}>
                  {children}
                </code>
              ),
            pre: ({ ...props }) => (
              <pre
                className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto mb-4"
                {...props}
              />
            ),
            blockquote: ({ ...props }) => (
              <blockquote
                className="border-l-4 border-blue-500 pl-4 italic my-4 text-slate-600"
                {...props}
              />
            ),
            a: ({ ...props }) => (
              <a
                className="text-blue-600 hover:text-blue-800 underline"
                {...props}
              />
            ),
            table: ({ ...props }) => (
              <div className="overflow-x-auto mb-4">
                <table
                  className="min-w-full divide-y divide-slate-200 border"
                  {...props}
                />
              </div>
            ),
            thead: ({ ...props }) => (
              <thead className="bg-slate-50" {...props} />
            ),
            th: ({ ...props }) => (
              <th
                className="px-4 py-2 text-left text-xs font-medium text-slate-700 uppercase tracking-wider border"
                {...props}
              />
            ),
            td: ({ ...props }) => (
              <td
                className="px-4 py-2 text-sm text-slate-700 border"
                {...props}
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  // Render HTML content
  return (
    <div
      className="lesson-html-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
