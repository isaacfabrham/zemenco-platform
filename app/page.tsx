'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [lang, setLang] = useState('en');

  // We will keep a simplified version of the landing page to start,
  // fully utilizing Tailwind CSS while preserving brand colors.
  return (
    <main className="min-h-screen bg-bg-surface text-text-main font-sans">
      
      {/* Navigation */}
      <header className="fixed top-0 w-full h-[90px] bg-bg-surface/85 backdrop-blur-md border-b border-border-color z-50 flex items-center">
        <div className="container mx-auto px-10 flex justify-between items-center w-full max-w-[1400px]">
          <Link href="/" className="flex items-center gap-4 hover-target">
            <div className="font-extrabold text-xl tracking-tighter">ZEMEN CO.</div>
          </Link>
          <nav className="hidden md:flex items-center gap-12">
            <Link href="#expertise" className="text-sm font-semibold text-text-muted uppercase tracking-widest hover:text-text-main transition-colors">Expertise</Link>
            <Link href="#pricing" className="text-sm font-semibold text-text-muted uppercase tracking-widest hover:text-text-main transition-colors">Pricing</Link>
            <Link href="#reviews" className="text-sm font-semibold text-text-muted uppercase tracking-widest hover:text-text-main transition-colors">Reviews</Link>
          </nav>
          <div className="flex items-center gap-6">
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent font-semibold cursor-pointer outline-none"
            >
              <option value="en">EN</option>
              <option value="am">አማ</option>
              <option value="ti">ትግ</option>
              <option value="ar">عرب</option>
            </select>
            <Link href="#contact" className="px-7 py-3.5 bg-text-main text-bg-white font-semibold text-sm rounded uppercase hover:bg-brand-gold hover:-translate-y-1 transition-all">
              Start Scaling
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-[220px] pb-[160px] relative flex flex-col items-center text-center px-4">
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[45vw] font-black text-bg-dark opacity-5 pointer-events-none z-0 tracking-tighter">
          ዘመን
        </div>
        <div className="relative z-10 max-w-[1200px] flex flex-col items-center">
          <h1 className="text-5xl md:text-[6.5vw] leading-[0.95] font-bold uppercase mb-10 tracking-tighter">
            <span className="block">Build Your Business</span>
            <span className="block">Website in <span className="text-brand-gold">10 Minutes</span></span>
          </h1>
          <p className="text-xl text-text-muted max-w-[700px] leading-relaxed mb-14">
            Choose your industry, answer a few questions, and your professional website is ready — powered by AI, built for Habesha businesses
          </p>
          <Link href="/build" className="px-12 py-5 bg-text-main text-bg-white font-semibold text-lg rounded uppercase hover:bg-brand-gold hover:-translate-y-1 transition-all">
            Start Building Free
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-bg-dark text-bg-white py-[120px]">
        <div className="container mx-auto px-10 max-w-[1400px]">
          <div className="text-center mb-20">
            <span className="block text-sm font-semibold text-brand-gold tracking-[0.25em] uppercase mb-4 opacity-80">PROCESS</span>
            <h2 className="text-5xl font-bold mb-6 tracking-tighter">How It Works</h2>
            <p className="text-xl text-white/70 max-w-[600px] mx-auto">Three simple steps to launch your custom AI-powered digital platform.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: '1', title: 'Pick your industry', desc: 'Restaurant, Salon, or Car Dealership', color: 'bg-brand-green' },
              { step: '2', title: 'Chat with our AI builder', desc: 'It asks you questions and builds your site live', color: 'bg-brand-gold' },
              { step: '3', title: 'Go live in minutes', desc: 'Your site is published and ready for customers', color: 'bg-brand-red' }
            ].map((item, i) => (
              <div key={i} className="text-center p-10 bg-white/5 rounded border border-white/10">
                <div className={`w-16 h-16 ${item.color} text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6`}>
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-white/70 text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Selector Section */}
      <section id="templates" className="bg-bg-surface py-[120px]">
        <div className="container mx-auto px-10 max-w-[1400px]">
          <div className="text-center mb-20">
            <span className="block text-sm font-semibold text-brand-gold tracking-[0.25em] uppercase mb-4 opacity-80">TEMPLATES</span>
            <h2 className="text-5xl font-bold mb-6 tracking-tighter">Industry Selector</h2>
            <p className="text-xl text-text-muted max-w-[600px] mx-auto">Choose from our specialized templates designed for your specific business needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-[1100px] mx-auto">
            {[
              { title: 'Restaurant', url: '/build/restaurant', desc: 'Pre-loaded with menu integrations, reservations, AI chatbot, and multilingual support.' },
              { title: 'Salon', url: '/build/salon', desc: 'Pre-loaded with automated booking, AI chatbot, service menus, and multilingual support.', border: 'border-t-4 border-t-brand-green' },
              { title: 'Car Dealership', url: '/build/dealership', desc: 'Pre-loaded with inventory display, test drive booking, AI chatbot, and multilingual support.' }
            ].map((item, i) => (
              <div key={i} className={`bg-bg-white p-10 border border-border-color rounded flex flex-col hover:-translate-y-2 transition-transform shadow-soft hover:shadow-hover ${item.border || ''}`}>
                <h3 className="text-3xl font-bold mb-4">{item.title}</h3>
                <p className="text-text-muted text-lg mb-8 flex-1">{item.desc}</p>
                <Link href={item.url} className="px-6 py-4 border border-border-color font-semibold uppercase text-center rounded hover:bg-bg-surface transition-colors">
                  Start with this template
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-bg-surface py-[160px]">
        <div className="container mx-auto px-10 max-w-[1400px]">
          <div className="text-center mb-20">
            <span className="block text-sm font-semibold text-brand-gold tracking-[0.25em] uppercase mb-4 opacity-80">ዋጋዎች</span>
            <h2 className="text-5xl font-bold mb-6 tracking-tighter">Transparent. Elite. Scalable.</h2>
            <p className="text-xl text-text-muted max-w-[600px] mx-auto">Stop overpaying for generic templates. Invest in bespoke digital architecture that drives actual ROI.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[1100px] mx-auto">
            {/* Starter Plan */}
            <div className="bg-bg-white p-16 border border-border-color rounded shadow-soft hover:shadow-hover hover:-translate-y-2 transition-transform flex flex-col">
              <h3 className="text-3xl font-bold mb-4">Starter</h3>
              <div className="text-7xl font-extrabold mb-8 flex items-baseline gap-2 tracking-tighter">
                $50<span className="text-xl font-medium text-text-muted tracking-normal">/month</span>
              </div>
              <p className="text-lg text-text-muted mb-10">Self-serve builder, AI chatbot assistant, 1 industry template, mobile optimized, contact form, basic SEO</p>
              <ul className="mb-14 space-y-6 flex-1">
                {['Self-serve builder', 'AI chatbot assistant', '1 industry template & mobile optimized', 'Contact form & basic SEO'].map((feat, i) => (
                  <li key={i} className="flex items-start gap-4 text-lg">
                    <svg className="w-6 h-6 stroke-brand-gold stroke-2 fill-none shrink-0" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=starter" className="px-12 py-5 border border-border-color text-center font-semibold text-lg rounded uppercase hover:bg-bg-surface transition-colors">
                Start With Starter
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-bg-white p-16 border border-brand-gold rounded shadow-hover hover:-translate-y-2 transition-transform flex flex-col relative md:-translate-y-6">
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-green via-brand-gold to-brand-red" />
              <div>
                <span className="inline-block px-4 py-1.5 bg-brand-gold/10 text-brand-gold text-sm font-bold uppercase tracking-widest mb-6 rounded-full">Ultimate Value</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">Pro</h3>
              <div className="text-7xl font-extrabold mb-8 flex items-baseline gap-2 tracking-tighter">
                $150<span className="text-xl font-medium text-text-muted tracking-normal">/month</span>
              </div>
              <p className="text-lg text-text-muted mb-10">Everything in Starter + done-for-you setup, multilingual support, advanced SEO, AI customer chatbot</p>
              <ul className="mb-14 space-y-6 flex-1">
                {[
                  <strong key="0">Everything in Starter, plus:</strong>,
                  'Done-for-you setup & advanced SEO',
                  'AI customer chatbot for your site',
                  'Multilingual Support (Amharic, Tigrinya, Arabic)'
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-4 text-lg">
                    <svg className="w-6 h-6 stroke-brand-gold stroke-2 fill-none shrink-0" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=pro" className="px-12 py-5 bg-brand-gold text-white text-center font-semibold text-lg rounded uppercase hover:bg-brand-dark transition-colors">
                Claim Market Dominance
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-dark text-bg-white py-20 text-center">
        <div className="container mx-auto px-10 max-w-[1400px]">
          <div className="font-extrabold text-2xl tracking-tighter mb-10 inline-block bg-white text-bg-dark px-4 py-2 rounded">ZEMEN CO.</div>
          <div className="text-sm text-white/40">
            © {new Date().getFullYear()} Zemen Co. Premium Digital Platforms. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
