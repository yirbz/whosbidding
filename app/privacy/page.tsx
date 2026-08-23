import Link from "next/link";
import { Footer } from "@/components/ui/footer";

export const metadata = {
  title: "Privacy Notice — WhosBidding",
  description: "WhosBidding Privacy Notice. Learn what data we collect, how payments are handled by Paddle, and your privacy rights.",
};

export default function PrivacyPage() {
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
            Privacy Notice
          </h1>
          <p className="text-[14px] text-[#828282] dark:text-[#71717a]">
            Last updated: August 23, 2026
          </p>
        </div>

        <article className="space-y-8 text-[#202020] dark:text-[#f4f4f5] text-[15px] leading-[1.7]">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              1. Overview & Commitment to Privacy
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding (“WhosBidding”, “we”, “our”, or “us”) values your privacy. We are committed to transparency and collecting only the minimal information necessary to deliver our real-time leaderboard service and process placement transactions safely.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              2. Information We Collect
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              We operate an account-free platform. We do not ask for or store user passwords, profile data, or contact lists. We only process:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#4d4d4d] dark:text-[#a1a1aa] pl-2">
              <li><strong>Submitted Placement Data:</strong> Public startup handle (e.g., @handle or website URL) and target bid amounts submitted during checkout.</li>
              <li><strong>Transaction Identifiers:</strong> Anonymous Paddle transaction tokens used to link completed orders to leaderboard rankings.</li>
              <li><strong>Technical & Analytics Data:</strong> IP addresses and user-agent strings processed ephemerally for DDoS mitigation, rate limiting, and cumulative page view counting.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              3. Payment Processing & Paddle as Merchant of Record
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding does not collect, store, or process sensitive payment card numbers, CVVs, or billing addresses on its servers. All financial transactions are directly processed and handled by <strong>Paddle.com</strong> (Paddle Payments Limited / Paddle.com Inc.), our Merchant of Record and certified PCI-DSS compliant payment provider.
            </p>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              Paddle acts as an independent Data Controller for customer billing details. For full details on how Paddle processes payment information, please refer to the{" "}
              <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-[#ff682c] underline">
                Paddle Privacy Notice
              </a>.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              4. Cookies & Local Storage
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              We do not deploy third-party advertising cookies or cross-site tracking pixels. We use standard browser <code>localStorage</code> solely for technical and aesthetic preferences (such as saving your Light/Dark mode choice under the <code>whosbidding_theme</code> key).
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              5. How We Use Information
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              The collected information is utilized strictly to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#4d4d4d] dark:text-[#a1a1aa] pl-2">
              <li>Calculate and broadcast real-time leaderboard positions.</li>
              <li>Verify and reconcile Paddle checkout events via secure webhooks.</li>
              <li>Prevent spam, fraud, and non-compliant placement submissions.</li>
              <li>Provide accurate cumulative visitor telemetry and live platform statistics.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              6. Data Sharing & Third-Party Service Providers
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              We do not sell, rent, or trade any personal or placement data to third parties. We share data only with verified infrastructure partners essential for operating the Platform:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#4d4d4d] dark:text-[#a1a1aa] pl-2">
              <li><strong>Paddle.com:</strong> Merchant of Record and payment processing.</li>
              <li><strong>Supabase / AWS:</strong> Encrypted cloud database and real-time pub/sub synchronization.</li>
              <li><strong>Vercel Inc.:</strong> High-speed edge hosting and compute infrastructure.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              7. Your Rights (GDPR & CCPA)
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              Under applicable data protection laws (including the GDPR and CCPA), you have the right to access, rectify, or request deletion of data associated with your public domain or submission. Because we maintain no personal user accounts, data deletion requests regarding specific startup listings or public handles can be submitted directly by verified domain owners.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              8. Contact Us
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              For any privacy-related requests, questions, or takedown notices, contact us at:{" "}
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
