import React, { useState } from "react";
import { mockBrands } from "../data/database";
import AnimatedBackground from "../components/background";

export default function MainLayout({
  currentPath,
  onNavigate,
  selectedBrand,
  onSelectBrand,
  children
}) {
  const [searchVal, setSearchVal] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeBrandData = mockBrands[selectedBrand] || mockBrands.starbucks;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchVal) return;

    const normalized = searchVal.toLowerCase().trim();
    let matchedKey = null;

    for (const key of Object.keys(mockBrands)) {
      if (
        key.includes(normalized) ||
        mockBrands[key].name.toLowerCase().includes(normalized)
      ) {
        matchedKey = key;
        break;
      }
    }

    if (matchedKey) {
      onSelectBrand(matchedKey);
      setSearchVal("");
      onNavigate("programs");
    } else {
      alert(`No program found matching "${searchVal}". Try Starbucks, Marriott, Delta, Sephora, or Hilton.`);
    }
  };

  const menuItems = [
    {
      name: "Dashboard", path: "dashboard", icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2 animate-pulse-glow">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      )
    },
    {
      name: "Programs", path: "programs", icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 17V7h6v10H9z" />
        </svg>
      )
    },
    {
      name: "Sentiment", path: "sentiment", icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20v-6M6 20V10M18 20V4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      name: "Comparison", path: "comparison", icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 3h5v5M4 20L20 4M21 16v5h-5M15 15l6 6M9 9L3 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      name: "Reports", path: "reports", icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    // { name: "Sentinel", path: "sentinel", icon: (
    //   <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    //     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round"/>
    //   </svg>
    // )}
  ];

  return (
    <div className="relative min-h-screen flex text-white select-none overflow-x-hidden">

      {/* 3D Animated Stars Background */}
      <AnimatedBackground />

      {/* 1. SIDEBAR (Desktop) */}
      <aside className="relative z-20 hidden lg:flex flex-col w-64 bg-black/45 backdrop-blur-xl flex-shrink-0 border-r border-white/5 justify-between">
        <div>
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3 p-6 border-b border-white/5 cursor-pointer" onClick={() => onNavigate("home")}>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-teal-400">
              <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-base tracking-wider block bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">LoyaltyLens</span>
              <span className="text-[9px] text-teal-400/80 font-bold tracking-widest uppercase">AI Intelligence Platform</span>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => onNavigate(item.path)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all duration-300 ${isActive
                      ? "bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/30 text-teal-300 shadow-lg shadow-teal-500/5"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {item.icon}
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Brand Switcher at Bottom of Sidebar */}
        <div className="p-4 border-t border-white/5 relative">
          <div className="text-[9px] text-white/40 font-bold uppercase tracking-wider mb-2">Analyzing Brand</div>

          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-white/20 transition duration-200"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-6 h-6 rounded-lg bg-teal-500/10 flex items-center justify-center text-[10px] font-bold text-teal-400 flex-shrink-0 border border-teal-500/20">
                {activeBrandData.name.charAt(0)}
              </div>
              <span className="text-xs font-bold text-white truncate">{activeBrandData.name}</span>
            </div>
            <svg className="w-3.5 h-3.5 text-white/55 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Switch Dropdown Menu */}
          {showDropdown && (
            <div className="absolute bottom-16 left-4 right-4 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl z-55 overflow-hidden divide-y divide-white/5">
              {Object.values(mockBrands).map((b) => (
                <div
                  key={b.key}
                  onClick={() => {
                    onSelectBrand(b.key);
                    setShowDropdown(false);
                  }}
                  className={`p-3 text-xs font-bold text-left cursor-pointer transition ${selectedBrand === b.key
                      ? "text-teal-400 bg-white/5 font-extrabold"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  {b.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE FRAME */}
      <div className="relative z-10 flex-grow flex flex-col min-w-0">

        {/* TOP HEADER NAVIGATION BAR */}
        <header className="bg-black/20 backdrop-blur-md border-b border-white/5 h-16 flex items-center justify-between px-6 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-white/10 hover:bg-white/5 text-white/80"
            >
              <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="lg:hidden font-bold text-sm text-white tracking-wider">LoyaltyLens</span>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-sm w-full hidden sm:block">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Ask LoyaltyLens... (e.g. Delta)"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-white/10 rounded-full focus:outline-none focus:border-teal-400 bg-white/5 hover:bg-white/10 transition text-white placeholder:text-white/40"
            />
          </form>

          {/* User profile & quick status indicators */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <span>Brand: {activeBrandData.name}</span>
            </div>

            <div className="w-[1px] h-6 bg-white/10 hidden md:block"></div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold text-xs">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTROLLER VIEWPORT */}
        <main className="flex-grow p-6 md:p-8 max-w-6xl w-full mx-auto overflow-y-auto z-10">
          {children}
        </main>
      </div>

      {/* 3. MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-55 flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>

          <aside className="relative flex flex-col w-64 max-w-xs bg-[#09090b]/95 border-r border-white/10 text-white h-full z-55 shadow-2xl justify-between">
            <div>
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-teal-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                    </svg>
                  </div>
                  <span className="font-bold text-sm tracking-wider">LoyaltyLens</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-white/60 hover:text-white p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="p-4 space-y-1.5">
                {menuItems.map((item) => {
                  const isActive = currentPath === item.path;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        onNavigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all duration-300 ${isActive
                          ? "bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/30 text-teal-300"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      {item.icon}
                      {item.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 border-t border-white/5">
              <div className="text-[9px] text-white/40 font-bold uppercase tracking-wider mb-2">Analyzing Brand</div>
              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-xs font-bold text-white truncate">{activeBrandData.name}</span>
              </div>
            </div>
          </aside>
        </div>
      )}

    </div>
  );
}