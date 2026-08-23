import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/adapters/supabase-server";
import { rankStartups } from "@/lib/domain/leaderboard";
import { getCachedData, setCachedData } from "@/lib/adapters/redis";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
    const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);

    const cacheKey = `leaderboard:${limit}:${offset}`;

    // 1. Check Redis Cache for sub-millisecond response
    const cached = await getCachedData(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "X-Cache": "HIT",
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
        },
      });
    }

    // 2. Query Supabase Database on Cache Miss
    const supabase = getSupabaseServerClient();

    const { data: startups, error } = await supabase
      .from("startups")
      .select("*")
      .order("total_bid", { ascending: false })
      .order("updated_at", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error || !startups || startups.length === 0) {
      const emptyResponse = {
        data: [],
        meta: {
          total_count: 0,
          limit,
          offset,
          leader_bid: 0,
        },
      };
      // Cache empty state for 10 seconds
      await setCachedData(cacheKey, emptyResponse, 10);
      return NextResponse.json(emptyResponse, {
        headers: { "X-Cache": "MISS" },
      });
    }

    const rankedEntries = rankStartups(startups);
    const adjustedEntries = rankedEntries.map((e, idx) => ({
      ...e,
      rank: offset + idx + 1,
    }));

    const leaderBid = adjustedEntries.length > 0 && offset === 0 ? adjustedEntries[0].total_bid : 0;

    const responsePayload = {
      data: adjustedEntries,
      meta: {
        total_count: adjustedEntries.length,
        limit,
        offset,
        leader_bid: leaderBid,
      },
    };

    // 3. Store in Redis Cache with 60s TTL
    await setCachedData(cacheKey, responsePayload, 60);

    return NextResponse.json(responsePayload, {
      headers: {
        "X-Cache": "MISS",
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
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
