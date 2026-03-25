"use client";

import {
  useState,
  useRef,
  useEffect,
  type RefObject,
  type ReactNode,
} from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  MessageCircle,
  Sun,
  Moon,
  Trash2,
  HelpCircle,
  Link as LinkIcon,
  Paperclip,
  Send,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";

import { CanvasResources, getCanvasGuide } from "../lib/canvasResources";

type Role = "user" | "assistant";

type Message = {
  role: Role;
  text: string;
  helpLink?: string;
  helpDescription?: string;
  fileName?: string;
};

/* ========== COMPONENTS ========== */

function Sidebar({ theme }: { theme: "light" | "dark" }) {
  const isDark = theme === "dark";

  return (
    <aside
      className={`w-56 flex flex-col justify-between p-5 border-r ${
        isDark ? "border-white/10 bg-black/30" : "border-slate-200 bg-white/60"
      }`}
    >
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
            <MessageCircle className="text-white" size={22} />
          </div>
          <div>
            <p className="font-semibold text-sm tracking-wide">
              Canvas Help Chat
            </p>
            <p className="text-xs opacity-70">Student Support</p>
          </div>
        </div>

        <nav className="space-y-2 text-sm">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          <SidebarItem icon={<BookOpen size={18} />} label="Guides" />
          <SidebarItem icon={<HelpCircle size={18} />} label="FAQ" />
        </nav>
      </div>

      <div className="text-xs opacity-70">
        <p>Powered by AI + Canvas Guides</p>
      </div>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  active,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-default ${
        active ? "bg-blue-600 text-white shadow-md" : "hover:bg-white/10"
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

function TopNav({
  theme,
  setTheme,
}: {
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
}) {
  const isDark = theme === "dark";

  return (
    <header
      className={`flex items-center justify-between px-6 py-4 border-b ${
        isDark ? "border-white/10 bg-black/20" : "border-slate-200 bg-white/70"
      }`}
    >
      <div>
        <h1 className="text-lg font-semibold tracking-wide flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          Student Help Center
        </h1>
        <p className="text-xs opacity-70">
          Ask questions about Canvas, and get official guide links when it makes sense.
        </p>
      </div>

      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-xs shadow-md"
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
        <span>{isDark ? "Light mode" : "Dark mode"}</span>
      </button>
    </header>
  );
}

function ChatWindow({
  messages,
  chatEndRef,
  theme,
}: {
  messages: Message[];
  chatEndRef: RefObject<HTMLDivElement | null>;
  theme: "light" | "dark";
}) {
  const isDark = theme === "dark";

  return (
    <div
      className={`flex-1 overflow-y-auto p-6 space-y-4 ${
        isDark ? "bg-white/5" : "bg-slate-50"
      }`}
    >
      {messages.length === 0 && (
        <p className={`text-center text-sm ${isDark ? "text-slate-300" : "text-slate-500"}`}>
          Ask about Canvas, study tips, or upload instructions.
        </p>
      )}

      {messages.map((msg, i) => (
        <MessageBubble key={i} msg={msg} theme={theme} />
      ))}

      <div ref={chatEndRef} />
    </div>
  );
}

function MessageBubble({ msg, theme }: { msg: Message; theme: "light" | "dark" }) {
  const isUser = msg.role === "user";
  const isDark = theme === "dark";

  return (
    <div
      className={`max-w-[80%] p-4 rounded-2xl shadow-md backdrop-blur-xl ${
        isUser
          ? "bg-blue-600 text-white ml-auto"
          : isDark
          ? "bg-white/10 text-white border border-white/10"
          : "bg-white text-slate-900 border border-slate-200"
      }`}
    >
      <div
        className={`prose max-w-none text-sm ${
          isUser ? "prose-invert" : isDark ? "prose-invert" : "prose-slate"
        }`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
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
          <span>Official Canvas guide</span>
        </a>
      )}

      {msg.helpDescription && (
        <p className="text-xs mt-1 opacity-80">{msg.helpDescription}</p>
      )}
    </div>
  );
}

function InputBar({
  question,
  setQuestion,
  file,
  handleFileChange,
  handleSend,
  theme,
}: {
  question: string;
  setQuestion: (v: string) => void;
  file: File | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSend: () => void;
  theme: "light" | "dark";
}) {
  const isDark = theme === "dark";

  return (
    <div
      className={`border-t px-4 py-3 flex items-center gap-3 ${
        isDark ? "border-white/10 bg-black/30" : "border-slate-200 bg-white"
      }`}
    >
      <label
        className={`cursor-pointer px-3 py-2 rounded-xl flex items-center justify-center shadow-md ${
          isDark
            ? "bg-white/10 text-white hover:bg-white/20"
            : "bg-slate-100 text-slate-800 hover:bg-slate-200"
        }`}
      >
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
        className={`flex-1 rounded-xl px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          isDark
            ? "bg-white/10 text-white placeholder-white/50 border border-white/20"
            : "bg-slate-100 text-slate-900 placeholder-slate-500 border border-slate-200"
        }`}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
      />

      <button
        onClick={handleSend}
        className="flex items-center gap-2 bg-blue-700 text-white px-5 py-2 rounded-xl hover:bg-blue-600 shadow-lg text-sm"
      >
        <Send size={16} />
        <span>Send</span>
      </button>
    </div>
  );
}

function QuickLinksPanel({ theme }: { theme: "light" | "dark" }) {
  const isDark = theme === "dark";

  return (
    <aside
      className={`w-64 border-l p-4 flex flex-col gap-3 ${
        isDark ? "border-white/10 bg-black/20" : "border-slate-200 bg-white/70"
      }`}
    >
      <h2 className="text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
        <BookOpen size={14} />
        Canvas Quick Links
      </h2>

      <div className="space-y-2 text-xs">
        {CanvasResources.map((res) => (
          <a
            key={res.label}
            href={res.guide}
            target="_blank"
            rel="noopener noreferrer"
            className={`block rounded-xl px-3 py-2 border text-left hover:shadow-md transition ${
              isDark
                ? "border-white/10 bg-white/5 hover:bg-white/10"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <p className="font-semibold flex items-center gap-1">
              <LinkIcon size={12} />
              {res.label}
            </p>
            <p className="opacity-70 mt-1">{res.description}</p>
          </a>
        ))}
      </div>
    </aside>
  );
}

function FloatingActions({ onClear }: { onClear: () => void }) {
  return (
    <div className="absolute bottom-8 right-8 flex flex-col gap-3">
      <button
        onClick={onClear}
        className="h-10 w-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl hover:bg-red-500"
        title="Clear chat"
      >
        <Trash2 size={18} />
      </button>

      <button
        className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl hover:bg-blue-500"
        title="Help"
      >
        <HelpCircle size={18} />
      </button>
    </div>
  );
}

/* ========== HOME ========== */

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  }

  function handleSend() {
    if (!question.trim() && !file) return;

    const userMessage: Message = {
      role: "user",
      text: question || "(File uploaded)",
      fileName: file?.name,
    };

    const guideInfo = getCanvasGuide(question);

    const botMessage: Message = {
      role: "assistant",
      text:
        question.trim().length > 0
          ? `I hear you asking about: "${question}". This is a demo response, but the chat is working.`
          : "This is a demo response. The chat pipeline is working.",
      helpLink: guideInfo?.guide,
      helpDescription: guideInfo?.description,
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setQuestion("");
    setFile(null);
  }

  function handleClear() {
    setMessages([]);
    setQuestion("");
    setFile(null);
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isDark = theme === "dark";

  return (
    <main
      className={`min-h-screen p-6 flex items-center justify-center transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          : "bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100"
      }`}
    >
      <div className="w-full max-w-6xl h-[85vh] rounded-3xl shadow-2xl backdrop-blur-xl bg-white/5 border border-white/10 flex overflow-hidden">
        <Sidebar theme={theme} />

        <div className="flex-1 flex flex-col">
          <TopNav theme={theme} setTheme={setTheme} />

          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 flex flex-col">
              <ChatWindow
                messages={messages}
                chatEndRef={chatEndRef}
                theme={theme}
              />

              <InputBar
                question={question}
                setQuestion={setQuestion}
                file={file}
                handleFileChange={handleFileChange}
                handleSend={handleSend}
                theme={theme}
              />
            </div>

            <QuickLinksPanel theme={theme} />
          </div>
        </div>

        <FloatingActions onClear={handleClear} />
      </div>
    </main>
  );
}
