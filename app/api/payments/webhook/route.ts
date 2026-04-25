import { NextResponse } from 'next/server'
import { stripe } from '@/utils/stripe'
import { createAdminClient } from '@/utils/supabase/admin'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const payload = await req.text()
  const sig = req.headers.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const supabase = createAdminClient()

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription
    const userId = subscription.metadata.userId
    const plan = subscription.metadata.plan

    if (userId) {
      // Update or insert subscription in database
      await supabase.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: subscription.customer as string,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        plan: plan,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
      }, { onConflict: 'stripe_subscription_id' })

      // Update user subscription status
      await supabase.from('users').update({
        subscription_status: subscription.status,
        plan_type: plan
      }).eq('id', userId)
    }
  } else if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    
    // Fetch the user associated with this subscription
    const { data: subData } = await supabase.from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscription.id)
      .single()

    if (subData) {
      await supabase.from('subscriptions').update({
        status: subscription.status,
      }).eq('stripe_subscription_id', subscription.id)

      await supabase.from('users').update({
        subscription_status: subscription.status,
      }).eq('id', subData.user_id)
    }
  }

  return NextResponse.json({ received: true })
}
