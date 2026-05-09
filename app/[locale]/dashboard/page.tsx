'use client'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
      else setUser(user)
    }
    getUser()
  }, [router, supabase.auth])

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-[#0F2820] text-white p-8">
      <h1 className="text-3xl font-bold text-[#1D9E75]">ሰላም 👋 Welcome to Zemen Co.</h1>
      <p className="mt-2 text-gray-300">Choose a template to start building your website.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {['restaurant', 'salon', 'dealership'].map((industry) => (
          <div key={industry} className="bg-[#1a3a2a] rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer border border-[#1D9E75]/20">
            <div className="text-4xl mb-4">
              {industry === 'restaurant' ? '🍽️' : industry === 'salon' ? '💇' : '🚗'}
            </div>
            <h2 className="text-xl font-bold capitalize">{industry} Website</h2>
            <p className="text-gray-400 text-sm mt-2">Build a professional {industry} website in minutes</p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => router.push(`/preview/${industry}`)}
                className="flex-1 border border-[#1D9E75] text-[#1D9E75] rounded-lg py-2 text-sm hover:bg-[#1D9E75]/10"
              >
                Preview
              </button>
              <button
                onClick={() => router.push(`/build/${industry}`)}
                className="flex-1 bg-[#1D9E75] text-white rounded-lg py-2 text-sm hover:bg-[#1D9E75]/90"
              >
                Start Building
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
