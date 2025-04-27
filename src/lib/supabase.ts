import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
      autoRefreshToken: true,
      storage: window.localStorage,
      storageKey: 'supabase.auth.token',
      flowType: 'implicit'
    }
  }
);

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
    // Clear any stored session data
    window.localStorage.removeItem('supabase.auth.token');
  }
});

export default supabase;