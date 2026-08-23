# Tasks: Anonymous Startup Bid Leaderboard — Full-Price Surpassing Model

**Feature**: Anonymous Startup Bid Leaderboard
**Constitution Version**: 3.0.0
**Design Authority**: Ventriloc Design System (DESIGN.md)
**Generated**: 2026-08-23

> **Context**: Transitioning the codebase from the legacy auth/user/incremental model to a 100%
> anonymous, account-free, full-price surpassing model per Constitution v3.0.0.
> All user/auth routes, profiles, dashboards, and incremental credit logic will be removed.
> The app is a single-page arcade leaderboard observatory where anyone bids anonymously by providing
> a startup handle/link and paying the full bid amount.

---

## Phase 1: Setup (Cleanup & Environment Alignment)

**Purpose**: Purge all obsolete auth, user profile, and dashboard code files to prevent stale imports
and establish a clean stateless foundation.

- [X] T001 Delete obsolete auth page directories `app/auth/login/` and `app/auth/signup/`
- [X] T002 Delete obsolete dashboard page directory `app/dashboard/`
- [X] T003 Delete obsolete auth components `components/auth/login-form.tsx` and `components/auth/signup-form.tsx`
- [X] T004 Delete obsolete API routes `app/api/startups/me/route.ts`, `app/api/bids/my-history/route.ts`, `app/api/notifications/route.ts`, and `app/api/notifications/mark-read/route.ts`
- [X] T005 [P] Update domain types in `lib/domain/types.ts` — remove `User`, `Profile`, `Notification`, `IncrementalCharge`; define `Startup` (`id`, `handle`, `website_url`, `total_bid`, `created_at`, `updated_at`), `Bid` (`id`, `startup_id`, `handle`, `target_bid`, `paddle_transaction_id`, `status`, `idempotency_key`, `created_at`), and `LeaderboardEntry`

**Checkpoint**: Zero references to auth or user profiles remain in `lib/domain/types.ts`. All obsolete auth/dashboard directories deleted.

---

## Phase 2: Foundational (Database Schema & Core Domain)

**Purpose**: Implement the PostgreSQL database schema and framework-agnostic domain logic for
anonymous full-price bidding. These MUST be complete before UI components are updated.

**⚠️ CRITICAL**: No user story work can begin until Phase 2 is complete.

- [X] T006 Create database migration `supabase/migrations/010_anonymous_full_price_schema.sql` — drop `profiles` and `notifications` tables; create/update `startups` (`id`, `handle` UNIQUE NOT NULL, `website_url`, `total_bid` NUMERIC(12,2) DEFAULT 0.00, `created_at`, `updated_at`); update `bids` (`id`, `startup_id`, `handle`, `target_bid` NUMERIC(12,2), `paddle_transaction_id`, `status`, `idempotency_key`, `created_at`); create `processed_webhook_events` (`event_id` PK, `transaction_id`, `event_type`, `processed_at`)
- [X] T007 Add `confirm_bid_atomic` PostgreSQL stored procedure in `supabase/migrations/010_anonymous_full_price_schema.sql` — accepts `(p_handle, p_website_url, p_target_bid, p_paddle_transaction_id)`; locks current top leader row via `SELECT ... FOR UPDATE`; validates `p_target_bid > v_current_leader_bid`; upserts startup by handle with `total_bid = p_target_bid`; updates bid status to `confirmed`; returns JSON payload
- [X] T008 [P] Update domain bid validation in `lib/domain/bid.ts` — export `validateBid(targetBid: number, currentLeaderBid: number)` enforcing target > currentLeader by at least $1.00 (or >= $1.00 if no leader); remove all incremental charge calculations; write unit tests in `tests/unit/domain/bid.test.ts`
- [X] T009 [P] Update domain leaderboard sorting in `lib/domain/leaderboard.ts` — export `sortLeaderboard(startups: Startup[])` ranking entries by `total_bid` DESC, breaking ties by `updated_at` ASC; write unit tests in `tests/unit/domain/leaderboard.test.ts`
- [X] T010 Update use case `lib/use-cases/place-bid.ts` — accepts `{ handle, website_url, target_bid }`; calls `validateBid()`; calls Paddle adapter `createTransaction()` for full `target_bid` amount; inserts pending row in `bids` table; returns `{ transaction_id, target_bid, current_leader_bid, handle }`
- [X] T011 Update use case `lib/use-cases/confirm-bid.ts` — verifies Paddle webhook HMAC signature; calls Supabase RPC `confirm_bid_atomic`; triggers Supabase Realtime broadcast `new_bid_activity` and `outbid` on channel `leaderboard_live`

**Checkpoint**: Vitest domain tests pass. Database migration applies cleanly via `npx supabase db push`. Domain logic has 0 framework or auth dependencies.

---

