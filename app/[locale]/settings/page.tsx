'use client';

import { useState } from 'react';
import { Link } from '@/navigation';
import {
  Home, LayoutTemplate, Settings, MonitorSmartphone,
  User, CreditCard, Bell, Shield, Globe, ChevronRight,
  Camera, Check, Loader2
} from 'lucide-react';

type Section = 'profile' | 'subscription' | 'notifications' | 'security' | 'language';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Profile state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Notifications state
  const [emailNotifs, setEmailNotifs] = useState(true);

  // Language state
  const [language, setLanguage] = useState('en');

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const sections = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'subscription' as const, label: 'Subscription', icon: CreditCard },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'language' as const, label: 'Language', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans flex flex-col md:flex-row text-[#0F2820]">

      {/* App Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 px-4 py-8 shadow-sm z-10">
        <div className="font-extrabold text-2xl tracking-tighter mb-10 px-4">ZEMEN CO.</div>
        <nav className="space-y-1 flex-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#0F2820] font-medium rounded-xl transition-all">
            <Home size={20} /> Home
          </Link>
          <Link href="/my-site" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#0F2820] font-medium rounded-xl transition-all">
            <MonitorSmartphone size={20} /> My Website
          </Link>
          <Link href="/templates" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#0F2820] font-medium rounded-xl transition-all">
            <LayoutTemplate size={20} /> Templates
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 bg-[#E8F5F1] text-[#1D9E75] font-semibold rounded-xl transition-all">
            <Settings size={20} /> Settings
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 mb-24 md:mb-0">

        <header className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your account and preferences.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-8">

          {/* Settings Nav */}
          <aside className="md:w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-semibold text-left border-b border-gray-100 last:border-0 transition-colors ${
                    activeSection === s.id
                      ? 'bg-[#E8F5F1] text-[#1D9E75]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#0F2820]'
                  }`}
                >
                  <s.icon size={18} />
                  {s.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Section Content */}
          <div className="flex-1">
            {activeSection === 'profile' && (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-xl font-bold mb-8">Profile</h2>

                {/* Avatar */}
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-[#E8F5F1] flex items-center justify-center text-[#1D9E75] text-2xl font-bold">
                      {firstName ? firstName[0].toUpperCase() : 'Z'}
                    </div>
                    <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#0F2820] text-white rounded-full flex items-center justify-center hover:bg-[#163B2F] transition-colors shadow-md">
                      <Camera size={14} />
                    </button>
                  </div>
                  <div>
                    <p className="font-bold text-[#0F2820]">Profile Photo</p>
                    <p className="text-sm text-gray-500 mt-0.5">JPG or PNG, max 2MB</p>
                    <button className="text-sm text-[#1D9E75] font-semibold hover:underline mt-2">Upload new photo</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Isaac"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Abraham"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 transition-all font-medium"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-8 py-3 bg-[#1D9E75] text-white font-bold rounded-xl hover:bg-[#168A65] transition-all flex items-center gap-2 disabled:opacity-70 active:scale-[0.97]"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : null}
                  {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            )}

            {activeSection === 'subscription' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
                  <h2 className="text-xl font-bold mb-6">Subscription</h2>
                  <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-200 mb-6">
                    <div>
                      <p className="font-bold text-[#0F2820]">Free Preview</p>
                      <p className="text-sm text-gray-500 mt-0.5">No active subscription</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full uppercase">Free</span>
                  </div>
                  <div className="flex gap-4">
                    <Link href="/#pricing" className="flex-1 py-3 bg-[#1D9E75] text-white font-bold rounded-xl hover:bg-[#168A65] transition-all text-center shadow-sm">
                      Upgrade Plan
                    </Link>
                    <button className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">
                      Manage Billing
                    </button>
                  </div>
                </div>
                <div className="bg-[#E8F5F1] rounded-3xl border border-[#A7F3D0] p-6">
                  <p className="font-bold text-[#065F46] mb-1">Usage</p>
                  <div className="flex justify-between text-sm text-[#065F46]/80 mb-2">
                    <span>Sites created</span><span className="font-semibold">1 / 1</span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div className="h-full w-full bg-[#1D9E75] rounded-full" />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-xl font-bold mb-8">Notifications</h2>
                <div className="space-y-6">
                  {[
                    { label: 'New form submissions', desc: 'Get notified when a customer fills out your contact form', value: emailNotifs, set: setEmailNotifs },
                    { label: 'Billing reminders', desc: 'Receive reminders before your subscription renews', value: true, set: () => {} },
                    { label: 'Product updates', desc: 'Hear about new Zemen Co. features and improvements', value: false, set: () => {} },
                  ].map((notif) => (
                    <div key={notif.label} className="flex justify-between items-start gap-6 py-5 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-semibold text-[#0F2820]">{notif.label}</p>
                        <p className="text-sm text-gray-500 mt-1">{notif.desc}</p>
                      </div>
                      <button
                        onClick={() => notif.set(!notif.value)}
                        className={`relative shrink-0 w-12 h-6 rounded-full transition-colors ${notif.value ? 'bg-[#1D9E75]' : 'bg-gray-200'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${notif.value ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-xl font-bold mb-8">Security</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 transition-all font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Confirm Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 transition-all font-medium" />
                  </div>
                  <button className="px-8 py-3 bg-[#0F2820] text-white font-bold rounded-xl hover:bg-[#163B2F] transition-all active:scale-[0.97]">
                    Update Password
                  </button>
                  <div className="flex justify-between items-center py-5 border-t border-gray-100 mt-4">
                    <div>
                      <p className="font-semibold text-[#0F2820]">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account.</p>
                    </div>
                    <button className="px-5 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all text-sm">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'language' && (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-xl font-bold mb-8">Language Preference</h2>
                <div className="space-y-3">
                  {[
                    { code: 'en', label: 'English', flag: '🇺🇸' },
                    { code: 'am', label: 'አማርኛ (Amharic)', flag: '🇪🇹' },
                    { code: 'ti', label: 'ትግርኛ (Tigrinya)', flag: '🇪🇷' },
                    { code: 'ar', label: 'العربية (Arabic)', flag: '🇸🇦' },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all font-medium ${
                        language === lang.code
                          ? 'border-[#1D9E75] bg-[#E8F5F1] text-[#065F46]'
                          : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-200'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-2xl">{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                      {language === lang.code && <Check size={18} className="text-[#1D9E75]" />}
                    </button>
                  ))}
                </div>
                <Link
                  href={`/${language}/settings`}
                  className="mt-8 block w-full py-3 bg-[#1D9E75] text-white font-bold rounded-xl hover:bg-[#168A65] transition-all text-center shadow-sm active:scale-[0.97]"
                >
                  Apply Language
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50 pb-6">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-gray-400"><Home size={24} /><span className="text-[10px] font-medium">Home</span></Link>
        <Link href="/my-site" className="flex flex-col items-center gap-1 text-gray-400"><MonitorSmartphone size={24} /><span className="text-[10px] font-medium">My Site</span></Link>
        <Link href="/templates" className="flex flex-col items-center gap-1 text-gray-400"><LayoutTemplate size={24} /><span className="text-[10px] font-medium">Templates</span></Link>
        <Link href="/settings" className="flex flex-col items-center gap-1 text-[#1D9E75]"><Settings size={24} /><span className="text-[10px] font-bold">Settings</span></Link>
      </div>
    </div>
  );
}
