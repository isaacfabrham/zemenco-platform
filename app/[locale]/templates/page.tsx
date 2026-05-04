'use client';

import { useState } from 'react';
import { Link } from '@/navigation';
import { 
  Home,
  LayoutTemplate,
  Settings,
  Search,
  MonitorSmartphone,
  X,
  Check,
  ChevronRight,
  Sparkles,
  Smartphone,
  Monitor
} from 'lucide-react';
import { useRouter } from '@/navigation';
import Image from 'next/image';

const TEMPLATES = [
  {
    id: 'restaurant-1',
    type: 'restaurant',
    name: 'The Fine Dining',
    style: 'Elegant & Modern',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    features: ['Reservation System', 'Digital Menu', 'AI Assistant', 'Mobile Optimized'],
    isPopular: true
  },
  {
    id: 'salon-1',
    type: 'salon',
    name: 'The Bold Studio',
    style: 'Chic & Minimalist',
    image: 'https://images.unsplash.com/photo-1521590832167-7bfcfaa6362f?auto=format&fit=crop&q=80&w=800',
    features: ['Online Booking', 'Service Menu', 'Stylist Profiles', 'Instagram Feed'],
    isPopular: true
  },
  {
    id: 'dealership-1',
    type: 'dealership',
    name: 'Premium Auto',
    style: 'Bold & Trustworthy',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800',
    features: ['Inventory Display', 'Test Drive Booking', 'Finance Calculator', 'Lead Generation'],
    isPopular: false
  },
  {
    id: 'restaurant-2',
    type: 'restaurant',
    name: 'Cozy Cafe',
    style: 'Warm & Inviting',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
    features: ['Pickup Ordering', 'Gallery', 'Loyalty Program', 'AI Assistant'],
    isPopular: false
  }
];

