'use client'

import { useState } from 'react'
import { MessageSquare, X, Send, Loader2 } from 'lucide-react'

export default function SiteChatbot({ businessData, industry }: { businessData: any, industry: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{role: 'assistant' | 'user', content: string}[]>([
    { role: 'assistant', content: `Hi! I'm the AI assistant for ${businessData.businessName}. How can I help you today?` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    
    const newMessages = [...messages, { role: 'user' as const, content: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat/site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          businessData,
          industry
        })
      })
      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.content }])
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: "I'm having trouble connecting right now. Please try calling us instead!" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[#B5780A] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        >
          <MessageSquare size={24} />
        </button>
      ) : (
        <div className="w-[350px] h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
          <div className="p-4 bg-[#0A0F1C] text-white flex justify-between items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-50">AI Assistant</p>
              <p className="font-bold">{businessData.businessName}</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' ? 'bg-[#B5780A] text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <Loader2 size={16} className="animate-spin text-[#B5780A] mx-auto" />}
          </div>

          <div className="p-4 border-t border-gray-100 flex gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 px-4 py-2 bg-gray-50 rounded-full text-sm outline-none focus:ring-1 focus:ring-[#B5780A]"
            />
            <button onClick={handleSend} className="p-2 bg-[#0A0F1C] text-white rounded-full">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
