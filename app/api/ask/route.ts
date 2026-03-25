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

// --- AUTO-DETECT COURSE ID FROM CANVAS URL ---
function getCourseIdFromUrl(url: string) {
  try {
    const path = new URL(url).pathname.split("/");
    const index = path.indexOf("courses");
    return index !== -1 ? path[index + 1] : null;
  } catch {
    return null;
  }
}

// --- MAIN CHATBOT LOGIC ---
async function handleStudentChat(userMessage: string, refererUrl: string) {

  // 1. Block cheating
  if (blocksCheating(userMessage)) {
    return "I can help explain concepts, but I cannot provide answers to tests, quizzes, or assignments.";
  }

  // 2. Detect course ID
  const courseId = getCourseIdFromUrl(refererUrl);
  const baseUrl = courseId
    ? `https://${new URL(refererUrl).hostname}/courses/${courseId}`
    : null;

  // 3. Keyword → Link mapping
  if (baseUrl) {
    const text = userMessage.toLowerCase();

    // Grades
    if (
      text.includes("grade") ||
      text.includes("my grade") ||
      text.includes("grades")
    ) {
      return `You can view your grades here:\n${baseUrl}/grades`;
    }

    // Syllabus
    if (
      text.includes("syllabus") ||
      text.includes("class outline") ||
      text.includes("course outline")
    ) {
      return `Here is the syllabus for this course:\n${baseUrl}/assignments/syllabus`;
    }

    // Assignments
    if (
      text.includes("assignment") ||
      text.includes("assignments") ||
      text.includes("homework")
    ) {
      return `You can view all assignments here:\n${baseUrl}/assignments`;
    }

    // Modules
    if (
      text.includes("module") ||
      text.includes("modules") ||
      text.includes("course content")
    ) {
      return `You can view the course modules here:\n${baseUrl}/modules`;
    }

    // Calendar
    if (
      text.includes("calendar") ||
      text.includes("due dates") ||
      text.includes("schedule")
    ) {
      return `Here is your course calendar:\n${baseUrl}/calendar?include_contexts=course_${courseId}`;
    }
  }

  // 4. Normal AI response
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
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message.content;
}

// --- API ROUTE ---
export async function POST(request: Request) {
  const { message } = await request.json();

  // Canvas sends the page URL in the Referer header
  const refererUrl = request.headers.get("referer") || "";

  const reply = await handleStudentChat(message, refererUrl);

  return NextResponse.json({ reply });
}
 