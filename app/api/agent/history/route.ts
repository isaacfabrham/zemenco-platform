import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: Request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(req.url)
    const siteId = searchParams.get('siteId')

    if (!siteId) return NextResponse.json({ error: 'Missing siteId' }, { status: 400 })

    const { data, error } = await supabase
      .from('edit_history')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ history: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { siteId, historyId } = await req.json()

    if (!siteId || !historyId) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })

    // 1. Get the snapshot
    const { data: snapshot, error: fetchError } = await supabase
      .from('edit_history')
      .select('site_data_snapshot')
      .eq('id', historyId)
      .single()

    if (fetchError) throw fetchError

    // 2. Update the site
    const { error: updateError } = await supabase
      .from('sites')
      .update({ site_data: snapshot.site_data_snapshot })
      .eq('id', siteId)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
