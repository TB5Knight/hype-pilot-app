import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables.\n' +
    'Make sure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY ' +
    'are set in .env.local and that you restarted the dev server after editing the file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
