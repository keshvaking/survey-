import 'server-only'
import { createClient } from '@supabase/supabase-js'

// Service-role client used ONLY on the server (e.g. the /admin route).
// It bypasses RLS so it can SELECT rows that the public policy forbids.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  )
}
