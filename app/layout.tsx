import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";

import { Header } from "@/components/ui/header";
import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://whosbidding.lol"),
  title: "WhosBidding — Real-Time Data Observatory for Bidding Platforms",
  description: "Interactive real-time data observatory and software benchmark index tracking competitive bidding platforms and auction software systems.",
  icons: {
    icon: [
      { url: "/whosbidding_favicon_v3.svg", type: "image/svg+xml" },
    ],
    shortcut: "/whosbidding_favicon_v3.svg",
    apple: "/whosbidding_favicon_v3.svg",
  },
  openGraph: {
    title: "WhosBidding — Real-Time Software Data Observatory",
    description: "Interactive data observatory and benchmark index for bidding platforms and auction software.",
    url: "https://whosbidding.lol",
    siteName: "WhosBidding",
    type: "website",
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
