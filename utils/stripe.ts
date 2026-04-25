import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummyKeyToPreventBuildCrash', {
  apiVersion: '2024-04-10',
  appInfo: {
    name: 'Zemen Co. Platform',
    version: '0.1.0',
  },
})
