import { NextResponse } from "next/server";
import { placeBidUseCase } from "@/lib/use-cases/place-bid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { handle, website_url, target_bid } = body;

    console.log(`\n💳 [CREATE TRANSACTION] New bid request: handle="${handle}", target_bid=$${target_bid}, url="${website_url || 'none'}"`);

    const result = await placeBidUseCase({
      handle: handle ? String(handle).trim() : "",
      website_url: website_url ? String(website_url).trim() : null,
      target_bid: parseFloat(target_bid),
    });

    if (!result.success) {
      console.warn(`⚠️ [CREATE TRANSACTION REJECTED]`, result);
      return NextResponse.json(result, { status: result.status });
    }

    console.log(`✅ [CREATE TRANSACTION SUCCESS] Paddle transaction_id="${result.transaction_id}"`);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("❌ [CREATE TRANSACTION ERROR]:", err);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Failed to process bid transaction" },
      { status: 500 }
    );
  }
}
