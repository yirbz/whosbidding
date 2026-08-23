"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BidCalculator } from "./bid-calculator";
import { MAX_BID_AMOUNT } from "@/lib/domain/bid";

interface BidPanelProps {
  currentLeaderBid: number;
  onBidSuccess?: () => void;
}

declare global {
  interface Window {
    Paddle?: any;
  }
}

export function BidPanel({ currentLeaderBid, onBidSuccess }: BidPanelProps) {
  const minTarget = currentLeaderBid > 0 ? currentLeaderBid + 1 : 1;
  const [handle, setHandle] = useState<string>("");
  const [targetBid, setTargetBid] = useState<number>(minTarget);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (currentLeaderBid > 0 && targetBid <= currentLeaderBid) {
      setTargetBid(Math.min(MAX_BID_AMOUNT, currentLeaderBid + 1));
    } else if (currentLeaderBid === 0 && targetBid < 1) {
      setTargetBid(1);
    }
  }, [currentLeaderBid]);

  // Press & Hold Accelerating Stepper Logic
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopHold = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearTimeout(intervalRef.current);
    timerRef.current = null;
    intervalRef.current = null;
  };

  const startHold = (direction: "inc" | "dec") => {
    stopHold();

    const stepAction = (multiplier: number) => {
      setTargetBid((prev) => {
        if (direction === "inc") {
          return Math.min(MAX_BID_AMOUNT, prev + multiplier);
        } else {
          return Math.max(minTarget, prev - multiplier);
        }
      });
    };

    // Immediate first step
    stepAction(1);

    // Hold delay: after 250ms, start continuous accelerating ticks
    timerRef.current = setTimeout(() => {
      let ticks = 0;
      let delay = 100;

      const runRepeat = () => {
        ticks++;
        let stepAmount = 1;
        if (ticks > 25) stepAmount = 50;
        else if (ticks > 15) stepAmount = 10;
        else if (ticks > 5) stepAmount = 5;

        stepAction(stepAmount);

        delay = Math.max(25, delay - 4);
        intervalRef.current = setTimeout(runRepeat, delay);
      };

      runRepeat();
    }, 250);
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => stopHold();
  }, []);

  const handleInitiateBid = async () => {
    if (!handle || handle.trim().length < 2) {
      toast.error("Please enter a valid product URL or @handle (min 2 characters)");
      return;
    }

    if (targetBid > MAX_BID_AMOUNT) {
      toast.error(`Maximum bid cap is $${MAX_BID_AMOUNT.toLocaleString()}`);
      return;
    }

    setIsSubmitting(true);

    console.log("[BID_INITIATE] Submitting bid:", { handle, targetBid });

    try {
      const trimmed = handle.trim();
      const isUrl = trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.includes(".");
      const websiteUrl = isUrl ? (trimmed.startsWith("http") ? trimmed : `https://${trimmed}`) : null;

      const res = await fetch("/api/bids/create-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          handle: trimmed,
          website_url: websiteUrl,
          target_bid: targetBid,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.message || "Failed to create transaction");
        setIsSubmitting(false);
        return;
      }

      const txnId = json.transaction_id;

      if (window.Paddle) {
        window.Paddle.Checkout.open({
          transactionId: txnId,
          displayMode: "inline",
          frameTarget: "paddle-bid-frame",
          frameInitialHeight: 450,
          frameStyle: "width: 100%; min-width: 320px; background-color: transparent; border: none;",
          eventCallback: async (event: any) => {
            if (event.name === "checkout.completed" || event.name === "checkout.payment.completed") {
              setHandle("");
              const frameEl = document.getElementById("paddle-bid-frame");
              if (frameEl) frameEl.innerHTML = "";

              try {
                await fetch("/api/bids/verify-transaction", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ transaction_id: txnId }),
                });
              } catch (verifyErr) {
                console.error("Verification background call error:", verifyErr);
              } finally {
                onBidSuccess?.();
              }
            }
          },
        });
      }
    } catch (err: any) {
      console.error("Bid initiation error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-center space-y-8 select-none" suppressHydrationWarning>
      {/* Sleek Editorial Headline Stepper */}
      <div className="space-y-4">
        <h1 className="text-[40px] sm:text-[56px] md:text-[66px] font-polysans font-normal text-[#202020] leading-[0.91] tracking-[-1.32px] flex items-center justify-center flex-wrap gap-3">
          <span>Claim #1 for</span>
          <button
            onMouseDown={() => startHold("dec")}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={(e) => {
              e.preventDefault();
              startHold("dec");
            }}
            onTouchEnd={stopHold}
            onTouchCancel={stopHold}
            disabled={targetBid <= minTarget}
            aria-label="Decrease bid (hold to accelerate)"
            className="w-9 h-9 rounded-full bg-[#efefef] text-[#202020] text-[20px] font-bold flex items-center justify-center hover:bg-[#202020] hover:text-[#ffffff] disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
            suppressHydrationWarning
          >
            -
          </button>
          <span className="font-polysans text-[#ff682c] tracking-[-0.02em] min-w-[80px] inline-block" suppressHydrationWarning>
            ${targetBid.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </span>
          <button
            onMouseDown={() => startHold("inc")}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            onTouchStart={(e) => {
              e.preventDefault();
              startHold("inc");
            }}
            onTouchEnd={stopHold}
            onTouchCancel={stopHold}
            disabled={targetBid >= MAX_BID_AMOUNT}
            aria-label="Increase bid (hold to accelerate)"
            className="w-9 h-9 rounded-full bg-[#efefef] text-[#202020] text-[20px] font-bold flex items-center justify-center hover:bg-[#202020] hover:text-[#ffffff] disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
            suppressHydrationWarning
          >
            +
          </button>
        </h1>

        <p className="text-[16px] md:text-[18px] font-inter text-[#4d4d4d] max-w-2xl mx-auto leading-[1.38]">
          The leaderboard for bidding platforms. <span className="text-[#ff682c] font-semibold">Outbid</span> other bidding sites to prove your bidding platform bids higher than theirs. Press & hold + / - to bid higher faster.
        </p>
      </div>

      {/* Form Input Row + Bid Button */}
      <div className="space-y-3 max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <BidCalculator handle={handle} onHandleChange={setHandle} />

          <Button
            onClick={handleInitiateBid}
            loading={isSubmitting}
            className="h-[52px] px-10 text-[16px] font-polysans rounded-full whitespace-nowrap self-stretch sm:self-auto min-w-[120px]"
          >
            {isSubmitting ? "Opening..." : "Bid"}
          </Button>
        </div>

        <p className="text-[13px] font-inter text-[#828282]">
          Already on the list? Enter the same URL or @handle and up your bid.
        </p>
      </div>

      {/* Target Container for Paddle.js Inline Checkout iframe */}
      <div id="paddle-bid-frame" className="w-full min-h-[350px] empty:hidden pt-4" />
    </div>
  );
}
