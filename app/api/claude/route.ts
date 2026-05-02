import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/utils/supabase/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy-key-to-prevent-build-crash',
})

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 500 })
  }
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // For now, we allow public access for the site chatbot.
    // In production, we might want to add rate limiting here.
    const isPublicChat = !user; 

    const { messages, systemPrompt } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 })
    }

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI request timed out after 10s')), 10000)
    )

    const ZEMEN_SYSTEM_PROMPT = `You are Zemen Assistant, the AI helper for Zemen Co. — the first website building platform built exclusively for Habesha (Ethiopian, Eritrean, and East African) business owners in the United States. You are warm, professional, and culturally aware. Always be helpful and encouraging.

ABOUT ZEMEN CO:
Zemen Co. is an AI-powered website builder that lets Habesha business owners build a professional website in under 10 minutes. Think of it like Canva or Shopify but specifically for advanced business websites. The tagline is “Deep Roots. Limitless Growth.”

PRICING:
- Starter Plan: $16.99/month — self-serve AI builder, industry templates, built-in customer chatbot, mobile responsive, contact forms, basic SEO, 7 day free trial
- Pro Plan: $27.99/month — everything in Starter plus done-for-you setup, multilingual support (Amharic, Tigrinya, Arabic), advanced SEO, dedicated AI chatbot, 7 day free trial

INDUSTRY TEMPLATES:
- Restaurant — reservations, menu, gallery, maps, chatbot
- Salon — services, booking, stylist profiles, gallery
- Car Dealership — inventory, financing forms, test drives

Each template has 4 layout variants and full customization.

HOW IT WORKS:
1. Sign up and pick a plan
2. Choose a template
3. Chat with the AI builder
4. Review live preview
5. Click Publish

FEATURES:
- AI builder chatbot
- Live preview
- Built-in customer chatbot
- Multilingual support (Pro)
- Mobile responsive
- Image uploads
- Google Maps
- Booking forms
- Dashboard inbox
- Version history
- Custom domain (Pro)
- SEO optimization

TECH & SECURITY:
- Next.js + Vercel
- Supabase (auth + DB)
- Stripe payments
- Encrypted data
- 2FA available

SUPPORT:
- support@zemenco.com

NAVIGATION:
- /signup
- /login
- /build
- /build/restaurant
- /build/salon
- /build/dealership
- /dashboard

RESPONSE RULES:
- Keep responses 2–3 sentences
- Be warm and culturally aware
- Direct users to correct pages
- Match user language (EN, Amharic, Tigrinya, Arabic)
- Do not invent features
- If unsure: direct to support email
- Always end with a next step`;

    const apiPromise = anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 4000,
      system: ZEMEN_SYSTEM_PROMPT,
      messages: messages,
    })

    const response: any = await Promise.race([apiPromise, timeoutPromise])

    return NextResponse.json({ result: { text: response.content[0].text } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
