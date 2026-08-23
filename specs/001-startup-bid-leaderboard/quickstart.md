# Quickstart Validation Guide: Anonymous Startup Bid Leaderboard

**Feature**: Anonymous Startup Bid Leaderboard
**Date**: 2026-08-23
**Source**: [spec.md](spec.md), [data-model.md](data-model.md), [contracts/](contracts/)

---

## Prerequisites

- Node.js 18+
- Docker (for Supabase local)
- Paddle sandbox account with webhook secret
- Environment variables configured (`.env.local` from `.env.example`)

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start local infrastructure
make docker-up

# 3. Apply database migrations
npx supabase db push

# 4. Start dev server
npm run dev
```

---

## Validation Scenarios

### Scenario 1: Empty Leaderboard State

1. Open `http://localhost:3000`
2. **Expected**: Leaderboard shows empty state with message "No Bids Yet" and indication that first bid starts at $1.00
3. **Validates**: FR-001, FR-004

### Scenario 2: Anonymous Bid Placement (First Bid)

1. Open bid panel on homepage
2. Enter handle: `@TestStartup`
3. Enter website: `https://test.com` (optional)
4. Enter bid amount: `$1.00`
5. Complete Paddle inline checkout
6. **Expected**: `@TestStartup` appears as #1 on leaderboard with $1.00 total bid
7. **Validates**: FR-002, FR-003, FR-006, FR-007

### Scenario 3: Surpassing Bid (Full-Price)

1. With `@TestStartup` at #1 ($1.00), open a new browser tab
2. Enter handle: `@Challenger`
3. Enter bid amount: `$2.00`
4. Complete payment
5. **Expected**: `@Challenger` becomes #1 ($2.00), `@TestStartup` drops to #2
6. **Expected**: Full $2.00 charged (no incremental offset)
7. **Validates**: FR-005, FR-006, FR-008, SC-005

### Scenario 4: Re-bidding for Same Handle (Full-Price, No Credit)

1. With `@Challenger` at #1 ($2.00)
2. Open bid panel, enter `@TestStartup` again
3. Enter bid: `$3.00`
4. Complete payment
5. **Expected**: `@TestStartup` becomes #1 ($3.00). Full $3.00 charged (not $1.00 difference)
6. **Validates**: FR-006, SC-005, Constitution Principle XII

### Scenario 5: Invalid Bid Rejection

1. With current #1 at $3.00
2. Try to submit bid of $2.00 or $3.00
3. **Expected**: Error message stating bid must exceed current leader ($3.00) by at least $1.00. Minimum: $4.00
4. **Validates**: FR-005

### Scenario 6: Real-Time Leaderboard Update

1. Open two browser windows to homepage
2. Place a valid bid in Window A
3. **Expected**: Window B updates leaderboard order within 1 second
4. **Validates**: FR-008, SC-002

### Scenario 7: Live Viewer Count

1. Open three browser tabs to homepage
2. **Expected**: Active viewer count shows 3 (or close) and updates as tabs are closed
3. **Validates**: FR-010

### Scenario 8: No Auth Routes Exist

1. Navigate to `/auth/login` or `/auth/signup`
2. **Expected**: 404 or redirect to homepage. No login/signup UI exists.
3. **Validates**: FR-012, SC-006, Constitution Principle XI
