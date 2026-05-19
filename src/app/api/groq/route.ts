import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const keys = [
      process.env.GROQ_API_KEY,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3,
    ].filter(Boolean);

    if (keys.length === 0) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

    for (const key of keys) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: body?.model || 'llama-3.3-70b-versatile',
          messages: body?.messages || [],
          max_tokens: body?.max_tokens || 200,
        }),
      });

      if (response.status === 429) continue;
      const data = await response.json();
      if (!response.ok) return NextResponse.json(data, { status: response.status });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'All Groq keys exhausted' }, { status: 429 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Groq API failed' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}