import React,{ useState } from "react";

export default function Home({ onAnalysisComplete, onNavigateCompare }) {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [searchStage, setSearchStage] = useState(0);
  const [searchStatus, setSearchStatus] = useState("");
  const [agentOutput, setAgentOutput] = useState(null);

  // Pre-configured reports for simulation
  const mockReports = {
    starbucks: {
      name: "Starbucks Rewards",
      tiers: "Green (0-150 Stars), Gold (150+ Stars)",
      earnRate: "2 Stars per $1 spent with Starbucks Card, 1 Star per $1 with cash/debit",
      redemption: "25 Stars (customize drink), 100 Stars (brew/bakery), 200 Stars (latte), 400 Stars (merch)",
      strengths: "Seamless mobile app integration, highly gamified experience, massive active member base.",
      weaknesses: "Frequent redemption cost increases (points inflation), limited reward variety outside beverages.",
      sentiment: "87% Positive (highly engaging, but complaints about point devaluation)",
      source: "https://www.starbucks.com/rewards/terms",
      citation: "Official Starbucks Rewards Terms & Conditions (June 2026)"
    },
    marriott: {
      name: "Marriott Bonvoy",
      tiers: "Silver Elite (10 nights), Gold Elite (25 nights), Platinum Elite (50 nights), Titanium Elite (75 nights)",
      earnRate: "10 points per $1 spent at Marriott properties, plus 10% to 75% Elite bonuses",
      redemption: "Free nights starting at 5,000 points, points-to-airline transfers with 40+ partners",
      strengths: "Enormous global property selection, high value for top-tier elites (free breakfasts, upgrades).",
      weaknesses: "Transitioned to dynamic point redemption pricing making luxury stays less predictable.",
      sentiment: "76% Positive (great hotel footprint, mixed feelings on dynamic pricing)",
      source: "https://www.marriott.com/loyalty/terms",
      citation: "Marriott Bonvoy Program Rules & Terms (May 2026)"
    },
    delta: {
      name: "Delta SkyMiles",
      tiers: "Silver Medallion, Gold Medallion, Platinum Medallion, Diamond Medallion",
      earnRate: "5 miles per $1 spent on flights (up to 11 miles/$1 for Diamond Elites)",
      redemption: "Award flights, class upgrades, Sky Club access, Delta Vacations packages",
      strengths: "Miles never expire, excellent operational reliability and premium flight experience.",
      weaknesses: "Drastic increases in Medallion Qualification Dollars (MQD) requirements; low value per mile.",
      sentiment: "64% Positive (loyal flyers value service, but hate recent qualification hikes)",
      source: "https://www.delta.com/skymiles/program-rules",
      citation: "Delta SkyMiles Program Rules & Guidelines (2026)"
    },
    sephora: {
      name: "Sephora Beauty Insider",
      tiers: "Insider (Free), VIB (Spend $350/yr), Rouge (Spend $1,000/yr)",
      earnRate: "1 point per $1 spent, plus multiplier events (2x, 3x, 4x)",
      redemption: "100 points (trial size samples), 500 points ($10 off), 2,500+ points (exclusive products/experiences)",
      strengths: "Excellent experiential rewards, birthday gifts, highly customized product trials.",
      weaknesses: "Top-tier rewards (Rouge status) have felt progressively less exclusive over time.",
      sentiment: "82% Positive (highly addictive tier rewards, minor complaints about Rouge benefits)",
      source: "https://www.sephora.com/beauty/beauty-insider",
      citation: "Sephora Beauty Insider Terms & Conditions (March 2026)"
    }
  };

  const handleStartAnalysis = async (e) => {
  e.preventDefault();
  if (!companyName) return;

  setSearchStage(1);
  setSearchStatus("Stage 1: Finding official loyalty pages & T&Cs using Tavily Search API...");
  setAgentOutput(null);

  // Cosmetic stage progression only — purely visual, doesn't gate anything
  const timers = [
    setTimeout(() => {
      setSearchStage(2);
      setSearchStatus("Stage 2: Processing and rendering dynamic content using Firecrawl...");
    }, 1200),
    setTimeout(() => {
      setSearchStage(3);
      setSearchStatus("Stage 3: Fact Finder Agent extracting structured rewards data via Gemini Flash...");
    }, 2400),
    setTimeout(() => {
      setSearchStage(4);
      setSearchStatus("Stage 4: Critic Agent scanning forums and reviews to calculate Customer Sentiment...");
    }, 4800),
   
  ];

  try {
    // THIS is the call that was missing — fires the real backend request
    // as soon as the form submits, not on a button click after a mock report.
    await onAnalysisComplete(companyName);
    timers.forEach(clearTimeout);
    closeModal(); // App.js has already navigated by the time this resolves
  } catch (err) {
    timers.forEach(clearTimeout);
    console.error("Analysis failed:", err);
    setSearchStage(0);
    setSearchStatus("");
    alert("Analysis failed. Please try again.");
  }
};

  const closeModal = () => {
    setShowSearchModal(false);
    setCompanyName("");
    setSearchStage(0);
    setSearchStatus("");
    setAgentOutput(null);
  };

  return (
    <main className="relative min-h-screen text-white select-none flex flex-col justify-between overflow-hidden px-6 py-6 md:px-12 md:py-8 z-20">

      {/* SVG Network Lines Overlay (direct viewport spacing) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block" xmlns="http://www.w3.org/2000/svg">
        {/* Left top node path (Starbucks) */}
        <path d="M 0 250 H 160 Q 240 250 270 220 T 380 160" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
        <path d="M 0 250 H 160 Q 240 250 270 220 T 380 160" fill="none" stroke="url(#cyan-glow-gradient)" strokeWidth="1.5" className="animate-dash" />

        {/* Left bottom node path (Marriott) */}
        <path d="M 0 580 H 140 Q 220 580 250 550 T 360 470" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
        <path d="M 0 580 H 140 Q 220 580 250 550 T 360 470" fill="none" stroke="url(#cyan-glow-gradient)" strokeWidth="1.5" className="animate-dash" />

        {/* Right top node path (Delta) */}
        <path d="M 1920 250 H 1760 Q 1680 250 1650 220 T 1540 160" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
        <path d="M 1920 250 H 1760 Q 1680 250 1650 220 T 1540 160" fill="none" stroke="url(#teal-glow-gradient)" strokeWidth="1.5" className="animate-dash" />

        {/* Right bottom node path (Sephora) */}
        <path d="M 1920 580 H 1780 Q 1700 580 1670 550 T 1560 470" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
        <path d="M 1920 580 H 1780 Q 1700 580 1670 550 T 1560 470" fill="none" stroke="url(#teal-glow-gradient)" strokeWidth="1.5" className="animate-dash" />

        <defs>
          <linearGradient id="cyan-glow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(20,184,166,0.5)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <linearGradient id="teal-glow-gradient" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(45,212,191,0.5)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
      </svg>

      {/* 
        1. NAVBAR 
      */}
      <header className="relative z-30 flex items-center justify-between w-full">
        {/* Logo */}
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="relative w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-white/20 transition-all duration-300">
            {/* Crescent Swirl Logo */}
            <svg className="w-5 h-5 text-teal-400 group-hover:rotate-180 transition-transform duration-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="absolute inset-0 bg-teal-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="font-semibold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">LoyaltyLens</span>
        </div>

        {/* Centered Navigation Menu */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full glass px-3 py-1.5">
          <a href="#" className="px-4 py-1.5 rounded-full text-xs font-medium text-white/90 hover:text-white hover:bg-white/5 transition-all duration-200">Home</a>
          <a href="#" className="px-4 py-1.5 rounded-full text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200">Programs</a>
          <a href="#" className="px-4 py-1.5 rounded-full text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200">Compare</a>
          <a href="#" className="px-4 py-1.5 rounded-full text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200">Reports</a>
          <a href="#" className="px-4 py-1.5 rounded-full text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200">FAQ</a>
          <div className="w-[1px] h-4 bg-white/15 mx-1"></div>
          <button className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] uppercase font-bold tracking-wider text-teal-400 transition-all duration-200">
            Agent Live
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
          </button>
          <div className="p-1 rounded-full bg-white text-black flex items-center justify-center ml-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-5">
          <a href="#" className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition duration-200">
            <svg className="w-4 h-4 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Create Account
          </a>
        </div>
      </header>

      {/* 
        2. INTERACTIVE LOYALTY PROGRAM NODES (LEFT AND RIGHT) 
      */}
      <div className="absolute inset-0 pointer-events-none z-10 hidden lg:block">
        {/* Node 1: Starbucks Rewards (Top-Left) */}
        <div className="absolute top-[22%] left-[10%] animate-float pointer-events-auto group cursor-pointer" style={{ animationDelay: '0s' }}>
          <div className="flex items-center gap-3 bg-black/40 border border-white/5 hover:border-teal-400/30 p-2.5 rounded-2xl glass transition-all duration-500 shadow-2xl">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-400/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 group-hover:scale-110 transition-all duration-300">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                <h4 className="text-[11px] font-bold tracking-wider text-white">LIVE WEB RETRIVEAL</h4>
              </div>

            </div>
          </div>
        </div>

        {/* Node 2: Marriott Bonvoy (Bottom-Left) */}
        <div className="absolute bottom-[24%] left-[8%] animate-float pointer-events-auto group cursor-pointer" style={{ animationDelay: '1.5s' }}>
          <div className="flex items-center gap-3 bg-black/40 border border-white/5 hover:border-teal-400/30 p-2.5 rounded-2xl glass transition-all duration-500 shadow-2xl">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                <h4 className="text-[11px] font-bold tracking-wider text-white">STRUCTURED REPORT</h4>
              </div>

            </div>
          </div>
        </div>

        {/* Node 3: Delta SkyMiles (Top-Right) */}
        <div className="absolute top-[24%] right-[10%] animate-float pointer-events-auto group cursor-pointer" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center gap-3 bg-black/40 border border-white/5 hover:border-teal-400/30 p-2.5 rounded-2xl glass transition-all duration-500 shadow-2xl">
            <div>
              <div className="flex items-center gap-1.5 justify-end">
                <h4 className="text-[11px] font-bold tracking-wider text-white">SIDE BY SIDE COMPARISION</h4>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              </div>

            </div>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-400/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 group-hover:scale-110 transition-all duration-300">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Node 4: Sephora Beauty Insider (Bottom-Right) */}
        <div className="absolute bottom-[26%] right-[8%] animate-float pointer-events-auto group cursor-pointer" style={{ animationDelay: '2.2s' }}>
          <div className="flex items-center gap-3 bg-black/40 border border-white/5 hover:border-teal-400/30 p-2.5 rounded-2xl glass transition-all duration-500 shadow-2xl">
            <div>
              <div className="flex items-center gap-1.5 justify-end">
                <h4 className="text-[11px] font-bold tracking-wider text-white">SOURCE ATTRIBUTION</h4>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              </div>

            </div>
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 
        3. HERO SECTION 
      */}
      <section className="relative z-20 flex flex-col items-center justify-center flex-grow text-center px-4 max-w-3xl mx-auto py-16 md:py-24">
        {/* Top Pill Info */}
        <div className="mb-6 animate-pulse-glow-white">
          <div
            onClick={() => { setCompanyName(""); setShowSearchModal(true); }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-white/10 text-[11px] text-gray-300 hover:border-white/20 transition-all duration-300 cursor-pointer pointer-events-auto"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
            <span>Live Loyalty Analysis Active</span>
            <span className="text-teal-400 font-bold">→</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight select-none">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500 glow-text block pb-1">
            One-click for Loyalty
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-200 via-teal-400 to-emerald-400 block pb-2">
            Intelligence
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-xs sm:text-sm md:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
          Extract loyalty program rules, compare tiers, and map customer sentiment.
          Powered by an autonomous multi-agent pipeline using Tavily, Firecrawl, and LangGraph.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center relative z-30">
          <button
            onClick={() => setShowSearchModal(true)}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-100 active:scale-95 transition duration-300 shadow-xl shadow-white/5 flex items-center justify-center gap-2 cursor-pointer pointer-events-auto"
          >
            Analyze Program ↗
          </button>
          <button
            onClick={onNavigateCompare}
            className="w-full sm:w-auto px-7 py-3 rounded-full glass border border-white/10 hover:border-white/20 text-white font-medium text-sm hover:bg-white/5 active:scale-95 transition duration-300 flex items-center justify-center gap-2 cursor-pointer pointer-events-auto"
          >
            Compare Programs
          </button>
        </div>

        {/* Central Animated Vertical Stream Lines */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-28 h-24 overflow-hidden pointer-events-none flex justify-between opacity-70">
          <div className="w-[1px] h-full bg-white/5 relative">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-teal-400 to-transparent animate-stream" style={{ animationDelay: '0s' }}></div>
          </div>
          <div className="w-[1px] h-full bg-white/5 relative">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white to-transparent animate-stream" style={{ animationDelay: '1.4s' }}></div>
          </div>
          <div className="w-[1px] h-full bg-white/5 relative">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-teal-400 to-transparent animate-stream" style={{ animationDelay: '0.7s' }}></div>
          </div>
        </div>
      </section>



      {/* 
        5. MULTI-AGENT PIPELINE SIMULATOR MODAL
      */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300">
          <div className="relative w-full max-w-2xl bg-[#09090b]/90 border border-white/10 rounded-3xl p-6 md:p-8 overflow-hidden shadow-2xl glass animate-float">

            {/* Modal Ambient Glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <div className="flex items-center gap-2 mb-1.5">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.904-4.137m-8.904 0L21 9l-3.413-3.413M9.813 15.904L3.904 12 12 3l3.587 3.587M3.904 12l8.904 4.137M12 3v18" />
              </svg>
              <h2 className="text-xl font-bold tracking-wide">Loyalty Intelligence Agent</h2>
            </div>
            <p className="text-xs text-gray-400 mb-6">
              Enter any brand to run our autonomous multi-agent analysis system. Try <strong className="text-teal-400 cursor-pointer" onClick={() => setCompanyName("Starbucks")}>Starbucks</strong>, <strong className="text-teal-400 cursor-pointer" onClick={() => setCompanyName("KFC")}>KFC</strong>, or <strong className="text-teal-400 cursor-pointer" onClick={() => setCompanyName("AIR INDIA")}>AIR INDIA</strong>.
            </p>

            {/* Input Form */}
            {searchStage === 0 && (
              <form onSubmit={handleStartAnalysis} className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter loyalty program name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="flex-grow px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-teal-400 transition"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-semibold text-sm transition shadow-lg shadow-teal-500/20 cursor-pointer"
                  >
                    Run Agent
                  </button>
                </div>
              </form>
            )}

            {/* Running pipeline stages */}
            {searchStage > 0 && !agentOutput && (
              <div className="space-y-6 py-4">
                {/* Loader bar */}
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-400 transition-all duration-300 ease-out"
                    style={{ width: `${(searchStage / 5) * 100}%` }}
                  ></div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full border-2 border-teal-400 border-t-transparent animate-spin flex-shrink-0 mt-0.5"></div>
                  <div>
                    <h4 className="text-sm font-semibold text-white tracking-wide">{searchStatus}</h4>
                    <p className="text-xs text-gray-400 mt-1">Executing autonomous extraction tasks in the background...</p>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-white/4">
                  {[
                    { label: "1. Search", stageNum: 1 },
                    { label: "2. Scrape", stageNum: 2 },
                    { label: "3. Extract", stageNum: 3 },
                    { label: "4. Sentiment", stageNum: 4 },
                   
                  ].map((s) => (
                    <div
                      key={s.label}
                      className={`p-2 rounded-lg border text-center transition-all ${searchStage >= s.stageNum
                        ? "bg-teal-500/10 border-teal-500/30 text-teal-400 font-medium"
                        : "bg-white/2 border-white/5 text-gray-500"
                        }`}
                    >
                      <p className="text-[10px]">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agent Output Report */}
            {agentOutput && (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400">Verified Intelligence Report</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{agentOutput.name}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-[10px] text-teal-400 font-bold uppercase">
                    <span>Score: 100/100</span>
                  </div>
                </div>

                {/* Report Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white/2 border border-white/5 p-3.5 rounded-xl">
                    <h4 className="font-bold text-gray-300 uppercase tracking-wide text-[9px] mb-1">Membership Tiers</h4>
                    <p className="text-gray-200 leading-relaxed">{agentOutput.tiers}</p>
                  </div>

                  <div className="bg-white/2 border border-white/5 p-3.5 rounded-xl">
                    <h4 className="font-bold text-gray-300 uppercase tracking-wide text-[9px] mb-1">Earning Rates</h4>
                    <p className="text-gray-200 leading-relaxed">{agentOutput.earnRate}</p>
                  </div>

                  <div className="bg-white/2 border border-white/5 p-3.5 rounded-xl md:col-span-2">
                    <h4 className="font-bold text-gray-300 uppercase tracking-wide text-[9px] mb-1">Redemption Structure</h4>
                    <p className="text-gray-200 leading-relaxed">{agentOutput.redemption}</p>
                  </div>

                  <div className="bg-teal-500/5 border border-teal-500/10 p-3.5 rounded-xl">
                    <h4 className="font-bold text-teal-400 uppercase tracking-wide text-[9px] mb-1">Key Strengths</h4>
                    <p className="text-gray-200 leading-relaxed">{agentOutput.strengths}</p>
                  </div>

                  <div className="bg-red-500/5 border border-red-500/10 p-3.5 rounded-xl">
                    <h4 className="font-bold text-red-400 uppercase tracking-wide text-[9px] mb-1">Key Weaknesses</h4>
                    <p className="text-gray-200 leading-relaxed">{agentOutput.weaknesses}</p>
                  </div>
                </div>

                {/* Sentiment & Citations */}
                <div className="bg-white/2 border border-white/5 p-4 rounded-xl text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Customer Sentiment Rating:</span>
                    <span className="font-bold text-teal-400">{agentOutput.sentiment}</span>
                  </div>
                  <div className="border-t border-white/5 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-gray-400">Source Citations (Fact Checked):</span>
                    <a
                      href={agentOutput.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-400 hover:underline inline-flex items-center gap-1 font-semibold truncate"
                    >
                      {agentOutput.citation} ↗
                    </a>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 justify-between pt-4 border-t border-white/10">
                  <button
                    onClick={() => { setCompanyName(""); setSearchStage(0); setAgentOutput(null); }}
                    className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium text-xs transition cursor-pointer"
                  >
                    ← Analyze Another
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={closeModal}
                      className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 text-white font-semibold text-xs transition cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        const normalized = companyName.toLowerCase();
                        let targetKey = "starbucks";
                        if (normalized.includes("marriott") || normalized.includes("bonvoy")) targetKey = "marriott";
                        else if (normalized.includes("delta") || normalized.includes("skymiles")) targetKey = "delta";
                        else if (normalized.includes("sephora") || normalized.includes("insider") || normalized.includes("beauty")) targetKey = "sephora";
                        
                        closeModal();
                        onAnalysisComplete(targetKey);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-xs transition cursor-pointer shadow-lg shadow-teal-500/20"
                    >
                      Open Dashboard Analysis →
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </main>
  );
}