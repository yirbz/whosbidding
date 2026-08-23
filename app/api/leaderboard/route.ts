import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/adapters/supabase-server";
import { rankStartups } from "@/lib/domain/leaderboard";
import { LeaderboardEntry } from "@/lib/domain/types";

const MOCK_SAMPLE_STARTUPS: LeaderboardEntry[] = [
  {
    id: "seed-1",
    handle: "see.io",
    website_url: "https://see.io",
    total_bid: 15000,
    rank: 1,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "seed-2",
    handle: "joni.ai",
    website_url: "https://joni.ai",
    total_bid: 14028,
    rank: 2,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "seed-3",
    handle: "requesty.ai",
    website_url: "https://requesty.ai",
    total_bid: 14023,
    rank: 3,
    created_at: new Date(Date.now() - 10800000).toISOString(),
    updated_at: new Date(Date.now() - 10800000).toISOString(),
  },
];

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
        data: MOCK_SAMPLE_STARTUPS,
        meta: {
          total_count: MOCK_SAMPLE_STARTUPS.length,
          limit,
          offset: 0,
          leader_bid: MOCK_SAMPLE_STARTUPS[0].total_bid,
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
      data: MOCK_SAMPLE_STARTUPS,
      meta: {
        total_count: MOCK_SAMPLE_STARTUPS.length,
        limit: 50,
        offset: 0,
        leader_bid: MOCK_SAMPLE_STARTUPS[0].total_bid,
      },
    });
  }
}
