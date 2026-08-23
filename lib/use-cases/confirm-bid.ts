import crypto from "crypto";
import { db } from "@/lib/adapters/db";
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
    const parts = signatureHeader.split(";").reduce<Record<string, string>>((acc, part) => {
      const [k, v] = part.split("=");
      if (k && v) acc[k.trim()] = v.trim();
      return acc;
    }, {});

    const ts = parts["ts"];
    const h1 = parts["h1"];

    if (!ts || !h1) return false;

    // Check replay attack window (5 minutes / 300 seconds)
    const timestampNumber = parseInt(ts, 10);
    const now = Math.floor(Date.now() / 1000);
    if (isNaN(timestampNumber) || Math.abs(now - timestampNumber) > 300) {
      console.warn("Paddle webhook signature expired");
      return false;
    }

    // Compute expected HMAC SHA256 signature
    const signedPayload = `${ts}:${rawBody}`;
    const expectedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(signedPayload)
      .digest("hex");

    const h1Buf = Buffer.from(h1, "hex");
    const expectedBuf = Buffer.from(expectedSignature, "hex");

    if (h1Buf.length !== expectedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(h1Buf, expectedBuf);
  } catch {
    return false;
  }
}

export async function confirmBidWebhookUseCase(payload: any) {
  const { event_type, data, event_id } = payload;

  if (!event_type || !data) {
    return { success: false, message: "Invalid webhook payload structure" };
  }

  const supabase = db.getSupabase();

  // 1. Idempotency Check
  const { data: existingBids } = await supabase
    .from("bids")
    .select("id, status")
    .or(`idempotency_key.eq.${event_id},and(paddle_transaction_id.eq.${data.id},status.eq.confirmed)`);

  if (existingBids && existingBids.length > 0) {
    console.log(`Webhook event ${event_id} already processed. Skipping.`);
    return { success: true, deduplicated: true };
  }

  // 2. Handle transaction.completed, transaction.billed, or transaction.paid
  if (
    event_type === "transaction.completed" ||
    event_type === "transaction.billed" ||
    event_type === "transaction.paid"
  ) {
    const customData = data.custom_data || data.customData || {};
    let handle = customData.handle ? String(customData.handle).trim() : null;
    let websiteUrl = customData.website_url ? String(customData.website_url).trim() : null;
    let targetBid = parseFloat(customData.target_bid_amount || customData.target_bid);

    // Fallback lookup in pending bids table if custom data missing
    if (!handle || isNaN(targetBid)) {
      const pendingBid = await db.getPendingBidByTxnId(data.id);
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

    // Execute atomic bid confirmation stored procedure via Cloud Supabase RPC
    const rpcResult = await db.confirmBidAtomic(handle, websiteUrl, targetBid, data.id);

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
