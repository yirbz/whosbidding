import { createPaddleTransaction } from "@/lib/adapters/paddle";
import { getSupabaseServerClient } from "@/lib/adapters/supabase-server";
import { validateBid } from "@/lib/domain/bid";

export async function placeBidUseCase(params: {
  handle: string;
  website_url?: string | null;
  target_bid: number;
}) {
  const supabase = getSupabaseServerClient();

  // 1. Fetch current top leader startup
  const { data: leaders } = await supabase
    .from("startups")
    .select("*")
    .order("total_bid", { ascending: false })
    .order("updated_at", { ascending: true })
    .limit(1);

  const currentLeader = leaders && leaders.length > 0 ? leaders[0] : null;
  const currentLeaderBid = currentLeader ? parseFloat(currentLeader.total_bid) : 0;

  // 2. Validate bid using pure domain logic
  const validation = validateBid(params.target_bid, currentLeaderBid, params.handle);

  if (!validation.valid) {
    return {
      success: false,
      status: 400,
      error: validation.errorCode,
      message: validation.errorMessage,
      current_leader_bid: currentLeaderBid,
      minimum_bid: validation.minimumBid,
    };
  }

  // 3. Create Paddle transaction via adapter (full price target_bid amount)
  const paddleTxn = await createPaddleTransaction({
    handle: params.handle,
    websiteUrl: params.website_url,
    targetBid: params.target_bid,
  });

  // 4. Record pending bid entry
  await supabase.from("bids").insert({
    handle: params.handle,
    target_bid: params.target_bid,
    paddle_transaction_id: paddleTxn.id,
    status: "pending",
  });

  return {
    success: true,
    status: 200,
    transaction_id: paddleTxn.id,
    target_bid: params.target_bid,
    current_leader_bid: currentLeaderBid,
    handle: params.handle,
  };
}
