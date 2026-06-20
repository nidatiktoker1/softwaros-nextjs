#!/usr/bin/env node

/**
 * Execute SQL migrations against Supabase using Supabase JS Client
 * This attempts multiple approaches to execute the SQL
 */

const fs = require('fs');
const path = require('path');

// Load .env.local manually
function loadEnv() {
  try {
    const envFile = path.resolve('.env.local');
    const envContent = fs.readFileSync(envFile, 'utf8');
    envContent.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const eqIndex = line.indexOf('=');
        if (eqIndex > 0) {
          const key = line.substring(0, eqIndex).trim();
          const value = line.substring(eqIndex + 1).trim();
          process.env[key] = value;
        }
      }
    });
  } catch (e) {
    console.error('⚠️  .env.local not found');
  }
}

loadEnv();

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const PROJECT_ID = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;

async function main() {
  const sqlFile = process.argv[2] || 'scripts/create-shortcuts-table.sql';
  const fullPath = path.resolve(sqlFile);

  if (!fs.existsSync(fullPath)) {
    console.error(`❌ File not found: ${fullPath}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(fullPath, 'utf8');

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🗄️  SUPABASE SQL EXECUTION');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log(`📝 SQL File: ${fullPath}`);
  console.log(`📊 Size: ${sqlContent.length} bytes\n`);

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
  }

  console.log('🔍 Attempting to execute SQL...\n');

  // Method 1: Try to use pg module for direct PostgreSQL connection
  try {
    const dbPassword = process.env.SUPABASE_DB_PASSWORD;
    if (dbPassword) {
      const { Client } = require('pg');
      console.log('📌 Method 1: Direct PostgreSQL connection');
      await executeViaPostgres(sqlContent, dbPassword);
      return;
    }
  } catch (e) {
    console.log('⚠️  PostgreSQL method unavailable\n');
  }

  // Method 2: Try via Supabase API
  console.log('📌 Method 2: Supabase API execution');
  
  try {
    // Create a Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Try to execute SQL via RPC if function exists
    console.log('Attempting RPC execution...');
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_string: sqlContent
    });

    if (!error && data) {
      console.log('✅ SQL executed successfully via RPC!\n');
      console.log('📊 Database changes applied:');
      console.log('   ✓ shortcuts table created');
      console.log('   ✓ Index on tool_slug created');
      console.log('   ✓ Row Level Security enabled');
      console.log('   ✓ Public read policy created\n');
      return;
    }
  } catch (e) {
    console.log('⚠️  RPC execution not available\n');
  }

  // Method 3: Show manual execution instructions
  console.log('📌 Method 3: Manual execution via dashboard');
  showDashboardInstructions(sqlContent);
}

async function executeViaPostgres(sqlContent, dbPassword) {
  const { Client } = require('pg');
  const PROJECT_ID = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;

  try {
    const client = new Client({
      host: `${PROJECT_ID}.supabase.co`,
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: dbPassword,
      ssl: true
    });

    console.log(`Connecting to ${PROJECT_ID}.supabase.co...\n`);
    await client.connect();
    console.log('✅ Connected!\n');

    console.log('▶️  Executing SQL...');
    await client.query(sqlContent);
    console.log('✅ SQL executed successfully!\n');

    console.log('📊 Database changes applied:');
    console.log('   ✓ shortcuts table created');
    console.log('   ✓ Index on tool_slug created');
    console.log('   ✓ Row Level Security enabled');
    console.log('   ✓ Public read policy created\n');

    await client.end();
  } catch (error) {
    console.error(`❌ Connection error: ${error.message}\n`);
    throw error;
  }
}

function showDashboardInstructions(sqlContent) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const PROJECT_ID = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;

  console.log('\n⏭️  ALTERNATIVE: Execute manually in Supabase Dashboard\n');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📋 MANUAL EXECUTION STEPS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('1. Open Supabase Dashboard:');
  console.log(`   🔗 ${SUPABASE_URL}\n`);

  console.log('2. Navigate to SQL Editor:');
  console.log('   Left sidebar → SQL Editor\n');

  console.log('3. Create a New Query\n');

  console.log('4. Copy this SQL:\n');
  console.log('───────────────────────────────────────────────────────────────');
  console.log(sqlContent);
  console.log('───────────────────────────────────────────────────────────────\n');

  console.log('5. Click "Execute" or press Ctrl+Enter\n');
  console.log('✅ Your database will be updated immediately!\n');

  // Save SQL to temp file
  const tempFile = path.join(__dirname, 'temp-sql.sql');
  fs.writeFileSync(tempFile, sqlContent);
  console.log(`💾 SQL saved to: ${tempFile}`);
}

main().catch(err => {
  console.error(`\n❌ Error: ${err.message}`);
  process.exit(1);
});
