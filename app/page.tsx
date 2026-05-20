"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    setLoading(true);
    setAnswer("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    setAnswer(data.answer);
    setLoading(false);
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">AthleteAI Career OS</h1>

      <p className="mb-6 text-gray-600">
        Private AI assistant for career strategy, AI projects, finance interviews, and hockey transition planning.
      </p>

      <textarea
        className="w-full border rounded-xl p-4 min-h-40"
        placeholder="Ask me to rewrite a LinkedIn message, prep an interview answer, score a job fit, or build a career plan..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={sendMessage}
        disabled={loading || !message}
        className="mt-4 px-5 py-3 rounded-xl bg-black text-white disabled:opacity-50"
      >
        {loading ? "Thinking..." : "Send"}
      </button>

      {answer && (
        <div className="mt-6 border rounded-xl p-4 whitespace-pre-wrap">
          {answer}
        </div>
      )}
    </main>
  );
}