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
        const res = await fetch("/api/analytics/visit", {
          method: "POST",
          cache: "no-store",
        });

        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.total_visitors !== undefined) {
            setTotalVisitors(Number(json.total_visitors));
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
