import React from "react";

export default function SentinelView({ brand }) {
  if (!brand) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        Please select a brand to view Sentinel logs.
      </div>
    );
  }

  const { lastCheck, status, credibilityScore, updatesTracked, alerts, scrapes } = brand.sentinel;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Title Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
          AI Intelligence Workspace
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight glow-text">
          Sentinel Monitoring
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Real-time Terms Scraping & Benefit Tracking Audit
        </p>
      </div>

      {/* Grid of Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1: Monitoring Status */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 shadow-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-550 uppercase font-bold tracking-wider block">Sentinel Engine</span>
            <h3 className="text-lg font-bold text-white mt-1">Status: Active</h3>
            <p className="text-xs text-gray-400 mt-1">Last check: {lastCheck}</p>
          </div>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>

        {/* Card 2: Credibility Score */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 shadow-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-550 uppercase font-bold tracking-wider block">Data Reliability</span>
            <h3 className="text-lg font-bold text-white mt-1">Score: {credibilityScore}%</h3>
            <p className="text-xs text-gray-450 mt-1">Confidence rating: High</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>

        {/* Card 3: Updates Tracked */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 shadow-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-550 uppercase font-bold tracking-wider block">Scrape Audits</span>
            <h3 className="text-lg font-bold text-white mt-1">{updatesTracked} Changes</h3>
            <p className="text-xs text-gray-400 mt-1">Logs checked since launch</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

      </div>

      {/* Main Alert Log Section */}
      <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Points and Benefit Alert Stream
        </h3>

        <div className="space-y-4">
          {alerts.map((alert, idx) => {
            let badgeStyle = "bg-white/5 text-gray-300 border-white/10";
            if (alert.type === "warning") badgeStyle = "bg-amber-500/10 text-amber-300 border-amber-500/20";
            if (alert.type === "error") badgeStyle = "bg-rose-500/10 text-rose-350 border-rose-500/20";
            if (alert.type === "success") badgeStyle = "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";

            return (
              <div key={idx} className="flex flex-col sm:flex-row items-start justify-between gap-4 p-4 border border-white/5 rounded-2xl hover:border-white/10 bg-white/[0.01] transition-colors duration-200">
                <div className="flex gap-3">
                  <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-lg border ${badgeStyle} flex-shrink-0 mt-0.5`}>
                    {alert.type}
                  </span>
                  <div>
                    <p className="text-xs text-gray-250 font-semibold leading-relaxed">{alert.message}</p>
                    <span className="text-[10px] text-gray-500 block mt-1">Event logged at: {alert.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Raw Scraping Log Console */}
      <div className="bg-black/45 border border-white/10 rounded-3xl p-6 md:p-8 shadow-inner text-gray-300 font-mono text-xs">
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <span className="text-teal-400 font-bold tracking-wider">Scraper Terminal console.log</span>
          <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            Connected
          </span>
        </div>

        <div className="space-y-2.5">
          {scrapes.map((scrape, idx) => (
            <div key={idx} className="flex items-center justify-between hover:bg-white/5 py-1 px-1.5 rounded transition">
              <div className="flex items-center gap-2 truncate">
                <span className="text-gray-500">[{scrape.time}]</span>
                <span className="text-teal-400">GET</span>
                <span className="text-gray-400 truncate">{scrape.source}</span>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="text-gray-500">{scrape.size}</span>
                <span className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] font-semibold text-gray-400 border border-white/5">
                  {scrape.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tracked Sources & Credibility Scores List */}
      <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl">
        <h3 className="text-sm font-bold text-white mb-4">Tracking Sources List</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {brand.sources.map((source, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className="overflow-hidden pr-2">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-teal-450 hover:underline font-semibold block truncate"
                >
                  {source.title} ↗
                </a>
                <span className="text-[10px] text-gray-500 block mt-0.5">Scraped URL: {source.url}</span>
              </div>
              <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-teal-400 flex-shrink-0">
                Score: {source.credibility}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
