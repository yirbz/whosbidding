"use client";

import { useMemo } from "react";

interface BidCalculatorProps {
  handle: string;
  onHandleChange: (val: string) => void;
}

export function BidCalculator({ handle, onHandleChange }: BidCalculatorProps) {
  const trimmed = handle.trim();
  const isTwitter = trimmed.startsWith("@");

  // Extract domain for favicon if input looks like a URL or @handle
  const faviconUrl = useMemo(() => {
    if (!trimmed) return null;
    if (isTwitter) {
      return "https://www.google.com/s2/favicons?domain=x.com&sz=64";
    }
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.includes(".")) {
      try {
        const domainStr = trimmed.replace(/^https?:\/\//, "").split("/")[0];
        if (domainStr && domainStr.includes(".")) {
          return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domainStr)}&sz=64`;
        }
      } catch {
        return null;
      }
    }
    return null;
  }, [trimmed, isTwitter]);

  return (
    <div className="relative flex-1 w-full">
      {/* Left Icon (Favicon or Globe or X Logo) */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-[#202020]">
        {isTwitter ? (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        ) : faviconUrl ? (
          <img
            src={faviconUrl}
            alt=""
            className="w-5 h-5 object-contain rounded-sm"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        ) : (
          <svg className="w-5 h-5 stroke-current fill-none text-[#828282]" viewBox="0 0 24 24" strokeWidth="1.5">
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
