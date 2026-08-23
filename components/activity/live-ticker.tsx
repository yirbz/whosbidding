"use client";

interface TickerItem {
  name: string;
  bid: number;
}

const sampleTickerItems: TickerItem[] = [
  { name: "BidOnMyBid.io", bid: 1050 },
  { name: "PayToWinStartups.com", bid: 1005 },
  { name: "LeaderboardLarp.ai", bid: 500 },
  { name: "UltimateBidderMeta.xyz", bid: 250 },
];

export function LiveBiddingTicker({ items = sampleTickerItems }: { items?: TickerItem[] }) {
  const displayItems = [...items, ...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden border-b border-[#e8e8e8] bg-[#f5f5f5] py-2.5">
      <div className="flex whitespace-nowrap animate-ticker">
        {displayItems.map((item, idx) => (
          <div
            key={idx}
            className="mx-6 flex items-center gap-2 text-[13px] font-inter text-[#828282]"
          >
            <span className="font-polysans text-[#202020]">
              {item.name}
            </span>
            <span>meta-bid</span>
            <span className="font-polysans text-[#ff682c]">
              ${item.bid.toFixed(2)}
            </span>
            <span className="text-[#ff682c] ml-2">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
