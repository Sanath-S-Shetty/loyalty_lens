# LoyaltyLenz 🔍

> An AI-powered full-stack application that autonomously crawls, audits, and synthesizes corporate loyalty program terms and consumer sentiment.

[![Try it](https://img.shields.io/badge/Demo-Live%20Website-brightgreen?style=for-the-badge)](https://loyalty-lens-1.onrender.com/)


---

## 🚀 Overview

LoyaltyLenz eliminates the hassle of reading fine print. Built with a robust **FastAPI** backend and a responsive **React** frontend, it orchestrates a **3-stage LangGraph multi-agent pipeline** to scrape structural data sources, and evaluate consumer feedback in real-time.

### ⚡ Key Engineering Highlights
* **Multi-Agent AI Pipeline:** Leverages LangGraph and Gemini Flash to ingest, audit, and analyze over 5,000+ words of legal and consumer data per query.
* **Optimized Dual-Layer Storage:** Integrates Supabase (PostgreSQL) for persistent data tracking alongside Upstash (Redis), achieving **sub-50ms cache hit latency** for previously analyzed brands.
* **Dynamic Analytics UI:**  Built a responsive analytics dashboard in React featuring localized sentiment and program analysis, multi-brand comparisons, and report generation.

---

## 🏗️ Architecture & Data Flow

1. **User Request:** The user inputs a brand name (e.g., "KFC") into the React interface.
2. **FastAPI & Cache Check:** Backend checks Upstash Redis. If cached brand data exists, it is returned instantly (**<50ms**).
3. **Agentic Miss Handling:** On a cache miss, a background task spins up a LangGraph workflow:
   * **Agent 1 (Scraper):** Routes queries concurrently through Tavily and Firecrawl.
   * **Agent 2 (Auditor):** Formats, normalizes, and runs credibility scaling rules.
   * **Agent 3 (Synthesizer):** Generates structural sentiment, highlights core themes, and evaluates the final loyalty metrics.
4. **Persistence:** The completed analysis saves to Supabase and gets cached in Redis for future requests.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, Vite
* **Backend:** Python, FastAPI, LangGraph, Gemini Flash LLM
* **Data & Caching:** PostgreSQL (Supabase), Redis (Upstash)
* **Scraping & Ingestion:** Tavily API, Firecrawl API
* **Deployment:** Render (Web Services & Static Sites)

---

## 🌐 Deployment Infrastructure

This application is deployed and hosted on **Render**:
* **Backend:** Deployed as an auto-managed Web Service bridging the React frontend to the Python engine. Database traffic is optimized using a Supabase IPv4 **Session Pooler (port 5432)** connection string.
* **Frontend:** Deployed as a Static Site. It utilizes strict environment routing alongside client-side URL rewriting (`/* -> /index.html`) to ensure seamless SPA routing on page refreshes.
