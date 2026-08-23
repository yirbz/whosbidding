import crypto from "crypto";
import { getSupabaseServerClient } from "@/lib/adapters/supabase-server";
import { invalidateLeaderboardCache } from "@/lib/adapters/redis";
import { sseBroadcaster } from "@/lib/adapters/sse-broadcaster";
import { getLeaderboardData } from "@/lib/use-cases/get-leaderboard";

export function verifyPaddleWebhookSignature(
  rawBody: string,
  signatureHeader: string,
  secretKey: string
): boolean {
  if (!signatureHeader || !secretKey) return false;

  try {
    const parts = signatureHeader.split(";").reduce((acc, item) => {
      const [key, value] = item.split("=");
      if (key && value) acc[key.trim()] = value.trim();
      return acc;
    }, {} as Record<string, string>);

    const ts = parts["ts"];
    const h1 = parts["h1"];

    if (!ts || !h1) return false;

    // Reject timestamps older than 5 minutes (300s)
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - parseInt(ts, 10)) > 300) {
      console.warn("Paddle webhook signature expired");
      return false;
    }

    const payload = `${ts}:${rawBody}`;
    const computedHash = crypto
      .createHmac("sha256", secretKey)
      .update(payload)
      .digest("hex");

    const bufA = Buffer.from(computedHash, "hex");
    const bufB = Buffer.from(h1, "hex");

    if (bufA.length !== bufB.length) return false;

    return crypto.timingSafeEqual(bufA, bufB);
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}

export async function confirmBidWebhookUseCase(eventPayload: any) {
  const supabase = getSupabaseServerClient();
  const { event_id, event_type, data } = eventPayload;

  if (!event_id || !data?.id) {
    return { success: false, message: "Invalid payload format" };
  }

  // 1. Deduplication / Idempotency Check
  const { error: insertErr } = await supabase
    .from("processed_webhook_events")
    .insert({
      event_id,
      transaction_id: data.id,
      event_type,
    });

  if (insertErr && insertErr.code === "23505") {
    console.log(`Webhook event ${event_id} already processed. Skipping.`);
    return { success: true, duplicate: true };
  }

  // 2. Handle transaction.completed
  if (event_type === "transaction.completed" || event_type === "transaction.billed" || event_type === "transaction.paid") {
    const customData = data.custom_data || {};
    let handle = customData.handle ? String(customData.handle).trim() : null;
    let websiteUrl = customData.website_url ? String(customData.website_url).trim() : null;
    let targetBid = parseFloat(customData.target_bid_amount || customData.target_bid);

    // Fallback: If custom_data was not included or missing, look up the pending bid in the database
    if (!handle || isNaN(targetBid)) {
      const { data: pendingBid } = await supabase
        .from("bids")
        .select("handle, target_bid, startup_id")
        .eq("paddle_transaction_id", data.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (pendingBid) {
        handle = handle || pendingBid.handle;
        targetBid = isNaN(targetBid) ? parseFloat(pendingBid.target_bid) : targetBid;
      }
    }

    // Secondary fallback: parse from transaction total if available
    if (isNaN(targetBid) && data.details?.totals?.total) {
      targetBid = parseFloat(data.details.totals.total) / 100;
    }

    if (!handle || isNaN(targetBid) || targetBid < 1.00) {
      console.error("Missing handle or valid target_bid in Paddle transaction:", data.id);
      return { success: false, message: "Missing handle or valid target_bid parameter" };
    }

    // Execute atomic bid confirmation stored procedure
    const { data: rpcResult, error: rpcErr } = await supabase.rpc("confirm_bid_atomic", {
      p_handle: handle,
      p_website_url: websiteUrl,
      p_target_bid: targetBid,
      p_paddle_transaction_id: data.id,
    });

    if (rpcErr) {
      console.error("confirm_bid_atomic RPC error:", rpcErr);
      return { success: false, message: rpcErr.message };
    }

    // Invalidate Redis cache immediately
    await invalidateLeaderboardCache();

    // Push real-time update to all connected SSE clients
    try {
      const fresh = await getLeaderboardData(50, 0);
      sseBroadcaster.broadcast("leaderboard_update", fresh.data);
      console.log(`[SSE_BROADCAST] Pushed webhook update to ${sseBroadcaster.clientCount} clients.`);
    } catch (sseErr) {
      console.warn("[SSE_BROADCAST_WARN] Broadcast skipped:", sseErr);
    }

    console.log("[CONFIRM_BID_SUCCESS] Atomic bid placement confirmed:", rpcResult);
    return { success: true, result: rpcResult };
  }

  // 3. Handle transaction.canceled
  if (event_type === "transaction.canceled") {
    await supabase
      .from("bids")
      .update({ status: "failed" })
      .eq("paddle_transaction_id", data.id);

    return { success: true, status: "canceled" };
  }

  return { success: true, ignored: true };
}
