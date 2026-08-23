# API Contract: Anonymous Bidding

**Base Path**: `/api/bids`
**Auth**: None (public, anonymous)

---

## POST /api/bids/create-transaction

Creates a Paddle transaction for a full-price anonymous bid. The client uses the returned `transaction_id` to open Paddle Inline Checkout.

### Request Headers

| Header | Value |
|---|---|
| `Content-Type` | `application/json` |

### Request Body

```json
{
  "handle": "@BidStack",
  "website_url": "https://bidstack.io",
  "target_bid": 1001.00
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `handle` | `string` | Yes | Startup name or @handle (2-100 chars) |
| `website_url` | `string` | No | Optional startup website URL |
| `target_bid` | `number` | Yes | Full bid amount to pay (must exceed current leader) |

### Response — 200 OK

```json
{
  "transaction_id": "txn_01hn5abc123...",
  "target_bid": 1001.00,
  "current_leader_bid": 1000.00,
  "handle": "@BidStack"
}
```

### Response — 400 Bad Request

```json
{
  "error": "BID_TOO_LOW",
  "message": "Target bid ($999.00) must exceed current leader bid ($1,000.00) by at least $1.00",
  "current_leader_bid": 1000.00,
  "minimum_bid": 1001.00
}
```

### Validation Rules (Server-Side)

1. `handle` must be 2-100 characters.
2. `target_bid` must exceed the current #1 startup's `total_bid` by at least $1.00.
3. If no startups exist, minimum bid is $1.00.
4. `target_bid` must be a positive number.

### Side Effects

- Creates a Paddle transaction via `POST https://api.paddle.com/transactions` with non-catalog line item for the full bid amount.
- Creates a pending `bids` record with `idempotency_key` and `paddle_transaction_id`.
