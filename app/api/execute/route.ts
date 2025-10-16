import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("🔧 Proxy: Received request");
    const body = await request.json();
    console.log("📄 Proxy: Request body:", JSON.stringify(body, null, 2));

    const pistonResponse = await fetch(
      "https://emkc.org/api/v2/piston/execute",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    console.log("📡 Proxy: Piston response status:", pistonResponse.status);

    if (!pistonResponse.ok) {
      const errorText = await pistonResponse.text();
      console.error("❌ Proxy: Piston error:", errorText);
      return NextResponse.json(
        { error: `Piston error: ${pistonResponse.statusText} - ${errorText}` },
        { status: pistonResponse.status }
      );
    }

    const result = await pistonResponse.json();
    console.log("✅ Proxy: Success, returning result");
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Proxy: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
