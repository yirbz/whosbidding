"use client";

import { useMemo } from "react";

interface BidCalculatorProps {
  handle: string;
  onHandleChange: (val: string) => void;
}

export function BidCalculator({ handle, onHandleChange }: BidCalculatorProps) {
  // Extract domain for favicon if input looks like a URL
  const faviconUrl = useMemo(() => {
    if (!handle) return null;
    const trimmed = handle.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.includes(".")) {
      try {
        const domainStr = trimmed.replace(/^https?:\/\//, "").split("/")[0];
        if (domainStr && domainStr.includes(".")) {
          return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domainStr)}&sz=32`;
        }
      } catch {
        return null;
      }
    }
    return null;
  }, [handle]);

  return (
    <div className="relative flex-1 w-full">
      {/* Left Icon (Globe or Favicon) */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[#828282]">
        {faviconUrl ? (
          <img
            src={faviconUrl}
            alt=""
            className="w-5 h-5 object-contain rounded-sm"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        ) : (
          <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z" />
          </svg>
        )}
      </div>

      <input
        type="text"
        required
        value={handle}
        onChange={(e) => onHandleChange(e.target.value)}
        placeholder="Your product URL or @handle"
        className="w-full h-[52px] pl-14 pr-4 bg-[#ffffff] text-[#202020] border border-[#202020] text-[16px] font-inter rounded-full focus:outline-none focus:ring-2 focus:ring-[#202020] transition-all placeholder:text-[#828282]"
      />
    </div>
  );
}
