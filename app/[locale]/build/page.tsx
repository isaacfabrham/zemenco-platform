'use client';

import { Link } from '@/navigation';
import { useTranslations } from 'next-intl';

export default function BuildOverviewPage() {
  const t = useTranslations('templates');
  
  return (
    <div className="container mx-auto px-10 py-20 max-w-[1400px] min-h-screen">
      <div className="text-center mb-16 reveal active">
        <h1 className="text-4xl font-black uppercase tracking-tight italic mb-4">{t('title')}</h1>
        <p className="text-text-muted text-lg uppercase text-[10px] font-black tracking-widest">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { id: 'restaurant', title: t('restaurant.title'), desc: t('restaurant.desc') },
          { id: 'salon', title: t('salon.title'), desc: t('salon.desc') },
          { id: 'dealership', title: t('dealership.title'), desc: t('dealership.desc') }
        ].map((item, index) => (
          <div key={item.id} className={`bg-white p-10 border border-border-color rounded flex flex-col hover:-translate-y-2 transition-transform shadow-soft hover:shadow-hover reveal active delay-${(index + 1) * 100}`}>
            <h3 className="text-2xl font-black uppercase italic mb-4">{item.title}</h3>
            <p className="text-text-muted mb-8 flex-1 text-sm leading-relaxed">{item.desc}</p>
            <Link href={`/build/${item.id}`} className="block w-full px-6 py-4 bg-[#0A0F1C] text-white font-black uppercase text-center rounded-lg hover:bg-brand-gold transition-colors text-xs tracking-widest">
              {t('cta')}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
