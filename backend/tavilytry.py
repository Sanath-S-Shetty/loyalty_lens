import os
from dotenv import load_dotenv
from tavily import TavilyClient

# Load the API keys from your .env file
load_dotenv(override=True)

# Instantiate the client
tavily_key = os.getenv("Tavily")
tavily = TavilyClient(api_key=tavily_key)

print("🔍 Sending query to Tavily...")
# Execute the search
result = tavily.search(query="Starbucks rewards membership tiers official site", max_results=1)

print("\n--- RAW TAVILY RESPONSE TYPE ---")
print(type(result))

print("\n--- RAW TAVILY RESPONSE CONTENT ---")
# If it's a dict, we can pretty-print it
if isinstance(result, dict):
    import json
    print(json.dumps(result, indent=2))
else:
    print(result)