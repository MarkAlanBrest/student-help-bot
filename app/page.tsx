"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
  video?: string;
  fileName?: string;
};

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
    setQuestion("");
    setLoading(true);

    const res = await fetch("/api/ask", {
      method: "POST",
      body: JSON.stringify({ question }),
    });

    const data = await res.json();

    let videoUrl = "";

    const q = question.toLowerCase();
    if (q.includes("submit")) {
      videoUrl = "https://www.youtube.com/embed/5I1wq0WzW9k";
    } else if (q.includes("grade")) {
      videoUrl = "https://www.youtube.com/embed/qM9J2S9k5l4";
    }

    const botMessage: Message = {
      role: "assistant",
      text: data.answer,
      video: videoUrl || undefined,
    };

    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
    setFile(null);
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
<p className="whitespace-pre-wrap">{msg.text}</p>

              {msg.fileName && (
                <p className="text-sm mt-2 opacity-80">
                  📎 {msg.fileName}
                </p>
              )}

              {msg.video && (
                <iframe
                  className="mt-3 w-full rounded"
                  height="250"
                  src={msg.video}
                  title="Help Video"
                  allowFullScreen
                />
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

          {/* Upload Button */}
          <label className="cursor-pointer bg-slate-200 px-3 py-2 rounded hover:bg-slate-300">
            📎
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Show selected file */}
          {file && (
            <span className="text-sm text-slate-600 truncate max-w-[150px]">
              {file.name}
            </span>
          )}

          {/* Text Input */}
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 border rounded px-3 py-2"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />

          {/* Send Button */}
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