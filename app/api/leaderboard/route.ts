import { NextResponse } from "next/server";
import { getLeaderboardData } from "@/lib/use-cases/get-leaderboard";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
    const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);

    const result = await getLeaderboardData(limit, offset);

    return NextResponse.json(
      { data: result.data, meta: result.meta },
      {
        headers: {
          "X-Cache": result.fromCache ? "HIT" : "MISS",
          "Cache-Control": "public, s-maxage=5, stale-while-revalidate=15",
        },
      }
    );
  } catch {
    return NextResponse.json({
      data: [],
      meta: {
        total_count: 0,
        limit: 50,
        offset: 0,
        leader_bid: 0,
      },
    });
  }
}
