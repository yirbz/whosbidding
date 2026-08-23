// Pure TypeScript Domain Types — zero framework imports (Constitution v3.0.0)

export interface Startup {
  id: string;
  handle: string;
  website_url?: string | null;
  total_bid: number;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardEntry extends Startup {
  rank: number;
}

export type BidStatus = "pending" | "confirmed" | "failed";

export interface Bid {
  id: string;
  startup_id?: string | null;
  handle: string;
  target_bid: number;
  paddle_transaction_id?: string | null;
  status: BidStatus;
  idempotency_key?: string | null;
  created_at: string;
}

export interface BidIntent {
  handle: string;
  website_url?: string | null;
  target_bid: number;
  paddle_transaction_id: string;
}

export type BidErrorCode =
  | "BID_TOO_LOW"
  | "BID_TOO_HIGH"
  | "INVALID_AMOUNT"
  | "BID_IN_PROGRESS"
  | "INVALID_HANDLE";

export interface BidValidationResult {
  valid: boolean;
  errorCode?: BidErrorCode;
  errorMessage?: string;
  minimumBid?: number;
}
