import React from "react";
import { Globe } from "lucide-react";

export const ApiSection = {
  id: "api",
  title: "Rails API Development",
  icon: <Globe className="w-5 h-5 text-purple-600" />,
  overview: "Build RESTful APIs with Rails controllers and serializers",
  content: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-900 mb-3">
          🌐 Build Powerful REST APIs with Rails
        </h3>
        <p className="text-purple-800 leading-relaxed">
          Master Rails API development with controllers, serializers, and proper
          HTTP responses for scalable web services.
        </p>
      </div>
    </div>
  ),
};
