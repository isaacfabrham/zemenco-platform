import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy-url-to-prevent-build-crash.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-service-key-to-prevent-build-crash',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
