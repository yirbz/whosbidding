import { Environment, Paddle } from "@paddle/paddle-node-sdk";

export function getPaddleClient() {
  const apiKey = process.env.PADDLE_API_KEY || "test_paddle_key";
  const envSetting = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === "production"
    ? Environment.production
    : Environment.sandbox;

  return new Paddle(apiKey, {
    environment: envSetting,
  });
}

export async function createPaddleTransaction(params: {
  handle: string;
  websiteUrl?: string | null;
  targetBid: number;
}) {
  const paddle = getPaddleClient();

  // Create a non-catalog dynamic price transaction for the full target bid amount
  const transaction = await paddle.transactions.create({
    items: [
      {
        price: {
          description: `WhosBidding Leaderboard Bid: ${params.handle} at $${params.targetBid.toFixed(2)}`,
          unitPrice: {
            amount: Math.round(params.targetBid * 100).toString(), // convert USD dollars to cents string
            currencyCode: "USD",
          },
          product: {
            name: "WhosBidding Leaderboard #1 Rank Placement",
            taxCategory: "standard",
          },
        },
        quantity: 1,
      },
    ],
    customData: {
      handle: params.handle,
      website_url: params.websiteUrl || "",
      target_bid_amount: params.targetBid,
    },
  });

  return transaction;
}
