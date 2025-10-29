import React from "react";
import { Package2, Server, Database } from "lucide-react";

export const IntroSection = {
  id: "intro",
  title: "ASP.NET Core Setup",
  icon: <Package2 className="w-5 h-5" />,
  overview:
    "Learn to set up ASP.NET Core projects and understand the framework basics.",
  content: (
    <div className="lesson-content">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Setting Up ASP.NET Core
        </h2>
        <p className="text-slate-700 mb-6">
          ASP.NET Core is a cross-platform framework for building web
          applications and APIs. We&apos;ll create a secure user management API
          with PostgreSQL integration.
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Prerequisites:</strong> .NET SDK 8.0 or later installed on
              your system.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Project Setup
        </h3>
        <p className="text-slate-700 mb-4">
          Create a new ASP.NET Core Web API project with the .NET CLI:
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-4">
          <pre className="text-green-400 text-sm overflow-x-auto">
            <code>{`dotnet new webapi -n CSharpBackend
cd CSharpBackend`}</code>
          </pre>
        </div>

        <p className="text-slate-700 mb-4">
          Install essential NuGet packages for database access, JWT
          authentication, and password hashing:
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <pre className="text-green-400 text-sm overflow-x-auto">
            <code>{`dotnet add package Microsoft.EntityFrameworkCore --version 8.0.10
dotnet add package Microsoft.EntityFrameworkCore.Design --version 8.0.10
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 8.0.4
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 8.0.10
dotnet add package System.IdentityModel.Tokens.Jwt --version 7.1.2
dotnet add package BCrypt.Net-Next --version 4.0.3`}</code>
          </pre>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Configuration Setup
        </h3>
        <p className="text-slate-700 mb-4">
          Configure your application settings in{" "}
          <code className="bg-slate-100 px-2 py-1 rounded">
            appsettings.json
          </code>
          :
        </p>

        <div className="bg-slate-900 rounded-lg p-4 mb-6">
          <pre className="text-blue-400 text-sm overflow-x-auto">
            <code>{`{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=csharp_backend;Username=your_username;Password=your_password"
  },
  "Jwt": {
    "Key": "your_jwt_secret_key_32_chars_long",
    "Issuer": "CSharpBackend",
    "Audience": "CSharpBackend"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}`}</code>
          </pre>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">
          Understanding ASP.NET Core Architecture
        </h3>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Server className="w-5 h-5 text-blue-600 mr-2" />
              <h4 className="font-semibold text-slate-900">Kestrel Server</h4>
            </div>
            <p className="text-sm text-slate-600">
              Built-in web server that handles HTTP requests and responses with
              high performance.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Package2 className="w-5 h-5 text-green-600 mr-2" />
              <h4 className="font-semibold text-slate-900">
                Dependency Injection
              </h4>
            </div>
            <p className="text-sm text-slate-600">
              Built-in IoC container for managing dependencies and services
              throughout the application.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Database className="w-5 h-5 text-purple-600 mr-2" />
              <h4 className="font-semibold text-slate-900">
                Entity Framework Core
              </h4>
            </div>
            <p className="text-sm text-slate-600">
              Object-relational mapper (ORM) that simplifies database operations
              with LINQ queries.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-2">
          Key Concepts Covered:
        </h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• ASP.NET Core project structure and CLI commands</li>
          <li>• NuGet package management for web APIs</li>
          <li>• Configuration management with appsettings.json</li>
          <li>• Understanding the request pipeline and middleware</li>
          <li>• Database connection setup with PostgreSQL</li>
        </ul>
      </div>
    </div>
  ),
};
