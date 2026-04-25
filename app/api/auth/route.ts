import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const { email, password, action, plan } = await request.json()
    const supabase = createClient()

    if (action === 'signup') {
      if (plan) {
        cookies().set('selected_plan', plan, { maxAge: 60 * 60 }) // 1 hour
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${new URL(request.url).origin}/auth/callback`,
        },
      })
      if (error) throw error
      return NextResponse.json({ user: data.user })
    }

    if (action === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      
      // Check if user has 2FA enabled, handle TOTP flow in a real implementation
      return NextResponse.json({ user: data.user })
    }

    if (action === 'logout') {
      await supabase.auth.signOut()
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
