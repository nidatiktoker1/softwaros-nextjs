/**
 * Generate SQL UPDATE statements for tool logos using Google Favicon API
 * Run with: node scripts/generate-update-logos.js
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
  const pathStr = `/rest/v1/tools?select=id,name,slug&order=name.asc&limit=200`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    'apikey': ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY
  };
  const response = await httpsRequest(urlObj.hostname, pathStr, 'GET', headers);
  if (response.status !== 200) throw new Error(`Supabase error ${response.status}`);
  return JSON.parse(response.body);
}

// Domain mapping - manually curated for accuracy
const domainMap = {
  // Provided mappings
  'figma': 'figma.com',
  'chatgpt': 'openai.com',
  'nordvpn': 'nordvpn.com',
  'notion': 'notion.so',
  'canva': 'canva.com',
  'claude': 'anthropic.com',
  'cursor': 'cursor.sh',
  'vs-code': 'code.visualstudio.com',
  '1password': '1password.com',
  'bitwarden': 'bitwarden.com',
  'expressvpn': 'expressvpn.com',
  'surfshark': 'surfshark.com',
  'protonvpn': 'protonvpn.com',
  'dropbox': 'dropbox.com',
  'asana': 'asana.com',
  'trello': 'trello.com',
  'slack': 'slack.com',
  'zoom': 'zoom.us',
  'github': 'github.com',
  'gitlab': 'gitlab.com',
  
  // Additional common tools
  'adobe-photoshop': 'adobe.com',
  'adobe-illustrator': 'adobe.com',
  'adobe-xd': 'adobe.com',
  'adobe-firefly': 'adobe.com',
  'jira': 'atlassian.com',
  'confluence': 'atlassian.com',
  'bitbucket': 'atlassian.com',
  'basecamp': 'basecamp.com',
  'monday': 'monday.com',
  'clickup': 'clickup.com',
  'notion': 'notion.so',
  'evernote': 'evernote.com',
  'google-drive': 'google.com',
  'onedrive': 'microsoft.com',
  'icloud-drive': 'icloud.com',
  'amazon-s3': 'aws.amazon.com',
  'aws-s3': 'aws.amazon.com',
  'digitalocean': 'digitalocean.com',
  'vercel': 'vercel.com',
  'netlify': 'netlify.com',
  'heroku': 'heroku.com',
  'railway': 'railway.app',
  'render': 'render.com',
  'supabase': 'supabase.com',
  'firebase': 'firebase.google.com',
  'airtable': 'airtable.com',
  'smartsheet': 'smartsheet.com',
  'wrike': 'wrike.com',
  'monday-com': 'monday.com',
  'jetbrains': 'jetbrains.com',
  'webstorm': 'jetbrains.com',
  'intellij': 'jetbrains.com',
  'pycharm': 'jetbrains.com',
  'datagrip': 'jetbrains.com',
  'visual-studio': 'visualstudio.microsoft.com',
  'sublime-text': 'sublimetext.com',
  'atom': 'atom.io',
  'emacs': 'gnu.org',
  'vim': 'vim.org',
  'neovim': 'neovim.io',
  'vscode': 'code.visualstudio.com',
  'code-editor': 'code.visualstudio.com',
  'theia': 'theia-ide.org',
  'gitpod': 'gitpod.io',
  'codesandbox': 'codesandbox.io',
  'replit': 'replit.com',
  'glitch': 'glitch.com',
  'mailchimp': 'mailchimp.com',
  'sendgrid': 'sendgrid.com',
  'mailgun': 'mailgun.com',
  'twilio': 'twilio.com',
  'stripe': 'stripe.com',
  'paypal': 'paypal.com',
  'square': 'squareup.com',
  'shopify': 'shopify.com',
  'wix': 'wix.com',
  'wordpress': 'wordpress.com',
  'webflow': 'webflow.com',
  'framer': 'framer.com',
  'sketch': 'sketch.com',
  'affinity-designer': 'affinity.serif.com',
  'affinity-photo': 'affinity.serif.com',
  'procreate': 'procreate.art',
  'pixlr': 'pixlr.com',
  'krita': 'krita.org',
  'gimp': 'gimp.org',
  'inkscape': 'inkscape.org',
  'blender': 'blender.org',
  'threejs': 'threejs.org',
  'babylon-js': 'babylonjs.com',
  'unity': 'unity.com',
  'unreal-engine': 'unrealengine.com',
  'godot': 'godotengine.org',
  'react': 'react.dev',
  'vue': 'vuejs.org',
  'angular': 'angular.io',
  'svelte': 'svelte.dev',
  'nextjs': 'nextjs.org',
  'nuxt': 'nuxt.com',
  'gatsby': 'gatsbyjs.com',
  'remix': 'remix.run',
  'astro': 'astro.build',
  'solid': 'solidjs.com',
  'alpine': 'alpinejs.dev',
  'htmx': 'htmx.org',
  'nodejs': 'nodejs.org',
  'python': 'python.org',
  'ruby': 'ruby-lang.org',
  'php': 'php.net',
  'java': 'java.com',
  'csharp': 'microsoft.com',
  'go': 'golang.org',
  'rust': 'rust-lang.org',
  'kotlin': 'kotlinlang.org',
  'swift': 'swift.org',
  'docker': 'docker.com',
  'kubernetes': 'kubernetes.io',
  'terraform': 'terraform.io',
  'ansible': 'ansible.com',
  'jenkins': 'jenkins.io',
  'github-actions': 'github.com',
  'gitlab-ci': 'gitlab.com',
  'circleci': 'circleci.com',
  'travis-ci': 'travis-ci.com',
  'azure-pipelines': 'azure.microsoft.com',
  'notion': 'notion.so',
  'roam-research': 'roamresearch.com',
  'obsidian': 'obsidian.md',
  'logseq': 'logseq.com',
  'dendron': 'dendron.so',
  'foam': 'foambubble.github.io',
  'miro': 'miro.com',
  'mural': 'mural.co',
  'excalidraw': 'excalidraw.com',
  'lucidchart': 'lucidchart.com',
  'draw-io': 'draw.io',
  'diagrams-net': 'draw.io',
  'figma': 'figma.com',
  'penpot': 'penpot.app',
  'invision': 'invisionapp.com',
  'framer': 'framer.com',
  'balsamiq': 'balsamiq.com',
  'mockflow': 'mockflow.com',
  'wireframe-cc': 'wireframe.cc',
  'axure': 'axure.com',
  'proto-io': 'proto.io',
  'flinto': 'flinto.com',
  'marvel': 'marvelapp.com',
  'zeplin': 'zeplin.io',
  'avocode': 'avocode.com',
  'craft': 'craft.io',
  'sympli': 'sympli.io',
  'abstract': 'abstract.com',
  'invision-studio': 'invisionapp.com',
  'adobe-xd': 'adobe.com',
  'figma': 'figma.com',
  'lunacy': 'icons8.com',
  'sketch': 'sketch.com',
  'gravit-designer': 'gravit.io',
  'affinity-designer': 'affinity.serif.com',
  'coreldraw': 'coreldraw.com',
  'canva': 'canva.com',
  'crello': 'crello.com',
  'picmonkey': 'picmonkey.com',
  'pixlr': 'pixlr.com',
  'photopea': 'photopea.com',
  'photoshop': 'adobe.com',
  'lightroom': 'adobe.com',
  'capture': 'adobe.com',
  'photoshop-express': 'adobe.com',
  'affinity-photo': 'affinity.serif.com',
  'capture-one': 'captureone.com',
  'luminar': 'skylum.com',
  'ON1': 'on1.com',
  'Corel-PaintShop': 'corel.com',
  'PhotoDirector': 'cyberlink.com',
  'ACDSee': 'acdsee.com',
  'Darktable': 'darktable.org',
  'RawTherapee': 'rawtherapee.com',
  'Krita': 'krita.org',
  'Procreate': 'procreate.art',
  'Clip Studio Paint': 'clipstudio.net',
  'Rebelle': 'escapemill.com',
  'Infinite Painter': 'infinitepainter.com',
  'ArtRage': 'artrage.com',
  'Painter': 'corel.com',
  'SketchBook': 'sketchbook.com',
  'MediBang Paint': 'medibangpaint.com',
  'ibis Paint': 'ibispaint.com',
  'Autodesk-SketchBook': 'sketchbook.com',
  'gpaint': 'gnuplot.info',
  'Tux-Paint': 'tuxpaint.org',
  'ChatGPT': 'openai.com',
  'GPT-4': 'openai.com',
  'DALL-E': 'openai.com',
  'Claude': 'anthropic.com',
  'Bard': 'google.com',
  'Gemini': 'google.com',
  'Copilot': 'microsoft.com',
  'Copilot-Pro': 'microsoft.com',
  'Grok': 'twitter.com',
  'Perplexity': 'perplexity.ai',
  'You-com': 'you.com',
  'Jasper': 'jasper.ai',
  'Copy-ai': 'copy.ai',
  'Rytr': 'rytr.me',
  'Writesonic': 'writesonic.com',
  'Sudowrite': 'sudowrite.ai',
  'ShortlyAI': 'shortlyai.com',
  'Articoolo': 'articoolo.com',
  'Copysmith': 'copysmith.com',
  'Anyword': 'anyword.com',
  'Textio': 'textio.com',
  'Wordtune': 'wordtune.com',
  'Grammarly': 'grammarly.com',
  'ProWritingAid': 'prowritingaid.com',
  'Hemingway-Editor': 'hemingwayapp.com',
  'Reverso': 'reverso.net',
  'Quillbot': 'quillbot.com',
  'Paraphrase-Tool': 'paraphrasetool.com',
  'SpinBot': 'spinbot.com',
  'SmartSpin2': 'smartspin2.com',
  'Spinner-Chief': 'spinnerchief.com',
  'WordAI': 'wordai.com',
  'LSI-Keyword-Tool': 'lsikeywordtool.com',
  'Clearscope': 'clearscope.io',
  'MarketMuse': 'marketmuse.com',
  'Surfer-SEO': 'surferseo.com',
  'Semrush': 'semrush.com',
  'Ahrefs': 'ahrefs.com',
  'SE-Ranking': 'seranking.com',
  'Moz': 'moz.com',
  'SimilarWeb': 'similarweb.com',
  'Majestic': 'majestic.com',
  'Alexa': 'alexa.com',
  'SpyFu': 'spyfu.com',
  'SEMrush': 'semrush.com',
  'WordStream': 'wordstream.com',
  'SEO-PowerSuite': 'seopowersuite.com',
  'ScreenFlow': 'screenflow.com',
  'Camtasia': 'camtasia.com',
  'Snagit': 'snagit.com',
  'Greenshot': 'greenshot.org',
  'ShareX': 'getsharex.com',
  'Gyroflow': 'gyroflow.io',
  'OBS-Studio': 'obsproject.com',
  'Streamlabs': 'streamlabs.com',
  'XSplit': 'xsplit.com',
  'vMix': 'vmix.com',
  'Wirecast': 'telestream.net',
  'Adobe-Premiere': 'adobe.com',
  'Adobe-After-Effects': 'adobe.com',
  'Adobe-Media-Encoder': 'adobe.com',
  'Vegas-Pro': 'vegaspro.com',
  'Corel-VideoStudio': 'corel.com',
  'Cyberlink-PowerDirector': 'cyberlink.com',
  'Movavi': 'movavi.com',
  'Wondershare-Filmora': 'filmora.wondershare.com',
  'MAGIX-Movie-Edit-Pro': 'magix.com',
  'AVS-Video-Editor': 'avs4you.com',
  'HitFilm': 'hitfilm.com',
  'DaVinci-Resolve': 'davinciresolve.com',
  'Shotcut': 'shotcut.org',
  'OpenShot': 'openshot.org',
  'KDEnlive': 'kdenlive.org',
  'FFmpeg': 'ffmpeg.org',
  'Audacity': 'audacityteam.org',
  'FL-Studio': 'image-line.com',
  'Ableton-Live': 'ableton.com',
  'Cubase': 'steinberg.net',
  'Pro-Tools': 'avid.com',
  'Logic-Pro': 'apple.com',
  'Studio-One': 'presonus.com',
  'Reaper': 'reaper.fm',
  'SONAR': 'bandlab.com',
  'Bitwig-Studio': 'bitwig.com',
  'Garageband': 'apple.com',
  'Fruity-Loops': 'image-line.com',
  'GarageBand': 'apple.com',
  'BandLab': 'bandlab.com',
  'Soundation': 'soundation.com',
  'BeatStars': 'beatstars.com',
  'Splice': 'splice.com',
  'Native-Instruments': 'native-instruments.com',
};

// Smart domain guessing for tools not in map
function guessDomain(slug, name) {
  // Remove hyphens and try common domains
  const cleanName = slug.toLowerCase().replace(/-/g, '');
  const nameVariant = name.toLowerCase().replace(/\s+/g, '');
  
  // Try common TLDs
  const commonTLDs = ['.com', '.io', '.ai', '.sh', '.app', '.co', '.org', '.net', '.dev'];
  
  // Check if it's a SaaS product with .io or .app ending
  if (slug.includes('app') || slug.includes('hub') || slug.includes('kit')) {
    return `${cleanName}.io`;
  }
  
  if (slug.includes('studio') || slug.includes('pro')) {
    return `${cleanName}.com`;
  }
  
  // Default fallback
  return `${cleanName}.com`;
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
  let sql = `-- Auto-generated SQL: Update logo_url for all 178 tools
-- Uses Google Favicon API: https://www.google.com/s2/favicons?domain=DOMAIN&sz=128
-- Generated: ${new Date().toISOString()}
-- Run this in Supabase SQL Editor to update the tools table

BEGIN;

`;

  let updateCount = 0;
  const usedDomains = new Set();

  for (const tool of tools) {
    // Get domain from map or guess it
    const slug = tool.slug.toLowerCase();
    let domain = domainMap[slug];
    
    if (!domain) {
      // Try variants
      domain = domainMap[tool.name.toLowerCase()] || 
               domainMap[tool.name.toLowerCase().replace(/\s+/g, '-')] ||
               guessDomain(slug, tool.name);
    }

    // Google Favicon API URL
    const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    
    const escapedSlug = escapeSql(slug);
    const escapedLogoUrl = escapeSql(logoUrl);

    sql += `UPDATE tools SET logo_url = '${escapedLogoUrl}', updated_at = NOW() WHERE slug = '${escapedSlug}';\n`;
    updateCount++;
    usedDomains.add(domain);
  }

  sql += `\nCOMMIT;\n`;

  // Write to file
  const outputPath = path.join(__dirname, '..', 'scripts', 'update-logos.sql');
  fs.writeFileSync(outputPath, sql, 'utf8');

  console.log(`✓ Generated SQL file: scripts/update-logos.sql`);
  console.log(`✓ Total UPDATE statements: ${updateCount}`);
  console.log(`✓ Unique domains used: ${usedDomains.size}`);
  console.log(`✓ File size: ${(sql.length / 1024).toFixed(2)} KB`);
  console.log(`\n✓ Top 10 domains used:`);
  Array.from(usedDomains).sort().slice(0, 10).forEach(d => console.log(`  - ${d}`));
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
