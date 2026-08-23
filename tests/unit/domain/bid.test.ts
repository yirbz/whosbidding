import { describe, it, expect } from "vitest";
import { validateBid, MAX_BID_AMOUNT } from "@/lib/domain/bid";

describe("validateBid", () => {
  it("rejects bids <= 0", () => {
    const res = validateBid(0, 10);
    expect(res.valid).toBe(false);
    expect(res.errorCode).toBe("INVALID_AMOUNT");
  });

  it("rejects bids exceeding $100,000", () => {
    const res = validateBid(100001, 10);
    expect(res.valid).toBe(false);
    expect(res.errorCode).toBe("BID_TOO_HIGH");
  });

  it("rejects bids < $1.00 when no leader exists", () => {
    const res = validateBid(0.5, 0);
    expect(res.valid).toBe(false);
    expect(res.errorCode).toBe("BID_TOO_LOW");
  });

  it("accepts valid $1.00 bid when no leader exists", () => {
    const res = validateBid(1.0, 0);
    expect(res.valid).toBe(true);
  });

  it("accepts valid $100,000 bid cap", () => {
    const res = validateBid(MAX_BID_AMOUNT, 50000);
    expect(res.valid).toBe(true);
  });

  it("rejects target bid <= current leader bid", () => {
    const res = validateBid(10, 10);
    expect(res.valid).toBe(false);
    expect(res.errorCode).toBe("BID_TOO_LOW");
    expect(res.minimumBid).toBe(11);
  });

  it("accepts target bid greater than current leader", () => {
    const res = validateBid(1001, 1000);
    expect(res.valid).toBe(true);
  });

  it("validates handle length", () => {
    const res = validateBid(10, 5, "a");
    expect(res.valid).toBe(false);
    expect(res.errorCode).toBe("INVALID_HANDLE");
  });
});
