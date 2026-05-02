import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'

const intlMiddleware = createMiddleware({
  locales: ['en', 'am', 'ti', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
})

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow all public routes through without any auth check
  const publicPaths = [
    '/',
    '/login',
    '/signup',
    '/auth/callback',
    '/api/auth',
    '/api/payments/webhook',
    '/_next',
    '/favicon.ico',
    '/logo.png',
  ]

  const isPublic = publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'))
  if (isPublic) return intlMiddleware(request)

  // Protect only these routes
  const protectedPaths = ['/dashboard', '/build', '/admin']
  const isProtected = protectedPaths.some(path => pathname.includes(path))

  if (isProtected) {
    // Check for potential Supabase cookies
    const hasSession = request.cookies.getAll().some(cookie => cookie.name.includes('auth-token') || cookie.name.includes('access-token'))
    
    if (!hasSession) {
      const locale = pathname.split('/')[1] || 'en'
      const loginUrl = new URL(`/${locale}/login`, request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)',
  ]
}
