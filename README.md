# WhosBidding — Startup Bid Leaderboard

> Editorial data observatory & real-time bidding platform for bidding platforms.

WhosBidding allows bidding-platform startups to compete for the **#1 spot** on a live leaderboard. Returning bidders only pay the incremental difference between their current cumulative bid and their new target amount!

---

## Technical Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Design System**: Ventriloc Design Tokens (PolySans, Inter, Graphite `#202020`, Ash `#efefef`, Ember Orange `#ff682c`)
- **Animation Layer**: Framer Motion (functional state transitions only per Ventriloc Design System, DESIGN.md)
- **Database & Realtime**: Supabase (PostgreSQL, Auth, RLS, Realtime Postgres Changes & Presence)
- **Payment Gateway**: Paddle Billing (v2) with Inline Checkout (Dominican Republic merchant support)
- **Atomic Concurrency**: PostgreSQL `place_bid_atomic` stored procedure with `FOR UPDATE` row locking
- **Containerization & DX**: Multi-stage `Dockerfile`, `docker-compose.yml`, `Makefile`, `Justfile`
- **Deployment**: Railway / Docker OCI compliant push-to-deploy

---

## Developer Automation (`make` & `just`)

WhosBidding includes standardized `Makefile` and `Justfile` task runners:

```bash
# Using Make:
make help         # View all developer commands
make dev          # Start local dev server
make test         # Run test suite
make docker-up    # Build & start containerized stack
make docker-down  # Stop all containers
make db-push      # Push database migrations

# Using Just:
just              # List recipes
just dev          # Start local dev server
just test         # Run test suite
just docker-up    # Build & start containerized stack
just docker-down  # Stop all containers
just db-push      # Push database migrations
```

---

## Core Business Rules

1. **Leaderboard Ranking**: Startups ordered by `total_bid` descending. Ties broken by earliest timestamp (`updated_at` ASC).
2. **Incremental Billing**: Returning bidders only pay `target_bid - current_cumulative_bid`.
3. **Atomic Concurrency**: Concurrent bids are resolved atomically on the server side — the first processed bid wins, and subsequent users receive updated state.
4. **Push over Poll**: Zero polling — real-time updates pushed via Supabase Realtime WebSockets.

---

## Local Development (Option A: Node.js)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env.local

# 3. Start local Supabase (optional if using hosted Supabase)
supabase start
supabase db push

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Local Containerized Development (Option B: Docker Compose)

For 100% local, self-hosted containerized reproducibility using open-source containers:

```bash
# 1. Build and start all services (Next.js App + Self-Hosted Supabase PostgreSQL, Auth, Realtime, Studio)
make docker-up   # or `just docker-up` / `docker compose up --build -d`

# 2. View running containers
docker compose ps

# 3. Access Services:
# - WhosBidding App: http://localhost:3000
# - Supabase Studio: http://localhost:54323
# - PostgreSQL DB: localhost:54322 (user: postgres, password: postgres)
```

---

## Running Tests

```bash
# Run unit & integration test suite
make test   # or `just test` / `npm test`
```
