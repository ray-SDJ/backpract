import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { userInput, lessonSolution } = await request.json();

    if (!userInput || !lessonSolution) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const prompt = `This is the answer to this lesson: ${lessonSolution} and this is the answer the user gave: ${userInput} compare and contrast the two see what the user got wrong and explain to him why he got it wrong`;

    // Initialize Google AI
    const ai = new GoogleGenAI({ apiKey });

    // Generate content using Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    const feedback = response.text || "No feedback available";

    return NextResponse.json({
      feedback,
      success: true,
    });
  } catch (error) {
    console.error("Error in compare-code API:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
