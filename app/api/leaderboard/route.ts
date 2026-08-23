import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/adapters/supabase-server";
import { rankStartups } from "@/lib/domain/leaderboard";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
    const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);

    const supabase = getSupabaseServerClient();

    const { data: startups, error } = await supabase
      .from("startups")
      .select("*")
      .order("total_bid", { ascending: false })
      .order("updated_at", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error || !startups || startups.length === 0) {
      return NextResponse.json({
        data: [],
        meta: {
          total_count: 0,
          limit,
          offset,
          leader_bid: 0,
        },
      });
    }

    const rankedEntries = rankStartups(startups);
    const adjustedEntries = rankedEntries.map((e, idx) => ({
      ...e,
      rank: offset + idx + 1,
    }));

    const leaderBid = adjustedEntries.length > 0 && offset === 0 ? adjustedEntries[0].total_bid : 0;

    return NextResponse.json({
      data: adjustedEntries,
      meta: {
        total_count: adjustedEntries.length,
        limit,
        offset,
        leader_bid: leaderBid,
      },
    });
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
