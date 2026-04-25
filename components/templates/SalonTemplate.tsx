'use client'

import React from 'react'
import { MapPin, Phone, Clock, Calendar, Instagram } from 'lucide-react'

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

export default function SalonTemplate({ data, lang = 'en' }: { data: SalonData, lang?: string }) {
  return (
    <div className="bg-[#FAF9F6] text-[#1A1A1A] font-sans min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center px-10 md:px-24 overflow-hidden bg-[#1A1A1A]">
        <div className="absolute right-0 top-0 w-full md:w-1/2 h-full opacity-60 md:opacity-100">
          {data.photos?.[0] ? (
            <img src={data.photos[0]} alt="Hero" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#333]" />
          )}
        </div>
        
        <div className="relative z-10 max-w-2xl text-white">
          <span className="text-[#B5780A] font-bold tracking-[0.3em] uppercase text-xs block mb-6">Established Style</span>
          <h1 className="text-7xl md:text-8xl font-light uppercase tracking-tighter mb-8 leading-[0.9]">
            {data.businessName || 'Elite Salon'}
          </h1>
          <p className="text-lg md:text-xl text-white/70 font-light mb-12 max-w-md">
            Mastering the art of {data.specialty || 'natural hair and beauty'} in {data.city || 'your city'}.
          </p>
          <button className="px-12 py-5 bg-white text-[#1A1A1A] font-bold rounded-full uppercase text-xs tracking-widest hover:bg-[#B5780A] hover:text-white transition-all">
            Book Appointment
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-md">
            <h2 className="text-5xl font-light uppercase tracking-tight mb-4">Services</h2>
            <p className="text-gray-500 italic">Curated treatments designed for your unique style.</p>
          </div>
          <div className="h-px flex-1 bg-gray-200 mb-4 hidden md:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-8">
          {data.services?.length > 0 ? data.services.map((item, i) => (
            <div key={i} className="flex justify-between items-baseline group cursor-default">
              <span className="text-lg uppercase tracking-tight group-hover:text-[#B5780A] transition-colors">{item.name}</span>
              <div className="flex-1 border-b border-dotted border-gray-300 mx-4 mb-1" />
              <span className="text-lg font-bold">from ${item.price}</span>
            </div>
          )) : (
            <p className="col-span-2 text-center text-gray-400 italic">No services listed yet.</p>
          )}
        </div>
      </section>

      {/* Stylists Section */}
      <section className="py-32 bg-white px-6">
        <div className="max-w-6xl mx-auto text-center mb-20">
          <h2 className="text-5xl font-light uppercase tracking-tight mb-4">Meet the Team</h2>
          <p className="text-gray-500">The masters behind the magic.</p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {data.stylists?.length > 0 ? data.stylists.map((s, i) => (
            <div key={i} className="text-center group">
              <div className="aspect-[3/4] bg-gray-100 rounded-2xl mb-6 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-300 uppercase font-bold text-xs">Stylist Image</div>
              </div>
              <h3 className="text-xl font-bold uppercase mb-1">{s.name}</h3>
              <p className="text-xs text-[#B5780A] font-bold uppercase tracking-widest">{s.specialty}</p>
            </div>
          )) : (
            <p className="col-span-4 text-center text-gray-400 italic">Add your stylists to show off your team.</p>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-32 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">
        <div className="space-y-12">
          <h2 className="text-5xl font-light uppercase tracking-tight">Location & Hours</h2>
          <div className="grid grid-cols-1 gap-10">
            <div className="flex gap-6">
              <MapPin className="text-[#B5780A]" size={24} />
              <div>
                <p className="font-bold uppercase text-xs tracking-widest mb-2">Find Us</p>
                <p className="text-gray-600 leading-relaxed">{data.address}, {data.city}</p>
              </div>
            </div>
            <div className="flex gap-6">
              <Clock className="text-[#B5780A]" size={24} />
              <div>
                <p className="font-bold uppercase text-xs tracking-widest mb-2">Our Hours</p>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{data.hours || 'Tue-Sat: 9am - 7pm\nSun-Mon: Closed'}</p>
              </div>
            </div>
            <div className="flex gap-6">
              <Calendar className="text-[#B5780A]" size={24} />
              <div>
                <p className="font-bold uppercase text-xs tracking-widest mb-2">Booking</p>
                <p className="text-gray-600 leading-relaxed">Preferred: {data.bookingMethod || 'Online Booking'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="aspect-square bg-gray-200 rounded-[60px] overflow-hidden grayscale">
           <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-sm">
            Map
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h3 className="text-2xl font-light uppercase tracking-[0.2em] mb-8">{data.businessName}</h3>
          <div className="flex justify-center gap-8 mb-12">
            <Instagram size={20} className="hover:text-[#B5780A] cursor-pointer" />
            <Phone size={20} className="hover:text-[#B5780A] cursor-pointer" />
          </div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-loose">
            © {new Date().getFullYear()} {data.businessName} • Digital Excellence by Zemen Co.
          </p>
        </div>
      </footer>
    </div>
  )
}
