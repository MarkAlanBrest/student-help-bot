"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Paperclip, Link as LinkIcon, RefreshCw, MessageCircle } from "lucide-react";
import { getCanvasGuide } from "../lib/canvasResources";

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
  const [typing, setTyping] = useState(false);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

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
    setTyping(true);
    setPlaceholderVisible(false);

    let answer = "I’m thinking about that…";

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
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

    setTimeout(() => {
      setMessages((prev) => [...prev, botMessage]);
      setTyping(false);
    }, 600);

    setQuestion("");
    setFile(null);
  }

  function resetChat() {
    setMessages([]);
    setQuestion("");
    setFile(null);
    setTyping(false);
    setPlaceholderVisible(true);
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div className="w-full h-full flex flex-col bg-white border border-slate-300 rounded-xl overflow-hidden">

      {/* Header */}
      <div className="px-4 py-3 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle size={18} className="text-blue-700" />
          <h1 className="font-semibold text-slate-800">Canvas Help Assistant</h1>
        </div>

        <button
          onClick={resetChat}
          className="text-slate-600 hover:text-red-600 flex items-center gap-1 text-sm"
        >
          <RefreshCw size={16} />
          Reset
        </button>
      </div>

      {/* Chat window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
              msg.role === "user"
                ? "bg-blue-600 text-white ml-auto"
                : "bg-slate-100 text-slate-900 border border-slate-300"
            }`}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {String(msg.text)}
            </ReactMarkdown>

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

        {typing && (
          <div className="bg-slate-100 border border-slate-300 text-slate-600 px-3 py-2 rounded-xl w-fit">
            <span className="animate-pulse">Assistant is typing…</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <div className="border-t px-3 py-3 flex items-center gap-2 bg-slate-50">
        <label className="cursor-pointer px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300">
          <Paperclip size={18} />
          <input type="file" onChange={handleFileChange} className="hidden" />
        </label>

        {file && (
          <span className="text-xs opacity-80 truncate max-w-[120px]">
            {file.name}
          </span>
        )}

        <input
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            setPlaceholderVisible(false);
          }}
          onFocus={() => setPlaceholderVisible(false)}
          placeholder={
            placeholderVisible
              ? "💡 Try asking: “How do I submit an assignment?”"
              : ""
          }
          className="flex-1 rounded-xl px-3 py-2 bg-white border border-slate-300 text-sm placeholder-slate-400"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <button
          onClick={handleSend}
          className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-xl hover:bg-blue-600 shadow"
        >
          <Send size={16} />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}
