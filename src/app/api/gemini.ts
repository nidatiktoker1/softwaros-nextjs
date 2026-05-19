import { VelcelRequest, VelcelResponse } from '@vercel/node';

export default async function handler(req: VelcelRequest, res: VelcelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  try {
    const apiKey = req.body?.apikey || process.env.GEMINI_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'Gemini API key not configured' });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: req.body?.messages?.[0]?.content || 'test' }] }],
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Gemini API failed' });
  }
}