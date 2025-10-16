import React from "react";
import { Database, Globe, Shield, TestTube } from "lucide-react";

export const DatabaseSection = {
  id: "database",
  title: "Diesel ORM & Database",
  icon: <Database className="w-5 h-5 text-green-600" />,
  overview: "Diesel ORM and database operations",
  content: <div>Rust database content</div>,
};

export const ApiSection = {
  id: "api",
  title: "Actix Web API Development",
  icon: <Globe className="w-5 h-5 text-purple-600" />,
  overview: "Build APIs with Actix Web",
  content: <div>Rust API content</div>,
};

export const AuthSection = {
  id: "auth",
  title: "Rust Authentication & Security",
  icon: <Shield className="w-5 h-5 text-red-600" />,
  overview: "JWT authentication and security",
  content: <div>Rust auth content</div>,
};

export const TestingSection = {
  id: "testing",
  title: "Testing & Deployment",
  icon: <TestTube className="w-5 h-5 text-blue-600" />,
  overview: "Rust testing and deployment",
  content: <div>Rust testing content</div>,
};
