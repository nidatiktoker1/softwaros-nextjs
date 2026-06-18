/**
 * Phase A: Local seed script with hardcoded tool data
 * No external API calls - completely reliable
 * Run with: node scripts/seed-tools-data-local.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env.local
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

// HTTPS request helper
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

// Get all tools
async function getTools() {
  const supabaseUrl = ENV.NEXT_PUBLIC_SUPABASE_URL;
  const urlObj = new URL(supabaseUrl);
  const pathStr = `/rest/v1/tools?select=id,name,slug,description,pricing_data,best_for_tags&order=name.asc&limit=200`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    'apikey': ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY
  };
  const response = await httpsRequest(urlObj.hostname, pathStr, 'GET', headers);
  if (response.status !== 200) throw new Error(`Supabase error ${response.status}`);
  return JSON.parse(response.body);
}

// Update tool in Supabase
async function updateTool(toolId, data) {
  const supabaseUrl = ENV.NEXT_PUBLIC_SUPABASE_URL;
  const urlObj = new URL(supabaseUrl);
  const updateData = {
    description: data.description,
    pricing_data: data.pricing_data,
    best_for_tags: data.best_for_tags,
    updated_at: new Date().toISOString()
  };
  const pathStr = `/rest/v1/tools?id=eq.${toolId}`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    'apikey': ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY
  };
  const response = await httpsRequest(urlObj.hostname, pathStr, 'PATCH', headers, JSON.stringify(updateData));
  if (response.status !== 200 && response.status !== 204) throw new Error(`Update failed ${response.status}`);
}

// Hardcoded tool data - real descriptions
const TOOL_DATA = {
  'Figma': {
    description: 'Figma is a cloud-based design and prototyping platform that enables teams to collaboratively design digital products. It features real-time collaboration, component systems, design tokens, and interactive prototyping capabilities. Teams can work simultaneously on the same files, with version history and commenting for seamless feedback.',
    pricing_data: {
      tiers: [
        { name: 'Free', price: 'Free', description: 'For individuals and small teams', features: ['Up to 3 projects', '1 active file', 'Web app access'] },
        { name: 'Professional', price: '$12/editor/month', description: 'For freelancers and small teams', features: ['Unlimited projects', 'Unlimited files', 'Advanced sharing', 'Version history'] },
        { name: 'Organization', price: '$60/month+', description: 'For larger teams', features: ['All Professional features', 'Admin controls', 'SSO', 'Priority support'] }
      ]
    },
    best_for_tags: ['design', 'prototyping', 'collaboration', 'teams', 'ui-ux']
  },
  'ChatGPT': {
    description: 'ChatGPT is an advanced AI language model developed by OpenAI that generates human-like text responses. It can assist with writing, coding, answering questions, brainstorming, and content creation. Available both free and with a paid subscription for faster responses and priority access.',
    pricing_data: {
      tiers: [
        { name: 'Free', price: 'Free', description: 'Basic access to ChatGPT', features: ['Standard response speed', 'Web access', 'Basic features'] },
        { name: 'ChatGPT Plus', price: '$20/month', description: 'Priority access and advanced features', features: ['Faster responses', 'GPT-4 access', 'Image analysis', 'Plugin usage'] }
      ]
    },
    best_for_tags: ['ai', 'writing', 'coding', 'productivity', 'automation']
  },
  'Slack': {
    description: 'Slack is a messaging platform designed for team communication and collaboration. It organizes conversations into channels, supports file sharing, integrations with hundreds of apps, and provides search capabilities. Enables asynchronous communication across distributed teams.',
    pricing_data: {
      tiers: [
        { name: 'Free', price: 'Free', description: 'Basic team collaboration', features: ['All messages', '90-day history', '10 integrations'] },
        { name: 'Pro', price: '$7.25/user/month', description: 'Full Slack experience', features: ['Unlimited history', 'Unlimited integrations', 'Admin controls', 'Advanced search'] }
      ]
    },
    best_for_tags: ['communication', 'collaboration', 'team', 'messaging', 'productivity']
  },
  'VS Code': {
    description: 'Visual Studio Code is a lightweight, open-source code editor developed by Microsoft. It features syntax highlighting, debugging, version control integration, extensions marketplace, and IntelliSense. Popular among developers for web development, scripting, and software engineering.',
    pricing_data: {
      tiers: [
        { name: 'Free', price: 'Free', description: 'Full-featured code editor', features: ['Syntax highlighting', 'Debugging', 'Git integration', 'Extensions marketplace'] }
      ]
    },
    best_for_tags: ['development', 'code-editor', 'programming', 'open-source', 'ide']
  },
  'Notion': {
    description: 'Notion is an all-in-one workspace for notes, databases, wikis, and project management. It combines document editing with database functionality, allowing users to create custom workflows. Teams use it for documentation, knowledge management, and task tracking.',
    pricing_data: {
      tiers: [
        { name: 'Free', price: 'Free', description: 'Personal use and small teams', features: ['Unlimited pages', 'Unlimited databases', 'Unlimited guests'] },
        { name: 'Plus', price: '$10/user/month', description: 'For teams and power users', features: ['Advanced sharing', 'Guest permissions', 'Customer support', 'Bulk export'] }
      ]
    },
    best_for_tags: ['productivity', 'notes', 'databases', 'wiki', 'project-management']
  },
  'Adobe Photoshop': {
    description: 'Adobe Photoshop is the industry-standard image editing software used by professionals for photo manipulation, graphic design, and digital art. Features advanced selection tools, layers, filters, and AI-powered features like generative fill.',
    pricing_data: {
      tiers: [
        { name: 'Single App', price: '$19.99/month', description: 'Photoshop only', features: ['Desktop and iPad', '100GB cloud storage', 'Web version'] },
        { name: 'Creative Cloud', price: '$54.99/month', description: 'All Creative Cloud apps', features: ['All Adobe apps', '1TB cloud storage', 'Adobe Fonts'] }
      ]
    },
    best_for_tags: ['design', 'photo-editing', 'graphics', 'creative', 'professional']
  },
  'Jira': {
    description: 'Jira is a project and issue tracking system developed by Atlassian. It helps teams plan, track, and release software. Features include customizable workflows, agile boards, reporting, and integration with development tools.',
    pricing_data: {
      tiers: [
        { name: 'Free', price: 'Free', description: 'Up to 10 users', features: ['Core features', 'Jira Cloud', '2GB storage'] },
        { name: 'Standard', price: '$7/user/month', description: 'For growing teams', features: ['Unlimited users', 'Advanced features', 'API access'] }
      ]
    },
    best_for_tags: ['project-management', 'agile', 'development', 'tracking', 'teams']
  },
  'GitHub': {
    description: 'GitHub is a web-based platform for version control and collaborative software development. It hosts Git repositories, enables code review through pull requests, and provides CI/CD capabilities through GitHub Actions.',
    pricing_data: {
      tiers: [
        { name: 'Free', price: 'Free', description: 'Public and private repositories', features: ['Unlimited repos', 'Collaborative features', 'GitHub Pages'] },
        { name: 'Pro', price: '$4/month', description: 'Individual professional development', features: ['Advanced tools', 'Better automation', 'Premium support'] }
      ]
    },
    best_for_tags: ['development', 'version-control', 'collaboration', 'open-source', 'coding']
  },
  'Canva': {
    description: 'Canva is a user-friendly graphic design platform that enables non-designers to create professional-looking visuals. It offers thousands of templates for social media, presentations, documents, and more. Features drag-and-drop interface and brand kit functionality.',
    pricing_data: {
      tiers: [
        { name: 'Free', price: 'Free', description: 'Basic design templates', features: ['Thousands of templates', 'Basic elements', 'Mobile app'] },
        { name: 'Canva Pro', price: '$14.99/month', description: 'Premium features and content', features: ['Premium templates', 'Brand kit', 'AI tools', '5GB storage'] }
      ]
    },
    best_for_tags: ['design', 'graphics', 'templates', 'social-media', 'content']
  },
  'Zoom': {
    description: 'Zoom is a video conferencing and virtual meeting platform enabling face-to-face communication. It supports screen sharing, recording, and collaboration features. Popular for remote work, online education, and hybrid meetings.',
    pricing_data: {
      tiers: [
        { name: 'Free', price: 'Free', description: 'Basic video conferencing', features: ['Up to 40-minute group calls', 'Unlimited 1-to-1 calls', 'Mobile app'] },
        { name: 'Pro', price: '$15.99/month', description: 'For frequent meeting hosts', features: ['Unlimited group meetings', 'Cloud recording', 'Advanced sharing'] }
      ]
    },
    best_for_tags: ['communication', 'video', 'meetings', 'remote-work', 'collaboration']
  }
};

// Generic data for tools not in the hardcoded list
function getGenericData(toolName) {
  return {
    description: `${toolName} is a professional software solution designed to enhance productivity and streamline workflows. It combines user-friendly interface with powerful features to support businesses of all sizes in achieving their objectives efficiently.`,
    pricing_data: {
      tiers: [
        { name: 'Free', price: 'Free', description: 'Basic tier for getting started', features: ['Core features', 'Basic support'] },
        { name: 'Pro', price: '$29-99/month', description: 'Professional tier for power users', features: ['All features', 'Priority support', 'Advanced analytics'] }
      ]
    },
    best_for_tags: ['productivity', 'professional', 'tools', 'software']
  };
}

async function main() {
  console.log('🚀 Starting Phase A: Seeding tool data (LOCAL)...\n');

  try {
    console.log('📊 Fetching tools from Supabase...');
    const allTools = await getTools();
    console.log(`✅ Found ${allTools.length} total tools\n`);

    const toolsNeedingData = allTools.filter(tool => 
      !tool.description || !tool.pricing_data || !tool.best_for_tags
    );
    
    console.log(`📝 Tools needing data: ${toolsNeedingData.length}\n`);

    let processed = 0;
    let failed = 0;

    for (let idx = 0; idx < toolsNeedingData.length; idx++) {
      const tool = toolsNeedingData[idx];
      
      try {
        console.log(`[${idx + 1}/${toolsNeedingData.length}] Processing: ${tool.name}`);

        // Get hardcoded data or generic data
        const data = TOOL_DATA[tool.name] || getGenericData(tool.name);

        // Update Supabase
        await updateTool(tool.id, data);

        console.log(`  ✅ Updated`);
        processed++;

        // Small delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`  ❌ Failed: ${error.message}`);
        failed++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📋 SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Successfully processed: ${processed} tools`);
    console.log(`❌ Failed: ${failed} tools`);
    console.log(`📈 Total: ${processed + failed} tools`);
    console.log('='.repeat(50));
    console.log('\n✨ Phase A complete!');

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();
