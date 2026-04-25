import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import RestaurantTemplate from '@/components/templates/RestaurantTemplate'
import SalonTemplate from '@/components/templates/SalonTemplate'
import DealershipTemplate from '@/components/templates/DealershipTemplate'
import SiteChatbot from '@/components/SiteChatbot'

export const dynamic = 'force-dynamic' 

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient()
  const { data: site } = await supabase.from('sites').select('*').eq('slug', params.slug).single()
  
  if (!site) return { title: 'Site Not Found' }
  
  const { site_data } = site
  return {
    title: `${site_data.businessName} | ${site_data.tagline}`,
    description: `Visit ${site_data.businessName} in ${site_data.city}. ${site_data.tagline}. Powered by Zemen Co.`,
    openGraph: {
      images: site_data.photos?.[0] ? [site_data.photos[0]] : []
    }
  }
}

export default async function PublicSitePage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  
  const { data: site, error } = await supabase
    .from('sites')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !site) {
    notFound()
  }

  // If site is not published, show Coming Soon
  if (!site.published) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0F1C] text-white p-6 text-center">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 italic">Something Big is Coming</h1>
          <p className="text-white/50 uppercase text-xs font-bold tracking-[0.3em]">
            The digital home for <span className="text-[#B5780A]">{site.site_data.businessName}</span> is currently under construction.
          </p>
        </div>
      </div>
    )
  }

  const { template_type, site_data } = site

  return (
    <main>
      {template_type === 'restaurant' && <RestaurantTemplate data={site_data} />}
      {template_type === 'salon' && <SalonTemplate data={site_data} />}
      {template_type === 'dealership' && <DealershipTemplate data={site_data} />}
      
      <SiteChatbot businessData={site_data} industry={template_type} />
    </main>
  )
}
