import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// --- BLOCK TEST / ASSIGNMENT ANSWERS ---
function blocksCheating(msg: string) {
  const banned = [
    "answer to",
    "solve this",
    "quiz answer",
    "test answer",
    "exam answer",
    "assignment answer",
    "do my homework",
    "give me the answer",
  ];

  return banned.some(b => msg.toLowerCase().includes(b));
}

// --- MAIN CHATBOT LOGIC ---
async function handleStudentChat(userMessage: string) {

  if (blocksCheating(userMessage)) {
    return "I can help explain concepts, but I cannot provide answers to tests, quizzes, or assignments.";
  }

  const prompt = `
You are a helpful student support assistant for students using Canvas LMS.

Assume the student is working inside Canvas unless they say otherwise.

Guidelines:
- Provide step-by-step instructions when possible
- Focus on Canvas tools (Assignments, Modules, Grades, Discussions, Files, etc.)
- If a useful tutorial video exists, include ONE YouTube link
- Be concise, clear, and student-friendly
- Do NOT provide answers to tests, quizzes, or assignments
- If the question looks like homework, explain concepts instead of giving answers

Student question: ${userMessage}
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",   // ⭐ CHEAP MODEL
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message.content;
}

// --- API ROUTE ---
export async function POST(request: Request) {
  const { message } = await request.json();

  const reply = await handleStudentChat(message);

  return NextResponse.json({ reply });
}