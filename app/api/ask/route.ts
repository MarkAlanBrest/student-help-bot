export const runtime = "nodejs";

import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing API key");
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: question,
    });

    const answer =
      response.output_text ??
      "AI returned no text.";

    return new Response(
      JSON.stringify({ answer }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("FULL SERVER ERROR:", err);

    return new Response(
      JSON.stringify({
        answer: "Server error — see terminal",
      }),
      { status: 500 }
    );
  }
}