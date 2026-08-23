import { NextResponse } from "next/server";
import { confirmBidWebhookUseCase, verifyPaddleWebhookSignature } from "@/lib/use-cases/confirm-bid";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signatureHeader = req.headers.get("paddle-signature") || "";
    const secretKey = process.env.PADDLE_WEBHOOK_SECRET || process.env.PADDLE_WEBHOOK_SECRET_KEY || "";

    // Verify webhook signature in production/test environment if secretKey is provided
    if (secretKey && !verifyPaddleWebhookSignature(rawBody, signatureHeader, secretKey)) {
      console.warn("Invalid Paddle webhook signature header");
      return NextResponse.json(
        { error: "INVALID_SIGNATURE", message: "Webhook signature verification failed" },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);
    const result = await confirmBidWebhookUseCase(payload);

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("Paddle webhook processing error:", err);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
