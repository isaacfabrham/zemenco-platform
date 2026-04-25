import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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
    <div className="min-h-screen bg-bg-surface text-text-main p-10">
      <div className="max-w-[1200px] mx-auto">
        <header className="flex justify-between items-center mb-16">
          <h1 className="text-4xl font-bold">Client Dashboard</h1>
          <form action="/api/auth" method="POST">
            <input type="hidden" name="action" value="logout" />
            <button type="submit" className="px-6 py-2 border border-border-color rounded hover:bg-white transition-colors">
              Log Out
            </button>
          </form>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Subscription Status Widget */}
          <div className="col-span-1 bg-white p-8 border border-border-color rounded shadow-soft">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Subscription</h2>
            <div className="mb-4">
              <span className="text-text-muted">Status: </span>
              <span className={`font-bold uppercase ${isSubscribed ? 'text-brand-green' : 'text-brand-red'}`}>
                {profile?.subscription_status || 'Inactive'}
              </span>
            </div>
            {profile?.plan_type && (
              <div className="mb-8">
                <span className="text-text-muted">Plan: </span>
                <span className="font-bold capitalize">{profile.plan_type}</span>
              </div>
            )}
            
            {!isSubscribed ? (
              <Link href="/#pricing" className="block w-full text-center px-6 py-3 bg-brand-gold text-white font-bold uppercase rounded hover:bg-brand-gold/90 transition-colors">
                Upgrade Plan
              </Link>
            ) : (
              <p className="text-sm text-text-muted">Manage billing through your Stripe Customer Portal.</p>
            )}
          </div>

          {/* Sites Widget */}
          <div className="col-span-1 md:col-span-2 bg-white p-8 border border-border-color rounded shadow-soft">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold uppercase tracking-widest">Your Sites</h2>
              {isSubscribed && (
                <Link href="/build" className="px-4 py-2 bg-text-main text-white text-sm font-bold uppercase rounded hover:bg-brand-gold transition-colors">
                  Create New
                </Link>
              )}
            </div>
            
            {!sites || sites.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-border-color rounded">
                <p className="text-text-muted mb-4">You haven&apos;t built any sites yet.</p>
                {isSubscribed ? (
                  <Link href="/build" className="text-brand-gold font-bold hover:underline">Start Building</Link>
                ) : (
                  <span className="text-text-muted text-sm">Active subscription required.</span>
                )}
              </div>
            ) : (
              <ul className="space-y-4">
                {sites.map(site => (
                  <li key={site.id} className="flex justify-between items-center p-4 border border-border-color rounded hover:border-brand-gold transition-colors">
                    <div>
                      <h3 className="font-bold capitalize">{site.template_type} Site</h3>
                      <p className="text-sm text-text-muted">Created: {new Date(site.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-4">
                      <Link href={`/build/${site.template_type}`} className="text-sm font-semibold hover:text-brand-gold">Edit</Link>
                      <Link href={`/site/${site.id}`} target="_blank" className="text-sm font-semibold text-brand-gold hover:underline">View Live</Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