## Phase 3: User Story 1 — View the Live Startup Leaderboard (Priority: P1) 🎯 MVP

**Goal**: A visitor loads the homepage and sees a live-updating leaderboard ranking startups by their
total bid amount in descending order, styled in Ventriloc, updating in real time.

**Independent Test**: Load `/` in two browser windows — leaderboard displays handles and bid amounts; placing a bid in Window A causes Window B to update rank order within 1s without page refresh.

### Implementation for User Story 1

- [X] T012 [P] [US1] Update API route `app/api/leaderboard/route.ts` — public GET endpoint returning all startups ordered by `total_bid` DESC with derived `rank` (1-indexed); returns `{ data: LeaderboardEntry[], meta: { total_count, leader_bid } }`
- [X] T013 [P] [US1] Update hook `hooks/use-leaderboard.ts` — fetches `/api/leaderboard` on mount; subscribes to Supabase Realtime Postgres Changes on `startups` table (UPDATE/INSERT events); re-fetches or updates local state immediately; returns `{ entries, isLoading, refresh }`
- [X] T014 [US1] Update `components/leaderboard/leaderboard-row.tsx` — render startup handle (PolySans 18px), optional website link (Ember Orange underline), total bid formatted as USD currency (PolySans 20px/32px); `Tag` component for rank badge; `motion.li` with `layoutId` for smooth reorder (≤ 400ms)
- [X] T015 [US1] Update `components/leaderboard/leader-card.tsx` — feature #1 leader using `AsymmetricCard` primitive (`border-radius: 6px 0px 0px`); display handle in PolySans display (40px), website link, and total bid in PolySans display (66px); `Tag` variant `ember` for "#1 Current Leader"
- [X] T016 [US1] Update `components/leaderboard/leaderboard-table.tsx` — render `LeaderCard` for top rank and `LeaderboardRow` items inside `LeaderboardCard` surface; empty state displaying "No Bids Yet — First bid starts at $1.00"

**Checkpoint**: Homepage renders live leaderboard from database. Real-time updates push via WebSocket.

---

## Phase 4: User Story 2 & 3 — Place an Anonymous Bid & Full-Price Surpassing (Priority: P1)

**Goal**: Anyone can open the bid panel, enter startup handle + optional website + target bid amount,
pay full price via Paddle inline checkout, and claim #1 on payment confirmation.

**Independent Test**: Enter `@MyStartup`, target bid `$2.00` (when leader is `$1.00`); complete payment; `@MyStartup` becomes #1 immediately. Re-bid `$3.00` for `@MyStartup`; verify full $3.00 is charged.

### Implementation for User Story 2 & 3

- [X] T017 [P] [US2] Update API route `app/api/bids/create-transaction/route.ts` — public POST endpoint accepting `{ handle, website_url, target_bid }`; zero auth headers required; calls `placeBid()` use case; returns `{ transaction_id, target_bid, current_leader_bid, handle }`
- [X] T018 [P] [US2] Update API route `app/api/webhooks/paddle/route.ts` — public POST endpoint for Paddle webhooks; verifies signature; processes `transaction.completed` by calling `confirmBid()` use case
- [X] T019 [US2] Update `components/bidding/bid-calculator.tsx` — input field for `handle` (Inter 16px, `radius: 0px`), optional `website_url`, and `target_bid` (minimum required = `currentLeaderBid + 1` or `$1.00`); display clear full-price breakdown: "Total Charge Today: $X.XX" (no prior balance deductions or credits); Ember Orange accent on bid value
- [X] T020 [US2] Update `components/bidding/bid-panel.tsx` — wrap in `DataCard` primitive; PolySans 32px heading "Claim #1 on the Leaderboard"; embed `BidCalculator`; call `/api/bids/create-transaction`; open Paddle inline checkout via `window.Paddle.Checkout.open({ transactionId, displayMode: "inline" })`; handle loading & error states
- [X] T021 [US2] Update `components/bidding/bid-success.tsx` — render native success state inside `DataCard` (Ember Orange checkmark, PolySans 32px "#1 Claimed!", Inter 16px confirmation text with handle and total bid amount); `Button` primitive to close or bid again

**Checkpoint**: Complete anonymous bidding loop working end-to-end. Full price charged on every bid. Zero auth or login prompts.

---

## Phase 5: User Story 4 — Real-Time Outbid Alerts & Activity Feed (Priority: P2)

**Goal**: Real-time broadcast outbid toasts and live activity stream when new bids are confirmed.

**Independent Test**: Submit a winning bid from Window A → Window B displays a Ventriloc outbid toast alert and adds the transaction to the live activity feed within 1s.

### Implementation for User Story 4

