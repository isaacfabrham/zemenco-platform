import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const intlMiddleware = createMiddleware({
  locales: ['en', 'am', 'ti', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
})

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/auth/callback') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const protectedRoutes = ['/dashboard', '/build', '/my-site', '/settings', '/templates']
  const isProtected = protectedRoutes.some(route => {
    // Match either the exact path or paths starting with the route (handling locales)
    const segments = pathname.split('/')
    return segments.includes(route.replace('/', ''))
  })

  if (isProtected) {
    const hasSession = request.cookies.getAll().some(c =>
      c.name.includes('supabase') || c.name.includes('sb-')
    )
    if (!hasSession) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)']
}
