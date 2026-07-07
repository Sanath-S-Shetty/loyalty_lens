import React from "react";

export default function ReportsView({ brand }) {
  if (!brand) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        Please select a brand to view reports.
      </div>
    );
  }

  const { executiveSummary, keyFindings, metadata } = brand.summary;

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
          Executive Summary & Structured Findings
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Summary & Findings (Colspan 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Executive Summary Card */}
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold uppercase tracking-wider mb-4">
              Executive Brief
            </span>
            <h2 className="text-xl font-bold text-white mb-3">Executive Summary</h2>
            <p className="text-sm text-gray-305 leading-relaxed">
              {executiveSummary}
            </p>
          </div>

          {/* Key Findings Card */}
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-5">Key Findings</h2>
            <div className="space-y-4">
              {keyFindings.map((finding, idx) => (
                <div key={idx} className="flex items-start gap-3.5 bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.04] transition duration-200">
                  <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-teal-450 font-bold text-xs flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {finding}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Actions, Metadata & Download (Colspan 1) */}
        <div className="space-y-6">
          
          {/* Actions Card */}
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-white mb-4">Actions</h3>
            
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-450 text-black font-extrabold text-xs transition-all duration-300 shadow-lg shadow-teal-550/10 cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export PDF
            </button>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-white/10 hover:bg-white/5 text-white font-semibold text-xs transition duration-200 cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.685-2.342m0 5.2l-4.685-2.342M19 12a3 3 0 11-6 0 3 3 0 016 0zM6 7a3 3 0 11-6 0 3 3 0 016 0zm0 10a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Share Report
            </button>
          </div>

          {/* Report Metadata Card */}
          <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-4">Report Metadata</h3>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="text-gray-500">Generated:</span>
                <span className="font-semibold text-white">{metadata.generated}</span>
              </div>
              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="text-gray-500">Confidence:</span>
                <span className="font-semibold text-teal-400">{metadata.confidence}</span>
              </div>
              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="text-gray-500">Sources Count:</span>
                <span className="font-semibold text-white">{metadata.sources} websites</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Verification:</span>
                <span className="inline-flex items-center gap-1 font-semibold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full text-[10px]">
                  {metadata.verification}
                </span>
              </div>
            </div>
          </div>

          {/* PDF File Download button */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-4 flex items-center justify-between hover:border-white/10 transition duration-200 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-teal-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Executive Intelligence Report</h4>
                <p className="text-[10px] text-gray-500">PDF Document • 4.2 MB</p>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>

        </div>
      </div>

      {/* Sources & Credibility Tracking Panel */}
      <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-white/5">
          <div>
            <h3 className="text-base font-bold text-white">
              Tracked Intelligence Sources
            </h3>
            <p className="text-xs text-gray-500">
              Citations and web resources referenced to compile this brief.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-450 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
            <span className="text-xs font-bold uppercase tracking-wider">
              Verification Level: 100% Verified
            </span>
          </div>
        </div>

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
                <span className="text-[10px] text-gray-550 block mt-0.5">Tracked URL: {source.url}</span>
              </div>
              <div className="flex-shrink-0">
                <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-semibold text-gray-350">
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
