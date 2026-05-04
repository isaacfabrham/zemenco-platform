'use client';

import { useState, useEffect } from 'react';
import { Link, useRouter } from '@/navigation';
import {
  Home, LayoutTemplate, Settings, MonitorSmartphone,
  Globe, Copy, ExternalLink, BarChart3, MessageSquare,
  Check, Clock, Trash2, EyeOff, ChevronRight, AlertTriangle
} from 'lucide-react';

export default function MySitePage() {
  const router = useRouter();
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showDanger, setShowDanger] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'inbox' | 'settings'>('overview');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/dashboard');
        if (res.status === 401) { router.push('/login'); return; }
        const data = await res.json();
        setSites(data.sites || []);
      } catch (e) {
        console.error('Failed to load site data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7] text-[#0F2820] font-medium">Loading...</div>;
  }

  const site = sites[0] || null;
  const liveUrl = site ? ('https://zemenco.com/site/' + site.slug) : null;

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans flex flex-col md:flex-row text-[#0F2820]">

      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 px-4 py-8 shadow-sm z-10">
        <div className="font-extrabold text-2xl tracking-tighter mb-10 px-4">ZEMEN CO.</div>
        <nav className="space-y-1 flex-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#0F2820] font-medium rounded-xl transition-all">
            <Home size={20} /> Home
          </Link>
          <Link href="/my-site" className="flex items-center gap-3 px-4 py-3 bg-[#E8F5F1] text-[#1D9E75] font-semibold rounded-xl transition-all">
            <MonitorSmartphone size={20} /> My Website
          </Link>
          <Link href="/templates" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#0F2820] font-medium rounded-xl transition-all">
            <LayoutTemplate size={20} /> Templates
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#0F2820] font-medium rounded-xl transition-all">
            <Settings size={20} /> Settings
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 mb-24 md:mb-0">

        {/* Header */}
        <header className="mb-8">
          {site ? (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold">{site.site_data?.businessName || 'My Website'}</h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${site.published ? 'bg-[#E8F5F1] text-[#059669]' : 'bg-gray-100 text-gray-500'}`}>
                    {site.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                {liveUrl && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500 font-mono">{liveUrl}</span>
                    <button onClick={() => handleCopy(liveUrl)} className={`p-1 rounded transition-colors ${copied ? 'text-[#1D9E75]' : 'text-gray-400 hover:text-[#0F2820]'}`}>
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="p-1 text-gray-400 hover:text-[#0F2820] transition-colors">
                      <ExternalLink size={16} />
                    </a>
                  </div>
                )}
              </div>
              <Link href={`/build/${site.template_type}`} className="px-6 py-3 bg-[#0F2820] text-white font-bold rounded-xl hover:bg-[#163B2F] transition-all flex items-center gap-2 shadow-sm">
                Continue Editing <ChevronRight size={18} />
              </Link>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold mb-2">My Website</h1>
              <p className="text-gray-500 font-medium">You have not created a site yet.</p>
            </div>
          )}
        </header>

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Visits', value: site ? '1,284' : '--', delta: site ? '+12%' : null, icon: BarChart3 },
            { label: 'Contact Forms', value: site ? '24' : '--', delta: site ? '+5' : null, icon: MessageSquare },
            { label: 'This Month', value: site ? '348' : '--', delta: site ? '+28%' : null, icon: Globe },
            { label: 'Last Updated', value: site ? new Date(site.updated_at).toLocaleDateString() : '--', delta: null, icon: Clock },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex justify-between items-start mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{stat.label}</p>
                <stat.icon size={16} className="text-gray-300" />
              </div>
              <p className="text-2xl font-extrabold text-[#0F2820]">{stat.value}</p>
              {stat.delta && <p className="text-xs font-semibold text-[#059669] mt-1">{stat.delta}</p>}
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 w-fit">
          {(['overview', 'inbox', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white shadow-sm text-[#0F2820]' : 'text-gray-500 hover:text-[#0F2820]'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {!site ? (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-16 text-center">
                <div className="w-20 h-20 bg-[#E8F5F1] rounded-full flex items-center justify-center mx-auto mb-6">
                  <MonitorSmartphone className="text-[#1D9E75]" size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#0F2820] mb-2">No site started yet</h3>
                <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">Pick a template and build something amazing together with AI.</p>
                <Link href="/templates" className="px-8 py-4 bg-[#1D9E75] text-white font-bold rounded-xl hover:bg-[#168A65] transition-all shadow-sm">
                  Choose a Template
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-lg font-bold mb-6">Site Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Business Name</p>
                    <p className="font-semibold text-[#0F2820]">{site.site_data?.businessName || '--'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Industry</p>
                    <p className="font-semibold capitalize text-[#0F2820]">{site.template_type}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Status</p>
                    <p className={`font-semibold ${site.published ? 'text-[#059669]' : 'text-gray-500'}`}>{site.published ? 'Published and Live' : 'Draft'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Created</p>
                    <p className="font-semibold text-[#0F2820]" suppressHydrationWarning>{new Date(site.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Inbox */}
        {activeTab === 'inbox' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-bold text-lg text-[#0F2820]">Form Submissions</h2>
              <p className="text-sm text-gray-500 mt-1">Messages from your customers</p>
            </div>
            {site ? (
              <div className="divide-y divide-gray-50">
                {[
                  { name: 'Henok Tesfaye', msg: 'Table for 4 tonight at 8pm?', time: '2h ago', read: false },
                  { name: 'Meron Haile', msg: "I'd like to book an appointment for Saturday", time: '1d ago', read: true },
                  { name: 'Dawit Bekele', msg: 'What are your weekend hours?', time: '3d ago', read: true },
                ].map((sub, i) => (
                  <div key={i} className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-colors ${!sub.read ? 'bg-[#F0FDF9]' : ''}`}>
                    <div className="flex items-center gap-4">
                      {!sub.read && <div className="w-2 h-2 rounded-full bg-[#1D9E75] shrink-0" />}
                      <div className={sub.read ? 'pl-6' : ''}>
                        <p className="font-semibold text-sm text-[#0F2820]">{sub.name}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{sub.msg}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <p className="text-xs text-gray-400 font-medium whitespace-nowrap">{sub.time}</p>
                      {!sub.read && (
                        <button className="text-xs font-bold text-[#1D9E75] hover:underline whitespace-nowrap">Mark Read</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center">
                <MessageSquare className="text-gray-200 mx-auto mb-4" size={48} />
                <h3 className="font-bold text-[#0F2820] mb-2">No messages yet</h3>
                <p className="text-gray-500 text-sm font-medium">Your customers will show up here once your site is live.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
              <h2 className="font-bold text-lg mb-6">Site Settings</h2>
              <div className="space-y-1">
                {['Change template layout', 'Update brand colors', 'Update fonts', 'SEO settings'].map(s => (
                  <button key={s} className="w-full flex justify-between items-center py-4 border-b border-gray-100 last:border-0 hover:text-[#1D9E75] transition-colors text-left font-medium">
                    {s} <ChevronRight size={18} className="text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            <div className={`rounded-3xl border shadow-sm overflow-hidden transition-all ${showDanger ? 'border-red-200' : 'border-gray-200'}`}>
              <button
                onClick={() => setShowDanger(!showDanger)}
                className="w-full bg-white p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 text-red-500 font-bold">
                  <AlertTriangle size={20} /> Danger Zone
                </div>
                <ChevronRight size={18} className={`text-gray-400 transition-transform ${showDanger ? 'rotate-90' : ''}`} />
              </button>
              {showDanger && (
                <div className="bg-red-50 border-t border-red-100 p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-[#0F2820]">Unpublish Site</p>
                      <p className="text-sm text-gray-500">Take your site offline temporarily.</p>
                    </div>
                    <button className="px-5 py-2 border border-red-300 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all flex items-center gap-2 text-sm">
                      <EyeOff size={16} /> Unpublish
                    </button>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-red-100">
                    <div>
                      <p className="font-semibold text-[#0F2820]">Delete Site</p>
                      <p className="text-sm text-gray-500">Permanently delete all site data. This cannot be undone.</p>
                    </div>
                    <button className="px-5 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all flex items-center gap-2 text-sm">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50 safe-area-bottom">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-gray-400"><Home size={24} /><span className="text-[10px] font-medium">Home</span></Link>
        <Link href="/my-site" className="flex flex-col items-center gap-1 text-[#1D9E75]"><MonitorSmartphone size={24} /><span className="text-[10px] font-bold">My Site</span></Link>
        <Link href="/templates" className="flex flex-col items-center gap-1 text-gray-400"><LayoutTemplate size={24} /><span className="text-[10px] font-medium">Templates</span></Link>
        <Link href="/settings" className="flex flex-col items-center gap-1 text-gray-400"><Settings size={24} /><span className="text-[10px] font-medium">Settings</span></Link>
      </div>
    </div>
  );
}
