'use client'

import { useState, useRef, useEffect } from 'react'

export default function IndustryBuilder({ params }: { params: { industry: string } }) {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [siteData, setSiteData] = useState<any>({
    businessName: 'My Awesome Business',
    tagline: 'The best place in town',
    primaryColor: '#B5780A',
    industry: params.industry
  })
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      // In a real app, you would pass the current siteData to Claude so it knows context,
      // and Claude would return both a conversational response and a JSON patch to update siteData.
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          systemPrompt: `You are an AI website builder for a ${params.industry}. Ask the user for their business name, then tagline, then colors. Output your updates in a specific format if you want to change site properties.`
        })
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      // Assuming Claude returns text. If it returned JSON with instructions to update siteData, we would parse it here.
      // For demonstration, we just push the assistant message.
      const responseText = data.result.text || "I've updated your preview!"
      setMessages([...newMessages, { role: 'assistant', content: responseText }])

      // Optional: Auto-save the site data to the DB periodically or when major changes happen
      await fetch('/api/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateType: params.industry,
          siteData: siteData
        })
      })

    } catch (err) {
      console.error(err)
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-90px)] pt-[90px]">
      {/* LEFT: Chat Interface */}
      <div className="w-1/3 border-r border-white/10 flex flex-col bg-bg-surface/5">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold capitalize">{params.industry} Builder Assistant</h2>
          <p className="text-white/50 text-sm">Chat to build your site.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-4 bg-white/5 rounded-lg text-white/90">
            Hi! I&apos;m your AI builder. Let&apos;s create your {params.industry} website. What&apos;s the name of your business?
          </div>
          {messages.map((msg, idx) => (
            <div key={idx} className={`p-4 rounded-lg ${msg.role === 'user' ? 'bg-brand-gold text-white ml-8' : 'bg-white/5 text-white/90 mr-8'}`}>
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="p-4 bg-white/5 text-white/50 rounded-lg mr-8 animate-pulse">
              Thinking...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 bg-white/5 border border-white/10 rounded outline-none focus:border-brand-gold text-white"
            placeholder="Type your answer..."
          />
          <button type="submit" disabled={loading} className="px-6 bg-brand-gold text-white font-bold rounded hover:bg-brand-gold/80 disabled:opacity-50">
            Send
          </button>
        </form>
      </div>

      {/* RIGHT: Live Preview */}
      <div className="w-2/3 bg-white text-bg-dark overflow-y-auto relative">
        <div className="sticky top-0 w-full bg-black text-white p-2 text-center text-sm font-semibold flex justify-between px-6 z-50">
          <span>Live Preview</span>
          <span className="opacity-50">Desktop View</span>
        </div>
        
        {/* Mock Live Site Preview */}
        <div className="p-20" style={{ '--dynamic-color': siteData.primaryColor } as React.CSSProperties}>
          <header className="flex justify-between items-center mb-20">
            <div className="text-2xl font-bold">{siteData.businessName}</div>
            <nav className="flex gap-8 font-semibold uppercase text-sm">
              <span>Home</span>
              <span>Services</span>
              <span>Contact</span>
            </nav>
          </header>

          <main>
            <h1 className="text-6xl font-extrabold mb-6" style={{ color: 'var(--dynamic-color)' }}>
              {siteData.businessName}
            </h1>
            <p className="text-2xl text-black/60 mb-10">{siteData.tagline}</p>
            <button className="px-8 py-4 text-white font-bold rounded" style={{ backgroundColor: 'var(--dynamic-color)' }}>
              Book Now
            </button>
          </main>
        </div>
      </div>
    </div>
  )
}
