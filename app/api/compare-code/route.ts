import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Simple in-memory rate limiter
const rateLimiter = new Map<string, number[]>();
const MAX_REQUESTS_PER_MINUTE = 10; // Set below the 15 limit to be safe

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userRequests = rateLimiter.get(identifier) || [];

  // Remove requests older than 1 minute
  const recentRequests = userRequests.filter((time) => now - time < 60000);

  if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
    return false; // Rate limit exceeded
  }

  recentRequests.push(now);
  rateLimiter.set(identifier, recentRequests);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit (using IP or a session identifier)
    const identifier = request.headers.get("x-forwarded-for") || "global";

    if (!checkRateLimit(identifier)) {
      return NextResponse.json(
        {
          error:
            "Rate limit exceeded. Please wait a moment before trying again.",
          retryAfter: 60,
        },
        { status: 429 }
      );
    }

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

    // Create timeout wrapper for Gemini API call (20 second timeout)
    const generateContentWithTimeout = Promise.race([
      ai.models.generateContent({
        model: "models/gemini-1.5-flash", // Full model path for v1beta API
        contents: prompt,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("AI request timeout")), 20000)
      ),
    ]);

    // Generate content using Gemini
    const response = await generateContentWithTimeout;

    const feedback = response.text || "No feedback available";

    return NextResponse.json({
      feedback,
      success: true,
    });
  } catch (error) {
    console.error("Error in compare-code API:", error);

    // Check if it's a quota error
    if (error instanceof Error && error.message.includes("quota")) {
      return NextResponse.json(
        {
          error:
            "AI service is temporarily unavailable due to high usage. Please try again in a minute.",
          isQuotaError: true,
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
