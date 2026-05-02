import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

const locales = ['en', 'am', 'ti', 'ar'];
const publicPages = ['/', '/login', '/signup', '/auth/callback'];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'en'
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Handle Localization first
  const response = intlMiddleware(request);

  // 2. Handle Supabase Auth
  let supabaseResponse = response;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase environment variables are missing. Auth middleware skipped.");
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          supabaseResponse.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          supabaseResponse.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 3. Protected Route Gating
  const isProtectedRoute = pathname.includes('/dashboard') || pathname.includes('/build');

  if (!user && isProtectedRoute) {
    const locale = pathname.split('/')[1] || 'en';
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/', '/(am|en|ti|ar)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
}
