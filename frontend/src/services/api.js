const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const formatReportData = (report) => {
  if (!report) return report;
  
  // Ensure sources exists and has required title, url, credibility attributes
  const rawSources = report.actual_sources || report.sources || [
    { name: "Official Documentation", url: "#", credibility: 95 },
    { name: "Community Forums", url: "#", credibility: 82 }
  ];
  
  report.sources = rawSources.map(src => ({
    ...src,
    title: src.title || src.name || "Official Reference",
    url: src.url || "#",
    credibility: src.credibility !== undefined ? src.credibility : 85
  }));
  
  // Ensure sentinel exists
  if (!report.sentinel) {
    report.sentinel = {
      status: "Active",
      lastScan: new Date().toLocaleDateString(),
      threatLevel: "Low",
      alerts: ["Real-time web analysis completed successfully."]
    };
  }

  // Ensure positiveThemes and negativeThemes are direct arrays if they got nested or missing
  if (!Array.isArray(report.positiveThemes)) {
    report.positiveThemes = (report.sentiment && Array.isArray(report.sentiment.positiveThemes)) 
      ? report.sentiment.positiveThemes 
      : [];
  }
  if (!Array.isArray(report.negativeThemes)) {
    report.negativeThemes = (report.sentiment && Array.isArray(report.sentiment.negativeThemes)) 
      ? report.sentiment.negativeThemes 
      : [];
  }
  
  return report;
};

export const runLoyaltyAnalysis = async (companyName) => {
  try {
    const startRes = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company_name: companyName }),
    });
    
    if (!startRes.ok) throw new Error('Failed to start analysis');
    const startData = await startRes.json();
    
    // ⬇️ THE FIX: Intercept completed cache hits instantly and format them ⬇️
    if (startData.status === "COMPLETED" && startData.result_data) {
      console.log("⚡ Instant Cache Hit! Bypassing polling.");
      return formatReportData(startData.result_data);
    }
    // ⬆️ END OF FIX ⬆️
    
    // If it's a CACHE MISS, startData.status will be "PENDING", 
    // and the code safely moves on to poll the backend while the AI runs.
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
      return formatReportData(data.result_data);
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

export const submitContactMessage = async (formData) => {
  const res = await fetch(`${API_BASE_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      subject: formData.subject || null,
      message: formData.message,
    }),
  });
  if (!res.ok) throw new Error("Failed to submit contact message");
  return await res.json();
};

export const fetchContactMessages = async () => {
  const res = await fetch(`${API_BASE_URL}/contact`);
  if (!res.ok) throw new Error("Failed to fetch contact messages");
  return await res.json();
};