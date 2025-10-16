import React from "react";
import { Shield } from "lucide-react";

export const AuthSection = {
  id: "auth",
  title: "Rails Authentication & Security",
  icon: <Shield className="w-5 h-5 text-red-600" />,
  overview: "Devise authentication, JWT tokens, and security best practices",
  content: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-rose-50 p-6 rounded-lg border border-red-200">
        <h3 className="text-lg font-semibold text-red-900 mb-3">
          🔒 Secure Your Rails Applications
        </h3>
        <p className="text-red-800 leading-relaxed">
          Implement robust authentication with Devise and JWT tokens. Learn
          authorization patterns and security best practices.
        </p>
      </div>
    </div>
  ),
};
