import { NextResponse } from "next/server";
import { confirmBidWebhookUseCase, verifyPaddleWebhookSignature } from "@/lib/use-cases/confirm-bid";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signatureHeader = req.headers.get("paddle-signature") || "";
    const secretKey = process.env.PADDLE_WEBHOOK_SECRET || process.env.PADDLE_WEBHOOK_SECRET_KEY || "";

    console.log(`\n📬 [PADDLE WEBHOOK RECEIVED] Length: ${rawBody.length} bytes, has_signature: ${Boolean(signatureHeader)}`);

    // Verify webhook signature in production/test environment if secretKey is provided
    if (secretKey && !verifyPaddleWebhookSignature(rawBody, signatureHeader, secretKey)) {
      console.warn("❌ [PADDLE WEBHOOK REJECTED] Invalid Paddle signature header");
      return NextResponse.json(
        { error: "INVALID_SIGNATURE", message: "Webhook signature verification failed" },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);
    console.log(`📡 [PADDLE WEBHOOK EVENT] event_id="${payload.event_id}", event_type="${payload.event_type}"`);

    const result = await confirmBidWebhookUseCase(payload);
    console.log(`✅ [PADDLE WEBHOOK PROCESSED] Result:`, result);

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("❌ [PADDLE WEBHOOK ERROR]:", err);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
