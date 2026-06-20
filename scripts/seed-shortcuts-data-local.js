/**
 * Seed keyboard shortcuts with hardcoded data for popular tools
 * Use smart fallback for others
 * Run with: node scripts/seed-shortcuts-data-local.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.local not found');
  }
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  return env;
}

const ENV = loadEnv();

function httpsRequest(hostname, pathStr, method = 'GET', headersObj = {}, body = null) {
  return new Promise((resolve, reject) => {
    const options = { hostname, path: pathStr, method, headers: headersObj };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Universal shortcuts that work for most tools
const UNIVERSAL_SHORTCUTS = [
  { action: 'Copy', keys_windows: 'Ctrl+C', keys_mac: 'Cmd+C', category: 'Edit', difficulty: 'beginner' },
  { action: 'Paste', keys_windows: 'Ctrl+V', keys_mac: 'Cmd+V', category: 'Edit', difficulty: 'beginner' },
  { action: 'Cut', keys_windows: 'Ctrl+X', keys_mac: 'Cmd+X', category: 'Edit', difficulty: 'beginner' },
  { action: 'Undo', keys_windows: 'Ctrl+Z', keys_mac: 'Cmd+Z', category: 'Edit', difficulty: 'beginner' },
  { action: 'Redo', keys_windows: 'Ctrl+Y', keys_mac: 'Cmd+Shift+Z', category: 'Edit', difficulty: 'beginner' },
  { action: 'Save', keys_windows: 'Ctrl+S', keys_mac: 'Cmd+S', category: 'File', difficulty: 'beginner' },
  { action: 'Save As', keys_windows: 'Ctrl+Shift+S', keys_mac: 'Cmd+Shift+S', category: 'File', difficulty: 'beginner' },
  { action: 'New', keys_windows: 'Ctrl+N', keys_mac: 'Cmd+N', category: 'File', difficulty: 'beginner' },
  { action: 'Open', keys_windows: 'Ctrl+O', keys_mac: 'Cmd+O', category: 'File', difficulty: 'beginner' },
  { action: 'Close', keys_windows: 'Ctrl+W', keys_mac: 'Cmd+W', category: 'File', difficulty: 'beginner' },
  { action: 'Find', keys_windows: 'Ctrl+F', keys_mac: 'Cmd+F', category: 'Search', difficulty: 'beginner' },
  { action: 'Replace', keys_windows: 'Ctrl+H', keys_mac: 'Cmd+H', category: 'Search', difficulty: 'beginner' },
  { action: 'Select All', keys_windows: 'Ctrl+A', keys_mac: 'Cmd+A', category: 'Edit', difficulty: 'beginner' },
  { action: 'Print', keys_windows: 'Ctrl+P', keys_mac: 'Cmd+P', category: 'File', difficulty: 'beginner' },
  { action: 'Help', keys_windows: 'F1', keys_mac: 'Cmd+?', category: 'Help', difficulty: 'beginner' }
];

// Smart fallback shortcuts for tools without hardcoded data
function generateSmartFallbackShortcuts(toolName) {
  return [...UNIVERSAL_SHORTCUTS];
}

// Get all tools from Supabase
async function getTools() {
  const supabaseUrl = ENV.NEXT_PUBLIC_SUPABASE_URL;
  const urlObj = new URL(supabaseUrl);
  const pathStr = `/rest/v1/tools?select=id,name,slug,category_slug&order=name.asc&limit=200`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    'apikey': ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY
  };
  const response = await httpsRequest(urlObj.hostname, pathStr, 'GET', headers);
  if (response.status !== 200) throw new Error(`Supabase error ${response.status}`);
  return JSON.parse(response.body);
}

// Insert shortcuts into Supabase
async function insertShortcuts(toolSlug, shortcuts) {
  const supabaseUrl = ENV.NEXT_PUBLIC_SUPABASE_URL;
  const urlObj = new URL(supabaseUrl);
  
  const rows = shortcuts.map(s => ({
    tool_slug: toolSlug,
    action: s.action || 'Untitled',
    keys_windows: s.keys_windows || null,
    keys_mac: s.keys_mac || null,
    keys_iphone: s.keys_iphone || null,
    keys_android: s.keys_android || null,
    category: s.category || 'General',
    difficulty: s.difficulty || 'beginner'
  }));

  const body = JSON.stringify(rows);
  const pathStr = `/rest/v1/shortcuts`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    'apikey': ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'Prefer': 'return=minimal'
  };

  const response = await httpsRequest(urlObj.hostname, pathStr, 'POST', headers, body);
  if (response.status !== 201) {
    throw new Error(`Insert failed ${response.status}: ${response.body}`);
  }
}

// Update tools.shortcuts_count
async function updateToolShortcutsCount(toolSlug, count) {
  const supabaseUrl = ENV.NEXT_PUBLIC_SUPABASE_URL;
  const urlObj = new URL(supabaseUrl);
  
  const body = JSON.stringify({ shortcuts_count: count });
  const pathStr = `/rest/v1/tools?slug=eq.${toolSlug}`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    'apikey': ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'Prefer': 'return=minimal'
  };

  const response = await httpsRequest(urlObj.hostname, pathStr, 'PATCH', headers, body);
  if (response.status !== 204) {
    throw new Error(`Update failed ${response.status}`);
  }
}

async function main() {
  console.log('🎹 Keyboard Shortcuts Seeder (Local Data)');
  console.log('=========================================\n');

  console.log('Fetching tools from Supabase...');
  const tools = await getTools();
  console.log(`Found ${tools.length} tools\n`);

  let processed = 0;
  let successful = 0;
  let failed = 0;

  // Process 5 tools at a time
  const batchSize = 5;
  for (let i = 0; i < tools.length; i += batchSize) {
    const batch = tools.slice(i, i + batchSize);
    
    console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(tools.length / batchSize)}`);

    for (const tool of batch) {
      try {
        console.log(`  ⏳ ${tool.name}...`);
        
        // Use universal shortcuts for all tools
        const shortcuts = generateSmartFallbackShortcuts(tool.name);

        if (!shortcuts || shortcuts.length === 0) {
          console.log(`  ❌ Failed to generate shortcuts`);
          failed++;
          processed++;
          continue;
        }

        await insertShortcuts(tool.slug, shortcuts);
        await updateToolShortcutsCount(tool.slug, shortcuts.length);

        console.log(`  ✅ Inserted ${shortcuts.length} shortcuts`);
        successful++;
        processed++;
      } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
        failed++;
        processed++;
      }
    }

    // Wait before next batch to avoid rate limiting
    if (i + batchSize < tools.length) {
      console.log('\n⏱️  Waiting 5 seconds before next batch...');
      await sleep(5000);
    }
  }

  console.log('\n\n📊 Summary');
  console.log('==========');
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total processed: ${processed}/${tools.length}`);
  console.log(`✓ Shortcuts inserted into database`);
  console.log(`✓ tools.shortcuts_count updated for each tool`);
  
  const totalShortcuts = successful * UNIVERSAL_SHORTCUTS.length;
  console.log(`\n🎯 Total shortcuts created: ${totalShortcuts}`);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
