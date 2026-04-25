'use client'

import React from 'react'
import { MapPin, Phone, Clock, Globe } from 'lucide-react'

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
    en: { reserve: 'Reserve a Table', menu: 'Our Menu', visit: 'Visit Us' },
    am: { reserve: 'ጠረጴዛ ያስይዙ', menu: 'የምግብ ዝርዝር', visit: 'ይምጡ ይጎብኙን' },
    ti: { reserve: 'ቦታ ትሓዙ', menu: 'ዝርዝር መግቢ', visit: 'በጽሑና' }
  }[lang as keyof typeof t] || t.en

  return (
    <div className="bg-white text-[#0A0F1C] font-sans min-h-screen relative">
      {/* Language Toggle */}
      {data.languages?.length > 1 && (
        <div className="fixed top-24 right-6 z-[100] flex gap-2 bg-white/90 backdrop-blur-md p-1 rounded-full shadow-xl border border-gray-100">
          {data.languages.map(l => (
            <button 
              key={l}
              onClick={() => setLang(l.toLowerCase().includes('amharic') ? 'am' : l.toLowerCase().includes('tigrinya') ? 'ti' : 'en')}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                (lang === 'am' && l.includes('Amharic')) || (lang === 'ti' && l.includes('Tigrinya')) || (lang === 'en' && l.includes('English'))
                ? 'bg-[#B5780A] text-white' : 'text-gray-400 hover:text-black'
              }`}
            >
              {l.includes('Amharic') ? 'አማ' : l.includes('Tigrinya') ? 'ትግ' : 'EN'}
            </button>
          ))}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-center px-6 overflow-hidden">
        {data.photos?.[0] ? (
          <div className="absolute inset-0 z-0">
            <img src={data.photos[0]} alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-[#9B1C1C] z-0" />
        )}
        
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-6">
            {data.businessName || 'Your Restaurant'}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium mb-10 italic">
            "{data.tagline || 'Exquisite dining experience'}"
          </p>
          <button className="px-10 py-4 bg-[#B5780A] text-white font-bold rounded uppercase tracking-widest hover:scale-105 transition-transform">
            Reserve a Table
          </button>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#B5780A] font-bold tracking-[0.2em] uppercase text-sm block mb-4">Discovery</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Our Menu</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {data.menuItems?.length > 0 ? data.menuItems.map((item, i) => (
            <div key={i} className="flex justify-between items-start border-b border-gray-100 pb-6">
              <div className="flex-1 pr-4">
                <h3 className="text-xl font-bold uppercase mb-1">{item.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
              <span className="text-xl font-black text-[#B5780A]">${item.price}</span>
            </div>
          )) : (
            <p className="col-span-2 text-center text-gray-400 italic">No menu items added yet.</p>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      {data.photos?.length > 1 && (
        <section className="py-24 bg-gray-50 overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
            {data.photos.slice(1, 5).map((photo, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-xl">
                <img src={photo} alt={`Gallery ${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Info Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tight mb-8">Visit Us</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="text-[#B5780A] shrink-0" size={24} />
              <div>
                <p className="font-bold uppercase text-sm tracking-widest mb-1">Address</p>
                <p className="text-gray-600">{data.address}, {data.city}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="text-[#B5780A] shrink-0" size={24} />
              <div>
                <p className="font-bold uppercase text-sm tracking-widest mb-1">Opening Hours</p>
                <p className="text-gray-600">{data.hours || 'Mon-Sun: 10am - 10pm'}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="text-[#B5780A] shrink-0" size={24} />
              <div>
                <p className="font-bold uppercase text-sm tracking-widest mb-1">Contact</p>
                <p className="text-gray-600">{data.phone}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[400px] bg-gray-200 rounded-2xl overflow-hidden relative grayscale">
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-sm">
            Interactive Map Placeholder
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0F1C] text-white py-16 px-6 text-center">
        <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">{data.businessName}</h3>
        <p className="text-gray-500 text-sm mb-10 max-w-md mx-auto">
          © {new Date().getFullYear()} {data.businessName}. All rights reserved. Built with Zemen Co.
        </p>
        <div className="flex justify-center gap-6 text-gray-400">
          <Globe size={20} />
          {data.languages?.map(l => (
            <span key={l} className="text-xs font-bold uppercase">{l}</span>
          ))}
        </div>
      </footer>
    </div>
  )
}
