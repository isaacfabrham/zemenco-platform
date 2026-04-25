'use client'

import React, { useState } from 'react'
import { MapPin, Phone, Clock, Gauge, Calendar, ShieldCheck, Filter } from 'lucide-react'

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
}

export default function DealershipTemplate({ data, lang = 'en' }: { data: DealershipData, lang?: string }) {
  const [filter, setFilter] = useState('')

  const filteredInventory = data.inventory?.filter(v => 
    v.make.toLowerCase().includes(filter.toLowerCase()) || 
    v.model.toLowerCase().includes(filter.toLowerCase())
  ) || []

  return (
    <div className="bg-white text-[#0A0F1C] font-sans min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-black flex items-center justify-center overflow-hidden">
        {data.photos?.[0] ? (
          <img src={data.photos[0]} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
        )}
        <div className="relative z-10 text-center px-6">
          <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-4 italic">
            {data.businessName || 'Elite Motors'}
          </h1>
          <p className="text-xl md:text-2xl text-white font-bold uppercase tracking-widest mb-10 text-[#B5780A]">
            {data.dealershipType || 'Premium Pre-Owned Vehicles'}
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="px-10 py-4 bg-[#B5780A] text-white font-bold rounded uppercase hover:bg-white hover:text-black transition-all">
              Browse Inventory
            </button>
            <button className="px-10 py-4 border-2 border-white text-white font-bold rounded uppercase hover:bg-white hover:text-black transition-all">
              Get Financing
            </button>
          </div>
        </div>
      </section>

      {/* Inventory Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tight italic">Our Inventory</h2>
            <p className="text-gray-500 uppercase text-xs font-bold tracking-widest mt-2">Quality inspected vehicles</p>
          </div>
          <div className="relative w-full md:w-80">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Make or Model..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-100 border-none rounded-lg focus:ring-2 focus:ring-[#B5780A] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredInventory.length > 0 ? filteredInventory.map((v, i) => (
            <div key={i} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                {v.photo ? (
                   <img src={v.photo} alt={v.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase text-xs">Vehicle Photo</div>
                )}
                <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 text-sm font-black italic rounded">
                  {v.year}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-black uppercase mb-1 tracking-tight">{v.make} {v.model}</h3>
                <div className="flex items-center gap-4 text-gray-500 text-sm mb-6 font-bold uppercase tracking-tighter">
                  <span className="flex items-center gap-1"><Gauge size={14} /> {v.mileage} miles</span>
                  <span className="flex items-center gap-1"><ShieldCheck size={14} /> Certified</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-6">
                  <span className="text-3xl font-black text-[#B5780A]">${v.price}</span>
                  <button className="px-5 py-2.5 bg-black text-white text-xs font-bold uppercase rounded hover:bg-[#B5780A] transition-colors">
                    Inquire
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <p className="col-span-full text-center py-20 text-gray-400 italic">No vehicles found matching your search.</p>
          )}
        </div>
      </section>

      {/* Financing & Booking Forms */}
      <section className="py-24 bg-gray-900 text-white px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tight italic mb-8 text-[#B5780A]">Quick Inquiry</h2>
            <p className="text-gray-400 mb-12 leading-relaxed max-w-md">
              Interested in a vehicle or need financing? Fill out the form and our team will get back to you within 24 hours.
            </p>
            <div className="space-y-6">
              <input type="text" placeholder="Full Name" className="w-full p-4 bg-white/5 border border-white/10 rounded focus:border-[#B5780A] outline-none" />
              <input type="email" placeholder="Email Address" className="w-full p-4 bg-white/5 border border-white/10 rounded focus:border-[#B5780A] outline-none" />
              <select className="w-full p-4 bg-white/5 border border-white/10 rounded focus:border-[#B5780A] outline-none text-gray-400">
                <option>Interested In...</option>
                <option>Financing Options</option>
                <option>Test Drive Booking</option>
                <option>General Inquiry</option>
              </select>
              <button className="w-full py-5 bg-[#B5780A] text-white font-bold uppercase tracking-widest rounded hover:bg-white hover:text-black transition-all">
                Submit Request
              </button>
            </div>
          </div>
          <div className="space-y-12">
            <h2 className="text-4xl font-black uppercase tracking-tight italic mb-8">Visit Showroom</h2>
            <div className="grid grid-cols-1 gap-10">
              <div className="flex gap-6">
                <MapPin className="text-[#B5780A]" size={24} />
                <div>
                  <p className="font-bold uppercase text-xs tracking-widest mb-2">Location</p>
                  <p className="text-gray-400">{data.address}, {data.city}</p>
                </div>
              </div>
              <div className="flex gap-6">
                <Clock className="text-[#B5780A]" size={24} />
                <div>
                  <p className="font-bold uppercase text-xs tracking-widest mb-2">Hours</p>
                  <p className="text-gray-400 whitespace-pre-line">{data.hours || 'Mon-Sat: 9am - 8pm\nSun: 11am - 5pm'}</p>
                </div>
              </div>
              <div className="flex gap-6">
                <Phone className="text-[#B5780A]" size={24} />
                <div>
                  <p className="font-bold uppercase text-xs tracking-widest mb-2">Call Us</p>
                  <p className="text-gray-400">{data.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <h3 className="text-3xl font-black italic tracking-tighter uppercase">{data.businessName}</h3>
          <p className="text-xs text-gray-600 uppercase tracking-widest">
            © {new Date().getFullYear()} {data.businessName} • Digital Architecture by Zemen Co.
          </p>
          <div className="flex gap-6 text-gray-400">
             {data.languages?.map(l => (
              <span key={l} className="text-[10px] font-bold uppercase border border-white/20 px-2 py-1 rounded">{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
