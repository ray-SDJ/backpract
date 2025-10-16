import React from "react";
import { Database } from "lucide-react";

export const DatabaseSection = {
  id: "database",
  title: "Active Record & Database",
  icon: <Database className="w-5 h-5 text-green-600" />,
  overview: "Active Record ORM, migrations, and associations",
  content: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-3">
          🗄️ Master Rails Database Operations
        </h3>
        <p className="text-green-800 leading-relaxed">
          Learn Active Record ORM for intuitive database interactions. Create
          migrations, define model associations, and implement advanced querying
          techniques.
        </p>
      </div>
    </div>
  ),
};
