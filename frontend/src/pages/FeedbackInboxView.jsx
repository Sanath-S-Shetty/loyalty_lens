import React, { useState, useEffect } from "react";
import { fetchContactMessages } from "../services/api";

export default function FeedbackInboxView() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const data = await fetchContactMessages();
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch contact messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(filterText.toLowerCase()) ||
      msg.email.toLowerCase().includes(filterText.toLowerCase()) ||
      (msg.subject && msg.subject.toLowerCase().includes(filterText.toLowerCase())) ||
      msg.message.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
            AI Operations Console
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight glow-text">
            Feedback Inbox
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Internal database log of contact form inquiries and system feedback
          </p>
        </div>

        {/* Reload Action */}
        <button
          onClick={fetchMessages}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-white font-semibold text-xs transition duration-200 cursor-pointer disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh Feed
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-5 shadow-2xl">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Tickets</span>
          <div className="text-3xl font-extrabold text-white mt-1">{messages.length} Submissions</div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-5 shadow-2xl">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Unfiltered Search Matches</span>
          <div className="text-3xl font-extrabold text-teal-400 mt-1">{filteredMessages.length} Messages</div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-5 shadow-2xl">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Database Source</span>
          <div className="text-3xl font-extrabold text-white mt-1">PostgreSQL</div>
        </div>
      </div>

      {/* Filter and Inbox Container */}
      <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        {/* Search Bar filter */}
        <div className="relative max-w-md w-full">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search feedback by keyword, email or sender..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-white/10 rounded-full focus:outline-none focus:border-teal-400 bg-white/5 hover:bg-white/10 transition text-white placeholder:text-white/45"
          />
        </div>

        {/* Submissions List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-teal-400 animate-pulse font-bold tracking-widest uppercase text-xs">
              Fetching Submissions Feed...
            </div>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-xs italic">
            No support tickets match the current criteria or table is empty.
          </div>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-white/[0.04] hover:border-teal-500/10 transition duration-200"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-teal-300">{msg.name}</span>
                    <span className="text-[10px] text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                      {msg.email}
                    </span>
                    {msg.subject && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md font-semibold">
                        Subject: {msg.subject}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-mono whitespace-pre-wrap mt-1">
                    {msg.message}
                  </p>
                </div>
                <div className="text-right flex-shrink-0 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                  {msg.created_at ? new Date(msg.created_at).toLocaleString() : "Date Unknown"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
