"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/components/providers/theme-provider";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-50 bg-[#ffffff]/90 dark:bg-[#0d0d0f]/90 backdrop-blur-md border-b border-[#e8e8e8] dark:border-[#27272a] transition-colors">
      <div className="max-w-[1200px] mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Brand SVG Logo Left (Light & Dark Variants) */}
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <Image
            src="/whosbidding_tag_logo.svg"
            alt="whosbidding"
            width={260}
            height={60}
            className="h-10 md:h-[46px] w-auto dark:hidden"
            priority
          />
          <Image
            src="/whosbidding_tag_logo_dark.svg"
            alt="whosbidding"
            width={260}
            height={60}
            className="h-10 md:h-[46px] w-auto hidden dark:block"
            priority
          />
        </Link>

        {/* Nav Items Right: Leaderboard, About, Rules, Dark Mode Toggle */}
        <nav className="flex items-center gap-6 font-inter text-[15px] font-medium text-[#202020] dark:text-[#f4f4f5]">
          <Link
            href="/#leaderboard-section"
            className="hover:text-[#ff682c] dark:hover:text-[#ff682c] transition-colors"
          >
            Leaderboard
          </Link>

          <Link
            href="/about"
            className="hover:text-[#ff682c] dark:hover:text-[#ff682c] transition-colors"
          >
            About
          </Link>

          <Link
            href="/rules"
            className="hover:text-[#ff682c] dark:hover:text-[#ff682c] transition-colors"
          >
            Rules
          </Link>

          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
            className="w-9 h-9 rounded-full bg-[#efefef] dark:bg-[#18181b] border border-[#e8e8e8] dark:border-[#27272a] flex items-center justify-center text-[#202020] dark:text-[#f4f4f5] hover:bg-[#202020] dark:hover:bg-[#f4f4f5] hover:text-[#ffffff] dark:hover:text-[#0d0d0f] transition-all active:scale-95"
          >
            {isDark ? (
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
  );
}
