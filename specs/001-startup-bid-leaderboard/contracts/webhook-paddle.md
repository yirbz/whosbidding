# API Contract: Paddle Webhook

**Endpoint**: `POST /api/webhooks/paddle`
**Auth**: Paddle webhook signature verification (HMAC-SHA256)

---

## Event: `transaction.completed`

Fired when a bidder completes payment via Paddle inline checkout.

### Request Headers

| Header | Value |
|---|---|
| `Paddle-Signature` | HMAC-SHA256 signature for verification |
| `Content-Type` | `application/json` |

### Payload (relevant fields)

```json
{
  "event_id": "evt_01...",
  "event_type": "transaction.completed",
  "data": {
    "id": "txn_01hn5abc123...",
    "status": "completed",
    "custom_data": {
      "handle": "@BidStack",
      "website_url": "https://bidstack.io",
      "target_bid": "1001.00"
    },
    "details": {
      "totals": {
        "total": "100100"
      }
    }
  }
}
```

### Handler Flow

1. **Verify** Paddle webhook signature (HMAC-SHA256 with webhook secret).
2. **Deduplicate** — check `processed_webhook_events` for `event_id`. If found, return 200 (already processed).
3. **Insert** into `processed_webhook_events`.
4. **Call** `confirm_bid_atomic(handle, website_url, target_bid, transaction_id)` via Supabase RPC.
5. **Broadcast** new bid activity via Supabase Realtime Broadcast on `leaderboard_live` channel.
6. **Return** 200 OK.

### Response — 200 OK

```json
{ "received": true }
```

### Idempotency

Duplicate `event_id` values are silently accepted (200 OK) without re-processing.
