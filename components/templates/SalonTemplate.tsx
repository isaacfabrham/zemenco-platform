'use client'

import React from 'react'
import Image from 'next/image'
import { MapPin, Phone, Clock, Calendar, Instagram, ArrowRight, Star } from 'lucide-react'

interface SalonData {
  businessName: string
  specialty: string
  address: string
  city: string
  phone: string
  hours: string
  services: Array<{ name: string, price: string }>
  stylists: Array<{ name: string, specialty: string }>
  photos: string[]
  bookingMethod: string
  languages: string[]
}

export default function SalonTemplate({ data, lang: initialLang = 'en' }: { data: SalonData, lang?: string }) {
  const [lang, setLang] = React.useState(initialLang)
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] font-sans min-h-screen selection:bg-[#B5780A] selection:text-white" dir={dir}>
      {/* Premium Language Toggle */}
      {data.languages?.length > 1 && (
        <div className="fixed top-24 right-6 z-[100] flex gap-1 bg-white/5 backdrop-blur-xl p-1.5 rounded-full shadow-2xl border border-white/10">
          {data.languages.map(l => (
            <button 
              key={l}
              onClick={() => setLang(l.toLowerCase().includes('amharic') ? 'am' : l.toLowerCase().includes('tigrinya') ? 'ti' : l.toLowerCase().includes('arabic') ? 'ar' : 'en')}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                (lang === 'am' && l.includes('Amharic')) || (lang === 'ti' && l.includes('Tigrinya')) || (lang === 'ar' && l.includes('Arabic')) || (lang === 'en' && l.includes('English'))
                ? 'bg-[#B5780A] text-white shadow-lg' : 'text-gray-400 hover:text-[#1A1A1A]'
              }`}
            >
              {l.includes('Amharic') ? 'አማ' : l.includes('Tigrinya') ? 'ትግ' : l.includes('Arabic') ? 'عرب' : 'EN'}
            </button>
          ))}
        </div>
      )}

      {/* Dynamic Header Overlay */}
      <div className="absolute top-0 w-full h-[120px] bg-gradient-to-b from-[#1A1A1A]/20 to-transparent z-20 pointer-events-none" />

      {/* Hero Section - High Fashion Minimalist */}
      <section className="relative h-screen flex items-center overflow-hidden bg-[#0F0F0F]">
        <div className="absolute inset-0 z-0">
          {data.photos?.[0] ? (
            <Image 
              src={data.photos[0]} 
              alt="Hero" 
              fill
              className="object-cover opacity-70 scale-105" 
              priority
            />
          ) : (
            <div className="w-full h-full bg-[#1a1a1a]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F] via-[#0F0F0F]/40 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-10 md:px-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8 animate-fade-in">
               <div className="w-8 h-px bg-[#B5780A]" />
               <span className="text-[#B5780A] font-black tracking-[0.4em] uppercase text-[10px]">The Art of Beauty</span>
            </div>
            <h1 className="text-8xl md:text-[12vw] font-light uppercase tracking-tighter mb-10 leading-[0.8] text-white">
              {data.businessName || 'Elite Salon'}
            </h1>
            <p className="text-xl md:text-2xl text-white/60 font-light mb-16 max-w-md leading-relaxed">
              Elevating the standard of {data.specialty || 'natural hair and beauty'} in the heart of {data.city || 'your city'}.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="px-12 py-5 bg-white text-[#1A1A1A] font-black rounded-full uppercase text-[10px] tracking-[0.3em] hover:bg-[#B5780A] hover:text-white transition-all shadow-xl">
                Book Consultation
              </button>
              <button className="px-12 py-5 border border-white/20 text-white font-black rounded-full uppercase text-[10px] tracking-[0.3em] hover:bg-white/10 transition-all backdrop-blur-sm">
                Explore Services
              </button>
            </div>
          </div>
        </div>
        
        {/* Vertical Branding */}
        <div className="absolute right-10 bottom-24 hidden lg:block">
           <p className="rotate-90 origin-right text-white/20 font-black uppercase tracking-[1em] text-[10px]">Excellence • Artistry • Luxury</p>
        </div>
      </section>

      {/* Services Section - Boutique Gallery */}
      <section className="py-40 px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          <div className="lg:col-span-4 sticky top-40">
            <span className="text-[#B5780A] font-black tracking-[0.4em] uppercase text-[10px] block mb-6">Our Craft</span>
            <h2 className="text-6xl font-light uppercase tracking-tighter mb-8 leading-tight">Tailored <br/>Treatments</h2>
            <p className="text-gray-600 text-lg leading-relaxed italic mb-12">
              Every appointment is a bespoke journey. We combine heritage techniques with modern science to reveal your most radiant self.
            </p>
            <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-soft">
               <div className="flex items-center gap-4 mb-4">
                  <Star className="text-[#B5780A] fill-[#B5780A]" size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Client Favorite</span>
               </div>
               <h4 className="text-xl font-bold uppercase mb-2">Signature Revive</h4>
               <p className="text-gray-600 text-xs mb-6 uppercase tracking-widest">Full Treatment • 120 Mins</p>
               <button className="w-full py-4 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-all">Book Now</button>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-12">
            {data.services?.length > 0 ? data.services.map((item, i) => (
              <div key={i} className="group flex justify-between items-center py-10 border-b border-gray-100 hover:border-[#B5780A] transition-all cursor-pointer">
                <div className="flex-1">
                  <span className="text-[#B5780A] text-[10px] font-black uppercase tracking-[0.2em] mb-2 block opacity-0 group-hover:opacity-100 transition-opacity">Premium Service</span>
                  <h3 className="text-3xl font-light uppercase tracking-tight group-hover:pl-4 transition-all duration-500">{item.name}</h3>
                </div>
                <div className="flex items-center gap-8">
                   <span className="text-2xl font-bold tracking-tighter">From ${item.price}</span>
                   <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-white transition-all">
                      <ArrowRight size={18} />
                   </div>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[40px]">
                 <p className="text-gray-300 uppercase font-black text-xs tracking-widest">Compiling Boutique Selections...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Team Section - Editorial Layout */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-10">
          <div className="text-center mb-24">
            <h2 className="text-7xl font-light uppercase tracking-tighter mb-6">The Collective</h2>
            <p className="text-[#B5780A] font-black uppercase tracking-[0.5em] text-[10px]">Master Artisans of Beauty</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {data.stylists?.length > 0 ? data.stylists.map((s, i) => (
              <div key={i} className="group text-center">
                <div className="relative aspect-[4/5] bg-gray-50 rounded-[60px] mb-8 overflow-hidden transition-all duration-700 group-hover:rounded-[20px] shadow-soft">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-200 uppercase font-black text-[10px] tracking-widest">Editorial Image</div>
                  {/* Image Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <h3 className="text-2xl font-light uppercase tracking-tight mb-2">{s.name}</h3>
                <p className="text-[10px] text-[#B5780A] font-black uppercase tracking-[0.3em]">{s.specialty}</p>
              </div>
            )) : (
              <p className="col-span-4 text-center text-gray-300 italic uppercase text-[10px] font-black tracking-widest">Our masters are being curated...</p>
            )}
          </div>
        </div>
      </section>

      {/* Concierge & Map */}
      <section className="py-40 px-10 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="bg-[#1A1A1A] p-16 rounded-[60px] text-white flex flex-col justify-between">
               <div>
                  <h2 className="text-5xl font-light uppercase tracking-tighter mb-12">Concierge</h2>
                  <div className="space-y-10">
                     <div className="flex gap-8">
                        <MapPin className="text-[#B5780A]" size={24} />
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Location</p>
                           <p className="text-xl font-light">{data.address}, {data.city}</p>
                        </div>
                     </div>
                     <div className="flex gap-8">
                        <Clock className="text-[#B5780A]" size={24} />
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Availability</p>
                           <p className="text-xl font-light leading-relaxed">{data.hours || 'Tue — Sat: 10:00 - 19:00'}</p>
                        </div>
                     </div>
                     <div className="flex gap-8">
                        <Phone className="text-[#B5780A]" size={24} />
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Direct Line</p>
                           <p className="text-xl font-light underline underline-offset-8 decoration-[#B5780A]">{data.phone}</p>
                        </div>
                     </div>
                  </div>
               </div>
               <button className="mt-20 w-full py-6 bg-white text-[#1A1A1A] font-black rounded-full uppercase text-[10px] tracking-[0.4em] hover:bg-[#B5780A] hover:text-white transition-all">
                  Request Reservation
               </button>
            </div>
            <div className="relative aspect-square lg:aspect-auto h-full min-h-[500px] bg-white rounded-[60px] overflow-hidden border border-gray-100 shadow-hover">
               <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: 0, filter: 'grayscale(1) contrast(1.1) brightness(1.1)' }} 
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${encodeURIComponent(`${data.address}, ${data.city}`)}`} 
                allowFullScreen
              />
              {/* Fallback if no key */}
              {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center p-12 text-center">
                  <div>
                    <div className="w-16 h-16 bg-[#B5780A] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <MapPin size={32} className="text-white" />
                    </div>
                    <h4 className="text-2xl font-light uppercase tracking-tighter mb-2">{data.businessName}</h4>
                    <p className="text-gray-400 uppercase text-[10px] font-black tracking-widest">{data.address}, {data.city}</p>
                    <div className="mt-8 px-8 py-3 bg-[#1A1A1A] text-white text-[10px] font-black uppercase tracking-widest rounded-full">Interactive Map in Production</div>
                  </div>
                </div>
              )}
            </div>
         </div>
      </section>

      {/* Elite Footer */}
      <footer className="py-40 px-10 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="text-center md:text-left">
            <h3 className="text-4xl font-light uppercase tracking-[0.2em] mb-4">{data.businessName}</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">Boutique Hair & Beauty Collective</p>
          </div>
          <div className="flex gap-12">
            <button className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center hover:bg-[#B5780A] hover:text-white transition-all"><Instagram size={18} /></button>
            <button className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center hover:bg-[#B5780A] hover:text-white transition-all"><Calendar size={18} /></button>
          </div>
          <div className="text-center md:text-right">
             <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">Legal</p>
             <p className="text-[10px] text-gray-500 uppercase tracking-widest">© {new Date().getFullYear()} {data.businessName} • Digital by Zemen Co.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
