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
            ← Back to Observatory
          </Link>
          <h1 className="text-[36px] md:text-[48px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5] leading-[1.0] tracking-[-1px]">
            Platform Rules & Index Policies
          </h1>
          <p className="text-[16px] md:text-[18px] text-[#4d4d4d] dark:text-[#a1a1aa] max-w-2xl leading-[1.4]">
            Official guidelines governing bidding software indexing eligibility, data filtering, payment terms, and legal policies.
          </p>
        </div>

        <section className="space-y-8 text-[#202020] dark:text-[#f4f4f5] text-[15px] md:text-[16px] leading-[1.6]">
          {/* Rule 1 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              Rule 1: Bidding Platform Qualification & Data Filtering
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding is exclusively dedicated to indexing bidding platforms, auction marketplace software, and dynamic pricing tools. If an entry is submitted for a non-bidding product, general SaaS, personal portfolio, or unrelated URL, administrators reserve the right to filter and suppress the entry from the public data index to ensure data purity. No refunds are issued for non-qualifying filtered entries.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              Rule 2: Minimum Benchmark Bid & Dynamic Surpassing
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              The initial minimum index entry fee is $1.00. To establish the #1 rank in the benchmark index, a submission must equal or exceed the required target threshold ($1.00 higher than current leader or starting benchmark). Submissions are processed atomically per transaction.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              Rule 3: Paddle Merchant of Record & Payment Finality
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              All digital software transactions are securely billed and processed by <strong>Paddle.com</strong>, our Merchant of Record. All sales are final once confirmed by Paddle. Because dataset recalculation and ranking execution occur instantaneously, standard refunds are not provided, as outlined in our{" "}
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
              Because indexing submissions are anonymous and account-free, any public bidding platform may be submitted by community participants. Inclusion in the WhosBidding benchmark index does not imply endorsement, authorization, or partnership with the target platform owners.
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
