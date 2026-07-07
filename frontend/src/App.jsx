import React, { useState, useEffect } from "react";
import Home from "./pages/home";
import AnimatedBackground from "./components/background";
import { mockBrands } from "./data/database";
import MainLayout from "./layouts/mainlayout";
import DashboardView from "./pages/DashboardView";
import ProgramsView from "./pages/ProgramsView";
import SentimentView from "./pages/SentimentView";
import ComparisonView from "./pages/ComparisonView";
import ReportsView from "./pages/ReportsView";
// import SentinelView from "./pages/SentinelView";

function App() {
  const [currentPath, setCurrentPath] = useState("home");
  const [selectedBrand, setSelectedBrand] = useState("starbucks");
  const [comparedBrands, setComparedBrands] = useState(["starbucks", "marriott", "hilton"]);

  // Listen to hash changes for simple routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const path = hash.substring(2) || "home"; // remove #/
      setCurrentPath(path);
    };

    // Initialize
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = (path) => {
    window.location.hash = "#/" + path;
  };

  const handleAnalysisComplete = (brandKey) => {
    if (mockBrands[brandKey]) {
      setSelectedBrand(brandKey);
      navigate("programs");
    }
  };

  const activeBrandData = mockBrands[selectedBrand] || mockBrands.starbucks;

  // Intercept click events globally to catch clicks on anchors that are on the home page
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (href === "#") {
        const text = anchor.textContent.trim().toLowerCase();
        if (text === "home") {
          e.preventDefault();
          navigate("home");
        } else if (text === "programs") {
          e.preventDefault();
          navigate("programs");
        } else if (text === "compare" || text === "compare programs") {
          e.preventDefault();
          navigate("comparison");
        } else if (text === "reports") {
          e.preventDefault();
          navigate("reports");
        }
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  // Routing render
  if (currentPath === "home" || currentPath === "") {
    return (
      <div className="relative min-h-screen">
        <AnimatedBackground />
        <div className="relative z-50">
          <Home
            onAnalysisComplete={handleAnalysisComplete}
            onNavigateCompare={() => navigate("comparison")}
          />
        </div>
      </div>
    );
  }

  // Dashboard layout pages
  let childView = null;
  switch (currentPath) {
    case "dashboard":
      childView = (
        <DashboardView
          onSelectBrand={setSelectedBrand}
          onNavigate={navigate}
        />
      );
      break;
    case "programs":
      childView = <ProgramsView brand={activeBrandData} />;
      break;
    case "sentiment":
      childView = <SentimentView brand={activeBrandData} />;
      break;
    case "comparison":
      childView = (
        <ComparisonView
          comparedBrands={comparedBrands}
          setComparedBrands={setComparedBrands}
        />
      );
      break;
    case "reports":
      childView = <ReportsView brand={activeBrandData} />;
      break;
    // case "sentinel":
    //   childView = <SentinelView brand={activeBrandData} />;
    //   break;
    default:
      childView = (
        <DashboardView
          onSelectBrand={setSelectedBrand}
          onNavigate={navigate}
        />
      );
  }

  return (
    <MainLayout
      currentPath={currentPath}
      onNavigate={navigate}
      selectedBrand={selectedBrand}
      onSelectBrand={setSelectedBrand}
    >
      {childView}
    </MainLayout>
  );
}

export default App;
