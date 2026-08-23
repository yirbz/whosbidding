# Implementation Plan: Anonymous Startup Bid Leaderboard

**Branch**: `001-startup-bid-leaderboard` | **Date**: 2026-08-23 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-startup-bid-leaderboard/spec.md`

## Summary

Build a real-time anonymous bidding leaderboard platform where anyone can claim the #1 rank by paying the full target bid amount (must exceed current leader by at least $1). No user accounts, authentication, or incremental billing. The application uses **Next.js 16** (App Router) for frontend and API routes, styled per the **Ventriloc Design System** (Tailwind v4 + Framer Motion for functional transitions only), **Supabase** for PostgreSQL database and real-time push, **Paddle Billing v2** for anonymous inline checkout, and deploys to **Railway**.

## Technical Context

**Language/Version**: TypeScript 5.x (Node.js 18+)

**Primary Dependencies**:
- Next.js 16 (App Router)
- Supabase JS SDK v2 (@supabase/supabase-js)
- Paddle Node SDK (@paddle/paddle-node-sdk) + Paddle.js v2
- Tailwind CSS v4 (Ventriloc design tokens from DESIGN.md)
- Framer Motion (functional state transitions only — rank reorder, bid confirmation)
- Vitest (unit/integration testing)
- Sonner (toast notifications)
- clsx + tailwind-merge (utility class composition)

**Storage**: Supabase (PostgreSQL) — managed PaaS. Atomic operations via PostgreSQL stored procedures (`supabase.rpc()`).

**Testing**: Vitest for unit tests (pure domain logic) and integration tests (Supabase local, Paddle sandbox).

**Target Platform**: Web application (Next.js on Railway). No native mobile.

**Project Type**: Web application (frontend + backend monorepo)

**Performance Goals**: Sub-second leaderboard updates (SC-002), 500 concurrent viewers (SC-007 implied), anonymous bid completion in < 20 seconds (SC-003).

**Constraints**: Paddle as MoR (no Stripe in DR), USD only, no user accounts, no auth, full-price bidding model.

**Scale/Scope**: ~500 concurrent viewers, single leaderboard, single-page primary interface.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|---|---|---|
| **I. Anonymous Payment & Transaction Integrity** | ✅ PASS | Paddle handles PCI DSS Level 1; card data never touches app servers (Paddle.js iframe). Webhook signatures verified via HMAC-SHA256. Idempotency via `processed_webhook_events` table. No user accounts or persistent sessions required. See [webhook-paddle.md](contracts/webhook-paddle.md). |
| **II. Clean Architecture & Domain Separation** | ✅ PASS | Domain logic in `lib/domain/` (pure TS, zero framework imports). No user/auth/profile concepts in domain layer. Adapters implement interfaces for Paddle, Supabase. See [research.md](research.md) R-004. |
| **III. Low-Latency Event-Driven Sync** | ✅ PASS | Supabase Realtime (Postgres Changes + Broadcast + Presence) — zero polling. Multiplexed WebSocket channels. See [realtime-channels.md](contracts/realtime-channels.md). |
| **IV. Server-Side Authority & Stateless Bid Security** | ✅ PASS | `confirm_bid_atomic` PostgreSQL stored procedure with `SELECT ... FOR UPDATE` row locks. No auth tokens required. Bids confirmed exclusively via webhook → RPC flow. See [data-model.md](data-model.md). |
| **V. Observability & Testability** | ✅ PASS | Presence tracking for active viewers. Bid audit trail via `bids` table. Domain logic 100% unit testable. Full anonymity guaranteed — no user profile storage. |
| **VI–X. Ventriloc Design System** | ✅ PASS | All UI uses Ventriloc primitives (Button, AsymmetricCard, DataCard, Tag, NavPill). MagicUI banned. PolySans weight 400 only. 95% achromatic. Three-radius system enforced. |
| **XI. Account-Free & Anonymous Architecture** | ✅ PASS | Zero auth routes, no signup/login pages, no user sessions, no profile storage. Bidders provide only startup handle + optional URL. |
| **XII. Full-Price Surpassing Model** | ✅ PASS | Every bid charges the full target amount. No incremental credit offsets. No cumulative balance tracking. Domain function `validateBid()` enforces target > currentLeader. |

**Post-Phase 1 Re-Check**: All gates remain ✅ PASS. Anonymous model eliminates all auth concerns. Full-price model eliminates incremental billing logic.

## Project Structure

### Documentation (this feature)

```text
specs/001-startup-bid-leaderboard/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 technology decisions
├── data-model.md        # Phase 1 entity model + state transitions
├── quickstart.md        # Phase 1 validation guide
├── contracts/
│   ├── leaderboard.md   # GET /api/leaderboard
│   ├── bidding.md       # POST /api/bids/create-transaction
│   ├── webhook-paddle.md # POST /api/webhooks/paddle
│   └── realtime-channels.md # WebSocket channel contracts
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
whosbidding/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, Header, Toaster)
│   ├── page.tsx                  # Homepage — leaderboard + bid panel + hero
│   ├── globals.css               # Tailwind v4 @theme tokens (Ventriloc)
│   └── api/
│       ├── leaderboard/
│       │   ├── route.ts          # GET leaderboard
│       │   └── activity/
│       │       └── route.ts      # GET recent activity
│       ├── bids/
│       │   └── create-transaction/
│       │       └── route.ts      # POST create Paddle transaction (anonymous)
│       └── webhooks/
│           └── paddle/
│               └── route.ts      # POST Paddle webhook handler
├── components/
│   ├── ui/                       # Ventriloc design primitives
│   │   ├── button.tsx            # Primary CTA + Ghost (radius: 0px)
│   │   ├── asymmetric-card.tsx   # Featured card (radius: 6px 0px 0px)
│   │   ├── data-card.tsx         # Stats widget (radius: 20px)
│   │   ├── leaderboard-card.tsx  # Card surface (radius: 8px)
│   │   ├── tag.tsx               # Tag pills (radius: 20px)
│   │   ├── nav-pill.tsx          # Nav capsule (radius: 200px)
│   │   ├── header.tsx            # Sticky header with NavPill
│   │   └── index.ts              # Barrel exports + design system docs
│   ├── leaderboard/
│   │   ├── leaderboard-table.tsx # Ranked startup list (Framer Motion layout)
│   │   ├── leader-card.tsx       # #1 startup highlight (AsymmetricCard)
│   │   └── leaderboard-row.tsx   # Individual rank row (motion.li)
│   ├── bidding/
│   │   ├── bid-panel.tsx         # Anonymous bid form + Paddle inline checkout
│   │   └── bid-success.tsx       # Success confirmation state
│   ├── activity/
│   │   ├── live-feed.tsx         # AnimatePresence bid stream
│   │   ├── live-ticker.tsx       # CSS marquee banner
│   │   └── active-users.tsx      # Live viewer counter
│   └── notifications/
│       └── outbid-toast.tsx      # Ventriloc-styled toast
├── hooks/
│   ├── use-leaderboard.ts        # Realtime leaderboard subscription
│   ├── use-active-users.ts       # Presence tracking hook
│   └── use-outbid-notifications.ts # Broadcast channel subscription
├── lib/
│   ├── domain/                   # Pure TypeScript — ZERO framework imports
│   │   ├── bid.ts                # Bid validation (full-price, target > leader)
│   │   ├── leaderboard.ts        # Ranking logic, tie-breaking
│   │   └── types.ts              # Shared domain types
│   ├── adapters/
│   │   ├── paddle.ts             # Paddle API client wrapper
│   │   ├── supabase-client.ts    # Browser client factory
│   │   └── supabase-server.ts    # Server client factory (service role)
│   ├── use-cases/
│   │   ├── place-bid.ts          # Validate → create Paddle txn (no auth)
│   │   └── confirm-bid.ts        # Verify webhook → atomic RPC → broadcast
│   └── utils.ts                  # cn() utility (clsx + tailwind-merge)
├── supabase/
│   ├── migrations/
│   │   ├── 001_create_startups.sql
│   │   ├── 002_create_bids.sql
│   │   ├── 003_create_processed_events.sql
│   │   ├── 004_confirm_bid_atomic.sql
│   │   └── 005_realtime_publication.sql
│   └── config.toml
├── tests/
│   ├── unit/domain/
│   │   ├── bid.test.ts           # Full-price validation rules
│   │   └── leaderboard.test.ts   # Ranking, tie-breaking
│   └── integration/
│       └── webhook-paddle.test.ts # Signature verification, idempotency
├── public/fonts/                  # PolySans + Inter font files
├── postcss.config.mjs
├── vitest.config.ts
├── package.json
├── tsconfig.json
└── .env.example
```

**Structure Decision**: Single Next.js monorepo (frontend + backend API routes). Clean architecture enforced via directory conventions: `lib/domain/` contains zero framework imports, `lib/adapters/` wraps external services behind interfaces, `lib/use-cases/` orchestrates application logic. Database operations use Supabase SDK + PostgreSQL stored procedures. **No auth routes, no user pages, no profile management, no dashboard.**

## Complexity Tracking

No constitution violations to justify — all gates pass cleanly.
