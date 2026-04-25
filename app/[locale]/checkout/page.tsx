'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from '@/navigation'
import { useLocale } from 'next-intl'
import { Loader2 } from 'lucide-react'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const locale = useLocale()
  const [error, setError] = useState('')
  const plan = searchParams.get('plan')

  useEffect(() => {
    if (!plan) {
      router.push('/dashboard')
      return
    }

    const startCheckout = async () => {
      try {
        const res = await fetch('/api/payments/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan, locale })
        })

        const data = await res.json()
        if (data.url) {
          window.location.href = data.url
        } else {
          throw new Error(data.error || 'Failed to start checkout')
        }
      } catch (err: any) {
        setError(err.message)
      }
    }

    startCheckout()
  }, [plan, router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-surface p-4">
        <div className="bg-white p-8 border border-brand-red rounded text-center max-w-md">
          <h1 className="text-2xl font-bold text-brand-red mb-4">Checkout Error</h1>
          <p className="text-text-muted mb-8">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-text-main text-white font-bold rounded uppercase hover:bg-brand-gold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-surface p-4">
      <Loader2 size={48} className="animate-spin text-brand-gold mb-6" />
      <h1 className="text-2xl font-bold uppercase tracking-widest">Preparing Checkout</h1>
      <p className="text-text-muted mt-2 text-center">Redirecting you to our secure payment provider...</p>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-surface p-4">
        <Loader2 size={48} className="animate-spin text-brand-gold mb-6" />
        <h1 className="text-2xl font-bold uppercase tracking-widest">Loading Checkout...</h1>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
