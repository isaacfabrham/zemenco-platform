import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: Request) {
  try {
    const { messages, systemPrompt, locale } = await req.json()
    
    const localeMap: Record<string, string> = {
      en: 'English',
      am: 'Amharic (አማርኛ)',
      ti: 'Tigrinya (ትግርኛ)',
      ar: 'Arabic (العربية)'
    }

    const language = localeMap[locale as string] || 'English'

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

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: `${ZEMEN_SYSTEM_PROMPT} You MUST respond only in ${language}.`
    })

    // Convert messages to Gemini format
    const chat = model.startChat({
      history: messages.slice(0, -1).map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
    })

    const latestMessage = messages[messages.length - 1].content
    const result = await chat.sendMessage(latestMessage)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ result: { text } })
  } catch (err: any) {
    console.error('Gemini API Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
