import React from "react";
import { Database } from "lucide-react";

export const DatabaseSection = {
  id: "database",
  title: "Laravel Eloquent & Database",
  icon: <Database className="w-5 h-5 text-green-600" />,
  overview: "Eloquent ORM, migrations, and database relationships",
  content: (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-3">
          🗄️ Master Laravel Database Operations
        </h3>
        <p className="text-green-800 leading-relaxed">
          Learn Laravel's powerful Eloquent ORM for database operations. Create
          migrations, define model relationships, and implement advanced
          querying techniques for robust data management.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-3">
            📊 Database Features
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Eloquent ORM for intuitive database interactions
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Database migrations for version control
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Model relationships (one-to-many, many-to-many)
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Query builder and advanced querying
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-3">
            🔧 Tools & Techniques
          </h4>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Model factories for testing data
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Seeders for database population
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Soft deletes and model observers
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Database indexing and optimization
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
              Learning Objective
            </h4>
            <p className="text-blue-700 text-sm leading-relaxed">
              By the end of this section, you'll be able to design and implement
              complex database schemas using Laravel migrations, create
              efficient Eloquent models with relationships, and optimize
              database queries for performance.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h4 className="font-semibold text-slate-900 mb-4">📝 Key Concepts</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-slate-800 mb-2">Eloquent Models</h5>
            <p className="text-slate-600 mb-3">
              Object-relational mapping that provides an elegant ActiveRecord
              implementation for working with your database.
            </p>
          </div>
          <div>
            <h5 className="font-medium text-slate-800 mb-2">Migrations</h5>
            <p className="text-slate-600 mb-3">
              Version control for your database schema, allowing you to modify
              and share database schemas across team environments.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 text-sm">
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-xl font-bold text-green-600">Eloquent</div>
          <div className="text-slate-600">ORM System</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-xl font-bold text-blue-600">Migrations</div>
          <div className="text-slate-600">Schema Control</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-xl font-bold text-purple-600">Relations</div>
          <div className="text-slate-600">Data Links</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-xl font-bold text-orange-600">Queries</div>
          <div className="text-slate-600">Advanced SQL</div>
        </div>
      </div>
    </div>
  ),
};
