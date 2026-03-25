"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Paperclip, Link as LinkIcon } from "lucide-react";
import { CanvasResources, getCanvasGuide } from "../lib/canvasResources";

type Message = {
  role: "user" | "assistant";
  text: string;
  helpLink?: string;
  helpDescription?: string;
  fileName?: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const recommended = [
    "How do I submit an assignment",
    "Where do I find my grades",
    "How do I message my teacher",
    "How do I take a quiz",
    "How do I view modules",
  ];

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

    let answer = "I’m thinking about that…";

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
        cache: "no-store",
      });

      const data = await res.json();
      answer = data.answer || answer;
    } catch {
      answer = "I couldn’t reach the AI service.";
    }

    const guideInfo = getCanvasGuide(question);

    const botMessage: Message = {
      role: "assistant",
      text: answer,
      helpLink: guideInfo?.guide,
      helpDescription: guideInfo?.description,
    };

    setMessages((prev) => [...prev, botMessage]);

    setQuestion("");
    setFile(null);
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="min-h-screen bg-slate-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl h-[85vh] bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col overflow-hidden">

        {/* Recommended topics */}
        {messages.length === 0 && (
          <div className="p-6 border-b bg-slate-50">
            <h2 className="text-sm font-semibold mb-3">Try asking about:</h2>
            <div className="flex flex-wrap gap-2">
              {recommended.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setQuestion(topic)}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat window */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] p-4 rounded-2xl shadow ${
                msg.role === "user"
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-white text-slate-900 border border-slate-200"
              }`}
            >
       <div className="text-sm">
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {String(msg.text)}
  </ReactMarkdown>
</div>



              {msg.fileName && (
                <p className="text-xs mt-2 opacity-80 flex items-center gap-1">
                  <Paperclip size={14} /> {msg.fileName}
                </p>
              )}

              {msg.helpLink && (
                <a
                  href={msg.helpLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 mt-3 text-xs font-medium underline"
                >
                  <LinkIcon size={14} />
                  <span>Canvas Guide</span>
                </a>
              )}

              {msg.helpDescription && (
                <p className="text-xs mt-1 opacity-80">{msg.helpDescription}</p>
              )}
            </div>
          ))}

          <div ref={chatEndRef} />
        </div>

        {/* Input bar */}
        <div className="border-t px-4 py-3 flex items-center gap-3 bg-white">
          <label className="cursor-pointer px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200">
            <Paperclip size={18} />
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>

          {file && (
            <span className="text-xs opacity-80 truncate max-w-[150px]">
              {file.name}
            </span>
          )}

          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 rounded-xl px-3 py-2 text-sm bg-slate-100 border border-slate-300"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />

          <button
            onClick={handleSend}
            className="flex items-center gap-2 bg-blue-700 text-white px-5 py-2 rounded-xl hover:bg-blue-600 shadow"
          >
            <Send size={16} />
            <span>Send</span>
          </button>
        </div>
      </div>
    </main>
  );
}
