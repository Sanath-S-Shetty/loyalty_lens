import React, { useState } from "react";
import { mockBrands } from "../data/database";

export default function ComparisonView({ comparedBrands, setComparedBrands }) {
  const [isSelecting, setIsSelecting] = useState(comparedBrands.length === 0);
  const [selectedList, setSelectedList] = useState(
    comparedBrands.length > 0 ? comparedBrands : ["starbucks", "marriott", "hilton"]
  );

  const toggleBrand = (key) => {
    if (selectedList.includes(key)) {
      if (selectedList.length > 2) {
        setSelectedList(selectedList.filter((k) => k !== key));
      }
    } else {
      setSelectedList([...selectedList, key]);
    }
  };

  const handleStartCompare = () => {
    if (selectedList.length >= 2) {
      setComparedBrands(selectedList);
      setIsSelecting(false);
    }
  };

  const activeBrands = comparedBrands.map((key) => mockBrands[key]).filter(Boolean);

  if (isSelecting || activeBrands.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
            Comparison Wizard
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight glow-text">
            Compare Programs
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Select programs to benchmark side-by-side
          </p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-2">
            What programs would you like to compare?
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Please choose at least two loyalty programs to display in the benchmark intelligence matrix.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {Object.values(mockBrands).map((brand) => {
              const isChecked = selectedList.includes(brand.key);
              return (
                <div
                  key={brand.key}
                  onClick={() => toggleBrand(brand.key)}
                  className={`border rounded-2xl p-5 cursor-pointer transition-all duration-200 ${
                    isChecked
                      ? "border-teal-500 bg-teal-500/5 shadow-md shadow-teal-500/5"
                      : "border-white/10 bg-white/[0.01] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">{brand.name}</h3>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        isChecked
                          ? "border-teal-400 bg-teal-400 text-black font-extrabold"
                          : "border-white/20 bg-transparent"
                      }`}
                    >
                      {isChecked && (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 mt-3">
                    <div>
                      <span className="text-[10px] text-gray-500 block font-medium">Score</span>
                      <span className="text-xs font-bold text-white">{brand.score}/100</span>
                    </div>
                    <div className="border-l border-white/5 pl-3">
                      <span className="text-[10px] text-gray-500 block font-medium">Perception</span>
                      <span className="text-xs font-bold text-white">{brand.sentiment}% Pos</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleStartCompare}
              disabled={selectedList.length < 2}
              className={`px-6 py-3 rounded-2xl font-semibold text-xs transition duration-200 ${
                selectedList.length >= 2
                  ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-450 hover:to-emerald-450 text-black font-bold shadow-lg shadow-teal-500/10 cursor-pointer"
                  : "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
              }`}
            >
              Compare Programs ({selectedList.length} Selected)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
            AI Intelligence Workspace
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight glow-text">
            Competitive Comparison
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Benchmark loyalty programs against industry leaders
          </p>
        </div>

        <button
          onClick={() => setIsSelecting(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-white/10 hover:bg-white/5 text-white font-semibold text-xs transition duration-200 self-start sm:self-center cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Modify Comparison
        </button>
      </div>

      {/* Comparison Matrix Table Card */}
      <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <h2 className="text-base font-bold text-white">Comparison Matrix</h2>
          <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider">
            {activeBrands.length} Programs Compared
          </span>
        </div>

        <div className="overflow-x-auto -mx-6 md:-mx-8 px-6 md:px-8">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-white/10 text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                <th className="pb-4 w-1/4">Metric</th>
                {activeBrands.map((b) => (
                  <th key={b.key} className="pb-4 px-4 text-white">{b.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-300">
              {/* Program Score */}
              <tr>
                <td className="py-4 font-semibold text-gray-500">Program Score</td>
                {activeBrands.map((b) => (
                  <td key={b.key} className="py-4 px-4 font-bold text-teal-400">{b.score}</td>
                ))}
              </tr>
              {/* Sentiment */}
              <tr>
                <td className="py-4 font-semibold text-gray-500">Sentiment Rating</td>
                {activeBrands.map((b) => (
                  <td key={b.key} className="py-4 px-4 text-white">{b.sentiment}% Positive</td>
                ))}
              </tr>
              {/* Market Position */}
              <tr>
                <td className="py-4 font-semibold text-gray-500">Market Position</td>
                {activeBrands.map((b) => (
                  <td key={b.key} className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-gray-300 font-bold border border-white/10">
                      {b.marketPosition}
                    </span>
                  </td>
                ))}
              </tr>
              {/* Confidence */}
              <tr>
                <td className="py-4 font-semibold text-gray-500">Credibility Level</td>
                {activeBrands.map((b) => (
                  <td key={b.key} className="py-4 px-4 text-teal-400 font-semibold">{b.confidence}% Accurate</td>
                ))}
              </tr>
              {/* Earn Rate */}
              <tr>
                <td className="py-4 font-semibold text-gray-500 w-1/4">Earning Method</td>
                {activeBrands.map((b) => (
                  <td key={b.key} className="py-4 px-4 text-gray-400 max-w-xs leading-relaxed">{b.earnRate}</td>
                ))}
              </tr>
              {/* Key Strengths */}
              <tr>
                <td className="py-4 font-semibold text-gray-500">Key Strengths</td>
                {activeBrands.map((b) => (
                  <td key={b.key} className="py-4 px-4 text-gray-400 max-w-xs leading-relaxed">{b.strengths}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sources & Credibility Tracking Panel for all compared brands */}
      <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl">
        <h3 className="text-base font-bold text-white mb-5 pb-4 border-b border-white/5">
          Tracking Citations & Verification URLs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeBrands.map((brand) => (
            <div key={brand.key} className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wide flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/10">
                <span>{brand.name} Sources</span>
                <span className="text-[10px] text-teal-400 font-bold">Credibility: {brand.score}%</span>
              </h4>
              <div className="space-y-2">
                {brand.sources.slice(0, 2).map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs p-2 hover:bg-white/[0.04] rounded-lg">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-450 hover:underline font-medium truncate max-w-[250px]"
                    >
                      {s.title} ↗
                    </a>
                    <span className="text-[10px] text-gray-500 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                      {s.credibility}% rel
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
