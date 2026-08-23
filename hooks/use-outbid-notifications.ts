"use client";

import { useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/adapters/supabase-client";

interface OutbidEventData {
  startup_name?: string;
  new_leader_name?: string;
  new_leader_bid: number;
}

interface UseOutbidNotificationsOptions {
  onOutbid?: (data: OutbidEventData) => void;
}

export function useOutbidNotifications(options?: UseOutbidNotificationsOptions) {
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const channel = supabase.channel("outbid_notifications");

    channel
      .on("broadcast", { event: "outbid" }, (payload: any) => {
        if (options?.onOutbid && payload.payload) {
          options.onOutbid(payload.payload as OutbidEventData);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [options]);
}
