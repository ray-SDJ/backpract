import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY || "");

export interface ComparisonResult {
  feedback: string;
  success: boolean;
  error?: string;
}

/**
 * Compare user's code with the lesson solution using Gemini AI
 */
export async function compareCodeWithSolution(
  userInput: string,
  lessonSolution: string
): Promise<ComparisonResult> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `This is the answer to this lesson: ${lessonSolution} and this is the answer the user gave: ${userInput} compare and contrast the two see what the user got wrong and explain to him why he got it wrong`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const feedback = response.text();

    return {
      feedback,
      success: true,
    };
  } catch (error) {
    console.error("Error comparing code with Gemini:", error);
    return {
      feedback: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
