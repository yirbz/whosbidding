"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LeaderboardRow } from "./leaderboard-row";
import { LeaderboardEntry } from "@/lib/domain/types";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
}

export function LeaderboardTable({ entries, isLoading }: LeaderboardTableProps) {
  const shouldReduceMotion = useReducedMotion();

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-[#efefef] dark:bg-[#18181b] rounded-[12px]" />
        <div className="h-24 bg-[#efefef] dark:bg-[#18181b] rounded-[12px]" />
        <div className="h-24 bg-[#efefef] dark:bg-[#18181b] rounded-[12px]" />
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-16 space-y-4 bg-[#efefef] dark:bg-[#18181b] border border-[#e8e8e8] dark:border-[#27272a] rounded-[12px]">
        <h3 className="font-polysans text-[28px] text-[#202020] dark:text-[#f4f4f5] font-normal leading-[1.19]">
          No Bids Yet
        </h3>
        <p className="font-inter text-[16px] text-[#4d4d4d] dark:text-[#a1a1aa] max-w-md mx-auto">
          Be the first startup to place a bid and claim #1 on the board! Starting bid is $1.00.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      layout={!shouldReduceMotion}
      className="space-y-4 w-full"
    >
      {entries.map((entry) => (
        <LeaderboardRow key={entry.id} entry={entry} />
      ))}
    </motion.div>
  );
}
