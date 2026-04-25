import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { templateType, businessName, published, ...siteData } = body

    // Generate unique slug
    let slug = businessName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    
    // Check for collisions (simplified)
    const { data: existing } = await supabase.from('sites').select('id').eq('slug', slug).single()
    if (existing) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`
    }

    const { data, error } = await supabase
      .from('sites')
      .upsert({
        user_id: user.id,
        template_type: templateType,
        site_data: { ...siteData, businessName },
        published: published,
        slug: slug,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id, template_type' }) // One site per industry per user for now
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, slug: slug, site: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(req.url)
    const siteId = searchParams.get('id')
    const slug = searchParams.get('slug')

    let query = supabase.from('sites').select('*')
    
    if (siteId) {
      query = query.eq('id', siteId)
    } else if (slug) {
      query = query.eq('slug', slug)
    } else {
      return NextResponse.json({ error: 'Missing site ID or slug' }, { status: 400 })
    }

    const { data, error } = await query.single()

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
