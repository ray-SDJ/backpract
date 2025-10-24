import { ValidationCriteria } from "./types";
import { SessionManager } from "../../services/SessionManager";

export interface ValidationResult {
  valid: boolean;
  message: string;
  completedCriteria: string[];
  failedCriteria: string[];
}

export class ValidationService {
  /**
   * Validate user code against lesson criteria
   */
  static validateCode(
    code: string,
    criteria?: ValidationCriteria
  ): ValidationResult {
    if (!criteria) {
      return {
        valid: true,
        message: "No validation criteria specified",
        completedCriteria: [],
        failedCriteria: [],
      };
    }

    const completedCriteria: string[] = [];
    const failedCriteria: string[] = [];

    // Check required includes
    if (criteria.requiredIncludes) {
      for (const required of criteria.requiredIncludes) {
        if (code.includes(required)) {
          completedCriteria.push(`✅ Includes: ${required}`);
        } else {
          failedCriteria.push(`❌ Missing: ${required}`);
        }
      }
    }

    // Check required patterns
    if (criteria.requiredPatterns) {
      for (const pattern of criteria.requiredPatterns) {
        if (pattern.test(code)) {
          completedCriteria.push(`✅ Matches pattern: ${pattern.source}`);
        } else {
          failedCriteria.push(`❌ Missing pattern: ${pattern.source}`);
        }
      }
    }

    // Check forbidden includes
    if (criteria.forbiddenIncludes) {
      for (const forbidden of criteria.forbiddenIncludes) {
        if (code.includes(forbidden)) {
          failedCriteria.push(`❌ Should not include: ${forbidden}`);
        } else {
          completedCriteria.push(`✅ Correctly avoids: ${forbidden}`);
        }
      }
    }

    // Check line count
    const lines = code.trim().split("\n").length;
    if (criteria.minLines && lines < criteria.minLines) {
      failedCriteria.push(
        `❌ Too few lines: ${lines} (minimum: ${criteria.minLines})`
      );
    } else if (criteria.minLines) {
      completedCriteria.push(`✅ Sufficient lines: ${lines}`);
    }

    if (criteria.maxLines && lines > criteria.maxLines) {
      failedCriteria.push(
        `❌ Too many lines: ${lines} (maximum: ${criteria.maxLines})`
      );
    } else if (criteria.maxLines) {
      completedCriteria.push(`✅ Within line limit: ${lines}`);
    }

    // Run custom validator
    if (criteria.customValidator) {
      const customResult = criteria.customValidator(code);
      if (customResult.valid) {
        completedCriteria.push(`✅ Custom validation: ${customResult.message}`);
      } else {
        failedCriteria.push(`❌ Custom validation: ${customResult.message}`);
      }
    }

    const valid = failedCriteria.length === 0;
    const message = valid
      ? "🎉 Practice exercise completed successfully! You can now proceed to the next lesson."
      : "🔄 Practice exercise incomplete. Please review the requirements below.";

    return {
      valid,
      message,
      completedCriteria,
      failedCriteria,
    };
  }

  /**
   * Check if a lesson is completed (stored in localStorage)
   */
  static isLessonCompleted(lessonId: string, technology: string): boolean {
    if (typeof window === "undefined") return false;

    const key = `lesson-completed-${technology}-${lessonId}`;
    return localStorage.getItem(key) === "true";
  }

  /**
   * Mark a lesson as completed (store in localStorage)
   */
  static markLessonCompleted(lessonId: string, technology: string): void {
    if (typeof window === "undefined") return;

    const key = `lesson-completed-${technology}-${lessonId}`;
    localStorage.setItem(key, "true");

    // Also update session progress
    SessionManager.markLessonCompleted(lessonId);
  }

  /**
   * Clear completion status for a lesson
   */
  static clearLessonCompletion(lessonId: string, technology: string): void {
    if (typeof window === "undefined") return;

    const key = `lesson-completed-${technology}-${lessonId}`;
    localStorage.removeItem(key);
  }

  /**
   * Get all completed lessons for a technology
   */
  static getCompletedLessons(technology: string): string[] {
    if (typeof window === "undefined") return [];

    const completedLessons: string[] = [];
    const prefix = `lesson-completed-${technology}-`;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        key.startsWith(prefix) &&
        localStorage.getItem(key) === "true"
      ) {
        const lessonId = key.replace(prefix, "");
        completedLessons.push(lessonId);
      }
    }

    return completedLessons;
  }

  /**
   * Check if prerequisites are met for a lesson
   */
  static arePrerequisitesMet(lessonId: string, technology: string): boolean {
    // Define prerequisite chains
    const prerequisites: Record<string, string[]> = {
      "1-2": ["1-1"],
      "1-3": ["1-1", "1-2"],
      "2-1": ["1-1", "1-2", "1-3"],
      "2-2": ["1-1", "1-2", "1-3", "2-1"],
      "2-3": ["1-1", "1-2", "1-3", "2-1", "2-2"],
      "2-4": ["1-1", "1-2", "1-3", "2-1", "2-2", "2-3"],
      "2-5": ["1-1", "1-2", "1-3", "2-1", "2-2", "2-3", "2-4"],
      "3-1": ["1-1", "1-2", "1-3", "2-1", "2-2", "2-3"],
      "3-2": ["1-1", "1-2", "1-3", "2-1", "2-2", "2-3", "3-1"],
      "3-3": ["1-1", "1-2", "1-3", "2-1", "2-2", "2-3", "3-1", "3-2"],
      "4-1": ["1-1", "1-2", "1-3", "2-1", "2-2", "2-3", "3-1", "3-2"],
      "4-2": ["1-1", "1-2", "1-3", "2-1", "2-2", "2-3", "3-1", "3-2", "4-1"],
      "4-3": [
        "1-1",
        "1-2",
        "1-3",
        "2-1",
        "2-2",
        "2-3",
        "3-1",
        "3-2",
        "4-1",
        "4-2",
      ],
    };

    const requiredLessons = prerequisites[lessonId] || [];
    const completedLessons = this.getCompletedLessons(technology);

    return requiredLessons.every((reqLesson) =>
      completedLessons.includes(reqLesson)
    );
  }
}
