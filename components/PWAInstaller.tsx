'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show our custom prompt after a small delay
      const hasSeenPrompt = localStorage.getItem('pwa_prompt_seen');
      if (!hasSeenPrompt) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => console.log('SW registered:', registration.scope),
        (err) => console.log('SW registration failed:', err)
      );
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install');
    } else {
      console.log('User dismissed the PWA install');
    }
    
    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_seen', 'true');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_seen', 'true');
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-4 right-4 z-[90] md:bottom-8 md:right-8 md:left-auto md:w-80"
        >
          <div className="bg-[#0F2820] text-white p-5 rounded-3xl shadow-2xl border border-white/10 relative">
            <button 
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-white/40 hover:text-white"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#1D9E75] rounded-xl flex items-center justify-center shadow-lg">
                 <Download size={24} />
              </div>
              <div>
                <h4 className="font-bold">Install Zemen Co.</h4>
                <p className="text-xs text-white/60">Get the full app experience</p>
              </div>
            </div>
            
            <button 
              onClick={handleInstall}
              className="w-full py-3 bg-[#1D9E75] text-[#0F2820] font-bold rounded-xl hover:bg-teal-400 transition-all text-sm"
            >
              Add to Home Screen
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
