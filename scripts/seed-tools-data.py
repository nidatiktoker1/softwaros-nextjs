#!/usr/bin/env python3
"""
Phase A: Automated seed script to fill missing tool data using Groq API
Loops through all 178 tools in Supabase and enriches them with:
- description, pricing_data, pros, cons, best_for_tags
"""

import os
import json
import time
from typing import Optional
import requests
from supabase import create_client, Client
from dotenv import load_dotenv

# Load .env.local
load_dotenv('.env.local')


def get_supabase_client() -> Client:
    """Initialize Supabase client"""
    supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    
    if not supabase_url or not supabase_key:
        raise ValueError("Missing Supabase credentials in environment variables")
    
    return create_client(supabase_url, supabase_key)


def get_groq_api_key() -> str:
    """Get Groq API key, trying multiple keys if needed"""
    for i in range(1, 4):
        key_name = "GROQ_API_KEY" if i == 1 else f"GROQ_API_KEY_{i}"
        key = os.environ.get(key_name)
        if key:
            return key
    raise ValueError("Missing GROQ_API_KEY in environment variables")


def fetch_tool_data_from_groq(api_key: str, tool_name: str) -> dict:
    """Call Groq API to get structured data for a tool"""
    prompt = f"""You are a software expert. Provide comprehensive information about "{tool_name}" in the following JSON format only (no markdown, no explanation):
{{
  "description": "A 100-150 word description about what this tool is, its main features, and why it's valuable",
  "pricing_data": {{
    "tiers": [
      {{
        "name": "Free",
        "price": "Free",
        "description": "Basic features",
        "features": ["Feature 1", "Feature 2"]
      }},
      {{
        "name": "Pro",
        "price": "$XX/month",
        "description": "Advanced features",
        "features": ["Feature 1", "Feature 2", "Feature 3"]
      }}
    ]
  }},
  "pros": ["Pro 1", "Pro 2", "Pro 3", "Pro 4", "Pro 5"],
  "cons": ["Con 1", "Con 2", "Con 3", "Con 4"],
  "best_for_tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}}

Return ONLY the JSON, no other text."""

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "mixtral-8x7b-32768",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "max_tokens": 1024,
        "temperature": 0.3
    }
    
    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers=headers,
        json=payload
    )
    
    if response.status_code != 200:
        raise ValueError(f"Groq API error: {response.status_code} - {response.text}")
    
    response_data = response.json()
    response_text = response_data["choices"][0]["message"]["content"]
    
    # Extract JSON from response
    import re
    json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
    if not json_match:
        raise ValueError(f"No JSON found in Groq response for {tool_name}")
    
    return json.loads(json_match.group(0))


def get_tools_needing_data(supabase: Client) -> list:
    """Fetch tools from Supabase that are missing data"""
    response = supabase.table("tools").select(
        "id, name, slug, description, pricing_data, pros, cons, best_for_tags"
    ).or_(
        "description.is.null,pricing_data.is.null,pros.is.null,cons.is.null,best_for_tags.is.null"
    ).limit(178).execute()
    
    return response.data or []


def update_tool_in_supabase(supabase: Client, tool_id: str, data: dict) -> None:
    """Update tool in Supabase with new data"""
    update_data = {
        "description": data.get("description"),
        "pricing_data": data.get("pricing_data"),
        "pros": data.get("pros"),
        "cons": data.get("cons"),
        "best_for_tags": data.get("best_for_tags"),
        "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    
    supabase.table("tools").update(update_data).eq("id", tool_id).execute()


def main():
    """Main script execution"""
    print("🚀 Starting Phase A: Seeding tool data from Groq API...\n")
    
    try:
        # Initialize clients
        print("📊 Initializing Supabase and Groq clients...")
        supabase = get_supabase_client()
        groq_api_key = get_groq_api_key()
        print("✅ Clients initialized\n")
        
        # Fetch tools needing data
        print("📊 Fetching tools with missing data from Supabase...")
        tools_needing_data = get_tools_needing_data(supabase)
        print(f"✅ Found {len(tools_needing_data)} tools needing data updates\n")
        
        # Process each tool
        processed = 0
        failed = 0
        
        for idx, tool in enumerate(tools_needing_data, 1):
            try:
                print(f"[{idx}/{len(tools_needing_data)}] Processing: {tool['name']}")
                
                # Call Groq API
                groq_data = fetch_tool_data_from_groq(groq_api_key, tool['name'])
                
                # Update Supabase
                update_tool_in_supabase(supabase, tool['id'], groq_data)
                
                print(f"  ✅ Successfully updated {tool['name']}\n")
                processed += 1
                
                # Rate limiting
                time.sleep(0.5)
                
            except Exception as e:
                print(f"  ❌ Failed to process {tool['name']}: {str(e)}\n")
                failed += 1
        
        # Summary
        print("\n📋 SUMMARY")
        print(f"  ✅ Successfully processed: {processed} tools")
        print(f"  ❌ Failed: {failed} tools")
        print(f"  📈 Total: {processed + failed} tools")
        print("\n✨ Phase A complete!")
        
    except Exception as e:
        print(f"Fatal error: {str(e)}")
        exit(1)


if __name__ == "__main__":
    main()
