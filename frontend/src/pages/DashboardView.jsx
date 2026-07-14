import React, { useState, useEffect } from "react";
import { fetchDashboardData } from "../services/api"; // Make sure this path is correct!

export default function DashboardView({ onSelectBrand, onNavigate }) {
  const [data, setData] = useState({
    metrics: { totalBrands: 0, avgScore: 0, avgSentiment: 0, totalScrapes: 0 },
    brands: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      const dashboardData = await fetchDashboardData();
      if (dashboardData) {
        setData(dashboardData);
      }
      setIsLoading(false);
    };
    loadDashboard();
  }, []);

  const handleSelectBrand = (companyName) => {
    onSelectBrand(companyName);
    onNavigate("programs");
  };

  const { metrics, brands } = data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-teal-400 animate-pulse font-bold tracking-widest uppercase">
          Loading Intelligence Workspace...
        </div>
      </div>
    );
  }

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
          <div className="text-3xl font-extrabold text-white mt-1">{metrics.totalBrands} Programs</div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-5 shadow-2xl">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Avg Program Scores</span>
          <div className="text-3xl font-extrabold text-white mt-1">{metrics.avgScore}/100</div>
          <span className="text-[10px] text-gray-400 mt-1 block">Verified sources data</span>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-5 shadow-2xl">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Avg Customer Sentiment</span>
          <div className="text-3xl font-extrabold text-white mt-1">{metrics.avgSentiment}%</div>
          <span className="text-[10px] text-teal-400 font-semibold mt-1 block">
            {metrics.avgSentiment >= 70 ? "Mostly Positive" : metrics.avgSentiment >= 40 ? "Mixed" : "Needs Improvement"}
          </span>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-5 shadow-2xl">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Updates Monitored</span>
          <div className="text-3xl font-extrabold text-white mt-1">{metrics.totalScrapes} Scrapes</div>
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

        {brands.length === 0 ? (
          <div className="text-center py-12 bg-white/[0.02] border border-white/[0.05] rounded-3xl">
            <p className="text-gray-400">No programs monitored yet. Use the sidebar to analyze a brand.</p>
          </div>
        ) : (
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
                   
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/5 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-500 block">Score Rating</span>
                      <span className="font-bold text-white mt-0.5 block">{b.score}/100</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block">Sentiment</span>
                      <span className="font-bold text-white mt-0.5 block">{b.sentiment}% </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-teal-450 hover:text-teal-300 transition-colors">
                  <span>View Program Intelligence →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}