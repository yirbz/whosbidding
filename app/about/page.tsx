import Link from "next/link";

export const metadata = {
  title: "About WhosBidding — Meta-Observatory for Bidding Platforms",
  description: "Learn about WhosBidding's platform scope, moderation rules, Paddle Merchant of Record terms, and disclaimers.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#0d0d0f] text-[#202020] dark:text-[#f4f4f5] flex flex-col font-inter transition-colors">
      <main className="flex-1 max-w-[840px] w-full mx-auto px-6 py-12 md:py-16 space-y-10">
        <div className="space-y-3 pb-6 border-b border-[#e8e8e8] dark:border-[#27272a]">
          <Link
            href="/"
            className="text-[13px] font-inter text-[#ff682c] hover:underline inline-flex items-center gap-1"
          >
            ← Back to Leaderboard
          </Link>
          <h1 className="text-[36px] md:text-[48px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5] leading-[1.0] tracking-[-1px]">
            About WhosBidding
          </h1>
          <p className="text-[16px] md:text-[18px] text-[#4d4d4d] dark:text-[#a1a1aa] max-w-2xl leading-[1.4]">
            The real-time meta-observatory and bidding arcade created strictly for bidding platform startups.
          </p>
        </div>

        <section className="space-y-6 text-[#202020] dark:text-[#f4f4f5] text-[15px] md:text-[16px] leading-[1.6]">
          {/* Section 1 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              1. Exclusively for Bidding Platform Startups
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding is an intentional meta-experiment reserved strictly for bidding platforms, auction software, and competitive leaderboard projects. If you place a bid for a general SaaS, e-commerce store, personal portfolio, or non-bidding product, your entry will be suppressed and hidden from the public leaderboard rank list without refund.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              2. Anonymous Submissions & Third-Party Unconsented Placements
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              All bids on WhosBidding are 100% anonymous and require zero user account creation. Because anyone can enter any publicly accessible startup URL or @handle, a bidding platform may be placed on the leaderboard by third-party bidders without the direct knowledge or consent of the platform’s founders. Inclusion on WhosBidding does not imply official endorsement, partnership, or affiliation.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              3. Merchant of Record & Payment Finality (Paddle)
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              All financial transactions are securely processed by <strong>Paddle</strong>, our Merchant of Record. Paddle handles tax compliance, invoicing, and billing. Every bid payment is non-refundable, final, and represents a one-time placement charge for the specified target bid amount.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              4. Disclaimer of Liability & Offline Sites
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding does not own, operate, monitor, or verify third-party bidding platforms listed on the board. We accept zero responsibility or legal liability if a listed startup goes offline, undergoes a domain change, gets taken down, or ceases business operations. Placements remain linked to the handle submitted at the time of payment.
            </p>
          </div>
        </section>

        <div className="pt-6 border-t border-[#e8e8e8] dark:border-[#27272a] flex justify-between items-center text-[14px]">
          <Link href="/rules" className="text-[#ff682c] font-medium hover:underline">
            Read WhosBidding Rules & Policy →
          </Link>
          <Link href="/" className="text-[#828282] dark:text-[#71717a] hover:text-[#202020] dark:hover:text-[#f4f4f5]">
            Return Home
          </Link>
        </div>
      </main>

      <footer className="border-t border-[#e8e8e8] dark:border-[#27272a] py-8 text-center text-[13px] font-inter text-[#828282] dark:text-[#71717a] bg-[#ffffff] dark:bg-[#0d0d0f] transition-colors">
        WhosBidding • Meta-Observatory for Bidding Platforms
      </footer>
    </div>
  );
}
