# API Contract: Leaderboard

**Base Path**: `/api/leaderboard`
**Auth**: Public (no authentication required)

---

## GET /api/leaderboard

Retrieve the current leaderboard — all startups ranked by total bid amount.

### Request

No parameters required. Optionally accepts `limit` and `offset` for pagination.

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `limit` | `integer` | No | 50 | Maximum number of entries to return |
| `offset` | `integer` | No | 0 | Number of entries to skip |

### Response — 200 OK

```json
{
  "data": [
    {
      "rank": 1,
      "startup_id": "uuid",
      "handle": "@BidStack",
      "website_url": "https://bidstack.io",
      "total_bid": 1050.00,
      "updated_at": "2026-08-23T18:30:00Z"
    }
  ],
  "meta": {
    "total_count": 42,
    "limit": 50,
    "offset": 0,
    "leader_bid": 1050.00
  }
}
```

### Real-Time Updates

Clients subscribe to leaderboard changes via Supabase Realtime Postgres Changes on the `startups` table (UPDATE events). The `rank` field is re-derived client-side from the sorted `total_bid` values.
