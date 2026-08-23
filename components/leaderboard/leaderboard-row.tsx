"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LeaderboardEntry } from "@/lib/domain/types";
import { StartupLogo } from "./startup-logo";

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
}

export function LeaderboardRow({ entry }: LeaderboardRowProps) {
  const shouldReduceMotion = useReducedMotion();

  const formattedBid = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(entry.total_bid);

  // Derive target link URL (Twitter/X for @handle or website for URL)
  const targetUrl = (() => {
    if (entry.website_url) return entry.website_url;
    const handleStr = entry.handle.trim();
    if (handleStr.startsWith("@")) {
      return `https://x.com/${handleStr.slice(1)}`;
    }
    if (handleStr.startsWith("http://") || handleStr.startsWith("https://")) {
      return handleStr;
    }
    if (handleStr.includes(".")) {
      return `https://${handleStr}`;
    }
    return null;
  })();

  const isLeader = entry.rank === 1;

  return (
    <motion.div
      layout={!shouldReduceMotion}
      layoutId={entry.id}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative p-5 md:p-6 rounded-[16px] border transition-all ${
        isLeader
          ? "bg-[#efefef] border-[#ff682c] border-2 shadow-md"
          : "bg-[#efefef] border-[#e8e8e8] hover:border-[#202020]"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 md:gap-6">
        {/* Left Side: 1ST POSITION - PROMINENT STARTUP FAVICON LOGO BOX */}
        <div className="flex items-center gap-4 md:gap-5 flex-1 min-w-0">
          {/* Startup Favicon Logo (First Priority on Far Left) */}
          <StartupLogo handle={entry.handle} websiteUrl={entry.website_url} />

          {/* Startup Brand Column */}
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Rank Badge Pill (Subtle inline badge) */}
              <span
                className={`inline-flex items-center justify-center h-6 px-2.5 rounded-full font-polysans text-[12px] font-bold ${
                  isLeader
                    ? "bg-[#ff682c] text-[#ffffff]"
                    : "bg-[#202020] text-[#ffffff]"
                }`}
              >
                #{entry.rank}
              </span>

              {targetUrl ? (
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-polysans text-[22px] md:text-[26px] text-[#202020] font-normal leading-[1.1] hover:text-[#ff682c] transition-colors truncate"
                >
                  {entry.handle}
                </a>
              ) : (
                <h3 className="font-polysans text-[22px] md:text-[26px] text-[#202020] font-normal leading-[1.1] truncate">
                  {entry.handle}
                </h3>
              )}
            </div>

            {targetUrl && (
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-inter text-[14px] text-[#4d4d4d] hover:text-[#202020] transition-colors block truncate"
              >
                {targetUrl}
              </a>
            )}

            <div className="flex items-center gap-2 text-[12px] font-inter text-[#828282] pt-0.5">
            </div>
          </div>
        </div>

        {/* Right Side: Big Total Placement Bid Display */}
        <div className="text-left sm:text-right flex-shrink-0 pt-1 sm:pt-0">
          <span className="text-[11px] font-inter uppercase tracking-wider text-[#828282] block mb-0.5 sm:mb-1">
            Total Placement Bid
          </span>
          <div className="font-polysans text-[28px] md:text-[34px] text-[#202020] leading-[1.0] tracking-[-0.64px]">
            {formattedBid}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
