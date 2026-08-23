"use client";

import { AsymmetricCard } from "@/components/ui/asymmetric-card";
import { Tag } from "@/components/ui/tag";

interface LeaderCardProps {
  handle: string;
  totalBid: number;
  websiteUrl?: string | null;
}

export function LeaderCard({ handle, totalBid, websiteUrl }: LeaderCardProps) {
  const formattedBid = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(totalBid);

  return (
    <AsymmetricCard className="w-full border border-[#e8e8e8]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <Tag variant="ember">#1 Top Meta-Bidder</Tag>

          <h2 className="text-[32px] md:text-[40px] font-polysans font-normal text-[#202020] leading-[1.2] tracking-[-0.8px]">
            {handle}
          </h2>

          {websiteUrl && (
            <div className="text-[14px] font-inter text-[#828282]">
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ff682c] underline underline-offset-2 hover:opacity-80 font-normal"
              >
                {websiteUrl}
              </a>
            </div>
          )}
        </div>

        <div className="text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-[#e8e8e8] w-full md:w-auto">
          <span className="text-[13px] font-inter uppercase tracking-wider text-[#828282]">
            Current Meta-Leader Price
          </span>
          <div className="text-[40px] md:text-[66px] font-polysans text-[#202020] leading-[0.91] tracking-[-1.32px] mt-2">
            {formattedBid}
          </div>
        </div>
      </div>
    </AsymmetricCard>
  );
}
