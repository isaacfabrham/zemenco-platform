import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { templateType, siteData } = await req.json()

    if (!templateType || !siteData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Upsert site data
    const { data, error } = await supabase
      .from('sites')
      .upsert({
        user_id: user.id,
        template_type: templateType,
        site_data: siteData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,template_type' })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, site: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
