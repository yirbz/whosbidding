"use client";

import { useEffect, useState } from "react";

const DEFAULT_VISITORS = 0;

export function useVisitorStats() {
  const [totalVisitors, setTotalVisitors] = useState<number>(DEFAULT_VISITORS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function recordAndFetchVisit() {
      try {
        const hasVisited = typeof window !== "undefined" && sessionStorage.getItem("whosbidding_visited");

        let res: Response;
        if (!hasVisited) {
          // Record visit for new session
          res = await fetch("/api/analytics/visit", { method: "POST" });
          if (typeof window !== "undefined") {
            sessionStorage.setItem("whosbidding_visited", "true");
          }
        } else {
          // Get current count
          res = await fetch("/api/analytics/visit", { method: "GET" });
        }

        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.total_visitors !== undefined) {
            setTotalVisitors(json.total_visitors);
          }
        }
      } catch (err) {
        console.error("Visitor stats error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    recordAndFetchVisit();

    return () => {
      isMounted = false;
    };
  }, []);

  return { totalVisitors, isLoading };
}
