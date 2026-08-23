"use client";

import { Button } from "@/components/ui/button";
import { DataCard } from "@/components/ui/data-card";

interface BidSuccessProps {
  handle: string;
  totalBid: number;
  onClose?: () => void;
}

export function BidSuccess({ handle, totalBid, onClose }: BidSuccessProps) {
  const formattedBid = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(totalBid);

  return (
    <DataCard className="text-center space-y-6">
      <div className="mx-auto w-12 h-12 rounded-full bg-[#ff682c]/10 text-[#ff682c] flex items-center justify-center font-polysans text-2xl">
        ✓
      </div>
      <h3 className="font-polysans text-[32px] text-[#202020] leading-[1.19]">
        #1 Claimed!
      </h3>
      <p className="font-inter text-[16px] text-[#4d4d4d] max-w-sm mx-auto leading-[1.25]">
        <span className="text-[#202020] font-medium">{handle}</span> is now ranked #1 on the leaderboard with a bid of {formattedBid}.
      </p>
      {onClose && (
        <Button onClick={onClose} variant="primary" className="mx-auto">
          View Leaderboard
        </Button>
      )}
    </DataCard>
  );
}
