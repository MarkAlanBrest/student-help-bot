import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `You are a student support assistant. Help with Canvas usage, study tips, and online learning. Do NOT provide answers to graded assignments.

Question: ${question}`,
    });

    const answer = completion.output_text;

    return Response.json({ answer });
  } catch (error) {
    console.error("API ERROR:", error);

    return Response.json({
      answer: "Server error — check terminal logs.",
    });
  }
}