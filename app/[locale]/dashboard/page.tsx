'use client';

import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';
import { 
  Home,
  LayoutTemplate,
  CreditCard,
  Settings,
  Search,
  ChevronRight,
  MonitorSmartphone,
  CheckCircle2,
  ExternalLink,
  Copy,
  Clock,
  Sparkles,
  LayoutDashboard
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7] text-[#0F2820] font-medium tracking-wide">Loading Dashboard...</div>;

  const isSubscribed = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing';
  const planType = profile?.plan_type || 'free';
  const firstName = profile?.first_name || 'Friend';

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#0F2820] font-sans flex flex-col md:flex-row">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 px-4 py-8 shadow-sm z-10">
        <div className="font-extrabold text-2xl tracking-tighter mb-10 px-4 text-[#0F2820]">ZEMEN CO.</div>
        <nav className="space-y-1 flex-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-[#E8F5F1] text-[#1D9E75] font-semibold rounded-xl transition-all">
            <Home size={20} /> Home
          </Link>
          <Link href="/my-site" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#0F2820] font-medium rounded-xl transition-all">
            <MonitorSmartphone size={20} /> My Website
          </Link>
          <Link href="/templates" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#0F2820] font-medium rounded-xl transition-all">
            <LayoutTemplate size={20} /> Templates
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#0F2820] font-medium rounded-xl transition-all">
            <Settings size={20} /> Settings
          </Link>
        </nav>
        
        <div className="mt-auto px-4">
           <form action="/api/auth" method="POST">
            <input type="hidden" name="action" value="logout" />
            <button type="submit" className="flex items-center gap-3 text-gray-400 hover:text-gray-600 font-medium transition-colors w-full text-left">
              Log out
            </button>
          </form>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8 mb-24 md:mb-0">
        
        {/* Top Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1 text-[#0F2820]">ሰላም {firstName} 👋</h1>
            <p className="text-gray-500 font-medium">Let's build something great today.</p>
          </div>
          <div className="w-full md:w-96 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search templates, settings..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 transition-all shadow-sm font-medium"
            />
          </div>
        </header>

        {/* Subscription Banner */}
        <div className={`mb-10 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm border ${
          planType === 'pro' ? 'bg-[#FFF9E6] border-[#FDE68A] text-[#92400E]' : 
          planType === 'starter' ? 'bg-[#E8F5F1] border-[#A7F3D0] text-[#065F46]' : 
          'bg-[#FEF3C7] border-[#FDE68A] text-[#92400E]'
        }`}>
          <div className="flex items-center gap-3 font-semibold">
            {planType === 'free' ? (
              <>
                <Sparkles size={20} className="text-[#D97706]" />
                You're on the Free Preview. Build your site now and upgrade when you're ready to go live.
              </>
            ) : (
              <>
                <CheckCircle2 size={20} className={planType === 'pro' ? 'text-[#D97706]' : 'text-[#059669]'} />
                {planType === 'pro' ? 'Pro Plan · Active' : 'Starter Plan · Active'}
              </>
            )}
          </div>
          {planType === 'free' && (
             <Link href="/#pricing" className="px-5 py-2 bg-white text-[#92400E] font-bold rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap text-sm border border-[#FDE68A]">
              See Plans
            </Link>
          )}
        </div>

        {/* Quick Actions / Create a design */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-[#0F2820]">Create a new website</h2>
          <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 gap-6 snap-x">
            {[
              { id: 'restaurant', name: 'Restaurant Website', icon: '🍽️', color: 'from-[#1D9E75]/20 to-[#1D9E75]/5', border: 'border-[#1D9E75]/30' },
              { id: 'salon', name: 'Salon Website', icon: '💇', color: 'from-[#0F2820]/10 to-transparent', border: 'border-[#0F2820]/20' },
              { id: 'dealership', name: 'Dealership Website', icon: '🚗', color: 'from-[#B5780A]/20 to-[#B5780A]/5', border: 'border-[#B5780A]/30' }
            ].map((item) => (
              <Link 
                key={item.id} 
                href={`/build/${item.id}`}
                className={`flex-none w-64 md:w-auto bg-gradient-to-br ${item.color} bg-white border ${item.border} p-6 rounded-3xl flex flex-col shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group snap-center cursor-pointer`}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-[#0F2820] mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 font-medium mb-6">Start Building</p>
                <div className="mt-auto flex items-center text-[#1D9E75] font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                  Let's go <ChevronRight size={16} className="ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* My Website Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#0F2820]">My Website</h2>
            {sites.length > 0 && (
              <Link href="/my-site" className="text-sm font-semibold text-[#1D9E75] hover:underline">View Details</Link>
            )}
          </div>

          {sites.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-20 h-20 bg-[#E8F5F1] rounded-full flex items-center justify-center mb-6">
                <LayoutDashboard className="text-[#1D9E75]" size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#0F2820] mb-2">You haven't started building yet</h3>
              <p className="text-gray-500 font-medium max-w-sm mb-6">Pick a template above to begin. Our AI will guide you through the process step-by-step.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {sites.map(site => (
                <div key={site.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-[#1D9E75]/30 transition-colors">
                  {/* Blurred Preview Thumbnail */}
                  <div className="w-full md:w-64 aspect-video bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-200">
                    <div className="absolute inset-0 bg-[#0F2820]/5 backdrop-blur-[2px] flex items-center justify-center">
                      <LayoutDashboard className="text-[#1D9E75]/40" size={48} />
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-[#0F2820]">{site.site_data.businessName || 'Untitled Project'}</h3>
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                            {site.template_type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            site.published ? 'bg-[#E8F5F1] text-[#059669]' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {site.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {site.published && (
                      <div className="mb-5 flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl w-fit border border-gray-100">
                        <span className="text-xs text-gray-500 font-medium">zemenco-platform.com/site/{site.slug}</span>
                        <button className="text-gray-400 hover:text-[#1D9E75] transition-colors"><Copy size={14} /></button>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-3 mt-6">
                      <Link href={`/build/${site.template_type}`} className="px-5 py-2.5 bg-[#E8F5F1] text-[#1D9E75] font-bold text-sm rounded-xl hover:bg-[#D1EBE3] transition-colors">
                        Continue Editing
                      </Link>
                      <Link href={`/site/${site.slug}`} target="_blank" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                        Preview
                      </Link>
                      {!site.published && (
                        <button className="px-5 py-2.5 bg-[#0F2820] text-white font-bold text-sm rounded-xl hover:bg-[#163B2F] transition-colors shadow-sm shadow-[#0F2820]/20">
                          Publish
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-bold text-[#0F2820] mb-4">Recent Activity</h2>
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
             {sites.length > 0 ? (
               <div className="space-y-4">
                 <div className="flex items-start gap-4">
                   <div className="w-8 h-8 rounded-full bg-[#E8F5F1] flex items-center justify-center text-[#1D9E75] flex-shrink-0 mt-0.5">
                     <Clock size={14} />
                   </div>
                   <div>
                     <p className="text-sm font-medium text-[#0F2820]">You updated your site configuration</p>
                     <p className="text-xs text-gray-500 mt-1">Just now</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-4">
                   <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0 mt-0.5">
                     <LayoutTemplate size={14} />
                   </div>
                   <div>
                     <p className="text-sm font-medium text-[#0F2820]">You started building your {sites[0].template_type} site</p>
                     <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                   </div>
                 </div>
               </div>
             ) : (
               <p className="text-sm text-gray-500 font-medium">No recent activity to show.</p>
             )}
          </div>
        </div>

      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50 safe-area-bottom pb-6">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-[#1D9E75]">
          <Home size={24} />
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link href="/my-site" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#0F2820]">
          <MonitorSmartphone size={24} />
          <span className="text-[10px] font-medium">My Site</span>
        </Link>
        <Link href="/templates" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#0F2820]">
          <LayoutTemplate size={24} />
          <span className="text-[10px] font-medium">Templates</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#0F2820]">
          <Settings size={24} />
          <span className="text-[10px] font-medium">Settings</span>
        </Link>
      </div>

    </div>
  );
}
