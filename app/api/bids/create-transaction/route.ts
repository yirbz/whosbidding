import { NextResponse } from "next/server";
import { placeBidUseCase } from "@/lib/use-cases/place-bid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { handle, website_url, target_bid } = body;

    const result = await placeBidUseCase({
      handle: handle ? String(handle).trim() : "",
      website_url: website_url ? String(website_url).trim() : null,
      target_bid: parseFloat(target_bid),
    });

    if (!result.success) {
      return NextResponse.json(result, { status: result.status });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("Create transaction API error:", err);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Failed to process bid transaction" },
      { status: 500 }
    );
  }
}
