"use client";

import React, { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";

// TypeScript interfaces
interface SectionProps {
  section: {
    id: string;
    title: string;
    icon: React.ElementType;
    overview: string;
    content: React.ReactNode;
  };
}

export default function MLLessons() {
  const [expandedSection, setExpandedSection] = useState<string>("intro");

  const sections = [
    {
      id: "intro",
      title: "Introduction to Machine Learning",
      icon: BookOpen,
      overview: "Understand ML fundamentals and types of learning",
      content: (
        <div>
          <p>
            Machine Learning enables computers to learn from data without being
            explicitly programmed. Explore supervised, unsupervised, and
            reinforcement learning.
          </p>
        </div>
      ),
    },
    {
      id: "python-basics",
      title: "Python ML Libraries",
      icon: BookOpen,
      overview: "Master NumPy, Pandas, and Matplotlib",
      content: (
        <div>
          <p>
            Learn the essential Python libraries for machine learning: NumPy for
            numerical computing, Pandas for data manipulation, and Matplotlib
            for visualization.
          </p>
        </div>
      ),
    },
    {
      id: "scikit-learn",
      title: "Scikit-learn Essentials",
      icon: BookOpen,
      overview: "Build ML models with Scikit-learn",
      content: (
        <div>
          <p>
            Master the Scikit-learn library to build, train, and evaluate
            machine learning models for classification and regression tasks.
          </p>
        </div>
      ),
    },
    {
      id: "deep-learning",
      title: "Deep Learning with TensorFlow",
      icon: BookOpen,
      overview: "Neural networks and deep learning",
      content: (
        <div>
          <p>
            Dive into deep learning with TensorFlow and Keras. Build neural
            networks, CNNs, and RNNs for complex AI tasks.
          </p>
        </div>
      ),
    },
    {
      id: "deployment",
      title: "Model Deployment & MLOps",
      icon: BookOpen,
      overview: "Deploy ML models to production",
      content: (
        <div>
          <p>
            Learn how to deploy machine learning models to production
            environments and implement MLOps best practices.
          </p>
        </div>
      ),
    },
    {
      id: "cheatsheet",
      title: "ML Cheat Sheet",
      icon: BookOpen,
      overview: "Comprehensive ML reference guide",
      content: (
        <div>
          <p>
            Quick reference for ML algorithms, preprocessing, evaluation
            metrics, and deployment patterns.
          </p>
        </div>
      ),
    },
  ];

  const Section: React.FC<SectionProps> = ({ section }) => {
    const Icon = section.icon;
    const isExpanded = expandedSection === section.id;

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setExpandedSection(isExpanded ? "" : section.id)}
          className="w-full p-6 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Icon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {section.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{section.overview}</p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {isExpanded && (
          <div className="border-t border-gray-200 bg-gray-50 p-6">
            {section.content}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-purple-600 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Machine Learning & AI
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Master machine learning, deep learning, and AI - from fundamentals
            to production deployment.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}
