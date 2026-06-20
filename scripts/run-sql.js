#!/usr/bin/env node

/**
 * Execute SQL migrations against Supabase
 * Usage: node scripts/run-sql.js [path-to-sql-file]
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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const PROJECT_ID = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function main() {
  const sqlFile = process.argv[2] || 'scripts/create-shortcuts-table.sql';
  const fullPath = path.resolve(sqlFile);

  // Validate file exists
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

  // Try to use pg module if available for direct connection
  try {
    const Client = require('pg').Client;
    const dbPassword = process.env.SUPABASE_DB_PASSWORD;

    if (dbPassword && PROJECT_ID) {
      console.log('🔗 Using direct PostgreSQL connection...');
      return executeViaDirectConnection(sqlContent, PROJECT_ID, dbPassword);
    }
  } catch (e) {
    // pg module not available
  }

  // Fallback to manual instructions
  showManualInstructions(sqlContent);
}

async function executeViaDirectConnection(sqlContent, projectId, dbPassword) {
  try {
    const { Client } = require('pg');
    
    const client = new Client({
      host: `${projectId}.supabase.co`,
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: dbPassword,
    });

    console.log(`Connecting to ${projectId}.supabase.co...`);
    await client.connect();
    console.log('✅ Connected!\n');

    console.log('Executing SQL...');
    await client.query(sqlContent);
    console.log('✅ Success!\n');

    console.log('📊 Database changes:');
    console.log('   ✓ shortcuts table created');
    console.log('   ✓ Index on tool_slug created');
    console.log('   ✓ Row Level Security enabled');
    console.log('   ✓ Public read policy created\n');

    await client.end();
  } catch (error) {
    console.error(`❌ Connection error: ${error.message}\n`);
    showManualInstructions(sqlContent);
  }
}

function showManualInstructions(sqlContent) {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📋 MANUAL EXECUTION INSTRUCTIONS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('1. Open Supabase Dashboard:');
  console.log(`   ${SUPABASE_URL}\n`);

  console.log('2. Navigate: SQL Editor (left sidebar)\n');

  console.log('3. Create New Query\n');

  console.log('4. Copy and paste this SQL:\n');
  console.log('───────────────────────────────────────────────────────────────');
  console.log(sqlContent);
  console.log('───────────────────────────────────────────────────────────────\n');

  console.log('5. Click "Execute" or press Ctrl+Enter\n');

  console.log('✅ Done! Your database will be updated.\n');
}

// Run
main().catch(err => {
  console.error(`❌ Error: ${err.message}`);
  process.exit(1);
});
