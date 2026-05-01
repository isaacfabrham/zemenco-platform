import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { prompt, model = 'llama3.1:70b', stream = false } = body

    // 1. Try Ollama (Self-hosted)
    try {
      const ollamaRes = await fetch(`${process.env.OLLAMA_API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt,
          stream
        }),
        signal: AbortSignal.timeout(10000) // 10s timeout
      })

      if (ollamaRes.ok) {
        return ollamaRes
      }
    } catch (e) {
      console.warn('Ollama failed, falling back to OpenRouter...', e)
    }

    // 2. Fallback to OpenRouter (GPT-OSS-120B)
    try {
      const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'Zemen Agent'
        },
        body: JSON.stringify({
          model: 'cognitivecomputations/dolphin-mixtral-8x7b', // Closest to OSS 120B on OR or generic fallback
          messages: [{ role: 'user', content: prompt }],
          stream
        })
      })

      if (orRes.ok) {
        return orRes
      }
    } catch (e) {
      console.warn('OpenRouter failed, falling back to Claude...', e)
    }

    // 3. Last resort: Claude Sonnet
    try {
      const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 4096,
          messages: [{ role: 'user', content: prompt }],
          stream
        })
      })

      if (claudeRes.ok) {
        return claudeRes
      }
    } catch (e) {
      console.error('All AI providers failed', e)
    }

    return NextResponse.json({ error: 'All AI models unavailable' }, { status: 503 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
