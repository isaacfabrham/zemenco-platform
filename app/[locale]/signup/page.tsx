'use client';

import { useState } from 'react';
import { useRouter, Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';
import { Loader2, ChevronDown } from 'lucide-react';

export default function SignupPage() {
  const t = useTranslations('auth.signup');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  
  const plan = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('plan') : null;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            industry: industry,
            selected_plan: plan
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setSuccess(true);
      setMessage(t('success', { email }));
    } catch (err: any) {
      setMessage(err.message);
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F2820] text-white p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-4">
            <div className="font-extrabold text-3xl tracking-tighter">ZEMEN CO.</div>
          </Link>
          <div className="text-[#1D9E75] font-semibold tracking-[0.2em] uppercase text-xs mb-8">
            {t('tagline')}
          </div>
          <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
          <p className="text-white/60 text-lg">{t('subtitle')}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl">
          {message && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`mb-8 p-4 rounded-xl text-sm font-medium border ${
                success ? 'bg-[#1D9E75]/10 border-[#1D9E75]/20 text-[#1D9E75]' : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {message}
            </motion.div>
          )}

          {!success ? (
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2 ml-1">{t('firstName')}</label>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#1D9E75] focus:bg-white/10 transition-all text-white placeholder:text-white/20"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2 ml-1">{t('lastName')}</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#1D9E75] focus:bg-white/10 transition-all text-white placeholder:text-white/20"
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2 ml-1">{t('email')}</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#1D9E75] focus:bg-white/10 transition-all text-white placeholder:text-white/20"
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2 ml-1">{t('password')}</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#1D9E75] focus:bg-white/10 transition-all text-white placeholder:text-white/20"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2 ml-1">{t('industry')}</label>
                  <div className="relative">
                    <select 
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#1D9E75] focus:bg-white/10 transition-all text-white appearance-none cursor-pointer"
                      required
                    >
                      <option value="" disabled className="bg-[#0F2820]">{t('industryPlaceholder')}</option>
                      <option value="restaurant" className="bg-[#0F2820]">{t('industries.restaurant')}</option>
                      <option value="salon" className="bg-[#0F2820]">{t('industries.salon')}</option>
                      <option value="dealership" className="bg-[#0F2820]">{t('industries.dealership')}</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40" />
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-[#1D9E75] text-white font-bold uppercase tracking-widest text-sm rounded-2xl hover:bg-[#168a65] hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? t('creating') : t('button')}
              </button>

              <div className="relative my-8 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <span className="relative px-4 bg-[#0F2820] text-[10px] uppercase tracking-widest text-white/30 font-bold">Or</span>
              </div>

              <button 
                type="button"
                onClick={handleGoogleSignup}
                className="w-full py-4 bg-white text-[#0F2820] font-bold uppercase tracking-widest text-sm rounded-2xl hover:bg-gray-100 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t('google')}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <Link href="/login" className="inline-block py-4 px-10 bg-[#1D9E75] text-white font-bold uppercase tracking-widest text-sm rounded-2xl hover:bg-[#168a65] transition-all">
                {t('login')}
              </Link>
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-white/40 text-sm">
          {t('haveAccount')} <Link href="/login" className="text-[#1D9E75] font-bold hover:underline ml-1">{t('login')}</Link>
        </p>
      </motion.div>
    </div>
  );
}
