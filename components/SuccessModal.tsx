'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Copy, ExternalLink, Share2, MessageCircle, Instagram, Facebook } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteUrl: string;
  businessName: string;
}

export default function SuccessModal({ isOpen, onClose, siteUrl, businessName }: SuccessModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Multiple bursts for a premium feel
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=Check%20out%20my%20new%20website%20${encodeURIComponent(siteUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=I%20just%20launched%20my%20new%20website%20built%20with%20Zemen%20Co!&url=${encodeURIComponent(siteUrl)}`
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-[#E8F5F1] rounded-full flex items-center justify-center mx-auto mb-8 relative">
              <Check className="text-[#1D9E75]" size={48} strokeWidth={3} />
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-[#1D9E75]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.4, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>

            <h2 className="text-4xl font-extrabold text-[#0F2820] tracking-tight mb-4">
              Your site is LIVE! 🚀
            </h2>
            <p className="text-lg text-gray-500 font-medium mb-10">
              Congratulations! <strong>{businessName}</strong> is now officially online and ready for business.
            </p>

            {/* Live URL Card */}
            <div className="bg-[#F8FAFB] border border-gray-200 rounded-3xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Website Address</p>
                <p className="text-lg font-bold text-[#1D9E75] truncate max-w-[280px]">{siteUrl.replace(/^https?:\/\//, '')}</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button 
                  onClick={handleCopy}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-[#1D9E75] transition-all text-sm font-bold text-[#0F2820]"
                >
                  {copied ? <Check size={18} className="text-[#1D9E75]" /> : <Copy size={18} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <a 
                  href={siteUrl} 
                  target="_blank" 
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-[#0F2820] text-white rounded-xl hover:bg-[#163B2F] transition-all text-sm font-bold shadow-lg shadow-[#0F2820]/20"
                >
                  Visit <ExternalLink size={18} />
                </a>
              </div>
            </div>

            {/* Share Buttons */}
            <div>
              <p className="text-sm font-bold text-[#0F2820] mb-4">Share your success</p>
              <div className="flex justify-center gap-4">
                <a 
                  href={shareLinks.whatsapp} 
                  target="_blank"
                  className="w-14 h-14 bg-[#25D366]/10 text-[#25D366] rounded-2xl flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all shadow-sm hover:shadow-lg"
                >
                  <MessageCircle size={28} fill="currentColor" className="stroke-none" />
                </a>
                <a 
                  href="#" 
                  className="w-14 h-14 bg-gradient-to-br from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#FCB045]/10 text-[#E1306C] rounded-2xl flex items-center justify-center hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#FCB045] hover:text-white transition-all shadow-sm hover:shadow-lg"
                >
                  <Instagram size={28} />
                </a>
                <a 
                  href={shareLinks.facebook} 
                  target="_blank"
                  className="w-14 h-14 bg-[#1877F2]/10 text-[#1877F2] rounded-2xl flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all shadow-sm hover:shadow-lg"
                >
                  <Facebook size={28} fill="currentColor" className="stroke-none" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-[#F8FAFB] py-4 px-6 text-center border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium">We've sent a detailed setup guide to your email.</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
