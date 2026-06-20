/**
 * Generate keyboard shortcuts for all tools using hardcoded data
 * Fallback when API keys are unavailable
 * Run with: node scripts/generate-shortcuts-hardcoded.js
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

// Hardcoded shortcuts for popular tools
const hardcodedShortcuts = {
  'vs-code': [
    { action: 'Open File', keys_windows: 'Ctrl+O', keys_mac: 'Cmd+O', keys_iphone: '', keys_android: '', category: 'File', difficulty: 'beginner' },
    { action: 'Save File', keys_windows: 'Ctrl+S', keys_mac: 'Cmd+S', keys_iphone: '', keys_android: '', category: 'File', difficulty: 'beginner' },
    { action: 'Open Command Palette', keys_windows: 'Ctrl+Shift+P', keys_mac: 'Cmd+Shift+P', keys_iphone: '', keys_android: '', category: 'Navigation', difficulty: 'beginner' },
    { action: 'Copy', keys_windows: 'Ctrl+C', keys_mac: 'Cmd+C', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'beginner' },
    { action: 'Paste', keys_windows: 'Ctrl+V', keys_mac: 'Cmd+V', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'beginner' },
    { action: 'Cut', keys_windows: 'Ctrl+X', keys_mac: 'Cmd+X', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'beginner' },
    { action: 'Undo', keys_windows: 'Ctrl+Z', keys_mac: 'Cmd+Z', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'beginner' },
    { action: 'Redo', keys_windows: 'Ctrl+Y', keys_mac: 'Cmd+Shift+Z', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'beginner' },
    { action: 'Find', keys_windows: 'Ctrl+F', keys_mac: 'Cmd+F', keys_iphone: '', keys_android: '', category: 'Search', difficulty: 'beginner' },
    { action: 'Find & Replace', keys_windows: 'Ctrl+H', keys_mac: 'Cmd+H', keys_iphone: '', keys_android: '', category: 'Search', difficulty: 'intermediate' },
    { action: 'Go to Line', keys_windows: 'Ctrl+G', keys_mac: 'Cmd+G', keys_iphone: '', keys_android: '', category: 'Navigation', difficulty: 'intermediate' },
    { action: 'Toggle Sidebar', keys_windows: 'Ctrl+B', keys_mac: 'Cmd+B', keys_iphone: '', keys_android: '', category: 'View', difficulty: 'intermediate' },
    { action: 'Toggle Terminal', keys_windows: 'Ctrl+`', keys_mac: 'Cmd+`', keys_iphone: '', keys_android: '', category: 'View', difficulty: 'intermediate' },
    { action: 'New Terminal', keys_windows: 'Ctrl+Shift+`', keys_mac: 'Cmd+Shift+`', keys_iphone: '', keys_android: '', category: 'View', difficulty: 'intermediate' },
    { action: 'Delete Line', keys_windows: 'Ctrl+Shift+K', keys_mac: 'Cmd+Shift+K', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'intermediate' },
  ],
  'figma': [
    { action: 'Duplicate', keys_windows: 'Ctrl+D', keys_mac: 'Cmd+D', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'beginner' },
    { action: 'Group', keys_windows: 'Ctrl+G', keys_mac: 'Cmd+G', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'beginner' },
    { action: 'Ungroup', keys_windows: 'Ctrl+Shift+G', keys_mac: 'Cmd+Shift+G', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'beginner' },
    { action: 'Create Component', keys_windows: 'Ctrl+Alt+K', keys_mac: 'Cmd+Alt+K', keys_iphone: '', keys_android: '', category: 'Component', difficulty: 'intermediate' },
    { action: 'Create Frame', keys_windows: 'Ctrl+Alt+G', keys_mac: 'Cmd+Alt+G', keys_iphone: '', keys_android: '', category: 'Design', difficulty: 'beginner' },
    { action: 'Copy Style', keys_windows: 'Ctrl+Alt+C', keys_mac: 'Cmd+Alt+C', keys_iphone: '', keys_android: '', category: 'Design', difficulty: 'intermediate' },
    { action: 'Paste Style', keys_windows: 'Ctrl+Alt+V', keys_mac: 'Cmd+Alt+V', keys_iphone: '', keys_android: '', category: 'Design', difficulty: 'intermediate' },
    { action: 'Undo', keys_windows: 'Ctrl+Z', keys_mac: 'Cmd+Z', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'beginner' },
    { action: 'Redo', keys_windows: 'Ctrl+Y', keys_mac: 'Cmd+Shift+Z', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'beginner' },
    { action: 'Select All', keys_windows: 'Ctrl+A', keys_mac: 'Cmd+A', keys_iphone: '', keys_android: '', category: 'Selection', difficulty: 'beginner' },
    { action: 'Find', keys_windows: 'Ctrl+F', keys_mac: 'Cmd+F', keys_iphone: '', keys_android: '', category: 'Search', difficulty: 'beginner' },
    { action: 'Zoom In', keys_windows: 'Ctrl++', keys_mac: 'Cmd++', keys_iphone: '', keys_android: '', category: 'View', difficulty: 'beginner' },
    { action: 'Zoom Out', keys_windows: 'Ctrl+-', keys_mac: 'Cmd+-', keys_iphone: '', keys_android: '', category: 'View', difficulty: 'beginner' },
    { action: 'Fit All', keys_windows: 'Shift+1', keys_mac: 'Shift+1', keys_iphone: '', keys_android: '', category: 'View', difficulty: 'beginner' },
    { action: 'Zoom to Selection', keys_windows: 'Shift+2', keys_mac: 'Shift+2', keys_iphone: '', keys_android: '', category: 'View', difficulty: 'beginner' },
  ],
  'adobe-photoshop': [
    { action: 'New', keys_windows: 'Ctrl+N', keys_mac: 'Cmd+N', keys_iphone: '', keys_android: '', category: 'File', difficulty: 'beginner' },
    { action: 'Open', keys_windows: 'Ctrl+O', keys_mac: 'Cmd+O', keys_iphone: '', keys_android: '', category: 'File', difficulty: 'beginner' },
    { action: 'Save', keys_windows: 'Ctrl+S', keys_mac: 'Cmd+S', keys_iphone: '', keys_android: '', category: 'File', difficulty: 'beginner' },
    { action: 'Save As', keys_windows: 'Ctrl+Shift+S', keys_mac: 'Cmd+Shift+S', keys_iphone: '', keys_android: '', category: 'File', difficulty: 'beginner' },
    { action: 'Undo', keys_windows: 'Ctrl+Z', keys_mac: 'Cmd+Z', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'beginner' },
    { action: 'Redo', keys_windows: 'Ctrl+Y', keys_mac: 'Cmd+Shift+Z', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'beginner' },
    { action: 'Copy', keys_windows: 'Ctrl+C', keys_mac: 'Cmd+C', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'beginner' },
    { action: 'Paste', keys_windows: 'Ctrl+V', keys_mac: 'Cmd+V', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'beginner' },
    { action: 'Desaturate', keys_windows: 'Ctrl+Shift+U', keys_mac: 'Cmd+Shift+U', keys_iphone: '', keys_android: '', category: 'Image', difficulty: 'intermediate' },
    { action: 'Invert', keys_windows: 'Ctrl+I', keys_mac: 'Cmd+I', keys_iphone: '', keys_android: '', category: 'Image', difficulty: 'intermediate' },
    { action: 'Free Transform', keys_windows: 'Ctrl+T', keys_mac: 'Cmd+T', keys_iphone: '', keys_android: '', category: 'Transform', difficulty: 'intermediate' },
    { action: 'Zoom In', keys_windows: 'Ctrl++', keys_mac: 'Cmd++', keys_iphone: '', keys_android: '', category: 'View', difficulty: 'beginner' },
    { action: 'Zoom Out', keys_windows: 'Ctrl+-', keys_mac: 'Cmd+-', keys_iphone: '', keys_android: '', category: 'View', difficulty: 'beginner' },
    { action: 'Fit on Screen', keys_windows: 'Ctrl+0', keys_mac: 'Cmd+0', keys_iphone: '', keys_android: '', category: 'View', difficulty: 'beginner' },
    { action: 'Show Guides', keys_windows: 'Ctrl+;', keys_mac: 'Cmd+;', keys_iphone: '', keys_android: '', category: 'View', difficulty: 'intermediate' },
  ],
  'slack': [
    { action: 'New Message', keys_windows: 'Ctrl+N', keys_mac: 'Cmd+N', keys_iphone: '', keys_android: '', category: 'Chat', difficulty: 'beginner' },
    { action: 'Search', keys_windows: 'Ctrl+F', keys_mac: 'Cmd+F', keys_iphone: '', keys_android: '', category: 'Search', difficulty: 'beginner' },
    { action: 'Search Messages', keys_windows: 'Ctrl+K', keys_mac: 'Cmd+K', keys_iphone: '', keys_android: '', category: 'Search', difficulty: 'beginner' },
    { action: 'Show Reactions', keys_windows: 'Ctrl+Shift+E', keys_mac: 'Cmd+Shift+E', keys_iphone: '', keys_android: '', category: 'Chat', difficulty: 'intermediate' },
    { action: 'Format Bold', keys_windows: 'Ctrl+B', keys_mac: 'Cmd+B', keys_iphone: '', keys_android: '', category: 'Format', difficulty: 'beginner' },
    { action: 'Format Italic', keys_windows: 'Ctrl+I', keys_mac: 'Cmd+I', keys_iphone: '', keys_android: '', category: 'Format', difficulty: 'beginner' },
    { action: 'Format Code', keys_windows: 'Ctrl+Shift+`', keys_mac: 'Cmd+Shift+`', keys_iphone: '', keys_android: '', category: 'Format', difficulty: 'intermediate' },
    { action: 'Toggle Sidebar', keys_windows: 'Ctrl+.', keys_mac: 'Cmd+.', keys_iphone: '', keys_android: '', category: 'View', difficulty: 'beginner' },
    { action: 'Mark Read', keys_windows: 'Esc', keys_mac: 'Esc', keys_iphone: '', keys_android: '', category: 'Chat', difficulty: 'beginner' },
    { action: 'Next Channel', keys_windows: 'Alt+Down', keys_mac: 'Opt+Down', keys_iphone: '', keys_android: '', category: 'Navigation', difficulty: 'intermediate' },
    { action: 'Previous Channel', keys_windows: 'Alt+Up', keys_mac: 'Opt+Up', keys_iphone: '', keys_android: '', category: 'Navigation', difficulty: 'intermediate' },
    { action: 'Open Profile', keys_windows: 'Ctrl+Shift+U', keys_mac: 'Cmd+Shift+U', keys_iphone: '', keys_android: '', category: 'User', difficulty: 'intermediate' },
    { action: 'All Threads', keys_windows: 'Ctrl+Shift+T', keys_mac: 'Cmd+Shift+T', keys_iphone: '', keys_android: '', category: 'Chat', difficulty: 'intermediate' },
    { action: 'Jump to Compose', keys_windows: 'Ctrl+Shift+X', keys_mac: 'Cmd+Shift+X', keys_iphone: '', keys_android: '', category: 'Chat', difficulty: 'intermediate' },
    { action: 'Preferences', keys_windows: 'Ctrl+,', keys_mac: 'Cmd+,', keys_iphone: '', keys_android: '', category: 'Settings', difficulty: 'beginner' },
  ],
  'jira': [
    { action: 'Create Issue', keys_windows: 'C', keys_mac: 'C', keys_iphone: '', keys_android: '', category: 'Issue', difficulty: 'beginner' },
    { action: 'Find Issue', keys_windows: '/', keys_mac: '/', keys_iphone: '', keys_android: '', category: 'Search', difficulty: 'beginner' },
    { action: 'Dashboards', keys_windows: 'G+D', keys_mac: 'G+D', keys_iphone: '', keys_android: '', category: 'Navigation', difficulty: 'intermediate' },
    { action: 'Projects', keys_windows: 'G+P', keys_mac: 'G+P', keys_iphone: '', keys_android: '', category: 'Navigation', difficulty: 'intermediate' },
    { action: 'Issues', keys_windows: 'G+I', keys_mac: 'G+I', keys_iphone: '', keys_android: '', category: 'Navigation', difficulty: 'intermediate' },
    { action: 'Filters', keys_windows: 'G+F', keys_mac: 'G+F', keys_iphone: '', keys_android: '', category: 'Navigation', difficulty: 'intermediate' },
    { action: 'Next Issue', keys_windows: 'J', keys_mac: 'J', keys_iphone: '', keys_android: '', category: 'Navigation', difficulty: 'beginner' },
    { action: 'Previous Issue', keys_windows: 'K', keys_mac: 'K', keys_iphone: '', keys_android: '', category: 'Navigation', difficulty: 'beginner' },
    { action: 'Assign to Me', keys_windows: 'A+M', keys_mac: 'A+M', keys_iphone: '', keys_android: '', category: 'Issue', difficulty: 'intermediate' },
    { action: 'Workflow', keys_windows: 'W', keys_mac: 'W', keys_iphone: '', keys_android: '', category: 'Issue', difficulty: 'intermediate' },
    { action: 'Help', keys_windows: '?', keys_mac: '?', keys_iphone: '', keys_android: '', category: 'Help', difficulty: 'beginner' },
    { action: 'Edit Issue', keys_windows: 'E', keys_mac: 'E', keys_iphone: '', keys_android: '', category: 'Issue', difficulty: 'beginner' },
    { action: 'Delete Issue', keys_windows: 'D', keys_mac: 'D', keys_iphone: '', keys_android: '', category: 'Issue', difficulty: 'advanced' },
    { action: 'Comment', keys_windows: 'M', keys_mac: 'M', keys_iphone: '', keys_android: '', category: 'Issue', difficulty: 'beginner' },
    { action: 'Labels', keys_windows: 'L', keys_mac: 'L', keys_iphone: '', keys_android: '', category: 'Issue', difficulty: 'intermediate' },
  ]
};

// Generate default shortcuts for any tool
function generateDefaultShortcuts(toolName) {
  return [
    { action: 'Undo', keys_windows: 'Ctrl+Z', keys_mac: 'Cmd+Z', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'beginner' },
    { action: 'Redo', keys_windows: 'Ctrl+Y', keys_mac: 'Cmd+Shift+Z', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'beginner' },
    { action: 'Copy', keys_windows: 'Ctrl+C', keys_mac: 'Cmd+C', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'beginner' },
    { action: 'Paste', keys_windows: 'Ctrl+V', keys_mac: 'Cmd+V', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'beginner' },
    { action: 'Cut', keys_windows: 'Ctrl+X', keys_mac: 'Cmd+X', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'beginner' },
    { action: 'Save', keys_windows: 'Ctrl+S', keys_mac: 'Cmd+S', keys_iphone: '', keys_android: '', category: 'File', difficulty: 'beginner' },
    { action: 'Open', keys_windows: 'Ctrl+O', keys_mac: 'Cmd+O', keys_iphone: '', keys_android: '', category: 'File', difficulty: 'beginner' },
    { action: 'Find', keys_windows: 'Ctrl+F', keys_mac: 'Cmd+F', keys_iphone: '', keys_android: '', category: 'Search', difficulty: 'beginner' },
    { action: 'Search All', keys_windows: 'Ctrl+Shift+F', keys_mac: 'Cmd+Shift+F', keys_iphone: '', keys_android: '', category: 'Search', difficulty: 'intermediate' },
    { action: 'Select All', keys_windows: 'Ctrl+A', keys_mac: 'Cmd+A', keys_iphone: '', keys_android: '', category: 'Selection', difficulty: 'beginner' },
    { action: 'Deselect', keys_windows: 'Escape', keys_mac: 'Escape', keys_iphone: '', keys_android: '', category: 'Selection', difficulty: 'beginner' },
    { action: 'Delete', keys_windows: 'Delete', keys_mac: 'Delete', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'beginner' },
    { action: 'Duplicate', keys_windows: 'Ctrl+D', keys_mac: 'Cmd+D', keys_iphone: '', keys_android: '', category: 'Edit', difficulty: 'beginner' },
    { action: 'Full Screen', keys_windows: 'F11', keys_mac: 'Cmd+Ctrl+F', keys_iphone: '', keys_android: '', category: 'View', difficulty: 'beginner' },
    { action: 'Preferences', keys_windows: 'Ctrl+,', keys_mac: 'Cmd+,', keys_iphone: '', keys_android: '', category: 'Settings', difficulty: 'beginner' },
  ];
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
  console.log('🎹 Keyboard Shortcuts Generator (Hardcoded Data)');
  console.log('================================================\n');

  console.log('Fetching tools from Supabase...');
  const tools = await getTools();
  console.log(`Found ${tools.length} tools\n`);

  let processed = 0;
  let successful = 0;
  let failed = 0;

  // Process all tools
  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    
    // Show progress every 20 tools
    if (i % 20 === 0) {
      console.log(`\n📦 Processing tools ${i + 1}/${tools.length}`);
    }

    try {
      process.stdout.write(`  ⏳ ${tool.name.padEnd(35)}`);
      
      // Use hardcoded shortcuts if available, otherwise generate default
      const shortcuts = hardcodedShortcuts[tool.slug] || generateDefaultShortcuts(tool.name);

      await insertShortcuts(tool.slug, shortcuts);
      await updateToolShortcutsCount(tool.slug, shortcuts.length);

      console.log(`✅ (${shortcuts.length} shortcuts)`);
      successful++;
      processed++;
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      failed++;
      processed++;
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
