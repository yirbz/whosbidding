import crypto from "crypto";
import { describe, expect, it } from "vitest";
import { verifyPaddleWebhookSignature } from "@/lib/use-cases/confirm-bid";

describe("Paddle Webhook Signature Verification", () => {
  const secretKey = "test_webhook_secret_key_123";
  const rawBody = JSON.stringify({
    event_id: "evt_01hn5abc123",
    event_type: "transaction.completed",
    data: { id: "txn_01hn5abc123" },
  });

  it("verifies a valid HMAC-SHA256 signature", () => {
    const ts = Math.floor(Date.now() / 1000).toString();
    const payload = `${ts}:${rawBody}`;
    const h1 = crypto.createHmac("sha256", secretKey).update(payload).digest("hex");
    const signatureHeader = `ts=${ts};h1=${h1}`;

    const isValid = verifyPaddleWebhookSignature(rawBody, signatureHeader, secretKey);
    expect(isValid).toBe(true);
  });

  it("rejects an invalid signature hash", () => {
    const ts = Math.floor(Date.now() / 1000).toString();
    const signatureHeader = `ts=${ts};h1=invalid_hash_value`;

    const isValid = verifyPaddleWebhookSignature(rawBody, signatureHeader, secretKey);
    expect(isValid).toBe(false);
  });

  it("rejects an expired timestamp (> 300 seconds old)", () => {
    const oldTs = (Math.floor(Date.now() / 1000) - 600).toString(); // 10 minutes ago
    const payload = `${oldTs}:${rawBody}`;
    const h1 = crypto.createHmac("sha256", secretKey).update(payload).digest("hex");
    const signatureHeader = `ts=${oldTs};h1=${h1}`;

    const isValid = verifyPaddleWebhookSignature(rawBody, signatureHeader, secretKey);
    expect(isValid).toBe(false);
  });
});
