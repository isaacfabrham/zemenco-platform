import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { 
  Globe, 
  Settings, 
  CreditCard, 
  BarChart3, 
  MessageSquare, 
  Plus, 
  ExternalLink, 
  Copy,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import PortalButton from '@/components/PortalButton'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile and sites
  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
  const { data: sites } = await supabase.from('sites').select('*').eq('user_id', user.id)

  const isSubscribed = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0A0F1C] font-sans">
      {/* Sidebar Navigation (Hidden on mobile) */}
      <div className="fixed left-0 top-0 h-full w-64 bg-[#0A0F1C] text-white p-8 hidden md:block">
        <div className="font-black text-2xl tracking-tighter mb-12">ZEMEN CO.</div>
        <nav className="space-y-6">
          <Link href="/dashboard" className="flex items-center gap-3 text-[#B5780A] font-bold">
            <BarChart3 size={20} /> Dashboard
          </Link>
          <Link href="/build" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors">
            <Plus size={20} /> New Site
          </Link>
          <Link href="#inbox" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors">
            <MessageSquare size={20} /> Inbox
          </Link>
          <Link href="#settings" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors">
            <Settings size={20} /> Settings
          </Link>
        </nav>
        
        <div className="absolute bottom-8 left-8 right-8">
           <form action="/api/auth" method="POST">
            <input type="hidden" name="action" value="logout" />
            <button type="submit" className="text-white/30 text-sm hover:text-white transition-colors">Log Out</button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-64 p-8 md:p-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight italic">Welcome Back</h1>
            <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">Platform Overview</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            {!isSubscribed ? (
               <Link href="/#pricing" className="flex-1 md:flex-none px-8 py-3.5 bg-[#9B1C1C] text-white font-bold uppercase text-xs tracking-widest rounded-lg shadow-xl shadow-red-900/20 hover:bg-red-700 transition-all">
                Upgrade to Pro
              </Link>
            ) : (
              <Link href="/build" className="flex-1 md:flex-none px-8 py-3.5 bg-[#B5780A] text-white font-bold uppercase text-xs tracking-widest rounded-lg shadow-xl shadow-yellow-900/20 hover:bg-yellow-700 transition-all">
                Create New Site
              </Link>
            )}
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Total Visits</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black italic">1,284</span>
              <span className="text-xs font-bold text-green-500">+12%</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Inquiries</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black italic">24</span>
              <span className="text-xs font-bold text-green-500">+5</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Plan Type</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black uppercase text-[#B5780A]">{profile?.plan_type || 'Free'}</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Status</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isSubscribed ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs font-black uppercase">{profile?.subscription_status || 'Inactive'}</span>
              </div>
            </div>
            <PortalButton />
          </div>
        </div>

        {/* Active Sites */}
        <h2 className="text-xl font-black uppercase tracking-widest mb-6">Active Projects</h2>
        <div className="grid grid-cols-1 gap-6 mb-12">
          {!sites || sites.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="text-gray-300" size={32} />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">No sites yet</h3>
              <p className="text-gray-400 mt-2 mb-8 uppercase text-[10px] font-bold tracking-widest">Your digital empire starts here.</p>
              <Link href="/build" className="px-10 py-4 bg-[#0A0F1C] text-white font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-[#B5780A] transition-colors">
                Start Building
              </Link>
            </div>
          ) : (
            sites.map(site => (
              <div key={site.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col md:flex-row items-center gap-8 group">
                <div className="w-full md:w-48 aspect-video bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100">
                   <Layout size={32} className="text-gray-200" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-black uppercase italic">{site.site_data.businessName}</h3>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                      site.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {site.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-400 text-xs font-medium">
                    <span className="flex items-center gap-1"><Clock size={14} /> Updated {new Date(site.updated_at).toLocaleDateString()}</span>
                    <span className="uppercase text-[10px] font-bold tracking-widest text-[#B5780A]">{site.template_type}</span>
                  </div>
                  
                  {site.published && (
                    <div className="mt-4 flex items-center gap-2 bg-gray-50 p-2 rounded-lg w-fit group">
                      <span className="text-[10px] text-gray-400 font-mono">zemenco-platform.com/site/{site.slug}</span>
                      <button className="text-gray-300 hover:text-[#B5780A] transition-colors"><Copy size={12} /></button>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <Link href={`/build/${site.template_type}`} className="flex-1 md:flex-none px-6 py-3 bg-gray-100 text-[#0A0F1C] font-bold uppercase text-[10px] tracking-widest rounded-lg hover:bg-gray-200 transition-colors text-center">
                    Edit Site
                  </Link>
                  <Link href={`/site/${site.slug}`} target="_blank" className="flex-1 md:flex-none px-6 py-3 bg-[#0A0F1C] text-white font-bold uppercase text-[10px] tracking-widest rounded-lg hover:bg-[#B5780A] transition-colors text-center flex items-center justify-center gap-2">
                    Visit Live <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Settings & Domains */}
        <div id="settings" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-3">
              <Globe size={20} className="text-[#B5780A]" /> Custom Domain
            </h2>
            {profile?.plan_type === 'pro' ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">To connect your own domain (e.g. www.yourname.com):</p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 font-mono text-[10px]">
                  <p>1. Go to your domain provider (GoDaddy, Namecheap, etc.)</p>
                  <p>2. Add an A Record: @ -> 76.76.21.21</p>
                  <p>3. Add a CNAME: www -> cname.vercel-dns.com</p>
                </div>
                <button className="w-full py-3 bg-[#0A0F1C] text-white text-[10px] font-bold uppercase rounded-lg">Verify Domain Connection</button>
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertCircle size={32} className="text-gray-200 mx-auto mb-4" />
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-4">Pro Feature Only</p>
                <Link href="/#pricing" className="text-[#B5780A] font-black text-xs hover:underline">Upgrade to connect your domain</Link>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col justify-center items-center text-center">
             <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={24} />
             </div>
             <h3 className="text-lg font-black uppercase italic">SEO Optimized</h3>
             <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest leading-relaxed">
               Your site is automatically indexed by Google with custom meta-tags and social previews.
             </p>
          </div>
        </div>

        {/* Form Inbox Placeholder */}
        <div id="inbox" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
           <h2 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-3">
             <MessageSquare size={20} className="text-[#B5780A]" /> Form Inbox
           </h2>
           <div className="space-y-4">
              <div className="p-4 border-l-4 border-[#B5780A] bg-gray-50 rounded flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm">New Reservation Request</p>
                  <p className="text-xs text-gray-500">From: Henok T. • 2 people • Tonight at 8:00 PM</p>
                </div>
                <button className="text-[10px] font-black uppercase text-[#B5780A] hover:underline">View Details</button>
              </div>
              <div className="p-4 border-l-4 border-gray-200 bg-gray-50/50 rounded flex justify-between items-center opacity-50">
                <div>
                  <p className="font-bold text-sm">Test Drive Inquiry</p>
                  <p className="text-xs text-gray-500">From: Sara M. • 2024 Toyota Land Cruiser</p>
                </div>
                <button className="text-[10px] font-black uppercase text-gray-400 hover:underline">Read</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

function Layout({ size, className }: { size: number, className: string }) {
  return <Globe size={size} className={className} />
}
