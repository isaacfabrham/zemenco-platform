import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  
  // Detect locale from referer or default to en
  const referer = request.headers.get('referer')
  const localeMatch = referer?.match(/\/(en|am|ti|ar)(\/|$)/)
  const locale = localeMatch ? localeMatch[1] : 'en'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const cookieStore = cookies()
      const plan = cookieStore.get('selected_plan')?.value
      
      if (plan) {
        return NextResponse.redirect(`${origin}/${locale}/checkout?plan=${plan}`)
      }
      
      const finalRedirect = next.startsWith('/') ? `${origin}/${locale}${next === '/' ? '/dashboard' : next}` : `${origin}/${locale}/dashboard`
      return NextResponse.redirect(finalRedirect)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/${locale}/login?error=Could not authenticate user`)
}
