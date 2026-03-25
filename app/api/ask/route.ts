import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    return NextResponse.json({
      answer: `AI is working. You asked: "${question}".`,
    });
  } catch (err) {
    console.error("Error in /api/ask:", err);
    return NextResponse.json(
      { answer: "Something went wrong handling your request." },
      { status: 500 }
    );
  }
}
