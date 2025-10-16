import React from "react";
import {
  IntroSection,
  DatabaseSection,
  ApiSection,
  AuthSection,
  TestingSection,
} from "./sections";

const RustLessons = () => {
  const sections = [
    IntroSection,
    DatabaseSection,
    ApiSection,
    AuthSection,
    TestingSection,
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Rust & Actix Web Development
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Master systems programming with Rust and build high-performance web
          applications using Actix Web framework, focusing on memory safety,
          concurrency, and speed.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="flex items-center mb-4">
              <div className="mr-3">{section.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800">
                {section.title}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">{section.overview}</p>
            <div className="space-y-4">{section.content}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Why Learn Rust?
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-orange-600 mb-2">
              Performance & Safety
            </h4>
            <ul className="text-gray-600 space-y-1">
              <li>• Zero-cost abstractions</li>
              <li>• Memory safety without garbage collection</li>
              <li>• Fearless concurrency</li>
              <li>• Compile-time error prevention</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-red-600 mb-2">
              Actix Web Benefits
            </h4>
            <ul className="text-gray-600 space-y-1">
              <li>• One of the fastest web frameworks</li>
              <li>• Type-safe routing and middleware</li>
              <li>• Built-in async/await support</li>
              <li>• Excellent ecosystem integration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RustLessons;
