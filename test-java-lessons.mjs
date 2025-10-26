// Test script to verify Java lesson imports
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const javaLessonsDir = path.join(__dirname, "app/components/lessons/java");

console.log("🔍 Checking Java lessons directory:", javaLessonsDir);
console.log("📁 Directory exists:", fs.existsSync(javaLessonsDir));

const lessonFiles = [
  "intro.ts",
  "mvc.ts",
  "data.ts",
  "security.ts",
  "testing.ts",
];

for (const file of lessonFiles) {
  const filePath = path.join(javaLessonsDir, file);
  console.log(
    `\n📄 Checking ${file}:`,
    fs.existsSync(filePath) ? "✅ EXISTS" : "❌ MISSING"
  );

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");
    const hasLessonData = content.includes("export const lessonData");
    const hasImport = content.includes("import { LessonData }");
    console.log(`   - Has lessonData export: ${hasLessonData ? "✅" : "❌"}`);
    console.log(`   - Has LessonData import: ${hasImport ? "✅" : "❌"}`);
  }
}
