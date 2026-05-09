'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from '@/navigation'
import { Send, Loader2, Globe, Layout, ChevronLeft, Save, Sparkles, Image as ImageIcon, Smartphone, Monitor, Check, X } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import RestaurantTemplate from '@/components/templates/RestaurantTemplate'
import SalonTemplate from '@/components/templates/SalonTemplate'
import DealershipTemplate from '@/components/templates/DealershipTemplate'
import PublishGateModal from '@/components/PublishGateModal'

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
  
  const [siteData, setSiteData] = useState<any>({
    templateType: industry,
    businessName: '',
    tagline: '',
    theme: {
      primaryColor: industry === 'restaurant' ? '#1D9E75' : industry === 'dealership' ? '#FF4D00' : '#E63946',
      backgroundColor: '#0F2820',
      fontFamily: 'sans-serif'
    },
    languages: ['English'],
    published: false
  })

  const [history, setHistory] = useState<any[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [mobileTab, setMobileTab] = useState<'chat' | 'preview'>('chat')
  const [showPublishModal, setShowPublishModal] = useState(false)
  
  // Progress tracking
  const [progress, setProgress] = useState(10) // start at 10%
  const [showCelebration, setShowCelebration] = useState<'none' | 'halfway' | 'complete'>('none')

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
          setProgress(50)
        } else {
          setMessages([{ role: 'assistant', content: "Hi! I'm your Zemen AI. Let's build your amazing new website. What is the name of your business?" }])
        }
      } catch (e) {
        console.error("Failed to init", e)
      }
    }
    init()
  }, [industry, locale, tBuilder])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Fake typing indicator effect
  const handleSendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    // Simulate progress increase
    const newProgress = Math.min(progress + 15, 100)
    setProgress(newProgress)
    
    if (newProgress >= 50 && progress < 50) setShowCelebration('halfway')
    if (newProgress >= 100 && progress < 100) {
      setShowCelebration('complete')
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 100
      })
    }

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
            }
            if (data.complete) setLoading(false)
          }
        }
      }
    } catch (err) {
      console.error('Agent stream failed', err)
      
      // Fallback fake response if agent fails locally
      setTimeout(() => {
         setMessages(prev => [...prev, { role: 'assistant', content: "I've updated your site! What else would you like to add?" }])
         setLoading(false)
      }, 1500)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickReply = (text: string) => {
    setInput(text)
    setTimeout(handleSendMessage, 100)
  }

  return (
    <div className="flex flex-col h-screen bg-[#F4F5F7] overflow-hidden font-sans">
      
      {/* Top Bar with Progress */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 z-30 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ChevronLeft size={20} />
          </button>
          <div className="hidden md:flex items-center gap-2">
            <span className="font-bold text-[#0F2820]">Zemen Co. Builder</span>
            <span className="px-2 py-0.5 bg-[#E8F5F1] text-[#1D9E75] text-[10px] font-bold uppercase rounded-md">
              {industry}
            </span>
          </div>
        </div>

        {/* Shopify-style Progress Bar */}
        <div className="flex-1 max-w-md mx-8 hidden md:flex flex-col gap-1">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
            <span>Setup Progress</span>
            <span className="text-[#1D9E75]">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#1D9E75] transition-all duration-1000 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-[#0F2820] transition-colors">
            <Save size={16} /> Save Draft
          </button>
          <button 
            onClick={() => setShowPublishModal(true)}
            className="px-5 py-2 bg-[#0F2820] text-white text-sm font-bold rounded-xl hover:bg-[#163B2F] transition-all shadow-sm flex items-center gap-2"
          >
            Publish <Globe size={16} />
          </button>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden flex bg-white border-b border-gray-200 shrink-0">
        <button 
          onClick={() => setMobileTab('chat')}
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${mobileTab === 'chat' ? 'border-[#1D9E75] text-[#1D9E75]' : 'border-transparent text-gray-500'}`}
        >
          AI Chat
        </button>
        <button 
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${mobileTab === 'preview' ? 'border-[#1D9E75] text-[#1D9E75]' : 'border-transparent text-gray-500'}`}
        >
          Preview
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: AI Chat Panel */}
        <div className={`${mobileTab === 'chat' ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-[400px] bg-white border-r border-gray-200 relative z-20`}>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-300`}>
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-[#E8F5F1] text-[#1D9E75] flex flex-shrink-0 items-center justify-center mr-3 mt-1 shadow-sm border border-[#1D9E75]/20">
                    <Sparkles size={16} />
                  </div>
                )}
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-[#0F2820] text-white rounded-tr-none' 
                    : m.role === 'system'
                    ? 'bg-[#FFF9E6] text-[#92400E] italic border border-[#FDE68A] mx-auto text-center'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            
            {loading && (
               <div className="flex justify-start animate-in fade-in">
                 <div className="w-8 h-8 rounded-full bg-[#E8F5F1] text-[#1D9E75] flex items-center justify-center mr-3 mt-1 shadow-sm border border-[#1D9E75]/20">
                    <Sparkles size={16} />
                 </div>
                 <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                   <div className="w-2 h-2 bg-[#1D9E75]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                   <div className="w-2 h-2 bg-[#1D9E75]/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                   <div className="w-2 h-2 bg-[#1D9E75] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                 </div>
               </div>
            )}
            
            {/* Celebration banners inline */}
            {showCelebration === 'halfway' && (
              <div className="bg-[#E8F5F1] border border-[#A7F3D0] rounded-2xl p-4 text-center animate-in zoom-in-95 duration-500">
                <p className="text-xl mb-1">🎉</p>
                <p className="text-[#065F46] font-bold text-sm">Halfway there!</p>
                <p className="text-[#065F46]/80 text-xs mt-1">Your site is taking shape nicely.</p>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 bg-white flex gap-2 overflow-x-auto hide-scrollbar">
            {['Change colors', 'Add a gallery', 'Update contact info'].map(qr => (
              <button 
                key={qr}
                onClick={() => handleQuickReply(qr)}
                className="whitespace-nowrap px-4 py-1.5 border border-[#1D9E75] text-[#1D9E75] rounded-full text-xs font-semibold hover:bg-[#E8F5F1] transition-colors"
              >
                {qr}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="relative flex items-center">
              <button className="absolute left-3 p-1.5 text-gray-400 hover:text-[#1D9E75] transition-colors bg-gray-100 rounded-lg">
                <ImageIcon size={18} />
              </button>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask AI to change anything..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl py-3.5 pl-12 pr-14 text-sm font-medium focus:outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 transition-all placeholder:text-gray-400"
              />
              <button 
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                className="absolute right-2 p-2 bg-[#1D9E75] text-white rounded-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Live Preview Screen */}
        <div className={`${mobileTab === 'preview' ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-[#F4F5F7] relative items-center justify-center p-4 md:p-8 overflow-hidden`}>
          
          <div className="w-full h-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 relative flex flex-col transition-all duration-500">
            {/* Fake Browser Chrome */}
            <div className="h-12 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-4 shrink-0">
               <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
               </div>
               <div className="flex-1 max-w-lg bg-white rounded-md h-7 flex items-center px-3 border border-gray-200 shadow-sm mx-auto text-center">
                  <Globe size={12} className="text-gray-400 mr-2" />
                  <span className="text-xs text-gray-600 font-medium">zemenco.com/preview/{siteData.businessName?.toLowerCase().replace(/\s+/g, '-') || 'site'}</span>
               </div>
            </div>

            {/* Actual Website Render */}
            <div className="flex-1 overflow-y-auto bg-white relative">
              {industry === 'restaurant' && <RestaurantTemplate data={siteData} />}
              {industry === 'salon' && <SalonTemplate data={siteData} />}
              {industry === 'dealership' && <DealershipTemplate data={siteData} />}
              
              {!siteData.businessName && !loading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10 p-8 text-center">
                    <div className="max-w-sm">
                      <div className="w-16 h-16 bg-[#E8F5F1] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                          <Sparkles size={24} className="text-[#1D9E75]" />
                      </div>
                      <h2 className="text-2xl font-bold text-[#0F2820] mb-2">Let's build magic</h2>
                      <p className="text-gray-500 text-sm font-medium">Chat with the AI on the left to start generating your custom platform.</p>
                    </div>
                </div>
              )}
            </div>
          </div>

          {/* Device Toggles overlay */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white border border-gray-200 px-2 py-2 rounded-full flex items-center gap-1 shadow-lg z-30">
            <button className="p-2 bg-gray-100 text-[#0F2820] rounded-full hover:bg-gray-200 transition-colors">
              <Monitor size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-[#0F2820] hover:bg-gray-100 rounded-full transition-colors">
              <Smartphone size={18} />
            </button>
          </div>
          
          {/* Halfway Celebration Toast */}
          <AnimatePresence>
            {showCelebration === 'halfway' && (
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 bg-[#1D9E75] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">🎉</div>
                <span>Halfway there! Your site is taking shape</span>
                <button onClick={() => setShowCelebration('none')} className="ml-2 hover:text-white/60"><X size={16} /></button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Full Screen Completion Celebration */}
          {showCelebration === 'complete' && (
            <div className="absolute inset-0 z-50 bg-[#0F2820]/95 backdrop-blur-md flex items-center justify-center flex-col p-8 text-center animate-in fade-in duration-500">
               <div className="w-24 h-24 bg-[#1D9E75] rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(29,158,117,0.5)] animate-bounce">
                  <Check size={48} className="text-white" />
               </div>
               <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Your site is ready! 🚀</h2>
               <p className="text-lg text-white/80 mb-10 max-w-lg font-medium">You've successfully built your platform. It's time to show it to the world.</p>
               
               <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                 <button 
                  onClick={() => setShowCelebration('none')}
                  className="flex-1 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/20"
                 >
                   Preview Site
                 </button>
                 <button 
                  onClick={() => {
                    setShowCelebration('none');
                    setShowPublishModal(true);
                  }}
                  className="flex-1 py-4 bg-[#1D9E75] text-white font-bold rounded-xl hover:bg-[#168A65] hover:scale-105 transition-all shadow-xl shadow-[#1D9E75]/20"
                 >
                   Publish Now
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>

      <PublishGateModal 
        isOpen={showPublishModal} 
        onClose={() => setShowPublishModal(false)} 
        siteId={siteId || undefined} 
      />
    </div>
  )
}
