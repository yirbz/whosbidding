// Pure TypeScript Domain Logic — zero framework imports (Constitution v3.0.0)

import { LeaderboardEntry, Startup } from "./types";

/**
 * Sorts startups by total_bid DESC. If tied, the startup that reached the bid earlier (updated_at ASC) wins.
 * Derives 1-indexed rank for each entry.
 */
export function rankStartups(startups: Startup[]): LeaderboardEntry[] {
  const sorted = [...startups].sort((a, b) => {
    if (b.total_bid !== a.total_bid) {
      return b.total_bid - a.total_bid;
    }
    return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
  });

  return sorted.map((startup, index) => ({
    ...startup,
    rank: index + 1,
  }));
}

/**
 * Returns the current #1 startup on the leaderboard, or null if empty.
 */
export function getLeader(startups: Startup[]): LeaderboardEntry | null {
  const ranked = rankStartups(startups);
  return ranked.length > 0 ? ranked[0] : null;
}
