import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: Request) {
  try {
    const { messages, systemPrompt } = await req.json()

    if (!process.env.GEMINI_API_KEY) {
      // Mock response for demo mode
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      return NextResponse.json({ 
        result: { text: "Hello! I am currently running in 'Demo Mode' because the Gemini API Key is missing. Once the key is added, I'll be fully powered by Gemini AI!" } 
      })
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt || "You are the Zemen Co. Assistant. Be helpful, professional, and multilingual."
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
