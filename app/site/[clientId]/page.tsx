import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function PublishedSitePage({ params }: { params: { clientId: string } }) {
  const supabase = createClient()

  const { data: site, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', params.clientId)
    .single()

  if (error || !site) {
    notFound()
  }

  const { site_data: siteData } = site

  return (
    <div className="min-h-screen bg-white text-black" style={{ '--dynamic-color': siteData.primaryColor || '#B5780A' } as React.CSSProperties}>
      <header className="flex justify-between items-center p-10 max-w-[1200px] mx-auto">
        <div className="text-2xl font-bold">{siteData.businessName || 'My Business'}</div>
        <nav className="flex gap-8 font-semibold uppercase text-sm">
          <span>Home</span>
          <span>Services</span>
          <span>Contact</span>
        </nav>
      </header>

      <main className="max-w-[1200px] mx-auto p-10 py-20 text-center">
        <h1 className="text-6xl font-extrabold mb-6" style={{ color: 'var(--dynamic-color)' }}>
          {siteData.businessName || 'Welcome'}
        </h1>
        <p className="text-2xl text-black/60 mb-10 max-w-[800px] mx-auto">
          {siteData.tagline || 'We offer the best services in town.'}
        </p>
        <button className="px-10 py-5 text-white font-bold rounded shadow-lg hover:-translate-y-1 transition-transform" style={{ backgroundColor: 'var(--dynamic-color)' }}>
          Book Now
        </button>
      </main>

      {/* AI Chatbot Widget (Stub) */}
      <div className="fixed bottom-10 right-10 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-105 transition-transform" style={{ backgroundColor: 'var(--dynamic-color)', color: 'white' }}>
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </div>
    </div>
  )
}
