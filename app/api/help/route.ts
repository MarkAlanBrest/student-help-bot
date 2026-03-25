// ----------------------
// TYPES MUST COME FIRST
// ----------------------
export interface CanvasHelpTopic {
  id: string;
  title: string;
  url: string;
  videoUrl?: string;
  keywords: string[];
  summary: string;
  steps: string[];
}

// ----------------------
// IMPORTS
// ----------------------
import { NextResponse } from "next/server";
import { canvasHelp } from "./canvasHelpData";
import OpenAI from "openai";

// ----------------------
// OPENAI CLIENT
// ----------------------
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ----------------------
// SAFETY FILTER
// ----------------------
function isForbidden(q: string) {
  const lower = q.toLowerCase();
  const forbidden = [
    "answer", "solve", "cheat", "test", "exam", "quiz question",
    "what is the answer", "write my essay", "do my homework",
    "solve this", "complete this assignment", "give me the solution"
  ];
  return forbidden.some(f => lower.includes(f));
}

// ----------------------
// FIND MATCHING HELP TOPIC
// ----------------------
function findTopic(question: string) {
  const q = question.toLowerCase();
  return canvasHelp.find((topic: CanvasHelpTopic) =>
    topic.keywords.some(k => q.includes(k.toLowerCase()))
  );
}

// ----------------------
// BUILD RAW ANSWER FROM GUIDE
// ----------------------
function buildGuideAnswer(topic: CanvasHelpTopic) {
  let text = `${topic.summary}\n\nSteps:\n`;

  topic.steps.forEach((s, i) => {
    text += `${i + 1}. ${s}\n`;
  });

  if (topic.videoUrl) {
    text += `\nVideo: ${topic.videoUrl}\n`;
  }

  text += `Guide: ${topic.url}`;

  return text;
}

// ----------------------
// MAIN ROUTE HANDLER
// ----------------------
export async function POST(req: Request) {
  const { question } = await req.json();
  const q = String(question || "").trim();

  if (!q) {
    return NextResponse.json({
      answer: "Tell me what you're trying to do in Canvas and I’ll help."
    });
  }

  if (isForbidden(q)) {
    return NextResponse.json({
      answer: `
I can help you understand how to use Canvas, but I can’t complete or solve graded work.

Try asking things like:
• how to submit an assignment
• how to view your grades
• how to find your syllabus
• how to take a quiz in Canvas
`
    });
  }

  const topic = findTopic(q);

  if (!topic) {
    return NextResponse.json({
      answer: `
I couldn't match that to a Canvas help topic yet.

Try asking:
• how to submit an assignment
• how to view announcements
• how to message my teacher
• how to see my grades
`
    });
  }

  const raw = buildGuideAnswer(topic);

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are the Canvas Help Assistant.
You ONLY explain how to use Canvas.
You NEVER answer homework, test, or assignment questions.
You rewrite the provided guide text into a simple, friendly explanation.
Always include the video link if provided.
`
      },
      { role: "user", content: raw }
    ]
  });

  const aiAnswer = completion.choices[0].message.content;

  return NextResponse.json({ answer: aiAnswer });
}
