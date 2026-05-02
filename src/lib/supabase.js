import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
// Accept either a full URL or bare project ref (e.g. "ndrfhxmvywrnljiqtroe")
const supabaseUrl = rawUrl.startsWith('http')
  ? rawUrl
  : `https://${rawUrl}.supabase.co`

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
