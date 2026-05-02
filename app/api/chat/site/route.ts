import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'gsk_dummy') {
    return NextResponse.json({ content: 'GROQ_API_KEY is not configured' }, { status: 500 })
  }
  try {
    const { messages, businessData, industry } = await req.json()
    
    const systemPrompt = `
      You are the AI assistant for ${businessData.businessName}. You help customers with questions about our ${industry}.
      
      Our Details:
      - Business Name: ${businessData.businessName}
      - Industry: ${industry}
      - Hours: ${businessData.hours}
      - Address: ${businessData.address}, ${businessData.city}
      - Phone: ${businessData.phone}
      - Tagline: ${businessData.tagline}
      - Booking/Reservation: ${businessData.bookingMethod}
      
      ${industry === 'restaurant' ? `Menu Items: ${JSON.stringify(businessData.menuItems)}` : ''}
      ${industry === 'salon' ? `Services: ${JSON.stringify(businessData.services)}, Stylists: ${JSON.stringify(businessData.stylists)}` : ''}
      ${industry === 'dealership' ? `Inventory: ${JSON.stringify(businessData.inventory)}` : ''}
      
      Instructions:
      1. Keep responses short, professional, and friendly.
      2. Only answer questions about this specific business.
      3. If a customer wants to book, reserve, or inquire, direct them to use the "Reserve" or "Book" buttons on this page.
      4. Do not mention that you are an AI model. You are the digital representative of ${businessData.businessName}.
    `

    // Format history for Groq
    const cleanMessages = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content
    }))

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...cleanMessages
      ] as any,
      max_tokens: 1024
    })
    
    const reply = response.choices[0]?.message?.content || ''

    return NextResponse.json({ content: reply })
  } catch (err: any) {
    console.error('Site chat error:', err)
    return NextResponse.json({ content: "I'm sorry, I'm having trouble thinking right now. Please try again or call us!" }, { status: 500 })
  }
}
