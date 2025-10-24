/**
 * SessionManager - Manages user sessions and progress tracking
 * Handles session lifecycle: start, progress tracking, completion, and cleanup
 */

export interface SessionData {
  sessionId: string;
  technology: string;
  startedAt: string;
  completedLessons: string[];
  totalLessons: number;
  currentLessonId: string;
}

export class SessionManager {
  private static SESSION_KEY = "backpract_session";
  private static PROGRESS_KEY = "backpract_progress";

  /**
   * Check if there's an active session
   */
  static hasActiveSession(): boolean {
    if (typeof window === "undefined") return false;
    const session = localStorage.getItem(this.SESSION_KEY);
    return session !== null;
  }

  /**
   * Get current session data
   */
  static getSession(): SessionData | null {
    if (typeof window === "undefined") return null;
    const sessionData = localStorage.getItem(this.SESSION_KEY);
    if (!sessionData) return null;

    try {
      return JSON.parse(sessionData);
    } catch (error) {
      console.error("Error parsing session data:", error);
      return null;
    }
  }

  /**
   * Start a new session for a specific technology
   */
  static startSession(technology: string, totalLessons: number): SessionData {
    const sessionData: SessionData = {
      sessionId: this.generateSessionId(),
      technology,
      startedAt: new Date().toISOString(),
      completedLessons: [],
      totalLessons,
      currentLessonId: "1-1", // Start with first lesson
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    }

    return sessionData;
  }

  /**
   * Update current lesson
   */
  static updateCurrentLesson(lessonId: string): void {
    const session = this.getSession();
    if (!session) return;

    session.currentLessonId = lessonId;

    if (typeof window !== "undefined") {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }
  }

  /**
   * Mark a lesson as completed
   */
  static markLessonCompleted(lessonId: string): void {
    const session = this.getSession();
    if (!session) return;

    if (!session.completedLessons.includes(lessonId)) {
      session.completedLessons.push(lessonId);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }
  }

  /**
   * Check if all lessons are completed
   */
  static isSessionComplete(): boolean {
    const session = this.getSession();
    if (!session) return false;

    return session.completedLessons.length >= session.totalLessons;
  }

  /**
   * Get progress percentage
   */
  static getProgress(): number {
    const session = this.getSession();
    if (!session || session.totalLessons === 0) return 0;

    return Math.round(
      (session.completedLessons.length / session.totalLessons) * 100
    );
  }

  /**
   * Clear session and all progress data
   */
  static clearSession(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem(this.SESSION_KEY);
    // Also clear lesson completion data
    localStorage.removeItem(this.PROGRESS_KEY);

    // Clear all lesson-specific completion keys
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("lesson_completed_")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }

  /**
   * Generate a unique session ID
   */
  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get session duration in minutes
   */
  static getSessionDuration(): number {
    const session = this.getSession();
    if (!session) return 0;

    const start = new Date(session.startedAt);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    return Math.round(diffMs / 1000 / 60); // Convert to minutes
  }
}
