import Link from "next/link";
import { Footer } from "@/components/ui/footer";

export const metadata = {
  title: "About WhosBidding — Real-Time Data Observatory for Bidding Platforms",
  description: "Learn about WhosBidding, the digital software data observatory and real-time benchmark index for bidding platforms.",
};

export default function AboutPage() {
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
            About WhosBidding
          </h1>
          <p className="text-[16px] md:text-[18px] text-[#4d4d4d] dark:text-[#a1a1aa] max-w-2xl leading-[1.4]">
            An interactive data observatory and live benchmark software platform dedicated to tracking and indexing bidding technologies.
          </p>
        </div>

        <section className="space-y-8 text-[#202020] dark:text-[#f4f4f5] text-[15px] md:text-[16px] leading-[1.6]">
          {/* Section 1 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              1. Real-Time Software Observatory & Indexing Engine
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding is an interactive software platform that monitors, verifies, and indexes bidding platform software. It provides developers, founders, and community analysts with real-time telemetry, live benchmark data, and an interactive ranking engine to observe competitive bidding thresholds across the industry.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              2. Digital Software Service vs. Advertising
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding is <strong>not an advertising agency, marketing network, or promotional ad space seller</strong>. Transactions on WhosBidding represent digital software utility fees for live database entry verification, telemetry recording, and computational index benchmarking within our real-time software engine.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              3. Merchant of Record & Payment Processing (Paddle.com)
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              All digital software orders on WhosBidding are securely processed and fulfilled by <strong>Paddle.com</strong> (Paddle Payments Limited / Paddle.com Inc.), our official Merchant of Record. Paddle manages PCI-DSS compliance, global sales tax and VAT remittance, invoicing, and customer billing support.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              4. Disclaimer of Liability & External Systems
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              WhosBidding does not own, operate, or maintain external third-party bidding platforms listed in the dataset. Placements in the benchmark dataset reflect community-submitted entries processed through our software index algorithm.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <h2 className="text-[22px] font-polysans font-normal text-[#202020] dark:text-[#f4f4f5]">
              5. Legal Compliance & Governance Links
            </h2>
            <p className="text-[#4d4d4d] dark:text-[#a1a1aa]">
              For complete legal terms, user data protection notices, and transaction policies, please review our official documentation:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <Link
                href="/terms"
                className="p-4 rounded-xl border border-[#e8e8e8] dark:border-[#27272a] bg-[#efefef] dark:bg-[#18181b] hover:border-[#ff682c] transition-all"
              >
                <div className="font-polysans text-[16px] text-[#202020] dark:text-[#f4f4f5]">Terms of Service</div>
                <div className="text-[13px] text-[#828282] dark:text-[#71717a] mt-1">Platform rules & Paddle terms</div>
              </Link>

              <Link
                href="/privacy"
                className="p-4 rounded-xl border border-[#e8e8e8] dark:border-[#27272a] bg-[#efefef] dark:bg-[#18181b] hover:border-[#ff682c] transition-all"
              >
                <div className="font-polysans text-[16px] text-[#202020] dark:text-[#f4f4f5]">Privacy Notice</div>
                <div className="text-[13px] text-[#828282] dark:text-[#71717a] mt-1">Data collection & security</div>
              </Link>

              <Link
                href="/refund"
                className="p-4 rounded-xl border border-[#e8e8e8] dark:border-[#27272a] bg-[#efefef] dark:bg-[#18181b] hover:border-[#ff682c] transition-all"
              >
                <div className="font-polysans text-[16px] text-[#202020] dark:text-[#f4f4f5]">Refund Policy</div>
                <div className="text-[13px] text-[#828282] dark:text-[#71717a] mt-1">Order terms & billing support</div>
              </Link>
            </div>
          </div>
        </section>

        <div className="pt-6 border-t border-[#e8e8e8] dark:border-[#27272a] flex justify-between items-center text-[14px]">
          <Link href="/rules" className="text-[#ff682c] font-medium hover:underline">
            Read Platform Rules & Index Policy →
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
