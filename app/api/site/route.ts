import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: Request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(req.url)
    const siteId = searchParams.get('id')

    if (!siteId) {
      return NextResponse.json({ error: 'Missing site ID' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', siteId)
      .single()

    if (error) throw error

    return NextResponse.json({ site: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { siteId } = await req.json()

    const { error } = await supabase
      .from('sites')
      .delete()
      .match({ id: siteId, user_id: user.id })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
