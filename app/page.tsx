"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "assistant";
  text: string;
  helpLink?: string;
  fileName?: string;
};

/* ===============================
   OFFICIAL GUIDE LINKS ONLY
================================ */

const CanvasResources = [
  {
    keywords: [
      "submit","submission","turn in","upload",
      "hand in","send assignment","homework"
    ],
    guide:
      "https://community.canvaslms.com/t5/Student-Guide/How-do-I-submit-an-online-assignment/ta-p/416664",
  },

  {
    keywords: [
      "grade","grades","score","feedback",
      "points","results","mark"
    ],
    guide:
      "https://community.canvaslms.com/t5/Student-Guide/How-do-I-view-my-grades-in-a-current-course/ta-p/416653",
  },

  {
    keywords: [
      "discussion","reply","post","comment","forum"
    ],
    guide:
      "https://community.canvaslms.com/t5/Student-Guide/How-do-I-reply-to-a-discussion-as-a-student/ta-p/416663",
  },

  {
    keywords: [
      "module","lesson","course content","units"
    ],
    guide:
      "https://community.canvaslms.com/t5/Student-Guide/How-do-I-view-modules/ta-p/416655",
  },

  {
    keywords: [
      "quiz","test","exam","assessment"
    ],
    guide:
      "https://community.canvaslms.com/t5/Student-Guide/How-do-I-take-a-quiz/ta-p/416660",
  }
];

function getCanvasGuide(question: string) {
  const q = question.toLowerCase();

  for (const item of CanvasResources) {
    if (item.keywords.some((k) => q.includes(k))) {
      return item.guide;
    }
  }

  return "";
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  }

  async function handleSend() {
    if (!question.trim() && !file) return;

    const userMessage: Message = {
      role: "user",
      text: question || "(File uploaded)",
      fileName: file?.name,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    /* ===== AI RESPONSE ===== */

    let answer = "⚠️ Unable to get response.";

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      answer = data.answer || answer;
    } catch {}

    /* ===== GUIDE MATCH ===== */

    const guide = getCanvasGuide(question);

    const botMessage: Message = {
      role: "assistant",
      text: answer,
      helpLink: guide || undefined,
    };

    setMessages((prev) => [...prev, botMessage]);

    setQuestion("");
    setFile(null);
    setLoading(false);
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-300 to-slate-500 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl flex flex-col h-[85vh]">

        {/* HEADER */}
        <div className="bg-blue-900 text-white p-4 rounded-t-2xl text-center text-xl font-semibold">
          Student Help Center
        </div>

        {/* CHAT WINDOW */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">

          {messages.length === 0 && (
            <p className="text-center text-slate-500">
              Ask about Canvas, study tips, or upload instructions.
            </p>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] p-4 rounded-xl ${
                msg.role === "user"
                  ? "bg-blue-900 text-white ml-auto"
                  : "bg-white border"
              }`}
            >
              <div
                className={`prose max-w-none ${
                  msg.role === "user" ? "prose-invert" : "prose-slate"
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              </div>

              {msg.fileName && (
                <p className="text-sm mt-2 opacity-80">📎 {msg.fileName}</p>
              )}

              {msg.helpLink && (
                <a
                  href={msg.helpLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-3 text-blue-700 underline font-medium"
                >
                  📘 Official Canvas guide
                </a>
              )}
            </div>
          ))}

          {loading && <p className="text-slate-500">Thinking...</p>}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT BAR */}
        <div className="border-t bg-white p-4 flex items-center gap-3 rounded-b-2xl">

          <label className="cursor-pointer bg-slate-200 px-3 py-2 rounded hover:bg-slate-300">
            📎
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>

          {file && (
            <span className="text-sm text-slate-600 truncate max-w-[150px]">
              {file.name}
            </span>
          )}

          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 border rounded px-3 py-2"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />

          <button
            onClick={handleSend}
            className="bg-blue-900 text-white px-5 py-2 rounded hover:bg-blue-800"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}