import os
import json
from typing import Dict, Any
from dotenv import load_dotenv
from google import genai
from tavily import TavilyClient
from firecrawl import FirecrawlApp

from schema import LoyaltyProgramReport

load_dotenv(override=True)

def run_loyalty_analysis(company_name: str) -> Dict[str, Any]:
    print(f"🔍 [Agent] Initiating analysis for {company_name}...", flush=True)
    
    tavily_key = os.getenv("Tavily")
    if not tavily_key:
        return {"status": "FAILED", "errors": ["Tavily API key missing"]}

    # 1. Tavily Search Discovery
    try:
        print(f"🔍 [Agent] Connecting to Tavily API for: {company_name}...", flush=True)
        tavily = TavilyClient(api_key=tavily_key)
        query = f"{company_name} rewards membership tiers official site"
        
        search_result = tavily.search(query=query, max_results=1)
        print("🔍 [Agent] Tavily request completed successfully.", flush=True)
        
        # Safely extract the URL based on the exact data structure we tested
        if isinstance(search_result, dict) and 'results' in search_result and len(search_result['results']) > 0:
            target_url = search_result['results'][0]['url']
            print(f"✅ [Agent] Target URL identified: {target_url}", flush=True)
        else:
            return {"status": "FAILED", "errors": ["Tavily returned an empty results list."]}
            
    except Exception as e:
        print(f"❌ [Agent] Search failed with exception: {e}", flush=True)
        return {"status": "FAILED", "errors": [f"Search failure: {str(e)}"]}

    # 2. Firecrawl Extraction
    print(f"🕷️ [Agent] Requesting Firecrawl scrapers for {target_url}...", flush=True)
    try:
        app = FirecrawlApp(api_key=os.getenv("Firecrawl"))
        scrape_result = app.scrape_url(target_url)
        
        if hasattr(scrape_result, "markdown") and scrape_result.markdown:
            raw_markdown = scrape_result.markdown[:6000]
        elif isinstance(scrape_result, dict):
            raw_markdown = scrape_result.get('markdown', '')[:6000]
        else:
            raw_markdown = str(scrape_result)[:6000]
            
        print(f"✅ [Agent] Successfully extracted {len(raw_markdown)} characters.", flush=True)
    except Exception as e:
        print(f"❌ [Agent] Scraping failed with exception: {e}", flush=True)
        return {"status": "FAILED", "errors": [f"Scraping failure: {str(e)}"]}

    # 3. Gemini Fact Extraction & Structuring
    print(f"🤖 [Agent] Handing context payload to Gemini...", flush=True)
    try:
        client = genai.Client(api_key=os.getenv("Gemini"))
        prompt = f"""
        Extract complete loyalty program structure, reward tiers, mechanisms, and rules for {company_name}.
        Analyze user sentiments, advantages, and limitations based on this data context:
        
        {raw_markdown}
        """
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": LoyaltyProgramReport,
            }
        )
        
        print("✅ [Agent] Analysis pipeline finalized successfully.", flush=True)
        return json.loads(response.text)
        
    except Exception as e:
        print(f"❌ [Agent] Gemini parsing failed with exception: {e}", flush=True)
        return {"status": "FAILED", "errors": [f"AI synthesis failure: {str(e)}"]}