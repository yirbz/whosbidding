import Link from "next/link";

export const metadata = {
  title: "Platform Rules & Terms — WhosBidding",
  description: "Official rules, rank suppression criteria, Paddle Merchant of Record terms, and legal disclaimers for WhosBidding.",
};

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-[#ffffff] text-[#202020] flex flex-col font-inter">
      <main className="flex-1 max-w-[840px] w-full mx-auto px-6 py-12 md:py-16 space-y-10">
        <div className="space-y-3 pb-6 border-b border-[#e8e8e8]">
          <Link
            href="/"
            className="text-[13px] font-inter text-[#ff682c] hover:underline inline-flex items-center gap-1"
          >
            ← Back to Leaderboard
          </Link>
          <h1 className="text-[36px] md:text-[48px] font-polysans font-normal text-[#202020] leading-[1.0] tracking-[-1px]">
            Platform Rules & Disclaimers
          </h1>
          <p className="text-[16px] md:text-[18px] text-[#4d4d4d] max-w-2xl leading-[1.4]">
            Official guidelines governing bidding eligibility, rank suppression, payment terms, and liability.
          </p>
        </div>

        <section className="space-y-6 text-[#202020] text-[15px] md:text-[16px] leading-[1.6]">
          {/* Rule 1 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020]">
              Rule 1: Bidding Platform Qualification & Rank Suppression
            </h2>
            <p className="text-[#4d4d4d]">
              WhosBidding is exclusively reserved for bidding platform startups. If an entry is submitted for a non-bidding product, standard SaaS, or unrelated URL, administrators reserve the absolute right to suppress and hide the entry from the public leaderboard rank list. No refunds are issued for suppressed non-qualifying entries.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020]">
              Rule 2: Minimum Bid & Surpassing Model
            </h2>
            <p className="text-[#4d4d4d]">
              The initial minimum bid is $1.00. To claim #1 rank, a bid must equal or exceed the required target bid price. Bidders pay 100% of the target bid amount directly per transaction.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020]">
              Rule 3: Paddle Merchant of Record & Refund Policy
            </h2>
            <p className="text-[#4d4d4d]">
              All transactions are billed by <strong>Paddle.com</strong> (Merchant of Record). All sales are final. Once a transaction is completed on Paddle, the placement is committed to the database. No cancellations or refunds will be granted.
            </p>
          </div>

          {/* Rule 4 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020]">
              Rule 4: Unconsented Submissions & Non-Affiliation
            </h2>
            <p className="text-[#4d4d4d]">
              Because bids are anonymous and account-free, any public startup may be placed by any third-party bidder. Listing on WhosBidding does not imply endorsement or authorization by the target startup owners.
            </p>
          </div>

          {/* Rule 5 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020]">
              Rule 5: Takedown & Site Uptime Disclaimer
            </h2>
            <p className="text-[#4d4d4d]">
              WhosBidding bears no responsibility or liability if a listed startup’s external website is taken down, suspended, offline, or unavailable. We do not monitor or guarantee the operational status of third-party domains.
            </p>
          </div>
        </section>

        <div className="pt-6 border-t border-[#e8e8e8] flex justify-between items-center text-[14px]">
          <Link href="/about" className="text-[#ff682c] font-medium hover:underline">
            Read About WhosBidding →
          </Link>
          <Link href="/" className="text-[#828282] hover:text-[#202020]">
            Return Home
          </Link>
        </div>
      </main>

      <footer className="border-t border-[#e8e8e8] py-8 text-center text-[13px] font-inter text-[#828282]">
        WhosBidding • Platform Rules & Disclaimers
      </footer>
    </div>
  );
}
