'use client';

import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
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
  AlertCircle,
  Layout as LayoutIcon
} from 'lucide-react';
import PortalButton from '@/components/PortalButton';
import { useRouter } from '@/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/dashboard');
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        
        const data = await res.json();
        setUser(data.user);
        setProfile(data.profile);
        setSites(data.sites);
      } catch (e) {
        console.error("Dashboard load failed", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] text-[#0A0F1C] uppercase font-black tracking-widest text-xs">Loading Dashboard...</div>;

  const isSubscribed = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing';

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0A0F1C] font-sans">
      {/* Sidebar Navigation */}
      <div className="fixed rtl:right-0 ltr:left-0 top-0 h-full w-64 bg-[#0A0F1C] text-white p-8 hidden md:block">
        <div className="font-black text-2xl tracking-tighter mb-12 reveal active">ZEMEN CO.</div>
        <nav className="space-y-6">
          <Link href="/dashboard" className="flex items-center gap-3 text-[#B5780A] font-bold reveal active delay-100">
            <BarChart3 size={20} /> {t('title')}
          </Link>
          <Link href="/build" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors reveal active delay-200">
            <Plus size={20} /> {t('newSite')}
          </Link>
          <Link href="#inbox" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors reveal active delay-300">
            <MessageSquare size={20} /> {t('inbox')}
          </Link>
          <Link href="#settings" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors reveal active delay-400">
            <Settings size={20} /> {t('settings')}
          </Link>
        </nav>
        
        <div className="absolute bottom-8 ltr:left-8 rtl:right-8 reveal active delay-400">
           <form action="/api/auth" method="POST">
            <input type="hidden" name="action" value="logout" />
            <button type="submit" className="text-white/30 text-sm hover:text-white transition-colors">{t('logout')}</button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ltr:ml-64 md:rtl:mr-64 p-8 md:p-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="mask-wrap">
            <h1 className="text-4xl font-black uppercase tracking-tight italic mask-inner active">{t('welcome')}</h1>
            <p className="text-gray-500 mt-1 uppercase text-[10px] font-black tracking-[0.2em] reveal active delay-100">{t('overview')}</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto reveal active delay-200">
            {!isSubscribed ? (
               <Link href="/#pricing" className="flex-1 md:flex-none px-8 py-3.5 bg-[#9B1C1C] text-white font-bold uppercase text-xs tracking-widest rounded-lg shadow-xl shadow-red-900/20 hover:bg-red-700 transition-all text-center">
                {t('upgrade')}
              </Link>
            ) : (
              <Link href="/build" className="flex-1 md:flex-none px-8 py-3.5 bg-[#B5780A] text-white font-bold uppercase text-xs tracking-widest rounded-lg shadow-xl shadow-yellow-900/20 hover:bg-yellow-700 transition-all text-center">
                {t('create')}
              </Link>
            )}
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm reveal active delay-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('stats.visits')}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black italic">1,284</span>
              <span className="text-xs font-bold text-green-500">+12%</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm reveal active delay-200">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('stats.inquiries')}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black italic">24</span>
              <span className="text-xs font-bold text-green-500">+5</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm reveal active delay-300">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('stats.plan')}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black uppercase text-[#B5780A]">{profile?.plan_type || 'Free'}</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center reveal active delay-400">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('stats.status')}</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isSubscribed ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs font-black uppercase">{profile?.subscription_status || 'Inactive'}</span>
              </div>
            </div>
            <PortalButton />
          </div>
        </div>

        {/* Active Sites */}
        <h2 className="text-xl font-black uppercase tracking-widest mb-6 reveal active">{t('projects.title')}</h2>
        <div className="grid grid-cols-1 gap-6 mb-12">
          {!sites || sites.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center reveal active delay-100">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="text-gray-300" size={32} />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">{t('projects.noSites')}</h3>
              <p className="text-gray-400 mt-2 mb-8 uppercase text-[10px] font-bold tracking-widest">{t('projects.noSitesDesc')}</p>
              <Link href="/build" className="px-10 py-4 bg-[#0A0F1C] text-white font-bold uppercase text-xs tracking-widest rounded-xl hover:bg-[#B5780A] transition-colors">
                {t('projects.startBuilding')}
              </Link>
            </div>
          ) : (
            sites.map((site, index) => (
              <div key={site.id} className={`bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col md:flex-row items-center gap-8 group reveal active delay-${(index + 1) * 100}`}>
                <div className="w-full md:w-48 aspect-video bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100">
                   <LayoutIcon size={32} className="text-gray-200" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-black uppercase italic">{site.site_data.businessName}</h3>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                      site.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {site.published ? t('projects.published') : t('projects.draft')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-400 text-xs font-medium">
                    <span className="flex items-center gap-1"><Clock size={14} /> {new Date(site.updated_at).toLocaleDateString()}</span>
                    <span className="uppercase text-[10px] font-bold tracking-widest text-[#B5780A]">{site.template_type}</span>
                  </div>
                  
                  {site.published && (
                    <div className="mt-4 flex items-center gap-2 bg-gray-50 p-2 rounded-lg w-fit group">
                      <span className="text-[10px] text-gray-400 font-mono">zemenco-platform.com/site/{site.slug}</span>
                      <button className="text-gray-300 hover:text-[#B5780A] transition-colors"><Copy size={12} /></button>
                    </div>
                  )}
                </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={`/build/${site.template_type}`} className="px-6 py-3 bg-gray-100 text-[#0A0F1C] font-bold uppercase text-[10px] tracking-widest rounded-lg hover:bg-gray-200 transition-colors text-center">
                      {t('projects.edit')}
                    </Link>
                    <Link href={`/site/${site.slug}`} target="_blank" className="px-6 py-3 bg-[#0A0F1C] text-white font-bold uppercase text-[10px] tracking-widest rounded-lg hover:bg-[#B5780A] transition-colors text-center flex items-center justify-center gap-2">
                      {t('projects.visit')} <ExternalLink size={12} />
                    </Link>
                    <button 
                      onClick={() => {
                        const win = window.open(`/api/agent/history?siteId=${site.id}`, '_blank');
                        // In a real app, this would open a modal
                      }}
                      className="px-6 py-3 bg-white border border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-widest rounded-lg hover:border-[#B5780A] hover:text-[#B5780A] transition-colors flex items-center gap-2"
                    >
                      <Clock size={12} /> History
                    </button>
                  </div>
                </div>
            ))
          )}
        </div>

        {/* Settings & Domains */}
        <div id="settings" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 reveal active delay-100">
            <h2 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-3">
              <Globe size={20} className="text-[#B5780A]" /> {t('domain.title')}
            </h2>
            {profile?.plan_type === 'pro' ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">To connect your own domain (e.g. www.yourname.com):</p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 font-mono text-[10px]">
                  <p>1. Go to your domain provider (GoDaddy, Namecheap, etc.)</p>
                  <p>2. Add an A Record: @ -> 76.76.21.21</p>
                  <p>3. Add a CNAME: www -> cname.vercel-dns.com</p>
                </div>
                <button className="w-full py-3 bg-[#0A0F1C] text-white text-[10px] font-bold uppercase rounded-lg">{t('domain.verify')}</button>
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertCircle size={32} className="text-gray-200 mx-auto mb-4" />
                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-4">{t('domain.proOnly')}</p>
                <Link href="/#pricing" className="text-[#B5780A] font-black text-xs hover:underline">{t('domain.upgradeDesc')}</Link>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col justify-center items-center text-center reveal active delay-200">
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
        <div id="inbox" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 reveal active">
           <h2 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-3">
             <MessageSquare size={20} className="text-[#B5780A]" /> {t('inbox')}
           </h2>
           <div className="space-y-4">
              <div className="p-4 border-l-4 border-[#B5780A] bg-gray-50 rounded flex justify-between items-center reveal active delay-100">
                <div>
                  <p className="font-bold text-sm">New Reservation Request</p>
                  <p className="text-xs text-gray-500">From: Henok T. • 2 people • Tonight at 8:00 PM</p>
                </div>
                <button className="text-[10px] font-black uppercase text-[#B5780A] hover:underline">View Details</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
