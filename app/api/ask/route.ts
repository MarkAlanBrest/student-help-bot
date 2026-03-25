import { NextResponse } from "next/server";

// --- CANVAS STUDENT GUIDE SEARCH (FIXED — NO SCRAPING) ---
function searchCanvasGuide(query: string) {
  const q = query.toLowerCase();

  const guides = [
    {
      keywords: ["submit", "assignment", "turn in"],
      title: "How do I submit an online assignment?",
      url: "https://community.canvaslms.com/t5/Student-Guide/How-do-I-submit-an-online-assignment/ta-p/468",
    },
    {
      keywords: ["grade", "grades", "score"],
      title: "How do I view my grades?",
      url: "https://community.canvaslms.com/t5/Student-Guide/How-do-I-view-my-grades/ta-p/414",
    },
    {
      keywords: ["calendar", "due dates"],
      title: "How do I use the Calendar?",
      url: "https://community.canvaslms.com/t5/Student-Guide/How-do-I-use-the-Calendar/ta-p/424",
    },
    {
      keywords: ["announcement", "announcements"],
      title: "How do I view Announcements?",
      url: "https://community.canvaslms.com/t5/Student-Guide/How-do-I-view-Announcements/ta-p/417",
    },
    {
      keywords: ["discussion", "reply", "post"],
      title: "How do I reply to a discussion?",
      url: "https://community.canvaslms.com/t5/Student-Guide/How-do-I-reply-to-a-discussion/ta-p/452",
    },
    {
      keywords: ["files", "download"],
      title: "How do I download a file?",
      url: "https://community.canvaslms.com/t5/Student-Guide/How-do-I-download-a-file/ta-p/421",
    },
  ];

  return guides
    .filter(g => g.keywords.some(k => q.includes(k)))
    .slice(0, 5)
    .map(g => ({
      title: g.title,
      url: g.url,
    }));
}

// --- STUDY ADVICE ---
function getStudyAdvice() {
  return [
    "Use the Canvas Calendar to track due dates.",
    "Break work into small tasks and schedule them.",
    "Use active recall and spaced repetition.",
    "Check announcements daily.",
    "Message instructors early if confused.",
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
      "Heavy Equipment",
    ],
    notes: [
      "Private trade school offering certificates and associate degrees.",
      "Provides job placement assistance.",
      "Financial aid available for eligible students.",
    ],
  };
}

// --- BLOCK TEST/ASSIGNMENT ANSWERS ---
function blocksCheating(userMessage: string) {
  const banned = [
    "answer",
    "solve",
    "cheat",
    "test",
    "quiz",
    "exam",
    "assignment answer",
    "what is the answer",
    "give me the answer",
  ];
  return banned.some(b => userMessage.toLowerCase().includes(b));
}

// --- MAIN CHATBOT LOGIC ---
async function handleStudentChat(userMessage: string) {
  const msg = userMessage.toLowerCase();

  if (blocksCheating(msg)) {
    return "I can help explain concepts, but I cannot provide answers to tests, quizzes, or assignments.";
  }

  if (msg.includes("new castle school of trades")) {
    return getNCSTInfo();
  }

  if (
    msg.includes("study") ||
    msg.includes("tips") ||
    msg.includes("help me study")
  ) {
    return getStudyAdvice();
  }

  const results = searchCanvasGuide(userMessage);

  if (results.length > 0) {
    return {
      message: "Here are the closest Canvas Student Guide articles:",
      results,
    };
  }

  return "I couldn’t find anything in the Canvas Student Guide. Try rephrasing your question.";
}

// --- API ROUTE ---
export async function POST(request: Request) {
  const { message } = await request.json();

  const reply = await handleStudentChat(message);

  return NextResponse.json({ reply });
}