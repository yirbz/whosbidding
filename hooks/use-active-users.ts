"use client";

import { useEffect, useState } from "react";

export function useActiveUsers() {
  const [activeCount, setActiveCount] = useState<number>(1);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/analytics/visit", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.data?.today_visitors) {
            setActiveCount(Math.max(1, Number(json.data.today_visitors)));
          }
        }
      } catch {
        // Fallback gracefully
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return { activeCount };
}
