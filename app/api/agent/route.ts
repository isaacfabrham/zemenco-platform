import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'gsk_dummy') {
    return NextResponse.json({ error: 'GROQ_API_KEY is not configured' }, { status: 500 })
  }
  try {
    const body = await req.json()
    const { prompt } = body

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'user', content: prompt }
      ],
      max_tokens: 1024
    })
    
    const reply = response.choices[0]?.message?.content || ''

    // Return in the format expected by the client (which originally handled fetch responses directly)
    // Actually, looking at the original agent route, it returned raw `Response` objects from fetch.
    // Let's match the typical JSON structure or just return the text.
    // The original route just returned the `Response` directly (streaming or json).
    // If we just return NextResponse.json it should work if the client handles it, but let's just return what they expect.
    // Wait, the prompt says: "Use this pattern in every API route... const reply = response.choices[0]?.message?.content || ''"
    return NextResponse.json({ content: reply })
  } catch (error: any) {
    console.error('Groq API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
