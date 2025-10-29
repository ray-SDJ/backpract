import React from "react";
import { Play } from "lucide-react";

export const IntroSection = {
  id: "intro",
  title: "PHP & Laravel Setup",
  icon: <Play className="w-5 h-5 text-blue-600" />,
  overview: "PHP environment and Laravel framework introduction",
  content: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          🚀 Welcome to PHP Backend Development
        </h3>
        <p className="text-blue-800 leading-relaxed">
          Learn to build powerful web applications with PHP and the Laravel
          framework. Master modern PHP development, Eloquent ORM, and create
          robust APIs with authentication and testing.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-3">
            🔧 What You&apos;ll Learn
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              PHP 8+ features and Composer package management
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Laravel framework architecture and MVC pattern
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Database design with Eloquent ORM and migrations
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              RESTful API development and authentication
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-3">
            ⚡ Prerequisites
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Basic PHP syntax and programming concepts
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Understanding of web development fundamentals
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Familiarity with command line interface
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Basic SQL and database knowledge
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="text-yellow-600 text-xl">💡</div>
          </div>
          <div className="ml-3">
            <h4 className="text-yellow-800 font-semibold mb-2">Pro Tip</h4>
            <p className="text-yellow-700 text-sm leading-relaxed">
              Laravel follows the &quot;Convention over Configuration&quot;
              principle. Learn the Laravel naming conventions early to write
              cleaner, more maintainable code that follows framework best
              practices.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">25 min</div>
          <div className="text-slate-600">Setup & Environment</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">35 min</div>
          <div className="text-slate-600">Database Integration</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">40 min</div>
          <div className="text-slate-600">API Development</div>
        </div>
      </div>
    </div>
  ),
};
