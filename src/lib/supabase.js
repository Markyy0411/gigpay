import { createClient } from '@supabase/supabase-js'

// Using Vite Proxy to completely bypass Windows Antivirus!
const supabaseUrl = '/api/supabase';
const supabaseAnonKey = 'sb_publishable_uimxpjAcUVlf4mqite3pZg_zhrrzy3Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
