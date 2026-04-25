'use client'

import React from 'react'
import { MapPin, Phone, Clock, Globe, ChevronRight, Instagram, Facebook } from 'lucide-react'

interface RestaurantData {
  businessName: string
  tagline: string
  cuisineType: string
  address: string
  city: string
  phone: string
  hours: string
  menuItems: Array<{ name: string, description: string, price: string }>
  photos: string[]
  bookingMethod: string
  languages: string[]
}

export default function RestaurantTemplate({ data, lang: initialLang = 'en' }: { data: RestaurantData, lang?: string }) {
  const [lang, setLang] = React.useState(initialLang)

  const t = {
    en: { reserve: 'Book a Table', menu: 'Signature Menu', visit: 'Find Us', story: 'Our Story' },
    am: { reserve: 'ጠረጴዛ ያስይዙ', menu: 'የምግብ ዝርዝር', visit: 'ይምጡ ይጎብኙን', story: 'ታሪካችን' },
    ti: { reserve: 'ቦታ ትሓዙ', menu: 'ዝርዝር መግቢ', visit: 'በጽሑና', story: 'ታሪኽና' }
  }[lang as keyof typeof t] || t.en

  return (
    <div className="bg-[#0A0F1C] text-white font-sans min-h-screen selection:bg-[#B5780A] selection:text-white">
      {/* Premium Language Toggle */}
      {data.languages?.length > 1 && (
        <div className="fixed top-24 right-6 z-[100] flex gap-1 bg-white/5 backdrop-blur-xl p-1.5 rounded-full shadow-2xl border border-white/10">
          {data.languages.map(l => (
            <button 
              key={l}
              onClick={() => setLang(l.toLowerCase().includes('amharic') ? 'am' : l.toLowerCase().includes('tigrinya') ? 'ti' : 'en')}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                (lang === 'am' && l.includes('Amharic')) || (lang === 'ti' && l.includes('Tigrinya')) || (lang === 'en' && l.includes('English'))
                ? 'bg-[#B5780A] text-white shadow-lg' : 'text-white/40 hover:text-white'
              }`}
            >
              {l.includes('Amharic') ? 'አማ' : l.includes('Tigrinya') ? 'ትግ' : 'EN'}
            </button>
          ))}
        </div>
      )}

      {/* Hero Section - Cinematic */}
      <section className="relative h-screen flex items-center justify-center text-center px-6 overflow-hidden">
        {data.photos?.[0] ? (
          <div className="absolute inset-0 z-0">
            <img src={data.photos[0]} alt="Hero" className="w-full h-full object-cover scale-105" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1C]/80 via-[#0A0F1C]/40 to-[#0A0F1C]" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0A0F1C] z-0" />
        )}
        
        <div className="relative z-10 max-w-5xl">
          <span className="text-[#B5780A] font-black tracking-[0.4em] uppercase text-xs mb-6 block animate-fade-in">Established 2024</span>
          <h1 className="text-7xl md:text-[10vw] font-black text-white uppercase leading-[0.85] tracking-tighter mb-8 drop-shadow-2xl">
            {data.businessName || 'Your Restaurant'}
          </h1>
          <p className="text-xl md:text-2xl text-white/70 font-light mb-12 max-w-2xl mx-auto italic tracking-wide">
            {data.tagline || 'Redefining the essence of East African culinary excellence.'}
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button className="group relative px-12 py-5 bg-[#B5780A] text-white font-black rounded-full uppercase tracking-widest hover:bg-[#966308] transition-all overflow-hidden">
               <span className="relative z-10">{t.reserve}</span>
               <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            <button className="px-12 py-5 border border-white/20 text-white font-black rounded-full uppercase tracking-widest hover:bg-white hover:text-[#0A0F1C] transition-all">
              {t.menu}
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
           <span className="text-[10px] font-black uppercase tracking-[0.3em]">Scroll</span>
           <div className="w-[1px] h-12 bg-white animate-pulse" />
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
         <div className="relative group">
            <div className="absolute -inset-4 border border-[#B5780A]/20 rounded-2xl group-hover:-inset-6 transition-all duration-500" />
            <img 
              src={data.photos?.[1] || "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80"} 
              className="w-full aspect-[4/5] object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl"
              alt="Atmosphere"
            />
         </div>
         <div>
            <span className="text-[#B5780A] font-black tracking-[0.3em] uppercase text-xs mb-4 block">{t.story}</span>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-tight">Crafting Moments, <br/> One Plate at a Time</h2>
            <p className="text-white/60 text-lg leading-relaxed mb-10">
              In the heart of {data.city || 'the city'}, we bring you a fusion of tradition and modern culinary art. Every ingredient is hand-selected to ensure that {data.businessName} remains the gold standard for {data.cuisineType || 'quality'} dining.
            </p>
            <div className="flex gap-10">
               <div>
                  <div className="text-3xl font-black text-[#B5780A] mb-1">15+</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Signature Spices</div>
               </div>
               <div>
                  <div className="text-3xl font-black text-[#B5780A] mb-1">100%</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Organic Sources</div>
               </div>
            </div>
         </div>
      </section>

      {/* Premium Menu Section */}
      <section className="py-32 px-6 bg-white text-[#0A0F1C] rounded-t-[4rem]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-[#B5780A] font-black tracking-[0.4em] uppercase text-xs block mb-6">Culinary Arts</span>
            <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tighter leading-none">{t.menu}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-16">
            {data.menuItems?.length > 0 ? data.menuItems.map((item, i) => (
              <div key={i} className="group relative flex justify-between items-start border-b border-gray-100 pb-8 hover:border-[#B5780A]/30 transition-colors">
                <div className="flex-1 pr-8">
                  <h3 className="text-2xl font-black uppercase mb-2 group-hover:text-[#B5780A] transition-colors flex items-center gap-2">
                    {item.name}
                    <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed italic">{item.description}</p>
                </div>
                <div className="text-2xl font-black tracking-tighter">${item.price}</div>
              </div>
            )) : (
              <p className="col-span-2 text-center text-gray-300 italic py-20 border-2 border-dashed border-gray-50 rounded-3xl">Our seasonal selections are being prepared...</p>
            )}
          </div>
        </div>
      </section>

      {/* Info & Map - Industrial Minimal */}
      <section className="py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
        <div className="md:col-span-5">
          <h2 className="text-5xl font-black uppercase tracking-tighter mb-12">{t.visit}</h2>
          <div className="space-y-12">
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-[#B5780A] group-hover:bg-[#B5780A] group-hover:text-white transition-all">
                 <MapPin size={20} />
              </div>
              <div>
                <p className="font-black uppercase text-[10px] tracking-[0.3em] text-white/30 mb-2">Location</p>
                <p className="text-xl font-medium">{data.address}, {data.city}</p>
              </div>
            </div>
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-[#B5780A] group-hover:bg-[#B5780A] group-hover:text-white transition-all">
                 <Clock size={20} />
              </div>
              <div>
                <p className="font-black uppercase text-[10px] tracking-[0.3em] text-white/30 mb-2">Service Hours</p>
                <p className="text-xl font-medium">{data.hours || 'Daily: 11:00 AM — 11:00 PM'}</p>
              </div>
            </div>
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-[#B5780A] group-hover:bg-[#B5780A] group-hover:text-white transition-all">
                 <Phone size={20} />
              </div>
              <div>
                <p className="font-black uppercase text-[10px] tracking-[0.3em] text-white/30 mb-2">Concierge</p>
                <p className="text-xl font-medium underline underline-offset-8 decoration-[#B5780A]/40">{data.phone}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-7 h-[600px] bg-white/5 rounded-[3rem] overflow-hidden relative border border-white/10">
          <div className="absolute inset-0 bg-cover bg-center opacity-40 grayscale" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80")' }} />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-[#0A0F1C]/80 backdrop-blur-md px-10 py-6 rounded-2xl border border-white/10 text-center shadow-2xl">
                <div className="w-12 h-12 bg-[#B5780A] rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                   <MapPin className="text-white" size={24} />
                </div>
                <h4 className="font-black uppercase text-sm tracking-widest">{data.businessName}</h4>
                <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">{data.city}</p>
             </div>
          </div>
        </div>
      </section>

      {/* Elite Footer */}
      <footer className="bg-black text-white py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="text-center md:text-left">
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">{data.businessName}</h3>
              <p className="text-white/30 text-xs font-bold uppercase tracking-[0.4em]">Excellence is our Tradition</p>
           </div>
           <div className="flex gap-8">
              <button className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#B5780A] transition-all"><Instagram size={20}/></button>
              <button className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#B5780A] transition-all"><Facebook size={20}/></button>
           </div>
           <div className="text-center md:text-right">
              <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-2 italic">Official Site</p>
              <div className="flex items-center gap-2 justify-center md:justify-end text-[#B5780A]">
                 <Globe size={14} />
                 <span className="text-xs font-black uppercase tracking-[0.2em]">{lang} — {data.cuisineType}</span>
              </div>
           </div>
        </div>
        <div className="mt-24 pt-12 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-[0.5em] text-white/10">
           Designed by Zemen Co. Digital Architecture
        </div>
      </footer>
    </div>
  )
}
