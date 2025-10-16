import React from "react";
import { Shield } from "lucide-react";

export const AuthSection = {
  id: "auth",
  title: "Laravel Authentication & Security",
  icon: <Shield className="w-5 h-5 text-red-600" />,
  overview: "JWT authentication, authorization, and security best practices",
  content: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-rose-50 p-6 rounded-lg border border-red-200">
        <h3 className="text-lg font-semibold text-red-900 mb-3">
          🔒 Secure Your Laravel Applications
        </h3>
        <p className="text-red-800 leading-relaxed">
          Implement robust authentication and authorization systems in Laravel.
          Learn JWT tokens, API guards, middleware, and security best practices
          to protect your applications from common vulnerabilities.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-3">
            🛡️ Security Features
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              JWT authentication for stateless APIs
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Laravel Sanctum for SPA authentication
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Role-based access control (RBAC)
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              API middleware and guards
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-3">
            🔐 Best Practices
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Password hashing with bcrypt
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              CSRF protection for web routes
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Input validation and sanitization
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Rate limiting for authentication endpoints
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="text-amber-600 text-xl">⚠️</div>
          </div>
          <div className="ml-3">
            <h4 className="text-amber-800 font-semibold mb-2">
              Security Alert
            </h4>
            <p className="text-amber-700 text-sm leading-relaxed">
              Always use HTTPS in production, implement proper token expiration,
              and never store sensitive data in JWT payloads. Consider using
              Laravel Sanctum for better security with SPA applications.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-4">
          🔑 Authentication Flow
        </h4>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl mb-2">🔐</div>
            <h5 className="font-medium text-red-800">Register</h5>
            <p className="text-red-700">Create user account with validation</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">🎫</div>
            <h5 className="font-medium text-blue-800">Login</h5>
            <p className="text-blue-700">Authenticate and issue JWT token</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">🛡️</div>
            <h5 className="font-medium text-green-800">Protect</h5>
            <p className="text-green-700">Middleware guards API routes</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-2">🚪</div>
            <h5 className="font-medium text-purple-800">Logout</h5>
            <p className="text-purple-700">Invalidate token securely</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 text-sm">
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-xl font-bold text-red-600">JWT</div>
          <div className="text-slate-600">Tokens</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-xl font-bold text-blue-600">Guards</div>
          <div className="text-slate-600">Protection</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-xl font-bold text-green-600">RBAC</div>
          <div className="text-slate-600">Permissions</div>
        </div>
      </div>
    </div>
  ),
};
