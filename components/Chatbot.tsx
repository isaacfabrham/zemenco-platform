'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react'
import { useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_REPLIES = [
  { id: 'cost', text: 'What does it cost?' },
  { id: 'how', text: 'How does it work?' },
  { id: 'start', text: 'Start building my site' },
  { id: 'help', text: 'I need help' }
]

export default function Chatbot() {
  const locale = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: locale === 'en' 
        ? 'Hello! I am the Zemen Assistant. How can I help you today?' 
        : 'ሰላም! እኔ የዘመን ረዳት ነኝ። ዛሬ እንዴት ልረዳዎት እችላለሁ?' 
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: messageText }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setShowQuickReplies(false)

    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          locale
        })
      })

      const data = await response.json()
      if (data.result) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.result.text }])
      } else {
        const errorMsg = data.error || 'Sorry, I encountered an error. Please try again.'
        setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }])
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please check your internet.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-[400px] h-[600px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#0A0F1C] p-5 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-50%] left-[-20%] w-[150%] h-[150%] bg-gradient-to-br from-[#1D9E75] via-transparent to-[#9B1C1C] animate-pulse" />
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 bg-gradient-to-br from-[#9B1C1C] to-[#1D9E75] rounded-full flex items-center justify-center shadow-lg">
                  <Bot size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-tight">Zemen Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-[#1D9E75] rounded-full animate-pulse" />
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Always Active</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10"
              >
                <X size={22} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#FDFDFD]">
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-[#0A0F1C] text-white rounded-tr-none font-medium' 
                      : 'bg-white text-[#0A0F1C] border border-gray-100 rounded-tl-none'
                  }`}>
                    {m.content}
                  </div>
                </motion.div>
              ))}
              
              {showQuickReplies && messages.length === 1 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-2 pt-2"
                >
                  {QUICK_REPLIES.map((reply) => (
                    <button
                      key={reply.id}
                      onClick={() => handleSend(reply.text)}
                      className="px-4 py-2.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-[#0A0F1C] hover:border-[#1D9E75] hover:text-[#1D9E75] hover:bg-gray-50 transition-all shadow-sm"
                    >
                      {reply.text}
                    </button>
                  ))}
                </motion.div>
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none">
                    <Loader2 size={20} className="animate-spin text-[#1D9E75]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-5 bg-white border-t border-gray-100">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask us anything..."
                  className="w-full pl-5 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#1D9E75] focus:bg-white transition-all shadow-inner"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 p-2.5 bg-[#0A0F1C] text-white rounded-xl hover:bg-[#1D9E75] transition-all disabled:opacity-30 shadow-lg"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-4 opacity-30">
                <Sparkles size={10} className="text-[#1D9E75]" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A0F1C]">
                  Zemen AI Platform
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all duration-500 transform ${
          isOpen ? 'bg-white text-[#0A0F1C] rotate-90' : 'bg-[#0A0F1C] text-white'
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={32} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#1D9E75] rounded-full border-4 border-white animate-pulse" />
        )}
      </motion.button>
    </div>
  )
}
