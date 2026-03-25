import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    // Guaranteed working placeholder response
    return NextResponse.json({
      answer: `Here’s a response to your question: "${question}". The AI pipeline is working.`,
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { answer: "The server had an issue processing your request." },
      { status: 500 }
    );
  }
}
