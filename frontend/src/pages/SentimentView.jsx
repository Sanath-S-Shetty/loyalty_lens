import React from "react";

export default function SentimentView({ brand }) {
  if (!brand) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        Please select a brand to view sentiment details.
      </div>
    );
  }

  // Sentiment values
  const positiveVal = brand.sentiment;
  const negativeVal = Math.round((100 - positiveVal) * 0.4);
  const neutralVal = 100 - positiveVal - negativeVal;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Title Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
          AI Intelligence Workspace
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight glow-text">
          Dashboard
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Overall Customer Sentiment & Perception
        </p>
      </div>

      {/* Main Sentiment Card */}
      <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-md text-center md:text-left">
            <h2 className="text-xl font-bold text-white">Sentiment Score</h2>
            <p className="text-sm text-gray-400">
              Overall customer perception based on social listening, forum analyses, and product review scraping.
            </p>
            
            {/* Sources indicator */}
            <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-semibold bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                Credibility Score: {brand.score}%
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-semibold bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                Sources Tracked: {brand.sources.length} Channels
              </span>
            </div>
          </div>

          {/* Large circular indicator */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-white/5"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                className="text-teal-400 transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - positiveVal / 100)}`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-white">{positiveVal}%</span>
              <span className="text-[10px] text-teal-400 uppercase font-bold tracking-wider">Positive</span>
            </div>
          </div>
        </div>

        {/* 3 columns breakdown */}
        <div className="grid grid-cols-3 gap-4 border-t border-white/5 mt-6 pt-6 text-center">
          <div>
            <div className="text-xs text-gray-500 font-medium">Positive</div>
            <div className="text-2xl font-bold text-teal-400 mt-1">{positiveVal}%</div>
          </div>
          <div className="border-x border-white/5">
            <div className="text-xs text-gray-500 font-medium">Neutral</div>
            <div className="text-2xl font-bold text-gray-300 mt-1">{neutralVal}%</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">Negative</div>
            <div className="text-2xl font-bold text-rose-400 mt-1">{negativeVal}%</div>
          </div>
        </div>
      </div>

      {/* Positive and Negative Themes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Positive Themes */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            Positive Themes
          </h3>

          <div className="space-y-3">
            {brand.positiveThemes.map((theme, idx) => (
              <div key={idx} className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">{theme.text}</span>
                <span className="text-xs font-bold text-emerald-450 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                  {theme.value}% Approval
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Negative Themes */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm12-3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
            </svg>
            Negative Themes
          </h3>

          <div className="space-y-3">
            {brand.negativeThemes.map((theme, idx) => (
              <div key={idx} className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300">{theme.text}</span>
                <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg">
                  {theme.value}% Frequency
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    
       
    </div>
  );
}
