import os
from dotenv import load_dotenv
from google import genai
from tavily import TavilyClient
from firecrawl import FirecrawlApp

# Load all keys from your verified .env file
load_dotenv(override=True)

def test_entire_free_toolchain():
    print("🚀 Starting Toolchain Verification (Free Tier)...")
    
    # 1. Test Tavily Search Connection
    tavily_key = os.getenv("Tavily")

    print("🔍 Testing Tavily Search API....")
    print(tavily_key)
    try:
        tavily = TavilyClient(api_key=tavily_key)
        # Search for a public loyalty program
        search_result = tavily.search(query="Starbucks Rewards membership tiers official site", max_results=1)
        
        # BULLETPROOF CHECK: Safe extraction using .get()
        if isinstance(search_result, dict) and 'results' in search_result:
            results_list = search_result['results']
            if len(results_list) > 0:
                target_url = results_list[0]['url']
                print(f"✅ Tavily Connected! Found URL: {target_url}")
            else:
                print("❌ Tavily connected but returned an empty results list.")
                return
        else:
            print("❌ Tavily returned data in an unexpected format.")
            return
            
    except Exception as e:
        print(f"❌ Tavily Connection Failed: {e}")
        return

    # 2. Test Firecrawl Scraping Connection
    firecrawl_key = os.getenv("Firecrawl")
    print("🕷️ Testing Firecrawl Scraping API...")
    try:
        app = FirecrawlApp(api_key=firecrawl_key)
        # Scrape the URL we just discovered via Tavily
        result = app.scrape_url(target_url, formats=["markdown", "html"])
        
        # Pull out the clean markdown content text
       
        scrape_id = result.metadata.scrape_id

# 2. Interact — search for a product and get its price
        app.interact(scrape_id, prompt="what is the best offer available")
        response = app.interact(scrape_id, prompt="Click on the first result and tell me the price")
        print(response.output)

        # 3. Stop the session
        app.stop_interaction(scrape_id) # Grabbing just the first 1000 characters to keep it light
        print("✅ Firecrawl Connected! Successfully extracted clean web layout.")
    except Exception as e:
        print(f"❌ Firecrawl Connection Failed: {e}")
        return

    # 3. Test Gemini Integration with Scraped Data
    gemini_key = os.getenv("Gemini")
    print("🤖 Passing scraped text to Gemini...")
    try:
        client = genai.Client(api_key=gemini_key)
        prompt = f"Summarize the following raw web data into a single sentence:\n\n{raw_markdown}"
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        print("\n--- Live Intelligence Summary ---")
        print(response.text.strip())
        print("---------------------------------")
        print("🎉 PHASE 1 OFFICIALLY COMPLETE! All free-tier APIs are synchronized.")
        
    except Exception as e:
        print(f"❌ Gemini failed to process data: {e}")

if __name__ == "__main__":
    test_entire_free_toolchain()