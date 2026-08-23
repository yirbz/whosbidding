"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getSupabaseBrowserClient } from "@/lib/adapters/supabase-client";
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
        setEntries(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [limit, offset]);

  useEffect(() => {
    fetchLeaderboard();

    // 1. Supabase Postgres Changes & Broadcast Realtime Channel
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("leaderboard_live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "startups" },
        () => {
          fetchLeaderboard();
        }
      )
      .on("broadcast", { event: "new_bid_activity" }, () => {
        fetchLeaderboard();
      })
      .on("broadcast", { event: "outbid" }, () => {
        fetchLeaderboard();
      })
      .subscribe();

    // 2. High-speed 4-second polling fallback
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && !document.hidden) {
        fetchLeaderboard();
      }
    }, 4000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [fetchLeaderboard]);

  return {
    entries,
    isLoading,
    refresh: fetchLeaderboard,
  };
}
