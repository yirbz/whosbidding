import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";

import { Header } from "@/components/ui/header";

export const metadata: Metadata = {
  title: "WhosBidding",
  description: "Bid to get your startup to #1 on the leaderboard. Live low-latency bidding.",
  icons: {
    icon: [
      { url: "/whosbidding_favicon_v3.svg", type: "image/svg+xml" },
    ],
    shortcut: "/whosbidding_favicon_v3.svg",
    apple: "/whosbidding_favicon_v3.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const paddleEnv = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || "sandbox";
  const paddleToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "";

  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#ffffff] text-[#202020] font-inter">
        <Script
          src="https://cdn.paddle.com/paddle/v2/paddle.js"
          strategy="beforeInteractive"
        />
        {paddleToken && (
          <Script id="paddle-init" strategy="afterInteractive">
            {`
              if (window.Paddle) {
                Paddle.Environment.set("${paddleEnv}");
                Paddle.Initialize({ token: "${paddleToken}" });
              }
            `}
          </Script>
        )}
        <Header />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
