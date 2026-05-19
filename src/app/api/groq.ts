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
    return res.status(500).json({ error: 'Groq API keys not configured' });
  }

  for (const key of keys) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
         model: req.body?.model || 'llama-3.3-70b-versatile',
          messages: req.body?.messages || [],
          max_tokens: req.body?.max_tokens || 200,
        })
      });

      const data = await response.json();
      
      // If rate limited (429), try next key
      if (response.status === 429) continue;
      
      // If any other error, return it
      if (!response.ok) {
        return res.status(response.status).json(data);
      }
      
      // Success
      return res.status(200).json(data);
    } catch (error) {
      // Try next key on error
      continue;
    }
  }
  
  // All keys exhausted
  return res.status(429).json({ error: 'All Groq keys exhausted' });
}
