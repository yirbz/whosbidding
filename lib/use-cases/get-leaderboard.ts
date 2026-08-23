import { getSupabaseServerClient } from "@/lib/adapters/supabase-server";
import { rankStartups } from "@/lib/domain/leaderboard";
import { getCachedData, setCachedData } from "@/lib/adapters/redis";
import { LeaderboardEntry } from "@/lib/domain/types";

export interface LeaderboardResponse {
  data: LeaderboardEntry[];
  meta: {
    total_count: number;
    limit: number;
    offset: number;
    leader_bid: number;
  };
}

export async function getLeaderboardData(limit = 50, offset = 0) {
  const cacheKey = `leaderboard:${limit}:${offset}`;

  // 1. Check Redis Cache
  const cached = await getCachedData<LeaderboardResponse>(cacheKey);
  if (cached && cached.data) {
    return { data: cached.data || [], meta: cached.meta, fromCache: true };
  }

  // 2. Query Database
  const supabase = getSupabaseServerClient();
  const { data: startups, error } = await supabase
    .from("startups")
    .select("*")
    .order("total_bid", { ascending: false })
    .order("updated_at", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error || !startups || startups.length === 0) {
    const emptyResponse: LeaderboardResponse = {
      data: [],
      meta: {
        total_count: 0,
        limit,
        offset,
        leader_bid: 0,
      },
    };
    await setCachedData(cacheKey, emptyResponse, 10);
    return { data: [], meta: emptyResponse.meta, fromCache: false };
  }

  const rankedEntries = rankStartups(startups);
  const adjustedEntries = rankedEntries.map((e, idx) => ({
    ...e,
    rank: offset + idx + 1,
  }));

  const leaderBid = adjustedEntries.length > 0 && offset === 0 ? adjustedEntries[0].total_bid : 0;

  const responsePayload: LeaderboardResponse = {
    data: adjustedEntries,
    meta: {
      total_count: adjustedEntries.length,
      limit,
      offset,
      leader_bid: leaderBid,
    },
  };

  // 3. Cache for 60s
  await setCachedData(cacheKey, responsePayload, 60);

  return { data: responsePayload.data, meta: responsePayload.meta, fromCache: false };
}
