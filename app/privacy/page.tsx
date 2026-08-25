import Link from "next/link";
import { Footer } from "@/components/ui/footer";

export const metadata = {
  title: "Privacy Notice — WhosBidding",
  description: "WhosBidding Privacy Notice. Learn what data we process, how payments are handled by Paddle, and your privacy rights.",
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
            ← Back to Observatory
          </Link>
          <h1 className="text-[36px] md:text-[48px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5] leading-[1.0] tracking-[-1px]">
            Privacy Notice
          </h1>
          <p className="text-[14px] text-[#828282] dark:text-[#71717a]">
            Last updated: August 25, 2026
          </p>
        </div>

        <article className="space-y-8 text-[#202020] dark:text-[#f4f4f5] text-[15px] leading-[1.7]">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              1. Overview & Commitment to Privacy
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding is operated by <strong>Fintral</strong> (Sole Proprietorship: <strong>Nereyda Herrera Montero</strong>) (“Fintral”, “WhosBidding”, “we”, “our”, or “us”). We are committed to transparency and collecting only the minimal information necessary to deliver our real-time software observatory and process digital database indexing transactions safely.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              2. Information We Process
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              We operate an account-free software application. We do not ask for or store user passwords, personal profiles, or marketing lists. We process:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#4d4d4d] dark:text-[#a1a1aa] pl-2">
              <li><strong>Software Index Data:</strong> Public product handle (e.g. @handle or software domain URL) and benchmark target amount submitted during digital checkout.</li>
              <li><strong>Transaction Identifiers:</strong> Anonymous Paddle transaction tokens used to verify and reconcile completed index orders with database benchmark rankings.</li>
              <li><strong>Technical Telemetry:</strong> Ephemeral IP addresses and user-agent strings used for DDoS defense, rate limiting, and aggregate observatory traffic counting.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              3. Payment Processing & Paddle as Merchant of Record
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding does not collect, store, or process payment card numbers, CVVs, or billing addresses on its servers. All financial transactions are directly processed and handled by <strong>Paddle.com</strong> (Paddle Payments Limited / Paddle.com Inc.), our Merchant of Record and certified PCI-DSS Level 1 payment infrastructure.
            </p>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              Paddle acts as an independent Data Controller for customer billing details. For details on how Paddle processes payment information, please refer to the{" "}
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
              We do not use advertising cookies, tracking pixels, or cross-site tracking scripts. We utilize standard browser <code>localStorage</code> solely for functional UI preferences (such as saving your Light/Dark mode choice under the <code>whosbidding_theme</code> key).
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              5. How We Use Information
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              The processed technical data is used strictly to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#4d4d4d] dark:text-[#a1a1aa] pl-2">
              <li>Calculate and broadcast real-time benchmark index positions.</li>
              <li>Verify and reconcile Paddle checkout events via cryptographically signed webhooks.</li>
              <li>Prevent spam and maintain software index integrity.</li>
              <li>Display aggregate active viewer counts and platform telemetry.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              6. Data Sharing & Infrastructure Partners
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              We do not sell, rent, or monetize user data. Data is shared exclusively with certified technical infrastructure partners:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#4d4d4d] dark:text-[#a1a1aa] pl-2">
              <li><strong>Paddle.com:</strong> Merchant of Record, transaction processing, and tax compliance.</li>
              <li><strong>Supabase / AWS:</strong> Cloud database, atomic state locking, and real-time WebSocket distribution.</li>
              <li><strong>Vercel Inc.:</strong> Edge serverless hosting and application delivery.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              7. Data Rights (GDPR & CCPA)
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              Under applicable data protection laws (including GDPR and CCPA), you have the right to access, rectify, or request removal of public software entries associated with your domain. Verified domain owners may submit data requests directly to our compliance team.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              8. Contact & Operator Information
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding is operated by <strong>Fintral</strong> (Sole Proprietor: <strong>Nereyda Herrera Montero</strong>). For privacy inquiries, please contact:{" "}
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
