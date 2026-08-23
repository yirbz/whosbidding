import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#e8e8e8] dark:border-[#27272a] bg-[#ffffff] dark:bg-[#0d0d0f] transition-colors py-12 font-inter text-[#4d4d4d] dark:text-[#a1a1aa] text-[13px]">
      <div className="max-w-[1100px] mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#e8e8e8] dark:border-[#27272a]">
          {/* Brand & Mission Statement */}
          <div className="space-y-1.5 max-w-md">
            <Link
              href="/"
              className="font-polysans text-[20px] text-[#202020] dark:text-[#f4f4f5] font-normal tracking-[-0.5px] hover:text-[#ff682c] transition-colors"
            >
              WhosBidding
            </Link>
            <p className="leading-[1.5] text-[#828282] dark:text-[#71717a]">
              The real-time data observatory and competitive bidding arcade exclusively for bidding platform startups.
            </p>
          </div>

          {/* Quick Legal & Platform Navigation Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-medium text-[#202020] dark:text-[#f4f4f5]">
            <Link href="/about" className="hover:text-[#ff682c] dark:hover:text-[#ff682c] transition-colors">
              About
            </Link>
            <Link href="/rules" className="hover:text-[#ff682c] dark:hover:text-[#ff682c] transition-colors">
              Rules
            </Link>
            <Link href="/terms" className="hover:text-[#ff682c] dark:hover:text-[#ff682c] transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-[#ff682c] dark:hover:text-[#ff682c] transition-colors">
              Privacy Notice
            </Link>
            <Link href="/refund" className="hover:text-[#ff682c] dark:hover:text-[#ff682c] transition-colors">
              Refund Policy
            </Link>
          </nav>
        </div>

        {/* Merchant of Record & Legal Notice */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[#828282] dark:text-[#71717a] text-[12px] leading-[1.6]">
          <p>
            Payments and checkout orders are securely processed and fulfilled by our Merchant of Record,{" "}
            <strong className="text-[#202020] dark:text-[#f4f4f5] font-medium">Paddle.com</strong>.
          </p>
          <p>© {new Date().getFullYear()} WhosBidding. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
