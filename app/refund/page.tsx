import Link from "next/link";
import { Footer } from "@/components/ui/footer";

export const metadata = {
  title: "Refund Policy — WhosBidding",
  description: "Official Refund Policy for WhosBidding. Learn about our digital placement delivery, non-refundable terms, and billing resolution with Paddle.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#0d0d0f] text-[#202020] dark:text-[#f4f4f5] flex flex-col font-inter transition-colors">
      <main className="flex-1 max-w-[860px] w-full mx-auto px-6 py-12 md:py-16 space-y-10">
        {/* Header Breadcrumbs */}
        <div className="space-y-3 pb-6 border-b border-[#e8e8e8] dark:border-[#27272a]">
          <Link
            href="/"
            className="text-[13px] font-inter text-[#ff682c] hover:underline inline-flex items-center gap-1"
          >
            ← Back to Leaderboard
          </Link>
          <h1 className="text-[36px] md:text-[48px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5] leading-[1.0] tracking-[-1px]">
            Refund & Cancellation Policy
          </h1>
          <p className="text-[14px] text-[#828282] dark:text-[#71717a]">
            Last updated: August 23, 2026
          </p>
        </div>

        <article className="space-y-8 text-[#202020] dark:text-[#f4f4f5] text-[15px] leading-[1.7]">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              1. Digital Service & Immediate Fulfillment
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding sells intangible, digital leaderboard rank placements. When you place a bid and complete payment through Paddle, fulfillment is instantaneous: your startup’s placement is immediately recorded, calculated, and publicly broadcast on the leaderboard.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              2. Standard Non-Refundable Policy
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              Because the digital placement and competitive promotional exposure occur immediately upon checkout completion, <strong>all transactions are final and non-refundable</strong>.
            </p>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              By initiating checkout, you acknowledge and agree that you waive any statutory withdrawal or cancellation period once digital fulfillment has begun. Furthermore, if your startup is subsequently outbid by another platform, this represents normal competitive platform dynamics and does not warrant a refund.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              3. Non-Qualifying / Suppressed Submissions
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding is exclusively reserved for bidding platform startups. If you place a bid for a general SaaS, e-commerce store, personal portfolio, or non-bidding service, our moderation team reserves the right to suppress and hide the placement without refund, as explicitly stated in our{" "}
              <Link href="/rules" className="text-[#ff682c] underline">
                Platform Rules
              </Link>{" "}
              and{" "}
              <Link href="/terms" className="text-[#ff682c] underline">
                Terms of Service
              </Link>.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              4. Exceptions & Technical Billing Errors
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              We will gladly issue a full refund under the following verified technical circumstances:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#4d4d4d] dark:text-[#a1a1aa] pl-2">
              <li><strong>Duplicate Billing:</strong> You were inadvertently charged multiple times for the exact same single bid attempt due to network latency or checkout error.</li>
              <li><strong>Verified System Failure:</strong> Your payment was successfully captured by Paddle, but our backend failed to record your bid on the leaderboard and the issue could not be resolved by our automated verification system within 24 hours.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              5. How to Request Assistance
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              If you experience a technical billing error, please email us within <strong>14 calendar days</strong> of the transaction with:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[#4d4d4d] dark:text-[#a1a1aa] pl-2">
              <li>Your Paddle Transaction ID (e.g., <code>txn_...</code> from your email receipt).</li>
              <li>The startup handle or URL submitted.</li>
              <li>A brief description of the technical issue encountered.</li>
            </ol>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa] pt-2">
              Contact our billing support team at:{" "}
              <a href="mailto:support@whosbidding.com" className="text-[#ff682c] underline">
                support@whosbidding.com
              </a>.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              6. Paddle Merchant of Record Resolution
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              As our official Merchant of Record, <strong>Paddle.com</strong> also provides 24/7 buyer support for payment disputes, tax invoice receipts, and charge inquiries. You can access Paddle’s buyer support portal directly via the link provided in your official email receipt or at{" "}
              <a href="https://paddle.net" target="_blank" rel="noopener noreferrer" className="text-[#ff682c] underline">
                paddle.net
              </a>.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
