import * as React from "react";

interface OutbidToastProps {
  newLeaderName: string;
  newLeaderBid: number;
}

export function OutbidToast({ newLeaderName, newLeaderBid }: OutbidToastProps) {
  const formattedBid = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(newLeaderBid);

  return (
    <div className="w-full bg-[#202020] text-[#ffffff] border-l-2 border-[#ff682c] p-4 shadow-none space-y-1">
      <h4 className="font-polysans text-[16px] font-normal leading-[1.0] text-[#ffffff]">
        New #1 Leader!
      </h4>
      <p className="font-inter text-[14px] text-[#efefef] leading-[1.43]">
        <span className="font-medium text-[#ffffff]">{newLeaderName}</span> just claimed #1 with a bid of {formattedBid}.
      </p>
    </div>
  );
}
