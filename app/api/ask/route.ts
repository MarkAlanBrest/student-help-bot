import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    // This ALWAYS returns a valid response
    return NextResponse.json({
      answer: `AI is working. You asked: "${question}".`,
    });
  } catch (err) {
    console.error("Error in /api/ask:", err);

    return NextResponse.json(
      { answer: "Server error: could not process your request." },
      { status: 500 }
    );
  }
}
