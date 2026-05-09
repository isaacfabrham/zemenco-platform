const createNextIntlPlugin = require('next-intl/plugin')
// Deployment Fix: 2026-05-09T07:58
const withNextIntl = createNextIntlPlugin('i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'fkyygvwfcmcjgsjpfubz.supabase.co'],
  },
}

module.exports = withNextIntl(nextConfig)
