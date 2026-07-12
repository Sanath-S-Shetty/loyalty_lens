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
import { runLoyaltyAnalysis } from "./services/api"; // <-- Import our new API service!

function App() {
  const [currentPath, setCurrentPath] = useState("home");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [comparedBrands, setComparedBrands] = useState(["starbucks", "marriott", "hilton"]);
  
  // Create a state to hold the LIVE data from the AI backend
  const [liveData, setLiveData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Listen to hash changes for simple routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const path = hash.substring(2) || "home"; // remove #/
      setCurrentPath(path);
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = (path) => {
    window.location.hash = "#/" + path;
  };

  // 🔥 Trigger the AI Pipeline 🔥
  const handleAnalysisComplete = async (brandInput) => {
    setIsAnalyzing(true);
    try {
      console.log(`Sending ${brandInput} to AI Backend...`);
      // Call your LangGraph backend!
      const aiResult = await runLoyaltyAnalysis(brandInput);
      
      console.log("Analysis Complete! Received:", aiResult);
      // Save the AI response to React state
      setLiveData(aiResult);
      setSelectedBrand(aiResult.key);
      navigate("programs");

    } catch (error) {
      console.error("AI Analysis Failed, falling back to mock data:", error);
      
      // Fallback to offline mock data if the API is down or fails
      const fallbackKey = brandInput.toLowerCase();
      if (mockBrands[fallbackKey]) {
        setSelectedBrand(fallbackKey);
        setLiveData(null); // Clear live data to use mock
        navigate("programs");
      } else {
        alert("Analysis failed and no offline mock data is available for this brand.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // If we have live AI data, use it! Otherwise, fall back to the mock database.
  const activeBrandData = liveData || mockBrands[selectedBrand] || mockBrands.starbucks;

  // Intercept click events globally
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
            isAnalyzing={isAnalyzing} // Pass loading state to Home if you want to show a spinner!
          />
        </div>
      </div>
    );
  }

  // Dashboard layout pages
  let childView = null;
  switch (currentPath) {
    case "dashboard":
      childView = <DashboardView onSelectBrand={setSelectedBrand} onNavigate={navigate} />;
      break;
    case "programs":
      childView = <ProgramsView brand={activeBrandData} />;
      break;
    case "sentiment":
      childView = <SentimentView brand={activeBrandData} />;
      break;
    case "comparison":
      childView = <ComparisonView comparedBrands={comparedBrands} setComparedBrands={setComparedBrands} />;
      break;
    case "reports":
      childView = <ReportsView brand={activeBrandData} />;
      break;
    default:
      childView = <DashboardView onSelectBrand={setSelectedBrand} onNavigate={navigate} />;
  }

  return (
    <MainLayout
      currentPath={currentPath}
      onNavigate={navigate}
      selectedBrand={activeBrandData.key || selectedBrand}
      onSelectBrand={(brand) => {
        setLiveData(null); // If user manually switches to a mock brand from sidebar, clear live data
        setSelectedBrand(brand);
      }}
    >
      {childView}
    </MainLayout>
  );
}

export default App;