import { NextResponse } from 'next/server'
import { stripe } from '@/utils/stripe'
import { createClient } from '@/utils/supabase/server'

const PLANS = {
  starter: {
    priceId: process.env.STRIPE_PRICE_STARTER_ID, // You need to set this in .env
    amount: 5000,
  },
  pro: {
    priceId: process.env.STRIPE_PRICE_PRO_ID, // You need to set this in .env
    amount: 15000,
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan, locale } = await req.json()
    const selectedPlan = PLANS[plan as keyof typeof PLANS]

    if (!selectedPlan || !selectedPlan.priceId) {
      return NextResponse.json({ error: 'Invalid plan selected or missing price ID' }, { status: 400 })
    }

    const localePrefix = locale && locale !== 'en' ? `/${locale}` : ''

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      customer_email: user.email,
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          userId: user.id,
          plan: plan,
        }
      },
      success_url: `${new URL(req.url).origin}${localePrefix}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${new URL(req.url).origin}${localePrefix}/`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
