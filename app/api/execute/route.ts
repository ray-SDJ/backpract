import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("🔧 Proxy: Received request");
    const body = await request.json();
    console.log("📄 Proxy: Request body:", JSON.stringify(body, null, 2));

    // Create AbortController with 30-second timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("⏰ Proxy: Request timeout after 30s");
      controller.abort();
    }, 30000); // 30 seconds

    try {
      const pistonResponse = await fetch(
        "https://emkc.org/api/v2/piston/execute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          signal: controller.signal, // Attach abort signal for timeout
        }
      );

      clearTimeout(timeoutId); // Clear timeout if request succeeds
      console.log("📡 Proxy: Piston response status:", pistonResponse.status);

      if (!pistonResponse.ok) {
        const errorText = await pistonResponse.text();
        console.error("❌ Proxy: Piston error:", errorText);
        return NextResponse.json(
          {
            error: `Piston error: ${pistonResponse.statusText} - ${errorText}`,
          },
          { status: pistonResponse.status }
        );
      }

      const result = await pistonResponse.json();
      console.log("✅ Proxy: Success, returning result");
      return NextResponse.json(result);
    } catch (fetchError: any) {
      clearTimeout(timeoutId); // Clear timeout on error

      // Handle timeout specifically with user-friendly message
      if (fetchError.name === "AbortError") {
        console.error("❌ Proxy: Request timed out");
        return NextResponse.json(
          {
            error: "Code execution timed out",
            run: {
              stderr:
                "Request timeout: The code execution service took too long to respond (30s limit). Please try again or simplify your code.",
              stdout: "",
              code: 1,
            },
          },
          { status: 408 } // 408 Request Timeout
        );
      }

      // Re-throw other fetch errors to be caught by outer catch
      throw fetchError;
    }
  } catch (error) {
    console.error("❌ Proxy: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
