import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// 🔧 CHANGE THESE FOR LOCAL TESTING
const FALLBACK_HOST = "your-school.instructure.com";
const FALLBACK_COURSE_ID = "12345";

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

  // 2. Resolve host + courseId (Canvas or fallback)
  let host = FALLBACK_HOST;
  let courseId = FALLBACK_COURSE_ID;

  if (refererUrl && refererUrl.includes("instructure.com")) {
    try {
      const u = new URL(refererUrl);
      host = u.hostname;
      const fromUrl = getCourseIdFromUrl(refererUrl);
      if (fromUrl) courseId = fromUrl;
    } catch {
      // fallback stays
    }
  }

  const baseUrl = `https://${host}/courses/${courseId}`;
  const text = userMessage.toLowerCase();

  // 3. Keyword → Link mapping (opens in new tab)

  // Grades
  if (
    text.includes("grade") ||
    text.includes("grades") ||
    text.includes("my grade") ||
    text.includes("my grades")
  ) {
    return `You can view your grades here:<br><a href="${baseUrl}/grades" target="_blank" rel="noopener noreferrer">${baseUrl}/grades</a>`;
  }

  // Syllabus
  if (text.includes("syllabus")) {
    return `Here is the syllabus:<br><a href="${baseUrl}/assignments/syllabus" target="_blank" rel="noopener noreferrer">${baseUrl}/assignments/syllabus</a>`;
  }

  // Assignments
  if (text.includes("assignment") || text.includes("assignments")) {
    return `Here are your assignments:<br><a href="${baseUrl}/assignments" target="_blank" rel="noopener noreferrer">${baseUrl}/assignments</a>`;
  }

  // Modules
  if (text.includes("module") || text.includes("modules")) {
    return `Here are your modules:<br><a href="${baseUrl}/modules" target="_blank" rel="noopener noreferrer">${baseUrl}/modules</a>`;
  }

  // Calendar
  if (text.includes("calendar") || text.includes("due dates") || text.includes("schedule")) {
    return `Here is your course calendar:<br><a href="${baseUrl}/calendar?include_contexts=course_${courseId}" target="_blank" rel="noopener noreferrer">${baseUrl}/calendar?include_contexts=course_${courseId}</a>`;
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
  const refererUrl = request.headers.get("referer") || "";
  const reply = await handleStudentChat(message, refererUrl);
  return NextResponse.json({ reply });
}
