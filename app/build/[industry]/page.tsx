'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Loader2, Camera, Check, Globe, Layout, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

// Import templates
import RestaurantTemplate from '@/components/templates/RestaurantTemplate'
import SalonTemplate from '@/components/templates/SalonTemplate'
import DealershipTemplate from '@/components/templates/DealershipTemplate'

type Industry = 'restaurant' | 'salon' | 'dealership'

const QUESTIONS: Record<Industry, any[]> = {
  restaurant: [
    { id: 'businessName', question: "What is the name of your restaurant?", type: 'text' },
    { id: 'tagline', question: "What's the tagline or vibe? (e.g. Authentic Ethiopian Flavors)", type: 'text' },
    { id: 'cuisineType', question: "What type of cuisine do you serve?", type: 'choice', choices: ['Ethiopian', 'Eritrean', 'East African Fusion', 'Other'] },
    { id: 'city', question: "Which city and neighborhood are you in?", type: 'text' },
    { id: 'address', question: "What is your full street address?", type: 'text' },
    { id: 'phone', question: "What's your phone number?", type: 'text' },
    { id: 'hours', question: "What are your opening hours?", type: 'text' },
    { id: 'menuItems', question: "Tell me about your menu. Give me at least 3 items (Name, Description, Price).", type: 'text' }, // Simple for now, can be improved
    { id: 'photos', question: "Let's add some photos! Upload your hero image (front or main dish).", type: 'image' },
    { id: 'bookingMethod', question: "How should customers book a table?", type: 'choice', choices: ['Phone call', 'Walk-in only', 'Online form'] },
    { id: 'languages', question: "Which languages should your site support?", type: 'choice', choices: ['English only', 'English + Amharic', 'English + Arabic', 'All languages'], multiple: true },
  ],
  salon: [
    { id: 'businessName', question: "What is the name of your salon?", type: 'text' },
    { id: 'specialty', question: "What's your specialty?", type: 'choice', choices: ['Natural hair', 'Braiding', 'Locs', 'Full service', 'Other'] },
    { id: 'city', question: "Which city and neighborhood are you in?", type: 'text' },
    { id: 'address', question: "What is your full street address?", type: 'text' },
    { id: 'phone', question: "What's your phone number?", type: 'text' },
    { id: 'hours', question: "What are your opening hours?", type: 'text' },
    { id: 'services', question: "List some of your services and prices.", type: 'text' },
    { id: 'stylists', question: "Who are your top stylists?", type: 'text' },
    { id: 'photos', question: "Upload a photo of your salon or a top style.", type: 'image' },
    { id: 'bookingMethod', question: "How do you take bookings?", type: 'choice', choices: ['Phone call', 'Booksy', 'Square Appointments', 'Online form'] },
    { id: 'languages', question: "Which languages do you need?", type: 'choice', choices: ['English only', 'English + Amharic', 'All languages'], multiple: true },
  ],
  dealership: [
    { id: 'businessName', question: "What is the name of your dealership?", type: 'text' },
    { id: 'dealershipType', question: "What kind of cars do you sell?", type: 'choice', choices: ['New cars', 'Used cars', 'Both', 'Specialty/Luxury'] },
    { id: 'city', question: "Which city and neighborhood are you in?", type: 'text' },
    { id: 'address', question: "What is your full street address?", type: 'text' },
    { id: 'phone', question: "What's your phone number?", type: 'text' },
    { id: 'hours', question: "What are your opening hours?", type: 'text' },
    { id: 'inventory', question: "List some of your current inventory (Make, Model, Year, Price).", type: 'text' },
    { id: 'financingOptions', question: "Do you offer financing?", type: 'choice', choices: ['Yes', 'No', 'Third party'] },
    { id: 'photos', question: "Upload a photo of your showroom or a lead car.", type: 'image' },
    { id: 'languages', question: "Languages for your site?", type: 'choice', choices: ['English only', 'English + Amharic', 'All languages'], multiple: true },
  ]
}

