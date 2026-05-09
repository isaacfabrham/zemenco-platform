import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

const SYSTEM_PROMPT = `You are Zemen Assistant, the AI helper for Zemen Co. — the first website building platform built exclusively for Habesha (Ethiopian, Eritrean, and East African) business owners in the United States. You are warm, professional, and culturally aware.

ABOUT ZEMEN CO:
AI-powered website builder. Build a professional website in under 10 minutes. Tagline: "Deep Roots. Limitless Growth."

PRICING:
Starter: $16.99/month — AI builder, templates, chatbot, SEO, 7 day free trial
Pro: $27.99/month — everything in Starter plus multilingual, done-for-you setup, advanced SEO, 7 day free trial

TEMPLATES: Restaurant, Salon, Car Dealership — each with 4 layout variants

NAVIGATION:
/signup, /login, /dashboard, /build/restaurant, /build/salon, /build/dealership, /templates

RULES:
- Max 2-3 sentences per response
- Respond in whatever language the user writes in
- Never invent features
- Always end with a next step
- Direct technical issues to support@zemenco.com`

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'AI service is not configured' },
        { status: 500 }
      )
    }

    const { messages } = await request.json()

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      max_tokens: 1024,
      temperature: 0.7
    })

    const reply = response.choices[0]?.message?.content || 'How can I help you today?'

    return NextResponse.json({ message: reply })
  } catch (error) {
    console.error('Groq API error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
