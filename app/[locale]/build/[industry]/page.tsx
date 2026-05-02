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
          setMessages([{ role: 'assistant', content: tBuilder('welcomeBack', { industry }) }])
        } else {
          setMessages([{ role: 'assistant', content: tBuilder('startBuilding', { industry }) }])
        }
      } catch (e) {
        console.error("Failed to init", e)
      }
    }
    init()
  }, [industry, locale, tBuilder])

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
              setMessages(prev => {
                const last = prev[prev.length - 1]
                if (last?.role === 'assistant') {
                  return [...prev.slice(0, -1), { role: 'assistant', content: last.content + data.message }]
                }
                return [...prev, { role: 'assistant', content: data.message }]
              })
            }
            if (data.updatedData) {
              setSiteData(data.updatedData)
              setHistory(prev => [...prev, data.updatedData])
              setHistoryIndex(prev => prev + 1)
              
              // Auto-save history snapshot
              fetch('/api/agent/history/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  siteId,
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
        body: JSON.stringify({
          id: siteId,
          templateType: industry,
          businessName: siteData.businessName,
          published: true,
          ...siteData
        })
      })
      const data = await res.json()
      if (data.success) {
        setMessages(prev => [...prev, { role: 'system', content: 'Site published successfully! Visit it at the preview link below.' }])
      }
    } catch (e) {
      console.error("Publish failed", e)
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
      <div className="w-[450px] flex flex-col border-r border-white/5 bg-[#0D121F] shadow-2xl relative z-20">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#B5780A] rounded-lg flex items-center justify-center shadow-lg shadow-yellow-900/20">
                <Terminal size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-white font-black text-xs uppercase tracking-[0.2em]">Zemen Agent</h2>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{agentStatus || 'Standing By'}</span>
                </div>
              </div>
           </div>
           <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/30">
              <ChevronLeft size={20} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-[#B5780A] text-white shadow-lg shadow-yellow-900/10 rounded-tr-none' 
                  : m.role === 'system'
                  ? 'bg-white/5 text-brand-gold italic border border-white/5'
                  : 'bg-white/5 text-white/80 border border-white/5 shadow-xl rounded-tl-none'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-6 bg-black/20 border-t border-white/5">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={tBuilder('placeholder')}
              className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-4 pl-5 pr-14 text-xs focus:outline-none focus:border-[#B5780A] transition-all placeholder:text-white/20"
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
          {!siteData.businessName && !loading && (
             <div className="absolute inset-0 bg-bg-surface/80 backdrop-blur-sm flex items-center justify-center z-10 p-20 text-center">
                <div className="max-w-md">
                   <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
                      <Layout size={40} className="text-brand-gold" />
                   </div>
                   <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Your Brand Awaits</h2>
                   <p className="text-text-muted mb-8 text-lg">Tell the Zemen Agent your business name and details on the left to start building your elite digital platform.</p>
                </div>
             </div>
          )}
        </div>

        {/* Toolbar Overlay */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-2xl flex items-center gap-8 shadow-2xl z-30">
           <div className="flex items-center gap-3 border-r border-white/10 pr-8">
              <button onClick={handleUndo} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white">
                <Undo size={18} />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white">
                <Redo size={18} />
              </button>
           </div>
           <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
              <button className="hover:text-brand-gold transition-colors flex items-center gap-2">
                 <Camera size={14} /> Desktop
              </button>
              <button className="hover:text-brand-gold transition-colors flex items-center gap-2">
                 <Layout size={14} /> Components
              </button>
           </div>
        </div>
      </div>
    </div>
  )
}
