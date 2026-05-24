export const config = { runtime: 'nodejs' };
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const keys = [
    process.env.GROQ_API_KEY,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3
  ].filter(Boolean);

  if (keys.length === 0) {
    console.error('❌ GROQ_API_KEY environment variables not configured');
    return res.status(500).json({ error: 'Groq API keys not configured' });
  }

  // Default model selection based on task type
  const defaultModel = req.body?.model || 'llama-3.3-70b-versatile';
  console.log(`📤 Groq API request - Model: ${defaultModel}, Messages: ${req.body?.messages?.length || 0}`);

  for (const key of keys) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: defaultModel,
          messages: req.body?.messages || [],
          max_tokens: req.body?.max_tokens || 200,
        })
      });

      const data = await response.json();
      
      // If rate limited (429), try next key
      if (response.status === 429) {
        console.warn('⚠️ Rate limited (429), trying next key...');
        continue;
      }
      
      // If unauthorized (401), API key may be invalid
      if (response.status === 401) {
        console.error('❌ Unauthorized (401) - API key may be invalid or expired');
        continue;
      }
      
      // If any other error, return it
      if (!response.ok) {
        console.error(`❌ Groq API error (${response.status}):`, data);
        return res.status(response.status).json(data);
      }
      
      // Success
      console.log('✅ Groq API success');
      return res.status(200).json(data);
    } catch (error) {
      console.warn('⚠️ Error with current key, trying next...');
      continue;
    }
  }
  
  // All keys exhausted
  console.error('❌ All Groq API keys exhausted or failed');
  return res.status(429).json({ error: 'All Groq keys exhausted' });
}
