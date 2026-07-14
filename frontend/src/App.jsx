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
  
  const [comparedBrands, setComparedBrands] = useState([]);
 const [selectedBrand, setSelectedBrand] = useState(() => {
    return localStorage.getItem("selected_brand_name") || "Starbucks";
  });
  // Create a state to hold the LIVE data from the AI backend
  const [liveData, setLiveData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

 useEffect(() => {
    const reloadActiveBrandData = async () => {
      if (selectedBrand) {
        setIsAnalyzing(true);
        try {
          const result = await runLoyaltyAnalysis(selectedBrand);
          setLiveData(result);
        } catch (error) {
          console.error("Failed to restore persistent brand data from DB:", error);
          setLiveData(null); // Fallback to local mocks if server is down
        } finally {
          setIsAnalyzing(false);
        }
      }
    };
    reloadActiveBrandData();
  }, [selectedBrand]);
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

 const handleBrandSelectionChange = (brandName) => {
    if (!brandName) return;
    const cleanName = brandName.trim();
    setSelectedBrand(cleanName);
    localStorage.setItem("selected_brand_name", cleanName);
  };

  const navigate = (path) => {
    window.location.hash = "#/" + path;
  };

const handleAnalysisComplete = async (brandInput) => {
    setIsAnalyzing(true);
    try {
      console.log(`Sending ${brandInput} to AI Backend...`);
      const aiResult = await runLoyaltyAnalysis(brandInput);
      
      console.log("Analysis Complete! Received:", aiResult);
      
      // Save the AI response to React state
      setLiveData(aiResult);
      
      // Strictly anchor the app to the clean string you typed!
      handleBrandSelectionChange(brandInput.trim().toLowerCase());
      
      navigate("programs");

    } catch (error) {
      console.error("AI Analysis Failed, falling back to mock data:", error);
      
      const fallbackKey = brandInput.trim().toLowerCase();
      if (mockBrands[fallbackKey]) {
        setLiveData(null); // Clear live data to use mock
        handleBrandSelectionChange(fallbackKey);
        navigate("programs");
      } else {
        alert("Analysis failed and no offline mock data is available for this brand.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };
  // If we have live AI data, use it! Otherwise, fall back to the mock database.
  // Change this line in App.jsx
// Replace your activeBrandData matching block with this clean check:
  const activeBrandData = liveData || mockBrands[selectedBrand.toLowerCase()] || mockBrands.starbucks;

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
      childView = (
        <DashboardView 
          onSelectBrand={async (brandName) => {
            setIsAnalyzing(true);
            try {
              // Trigger the pipeline (will hit the DB cache instantly via our API logic!)
              const result = await runLoyaltyAnalysis(brandName);
              setLiveData(result);
              
              // ✅ Anchored strictly to the clean input
              handleBrandSelectionChange(brandName.trim().toLowerCase());
              
            } catch (error) {
              console.error("Failed to load dashboard brand:", error);
              // Fallback to mock data if it fails
              setLiveData(null);
              
              // ✅ Anchored strictly to the clean input here too
              handleBrandSelectionChange(brandName.trim().toLowerCase());
              
            } finally {
              setIsAnalyzing(false);
            }
          }} 
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
    selectedBrand={selectedBrand || "Starbucks"}
    onSelectBrand={async (brandName) => {
      setIsAnalyzing(true);
      try {
        const result = await runLoyaltyAnalysis(brandName);
        setLiveData(result);
        handleBrandSelectionChange(brandName.strip().toLowerCase());
      } catch (error) {
        console.error("Sidebar interaction pull failed:", error);
        setLiveData(null); 
        handleBrandSelectionChange(brandName.strip().toLowerCase());
       
      } finally {
        setIsAnalyzing(false);
      }
    }}
  >
    {/* If it's reloading the persistent state from the database, show a clean loader */}
    {isAnalyzing && !liveData ? (
      <div className="flex items-center justify-center h-64">
        <div className="text-teal-400 animate-pulse font-bold tracking-widest text-xs uppercase">
          Restoring connection session...
        </div>
      </div>
    ) : (
      childView
    )}
  </MainLayout>
  );
}

export default App;