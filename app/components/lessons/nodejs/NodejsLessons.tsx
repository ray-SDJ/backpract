"use client";

import React, { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import {
  IntroSection,
  DatabaseSection,
  ApiSection,
  AuthSection,
  TestingSection,
} from "./sections";

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

export default function NodejsTutorial() {
  const [expandedSection, setExpandedSection] = useState<string>("intro");

  const sections = [
    IntroSection,
    DatabaseSection,
    ApiSection,
    AuthSection,
    TestingSection,
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
            <div className="p-2 bg-green-100 rounded-lg">
              <Icon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {section.title}
              </h3>
              <p className="text-sm text-gray-600">{section.overview}</p>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {isExpanded && (
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            {section.content}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-600 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Node.js & Express Backend Development
            </h1>
            <p className="text-gray-600 mt-2">
              Build scalable server-side applications with Node.js, Express, and
              modern development practices
            </p>
          </div>
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
