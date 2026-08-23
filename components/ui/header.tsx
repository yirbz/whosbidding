"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeModal, setActiveModal] = useState<"about" | "rules" | null>(null);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#ffffff]/90 backdrop-blur-md border-b border-[#e8e8e8]">
        <div className="max-w-[1200px] mx-auto px-6 py-3.5 flex items-center justify-between">
          {/* Brand SVG Logo Left (Generous Margin for Complete Unclipped Wordmark) */}
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <Image
              src="/whosbidding_tag_logo.svg"
              alt="whosbidding"
              width={260}
              height={60}
              className="h-10 md:h-[46px] w-auto"
              priority
            />
          </Link>

          {/* Nav Items Right: Leaderboard, About, Rules, Dark Mode Toggle */}
          <nav className="flex items-center gap-6 font-inter text-[15px] font-medium text-[#202020]">
            <button
              onClick={() => scrollToSection("leaderboard-section")}
              className="hover:text-[#ff682c] transition-colors"
            >
              Leaderboard
            </button>
            <button
              onClick={() => setActiveModal("about")}
              className="hover:text-[#ff682c] transition-colors"
            >
              About
            </button>
            <button
              onClick={() => setActiveModal("rules")}
              className="hover:text-[#ff682c] transition-colors"
            >
              Rules
            </button>

            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Dark Mode"
              className="w-9 h-9 rounded-full bg-[#efefef] border border-[#e8e8e8] flex items-center justify-center text-[#202020] hover:bg-[#202020] hover:text-[#ffffff] transition-all"
            >
              {isDarkMode ? (
                /* Sun Icon */
                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                /* Moon Icon */
                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* About Modal */}
      {activeModal === "about" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202020]/60 backdrop-blur-sm">
          <div className="bg-[#ffffff] border border-[#202020] max-w-lg w-full p-8 rounded-[12px] space-y-4 relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-[20px] text-[#828282] hover:text-[#202020]"
            >
              ✕
            </button>
            <h3 className="font-polysans text-[28px] text-[#202020]">About WhosBidding</h3>
            <p className="font-inter text-[15px] text-[#4d4d4d] leading-[1.4]">
              WhosBidding is an authentic real-time meta-observatory for startup bidding platforms. Pay the full target bid amount to claim #1 rank for your bidding site. Zero accounts, zero signups, pure financial transparency.
            </p>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {activeModal === "rules" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202020]/60 backdrop-blur-sm">
          <div className="bg-[#ffffff] border border-[#202020] max-w-lg w-full p-8 rounded-[12px] space-y-4 relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-[20px] text-[#828282] hover:text-[#202020]"
            >
              ✕
            </button>
            <h3 className="font-polysans text-[28px] text-[#202020]">WhosBidding Rules</h3>
            <ul className="font-inter text-[15px] text-[#4d4d4d] space-y-2 list-disc pl-5">
              <li>Initial starting bid begins at $1.00.</li>
              <li>Every bid is paid in full (no account credit or incremental roll-overs).</li>
              <li>Your bid must equal or exceed the target price required to claim #1.</li>
              <li>Real-time WebSocket notifications instantly broadcast new #1 claims to all viewers.</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
