"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "assistant";
  text: string;
  video?: string;   // link to official video page
  fileName?: string;
};

/* -----------------------------
   OBVIOUS ANSWERS (no AI call)
--------------------------------*/
function getQuickAnswer(q: string): string | null {
  const s = q.toLowerCase();

  if (s.includes("submit") && s.includes("assignment")) {
    return `📤 **How to submit an assignment in Canvas**

1. Open your course  
2. Click **Assignments**  
3. Select the assignment  
4. Click **Submit Assignment**  
5. Upload your file or enter text  
6. Click **Submit**

You should see a confirmation when it is successfully submitted.`;
  }

  if (s.includes("view") && s.includes("grade")) {
    return `📊 **How to view grades in Canvas**

1. Open your course  
2. Click **Grades** in the left menu  
3. Review scores and feedback  
4. Click an assignment for details`;
  }

  if (s.includes("discussion")) {
    return `💬 **How to reply to a discussion**

1. Open your course  
2. Click **Discussions**  
3. Select the discussion  
4. Click **Reply**  
5. Type your response  
6. Click **Post Reply**`;
  }

  return null;
}

/* -----------------------------
   OFFICIAL VIDEO PAGES
--------------------------------*/
function getCanvasVideo(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("submit") || q.includes("upload") || q.includes("turn in"))
    return "https://community.canvaslms.com/t5/Video-Guide/How-do-I-submit-an-online-assignment/ta-p/384020";

  if (q.includes("grade") || q.includes("score") || q.includes("feedback"))
    return "https://community.canvaslms.com/t5/Video-Guide/How-do-I-view-my-grades-in-a-current-course/ta-p/384071";

  if (q.includes("discussion") || q.includes("reply") || q.includes("post"))
    return "https://community.canvaslms.com/t5/Video-Guide/How-do-I-reply-to-a-discussion-as-a-student/ta-p/384013";

  if (q.includes("module") || q.includes("lesson"))
    return "https://community.canvaslms.com/t5/Video-Guide/How-do-I-view-modules/ta-p/384038";

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

    /* ---- Quick answers first ---- */
    const quick = getQuickAnswer(question);

    let answer = quick;
    if (!quick) {
      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        });

        const data = await res.json();
        answer = data.answer || "No response.";
      } catch {
        answer = "⚠️ Unable to contact help service.";
      }
    }

    const videoUrl = getCanvasVideo(question);

    const botMessage: Message = {
      role: "assistant",
      text: answer || "No response.",
      video: videoUrl || undefined,
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

        {/* Header */}
        <div className="bg-blue-900 text-white p-4 rounded-t-2xl text-center text-xl font-semibold">
          Student Help Center
        </div>

        {/* Chat Window */}
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

              {msg.video && (
                <a
                  href={msg.video}
                  target="_blank"
                  className="block mt-3 text-blue-700 underline"
                >
                  ▶ Official Canvas tutorial video
                </a>
              )}
            </div>
          ))}

          {loading && (
            <p className="text-slate-500">Thinking...</p>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t bg-white p-4 flex items-center gap-3 rounded-b-2xl">

          <label className="cursor-pointer bg-slate-200 px-3 py-2 rounded hover:bg-slate-300">
            📎
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
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