const createNextIntlPlugin = require('next-intl/plugin')
const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'fkyygvwfcmcjgsjpfubz.supabase.co'],
  },
}

module.exports = withNextIntl(nextConfig)
