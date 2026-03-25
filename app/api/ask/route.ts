import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    // TEMP: simple echo-style answer so the UI always gets something back
    const answer =
      question && question.trim().length > 0
        ? `You asked: "${question}". Right now this is a demo response, but the chat pipeline is working.`
        : "I didn’t get a question, but the AI endpoint is responding correctly.";

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Error in /api/ask:", err);
    return NextResponse.json(
      { answer: "Something went wrong handling your request." },
      { status: 500 }
    );
  }
}
