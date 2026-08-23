"use client";

import { useState } from "react";

interface StartupLogoProps {
  handle: string;
  websiteUrl?: string | null;
}

export function StartupLogo({ handle, websiteUrl }: StartupLogoProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const cleanHandle = handle.trim().toLowerCase();
  const isTwitter = cleanHandle.startsWith("@");

  // Handle @handle X.com entries (renders official X logo)
  if (isTwitter) {
    const username = cleanHandle.slice(1);
    const xFaviconUrl = `https://unavatar.io/twitter/${encodeURIComponent(username)}`;

    return (
      <div className="min-w-[64px] min-h-[64px] w-16 h-16 md:w-[72px] md:h-[72px] rounded-[16px] bg-[#000000] border-2 border-[#202020] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md p-2">
        {!imgFailed ? (
          <img
            src={xFaviconUrl}
            alt={`@${username} X profile logo`}
            className="w-11 h-11 md:w-13 md:h-13 object-contain rounded-full"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <svg className="w-8 h-8 md:w-9 md:h-9 fill-[#ffffff]" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        )}
      </div>
    );
  }

  // Custom high-contrast rounded-square SVG logos for seed/featured startups
  if (cleanHandle === "see.io" || cleanHandle.includes("see.io")) {
    return (
      <div className="min-w-[64px] min-h-[64px] w-16 h-16 md:w-[72px] md:h-[72px] rounded-[16px] bg-[#202020] border-2 border-[#333333] flex items-center justify-center shadow-md flex-shrink-0">
        <svg className="w-10 h-10 md:w-11 md:h-11" viewBox="0 0 32 32" fill="none">
          <circle cx="11" cy="16" r="5" fill="#ffffff" />
          <circle cx="21" cy="16" r="5" fill="#ff682c" />
        </svg>
      </div>
    );
  }

  if (cleanHandle === "joni.ai" || cleanHandle.includes("joni.ai")) {
    return (
      <div className="min-w-[64px] min-h-[64px] w-16 h-16 md:w-[72px] md:h-[72px] rounded-[16px] bg-[#202020] border-2 border-[#333333] flex items-center justify-center shadow-md flex-shrink-0">
        <svg className="w-9 h-9 md:w-10 md:h-10 text-[#ffffff] stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.8">
          <path d="M12 3a6 6 0 0 0-6 6c0 3.314 2.686 6 6 6s6-2.686 6-6a6 6 0 0 0-6-6z" />
          <path d="M6 15c-1.5 1-2.5 3-2.5 5" />
          <path d="M9 15c-0.5 1.5-1 3.5-1 5" />
          <path d="M15 15c0.5 1.5 1 3.5 1 5" />
          <path d="M18 15c1.5 1 2.5 3 2.5 5" />
        </svg>
      </div>
    );
  }

  if (cleanHandle === "requesty.ai" || cleanHandle.includes("requesty.ai")) {
    return (
      <div className="min-w-[64px] min-h-[64px] w-16 h-16 md:w-[72px] md:h-[72px] rounded-[16px] bg-[#2563eb] border-2 border-[#1d4ed8] flex items-center justify-center shadow-md flex-shrink-0">
        <svg className="w-9 h-9 md:w-10 md:h-10 fill-none stroke-[#ffffff]" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>
    );
  }

  // Derive domain for generic startup entries
  const targetDomain = (() => {
    if (websiteUrl) {
      return websiteUrl.replace(/^https?:\/\//, "").split("/")[0];
    }
    if (cleanHandle.includes(".")) {
      return cleanHandle.replace(/^https?:\/\//, "").split("/")[0];
    }
    return null;
  })();

  const faviconUrl = targetDomain && !imgFailed
    ? `https://unavatar.io/${encodeURIComponent(targetDomain)}`
    : null;

  // Generate deterministic background color for custom logo badge
  const getBrandBg = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ["#202020", "#ff682c", "#2563eb", "#059669", "#7c3aed", "#d97706"];
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      className="min-w-[64px] min-h-[64px] w-16 h-16 md:w-[72px] md:h-[72px] rounded-[16px] border-2 border-[#e8e8e8] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md p-2"
      style={{ backgroundColor: faviconUrl ? "#ffffff" : getBrandBg(cleanHandle) }}
    >
      {faviconUrl ? (
        <img
          src={faviconUrl}
          alt={`${cleanHandle} logo`}
          className="w-11 h-11 md:w-13 md:h-13 object-contain"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="font-polysans text-[24px] md:text-[28px] font-bold text-[#ffffff]">
          {cleanHandle.replace("@", "").slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}
