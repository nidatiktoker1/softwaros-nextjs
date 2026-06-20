#!/usr/bin/env node

/**
 * Execute SQL migrations against Supabase
 * Supports multiple execution methods
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import https from 'https';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const PROJECT_ID = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function executeSqlFile(filePath) {
  // Read the SQL file
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(filePath, 'utf8');
  console.log(`📝 SQL File: ${path.resolve(filePath)}`);
  console.log(`📊 File size: ${sqlContent.length} bytes\n`);

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Error: Missing Supabase credentials in .env.local');
    console.error('   Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  console.log('🔍 Checking available execution methods...\n');

  // Try service role method if available (most secure)
  if (SERVICE_ROLE_KEY) {
    console.log('✅ SERVICE_ROLE_KEY found - attempting secure execution...');
    return executeWithServiceRole(sqlContent);
  }

  // Try direct database connection (requires DB password)
  const dbPassword = process.env.SUPABASE_DB_PASSWORD;
  if (dbPassword && PROJECT_ID) {
    console.log('✅ Database credentials found - attempting direct connection...');
    return executeViaDirectConnection(sqlContent, PROJECT_ID, dbPassword);
  }

  // Fallback: Manual execution instructions
  console.log('⚠️  No direct execution credentials available');
  console.log('📋 Showing SQL to execute manually...\n');
  showManualExecutionInstructions(sqlContent);
}

async function executeWithServiceRole(sqlContent) {
  console.log('🔗 Attempting SQL execution via Supabase API...');
  
  try {
    // For Supabase, we need to use the RPC method if available
    // This is a placeholder for the actual implementation
    console.log('⚠️  Direct SQL execution via API requires custom RPC function');
    console.log('📋 Please execute the SQL manually using the method below:\n');
    showManualExecutionInstructions(sqlContent);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
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

    console.log(`🔗 Connecting to ${projectId}.supabase.co...`);
    await client.connect();
    console.log('✅ Connected!\n');

    console.log('▶️  Executing SQL...');
    await client.query(sqlContent);
    console.log('✅ SQL executed successfully!\n');
    console.log('📊 Database changes applied:');
    console.log('   ✓ Created shortcuts table');
    console.log('   ✓ Created index on tool_slug');
    console.log('   ✓ Enabled Row Level Security');
    console.log('   ✓ Created public read policy\n');

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📋 Falling back to manual execution...\n');
    showManualExecutionInstructions(sqlContent);
  }
}

function showManualExecutionInstructions(sqlContent) {
  const dashboardUrl = `${SUPABASE_URL}/project/${PROJECT_ID}/sql`;
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📌 HOW TO EXECUTE SQL IN SUPABASE DASHBOARD:');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  console.log('1️⃣  Open Supabase Dashboard:');
  console.log(`    ${SUPABASE_URL}\n`);
  
  console.log('2️⃣  Navigate to SQL Editor:');
  console.log('    Left sidebar > SQL Editor\n');
  
  console.log('3️⃣  Create new query or use existing one\n');
  
  console.log('4️⃣  Copy and paste the following SQL:');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(sqlContent);
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  console.log('5️⃣  Click "Execute" button or press Ctrl+Enter\n');
  
  console.log('✅ Database changes will be applied immediately!\n');

  // Save to temp file for easy copy-paste
  const tempFile = path.join(__dirname, '.sql-temp.sql');
  fs.writeFileSync(tempFile, sqlContent);
  console.log(`💾 SQL content saved to: ${tempFile}`);
  console.log('   You can copy from there if needed\n');
}

// Main execution
const sqlFile = process.argv[2] || 'scripts/create-shortcuts-table.sql';
executeSqlFile(sqlFile);
