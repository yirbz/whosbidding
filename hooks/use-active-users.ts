"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/adapters/supabase-client";

export function useActiveUsers() {
  const [activeCount, setActiveCount] = useState<number>(1);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const channel = supabase.channel("online_presence");

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const count = Object.keys(state).length;
        setActiveCount(count > 0 ? count : 1);
      })
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { activeCount };
}
