import React from "react";
import { Play } from "lucide-react";

export const IntroSection = {
  id: "intro",
  title: "Ruby on Rails Setup",
  icon: <Play className="w-5 h-5 text-red-600" />,
  overview: "Ruby environment and Rails framework introduction",
  content: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg border border-red-200">
        <h3 className="text-lg font-semibold text-red-900 mb-3">
          💎 Welcome to Ruby on Rails Development
        </h3>
        <p className="text-red-800 leading-relaxed">
          Learn to build elegant web applications with Ruby on Rails. Master the
          Rails conventions, Active Record ORM, and create powerful APIs with
          authentication and real-time features.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-3">
            💎 What You'll Learn
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Ruby language fundamentals and Rails framework
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Model-View-Controller architecture
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Active Record ORM and database migrations
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              RESTful API development and authentication
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-3">
            📚 Prerequisites
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Basic Ruby programming knowledge
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Understanding of web development concepts
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Command line interface familiarity
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Basic database and SQL knowledge
            </li>
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">30 min</div>
          <div className="text-slate-600">Rails Setup</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">40 min</div>
          <div className="text-slate-600">Active Record</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">45 min</div>
          <div className="text-slate-600">API Development</div>
        </div>
      </div>
    </div>
  ),
};
