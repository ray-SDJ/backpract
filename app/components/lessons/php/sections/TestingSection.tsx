import React from "react";
import { TestTube } from "lucide-react";

export const TestingSection = {
  id: "testing",
  title: "Testing & Production Deployment",
  icon: <TestTube className="w-5 h-5 text-orange-600" />,
  overview: "PHPUnit testing, deployment, and production optimization",
  content: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-lg border border-orange-200">
        <h3 className="text-lg font-semibold text-orange-900 mb-3">
          🧪 Test & Deploy Laravel Applications
        </h3>
        <p className="text-orange-800 leading-relaxed">
          Master testing strategies with PHPUnit and Laravel testing tools.
          Learn deployment best practices, performance optimization, and
          production environment configuration for reliable applications.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-3">
            🧪 Testing Framework
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              PHPUnit for unit and feature testing
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Laravel testing helpers and assertions
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Database testing with factories
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              API endpoint testing and mocking
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-3">
            🚀 Deployment & Optimization
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Production server configuration
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Caching strategies (Redis, Memcached)
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Queue workers for background jobs
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Performance monitoring and optimization
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="text-blue-600 text-xl">🎯</div>
          </div>
          <div className="ml-3">
            <h4 className="text-blue-800 font-semibold mb-2">
              Production Ready
            </h4>
            <p className="text-blue-700 text-sm leading-relaxed">
              Deploy with confidence using Laravel Forge, Envoyer, or Docker.
              Implement proper logging, monitoring, and backup strategies to
              ensure your application runs smoothly in production environments.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-4">
          🔄 Development Lifecycle
        </h4>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">✅</div>
            <h5 className="font-medium text-green-800">Test</h5>
            <p className="text-green-700">Unit & feature tests with PHPUnit</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">🏗️</div>
            <h5 className="font-medium text-blue-800">Build</h5>
            <p className="text-blue-700">Optimize and prepare for production</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-2">🚀</div>
            <h5 className="font-medium text-purple-800">Deploy</h5>
            <p className="text-purple-700">Zero-downtime deployments</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl mb-2">📊</div>
            <h5 className="font-medium text-orange-800">Monitor</h5>
            <p className="text-orange-700">Performance and error tracking</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 text-sm">
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-xl font-bold text-green-600">PHPUnit</div>
          <div className="text-slate-600">Testing</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-xl font-bold text-blue-600">Docker</div>
          <div className="text-slate-600">Containers</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-xl font-bold text-purple-600">Forge</div>
          <div className="text-slate-600">Deployment</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-xl font-bold text-orange-600">Queues</div>
          <div className="text-slate-600">Background</div>
        </div>
      </div>
    </div>
  ),
};
