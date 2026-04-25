'use client'

import { useState } from 'react'
import { CreditCard, Loader2 } from 'lucide-react'

export default function PortalButton() {
  const [loading, setLoading] = useState(false)

  const handlePortal = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/payments/portal', {
        method: 'POST',
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Could not open billing portal. Please contact support.')
      }
    } catch (err) {
      console.error(err)
      alert('Error opening portal.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handlePortal}
      disabled={loading}
      className="p-2.5 bg-gray-50 text-[#0A0F1C] border border-gray-200 rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
      title="Manage Billing"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
    </button>
  )
}
