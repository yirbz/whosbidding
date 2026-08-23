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
        console.log(`[LEADERBOARD] Fetched ${data.length} entries (Leader bid: $${json.meta?.leader_bid || 0})`);
      }
    } catch (err) {
      console.error("[LEADERBOARD_ERROR] Failed to fetch leaderboard:", err);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [limit, offset]);

  useEffect(() => {
    // 1. Initial HTTP fetch fallback
    fetchLeaderboard();

    // 2. Connect to real-time Server-Sent Events (SSE) stream
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource("/api/leaderboard/stream");

      eventSource.addEventListener("leaderboard_init", (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (Array.isArray(data)) {
            setEntries(data);
            setIsLoading(false);
          }
        } catch {
          // ignore parsing error
        }
      });

      eventSource.addEventListener("leaderboard_update", (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (Array.isArray(data)) {
            console.log(`[SSE] Real-time leaderboard update received (${data.length} entries)`);
            setEntries(data);
            setIsLoading(false);
          }
        } catch {
          // ignore parsing error
        }
      });

      eventSource.onerror = () => {
        // EventSource will automatically retry in background
      };
    } catch {
      // Non-blocking fallback if browser disables EventSource
    }

    // 3. Tab Focus Revalidation
    const handleFocus = () => {
      fetchLeaderboard();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [fetchLeaderboard]);

  return {
    entries,
    isLoading,
    refresh: fetchLeaderboard,
  };
}
