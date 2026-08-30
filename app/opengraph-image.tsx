import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const alt = "WhosBidding — The Leaderboard for Bidding Platforms";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const fontRegular = fs.readFileSync(
    path.join(process.cwd(), "public/fonts/inter-400.ttf")
  );
  const fontSemiBold = fs.readFileSync(
    path.join(process.cwd(), "public/fonts/inter-600.ttf")
  );
  const fontBold = fs.readFileSync(
    path.join(process.cwd(), "public/fonts/inter-700.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FCFBF9",
          position: "relative",
          padding: "40px 60px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Subtle Warm Ambient Glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 50% 18%, rgba(255, 104, 44, 0.09) 0%, transparent 55%)",
            display: "flex",
          }}
        />

        {/* Outer Frame Border */}
        <div
          style={{
            position: "absolute",
            top: "22px",
            left: "22px",
            right: "22px",
            bottom: "22px",
            border: "1.5px solid #EBE6DD",
            borderRadius: "28px",
            display: "flex",
          }}
        />

        {/* Top Status Capsule Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 20px",
            backgroundColor: "#F2ECE3",
            borderRadius: "999px",
            border: "1px solid #E4DDD2",
            marginBottom: "26px",
          }}
        >
          <div
            style={{
              width: "9px",
              height: "9px",
              borderRadius: "50%",
              backgroundColor: "#FF682C",
            }}
          />
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#5C574F",
            }}
          >
            The Meta-Leaderboard for Bidding Platforms
          </span>
        </div>

        {/* Main Logo & Wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "18px",
            marginBottom: "26px",
          }}
        >
          {/* Custom Tag Icon SVG */}
          <svg
            width="66"
            height="66"
            viewBox="0 0 100 100"
            style={{ display: "flex" }}
          >
            <path
              d="M20 14 L54 14 L86 50 L54 86 L20 86 C11 86 4 79 4 70 L4 30 C4 21 11 14 20 14 Z"
              fill="#202020"
            />
            <circle cx="26" cy="50" r="9.5" fill="#FF682C" />
          </svg>

          {/* Brand Wordmark */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontSize: "72px",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#202020",
              lineHeight: 1,
            }}
          >
            whosbidding
            <span style={{ color: "#FF682C" }}>.lol</span>
          </div>
        </div>

        {/* Subtitle / Punchy Editorial Copy */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "920px",
            gap: "10px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              fontSize: "27px",
              fontWeight: 600,
              color: "#202020",
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
            }}
          >
            No ads, no API keys, no revenue sharing. Just outbid the competition.
          </div>

          <div
            style={{
              fontSize: "22px",
              fontWeight: 400,
              color: "#6B655B",
              lineHeight: 1.4,
              letterSpacing: "-0.01em",
              maxWidth: "700px",
            }}
          >
            Why ship actual software when bidding platform founders can just outbid each other for temporary internet clout?
          </div>
        </div>

        {/* Bold Punchline in Ember Orange */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: "27px",
              fontWeight: 700,
              color: "#FF682C",
              letterSpacing: "-0.025em",
            }}
          >
            Will your platform claim #1 or get outbid?
          </span>
        </div>

        {/* Bottom Micro Details Row */}
        <div
          style={{
            position: "absolute",
            bottom: "36px",
            left: "56px",
            right: "56px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 14px",
              backgroundColor: "#202020",
              borderRadius: "8px",
            }}
          >
            <span
              style={{
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              whosbidding.lol
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#8E887E",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            <span>Real-Time Bidding Observatory</span>
            <span>•</span>
            <span style={{ color: "#FF682C", fontWeight: 600 }}>$1 Min Bid</span>
            <span>•</span>
            <span>100% Anonymous</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: fontRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: fontSemiBold,
          weight: 600,
          style: "normal",
        },
        {
          name: "Inter",
          data: fontBold,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}
