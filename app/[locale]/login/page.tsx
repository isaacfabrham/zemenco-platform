'use client';

import { useState } from 'react';
import { useRouter, Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const t = useTranslations('auth.login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setErrorMessage(t('errors.invalidEmail'));
      setAuthStatus('error');
      return;
    }

    if (password.length < 8) {
      setErrorMessage(t('errors.invalidPassword'));
      setAuthStatus('error');
      return;
    }

    setAuthStatus('loading');
    setLoading(true);
    setErrorMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          throw new Error(t('errors.verify'));
        }
        throw new Error(t('errors.credentials'));
      }

      setAuthStatus('success');
      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo = searchParams.get('redirect') || '/dashboard';
      
      setTimeout(() => {
        router.push(redirectTo);
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message);
      setAuthStatus('error');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectToParam = searchParams.get('redirect');
      const callbackUrl = new URL(`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`);
      if (redirectToParam) callbackUrl.searchParams.set('next', redirectToParam);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl.toString(),
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMessage(err.message);
      setAuthStatus('error');
    }
  };

  const handleForgotPassword = async () => {
    if (!email || !validateEmail(email)) {
      setErrorMessage(t('errors.invalidEmail'));
      setAuthStatus('error');
      return;
    }
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?action=reset`,
      });
      if (error) throw error;
      setErrorMessage('Check your email for the reset link.');
      setAuthStatus('success');
    } catch (err: any) {
      setErrorMessage(err.message);
      setAuthStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F2820] text-white p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-4">
            <div className="font-extrabold text-3xl tracking-tighter">ZEMEN CO.</div>
          </Link>
          <div className="text-[#1D9E75] font-semibold tracking-[0.2em] uppercase text-xs mb-8">
            {t('tagline')}
          </div>
          <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
          <p className="text-white/80 text-lg">{t('subtitle')}</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          {authStatus === 'error' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-200 rounded-xl text-sm font-medium"
            >
              {errorMessage}
            </motion.div>
          )}

          {authStatus === 'success' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-[#1D9E75]/20 border border-[#1D9E75]/30 text-[#1D9E75] rounded-xl text-sm font-medium"
            >
              {authStatus === 'success' && !loading ? errorMessage : t('loggingIn')}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-2 ml-1">{t('email')}</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#1D9E75] focus:bg-white/10 transition-all text-white placeholder:text-white/50"
                required 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-2 ml-1">{t('password')}</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#1D9E75] focus:bg-white/10 transition-all text-white placeholder:text-white/50"
                required 
              />
              <div className="mt-3 text-right">
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-semibold text-[#1D9E75] hover:text-white transition-colors"
                >
                  {t('forgotPassword')}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-[#1D9E75] text-white font-bold uppercase tracking-widest text-sm rounded-2xl hover:bg-[#168a65] hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? t('loggingIn') : t('button')}
            </button>
          </form>

          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <span className="relative px-4 bg-[#0F2820] text-[10px] uppercase tracking-widest text-white/30 font-bold">Or</span>
          </div>

          <button 
            onClick={handleGoogleLogin}
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
        </div>

        <p className="mt-8 text-center text-white/40 text-sm">
          {t('noAccount')} <Link href="/signup" className="text-[#1D9E75] font-bold hover:underline ml-1">{t('signup')}</Link>
        </p>
      </motion.div>
    </div>
  );
}
