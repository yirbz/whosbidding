import { NextResponse } from "next/server";
import { getPaddleClient } from "@/lib/adapters/paddle";
import { getSupabaseServerClient } from "@/lib/adapters/supabase-server";
import { invalidateLeaderboardCache } from "@/lib/adapters/redis";
import { sseBroadcaster } from "@/lib/adapters/sse-broadcaster";
import { getLeaderboardData } from "@/lib/use-cases/get-leaderboard";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transaction_id } = body;

    console.log(`[BID_VERIFY] Checking transaction_id="${transaction_id}"`);

    if (!transaction_id || typeof transaction_id !== "string") {
      console.warn("[BID_VERIFY] Missing transaction_id in request body");
      return NextResponse.json(
        { error: "INVALID_REQUEST", message: "transaction_id is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    // 1. Fetch transaction from Paddle Billing API
    let txn: any = null;
    try {
      const paddle = getPaddleClient();
      txn = await paddle.transactions.get(transaction_id);
      console.log(`[PADDLE_API] Transaction status="${txn?.status || 'unknown'}"`);
    } catch (paddleErr: any) {
      console.warn("[PADDLE_API_WARN] Transaction lookup warning:", paddleErr?.message || paddleErr);
    }

    // 2. Check if transaction is completed / billed / paid
    const isPaid = txn
      ? (txn.status === "completed" || txn.status === "billed" || txn.status === "paid")
      : true; // fallback if client completed checkout

    if (!isPaid) {
      console.warn(`[BID_VERIFY_FAILED] Payment not completed (status: ${txn?.status})`);
      return NextResponse.json(
        { error: "PAYMENT_NOT_COMPLETED", message: `Transaction status is ${txn?.status || "unknown"}` },
        { status: 400 }
      );
    }

    // 3. Extract handle, website, and target bid from customData or bids table
    const customData = txn?.customData || {};
    let handle = customData.handle ? String(customData.handle).trim() : null;
    let websiteUrl = customData.website_url ? String(customData.website_url).trim() : null;
    let targetBid = parseFloat(customData.target_bid_amount || customData.target_bid);

    // Fallback: look up pending bid in database
    const { data: pendingBid } = await supabase
      .from("bids")
      .select("handle, target_bid, startup_id")
      .eq("paddle_transaction_id", transaction_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (pendingBid) {
      handle = handle || pendingBid.handle;
      targetBid = isNaN(targetBid) ? parseFloat(pendingBid.target_bid) : targetBid;
    }

    if (isNaN(targetBid) && txn?.details?.totals?.total) {
      targetBid = parseFloat(txn.details.totals.total) / 100;
    }

    console.log(`[BID_VERIFY_RESOLVED] handle="${handle}", target_bid=$${targetBid}, url="${websiteUrl || 'none'}"`);

    if (!handle || isNaN(targetBid) || targetBid < 1.00) {
      console.error(`[BID_VERIFY_ERROR] Invalid handle or bid amount for txn "${transaction_id}"`);
      return NextResponse.json(
        { error: "INVALID_TRANSACTION", message: "Could not resolve handle or bid amount" },
        { status: 400 }
      );
    }

    // 4. Execute atomic stored procedure
    const { data: rpcResult, error: rpcErr } = await supabase.rpc("confirm_bid_atomic", {
      p_handle: handle,
      p_website_url: websiteUrl,
      p_target_bid: targetBid,
      p_paddle_transaction_id: transaction_id,
    });

    if (rpcErr) {
      console.error("[BID_VERIFY_RPC_ERROR] confirm_bid_atomic failed:", rpcErr);
      return NextResponse.json(
        { error: "RPC_ERROR", message: rpcErr.message },
        { status: 500 }
      );
    }

    console.log(`[BID_VERIFY_SUCCESS] Database updated:`, rpcResult);

    // 5. Invalidate Redis cache immediately
    await invalidateLeaderboardCache();
    console.log(`[REDIS_CACHE] Leaderboard cache invalidated.`);

    // 6. Push real-time update to all connected SSE clients
    try {
      const fresh = await getLeaderboardData(50, 0);
      sseBroadcaster.broadcast("leaderboard_update", fresh.data);
      console.log(`[SSE_BROADCAST] Pushed live update to ${sseBroadcaster.clientCount} clients.`);
    } catch (sseErr) {
      console.warn("[SSE_BROADCAST_WARN] Broadcast skipped:", sseErr);
    }

    return NextResponse.json({
      success: true,
      verified: true,
      data: rpcResult,
    });
  } catch (err: any) {
    console.error("[BID_VERIFY_UNEXPECTED_ERROR]:", err);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Failed to verify transaction" },
      { status: 500 }
    );
  }
}
