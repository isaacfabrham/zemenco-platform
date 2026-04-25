'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, action: 'login' }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-surface text-text-main p-4">
      <div className="w-full max-w-md bg-white p-8 border border-border-color rounded shadow-soft">
        <div className="text-center mb-8">
          <Link href="/" className="font-extrabold text-2xl tracking-tighter">ZEMEN CO.</Link>
          <h1 className="text-3xl font-bold mt-6 mb-2">Welcome back</h1>
          <p className="text-text-muted">Log in to manage your platform</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-brand-red/10 text-brand-red rounded text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
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
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="mt-6 text-center text-text-muted">
          Don&apos;t have an account? <Link href="/signup" className="text-brand-gold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
