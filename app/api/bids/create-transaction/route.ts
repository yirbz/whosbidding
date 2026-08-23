import { NextResponse } from "next/server";
import { placeBidUseCase } from "@/lib/use-cases/place-bid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { handle, website_url, target_bid } = body;

    console.log(`[BID_CREATE] Request received: handle="${handle}", target_bid=$${target_bid}, url="${website_url || 'none'}"`);

    const result = await placeBidUseCase({
      handle: handle ? String(handle).trim() : "",
      website_url: website_url ? String(website_url).trim() : null,
      target_bid: parseFloat(target_bid),
    });

    if (!result.success) {
      console.warn(`[BID_CREATE_REJECTED] Validation failed:`, result);
      return NextResponse.json(result, { status: result.status });
    }

    console.log(`[BID_CREATE_SUCCESS] Paddle transaction_id="${result.transaction_id}"`);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("[BID_CREATE_ERROR] Failed to process bid transaction:", err);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Failed to process bid transaction" },
      { status: 500 }
    );
  }
}
