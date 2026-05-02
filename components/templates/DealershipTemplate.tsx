'use client'

import React, { useState } from 'react'
import { MapPin, Phone, Clock, Gauge, Calendar, ShieldCheck, Filter, ChevronRight, Zap, Trophy, CreditCard } from 'lucide-react'

interface Vehicle {
  make: string
  model: string
  year: string
  price: string
  mileage: string
  photo: string
}

interface DealershipData {
  businessName: string
  dealershipType: string
  address: string
  city: string
  phone: string
  hours: string
  inventory: Vehicle[]
  financingOptions: string
  photos: string[]
  languages: string[]
  theme?: {
    primaryColor: string
    backgroundColor: string
  }
}

export default function DealershipTemplate({ data, lang: initialLang = 'en' }: { data: DealershipData, lang?: string }) {
  const [lang, setLang] = useState(initialLang)
  const [filter, setFilter] = useState('')

  const filteredInventory = data.inventory?.filter(v => 
    v.make.toLowerCase().includes(filter.toLowerCase()) || 
    v.model.toLowerCase().includes(filter.toLowerCase())
  ) || []

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  // Dynamic Theme
  const theme = data.theme || { primaryColor: '#FF4D00', backgroundColor: '#050505' }

  return (
    <div 
      className="text-white font-sans min-h-screen selection:bg-[var(--primary)] selection:text-white" 
      dir={dir}
      style={{ 
        backgroundColor: theme.backgroundColor,
        '--primary': theme.primaryColor 
      } as React.CSSProperties}
    >
      <style jsx global>{`
        :root {
          --primary: ${theme.primaryColor};
          --bg: ${theme.backgroundColor};
        }
        .bg-primary { background-color: var(--primary); }
        .text-primary { color: var(--primary); }
        .border-primary { border-color: var(--primary); }
      `}</style>
      {/* Premium Language Toggle */}
      {data.languages?.length > 1 && (
        <div className="fixed top-24 right-6 z-[100] flex gap-1 bg-white/5 backdrop-blur-xl p-1.5 rounded-full shadow-2xl border border-white/10">
          {data.languages.map(l => (
            <button 
              key={l}
              onClick={() => setLang(l.toLowerCase().includes('amharic') ? 'am' : l.toLowerCase().includes('tigrinya') ? 'ti' : l.toLowerCase().includes('arabic') ? 'ar' : 'en')}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                (lang === 'am' && l.includes('Amharic')) || (lang === 'ti' && l.includes('Tigrinya')) || (lang === 'ar' && l.includes('Arabic')) || (lang === 'en' && l.includes('English'))
                ? 'bg-[#FF4D00] text-white shadow-lg' : 'text-white/40 hover:text-white'
              }`}
            >
              {l.includes('Amharic') ? 'አማ' : l.includes('Tigrinya') ? 'ትግ' : l.includes('Arabic') ? 'عرب' : 'EN'}
            </button>
          ))}
        </div>
      )}

      {/* Hero Section - High Performance */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {data.photos?.[0] ? (
          <div className="absolute inset-0">
             <img src={data.photos[0]} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-black" />
        )}
        
        <div className="relative z-10 text-center px-6 max-w-6xl">
          <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in">
             <div className="w-12 h-[2px] bg-[var(--primary)]" />
             <span className="text-[var(--primary)] font-black tracking-[0.5em] uppercase text-[10px]">Precision Engineering</span>
             <div className="w-12 h-[2px] bg-[var(--primary)]" />
          </div>
          <h1 className="text-8xl md:text-[14vw] font-black text-white uppercase italic tracking-tighter mb-6 leading-[0.8] drop-shadow-2xl">
            {data.businessName || 'Elite Motors'}
          </h1>
          <p className="text-xl md:text-3xl font-black uppercase tracking-[0.2em] mb-14 text-white/60 italic">
            {data.dealershipType || 'Premium Performance Vehicles'}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="group relative px-14 py-6 bg-[var(--primary)] text-white font-black rounded-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all">
               Browse Inventory
               <ChevronRight className="inline-block ml-2 group-hover:translate-x-2 transition-transform" size={18} />
            </button>
            <button className="px-14 py-6 border border-white/20 text-white font-black rounded-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all backdrop-blur-md">
              Finance Options
            </button>
          </div>
        </div>

        {/* Speed Stats Overlay */}
        <div className="absolute bottom-20 left-0 right-0 px-10 flex justify-between items-end">
            <div className="hidden md:flex gap-16">
               <div>
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Inventory</p>
                  <p className="text-3xl font-black italic tracking-tighter">150+ UNITS</p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Service</p>
                  <p className="text-3xl font-black italic tracking-tighter">EXPERT CARE</p>
               </div>
            </div>
           <div className="flex flex-col items-center gap-4 opacity-30">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] rotate-90 origin-bottom mb-4">Launch</span>
              <div className="w-[1px] h-20 bg-white" />
           </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 border-y border-white/5 bg-white/5 backdrop-blur-md">
         <div className="max-w-7xl mx-auto px-10 grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="flex items-center gap-4 group">
               <ShieldCheck className="text-[var(--primary)] group-hover:scale-110 transition-transform" size={32} />
               <div>
                  <h4 className="text-sm font-black uppercase tracking-widest">Certified</h4>
                  <p className="text-[10px] text-white/40 uppercase font-bold">150pt Inspection</p>
               </div>
            </div>
            <div className="flex items-center gap-4 group">
               <Trophy className="text-[var(--primary)] group-hover:scale-110 transition-transform" size={32} />
               <div>
                  <h4 className="text-sm font-black uppercase tracking-widest">Premium</h4>
                  <p className="text-[10px] text-white/40 uppercase font-bold">Elite Selections</p>
               </div>
            </div>
            <div className="flex items-center gap-4 group">
               <Zap className="text-[var(--primary)] group-hover:scale-110 transition-transform" size={32} />
               <div>
                  <h4 className="text-sm font-black uppercase tracking-widest">Fast Track</h4>
                  <p className="text-[10px] text-white/40 uppercase font-bold">Same Day Delivery</p>
               </div>
            </div>
            <div className="flex items-center gap-4 group">
               <CreditCard className="text-[var(--primary)] group-hover:scale-110 transition-transform" size={32} />
               <div>
                  <h4 className="text-sm font-black uppercase tracking-widest">Finance</h4>
                  <p className="text-[10px] text-white/40 uppercase font-bold">Flexible Rates</p>
               </div>
            </div>
         </div>
      </section>

      {/* Inventory Section - Aggressive Grid */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12">
          <div>
            <span className="text-[var(--primary)] font-black tracking-[0.4em] uppercase text-[10px] block mb-6">Live Inventory</span>
            <h2 className="text-7xl font-black uppercase tracking-tighter italic leading-none">The Machine <br/> Collection</h2>
          </div>
          <div className="relative w-full lg:w-[400px] group">
            <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[var(--primary)] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Filter by Make, Model, or Year..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-16 pr-6 py-6 bg-white/5 border border-white/10 rounded-sm font-black uppercase text-xs tracking-widest focus:border-[var(--primary)] outline-none transition-all placeholder:text-white/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredInventory.length > 0 ? filteredInventory.map((v, i) => (
            <div key={i} className="group relative bg-[#0F0F0F] border border-white/5 overflow-hidden transition-all hover:border-[var(--primary)]/50 shadow-2xl">
              <div className="aspect-[16/10] bg-[#1a1a1a] relative overflow-hidden">
                {v.photo ? (
                   <img src={v.photo} alt={v.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10 font-black uppercase text-[10px] tracking-widest">Visual Data Unavailable</div>
                )}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                   <span className="bg-[var(--primary)] text-white px-3 py-1 text-[10px] font-black uppercase italic tracking-widest self-start">
                     {v.year}
                   </span>
                </div>
                {/* Spec Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                   <div className="flex-1 bg-black/80 backdrop-blur-md p-3 rounded-sm border border-white/10 text-center">
                      <p className="text-[8px] text-white/40 uppercase font-black tracking-widest mb-1">Mileage</p>
                      <p className="text-xs font-black italic">{v.mileage}mi</p>
                   </div>
                   <div className="flex-1 bg-black/80 backdrop-blur-md p-3 rounded-sm border border-white/10 text-center">
                      <p className="text-[8px] text-white/40 uppercase font-black tracking-widest mb-1">Status</p>
                      <p className="text-xs font-black italic text-[var(--primary)]">CERTIFIED</p>
                   </div>
                </div>
              </div>
              <div className="p-10">
                <h3 className="text-3xl font-black uppercase mb-2 tracking-tighter italic group-hover:text-[var(--primary)] transition-colors">{v.make} {v.model}</h3>
                <div className="flex items-center gap-6 text-white/40 text-[10px] mb-8 font-black uppercase tracking-[0.2em]">
                  <span className="flex items-center gap-2"><Gauge size={14} className="text-[var(--primary)]" /> Performance Grade A+</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-8">
                  <div>
                     <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Reserved Value</p>
                     <span className="text-4xl font-black tracking-tighter italic text-white">${v.price}</span>
                  </div>
                  <button className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-[var(--primary)] transition-all group-hover:scale-110">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-32 text-center border border-white/5 rounded-xl bg-white/5 backdrop-blur-sm">
               <p className="text-white/20 font-black uppercase tracking-[0.5em] text-xs">Awaiting Inventory Transmission...</p>
            </div>
          )}
        </div>
      </section>

      {/* Inquiry & Concierge - Tactical Design */}
      <section className="py-40 bg-[#0A0A0A] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-32">
          <div>
            <span className="text-[var(--primary)] font-black tracking-[0.4em] uppercase text-[10px] block mb-6">Direct Channel</span>
            <h2 className="text-6xl font-black uppercase tracking-tighter italic mb-10 leading-tight">Secure Your <br/> Machine</h2>
            <p className="text-white/40 mb-16 leading-relaxed max-w-md text-lg italic font-light">
              Our specialists are ready to finalize your acquisition. Every vehicle in our fleet represents the pinnacle of its class.
            </p>
            <div className="space-y-4">
              <input type="text" placeholder="Full Identification" className="w-full p-6 bg-white/5 border border-white/10 rounded-sm font-black uppercase text-[10px] tracking-widest focus:border-[var(--primary)] outline-none transition-all" />
              <div className="grid grid-cols-2 gap-4">
                 <input type="email" placeholder="Communication Port (Email)" className="p-6 bg-white/5 border border-white/10 rounded-sm font-black uppercase text-[10px] tracking-widest focus:border-[var(--primary)] outline-none transition-all" />
                 <input type="text" placeholder="Phone Link" className="p-6 bg-white/5 border border-white/10 rounded-sm font-black uppercase text-[10px] tracking-widest focus:border-[var(--primary)] outline-none transition-all" />
              </div>
              <select className="w-full p-6 bg-white/5 border border-white/10 rounded-sm font-black uppercase text-[10px] tracking-widest focus:border-[var(--primary)] outline-none transition-all text-white/30">
                <option>Select Mission Profile</option>
                <option>Performance Financing</option>
                <option>Fleet Acquisition</option>
                <option>Technical Inquiry</option>
              </select>
              <button className="w-full py-8 bg-[var(--primary)] text-white font-black uppercase tracking-[0.3em] rounded-sm hover:bg-white hover:text-black transition-all shadow-2xl">
                Initialize Transmission
              </button>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="flex-1 space-y-16">
               <h2 className="text-6xl font-black uppercase tracking-tighter italic leading-tight">Tactical Hub</h2>
               <div className="grid grid-cols-1 gap-12">
                  <div className="flex gap-8 group">
                     <div className="w-16 h-16 bg-white/5 flex items-center justify-center text-[var(--primary)] border border-white/10 transition-all group-hover:bg-[var(--primary)] group-hover:text-white">
                        <MapPin size={24} />
                     </div>
                     <div>
                        <p className="font-black uppercase text-[10px] tracking-widest text-white/30 mb-2">Operational Base</p>
                        <p className="text-2xl font-black italic tracking-tight">{data.address}, {data.city}</p>
                     </div>
                  </div>
                  <div className="flex gap-8 group">
                     <div className="w-16 h-16 bg-white/5 flex items-center justify-center text-[var(--primary)] border border-white/10 transition-all group-hover:bg-[var(--primary)] group-hover:text-white">
                        <Clock size={24} />
                     </div>
                     <div>
                        <p className="font-black uppercase text-[10px] tracking-widest text-white/30 mb-2">Window of Operation</p>
                        <p className="text-2xl font-black italic tracking-tight whitespace-pre-line">{data.hours || 'MON — SAT: 08:00 - 20:00'}</p>
                     </div>
                  </div>
                  <div className="flex gap-8 group">
                     <div className="w-16 h-16 bg-white/5 flex items-center justify-center text-[var(--primary)] border border-white/10 transition-all group-hover:bg-[var(--primary)] group-hover:text-white">
                        <Phone size={24} />
                     </div>
                     <div>
                        <p className="font-black uppercase text-[10px] tracking-widest text-white/30 mb-2">Encrypted Comms</p>
                        <p className="text-2xl font-black italic tracking-tight underline underline-offset-8 decoration-[var(--primary)]">{data.phone}</p>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="flex-1 h-[500px] bg-white/5 rounded-sm overflow-hidden relative border border-white/10 shadow-2xl">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: 0, filter: 'grayscale(1) contrast(1.2) invert(0.9) brightness(0.8)' }} 
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${encodeURIComponent(`${data.address}, ${data.city}`)}`} 
                allowFullScreen
              />
              {/* Fallback if no key */}
              {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-12 text-center">
                  <div>
                    <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <MapPin size={32} className="text-white" />
                    </div>
                    <h4 className="text-3xl font-black uppercase italic mb-2 tracking-tighter">{data.businessName}</h4>
                    <p className="text-white/40 uppercase text-[10px] font-black tracking-[0.3em]">{data.address}, {data.city}</p>
                    <div className="mt-8 px-8 py-3 border-2 border-[var(--primary)] text-[var(--primary)] text-[10px] font-black uppercase tracking-[0.4em]">Tactical Map Grid Online</div>
                  </div>
                </div>
              )}
            </div>
          </div>
            <div className="mt-20 p-8 border border-white/5 bg-white/5 rounded-xl">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Systems Online</span>
               </div>
               <p className="text-[10px] text-white/30 uppercase leading-loose font-bold tracking-widest">
                  Real-time stock monitoring active. Financing algorithms updated for current market performance.
               </p>
            </div>
          </div>
      </section>

      {/* Industrial Footer */}
      <footer className="bg-black text-white py-32 px-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-20">
          <div className="text-center md:text-left">
             <h3 className="text-5xl font-black italic tracking-tighter uppercase mb-4">{data.businessName}</h3>
             <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">High Performance Automotive Group</p>
          </div>
          <div className="flex gap-4">
             {data.languages?.map(l => (
              <span key={l} className="text-[10px] font-black uppercase border border-white/10 px-4 py-2 hover:border-[var(--primary)] transition-colors cursor-default">{l}</span>
            ))}
          </div>
          <div className="text-center md:text-right">
             <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">Transmission End</p>
             <p className="text-[10px] text-white/60 uppercase font-black tracking-widest">
               © {new Date().getFullYear()} {data.businessName} • Built by Zemen Co. Tactical Digital
             </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
