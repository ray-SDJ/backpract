import React from "react";
import { TestTube } from "lucide-react";

export const TestingSection = {
  id: "testing",
  title: "Testing & Deployment",
  icon: <TestTube className="w-5 h-5 text-orange-600" />,
  overview: "RSpec testing, deployment, and production optimization",
  content: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-lg border border-orange-200">
        <h3 className="text-lg font-semibold text-orange-900 mb-3">
          🧪 Test & Deploy Rails Applications
        </h3>
        <p className="text-orange-800 leading-relaxed">
          Master testing with RSpec and deploy Rails applications with
          performance optimization and monitoring.
        </p>
      </div>
    </div>
  ),
};
