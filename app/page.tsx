"use client";

import { toast } from "sonner";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { BidPanel } from "@/components/bidding/bid-panel";
import { OutbidToast } from "@/components/notifications/outbid-toast";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { useOutbidNotifications } from "@/hooks/use-outbid-notifications";
import { useActiveUsers } from "@/hooks/use-active-users";
import { useVisitorStats } from "@/hooks/use-visitor-stats";

export default function HomePage() {
  const { entries, isLoading, refresh } = useLeaderboard(50);
  const { activeCount } = useActiveUsers();
  const { totalVisitors } = useVisitorStats();
  const leaderBid = entries.length > 0 ? entries[0].total_bid : 0;

  // Wire real-time outbid notifications
  useOutbidNotifications({
    onOutbid: (data) => {
      toast.custom(() => (
        <OutbidToast
          newLeaderName={data.new_leader_name || "A challenger"}
          newLeaderBid={data.new_leader_bid}
        />
      ));
      refresh();
    },
  });

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#202020] flex flex-col font-inter">
      <main className="flex-1 max-w-[960px] w-full mx-auto px-4 md:px-6 py-8 md:py-12 space-y-12">
        {/* Top Centered Status Capsule Pill with Real Active Viewer & Visitor Count */}
        <div className="flex justify-center">
          <div
            className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#efefef] border border-[#e8e8e8] rounded-full text-[13px] font-inter text-[#4d4d4d]"
            suppressHydrationWarning
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff682c] animate-pulse" />
            <span className="font-semibold text-[#202020]">{activeCount} online</span>
            <span>•</span>
            <span suppressHydrationWarning>
              {totalVisitors.toLocaleString("en-US")} {totalVisitors === 1 ? "visitor" : "visitors"} since launch
            </span>
          </div>
        </div>

        {/* Hero & Bidding Terminal */}
        <section className="w-full">
          <BidPanel currentLeaderBid={leaderBid} onBidSuccess={refresh} />
        </section>

        {/* Leaderboard Card Stack */}
        <section id="leaderboard-section" className="w-full space-y-6 pt-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#e8e8e8]">
            <h2 className="text-[24px] md:text-[28px] font-polysans font-normal text-[#202020] leading-[1.0] tracking-[-0.64px]">
              Top 50 Leaderboard
            </h2>
            <span className="text-[13px] font-inter text-[#828282]">
              Showing top 50 bidding startups
            </span>
          </div>

          <LeaderboardTable entries={entries} isLoading={isLoading} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e8e8e8] py-8 text-center text-[13px] font-inter text-[#828282] bg-[#ffffff]">
        <div className="max-w-[960px] mx-auto px-6">
          WhosBidding • Startup Leaderboard Platform
        </div>
      </footer>
    </div>
  );
}
