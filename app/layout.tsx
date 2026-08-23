import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";

import { Header } from "@/components/ui/header";
import { ThemeProvider } from "@/components/providers/theme-provider";

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
  const paddleToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "";
  const isClientTokenLive = paddleToken.startsWith("live_");
  const paddleEnv = isClientTokenLive
    ? "production"
    : paddleToken.startsWith("test_")
    ? "sandbox"
    : process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || "sandbox";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('whosbidding_theme');
                if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-[#ffffff] dark:bg-[#0d0d0f] text-[#202020] dark:text-[#f4f4f5] font-inter">
        <ThemeProvider>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
