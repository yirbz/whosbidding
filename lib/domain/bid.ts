// Pure TypeScript Domain Logic — zero framework imports (Constitution v3.0.0)

import { BidValidationResult } from "./types";

export const MAX_BID_AMOUNT = 100000;

/**
 * Validates an anonymous full-price target bid against the current leader bid.
 * Bidders pay 100% of the target bid. Target bid must exceed current leader by at least $1.00.
 * Maximum bid cap is $100,000.00.
 */
export function validateBid(
  targetBid: number,
  currentLeaderBid: number,
  handle?: string
): BidValidationResult {
  if (handle !== undefined && (!handle || handle.trim().length < 2)) {
    return {
      valid: false,
      errorCode: "INVALID_HANDLE",
      errorMessage: "Startup handle or name must be at least 2 characters",
    };
  }

  if (!targetBid || isNaN(targetBid) || targetBid <= 0) {
    return {
      valid: false,
      errorCode: "INVALID_AMOUNT",
      errorMessage: "Bid amount must be greater than $0.00",
    };
  }

  if (targetBid > MAX_BID_AMOUNT) {
    return {
      valid: false,
      errorCode: "BID_TOO_HIGH",
      errorMessage: `Maximum bid cap is $${MAX_BID_AMOUNT.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    };
  }

  if (currentLeaderBid === 0 && targetBid < 1.0) {
    return {
      valid: false,
      errorCode: "BID_TOO_LOW",
      errorMessage: "Initial minimum starting bid is $1.00",
      minimumBid: 1.0,
    };
  }

  if (currentLeaderBid > 0 && targetBid <= currentLeaderBid) {
    const minRequired = currentLeaderBid + 1.0;
    return {
      valid: false,
      errorCode: "BID_TOO_LOW",
      errorMessage: `Target bid ($${targetBid.toFixed(2)}) must exceed current leader bid ($${currentLeaderBid.toFixed(2)}) by at least $1.00`,
      minimumBid: minRequired,
    };
  }

  return {
    valid: true,
  };
}
