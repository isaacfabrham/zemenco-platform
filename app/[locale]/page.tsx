'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname, Link } from '@/navigation';

export default function Home() {
  const tNav = useTranslations('nav');
  const tHero = useTranslations('hero');
  const tProcess = useTranslations('process');
  const tTemplates = useTranslations('templates');
  const tPricing = useTranslations('pricing');
  const tFooter = useTranslations('footer');
  
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLangChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <main className="min-h-screen bg-bg-surface text-text-main font-sans">
      
      {/* Navigation */}
      <header className="fixed top-0 w-full h-[90px] glass-header z-50 flex items-center reveal active">
        <div className="container mx-auto px-10 flex justify-between items-center w-full max-w-[1400px]">
          <Link href="/" className="flex items-center gap-4 hover-target">
            <div className="font-extrabold text-xl tracking-tighter">ZEMEN CO.</div>
          </Link>
          <nav className="hidden md:flex items-center gap-12">
            <Link href="#expertise" className="text-sm font-semibold text-text-muted uppercase tracking-widest hover:text-text-main transition-colors">{tNav('expertise')}</Link>
            <Link href="#pricing" className="text-sm font-semibold text-text-muted uppercase tracking-widest hover:text-text-main transition-colors">{tNav('pricing')}</Link>
            <Link href="#reviews" className="text-sm font-semibold text-text-muted uppercase tracking-widest hover:text-text-main transition-colors">{tNav('reviews')}</Link>
          </nav>
          <div className="flex items-center gap-6">
            <select 
              value={locale} 
              onChange={(e) => handleLangChange(e.target.value)}
              className="bg-transparent font-semibold cursor-pointer outline-none"
            >
              <option value="en">EN</option>
              <option value="am">አማ</option>
              <option value="ti">ትግ</option>
              <option value="ar">عرب</option>
            </select>
            <Link href="/login" className="px-7 py-3.5 bg-text-main text-bg-white font-semibold text-sm rounded uppercase hover:bg-brand-gold hover:-translate-y-1 transition-all">
              {tNav('startScaling')}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-[220px] pb-[160px] relative flex flex-col items-center text-center px-4 overflow-hidden">
        <div className="mesh-gradient" />
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[45vw] font-black text-bg-dark opacity-5 pointer-events-none z-0 tracking-tighter reveal active">
          ዘመን
        </div>
        <div className="relative z-10 max-w-[1200px] flex flex-col items-center">
          <div className="mask-wrap mb-10">
            <h1 className="text-5xl md:text-[6.5vw] leading-[0.95] font-bold uppercase tracking-tighter mask-inner active">
              <span className="block">{tHero('title1')}</span>
              <span className="block">{tHero('title2')} <span className="text-brand-gold">{tHero('title3')}</span></span>
            </h1>
          </div>
          <p className="text-xl text-text-muted max-w-[700px] leading-relaxed mb-14 reveal active delay-200">
            {tHero('subtitle')}
          </p>
          <Link href="/build" className="px-12 py-5 bg-text-main text-bg-white font-semibold text-lg rounded uppercase hover:bg-brand-gold hover:-translate-y-1 transition-all reveal active delay-300">
            {tHero('cta')}
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="expertise" className="bg-bg-dark text-bg-white py-[120px]">
        <div className="container mx-auto px-10 max-w-[1400px]">
          <div className="text-center mb-20">
            <span className="block text-sm font-semibold text-brand-gold tracking-[0.25em] uppercase mb-4 opacity-80 reveal active">{tProcess('badge')}</span>
            <h2 className="text-5xl font-bold mb-6 tracking-tighter reveal active delay-100">{tProcess('title')}</h2>
            <p className="text-xl text-white/70 max-w-[600px] mx-auto reveal active delay-200">{tProcess('subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: '1', title: tProcess('step1.title'), desc: tProcess('step1.desc'), color: 'bg-brand-green' },
              { step: '2', title: tProcess('step2.title'), desc: tProcess('step2.desc'), color: 'bg-brand-gold' },
              { step: '3', title: tProcess('step3.title'), desc: tProcess('step3.desc'), color: 'bg-brand-red' }
            ].map((item, i) => (
              <div key={i} className={`text-center p-10 card-premium reveal active delay-${(i + 1) * 100}`}>
                <div className={`w-16 h-16 ${item.color} text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-${item.color.split('-')[1]}/20`}>
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-white/70 text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Selector Section */}
      <section id="templates" className="bg-bg-surface py-[120px]">
        <div className="container mx-auto px-10 max-w-[1400px]">
          <div className="text-center mb-20">
            <span className="block text-sm font-semibold text-brand-gold tracking-[0.25em] uppercase mb-4 opacity-80 reveal active">{tTemplates('badge')}</span>
            <h2 className="text-5xl font-bold mb-6 tracking-tighter reveal active delay-100">{tTemplates('title')}</h2>
            <p className="text-xl text-text-muted max-w-[600px] mx-auto reveal active delay-200">{tTemplates('subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-[1100px] mx-auto">
            {[
              { title: tTemplates('restaurant.title'), url: '/build/restaurant', desc: tTemplates('restaurant.desc') },
              { title: tTemplates('salon.title'), url: '/build/salon', desc: tTemplates('salon.desc'), border: 'border-t-4 border-t-brand-green' },
              { title: tTemplates('dealership.title'), url: '/build/dealership', desc: tTemplates('dealership.desc') }
            ].map((item, i) => (
              <div key={i} className={`card-premium p-10 flex flex-col hover:shadow-hover reveal active delay-${(i + 1) * 100} ${item.border || ''}`}>
                <h3 className="text-3xl font-bold mb-4">{item.title}</h3>
                <p className="text-text-muted text-lg mb-8 flex-1">{item.desc}</p>
                <Link href={item.url} className="px-6 py-4 border border-border-color font-semibold uppercase text-center rounded hover:bg-bg-surface transition-colors">
                  {tTemplates('cta')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-bg-surface py-[160px]">
        <div className="container mx-auto px-10 max-w-[1400px]">
          <div className="text-center mb-20">
            <span className="block text-sm font-semibold text-brand-gold tracking-[0.25em] uppercase mb-4 opacity-80 reveal active">{tPricing('badge')}</span>
            <h2 className="text-5xl font-bold mb-6 tracking-tighter reveal active delay-100">{tPricing('title')}</h2>
            <p className="text-xl text-text-muted max-w-[600px] mx-auto reveal active delay-200">{tPricing('subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[1100px] mx-auto">
            {/* Starter Plan */}
            <div className="card-premium p-16 shadow-soft hover:shadow-hover flex flex-col reveal active delay-100">
              <h3 className="text-3xl font-bold mb-4">{tPricing('starter.name')}</h3>
              <div className="text-7xl font-extrabold mb-8 flex items-baseline gap-2 tracking-tighter text-brand-gold">
                {tPricing('starter.price')}<span className="text-xl font-medium text-text-muted tracking-normal">{tPricing('month')}</span>
              </div>
              <p className="text-lg text-text-muted mb-10">{tPricing('starter.desc')}</p>
              <ul className="mb-14 space-y-6 flex-1">
                {(tPricing.raw('starter.features') as string[]).map((feat, i) => (
                  <li key={i} className="flex items-start gap-4 text-lg">
                    <svg className="w-6 h-6 stroke-brand-gold stroke-2 fill-none shrink-0" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=starter" className="px-12 py-5 border border-border-color text-center font-semibold text-lg rounded uppercase hover:bg-bg-surface transition-colors">
                {tPricing('starter.cta')}
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-bg-white p-16 border-2 border-brand-gold rounded-[24px] shadow-hover hover:-translate-y-2 transition-transform flex flex-col relative md:-translate-y-6 reveal active delay-200">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="inline-block px-6 py-2 bg-brand-gold text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full shadow-lg shadow-gold/20">{tPricing('pro.badge')}</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">{tPricing('pro.name')}</h3>
              <div className="text-7xl font-extrabold mb-8 flex items-baseline gap-2 tracking-tighter text-brand-gold">
                {tPricing('pro.price')}<span className="text-xl font-medium text-text-muted tracking-normal">{tPricing('month')}</span>
              </div>
              <p className="text-lg text-text-muted mb-10">{tPricing('pro.desc')}</p>
              <ul className="mb-14 space-y-6 flex-1">
                {(tPricing.raw('pro.features') as string[]).map((feat, i) => (
                  <li key={i} className="flex items-start gap-4 text-lg">
                    <svg className="w-6 h-6 stroke-brand-gold stroke-2 fill-none shrink-0" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=pro" className="px-12 py-5 bg-brand-gold text-white text-center font-semibold text-lg rounded uppercase hover:bg-brand-dark transition-colors">
                {tPricing('pro.cta')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-dark text-bg-white py-20 text-center reveal active">
        <div className="container mx-auto px-10 max-w-[1400px]">
          <div className="font-extrabold text-2xl tracking-tighter mb-10 inline-block bg-white text-bg-dark px-4 py-2 rounded">ZEMEN CO.</div>
          <div className="text-sm text-white/40" suppressHydrationWarning>
            © {new Date().getFullYear()} Zemen Co. Premium Digital Platforms. {tFooter('rights')}
          </div>
        </div>
      </footer>
    </main>
  );
}