- [X] T022 [P] [US4] Update API route `app/api/leaderboard/activity/route.ts` — public GET endpoint returning recent 10 confirmed bids
- [X] T023 [US4] Update `components/activity/live-feed.tsx` — subscribe to Supabase Realtime channel `leaderboard_live` for `new_bid_activity` broadcast events; render list items with startup handle and bid amount; `AnimatePresence` for new item entry (150ms ease-out); max 10 items
- [X] T024 [US4] Update `components/notifications/outbid-toast.tsx` and `hooks/use-outbid-notifications.ts` — subscribe to `outbid` broadcast events; render Ventriloc toast (Graphite background, 2px Ember Orange left border, PolySans title "New #1 Leader!", Inter body with new leader handle and bid) via `sonner` `toast.custom()`

**Checkpoint**: Outbid toast and live feed update dynamically across all connected browsers.

---

## Phase 6: User Story 5 — Live Active Viewer Count (Priority: P3)

**Goal**: Display live active viewer count updated via Supabase Presence.

**Independent Test**: Open multiple browser tabs; active viewer counter updates dynamically with total connected sessions.

### Implementation for User Story 5

- [X] T025 [US5] Update `hooks/use-active-users.ts` — join Supabase Realtime channel `online_presence` using Presence; track active session count; return `{ activeCount }`
- [X] T026 [US5] Update `components/activity/active-users.tsx` — render capsule with Ember Orange live dot, PolySans 20px count, Inter 14px "viewers online" label

**Checkpoint**: Active viewer counter functional with live Supabase Presence connections.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Navigation alignment, Ventriloc design compliance sweep, and final build validation.

- [X] T027 Update `components/ui/header.tsx` — brand wordmark left-aligned (PolySans 20px Graphite); remove "Register Startup" button and "Dashboard" link; right side displays `ActiveUsersCounter`; sticky header with `backdrop-blur-md`
- [X] T028 Update `app/page.tsx` homepage layout — live marquee ticker at top; hero section with PolySans 66px display headline "Bidding for your bidding platform.", Inter 18px body, Primary CTA button scrolling to bid panel; two-column grid (left: leaderboard + bid panel; right: live feed + quick rules); section gap 80px; Canvas White background
- [X] T029 [P] Run Ventriloc design compliance sweep — verify zero `box-shadow` styles, PolySans weight 400 only, 95% achromatic palette, 3-radius system (`0px` buttons, `6px 0px 0px` asymmetric cards, `8px`/`20px` cards, `200px` pills)
- [X] T030 [P] Run integration tests in `tests/integration/webhook-paddle.test.ts` — verify Paddle webhook HMAC signature verification and `confirm_bid_atomic` execution
- [X] T031 Run `npm run build` clean compile — verify zero TypeScript errors, zero missing imports, zero auth references in build output

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup Cleanup)**: No dependencies — start immediately. Code cleanup unblocks all schema/domain work.
- **Phase 2 (Foundational)**: Depends on Phase 1 completion — BLOCKS all user story phases.
- **Phase 3–6 (User Stories)**: All depend on Phase 2 completion. Stories can proceed in parallel if staffed.
- **Phase 7 (Polish)**: Depends on all desired user story phases being complete.

### User Story Dependencies

- **US1 (Leaderboard)**: Start after Phase 2 — independent, no story dependencies.
- **US2+US3 (Anonymous Full-Price Bids)**: Start after Phase 2 — independent, shares bid panel & calculator files.
- **US4 (Activity & Outbid Alerts)**: Start after Phase 2 — independent.
- **US5 (Active Viewer Count)**: Start after Phase 2 — independent.

---

## Parallel Example: Phase 2 (Foundational)

```bash
# All can be worked simultaneously (different files):
T008: lib/domain/bid.ts + tests/unit/domain/bid.test.ts
T009: lib/domain/leaderboard.ts + tests/unit/domain/leaderboard.test.ts
```

## Parallel Example: User Stories (Post Phase 2)

```bash
# Developer A: US1 Leaderboard
T012: app/api/leaderboard/route.ts
T013: hooks/use-leaderboard.ts
T014: components/leaderboard/leaderboard-row.tsx

# Developer B: US2+US3 Bidding
T017: app/api/bids/create-transaction/route.ts
T018: app/api/webhooks/paddle/route.ts
T019: components/bidding/bid-calculator.tsx
T020: components/bidding/bid-panel.tsx
```

---

## Implementation Strategy

### MVP First (Anonymous Leaderboard & Bidding — US1 + US2 + US3)

1. Complete Phase 1: Code cleanup
2. Complete Phase 2: Migration + Domain logic
3. Complete Phase 3: Leaderboard UI
4. Complete Phase 4: Anonymous Bid Panel + Paddle Checkout
5. **STOP AND VALIDATE**: Test homepage anonymous bid flow end-to-end
6. Ship MVP!

---

## Notes

