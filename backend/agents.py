import os
from dotenv import load_dotenv
from typing import TypedDict, List, Dict, Any, Optional
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from firecrawl import FirecrawlApp
from tavily import TavilyClient
import urllib.request
import urllib.parse
from schema import LoyaltyReport

load_dotenv() 

tavily_client = TavilyClient(api_key=os.getenv("Tavily"))
firecrawl_app = FirecrawlApp(api_key=os.getenv("Firecrawl"))

llm = ChatGoogleGenerativeAI(
    model="gemini-3.1-flash-lite",
    temperature=0,
    api_key=os.getenv("Gemini")
)

structured_llm = llm.with_structured_output(LoyaltyReport)

class GraphState(TypedDict):
    company_name: str
    official_urls: List[str]
    critic_urls: List[str]
    official_raw_text: str
    critic_raw_text: str
  
    final_report: Optional[dict]
    error: Optional[str]

def scout_node(state: GraphState) -> Dict[str, Any]:
    company = state["company_name"]
    print(f"\n🔍 [Scout] Searching web for {company}...")
    
    official_search = tavily_client.search(f"{company} India official loyalty rewards program terms conditions", max_results=1)
    official_urls = [res["url"] for res in official_search.get("results", [])]
    print(f"🔗 [Scout] Found Official URL: {official_urls[0] if official_urls else 'None'}")
    

    encoded_query = urllib.parse.quote(f"{company} India rewards program complaints")
    reddit_rss_url = f"https://www.reddit.com/search.rss?q={encoded_query}&sort=relevance"
    critic_urls = [reddit_rss_url]


   
    print(f"🔗 [Scout] Found Critic URL: {critic_urls[0] if critic_urls else 'None'}")
    
    return {"official_urls": official_urls, "critic_urls": critic_urls}

def scrape_official_node(state: GraphState) -> Dict[str, Any]:
    urls = state.get("official_urls", [])
    if not urls: return {"official_raw_text": "No official data found."}
    
    try:
        print(f"🔥 [Scraper] Scraping Official Doc: {urls[0]}")
        
        # FIX: Use the exact syntax from your Firecrawl documentation
        scrape_result = firecrawl_app.scrape(
            urls[0],
            formats=["markdown"]
        ) 
        
        # Handle both dicts and Document objects
        if isinstance(scrape_result, dict):
            markdown = scrape_result.get('markdown', '')
        else:
            markdown = getattr(scrape_result, 'markdown', str(scrape_result))
            
        print(f"✅ [Scraper] Success! Scraped {len(markdown)} characters of official text.")
        return {"official_raw_text": markdown}
    except Exception as e:
        print(f"❌ [Scraper] Error scraping official url: {str(e)}")
        return {"official_raw_text": f"Scrape failed: {str(e)}"}


def scrape_critics_node(state: GraphState) -> Dict[str, Any]:
    urls = state.get("critic_urls", [])
    if not urls: return {"critic_raw_text": "No critic data found."}
    
    url = urls[0]
    try:
        print(f"🔥 [Scraper] Fetching Critic RSS: {url}")
        
        # Bypass Firecrawl entirely and fetch the XML natively using Python
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 LoyaltyLensBot/1.0'}
        )
        with urllib.request.urlopen(req) as response:
            rss_data = response.read().decode('utf-8')
            
        print(f"✅ [Scraper] Success! Fetched {len(rss_data)} characters of Reddit RSS XML.")
        return {"critic_raw_text": rss_data}
        
    except Exception as e:
        print(f"❌ [Scraper] Error fetching critic RSS: {str(e)}")
        return {"critic_raw_text": f"RSS fetch failed: {str(e)}"}



def synthesis_node(state: GraphState) -> Dict[str, Any]:
    print("✍️ [Synthesizer] Generating final structured report...")
    company = state["company_name"]
    official = state["official_raw_text"]
    critics = state["critic_raw_text"]
   
    
    prompt = f"""
    You are an expert loyalty program analyst. Synthesize a comprehensive JSON report for {company}.
    IMPORTANT: Base your analysis STRICTLY on the provided scraped text below. 
    
    Official Data: {official[:50000]}
    Critic Reviews: {critics[:50000]}
    
    """
    
    final_structured_data = structured_llm.invoke(prompt)
    report_dict = final_structured_data.model_dump()
    
    # 🔥 THE FIX: Inject the ACTUAL URLs back into the response so the UI can display them!
    official_url = state.get("official_urls", ["#"])[0] if state.get("official_urls") else "#"

     # Rebuild the standard HTML Reddit URL for the frontend targeting India
    import urllib.parse
    encoded_query = urllib.parse.quote(f"{company} India rewards program complaints")
    critic_url = f"https://www.reddit.com/search/?q={encoded_query}&sort=relevance"
    
    
    report_dict["actual_sources"] = [
        {"name": "Official Documentation", "url": official_url, "credibility": 95},
        {"name": "Community Forums", "url": critic_url, "credibility": 82}
    ]
    
    print("🎉 [Pipeline] Analysis Complete!")
    return {"final_report": report_dict}

# Build and Compile the Graph
workflow = StateGraph(GraphState)

workflow.add_node("scout", scout_node)
workflow.add_node("scrape_official", scrape_official_node)
workflow.add_node("scrape_critics", scrape_critics_node)

workflow.add_node("synthesize", synthesis_node)

workflow.set_entry_point("scout")
workflow.add_edge("scout", "scrape_official")
workflow.add_edge("scout", "scrape_critics")

workflow.add_edge("scrape_official", "synthesize")
workflow.add_edge("scrape_critics", "synthesize")
workflow.add_edge("synthesize", END)

loyalty_agent_pipeline = workflow.compile()