'use client';

import { useState } from 'react';
import { X, Lock, Check, ArrowRight } from 'lucide-react';
import { useRouter } from '@/navigation';

interface PublishGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteId?: string;
}

export default function PublishGateModal({ isOpen, onClose, siteId }: PublishGateModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = (plan: 'starter' | 'pro') => {
    setLoading(plan);
    router.push(`/checkout?plan=${plan}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      
      {/* Modal Content */}
      <div className="w-full max-w-4xl bg-[#F4F5F7] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-500 max-h-[90vh] flex flex-col relative">
        
        {/* Header */}
        <div className="px-6 py-8 md:p-10 text-center bg-white relative shrink-0 border-b border-gray-200">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="w-16 h-16 bg-[#E8F5F1] rounded-full flex items-center justify-center mx-auto mb-4">
             <span className="text-3xl">🚀</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F2820] tracking-tight mb-3">
            You're ready to go live!
          </h2>
          <p className="text-lg text-gray-500 font-medium max-w-lg mx-auto">
            Choose a plan to publish your site and start reaching customers. Cancel anytime.
          </p>
        </div>

        {/* Plans */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            
            {/* Starter Plan */}
            <div className="bg-white rounded-3xl p-8 border-2 border-transparent hover:border-[#1D9E75]/30 shadow-sm hover:shadow-xl transition-all group flex flex-col">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-[#E8F5F1] text-[#1D9E75] text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                  Most Popular
                </span>
                <h3 className="text-2xl font-bold text-[#0F2820]">Starter</h3>
                <div className="flex items-baseline mt-2">
                  <span className="text-4xl font-extrabold text-[#0F2820]">$16.99</span>
                  <span className="text-gray-500 font-medium ml-1">/month</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  'AI builder access',
                  'Customer chatbot',
                  'Mobile responsive design',
                  'Basic SEO optimization',
                  'Contact forms'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={18} className="text-[#1D9E75] shrink-0 mt-0.5" />
                    <span className="text-gray-600 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handleCheckout('starter')}
                disabled={loading !== null}
                className="w-full py-4 border-2 border-[#1D9E75] text-[#1D9E75] font-bold rounded-xl hover:bg-[#1D9E75] hover:text-white transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02]"
              >
                {loading === 'starter' ? 'Loading...' : 'Start Free Trial'}
              </button>
              <p className="text-center text-[10px] text-gray-400 font-medium mt-3">
                7 days free, then $16.99/month.
              </p>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#0F2820] rounded-3xl p-8 border-2 border-[#B5780A] shadow-xl relative flex flex-col transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#B5780A] text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md whitespace-nowrap">
                Best Value
              </div>
              
              <div className="mb-6 mt-2">
                <h3 className="text-2xl font-bold text-white">Pro</h3>
                <div className="flex items-baseline mt-2">
                  <span className="text-4xl font-extrabold text-white">$27.99</span>
                  <span className="text-white/60 font-medium ml-1">/month</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  'Everything in Starter',
                  'Multilingual (Amharic, Tigrinya, Arabic)',
                  'Done-for-you setup',
                  'Advanced SEO suite',
                  'Priority support'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#B5780A]/20 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-[#B5780A]" />
                    </div>
                    <span className={i === 0 ? "text-white font-bold" : "text-white/80 font-medium"}>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handleCheckout('pro')}
                disabled={loading !== null}
                className="w-full py-4 bg-[#B5780A] text-[#0F2820] font-bold rounded-xl hover:bg-yellow-500 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] shadow-[0_0_30px_rgba(181,120,10,0.3)]"
              >
                {loading === 'pro' ? 'Loading...' : 'Start Free Trial'} <ArrowRight size={18} />
              </button>
              <p className="text-center text-[10px] text-white/40 font-medium mt-3">
                7 days free, then $27.99/month.
              </p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center shrink-0">
           <div className="flex items-center justify-center gap-2 text-gray-500 font-medium mb-3">
              <Lock size={14} /> Secured by Stripe
           </div>
           <div className="flex items-center justify-center gap-4 text-xs font-medium">
             <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors underline decoration-gray-300 underline-offset-4">Maybe later</button>
             <span className="text-gray-300">•</span>
             <span className="text-[#1D9E75] flex items-center gap-1">
               <ShieldCheckIcon size={14} /> 30-Day Money Back Guarantee
             </span>
           </div>
        </div>
      </div>
    </div>
  );
}

function ShieldCheckIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  );
}
