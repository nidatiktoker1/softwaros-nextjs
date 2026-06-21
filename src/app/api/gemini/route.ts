import { NextRequest, NextResponse } from 'next/server';
import { checkOrigin } from '@/lib/api-guard';

export async function POST(request: NextRequest) {
  try {
    const blocked = checkOrigin(request);
    if (blocked) return blocked;

    const body = await request.json();

    // Hard cap to prevent runaway token usage / cost abuse via this proxy
    const maxTokens = Math.min(Number(body?.max_tokens) || 200, 500);
    if (Array.isArray(body?.messages) && body.messages.length > 20) {
      return NextResponse.json({ error: 'Too many messages' }, { status: 400 });
    }
    
    const keys = [
      process.env.GROQ_API_KEY,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3,
    ].filter(Boolean);

    if (keys.length === 0) {
      console.error('❌ GROQ_API_KEY environment variables not configured');
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

    // Use general model for Gemini endpoint
    const defaultModel = body?.model || 'llama-3.3-70b-versatile';
    console.log(`📤 Groq API request (Gemini endpoint) - Model: ${defaultModel}`);

    for (const key of keys) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: defaultModel,
            messages: body?.messages || [{ role: 'user', content: 'test' }],
            max_tokens: maxTokens,
          }),
        });

        const data = await response.json();
        if (response.status === 429) {
          console.warn('⚠️ Rate limited (429), trying next key...');
          continue;
        }

        if (response.status === 401) {
          console.error('❌ Unauthorized (401) - API key may be invalid or expired');
          continue;
        }

        if (!response.ok) {
          console.error(`❌ Groq API error (${response.status}):`, data);
          return NextResponse.json(data, { status: response.status });
        }

        console.log('✅ Groq API success');
        return NextResponse.json(data);
      } catch (keyError) {
        console.warn('⚠️ Error with current key, trying next...');
        continue;
      }
    }

    console.error('❌ All Groq API keys exhausted or failed');
    return NextResponse.json({ error: 'All Groq keys exhausted' }, { status: 429 });
  } catch (error: any) {
    console.error('❌ Groq API error:', error);
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
