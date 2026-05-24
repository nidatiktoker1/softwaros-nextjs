// Legacy handler - use route.ts instead
export const config = { runtime: 'nodejs' };

export default function legacyHandler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  return res.status(501).json({ error: 'Use /api/gemini (POST) instead' });
}