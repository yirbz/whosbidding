"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabaseBrowserClient } from "@/lib/adapters/supabase-client";
import { LeaderboardEntry } from "@/lib/domain/types";

export function useLeaderboard(limit = 50, offset = 0) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(`/api/leaderboard?limit=${limit}&offset=${offset}`);
      if (res.ok) {
        const json = await res.json();
        setEntries(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    } finally {
      setIsLoading(false);
    }
  }, [limit, offset]);

  useEffect(() => {
    fetchLeaderboard();

    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("realtime_startups")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "startups" },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLeaderboard]);

  return {
    entries,
    isLoading,
    refresh: fetchLeaderboard,
  };
}
