import React from "react";

export default function ProgramsView({ brand }) {
  if (!brand) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        Please select a brand to view programs.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
            AI Intelligence Workspace
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight glow-text">
            Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Competitive Intelligence Overview
          </p>
        </div>
        
        {/* Credibility & Source Quick View */}
        <div className="flex items-center gap-3">
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-3 shadow-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-sm">
              {brand.score}
            </div>
            <div>
              <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Credibility Score</div>
              <div className="text-xs text-gray-300 font-semibold flex items-center gap-1">
                High Confidence ({brand.confidence}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Brand Profile Header Card */}
      <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-bold text-white">{brand.name}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 text-xs font-semibold">
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l5-5z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Loyalty Program Analysis</p>
          </div>
        </div>

        {/* 4 KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
            <div className="text-xs text-gray-500 font-medium">Program Score</div>
            <div className="text-2xl font-bold text-white mt-1">{brand.score}/100</div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
            <div className="text-xs text-gray-500 font-medium">Market Position</div>
            <div className="text-2xl font-bold text-white mt-1">{brand.marketPosition}</div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
            <div className="text-xs text-gray-500 font-medium">Sentiment</div>
            <div className="text-2xl font-bold text-white mt-1">{brand.sentiment}%</div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
            <div className="text-xs text-gray-500 font-medium">Confidence</div>
            <div className="text-2xl font-bold text-white mt-1">{brand.confidence}%</div>
          </div>
        </div>
      </div>

      {/* Tiers and Benefits Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Membership Tiers Card */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              Membership Tiers
            </h3>
            
            <div className="space-y-4">
              {brand.tiers.map((tier, idx) => (
                <div key={idx} className="border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors duration-200 bg-white/[0.01]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white text-sm">{tier.name}</span>
                    <span className="text-xs text-teal-450 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full font-semibold">
                      {tier.requirement}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed mt-1">{tier.benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Grid Card */}
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Key Benefits
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {brand.tiers.flatMap(t => t.benefit.split(',')).map((benefitStr, idx) => {
              const cleanStr = benefitStr.replace(/^[.\s-]+/, '').trim();
              if (!cleanStr) return null;
              return (
                <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex items-center gap-2.5 hover:bg-white/[0.04] transition-all duration-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0"></span>
                  <span className="text-xs text-gray-300 font-medium leading-tight">{cleanStr}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Earning & Redemption Rules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            Earning Rules
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed bg-white/[0.01] border border-white/5 rounded-2xl p-4">
            {brand.earnRate}
          </p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            Redemption Rules
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed bg-white/[0.01] border border-white/5 rounded-2xl p-4">
            {brand.redemption}
          </p>
        </div>
      </div>

      {/* Sources & Credibility Tracking Panel */}
      <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-white/5">
          <div>
            <h3 className="text-base font-bold text-white">
              Intelligence Sources & Credibility Tracking
            </h3>
            <p className="text-xs text-gray-500">
              All structural details above are continuously tracked and cross-verified by active scraper agents.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-450 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-wider">
              Verification Score: {brand.confidence}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {brand.sources.map((source, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition duration-200">
              <div className="flex items-center gap-3 overflow-hidden pr-2">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-teal-400 flex-shrink-0 text-xs">
                  {idx + 1}
                </div>
                <div className="overflow-hidden">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-teal-450 hover:underline font-semibold block truncate"
                  >
                    {source.title} ↗
                  </a>
                  <span className="text-[10px] text-gray-500">Tracked since: {source.trackedSince}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-semibold text-gray-300">
                  Credibility: {source.credibility}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
