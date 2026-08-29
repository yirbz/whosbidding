import Link from "next/link";
import { Footer } from "@/components/ui/footer";

export const metadata = {
  title: "Benchmark Rules & Index Policies — WhosBidding",
  description: "Official rules, benchmark criteria, Paddle Merchant of Record terms, and legal policies for WhosBidding.",
};

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#0d0d0f] text-[#202020] dark:text-[#f4f4f5] flex flex-col font-inter transition-colors">
      <main className="flex-1 max-w-[860px] w-full mx-auto px-6 py-12 md:py-16 space-y-10">
        <div className="space-y-3 pb-6 border-b border-[#e8e8e8] dark:border-[#27272a]">
          <Link
            href="/"
            className="text-[13px] font-inter text-[#ff682c] hover:underline inline-flex items-center gap-1"
          >
            ← Back to Leaderboard
          </Link>
          <h1 className="text-[36px] md:text-[48px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5] leading-[1.0] tracking-[-1px]">
            Platform Rules & Disclaimers
          </h1>
          <p className="text-[16px] md:text-[18px] text-[#4d4d4d] dark:text-[#a1a1aa] max-w-2xl leading-[1.4]">
            Official guidelines governing bidding eligibility, rank suppression, payment terms, and liability.
          </p>
        </div>

        <section className="space-y-8 text-[#202020] dark:text-[#f4f4f5] text-[15px] md:text-[16px] leading-[1.6]">
          {/* Rule 1 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              Rule 1: Bidding Platform Qualification & Rank Suppression
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding is exclusively reserved for bidding platform startups. If an entry is submitted for a non-bidding product, standard SaaS, personal portfolio, or unrelated URL, administrators reserve the absolute right to suppress and hide the entry from the public leaderboard rank list. No refunds are issued for suppressed non-qualifying entries.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              Rule 2: Minimum Bid & Surpassing Model
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              The initial minimum bid starts at $1.00. To claim the #1 rank, a bid must equal or exceed the target bid threshold ($1.00 above the current leader). Bidders pay 100% of the target bid amount per transaction.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              Rule 3: Paddle Merchant of Record & Payment Finality
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              All transactions are securely billed and processed by <strong>Paddle.com</strong>, our official Merchant of Record. All sales are final once confirmed by Paddle. Because dataset recalculation and ranking execution occur instantaneously, standard refunds are not provided, as outlined in our{" "}
              <Link href="/refund" className="text-[#ff682c] underline">
                Refund Policy
              </Link>.
            </p>
          </div>

          {/* Rule 4 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              Rule 4: Community Submissions & Non-Affiliation
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              Because bids are anonymous and account-free, any public startup may be placed by any third-party bidder. Inclusion on WhosBidding does not imply endorsement, sponsorship, or authorization by the target startup owners.
            </p>
          </div>

          {/* Rule 5 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              Rule 5: Legal Compliance & Governance Links
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              For complete details on our data protection practices, merchant terms, and refund guidelines, please consult:
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-[14px] font-medium">
              <Link href="/terms" className="text-[#ff682c] hover:underline">
                Terms of Service →
              </Link>
              <Link href="/privacy" className="text-[#ff682c] hover:underline">
                Privacy Notice →
              </Link>
              <Link href="/refund" className="text-[#ff682c] hover:underline">
                Refund Policy →
              </Link>
            </div>
          </div>
        </section>

        <div className="pt-6 border-t border-[#e8e8e8] dark:border-[#27272a] flex justify-between items-center text-[14px]">
          <Link href="/about" className="text-[#ff682c] font-medium hover:underline">
            Read About WhosBidding →
          </Link>
          <Link href="/" className="text-[#828282] dark:text-[#71717a] hover:text-[#202020] dark:hover:text-[#f4f4f5]">
            Return Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
