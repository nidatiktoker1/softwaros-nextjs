#!/usr/bin/env node

/**
 * Execute SQL migrations against Supabase
 * Usage: node execute-sql.js <path-to-sql-file>
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function executeSql(sqlFilePath) {
  const { createClient } = require('@supabase/supabase-js');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials in .env.local');
  }
  
  // Read SQL file
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  
  console.log(`📝 Executing SQL from: ${sqlFilePath}`);
  console.log('🔗 Connecting to Supabase...');
  
  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_string: sqlContent
    }).catch(() => {
      // If exec_sql RPC doesn't exist, we'll try alternative method
      return { error: 'RPC method not available' };
    });
    
    if (error && error !== 'RPC method not available') {
      throw error;
    }
    
    // Alternative: Use raw query via HTTP API
    if (error === 'RPC method not available') {
      console.log('💡 Using direct SQL execution via Supabase API...');
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sqlContent })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
    }
    
    console.log('✅ SQL executed successfully!');
    console.log('📊 Changes applied to Supabase database');
    
  } catch (err) {
    console.error('❌ Error executing SQL:', err.message);
    process.exit(1);
  }
}

// Get SQL file from arguments
const sqlFile = process.argv[2] || 'scripts/create-shortcuts-table.sql';
const fullPath = path.resolve(sqlFile);

if (!fs.existsSync(fullPath)) {
  console.error(`❌ File not found: ${fullPath}`);
  process.exit(1);
}

executeSql(fullPath);
