import { createClient } from '@supabase/supabase-js';

export const HOGAR_ID = '00000000-0000-0000-0000-000000000001';

export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string,
);
