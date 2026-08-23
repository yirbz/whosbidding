import crypto from "crypto";
import { getSupabaseServerClient } from "@/lib/adapters/supabase-server";

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
  if (event_type === "transaction.completed") {
    const customData = data.custom_data || {};
    const handle = customData.handle;
    const websiteUrl = customData.website_url || null;
    const targetBid = parseFloat(customData.target_bid_amount);

    if (!handle || isNaN(targetBid)) {
      console.error("Missing customData in Paddle transaction:", data.id);
      return { success: false, message: "Missing customData parameters" };
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

    // Broadcast real-time outbid and activity events via Supabase Realtime channel
    const channel = supabase.channel("leaderboard_live");
    await channel.send({
      type: "broadcast",
      event: "new_bid_activity",
      payload: {
        startup_name: handle,
        incremental_amount: targetBid,
      },
    });

    await channel.send({
      type: "broadcast",
      event: "outbid",
      payload: {
        new_leader_name: handle,
        new_leader_bid: targetBid,
      },
    });

    console.log("Atomic bid placement confirmed:", rpcResult);
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
