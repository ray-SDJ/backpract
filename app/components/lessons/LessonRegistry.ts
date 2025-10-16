import {
  ProgrammingLanguage,
  LessonData,
  TECHNOLOGY_TO_LANGUAGE_MAP,
} from "./types";

// Lesson registry that dynamically imports lesson components
export class LessonRegistry {
  private static lessonCache = new Map<string, LessonData>();

  /**
   * Get lesson data for a specific lesson ID and programming language
   */
  static async getLessonData(
    lessonId: string,
    technology?: string
  ): Promise<LessonData | null> {
    const cacheKey = `${technology || "general"}-${lessonId}`;

    // Check cache first
    if (this.lessonCache.has(cacheKey)) {
      return this.lessonCache.get(cacheKey) || null;
    }

    try {
      // Determine language from technology or use general lessons
      const language = technology
        ? TECHNOLOGY_TO_LANGUAGE_MAP[technology]
        : null;

      if (language) {
        // Try to load language-specific lesson
        const lessonData = await this.loadLanguageLesson(language, lessonId);
        if (lessonData) {
          this.lessonCache.set(cacheKey, lessonData);
          return lessonData;
        }
      }

      // Fall back to general lessons
      const generalLesson = await this.loadGeneralLesson(lessonId);
      if (generalLesson) {
        this.lessonCache.set(cacheKey, generalLesson);
        return generalLesson;
      }

      return null;
    } catch (error) {
      console.error(
        `Failed to load lesson ${lessonId} for ${technology}:`,
        error
      );
      return null;
    }
  }

  /**
   * Load language-specific lesson
   */
  private static async loadLanguageLesson(
    language: ProgrammingLanguage,
    lessonId: string
  ): Promise<LessonData | null> {
    try {
      // Dynamic import based on language and lesson ID
      const lessonModule = await import(`./${language}/${lessonId}`);
      return lessonModule.default || lessonModule.lessonData;
    } catch {
      // Language-specific lesson doesn't exist, will fall back to general
      return null;
    }
  }

  /**
   * Load general lesson (language-agnostic)
   */
  private static async loadGeneralLesson(
    lessonId: string
  ): Promise<LessonData | null> {
    try {
      const lessonModule = await import(`./general/${lessonId}`);
      return lessonModule.default || lessonModule.lessonData;
    } catch (error) {
      console.error(`General lesson ${lessonId} not found:`, error);
      return null;
    }
  }

  /**
   * Preload lessons for better performance
   */
  static async preloadLessons(
    technology: string,
    lessonIds: string[]
  ): Promise<void> {
    const promises = lessonIds.map((lessonId) =>
      this.getLessonData(lessonId, technology)
    );
    await Promise.allSettled(promises);
  }

  /**
   * Clear lesson cache
   */
  static clearCache(): void {
    this.lessonCache.clear();
  }

  /**
   * Get all available lessons for a language
   */
  static async getAvailableLessons(): Promise<string[]> {
    // This would ideally scan the filesystem or have a manifest
    // For now, return common lesson IDs
    return [
      "1-1",
      "1-2",
      "1-3", // Introduction lessons
      "2-1",
      "2-2",
      "2-3", // Language setup and basics
      "3-1",
      "3-2",
      "3-3", // Framework introduction
      "4-1",
      "4-2",
      "4-3", // Advanced concepts
      "5-1",
      "5-2",
      "5-3", // Database and deployment
    ];
  }
}
