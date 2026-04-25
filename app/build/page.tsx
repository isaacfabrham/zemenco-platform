import Link from 'next/link'

export default function BuildOverviewPage() {
  return (
    <div className="container mx-auto px-10 py-20 max-w-[1400px]">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Choose Your Industry</h1>
        <p className="text-white/70 text-lg">Select a template to start building with our AI assistant.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { id: 'restaurant', title: 'Restaurant', desc: 'Pre-loaded with menu integrations, reservations, and AI chatbot.' },
          { id: 'salon', title: 'Salon', desc: 'Pre-loaded with automated booking, AI chatbot, and service menus.' },
          { id: 'dealership', title: 'Car Dealership', desc: 'Pre-loaded with inventory display, test drive booking, and AI chatbot.' }
        ].map((item) => (
          <div key={item.id} className="bg-bg-surface/10 p-10 border border-white/10 rounded flex flex-col hover:-translate-y-2 transition-transform">
            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
            <p className="text-white/60 mb-8 flex-1">{item.desc}</p>
            <Link href={`/build/${item.id}`} className="block w-full px-6 py-4 border border-brand-gold text-brand-gold font-semibold uppercase text-center rounded hover:bg-brand-gold hover:text-white transition-colors">
              Start Building
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
