const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
  console.log('Setting up Supabase Storage...')
  
  const { data: buckets, error: listError } = await supabase.storage.listBuckets()
  if (listError) {
    console.error('Error listing buckets:', listError)
    return
  }

  const bucketExists = buckets.find(b => b.name === 'site-images')

  if (!bucketExists) {
    console.log('Creating site-images bucket...')
    const { error: createError } = await supabase.storage.createBucket('site-images', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
    })
    
    if (createError) {
      console.error('Error creating bucket:', createError)
    } else {
      console.log('Bucket created successfully.')
    }
  } else {
    console.log('site-images bucket already exists.')
  }
}

setupStorage()
