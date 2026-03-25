import { NextResponse } from "next/server";


// --- CANVAS STUDENT GUIDE SEARCH (NO VIDEOS) ---
async function searchCanvasGuide(query: string) {
  const res = await fetch(
    `https://community.instructure.com/en/kb/canvas-lms-student-guide/search?q=${encodeURIComponent(query)}`,
    { method: "GET" }
  );

  const html = await res.text();

  const matches = [...html.matchAll(/<a href="([^"]+)"[^>]*>(.*?)<\/a>/g)];

  return matches
    .filter(m => m[1].includes("/kb/articles/"))
    .slice(0, 5)
    .map(m => ({
      title: m[2].replace(/<[^>]+>/g, ""),
      url: "https://community.instructure.com" + m[1]
    }));
}


// --- STUDY ADVICE ---
function getStudyAdvice() {
  return [
    "Use the Canvas Calendar to track due dates.",
    "Break work into small tasks and schedule them.",
    "Use active recall and spaced repetition.",
    "Check announcements daily.",
    "Message instructors early if confused."
  ];
}


// --- NEW CASTLE SCHOOL OF TRADES INFO ---
function getNCSTInfo() {
  return {
    name: "New Castle School of Trades",
    locations: ["New Castle, PA", "East Liverpool, OH"],
    programs: [
      "Automotive Technology",
      "Diesel Technology",
      "Welding",
      "Electrical",
      "HVAC",
      "CNC Machining",
      "Heavy Equipment"
    ],
    notes: [
      "Private trade school offering certificates and associate degrees.",
      "Provides job placement assistance.",
      "Financial aid available for eligible students."
    ]
  };
}


// --- BLOCK TEST/ASSIGNMENT ANSWERS ---
function blocksCheating(userMessage: string) {
  const banned = [
    "answer", "solve", "cheat", "test", "quiz", "exam",
    "assignment answer", "what is the answer", "give me the answer"
  ];
  return banned.some(b => userMessage.toLowerCase().includes(b));
}


// --- MAIN CHATBOT LOGIC ---
async function handleStudentChat(userMessage: string) {

  if (blocksCheating(userMessage)) {
    return "I can help explain concepts, but I cannot provide answers to tests, quizzes, or assignments.";
  }

  if (userMessage.toLowerCase().includes("new castle school of trades")) {
    return getNCSTInfo();
  }

  if (
    userMessage.toLowerCase().includes("study") ||
    userMessage.toLowerCase().includes("tips") ||
    userMessage.toLowerCase().includes("help me study")
  ) {
    return getStudyAdvice();
  }

  const results = await searchCanvasGuide(userMessage);

  if (results.length > 0) {
    return {
      message: "Here are the closest Canvas Student Guide articles:",
      results
    };
  }

  return "I couldn’t find anything in the Canvas Student Guide. Try rephrasing your question.";
}


// ✅ REQUIRED APP ROUTER HANDLER
export async function POST(request: Request) {
  const { message } = await request.json();

  const reply = await handleStudentChat(message);

  return NextResponse.json({ reply });
}