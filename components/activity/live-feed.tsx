"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { getSupabaseBrowserClient } from "@/lib/adapters/supabase-client";

interface ActivityItem {
  id: string;
  startupName: string;
  amount: number;
  time: string;
}

const sampleActivities: ActivityItem[] = [
  { id: "1", startupName: "@BidStack", amount: 10, time: "2 mins ago" },
  { id: "2", startupName: "@AuctionBase", amount: 5, time: "15 mins ago" },
];

export function LiveBidFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>(sampleActivities);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    async function loadRecentActivity() {
      try {
        const res = await fetch("/api/leaderboard/activity");
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            const items: ActivityItem[] = json.data.map((b: any) => ({
              id: b.id,
              startupName: b.handle,
              amount: parseFloat(b.target_bid),
              time: new Date(b.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }));
            setActivities(items);
          }
        }
      } catch (err) {
        console.error("Failed to load activity feed:", err);
      }
    }

    loadRecentActivity();

    const supabase = getSupabaseBrowserClient();
    const channel = supabase.channel("leaderboard_live");

    channel
      .on("broadcast", { event: "new_bid_activity" }, (payload: any) => {
        const newActivity: ActivityItem = {
          id: Math.random().toString(),
          startupName: payload.payload?.startup_name || "@Challenger",
          amount: payload.payload?.incremental_amount || 0,
          time: "Just now",
        };
        setActivities((prev) => [newActivity, ...prev.slice(0, 9)]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="w-full">
      <h4 className="font-polysans text-[18px] text-[#828282] uppercase tracking-wider mb-3">
        Live Activity Feed
      </h4>
      <ul className="divide-y divide-[#e8e8e8] bg-[#efefef] rounded-[8px] p-0 m-0 list-none overflow-hidden">
        <AnimatePresence initial={false}>
          {activities.map((item) => (
            <motion.li
              key={item.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="flex items-center justify-between p-4 hover:bg-[#f5f5f5] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#ff682c]" />
                <span className="font-polysans text-[16px] text-[#202020]">
                  {item.startupName}
                </span>
                <span className="text-[14px] font-inter text-[#4d4d4d]">
                  placed a bid
                </span>
              </div>
              <div className="font-polysans text-[16px] text-[#202020]">
                ${item.amount.toFixed(2)}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
