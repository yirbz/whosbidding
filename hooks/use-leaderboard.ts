"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { LeaderboardEntry } from "@/lib/domain/types";

export function useLeaderboard(limit = 50, offset = 0) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFetchingRef = useRef(false);

  const fetchLeaderboard = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const res = await fetch(`/api/leaderboard?limit=${limit}&offset=${offset}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        const data = json.data || [];
        setEntries(data);
        console.log(`[LEADERBOARD] Loaded ${data.length} entries (Leader bid: $${json.meta?.leader_bid || 0})`);
      }
    } catch (err) {
      console.error("[LEADERBOARD_ERROR] Failed to fetch leaderboard:", err);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [limit, offset]);

  useEffect(() => {
    fetchLeaderboard();

    // High-performance polling fallback every 3 seconds (cached in Redis server-side)
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && !document.hidden) {
        fetchLeaderboard();
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchLeaderboard]);

  return {
    entries,
    isLoading,
    refresh: fetchLeaderboard,
  };
}
