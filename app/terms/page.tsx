import Link from "next/link";
import { Footer } from "@/components/ui/footer";

export const metadata = {
  title: "Terms of Service — WhosBidding",
  description: "Official terms and conditions for using WhosBidding, including digital placement rules, Paddle Merchant of Record terms, and liability limits.",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-[14px] text-[#828282] dark:text-[#71717a]">
            Last updated: August 23, 2026
          </p>
        </div>

        <article className="space-y-8 text-[#202020] dark:text-[#f4f4f5] text-[15px] leading-[1.7]">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              1. Agreement to Terms
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              Welcome to <strong>WhosBidding</strong> (“WhosBidding”, “we”, “our”, or “the Platform”). By accessing our website (https://whosbidding.vercel.app), submitting a bid, or using any associated services, you agree to be legally bound by these Terms of Service (“Terms”). If you do not agree with any part of these Terms, you must not access the Platform or place a bid.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              2. Description of Digital Placement Service
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding provides a real-time data observatory and competitive ranking arcade exclusively for bidding platform startups. When you complete a financial transaction, you purchase a digital, real-time rank placement on the public leaderboard corresponding to the submitted startup URL or @handle. Placements dynamically adjust based on community bidding activity and surpassing rules.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              3. Paddle Merchant of Record & Billing Terms
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              Our order process is conducted by our online Merchant of Record, <strong>Paddle.com</strong> (Paddle Payments Limited / Paddle.com Inc.). Paddle is the Merchant of Record for all our orders. Paddle manages order processing, invoicing, sales tax/VAT compliance, customer billing inquiries, and returns. When placing a bid, you agree to Paddle’s Checkout Buyer Terms and conditions.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              4. Strict Bidding Platform Scope & Rank Suppression
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding is strictly designed for bidding platforms, auction software, reverse auctions, and competitive bidding tools. If a submitted handle or URL represents a general SaaS product, e-commerce storefront, personal portfolio, or unrelated product, WhosBidding administrators reserve the unconditional right to <strong>suppress and hide</strong> the entry from the public ranking list.
            </p>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              Because placement slots and processing resources are instantly consumed upon transaction confirmation, suppressed entries for non-qualifying products are not eligible for a refund.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              5. Anonymous Submissions & Third-Party Unconsented Placements
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding requires no user accounts, passwords, or personal profiles. Any user may submit any publicly accessible startup website URL or social handle. Consequently, a startup may appear on the leaderboard without the prior knowledge, direct authorization, or endorsement of that startup’s management or founders. The appearance of a third-party startup on WhosBidding does not imply partnership, sponsorship, or affiliation.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              6. Digital Product Finality & Non-Refundability
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              All sales of digital rank placements are final upon payment confirmation by Paddle. Because leaderboard positions and dynamic ranking benefits take effect immediately upon transaction execution, no cancellations or standard refunds are provided. For full details, please review our{" "}
              <Link href="/refund" className="text-[#ff682c] underline">
                Refund Policy
              </Link>.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              7. Disclaimer of Warranties & Third-Party Uptime
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              The Platform and digital placements are provided on an “AS IS” and “AS AVAILABLE” basis without warranties of any kind, whether express or implied. WhosBidding does not own, control, or monitor third-party startup websites. We accept zero responsibility if a listed startup ceases operations, undergoes domain name transfer, suffers downtime, or becomes inaccessible.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              8. Limitation of Liability
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              To the maximum extent permitted by applicable law, in no event shall WhosBidding, its operators, affiliates, or Paddle be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, goodwill, or business interruption, arising out of or in connection with your use of the Platform.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              9. Takedown & Content Removal Requests
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              If you are the verified domain owner or authorized representative of a listed startup and wish to have your handle or logo suppressed from the public leaderboard, contact our team with proof of domain ownership. We will review and process takedown requests promptly.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              10. Contact Information
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              If you have any questions or legal inquiries regarding these Terms, please contact us at:{" "}
              <a href="mailto:support@whosbidding.com" className="text-[#ff682c] underline">
                support@whosbidding.com
              </a>.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
