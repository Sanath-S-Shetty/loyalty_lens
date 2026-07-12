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
        
      

      
         
      </div> 

      {/* Main Brand Profile Header Card */}
      <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-bold text-white">{brand.name}</h2>
            
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

     
     
    </div>
  );
}
