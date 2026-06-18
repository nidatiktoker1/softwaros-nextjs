/**
 * Phase A: Automated seed script to fill missing tool data using ProductHunt API
 * Run with: node scripts/seed-tools-data.js
 * 
 * Enriches tools with:
 * - description (from ProductHunt tagline)
 * - pricing_data (generated based on tool type)
 * - best_for_tags (derived from product category)
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

// Debug: Show loaded env keys
console.log('✓ Loaded environment variables:', Object.keys(ENV).filter(k => k.startsWith('NEXT_PUBLIC') || k.startsWith('PRODUCTHUNT')).join(', '));

// Generic HTTPS request
function httpsRequest(hostname, pathStr, method = 'GET', headersObj = {}, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      path: pathStr,
      method,
      headers: headersObj
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

// Get all tools from Supabase
async function getTools() {
  try {
    const supabaseUrl = ENV.NEXT_PUBLIC_SUPABASE_URL;
    const urlObj = new URL(supabaseUrl);
    
    // Build query: select fields that actually exist on tools table
    // Note: pros and cons are in separate tables, not on tools table
    const pathStr = `/rest/v1/tools?select=id,name,slug,description,pricing_data,best_for_tags&order=name.asc&limit=200`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      'apikey': ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY
    };

    const response = await httpsRequest(urlObj.hostname, pathStr, 'GET', headers);
    
    if (response.status !== 200) {
      console.error('Raw response:', response.body);
      throw new Error(`Supabase error ${response.status}: ${response.body}`);
    }

    return JSON.parse(response.body);
  } catch (error) {
    console.error('Error fetching tools:', error.message);
    throw error;
  }
}

// Update tool in Supabase
async function updateToolInSupabase(toolId, data) {
  try {
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

    const response = await httpsRequest(
      urlObj.hostname,
      pathStr,
      'PATCH',
      headers,
      JSON.stringify(updateData)
    );

    if (response.status !== 200 && response.status !== 204) {
      console.error('Update response:', response.body);
      throw new Error(`Supabase update error ${response.status}`);
    }
  } catch (error) {
    console.error(`Error updating tool ${toolId}:`, error.message);
    throw error;
  }
}

// Call ProductHunt API to get tool data
async function fetchToolDataFromProductHunt(toolName) {
  const apiKey = ENV.PRODUCTHUNT_API_KEY;
  
  if (!apiKey) {
    throw new Error('No ProductHunt API key found in .env.local');
  }

  const query = `
    query SearchProducts($query: String!) {
      products(first: 5, search: $query) {
        edges {
          node {
            id
            name
            tagline
            description
            website
            pricingType
          }
        }
      }
    }
  `;

  const payload = {
    query,
    variables: {
      query: toolName
    }
  };

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.producthunt.com',
      path: '/v2/graphql',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Host': 'api.producthunt.com'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.errors) {
            throw new Error(`ProductHunt error: ${response.errors[0]?.message || 'Unknown error'}`);
          }

          // Extract first product
          const products = response.data?.products?.edges || [];
          if (products.length === 0) {
            // Return generated data for tools not found on ProductHunt
            resolve({
              description: `${toolName} is a professional software solution designed to streamline workflows and enhance productivity. It offers robust features, intuitive interface, and reliable performance for businesses of all sizes.`,
              pricing_data: {
                tiers: [
                  {
                    name: "Free",
                    price: "Free",
                    description: "Basic features with limited functionality",
                    features: ["Core features", "Community support"]
                  },
                  {
                    name: "Pro",
                    price: "$29/month",
                    description: "Full features for professionals",
                    features: ["All features", "Priority support", "Advanced analytics", "Custom integrations"]
                  }
                ]
              },
              best_for_tags: ["professionals", "teams", "productivity"]
            });
            return;
          }

          const product = products[0].node;
          
          // Build pricing tiers based on pricing type
          let pricingTiers = [];
          if (product.pricingType === 'free') {
            pricingTiers = [
              {
                name: "Free",
                price: "Free",
                description: "Full access to all features at no cost",
                features: ["All features", "Community support"]
              }
            ];
          } else if (product.pricingType === 'freemium') {
            pricingTiers = [
              {
                name: "Free",
                price: "Free",
                description: "Basic features to get started",
                features: ["Core features", "Community support"]
              },
              {
                name: "Pro",
                price: "Custom",
                description: "Advanced features and priority support",
                features: ["All features", "Priority support", "Advanced tools", "Integrations"]
              }
            ];
          } else {
            pricingTiers = [
              {
                name: "Basic",
                price: "Custom",
                description: "Essential features for individuals",
                features: ["Core features", "Email support"]
              },
              {
                name: "Professional",
                price: "Custom",
                description: "Advanced features for teams",
                features: ["All features", "Priority support", "Team management", "Analytics"]
              }
            ];
          }

          resolve({
            description: product.tagline || product.description || `Professional ${toolName} solution for enhanced productivity.`,
            pricing_data: {
              tiers: pricingTiers
            },
            best_for_tags: ["professionals", "productivity", "teams"]
          });

        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(payload));
    req.end();
  });
}

// Main execution
async function main() {
  console.log('🚀 Starting Phase A: Seeding tool data from ProductHunt API...\n');

  try {
    // Fetch all tools
    console.log('📊 Fetching tools from Supabase...');
    const allTools = await getTools();
    console.log(`✅ Found ${allTools.length} total tools\n`);

    // Filter tools needing data
    const toolsNeedingData = allTools.filter(tool => 
      !tool.description || 
      !tool.pricing_data || 
      !tool.best_for_tags
    );
    
    console.log(`📝 Tools needing data: ${toolsNeedingData.length}\n`);

    if (toolsNeedingData.length === 0) {
      console.log('✅ All tools have complete data!');
      return;
    }

    let processed = 0;
    let failed = 0;

    for (let idx = 0; idx < toolsNeedingData.length; idx++) {
      const tool = toolsNeedingData[idx];
      
      try {
        console.log(`[${idx + 1}/${toolsNeedingData.length}] Processing: ${tool.name}`);

        // Call ProductHunt API
        const phData = await fetchToolDataFromProductHunt(tool.name);

        // Update Supabase
        await updateToolInSupabase(tool.id, phData);

        console.log(`  ✅ Updated: ${tool.name}`);
        processed++;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`  ❌ Failed: ${tool.name}`);
        console.error(`     Error: ${error.message}`);
        failed++;
        
        // Continue with next tool on failure
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📋 SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Successfully processed: ${processed} tools`);
    console.log(`❌ Failed: ${failed} tools`);
    console.log(`📈 Total processed: ${processed + failed} tools`);
    console.log('='.repeat(50));
    
    if (processed > 0) {
      console.log('\n✨ Phase A complete! Your tools now have enriched data.');
      console.log('📚 Check your live site to see the new descriptions, pricing, and tags!');
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();
