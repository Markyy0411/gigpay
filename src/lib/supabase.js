import { createClient } from '@supabase/supabase-js'

// Strictly hardcoded for demo day to bypass Vercel caching
const supabaseUrl = 'https://gulshfticoirrpuohdxk.supabase.co';
const supabaseAnonKey = 'sb_publishable_uimxpjAcUVlf4mqite3pZg_zhrrzy3Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
