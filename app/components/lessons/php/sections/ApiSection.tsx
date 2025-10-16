import React from "react";
import { Globe } from "lucide-react";

export const ApiSection = {
  id: "api",
  title: "Laravel RESTful APIs",
  icon: <Globe className="w-5 h-5 text-purple-600" />,
  overview: "Build RESTful APIs with Laravel controllers and resources",
  content: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-900 mb-3">
          🌐 Build Powerful REST APIs with Laravel
        </h3>
        <p className="text-purple-800 leading-relaxed">
          Master Laravel API development with controllers, resources, and API
          routes. Learn to create scalable, maintainable APIs with proper HTTP
          status codes, validation, and error handling.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-3">🚀 API Features</h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              RESTful resource controllers and routing
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              API resources for data transformation
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Request validation and form requests
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Proper HTTP status codes and responses
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-3">
            ⚡ Advanced Topics
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              API rate limiting and throttling
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              CORS configuration for cross-origin requests
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              API versioning strategies
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Pagination and filtering responses
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="text-green-600 text-xl">✨</div>
          </div>
          <div className="ml-3">
            <h4 className="text-green-800 font-semibold mb-2">Best Practice</h4>
            <p className="text-green-700 text-sm leading-relaxed">
              Use Laravel API Resources to transform your models into JSON
              responses. This provides a consistent API structure and makes it
              easy to hide or modify fields without changing your underlying
              data models.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-4">
          🔧 API Development Workflow
        </h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-2">1️⃣</div>
            <h5 className="font-medium text-purple-800">Define Routes</h5>
            <p className="text-purple-700">
              Create API routes with proper resource naming
            </p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">2️⃣</div>
            <h5 className="font-medium text-blue-800">Build Controllers</h5>
            <p className="text-blue-700">
              Implement CRUD operations with validation
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">3️⃣</div>
            <h5 className="font-medium text-green-800">Format Responses</h5>
            <p className="text-green-700">
              Use API resources for consistent output
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 text-sm">
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-xl font-bold text-purple-600">REST</div>
          <div className="text-slate-600">Architecture</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-xl font-bold text-blue-600">JSON</div>
          <div className="text-slate-600">Responses</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-xl font-bold text-green-600">Validation</div>
          <div className="text-slate-600">Security</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-xl font-bold text-orange-600">Throttling</div>
          <div className="text-slate-600">Rate Limits</div>
        </div>
      </div>
    </div>
  ),
};
