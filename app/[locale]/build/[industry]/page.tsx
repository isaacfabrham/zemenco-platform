'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, Link } from '@/navigation'
import { Send, Loader2, Camera, Check, Globe, Layout, ChevronLeft, Undo, Redo, Save, Terminal } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import RestaurantTemplate from '@/components/templates/RestaurantTemplate'
import SalonTemplate from '@/components/templates/SalonTemplate'
import DealershipTemplate from '@/components/templates/DealershipTemplate'

type Industry = 'restaurant' | 'salon' | 'dealership'

export default function IndustryBuilder({ params }: { params: { industry: string } }) {
  const industry = params.industry as Industry
  const router = useRouter()
  const locale = useLocale()
  const tBuilder = useTranslations('builder')

  const [siteId, setSiteId] = useState<string | null>(null)
  const [messages, setMessages] = useState<{role: 'assistant' | 'user' | 'system', content: string}[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [agentStatus, setAgentStatus] = useState<string>('')
  
  const [siteData, setSiteData] = useState<any>({
    templateType: industry,
    businessName: '',
    tagline: '',
    theme: {
      primaryColor: industry === 'restaurant' ? '#B5780A' : industry === 'dealership' ? '#FF4D00' : '#E63946',
      backgroundColor: '#0A0F1C',
      fontFamily: 'sans-serif'
    },
    languages: ['English'],
    published: false
  })

  const [history, setHistory] = useState<any[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch(`/api/site?industry=${industry}`)
        const data = await res.json()
        if (data.site) {
          setSiteId(data.site.id)
          setSiteData(data.site.site_data)
          const greeting = locale === 'en' 
            ? `Welcome back to Zemen Agent! I'm ready to help you edit your ${industry} site. What can I do for you today?`
            : `እንኳን ደህና መጡ! ድረ-ገጽዎን ለማስተካከል ዝግጁ ነኝ። ምን ላድርግልዎ?`;
          setMessages([{ role: 'assistant', content: greeting }])
        } else {
          // Create a shell site record first? Or just start chat.
          const greeting = locale === 'en' 
            ? `I'm your Zemen AI Agent. Tell me about your ${industry} and I'll build it for you instantly.`
            : `እኔ የዘመን AI ወኪል ነኝ። ስለ ${industry}ዎ ይንገሩኝ እና ወዲያውኑ እገነባዋለሁ።`;
          setMessages([{ role: 'assistant', content: greeting }])
        }
      } catch (e) {
        console.error("Failed to init", e)
      }
    }
    init()
  }, [industry, locale])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch(`/api/agent/stream?message=${encodeURIComponent(userMessage)}&siteId=${siteId}&userId=current`, {
        method: 'GET',
      })

      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.substring(6))
            
            if (data.status) setAgentStatus(data.status)
            if (data.message) {
              setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
            }
            if (data.updatedData) {
              // Add current state to history (React state)
              setHistory(prev => [...prev.slice(0, historyIndex + 1), siteData])
              setHistoryIndex(prev => prev + 1)
              setSiteData(data.updatedData)

              // Save to Supabase History
              fetch('/api/agent/history/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  siteId,
                  changeDescription: userMessage,
                  siteDataSnapshot: data.updatedData
                })
              }).catch(e => console.error("Failed to save history", e))
            }
            if (data.complete) setLoading(false)
          }
        }
      }
    } catch (err) {
      console.error('Agent stream failed', err)
      setMessages(prev => [...prev, { role: 'system', content: 'Agent connection lost. Retrying...' }])
    } finally {
      setLoading(false)
      setAgentStatus('')
    }
  }

  const handleUndo = () => {
    if (historyIndex >= 0) {
      const prevState = history[historyIndex]
      setSiteData(prevState)
      setHistoryIndex(prev => prev - 1)
    }
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      const res = await fetch('/api/site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...siteData, published: true })
      })
      const data = await res.json()
      if (data.success) {
        router.push(`/dashboard?published=true&slug=${data.slug}`)
      }
    } catch (err) {
      console.error('Publishing failed', err)
    } finally {
      setIsPublishing(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await fetch('/api/site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: siteId,
          templateType: industry,
          businessName: siteData.businessName,
          published: false,
          ...siteData
        })
      })
      setMessages(prev => [...prev, { role: 'system', content: 'Draft saved successfully.' }])
    } catch (e) {
      console.error("Save failed", e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-[#0A0F1C] overflow-hidden pt-[90px]">
      {/* LEFT: Agent Chat Interface */}
      <div className="w-[450px] flex-shrink-0 flex flex-col bg-[#0A0F1C] border-r border-white/5">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-white/50 hover:text-white">
              <ChevronLeft size={20} />
            </Link>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#B5780A]">Zemen Agent</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">
                  {loading ? agentStatus || 'Processing...' : 'Systems Ready'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={handleUndo} disabled={historyIndex < 0} className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-white disabled:opacity-20 transition-all">
                <Undo size={16} />
             </button>
             <button className="p-2 bg-white/5 rounded-lg text-white/40 hover:text-white disabled:opacity-20 transition-all">
                <Redo size={16} />
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' 
                ? 'bg-[#B5780A] text-white rounded-tr-none shadow-xl shadow-yellow-900/10' 
                : m.role === 'system'
                ? 'bg-red-900/20 text-red-400 border border-red-900/30 w-full text-center italic text-xs'
                : 'bg-white/5 text-white/90 border border-white/5 rounded-tl-none'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                <Loader2 size={14} className="animate-spin text-[#B5780A]" />
                <span className="text-xs text-white/40 font-mono italic">{agentStatus}...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-6 bg-[#0A0F1C] border-t border-white/5">
          <div className="relative flex items-center group">
            <div className="absolute left-4 text-white/20 group-focus-within:text-[#B5780A] transition-colors">
               <Terminal size={18} />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask the agent to change anything..."
              className="w-full pl-12 pr-12 py-5 bg-white/5 border border-white/10 rounded-2xl text-white text-sm outline-none focus:border-[#B5780A] focus:bg-white/10 transition-all shadow-inner"
            />
            <button 
              onClick={handleSendMessage}
              disabled={loading}
              className="absolute right-3 p-2.5 bg-[#B5780A] text-white rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-yellow-900/20"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="mt-4 text-[10px] text-white/20 text-center uppercase font-bold tracking-widest">
            Try: &quot;Make it look more luxurious&quot; or &quot;Add a team section&quot;
          </p>
        </div>
      </div>

      {/* RIGHT: Live Preview Screen */}
      <div className="flex-1 flex flex-col bg-black relative">
        <div className="p-4 bg-white/5 flex justify-between items-center px-8 border-b border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-6">
             <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
             </div>
             <div className="bg-black/40 border border-white/5 px-6 py-2 rounded-full text-[10px] text-white/50 font-mono tracking-tighter flex items-center gap-3">
                <Globe size={10} />
                zemenco.com/preview/{siteData.businessName?.toLowerCase().replace(/\s+/g, '-') || 'site'}
             </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 text-white/70 text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-white/10 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save Draft
            </button>
            <button 
              onClick={handlePublish}
              disabled={isPublishing || !siteData.businessName}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1F6B3A] text-white text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-[#2e9e56] disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-green-900/20"
            >
              {isPublishing ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
              {isPublishing ? 'Publishing...' : 'Go Live'}
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-white m-6 rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] relative border border-white/5">
          {industry === 'restaurant' && <RestaurantTemplate data={siteData} />}
          {industry === 'salon' && <SalonTemplate data={siteData} />}
          {industry === 'dealership' && <DealershipTemplate data={siteData} />}
          
          {/* Overlay if not started */}
          {!siteData.businessName && (
            <div className="absolute inset-0 bg-white flex flex-col items-center justify-center text-center p-20">
               <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-8 animate-bounce shadow-xl">
                  <Layout size={40} className="text-gray-300" />
               </div>
               <h3 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Digital Canvas Ready</h3>
               <p className="text-gray-400 mt-4 max-w-xs uppercase text-[10px] font-black tracking-[0.3em] leading-relaxed">
                 Tell the agent about your vision on the left to begin the architectural generation.
               </p>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] pointer-events-none transition-all" />
          )}
        </div>
      </div>
    </div>
  )
}
