/**
 * Generate SQL UPDATE statements for all 178 tools with descriptions
 * Run with: node scripts/generate-update-sql.js
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

async function getTools() {
  const supabaseUrl = ENV.NEXT_PUBLIC_SUPABASE_URL;
  const urlObj = new URL(supabaseUrl);
  const pathStr = `/rest/v1/tools?select=id,name,slug,category_slug,tagline,description,best_for_tags&order=name.asc&limit=200`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    'apikey': ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY
  };
  const response = await httpsRequest(urlObj.hostname, pathStr, 'GET', headers);
  if (response.status !== 200) throw new Error(`Supabase error ${response.status}`);
  return JSON.parse(response.body);
}

// Category mapping for intelligent generation
const categoryDescriptions = {
  'vpn': { features: ['encryption', 'IP masking', 'multi-device support', 'fast servers'], audience: 'privacy-conscious users', benefit: 'secure online browsing', strength: 'reliable security' },
  'design': { features: ['design templates', 'collaboration tools', 'asset libraries', 'export options'], audience: 'designers and creators', benefit: 'professional visuals', strength: 'user-friendly interface' },
  'productivity': { features: ['task management', 'collaboration', 'automation', 'integrations'], audience: 'teams and professionals', benefit: 'streamlined workflows', strength: 'intuitive design' },
  'code-editors': { features: ['syntax highlighting', 'debugging tools', 'extensions', 'version control'], audience: 'developers', benefit: 'efficient coding', strength: 'powerful features' },
  'version-control': { features: ['branch management', 'code review', 'CI/CD', 'team collaboration'], audience: 'development teams', benefit: 'coordinated development', strength: 'reliable version management' },
  'communication': { features: ['messaging', 'video calls', 'file sharing', 'integrations'], audience: 'teams and remote workers', benefit: 'seamless communication', strength: 'reliable connectivity' },
  'ai-tools': { features: ['AI models', 'automation', 'content generation', 'analysis'], audience: 'content creators and professionals', benefit: 'intelligent automation', strength: 'advanced AI capabilities' },
  'project-management': { features: ['task tracking', 'timeline management', 'team collaboration', 'reporting'], audience: 'project managers and teams', benefit: 'organized workflows', strength: 'comprehensive tracking' },
  'note-taking': { features: ['note organization', 'search capabilities', 'sync', 'sharing'], audience: 'students and professionals', benefit: 'information organization', strength: 'seamless organization' },
  'photo-editing': { features: ['advanced tools', 'filters', 'layers', 'effects'], audience: 'photographers and designers', benefit: 'professional edits', strength: 'powerful tools' },
};

function generateDescription(toolName, category, tagline) {
  const catInfo = categoryDescriptions[category] || {
    features: ['core features', 'user-friendly interface', 'integrations', 'collaboration'],
    audience: 'professionals',
    benefit: 'enhanced productivity',
    strength: 'practical functionality'
  };

  const descriptions = [
    `${toolName} is a powerful ${category.replace(/-/g, ' ')} solution designed to help ${catInfo.audience} achieve their goals more effectively. ${tagline || `With its intuitive interface and robust features, ${toolName} streamlines workflows.`} Key features include ${catInfo.features.slice(0, 3).join(', ')}, and more. The platform is built for both individual users and teams, offering flexibility and scalability. Whether you're a beginner just starting out or an experienced professional looking for advanced capabilities, ${toolName} provides the tools you need to succeed. It integrates with popular applications to create a seamless workflow, and its support team is always ready to help. Many users appreciate its ${catInfo.strength} and ability to adapt to different use cases, making it a versatile choice for anyone seeking to improve their ${category.replace(/-/g, ' ')} capabilities.`,

    `${toolName} is a comprehensive ${category.replace(/-/g, ' ')} platform tailored for ${catInfo.audience} who demand quality and reliability. It combines essential features like ${catInfo.features.slice(0, 2).join(' and ')} with advanced capabilities for power users. The tool excels at providing ${catInfo.benefit} through intelligent design and thoughtful workflows. ${tagline ? `${tagline}` : `Users appreciate its clean interface and reliable performance.`} Whether managing complex projects, collaborating with teams, or handling individual tasks, ${toolName} adapts to your needs. The platform offers flexible ${category.replace(/-/g, ' ')} solutions at various price points, ensuring accessibility for users at any stage. Its ${catInfo.strength} has made it a trusted choice for thousands of organizations and individuals worldwide.`,

    `${toolName} represents a modern approach to ${category.replace(/-/g, ' ')}, offering ${catInfo.audience} the features they need to work more effectively. Built with collaboration and efficiency in mind, it provides ${catInfo.features.slice(0, 2).join(', ')}, and extensive customization options. The platform's ${catInfo.strength} makes it an excellent choice for teams seeking better workflow management. ${tagline || 'Its combination of functionality and ease of use sets it apart.'} ${toolName} supports various use cases and integrates well with existing tools in your ecosystem. From small startups to large enterprises, users rely on this platform for ${catInfo.benefit}. The active community and comprehensive documentation ensure that users at all skill levels can maximize their productivity and achieve their objectives.`
  ];

  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function generateBestForTags(toolName, category, tagline = '') {
  const categoryTags = {
    'vpn': ['privacy', 'security', 'streaming', 'anonymity', 'protection'],
    'design': ['design', 'graphics', 'ui-ux', 'creative', 'prototyping'],
    'productivity': ['productivity', 'organization', 'collaboration', 'automation', 'workflow'],
    'code-editors': ['development', 'coding', 'programming', 'editing', 'debugging'],
    'version-control': ['development', 'collaboration', 'version-control', 'coding', 'team'],
    'communication': ['communication', 'collaboration', 'team', 'messaging', 'remote-work'],
    'ai-tools': ['ai', 'automation', 'productivity', 'content', 'innovation'],
    'project-management': ['project-management', 'productivity', 'team', 'organization', 'planning'],
    'note-taking': ['productivity', 'notes', 'organization', 'knowledge', 'personal'],
    'photo-editing': ['design', 'photo-editing', 'graphics', 'creative', 'visual'],
  };

  const tags = categoryTags[category] || ['productivity', 'tools', 'software', 'efficiency', 'professional'];
  return tags.slice(0, 5);
}

// Escape single quotes for SQL
function escapeSql(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

async function main() {
  console.log('Fetching tools from Supabase...');
  const tools = await getTools();
  console.log(`Found ${tools.length} tools\n`);

  // Generate SQL
  let sql = `-- Auto-generated SQL: Update descriptions and best_for_tags for all 178 tools
-- Generated: ${new Date().toISOString()}
-- Run this in Supabase SQL Editor to update the tools table

BEGIN;

`;

  let updateCount = 0;

  for (const tool of tools) {
    const isShortDesc = !tool.description || tool.description.length < 100;
    const needsTags = !tool.best_for_tags || (Array.isArray(tool.best_for_tags) && tool.best_for_tags.length === 0);

    if (isShortDesc || needsTags) {
      const newDesc = isShortDesc ? generateDescription(tool.name, tool.category_slug || 'productivity', tool.tagline) : tool.description;
      const newTags = needsTags ? generateBestForTags(tool.name, tool.category_slug || 'productivity', tool.tagline) : tool.best_for_tags;

      const escapedDesc = escapeSql(newDesc);
      const tagsJson = JSON.stringify(newTags);
      const escapedSlug = escapeSql(tool.slug);

      sql += `UPDATE tools SET description = '${escapedDesc}', best_for_tags = '${tagsJson}'::jsonb, updated_at = NOW() WHERE slug = '${escapedSlug}';\n`;
      updateCount++;
    }
  }

  sql += `\nCOMMIT;\n`;

  // Write to file
  const outputPath = path.join(__dirname, '..', 'scripts', 'update-descriptions.sql');
  fs.writeFileSync(outputPath, sql, 'utf8');

  console.log(`✓ Generated SQL file: scripts/update-descriptions.sql`);
  console.log(`✓ Total UPDATE statements: ${updateCount}`);
  console.log(`✓ File size: ${(sql.length / 1024).toFixed(2)} KB`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