export default function IndustryBuilder({ params }: { params: { industry: string } }) {
  const industry = params.industry as Industry
  const router = useRouter()
  
  const [step, setStep] = useState(0)
  const [messages, setMessages] = useState<{role: 'assistant' | 'user', content: string}[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  
  const [siteData, setSiteData] = useState<any>({
    templateType: industry,
    businessName: '',
    tagline: '',
    cuisineType: '',
    address: '',
    city: '',
    phone: '',
    hours: '',
    menuItems: [],
    services: [],
    stylists: [],
    inventory: [],
    photos: [],
    bookingMethod: '',
    languages: ['English'],
    published: false
  })

  const chatEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Start the conversation
    const firstQuestion = QUESTIONS[industry][0].question
    setMessages([{ role: 'assistant', content: `Welcome! I'm your Zemen AI builder. Let's create your ${industry} website together. \n\n${firstQuestion}` }])
  }, [industry])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleNextStep = async (answer: string) => {
    const currentQuestion = QUESTIONS[industry][step]
    
    // Update site data based on current question ID
    let updatedData = { ...siteData }
    const fieldId = currentQuestion.id

    if (fieldId === 'menuItems') {
      updatedData.menuItems = [{ name: 'Signature Dish', description: answer, price: '15' }]
    } else if (fieldId === 'services') {
      updatedData.services = [{ name: 'Premium Service', price: '50' }]
    } else if (fieldId === 'inventory') {
      updatedData.inventory = [{ make: 'Sample', model: 'Vehicle', year: '2024', price: '25000', mileage: '0', photo: '' }]
    } else {
      updatedData[fieldId] = answer
    }

    setSiteData(updatedData)

    // Move to next question or finish
    if (step < QUESTIONS[industry].length - 1) {
      const nextStep = step + 1
      setStep(nextStep)
      const nextQuestion = QUESTIONS[industry][nextStep]
      setMessages(prev => [...prev, { role: 'user', content: answer }, { role: 'assistant', content: nextQuestion.question }])
    } else {
      setMessages(prev => [...prev, { role: 'user', content: answer }, { role: 'assistant', content: "Great! Your site is ready for preview. You can click 'Publish' to go live!" }])
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/site/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.url) {
        setSiteData(prev => ({ ...prev, photos: [...prev.photos, data.url] }))
        handleNextStep("Image uploaded successfully!")
      }
    } catch (err) {
      console.error('Upload failed', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      const res = await fetch('/api/site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...siteData,
          published: true
        })
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

  const currentQ = QUESTIONS[industry][step]

  return (
    <div className="flex h-screen bg-[#0A0F1C] overflow-hidden pt-[90px]">
      {/* LEFT: Chat Builder */}
      <div className="w-[400px] flex-shrink-0 flex flex-col bg-[#0A0F1C] border-r border-white/5">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-white/50 hover:text-white">
              <ChevronLeft size={20} />
            </Link>
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#B5780A]">AI Builder</h2>
          </div>
          <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-white/40 uppercase font-bold tracking-widest">
            {step + 1} / {QUESTIONS[industry].length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' ? 'bg-[#9B1C1C] text-white rounded-tr-none' : 'bg-white/5 text-white/90 border border-white/5 rounded-tl-none'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/5 p-4 rounded-2xl animate-pulse">
                <Loader2 size={16} className="animate-spin text-[#B5780A]" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-6 bg-[#0A0F1C] border-t border-white/5">
          {/* Quick Replies / Choices */}
          {currentQ.type === 'choice' && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {currentQ.choices.map((choice: string) => (
                <button
                  key={choice}
                  onClick={() => handleNextStep(choice)}
                  className="p-3 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider text-white hover:bg-[#B5780A] hover:border-[#B5780A] transition-all"
                >
                  {choice}
                </button>
              ))}
            </div>
          )}

          {/* Image Upload Trigger */}
          {currentQ.type === 'image' && (
            <div className="mb-4">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-4 bg-white/10 border-2 border-dashed border-white/20 rounded-xl text-white flex flex-col items-center gap-2 hover:border-[#B5780A] hover:text-[#B5780A] transition-all"
              >
                <Camera size={24} />
                <span className="text-xs font-bold uppercase tracking-widest">Click to Upload Image</span>
              </button>
            </div>
          )}

          {/* Text Input */}
          {currentQ.type === 'text' && (
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNextStep(input)}
                placeholder="Type your response..."
                className="w-full pl-4 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-[#B5780A] transition-all"
              />
              <button 
                onClick={() => handleNextStep(input)}
                className="absolute right-2 p-2 bg-[#B5780A] text-white rounded-lg hover:scale-105 transition-transform"
              >
                <Send size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Live Preview Screen */}
      <div className="flex-1 flex flex-col bg-black">
        <div className="p-4 bg-white/5 flex justify-between items-center px-8 border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
             </div>
             <div className="bg-white/10 px-4 py-1.5 rounded-full text-[10px] text-white/50 font-mono tracking-tighter">
                zemenco-platform-hxg7.vercel.app/site/{siteData.businessName?.toLowerCase().replace(/\s+/g, '-') || 'preview'}
             </div>
          </div>
          <button 
            onClick={handlePublish}
            disabled={isPublishing || step < QUESTIONS[industry].length - 1}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1F6B3A] text-white text-[11px] font-black uppercase tracking-widest rounded-lg hover:bg-[#2e9e56] disabled:opacity-30 disabled:grayscale transition-all"
          >
            {isPublishing ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
            {isPublishing ? 'Publishing...' : 'Publish Site'}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-white m-4 rounded-xl shadow-2xl relative">
          {industry === 'restaurant' && <RestaurantTemplate data={siteData} />}
          {industry === 'salon' && <SalonTemplate data={siteData} />}
          {industry === 'dealership' && <DealershipTemplate data={siteData} />}
          
          {/* Overlay if not started */}
          {step === 0 && !siteData.businessName && (
            <div className="absolute inset-0 bg-white flex flex-col items-center justify-center text-center p-20">
               <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 animate-bounce">
                  <Layout size={40} className="text-gray-300" />
               </div>
               <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-300">Live Preview Container</h3>
               <p className="text-gray-400 mt-2 max-w-xs uppercase text-[10px] font-bold tracking-[0.2em]">Start chatting to see your site come to life here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
