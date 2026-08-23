import { createClient } from "@supabase/supabase-js";

export function getSupabaseServerClient() {
  const supabaseUrl = process.env.SUPABASE_INTERNAL_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0MDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.placeholder-service-key";

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  });
}
