import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => {
  const validLocales = ['en', 'am', 'ti', 'ar']
  const resolvedLocale = validLocales.includes(locale ?? '') ? locale! : 'en'
  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default
  }
})
