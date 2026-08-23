# Research: Anonymous Startup Bid Leaderboard

**Feature**: Anonymous Startup Bid Leaderboard
**Date**: 2026-08-23
**Source**: [spec.md](spec.md) Technical Context + [constitution v3.0.0](../../.specify/memory/constitution.md)

---

## R-001: Anonymous Payment Flow (Paddle Billing v2 without Auth)

**Decision**: Use Paddle Billing v2 non-catalog transactions with anonymous inline checkout. The server creates a Paddle transaction with a custom line item (the full bid amount) and returns the `transaction_id` to the client. Paddle.js opens inline checkout with no user authentication required.

**Rationale**: Paddle supports creating transactions without associating them to a Paddle customer ID. The server can create a transaction with an ad-hoc price item, and the anonymous bidder completes checkout via Paddle.js iframe. No email, login, or account creation is required on our side.

**Alternatives considered**:
- **Stripe Checkout**: Not available in Dominican Republic (merchant restriction).
- **Paddle Catalog Products**: Would require pre-created price objects for every possible bid amount — impractical. Non-catalog custom amounts are the correct approach.

---

## R-002: Full-Price Bidding Model (No Incremental Billing)

**Decision**: Every bid transaction charges the full target amount. No cumulative balance tracking. No `user_id` association for credit offsets. The domain validation function simply checks: `target_bid > current_leader_bid`.

**Rationale**: Per constitution v3.0.0 Principle XII (Full-Price Surpassing Model), incremental credit balances are STRICTLY FORBIDDEN. This simplifies the domain model drastically — no per-startup cumulative tracking, no incremental charge calculations, no returning-user balance lookups.

**Alternatives considered**:
- **Incremental billing** (original v2.0.0 model): Eliminated by constitution v3.0.0. Was more complex (required user accounts + balance tracking).

---

## R-003: Startup Identity Without User Accounts

**Decision**: Startups are identified solely by their `handle` (name or @handle) and optional `website_url`. When a new bid is placed for a handle that doesn't exist in the `startups` table, the `confirm_bid_atomic` stored procedure creates it automatically (upsert pattern). No user ownership, no login, no profile.

**Rationale**: Per constitution v3.0.0 Principle XI (Account-Free & Anonymous Architecture), user accounts are STRICTLY FORBIDDEN. The startup entity is a leaderboard entry, not a user-owned resource. Anyone can bid for any handle.

**Alternatives considered**:
- **Pre-registration via signup form**: Eliminated by constitution. Added friction.
- **Email-based identity**: Still constitutes account creation — prohibited.

---

## R-004: Clean Architecture Without Auth Layer

**Decision**: Three-layer architecture: `lib/domain/` (pure TS), `lib/adapters/` (Paddle, Supabase), `lib/use-cases/` (place-bid, confirm-bid). No auth middleware. No user session checks. API routes are public.

**Rationale**: Per constitution Principle II, domain entities MUST NOT contain user account concepts. Per Principle XI, auth middleware is forbidden. The bid creation API route accepts `{ handle, website_url, target_bid }` directly — no Bearer token.

**Alternatives considered**:
- **Supabase Auth with anon key**: Would require auth.signUp/signIn — prohibited by constitution.
- **API key gating**: Out of scope; platform is intentionally public.

---

## R-005: Atomic Bid Confirmation (PostgreSQL Stored Procedure)

**Decision**: The `confirm_bid_atomic` stored procedure handles: (1) verify target_bid > current leader, (2) upsert startup entry if new handle, (3) update startup `total_bid` to new amount, (4) insert bid record as confirmed, (5) return new rank. Uses `SELECT ... FOR UPDATE` on the startups row to prevent race conditions.

**Rationale**: Per constitution Principle IV, all rank determinations MUST be server-side atomic. The stored procedure runs in a single PostgreSQL transaction with row-level locking.

**Alternatives considered**:
- **Application-level locking**: Too fragile for concurrent bids. Database-level locking is the only reliable approach.
- **Optimistic concurrency (version column)**: Would require retry loops — worse UX.

---

## R-006: Supabase Realtime Channels

**Decision**: Two channels: `leaderboard_live` (Postgres Changes on `startups` table UPDATE events + Broadcast for activity feed) and `online_presence` (Presence for viewer count).

**Rationale**: Per constitution Principle III, zero polling. Supabase Realtime provides both CDC (Postgres Changes) and ephemeral channels (Broadcast, Presence) over a single multiplexed WebSocket.

**Alternatives considered**:
- **Server-Sent Events**: Would require separate connection management. Supabase Realtime is already available.
- **Socket.io**: Unnecessary additional dependency when Supabase SDK includes realtime.

---

## R-007: Ventriloc Design System (No MagicUI)

**Decision**: All UI primitives are custom Ventriloc components in `components/ui/`. MagicUI is banned. Framer Motion permitted only for functional state transitions (rank reorder ≤ 400ms, bid confirmation feedback ≤ 200ms). CSS `@keyframes` for ticker marquee.

**Rationale**: Per constitution Principles VI–X and the Banned Libraries section. MagicUI components (NumberTicker, BorderBeam, AnimatedList, etc.) carry their own visual language that conflicts with Ventriloc's achromatic editorial restraint.

**Alternatives considered**:
- **MagicUI** (original plan): Banned by constitution v2.0.0+.
- **shadcn/ui**: Partially acceptable for accessible primitives, but default theme overrides (rounded-everything) conflict with the three-radius system.
