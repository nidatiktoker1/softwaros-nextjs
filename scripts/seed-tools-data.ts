import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

interface ToolData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  pricing_data?: {
    tiers: Array<{
      name: string;
      price: string | number;
      description?: string;
      features?: string[];
    }>;
  };
  pros?: string[];
  cons?: string[];
  best_for_tags?: string[];
}

interface ClaudeResponse {
  description: string;
  pricing_data: {
    tiers: Array<{
      name: string;
      price: string | number;
      description?: string;
      features?: string[];
    }>;
  };
  pros: string[];
  cons: string[];
  best_for_tags: string[];
}

async function fetchToolDataFromClaude(toolName: string): Promise<ClaudeResponse> {
  const prompt = `You are a software expert. Provide comprehensive information about "${toolName}" in the following JSON format only (no markdown, no explanation):
{
  "description": "A 100-150 word description about what this tool is, its main features, and why it's valuable",
  "pricing_data": {
    "tiers": [
      {
        "name": "Free",
        "price": "Free",
        "description": "Basic features",
        "features": ["Feature 1", "Feature 2"]
      },
      {
        "name": "Pro",
        "price": "$XX/month",
        "description": "Advanced features",
        "features": ["Feature 1", "Feature 2", "Feature 3"]
      }
    ]
  },
  "pros": ["Pro 1", "Pro 2", "Pro 3", "Pro 4", "Pro 5"],
  "cons": ["Con 1", "Con 2", "Con 3", "Con 4"],
  "best_for_tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Return ONLY the JSON, no other text.`;

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  try {
    // Extract JSON from the response (in case there's any extra text)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error(`Failed to parse Claude response for ${toolName}:`, error);
    throw error;
  }
}

async function getToolsNeedingData(): Promise<ToolData[]> {
  const { data, error } = await supabase
    .from("tools")
    .select("id, name, slug, description, pricing_data, pros, cons, best_for_tags")
    .or(
      "description.is.null,pricing_data.is.null,pros.is.null,cons.is.null,best_for_tags.is.null"
    )
    .limit(178);

  if (error) {
    console.error("Error fetching tools from Supabase:", error);
    throw error;
  }

  return data || [];
}

async function updateToolInSupabase(
  toolId: string,
  data: ClaudeResponse
): Promise<void> {
  const { error } = await supabase
    .from("tools")
    .update({
      description: data.description,
      pricing_data: data.pricing_data,
      pros: data.pros,
      cons: data.cons,
      best_for_tags: data.best_for_tags,
      updated_at: new Date().toISOString(),
    })
    .eq("id", toolId);

  if (error) {
    console.error(`Error updating tool ${toolId} in Supabase:`, error);
    throw error;
  }
}

async function main() {
  console.log("🚀 Starting Phase A: Seeding tool data from Claude API...\n");

  try {
    // Step 1: Fetch tools needing data
    console.log("📊 Fetching tools with missing data from Supabase...");
    const toolsNeedingData = await getToolsNeedingData();
    console.log(
      `✅ Found ${toolsNeedingData.length} tools needing data updates\n`
    );

    // Step 2: Process each tool
    let processed = 0;
    let failed = 0;

    for (const tool of toolsNeedingData) {
      try {
        console.log(`[${processed + 1}/${toolsNeedingData.length}] Processing: ${tool.name}`);

        // Call Claude API
        const claudeData = await fetchToolDataFromClaude(tool.name);

        // Update Supabase
        await updateToolInSupabase(tool.id, claudeData);

        console.log(`  ✅ Successfully updated ${tool.name}\n`);
        processed++;

        // Add a small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`  ❌ Failed to process ${tool.name}:`, error);
        failed++;
      }
    }

    // Step 3: Summary
    console.log("\n📋 SUMMARY");
    console.log(`  ✅ Successfully processed: ${processed} tools`);
    console.log(`  ❌ Failed: ${failed} tools`);
    console.log(`  📈 Total: ${processed + failed} tools`);
    console.log("\n✨ Phase A complete!");
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

main();
