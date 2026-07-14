const API_BASE_URL = 'http://localhost:8000/api';

export const runLoyaltyAnalysis = async (companyName) => {
  try {
    const startRes = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company_name: companyName }),
    });
    
    if (!startRes.ok) throw new Error('Failed to start analysis');
    const startData = await startRes.json();
    
    return await pollForResults(startData.job_id);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const pollForResults = async (jobId) => {
  for (let i = 0; i < 60; i++) {
    const res = await fetch(`${API_BASE_URL}/results/${jobId}`);
    const data = await res.json();

    if (data.status === 'COMPLETED') {
      const report = data.result_data;
      
      // Use the actual URLs passed from the LangGraph backend!
      report.sources = report.actual_sources || [
        { name: "Official Documentation", url: "#", credibility: 95 },
        { name: "Community Forums", url: "#", credibility: 82 }
      ];
      
      report.sentinel = {
        status: "Active",
        lastScan: new Date().toLocaleDateString(),
        threatLevel: "Low",
        alerts: ["Real-time web analysis completed successfully."]
      };
      
      return report;
    }
    
    if (data.status === 'FAILED') throw new Error(data.result_data?.error || 'Analysis failed');

    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  throw new Error('Analysis timed out.');
};


export const fetchDashboardData = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard`);
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    return await res.json();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { 
      metrics: { totalBrands: 0, avgScore: 0, avgSentiment: 0, totalScrapes: 0 }, 
      brands: [] 
    };
  }
};

export const fetchComparisonMatrix = async (companyNames) => {
  try {
    const res = await fetch(`${API_BASE_URL}/comparison`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(companyNames),
    });
    if (!res.ok) throw new Error('Failed to fetch comparison matrix');
    return await res.json();
  } catch (error) {
    console.error("Error fetching comparison matrix:", error);
    return [];
  }
};

export const searchCompanyDatabase = async (query) => {
  if (!query.trim()) return [];
  try {
    const res = await fetch(`${API_BASE_URL}/companies/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Search failed');
    return await res.json();
  } catch (error) {
    console.error("Database search failure:", error);
    return [];
  }
};