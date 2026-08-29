import Link from "next/link";
import { Footer } from "@/components/ui/footer";

export const metadata = {
  title: "Terms of Service — WhosBidding",
  description: "Official terms of service for WhosBidding, a real-time data observatory and digital benchmark index for bidding platforms.",
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
            Last updated: August 29, 2026
          </p>
        </div>

        <article className="space-y-8 text-[#202020] dark:text-[#f4f4f5] text-[15px] leading-[1.7]">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              1. Agreement to Terms & Operating Entity
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              Welcome to <strong>WhosBidding</strong>. WhosBidding is owned and operated by <strong>Fintral</strong> (Sole Proprietorship: <strong>Nereyda Herrera Montero</strong>) (“Fintral”, “WhosBidding”, “we”, “our”, or “us”). By accessing our website (https://whosbidding.lol), viewing our real-time leaderboard, or purchasing a bid placement, you agree to be legally bound by these Terms of Service (“Terms”). If you do not agree with any part of these Terms, you must not access or use the Platform.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              2. Description of Digital Service & Bidding Platform Leaderboard
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding is an interactive software application and real-time meta-leaderboard designed exclusively to track and rank competitive bidding platforms. When a user submits a bid, they purchase a <strong>digital software service</strong> encompassing real-time database recording, live telemetry broadcasting, and ranking placement in our leaderboard system.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              3. Paddle Merchant of Record & Billing Terms
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              Our order process is conducted by our online Merchant of Record, <strong>Paddle.com</strong> (Paddle Payments Limited / Paddle.com Inc.). Paddle is the Merchant of Record for all our orders. Paddle manages order processing, invoicing, sales tax/VAT compliance, customer billing inquiries, and returns. When submitting an index transaction, you agree to Paddle’s Checkout Buyer Terms and conditions.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              4. Strict Bidding Platform Scope & Rank Suppression Policy
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding is a specialized meta-platform built strictly and exclusively for bidding platforms, auction software, and competitive leaderboard projects. If a user submits a bid for a general SaaS product, e-commerce storefront, personal portfolio, or any startup that is <strong>not</strong> a bidding platform, administrators reserve the absolute right to <strong>suppress and hide</strong> the entry from the public leaderboard rankings.
            </p>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              Please note that all users are expected to review and agree to these Terms of Service prior to placing a bid. Because computational database writes, real-time broadcasting, and Merchant of Record payment processing resources are consumed instantaneously upon checkout confirmation, <strong>suppressed non-bidding entries will not receive a refund under any circumstances</strong>.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              5. Community Indexing & Public Domain References
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding requires no user account creation or password credentials. Any user may submit any publicly accessible bidding software URL or social handle for community benchmarking. The appearance of a third-party platform in the dataset does not imply official partnership, sponsorship, or corporate affiliation.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              6. Digital Service Finality & Refund Policy
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              All sales of digital data indexing entries are final upon payment confirmation by Paddle. Because dataset recalculation and ranking execution occur instantaneously, standard refunds are not provided once the digital service has been executed. For full details, please review our{" "}
              <Link href="/refund" className="text-[#ff682c] underline">
                Refund Policy
              </Link>.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              7. Disclaimer of Warranties
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              The software observatory and index services are provided on an “AS IS” and “AS AVAILABLE” basis without warranties of any kind, whether express or implied. WhosBidding does not control, operate, or monitor external third-party software websites.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              8. Limitation of Liability
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              To the maximum extent permitted by applicable law, in no event shall WhosBidding, its operators, affiliates, or Paddle be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Platform or data index.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              9. Contact & Operator Information
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding is operated by <strong>Fintral</strong> (Sole Proprietor: <strong>Nereyda Herrera Montero</strong>). For customer support, billing inquiries, or legal compliance notices, please contact:{" "}
              <a href="mailto:support@whosbidding.lol" className="text-[#ff682c] underline">
                support@whosbidding.lol
              </a>.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
