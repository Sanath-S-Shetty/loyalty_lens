import React from "react";
import { mockBrands } from "../data/database";

export default function DashboardView({ onSelectBrand, onNavigate }) {
  const brands = Object.values(mockBrands);
  const totalBrands = brands.length;
  const avgScore = Math.round(brands.reduce((acc, curr) => acc + curr.score, 0) / totalBrands);
  const avgSentiment = Math.round(brands.reduce((acc, curr) => acc + curr.sentiment, 0) / totalBrands);

  const handleSelectBrand = (key) => {
    onSelectBrand(key);
    onNavigate("programs");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
          AI Intelligence Workspace
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight glow-text">
          Workspace Overview
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Real-time loyalty program intelligence and customer sentiment tracker
        </p>
      </div>

      {/* Analytics KPI Dashboard Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-5 shadow-2xl">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Monitored Contracts</span>
          <div className="text-3xl font-extrabold text-white mt-1">{totalBrands} Programs</div>
          {/* <span className="text-[10px] text-teal-400 font-semibold mt-1 block">Live tracking active</span> */}
        </div>

        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-5 shadow-2xl">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Avg Credibility</span>
          <div className="text-3xl font-extrabold text-white mt-1">{avgScore}/100</div>
          <span className="text-[10px] text-gray-400 mt-1 block">Verified sources data</span>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-5 shadow-2xl">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Avg Customer Sentiment</span>
          <div className="text-3xl font-extrabold text-white mt-1">{avgSentiment}%</div>
          <span className="text-[10px] text-teal-400 font-semibold mt-1 block">Mostly Positive</span>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-5 shadow-2xl">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Updates Monitored</span>
          <div className="text-3xl font-extrabold text-white mt-1">435 Scrapes</div>
          <span className="text-[10px] text-gray-400 mt-1 block">Tavily & Firecrawl integrated</span>
        </div>
      </div>

      {/* Grid of Monitored Brand Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="3" width="7" height="9" />
            <rect x="14" y="3" width="7" height="5" />
            <rect x="14" y="12" width="7" height="9" />
            <rect x="3" y="16" width="7" height="5" />
          </svg>
          Monitored Loyalty Programs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {brands.map((b) => (
            <div
              key={b.key}
              onClick={() => handleSelectBrand(b.key)}
              className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 shadow-2xl hover:border-teal-500/30 hover:bg-white/[0.05] transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-bold text-white text-sm leading-snug group-hover:text-teal-300 transition duration-200">{b.name}</h3>
                    <span className="text-[10px] text-gray-500 mt-0.5 block">Position: {b.marketPosition}</span>
                  </div>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[9px] font-bold uppercase tracking-wider">
                    Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/5 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-500 block">Score Rating</span>
                    <span className="font-bold text-white mt-0.5 block">{b.score}/100</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">Sentiment</span>
                    <span className="font-bold text-white mt-0.5 block">{b.sentiment}% Pos</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-teal-450 hover:text-teal-300 transition-colors">
                <span>View Program Intelligence →</span>
                {/* <span className="text-[10px] text-gray-500 font-medium font-sans">Last audited {b.sentinel.lastCheck}</span> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
