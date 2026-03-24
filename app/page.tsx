"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function handleAsk() {
    const res = await fetch("/api/ask", {
      method: "POST",
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    setAnswer(data.answer);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">

        <h1 className="text-3xl font-bold text-blue-900 mb-4">
          Student Help Center
        </h1>

        <p className="mb-6 text-slate-700">
          Ask about Canvas, study tips, or online learning.
        </p>

        {/* Question Input */}
        <div className="flex gap-2 mb-6">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 border rounded p-2"
          />
          <button
            onClick={handleAsk}
            className="bg-blue-900 text-white px-4 rounded hover:bg-blue-800"
          >
            Ask
          </button>
        </div>

        {/* Answer Area */}
        <div className="bg-slate-50 border rounded p-4">
          {answer || "Answer will appear here."}
        </div>

      </div>
    </main>
  );
}