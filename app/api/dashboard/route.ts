import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
  const { data: sites } = await supabase.from('sites').select('*').eq('user_id', user.id)

  return NextResponse.json({
    user,
    profile,
    sites: sites || []
  })
}
