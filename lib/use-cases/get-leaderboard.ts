import { db } from "@/lib/adapters/db";
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

  // 2. Query Database directly via PostgreSQL client pool
  const rows = await db.getLeaderboard(limit, offset);

  if (!rows || rows.length === 0) {
    const emptyResponse: LeaderboardResponse = {
      data: [],
      meta: {
        total_count: 0,
        limit,
        offset,
        leader_bid: 0,
      },
    };
    await setCachedData(cacheKey, emptyResponse, 5);
    return { data: [], meta: emptyResponse.meta, fromCache: false };
  }

  const entries: LeaderboardEntry[] = rows.map((r: any, idx: number) => ({
    id: r.id,
    handle: r.handle,
    website_url: r.website_url,
    total_bid: parseFloat(r.total_bid),
    created_at: r.created_at,
    updated_at: r.updated_at,
    rank: offset + idx + 1,
  }));

  const leaderBid = entries.length > 0 && offset === 0 ? entries[0].total_bid : 0;

  const responsePayload: LeaderboardResponse = {
    data: entries,
    meta: {
      total_count: entries.length,
      limit,
      offset,
      leader_bid: leaderBid,
    },
  };

  // 3. Cache in Redis
  await setCachedData(cacheKey, responsePayload, 60);

  return { data: responsePayload.data, meta: responsePayload.meta, fromCache: false };
}
