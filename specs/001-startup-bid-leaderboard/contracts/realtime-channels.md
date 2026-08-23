# API Contract: Realtime Channels

**Transport**: Supabase Realtime WebSocket
**Auth**: Public (anonymous, Supabase anon key)

---

## Channels Overview

| Channel Name | Type | Privacy | Purpose |
|---|---|---|---|
| `leaderboard_live` | Postgres Changes + Broadcast | Public | Leaderboard rank updates + live bid activity feed |
| `online_presence` | Presence | Public | Active viewer count tracking |

---

## Channel: `leaderboard_live`

### Postgres Changes (CDC)

Subscribes to UPDATE events on the `startups` table. Fires when a bid is confirmed and `total_bid` is updated.

**Subscription Config**:
```
event: UPDATE
schema: public
table: startups
```

**Payload Shape**:
```json
{
  "eventType": "UPDATE",
  "new": {
    "id": "uuid",
    "handle": "@BidStack",
    "total_bid": 1050.00,
    "updated_at": "2026-08-23T18:30:00Z"
  },
  "old": {
    "id": "uuid",
    "handle": "@BidStack",
    "total_bid": 1005.00
  }
}
```

**Client Action**: Re-sort local leaderboard state; animate rank transitions via Framer Motion `layout`; update formatted bid display.

### Broadcast: `new_bid_activity`

Ephemeral broadcast event pushed by the webhook handler after bid confirmation.

**Event Name**: `new_bid_activity`

**Payload Shape**:
```json
{
  "handle": "@BidStack",
  "target_bid": 1050.00,
  "previous_leader": "@AuctionBase",
  "previous_leader_bid": 1005.00,
  "timestamp": "2026-08-23T18:30:00Z"
}
```

**Client Action**: Append to live activity feed (AnimatePresence); show outbid toast notification.

---

## Channel: `online_presence`

### Presence Tracking

Tracks anonymous connected viewers. No user identity — just connection count.

**Track Payload**:
```json
{
  "viewer_id": "random-uuid-per-tab",
  "joined_at": "2026-08-23T18:30:00Z"
}
```

**Client Action**: Count presence state entries to derive active viewer count.
