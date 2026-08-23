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
          {/* Brand SVG Logo Left */}
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

          {/* Nav Items Right */}
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
                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
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
          <div className="bg-[#ffffff] border border-[#202020] max-w-xl w-full p-8 rounded-[16px] space-y-5 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-[20px] text-[#828282] hover:text-[#202020]"
            >
              ✕
            </button>
            <h3 className="font-polysans text-[28px] text-[#202020]">About WhosBidding</h3>
            <p className="font-inter text-[15px] text-[#4d4d4d] leading-[1.5]">
              WhosBidding is an authentic meta-observatory reserved <strong>strictly for bidding platform startups</strong>.
            </p>
            <div className="space-y-3 font-inter text-[14px] text-[#4d4d4d] leading-[1.5] border-t border-[#e8e8e8] pt-4">
              <p>
                <strong>Bidding Platform Scope:</strong> If you place a bid for a non-bidding startup or unrelated project, your entry will be suppressed and hidden from the leaderboard rank list without refund.
              </p>
              <p>
                <strong>Anonymous Placements:</strong> All bids are anonymous and require zero accounts. Any user may submit a bidding startup; inclusion does not imply official endorsement or consent.
              </p>
              <p>
                <strong>Merchant of Record & Liability:</strong> Payments are processed via <strong>Paddle</strong> (Merchant of Record). WhosBidding bears no legal responsibility if listed bidding startups go offline, get taken down, or cease operations.
              </p>
            </div>
            <div className="pt-2 flex justify-between items-center">
              <Link
                href="/about"
                onClick={() => setActiveModal(null)}
                className="text-[14px] font-inter text-[#ff682c] font-medium hover:underline"
              >
                View Full About Page →
              </Link>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#202020] text-[#ffffff] text-[13px] font-polysans rounded-full hover:bg-[#ff682c] transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {activeModal === "rules" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202020]/60 backdrop-blur-sm">
          <div className="bg-[#ffffff] border border-[#202020] max-w-xl w-full p-8 rounded-[16px] space-y-5 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-[20px] text-[#828282] hover:text-[#202020]"
            >
              ✕
            </button>
            <h3 className="font-polysans text-[28px] text-[#202020]">Platform Rules & Policy</h3>
            <ul className="font-inter text-[14px] text-[#4d4d4d] space-y-2.5 list-disc pl-5 leading-[1.5]">
              <li>
                <strong>Strict Bidding Platform Scope:</strong> Only startups in the bidding/leaderboard ecosystem qualify. Non-bidding submissions are hidden without refund.
              </li>
              <li>
                <strong>Surpassing Model:</strong> Bids start at $1.00. Every bid is paid in full to match or surpass target rank.
              </li>
              <li>
                <strong>Paddle Merchant of Record:</strong> All payments are final, non-refundable, and billed via Paddle.com.
              </li>
              <li>
                <strong>Third-Party Disclaimers:</strong> Bids are anonymous. WhosBidding is not liable if target sites go offline or are submitted without consent.
              </li>
            </ul>
            <div className="pt-2 flex justify-between items-center">
              <Link
                href="/rules"
                onClick={() => setActiveModal(null)}
                className="text-[14px] font-inter text-[#ff682c] font-medium hover:underline"
              >
                View Full Rules & Terms →
              </Link>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#202020] text-[#ffffff] text-[13px] font-polysans rounded-full hover:bg-[#ff682c] transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
