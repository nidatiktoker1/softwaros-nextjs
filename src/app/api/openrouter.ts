export const config = { runtime: 'nodejs' };
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const keys = [
    process.env.VITE_GROQ_API_KEY,
    process.env.VITE_GROQ_API_KEY_2,
    process.env.VITE_GROQ_API_KEY_3
  ].filter(Boolean);

  for (const key of keys) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: req.body.messages,
          max_tokens: 200
        })
      });
      if (response.status === 429) continue;
      if (!response.ok) return res.status(response.status).json(await response.json());
      return res.status(200).json(await response.json());
    } catch (error) {
      continue;
    }
  }
  return res.status(429).json({ error: 'All keys exhausted' });
}