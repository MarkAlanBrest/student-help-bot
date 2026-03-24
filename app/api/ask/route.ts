import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a student support assistant. Help with Canvas usage, study tips, and online learning. Do NOT provide answers to graded assignments.",
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    return Response.json({
      answer: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      answer: "Something went wrong. Check server logs.",
    });
  }
}