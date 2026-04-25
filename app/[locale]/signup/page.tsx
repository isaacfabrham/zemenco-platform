'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  
  // Get plan from URL
  const plan = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('plan') : null;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, action: 'signup' }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setSuccess(true);
      setMessage(`Account created! Please check ${email} to verify your account and continue to checkout.`);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-surface text-text-main p-4">
      <div className="w-full max-w-md bg-white p-8 border border-border-color rounded shadow-soft">
        <div className="text-center mb-8">
          <Link href="/" className="font-extrabold text-2xl tracking-tighter">ZEMEN CO.</Link>
          <h1 className="text-3xl font-bold mt-6 mb-2">Create your account</h1>
          <p className="text-text-muted">Start building your custom platform</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-brand-green/10 text-brand-green rounded text-sm font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold uppercase tracking-widest mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-border-color bg-bg-surface rounded outline-none focus:border-text-main transition-colors"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-border-color bg-bg-surface rounded outline-none focus:border-text-main transition-colors"
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-text-main text-white font-bold uppercase rounded hover:bg-brand-gold transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-text-muted">
          Already have an account? <Link href="/login" className="text-brand-gold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
