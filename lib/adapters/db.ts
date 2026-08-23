import { supabaseDb, getSupabase } from "./supabase";

export const db = {
  getSupabase,
  ...supabaseDb,
};
