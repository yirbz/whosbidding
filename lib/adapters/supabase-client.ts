import { createClient } from "@supabase/supabase-js";

let supabaseBrowserClient: any = null;

export function getSupabaseBrowserClient() {
  if (typeof window !== "undefined" && supabaseBrowserClient) {
    return supabaseBrowserClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.placeholder-anon-key";

  const client = createClient(supabaseUrl, supabaseAnonKey);

  if (typeof window !== "undefined") {
    supabaseBrowserClient = client;
  }

  return client;
}