export default function TemplatesPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<typeof TEMPLATES[0] | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesFilter = activeFilter === 'all' || t.type === activeFilter;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.style.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#0F2820] font-sans flex flex-col md:flex-row">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 px-4 py-8 shadow-sm z-10">
        <div className="font-extrabold text-2xl tracking-tighter mb-10 px-4 text-[#0F2820]">ZEMEN CO.</div>
        <nav className="space-y-1 flex-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#0F2820] font-medium rounded-xl transition-all">
            <Home size={20} /> Home
          </Link>
          <Link href="/my-site" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#0F2820] font-medium rounded-xl transition-all">
            <MonitorSmartphone size={20} /> My Website
          </Link>
          <Link href="/templates" className="flex items-center gap-3 px-4 py-3 bg-[#E8F5F1] text-[#1D9E75] font-semibold rounded-xl transition-all">
            <LayoutTemplate size={20} /> Templates
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#0F2820] font-medium rounded-xl transition-all">
            <Settings size={20} /> Settings
          </Link>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 mb-24 md:mb-0">
        
        {/* Top Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-[#0F2820]">Choose your starting point</h1>
          <p className="text-gray-500 font-medium">Pick a template to customize with our AI builder.</p>
        </header>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto hide-scrollbar">
            {['all', 'restaurant', 'salon', 'dealership'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  activeFilter === filter 
                    ? 'bg-[#0F2820] text-white shadow-md' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {filter === 'all' ? 'All Templates' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-72 flex-shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search templates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 transition-all shadow-sm text-sm font-medium"
            />
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map(template => (
            <div key={template.id} className="group relative bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <Image 
                  src={template.image} 
                  alt={template.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#0F2820]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-sm z-10">
                  <button 
                    onClick={() => setPreviewTemplate(template)}
                    className="px-6 py-3 bg-white text-[#0F2820] font-bold rounded-xl hover:scale-105 transition-transform"
                  >
                    Preview
                  </button>
                  <Link 
                    href={`/build/${template.type}`}
                    className="px-6 py-3 bg-[#1D9E75] text-white font-bold rounded-xl hover:bg-[#168A65] hover:scale-105 transition-transform"
                  >
                    Use This Template
                  </Link>
                </div>

                {/* Badges */}
                {template.isPopular && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[#0F2820] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 z-0">
                    <Sparkles size={12} className="text-[#D97706]" /> Popular
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg text-[#0F2820]">{template.name}</h3>
                  <span className="text-xs font-semibold text-[#1D9E75] bg-[#E8F5F1] px-2 py-1 rounded-md capitalize">
                    {template.type}
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-medium">{template.style}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50 safe-area-bottom pb-6">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#0F2820]">
          <Home size={24} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/my-site" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#0F2820]">
          <MonitorSmartphone size={24} />
          <span className="text-[10px] font-medium">My Site</span>
        </Link>
        <Link href="/templates" className="flex flex-col items-center gap-1 text-[#1D9E75]">
          <LayoutTemplate size={24} />
          <span className="text-[10px] font-bold">Templates</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#0F2820]">
          <Settings size={24} />
          <span className="text-[10px] font-medium">Settings</span>
        </Link>
      </div>

      {/* Full Screen Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-[100] flex bg-white animate-in slide-in-from-bottom-4 duration-300">
          
          {/* Left Panel - Info */}
          <div className="w-full md:w-96 bg-[#F4F5F7] border-r border-gray-200 h-full flex flex-col relative z-20">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white">
               <button 
                onClick={() => setPreviewTemplate(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
               >
                 <X size={20} className="text-gray-600" />
               </button>
               <div className="flex bg-gray-100 p-1 rounded-lg">
                 <button 
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-1.5 rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-white shadow-sm text-[#0F2820]' : 'text-gray-500 hover:text-[#0F2820]'}`}
                 >
                   <Monitor size={16} />
                 </button>
                 <button 
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-1.5 rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-white shadow-sm text-[#0F2820]' : 'text-gray-500 hover:text-[#0F2820]'}`}
                 >
                   <Smartphone size={16} />
                 </button>
               </div>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto">
              <span className="inline-block px-3 py-1 bg-[#1D9E75]/10 text-[#1D9E75] text-xs font-bold uppercase tracking-widest rounded-md mb-4">
                {previewTemplate.type}
              </span>
              <h2 className="text-3xl font-bold text-[#0F2820] mb-2">{previewTemplate.name}</h2>
              <p className="text-gray-500 font-medium mb-8">A highly converting layout perfect for establishing a premium digital presence.</p>
              
              <div className="space-y-4 mb-8">
                <h4 className="font-bold text-[#0F2820] uppercase text-xs tracking-wider">Included Features</h4>
                {previewTemplate.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#1D9E75]/20 flex items-center justify-center">
                      <Check size={12} className="text-[#1D9E75]" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white border-t border-gray-200">
               <Link 
                  href={`/build/${previewTemplate.type}`}
                  className="w-full py-4 bg-[#1D9E75] text-white font-bold rounded-xl hover:bg-[#168A65] transition-colors flex justify-center items-center gap-2"
                >
                  Use This Template <ChevronRight size={18} />
                </Link>
            </div>
          </div>

          {/* Right Panel - Preview Area */}
          <div className="hidden md:flex flex-1 bg-gray-100 items-center justify-center p-8 overflow-hidden relative">
            <div className={`transition-all duration-500 ease-in-out relative rounded-xl overflow-hidden shadow-2xl border-4 border-gray-800 ${
              previewMode === 'mobile' ? 'w-[375px] h-[812px]' : 'w-full max-w-5xl h-[85vh]'
            }`}>
               {/* Mock website view (using an iframe or the image for now) */}
               <Image 
                  src={previewTemplate.image} 
                  alt="Preview"
                  fill
                  className="object-cover object-top"
                />
                
                {/* Fake Browser Top Bar for Desktop */}
                {previewMode === 'desktop' && (
                  <div className="absolute top-0 left-0 right-0 h-10 bg-gray-800 flex items-center px-4 gap-2 border-b border-gray-700 z-10">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-4 flex-1 bg-gray-900 rounded-md h-6 flex items-center px-3">
                      <span className="text-[10px] text-gray-400 font-mono">zemenco.com/preview/{previewTemplate.type}</span>
                    </div>
                  </div>
                )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
