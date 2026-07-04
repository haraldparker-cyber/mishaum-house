import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Surfaces a clear error in the browser console instead of a silent failure
  // if the two environment variables weren't set in Vercel.
  console.error(
    "Missing Supabase config. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY " +
    "are set as Environment Variables in the Vercel project settings."
  );
}

export const supabase = createClient(url, anonKey);
