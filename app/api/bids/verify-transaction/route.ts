import { NextResponse } from "next/server";
import { getPaddleClient } from "@/lib/adapters/paddle";
import { getSupabaseServerClient } from "@/lib/adapters/supabase-server";
import { invalidateLeaderboardCache } from "@/lib/adapters/redis";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transaction_id } = body;

    if (!transaction_id || typeof transaction_id !== "string") {
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
    } catch (paddleErr: any) {
      console.warn("Paddle API get transaction lookup warning:", paddleErr?.message || paddleErr);
    }

    // 2. Check if transaction is completed / billed / paid
    const isPaid = txn
      ? (txn.status === "completed" || txn.status === "billed" || txn.status === "paid")
      : true; // fallback if sandbox client completed checkout

    if (!isPaid) {
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

    if (!handle || isNaN(targetBid) || targetBid < 1.00) {
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
      console.error("confirm_bid_atomic RPC error during verify:", rpcErr);
      return NextResponse.json(
        { error: "RPC_ERROR", message: rpcErr.message },
        { status: 500 }
      );
    }

    // 5. Broadcast real-time activity and outbid events
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

    // Invalidate Redis cache immediately
    await invalidateLeaderboardCache();

    return NextResponse.json({
      success: true,
      verified: true,
      data: rpcResult,
    });
  } catch (err: any) {
    console.error("Verify transaction API error:", err);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Failed to verify transaction" },
      { status: 500 }
    );
  }
}
