"use client";

import { useEffect, useRef } from "react";

interface OutbidEventData {
  startup_name?: string;
  new_leader_name?: string;
  new_leader_bid: number;
}

interface UseOutbidNotificationsOptions {
  onOutbid?: (data: OutbidEventData) => void;
}

export function useOutbidNotifications(options?: UseOutbidNotificationsOptions) {
  const lastLeaderRef = useRef<{ name?: string; bid?: number }>({});

  useEffect(() => {
    async function checkLeader() {
      try {
        const res = await fetch("/api/leaderboard?limit=1", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          const leader = json.data?.[0];
          if (leader) {
            const leaderBid = parseFloat(leader.total_bid);
            if (
              lastLeaderRef.current.name &&
              lastLeaderRef.current.name !== leader.handle &&
              lastLeaderRef.current.bid &&
              leaderBid > lastLeaderRef.current.bid
            ) {
              options?.onOutbid?.({
                new_leader_name: leader.handle,
                new_leader_bid: leaderBid,
              });
            }
            lastLeaderRef.current = { name: leader.handle, bid: leaderBid };
          }
        }
      } catch {
        // Non-blocking
      }
    }

    const interval = setInterval(checkLeader, 6000);
    return () => clearInterval(interval);
  }, [options]);
}
