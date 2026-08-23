import { createPaddleTransaction } from "@/lib/adapters/paddle";
import { db } from "@/lib/adapters/db";
import { validateBid } from "@/lib/domain/bid";

export async function placeBidUseCase(params: {
  handle: string;
  website_url?: string | null;
  target_bid: number;
}) {
  // 1. Fetch current top leader startup directly from PostgreSQL
  const leaderRow = await db.getLeader();
  const currentLeaderBid = leaderRow ? parseFloat(leaderRow.total_bid) : 0;

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

  // 4. Record pending bid entry directly in PostgreSQL
  await db.recordPendingBid(params.handle, params.target_bid, paddleTxn.id);

  return {
    success: true,
    status: 200,
    transaction_id: paddleTxn.id,
    target_bid: params.target_bid,
    current_leader_bid: currentLeaderBid,
    handle: params.handle,
  };
}
