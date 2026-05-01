import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { siteId, changeDescription, siteDataSnapshot } = await req.json()

    const { error } = await supabase
      .from('edit_history')
      .insert({
        site_id: siteId,
        user_id: user.id,
        change_description: changeDescription,
        site_data_snapshot: siteDataSnapshot
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