- `[P]` tasks operate on different files with no cross-task dependencies — safe to parallelize
- `[USN]` labels trace each task back to the spec.md user story for traceability
- All auth/user files MUST be purged in Phase 1 per Constitution v3.0.0 Principle XI
- Bidders pay 100% full target bid amount per Constitution v3.0.0 Principle XII — no balance carryover
- All monetary display values use `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`
- Errors use Ember Orange (`#ff682c`) text — never red — per Ventriloc color system

---

## Phase 8: Convergence (Layout & Bidding UX Streamlining)

**Purpose**: Address convergence gaps to streamline bidding UX (single-row input + Pay button, inline favicon detection), implement 50-item rank list pagination, and simplify homepage composition to 2 primary areas.

- [X] T032 Add favicon detection and discrete inline icon display inside the bidding input box in `components/bidding/bid-calculator.tsx` per US2/AC1 (missing)
- [X] T033 Re-compose bidding area into a streamlined single-row input + Pay button in `components/bidding/bid-panel.tsx` per US2/AC1 (partial)
- [X] T034 Add 50-item limit pagination to leaderboard query in `app/api/leaderboard/route.ts` and `hooks/use-leaderboard.ts` per FR-001 (partial)
- [X] T035 Update leaderboard row links in `components/leaderboard/leaderboard-row.tsx` to route to Twitter/X for `@handle` or website for URLs per US1/AC4 (partial)
- [X] T036 Simplify homepage composition in `app/page.tsx` into 2 core areas: top bidding area and bottom 50-item rank list per US1/AC1 (partial)

---

## Phase 9: Convergence (DESIGN.md Editorial Refinement & UI Polish)

**Purpose**: Align copy, button styling, surface hierarchy, and micro-interactions with Ventriloc design specification (DESIGN.md) — replacing aggressive literal text with sleek editorial copy and enforcing bordered 0px buttons.

- [X] T037 Refine copy in `components/bidding/bid-panel.tsx`, `bid-calculator.tsx`, and `app/page.tsx` replacing aggressive text with sleek, editorial copy ("Feature Your Project", "Promote Startup") per DESIGN.md Tone (contradicts)
- [X] T038 Update button styling in `components/ui/button.tsx` and `bid-panel.tsx` to enforce 1px Graphite bordered buttons with 0px radius and smooth hover state per DESIGN.md Buttons (partial)
- [X] T039 Polish input field and inline favicon alignment in `components/bidding/bid-calculator.tsx` with crisp 1px border and smooth focus ring per DESIGN.md Surfaces (partial)
- [X] T040 Align page section surfaces in `app/page.tsx` and `leaderboard-table.tsx` using Ventriloc surface hierarchy (`#ffffff` canvas, `#efefef` ash, `#ebe6dd` ivory) per DESIGN.md Layout (partial)

---

## Phase 10: Convergence (Header Navigation, Headline Refinement & Input Icon Fix)

**Purpose**: Address 6 user directives: enlarge header SVG logo, update header nav links (Leaderboard, About, Rules, Dark Mode toggle) while removing live counter from header, display real live users + visitors count in observatory capsule, redesign hero price stepper headline, fix input text-icon overlap bug, and change button text to "Bid".

- [X] T041 Enlarge header SVG logo to `h-12 md:h-[50px]`, remove live user counter from header, and add `Leaderboard`, `About`, `Rules`, and `Dark Mode Toggle` nav items in `components/ui/header.tsx` per User Directive 1 & 3 (contradicts)
- [X] T042 Update live observatory capsule in `app/page.tsx` to display real live active users and total visitor count per User Directive 2 (missing)
- [X] T043 Redesign `Claim #1 for - $15,005 +` hero headline in `components/bidding/bid-panel.tsx` into a high-end PolySans display with sleek integrated stepper controls per User Directive 4 (partial)
- [X] T044 Fix input field left padding (`pl-14`) in `components/bidding/bid-calculator.tsx` so typed text never overlaps the icon per User Directive 5 (contradicts)
- [X] T045 Update CTA button text in `components/bidding/bid-panel.tsx` from "Outbid" to "Bid" per User Directive 6 (contradicts)

---

## Phase 11: Convergence (About & Rules Legal/Technical Disclosures)

**Purpose**: Expand the About and Rules modal components and create dedicated `/about` and `/rules` pages with comprehensive technical, legal, and operational disclosures: non-bidding startup removal policy, Paddle Merchant of Record terms, third-party unconsented placement terms, and site offline non-liability.

- [X] T046 Create dedicated `/about` and `/rules` pages and expand modal dialogs in `components/ui/header.tsx` detailing why WhosBidding is strictly for bidding platforms per User Directive (partial)
- [X] T047 Implement technical/legal disclaimer content covering Paddle Merchant of Record terms, non-bidding startup rank suppression, third-party unconsented submission terms, and offline site non-liability in `app/about/page.tsx` and `app/rules/page.tsx` per User Directive (missing)
