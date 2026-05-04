import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware({
  locales: ['en', 'am', 'ti', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
})

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/auth/callback') ||
    pathname.includes('.') 
  ) {
    return NextResponse.next()
  }

  // Only protect dashboard and build routes + new Canva/Shopify routes
  const protectedRoutes = ['/dashboard', '/build', '/admin', '/templates', '/my-site', '/settings']
  const isProtected = protectedRoutes.some(route => pathname.includes(route))

  if (isProtected) {
    const cookies = request.cookies
    const hasSession = cookies.has('sb-access-token') || 
                       cookies.has('supabase-auth-token') ||
                       cookies.getAll().some(c => c.name.includes('supabase'))
    if (!hasSession) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)']
}
