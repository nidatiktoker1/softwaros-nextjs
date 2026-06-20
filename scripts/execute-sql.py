#!/usr/bin/env python3
"""
Execute SQL migrations against Supabase database
Usage: python scripts/execute-sql.py scripts/create-shortcuts-table.sql
"""

import sys
import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

def execute_sql_file(file_path):
    """Execute SQL file against Supabase database"""
    
    # Get Supabase credentials
    supabase_url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
    project_id = os.environ.get('NEXT_PUBLIC_SUPABASE_PROJECT_ID')
    
    if not supabase_url or not project_id:
        print("❌ Error: Missing Supabase credentials in .env.local")
        sys.exit(1)
    
    # Parse connection string from URL
    # URL format: https://[project_id].supabase.co
    db_host = f"{project_id}.supabase.co"
    db_name = "postgres"
    db_user = "postgres"
    db_password = os.environ.get('SUPABASE_DB_PASSWORD', '')
    
    if not db_password:
        print("⚠️  Warning: SUPABASE_DB_PASSWORD not found in .env.local")
        print("You can get this from Supabase dashboard > Project Settings > Database")
        print("Using alternative method...")
        return execute_sql_via_api(file_path, supabase_url)
    
    # Read SQL file
    if not os.path.exists(file_path):
        print(f"❌ Error: File not found: {file_path}")
        sys.exit(1)
    
    with open(file_path, 'r') as f:
        sql_content = f.read()
    
    print(f"📝 Executing SQL from: {file_path}")
    print(f"🔗 Connecting to Supabase ({db_host})...")
    
    try:
        # Connect to Supabase PostgreSQL
        conn = psycopg2.connect(
            host=db_host,
            database=db_name,
            user=db_user,
            password=db_password,
            port=5432
        )
        
        cur = conn.cursor()
        
        # Execute the SQL
        cur.execute(sql_content)
        conn.commit()
        
        print("✅ SQL executed successfully!")
        print("📊 Changes applied to Supabase database")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)


def execute_sql_via_api(file_path, supabase_url):
    """Execute SQL via Supabase API as fallback"""
    import requests
    
    # Read SQL file
    with open(file_path, 'r') as f:
        sql_content = f.read()
    
    print("💡 Using Supabase SQL Editor API...")
    
    # Get API token - you would need to manually provide this
    # For now, we'll provide instructions
    print("⚠️  To execute SQL via API, you need the service_role key")
    print("Please add SUPABASE_SERVICE_ROLE_KEY to .env.local")
    print("\nAlternatively, run the SQL manually in Supabase dashboard:")
    print(f"1. Go to: {supabase_url}/projects/*/sql")
    print("2. Copy and paste the SQL from:", file_path)
    print("3. Click 'Execute'")


if __name__ == '__main__':
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = 'scripts/create-shortcuts-table.sql'
    
    execute_sql_file(file_path)
