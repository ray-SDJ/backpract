import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import {
  IntroSection,
  DatabaseSection,
  ApiSection,
  AuthSection,
  TestingSection,
} from "./sections";

const sections = [
  IntroSection,
  DatabaseSection,
  ApiSection,
  AuthSection,
  TestingSection,
];

const CSharpLessons: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("intro");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["intro"])
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (expandedSections.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const currentSection = sections.find(
    (section) => section.id === activeSection
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          C# & ASP.NET Core Backend Development
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          Master backend development with C# and ASP.NET Core. Build secure,
          scalable web APIs with Entity Framework Core, JWT authentication, and
          production deployment.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-slate-200 p-4 sticky top-6">
            <h3 className="font-semibold text-slate-900 mb-4">C# Sections</h3>
            <nav className="space-y-2">
              {sections.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`w-full flex items-center justify-between p-3 text-left rounded-lg transition-colors ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="mr-3">{section.icon}</div>
                      <span className="font-medium">{section.title}</span>
                    </div>
                    {expandedSections.has(section.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {expandedSections.has(section.id) && (
                    <div className="ml-6 mt-2 pb-2">
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                          activeSection === section.id
                            ? "text-blue-600 bg-blue-50"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        {section.overview}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentSection && (
            <div className="bg-white rounded-lg border border-slate-200 p-8">
              <div className="flex items-center mb-6">
                <div className="mr-3">{currentSection.icon}</div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {currentSection.title}
                </h2>
              </div>
              {currentSection.content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSharpLessons;
