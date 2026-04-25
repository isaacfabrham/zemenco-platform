import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: Request) {
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

    // Use Gemini 1.5 Flash for speed
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Prepare history
    const chatHistory = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const chat = model.startChat({
      history: chatHistory,
      systemInstruction: systemPrompt
    })

    const result = await chat.sendMessage(messages[messages.length - 1].content)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ content: text })
  } catch (err: any) {
    console.error('Site chat error:', err)
    return NextResponse.json({ content: "I'm sorry, I'm having trouble thinking right now. Please try again or call us!" }, { status: 500 })
  }
}
