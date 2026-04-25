import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export default async function BuildLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the user's subscription status from the database
  const { data: profile } = await supabase
    .from('users')
    .select('subscription_status')
    .eq('id', user.id)
    .single()

  // Gate the /build route based on subscription status
  // Allow 'active' or 'trialing' subscriptions.
  if (profile?.subscription_status !== 'active' && profile?.subscription_status !== 'trialing') {
    redirect('/dashboard?error=subscription_required')
  }

  return (
    <div className="min-h-screen bg-bg-dark text-white">
      {children}
    </div>
  )
}
