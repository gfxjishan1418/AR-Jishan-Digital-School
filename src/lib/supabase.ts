import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Detect if real Supabase credentials have been configured
export const isSupabaseConfigured = 
  Boolean(supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-project') &&
  supabaseUrl.startsWith('https://'));

// Create public anonymous client (never service role in browser)
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export interface SupabaseConnectionStatus {
  isConfigured: boolean;
  url: string;
  hasKey: boolean;
}

export const getSupabaseStatus = (): SupabaseConnectionStatus => ({
  isConfigured: isSupabaseConfigured,
  url: supabaseUrl ? (supabaseUrl.substring(0, 25) + '...') : 'Not configured',
  hasKey: Boolean(supabaseAnonKey),
});
