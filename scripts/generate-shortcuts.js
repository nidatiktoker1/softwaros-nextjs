/**
 * Generate keyboard shortcuts for all tools using DeepSeek API
 * Run with: node scripts/generate-shortcuts.js
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
const DEEPSEEK_API_KEY = ENV.DEEPSEEK_API_KEY;

if (!DEEPSEEK_API_KEY) {
  throw new Error('DEEPSEEK_API_KEY not found in .env.local');
}

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

// Call DeepSeek API to generate shortcuts
async function generateShortcutsWithDeepSeek(toolName) {
  const prompt = `Generate 15 keyboard shortcuts for ${toolName} software. Return ONLY a JSON array like: [{"action":"Copy","keys_windows":"Ctrl+C","keys_mac":"Cmd+C","keys_iphone":"","keys_android":"","category":"Edit"}]. No explanation, only JSON array.`;

  const body = JSON.stringify({
    model: 'deepseek-chat',
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 2000
  });

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
  };

  try {
    const response = await httpsRequest('api.deepseek.com', '/v1/chat/completions', 'POST', headers, body);
    
    if (response.status !== 200) {
      console.error(`DeepSeek API error ${response.status}: ${response.body}`);
      return null;
    }

    const data = JSON.parse(response.body);
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in DeepSeek response');
      return null;
    }

    // Extract JSON from response (may have extra text)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('No JSON array found in response:', content);
      return null;
    }

    const shortcuts = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(shortcuts)) {
      console.error('Response is not an array');
      return null;
    }

    return shortcuts;
  } catch (error) {
    console.error(`DeepSeek API error for ${toolName}:`, error.message);
    return null;
  }
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
  console.log('🎹 Keyboard Shortcuts Generator');
  console.log('================================\n');

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
        const shortcuts = await generateShortcutsWithDeepSeek(tool.name);

        if (!shortcuts || shortcuts.length === 0) {
          console.log(`  ❌ Failed to generate shortcuts`);
          failed++;
          processed++;
          continue;
        }

        await insertShortcuts(tool.slug, shortcuts);
        await updateToolShortcutsCount(tool.slug, shortcuts.length);

        console.log(`  ✅ Generated ${shortcuts.length} shortcuts`);
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
      console.log('\n⏱️  Waiting 10 seconds before next batch...');
      await sleep(10000);
    }
  }

  console.log('\n\n📊 Summary');
  console.log('==========');
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total processed: ${processed}/${tools.length}`);
  console.log(`✓ Shortcuts inserted into database`);
  console.log(`✓ tools.shortcuts_count updated for each tool`);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
