import { createClient, SupabaseClient } from "@supabase/supabase-js";

let serverClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (serverClient) return serverClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "";

  if (!url || !key) {
    console.warn("[SUPABASE_WARN] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
  }

  serverClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return serverClient;
}

export const supabaseDb = {
  async getLeaderboard(limit = 50, offset = 0) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("startups")
      .select("id, handle, website_url, total_bid, created_at, updated_at")
      .eq("is_hidden", false)
      .order("total_bid", { ascending: false })
      .order("updated_at", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("[SUPABASE_GET_LEADERBOARD_ERROR]", error.message);
      throw error;
    }
    return data || [];
  },

  async getRecentActivity(limit = 10) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("bids")
      .select("id, startup_id, handle, target_bid, paddle_transaction_id, status, created_at")
      .eq("status", "confirmed")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[SUPABASE_GET_ACTIVITY_ERROR]", error.message);
      return [];
    }
    return data || [];
  },

  async recordPendingBid(handle: string, targetBid: number, paddleTxnId: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("bids")
      .insert({
        handle,
        target_bid: targetBid,
        paddle_transaction_id: paddleTxnId,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("[SUPABASE_RECORD_BID_ERROR]", error.message);
    }
    return data;
  },

  async getPendingBidByTxnId(paddleTxnId: string) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("bids")
      .select("handle, target_bid, startup_id")
      .eq("paddle_transaction_id", paddleTxnId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn("[SUPABASE_LOOKUP_BID_WARN]", error.message);
      return null;
    }
    return data;
  },

  async getLeader() {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("startups")
      .select("total_bid, handle")
      .eq("is_hidden", false)
      .order("total_bid", { ascending: false })
      .order("updated_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      return null;
    }
    return data;
  },

  async getAllStartupsAdmin(limit = 100, offset = 0) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("startups")
      .select("id, handle, website_url, total_bid, is_hidden, created_at, updated_at")
      .order("total_bid", { ascending: false })
      .order("updated_at", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("[SUPABASE_GET_ADMIN_STARTUPS_ERROR]", error.message);
      throw error;
    }
    return data || [];
  },

  async setStartupHiddenById(id: string, isHidden: boolean) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("startups")
      .update({ is_hidden: isHidden })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[SUPABASE_SET_HIDDEN_ERROR]", error.message);
      throw error;
    }
    return data;
  },

  async setStartupHiddenByHandle(handle: string, isHidden: boolean) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("startups")
      .update({ is_hidden: isHidden })
      .ilike("handle", handle.trim())
      .select();

    if (error) {
      console.error("[SUPABASE_SET_HIDDEN_HANDLE_ERROR]", error.message);
      throw error;
    }
    return data;
  },

  async confirmBidAtomic(
    handle: string,
    websiteUrl: string | null | undefined,
    targetBid: number,
    paddleTransactionId: string
  ) {
    const supabase = getSupabase();
    const { data, error } = await supabase.rpc("confirm_bid_atomic", {
      p_handle: handle,
      p_website_url: websiteUrl || null,
      p_target_bid: targetBid,
      p_paddle_transaction_id: paddleTransactionId,
    });

    if (error) {
      console.error("[SUPABASE_RPC_ERROR] confirm_bid_atomic failed:", error.message);
      throw error;
    }
    return data;
  },

  async incrementVisitors(): Promise<number> {
    const supabase = getSupabase();
    const { data, error } = await supabase.rpc("increment_site_visitors");
    if (error || data === null) {
      return 1;
    }
    return Number(data);
  },

  async getVisitorCount(): Promise<number> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("site_analytics")
      .select("total_visitors")
      .eq("id", "global")
      .maybeSingle();

    if (error || !data) {
      return 0;
    }
    return Number(data.total_visitors || 0);
  },
};
