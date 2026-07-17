import { createClient } from '@supabase/supabase-js'

// Smart routing: Bypass Windows Antivirus on localhost via Proxy, use direct URL on Vercel
const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const supabaseUrl = isLocalhost ? 'http://localhost:5173/api/supabase' : 'https://gulshfticoirrpuohdxk.supabase.co';
const supabaseAnonKey = 'sb_publishable_uimxpjAcUVlf4mqite3pZg_zhrrzy3Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
