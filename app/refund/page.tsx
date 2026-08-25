import Link from "next/link";
import { Footer } from "@/components/ui/footer";

export const metadata = {
  title: "Refund Policy — WhosBidding",
  description: "Official Refund Policy for WhosBidding. Learn about our digital software data services, order fulfillment, and billing resolution with Paddle.",
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
            ← Back to Observatory
          </Link>
          <h1 className="text-[36px] md:text-[48px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5] leading-[1.0] tracking-[-1px]">
            Refund & Cancellation Policy
          </h1>
          <p className="text-[14px] text-[#828282] dark:text-[#71717a]">
            Last updated: August 25, 2026
          </p>
        </div>

        <article className="space-y-8 text-[#202020] dark:text-[#f4f4f5] text-[15px] leading-[1.7]">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              1. Digital Software Service & Instant Computational Fulfillment
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding delivers intangible digital software services consisting of real-time database indexing, API telemetry verification, and live computational benchmark rank calculation for bidding platforms. When an order is completed via Paddle, fulfillment is instantaneous: the software pipeline ingests, validates, cryptographically indexes, and broadcasts the dataset update immediately to all connected clients via WebSockets.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              2. Standard Digital Services Policy
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              Because automated computing resources, cloud database writes, and real-time telemetry distribution occur immediately upon payment confirmation by Paddle, <strong>completed digital service transactions are non-refundable</strong> once the computation has successfully completed.
            </p>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              By initiating checkout, you acknowledge that delivery of the digital software service begins instantaneously and you expressly waive statutory cancellation rights for consumed digital computational services. When other platforms submit subsequent index entries that shift relative rank positions, this reflects normal dynamic algorithmic benchmarking and does not constitute a defect or grounds for a refund.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              3. Scope & Dataset Purity Filtering
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding is an index exclusively dedicated to bidding software and auction platforms. If a submission targets an unrelated entity (such as a generic store or personal website), our automated validation system filters the entry to maintain data purity, as outlined in our{" "}
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
              4. Exceptions & Technical Error Resolutions
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              We issue 100% full refunds under verified technical error conditions:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#4d4d4d] dark:text-[#a1a1aa] pl-2">
              <li><strong>Duplicate Transaction:</strong> You were inadvertently charged multiple times for a single submission due to network latency or browser checkout replay.</li>
              <li><strong>Fulfillment Failure:</strong> Your payment was captured by Paddle, but our backend failed to index the entry and the automated verification engine could not resolve it within 24 hours.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              5. How to Request Billing Support
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              If you encounter a duplicate charge or technical verification issue, contact our support team within <strong>14 calendar days</strong> with:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[#4d4d4d] dark:text-[#a1a1aa] pl-2">
              <li>Your Paddle Transaction ID (e.g. <code>txn_...</code> from your email receipt).</li>
              <li>The software handle or URL submitted for indexing.</li>
              <li>A description of the technical issue.</li>
            </ol>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa] pt-2">
              Contact:{" "}
              <a href="mailto:support@whosbidding.lol" className="text-[#ff682c] underline">
                support@whosbidding.lol
              </a>.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              6. Paddle Merchant of Record Buyer Portal
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              As our official Merchant of Record, <strong>Paddle.com</strong> (Paddle Payments Limited / Paddle.com Inc.) provides 24/7 buyer support for payment disputes, tax invoice copies, and charge inquiries. You can access Paddle’s dedicated buyer portal at{" "}
              <a href="https://paddle.net" target="_blank" rel="noopener noreferrer" className="text-[#ff682c] underline">
                paddle.net
              </a>{" "}
              or through the direct link in your official purchase receipt.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
