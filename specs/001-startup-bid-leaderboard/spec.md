# Feature Specification: Anonymous Startup Bid Leaderboard

**Feature Branch**: `001-startup-bid-leaderboard`
**Created**: 2026-08-21
**Last Updated**: 2026-08-23
**Status**: Draft (Updated for Anonymous Full-Price Bidding Model)

**Input**: User description: "Update the spec for matching the style of arcade-style bidding apps (e.g. outbid.lol / rankbid.lol). We do not need users or auth. Users simply write the link or @handle of their bidding startup and pay the full price to claim #1. If current #1 is $1, they must pay $2. If current #1 is $1000, they must pay $1001, and so forth."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View the Live Startup Leaderboard (Priority: P1)

A visitor arrives at the WhosBidding homepage. They immediately see a live leaderboard ranking startups by their current total bid amount in descending order, with the #1 startup prominently featured at the top. Each row displays the startup name or @handle, optional website link, current total bid amount, and rank position. The leaderboard updates in real time for all connected visitors whenever a new bid is confirmed — zero page refresh required.

**Why this priority**: The live leaderboard is the primary value proposition. Without instant, visible rank updates, there is no urgency or motivation for competitive bidding.

**Independent Test**: Load the homepage in two browser windows. Placing a valid bid in Window A causes Window B to update its leaderboard order and top leader highlight within 1 second.

**Acceptance Scenarios**:

1. **Given** startups have placed confirmed bids, **When** a visitor loads the homepage, **Then** they see startups ranked by total bid amount in descending order with the #1 startup highlighted at the top.
2. **Given** no bids have been placed yet on the platform, **When** a visitor loads the homepage, **Then** they see an empty leaderboard state indicating that the initial minimum bid to claim #1 starts at $1.00.
3. **Given** multiple visitors are viewing the page, **When** a new bid is confirmed, **Then** all connected visitors see the leaderboard re-order in real time without refreshing.

---

### User Story 2 - Place an Anonymous Bid to Claim #1 (Priority: P1)

Any visitor (without creating an account or logging in) can open the bid panel on the homepage, enter their startup's name or @handle, optional website link, and enter a bid amount that exceeds the current #1 leader's bid by at least $1. The bidder pays the full bid amount directly via payment gateway inline checkout. Once payment is confirmed, their startup immediately takes the #1 spot on the leaderboard for all connected users.

**Why this priority**: Anonymous, friction-free bidding is the core revenue engine and primary action of the application. Eliminating signups and auth maximizes conversion.

**Independent Test**: Enter startup handle `@mycompany` and target bid `$2` (when current leader is `$1`). Complete payment. Verify `@mycompany` becomes #1 immediately.

**Acceptance Scenarios**:

1. **Given** current #1 bid is $1.00, **When** a visitor submits $2.00 for `@mycompany` and payment succeeds, **Then** `@mycompany` becomes #1 on the leaderboard and the total bid displays as $2.00.
2. **Given** current #1 bid is $1,000.00, **When** a visitor submits $1,001.00 for `@mycompany` and payment succeeds, **Then** the system charges the full $1,001.00 amount and `@mycompany` becomes #1.
3. **Given** current #1 bid is $1,000.00, **When** a visitor attempts to submit a bid of $999.00 or $1,000.00, **Then** the system rejects the bid with a clear message stating the bid must exceed the current leader by at least $1.00.
4. **Given** a visitor submits a valid bid, **When** payment fails or is cancelled, **Then** no bid is recorded, the leaderboard remains unchanged, and an error is displayed.

---

### User Story 3 - Full-Price Surpassing Bids (Priority: P1)

When a previously outbid startup wants to reclaim the #1 rank, the bidder must pay the FULL new target amount (which must be greater than the current leading bid). No prior payments, cumulative balances, or incremental credit carryovers exist. Every bid transaction is a standalone, full-price purchase for the full amount entered.

**Why this priority**: Ensures arcade-style economic mechanics. Every attempt at claiming top placement requires full commitment, keeping the game simple, fair, and anonymous without user balance tracking.

**Independent Test**: Startup A bids $10 to hold #1. Startup B bids $11 to take #1. Startup A bids $12 to reclaim #1. Verify Startup A pays the full $12 (not $2).

**Acceptance Scenarios**:

1. **Given** Startup A previously paid $10 and is now outbid by Startup B ($11), **When** a bidder re-bids for Startup A at $12, **Then** the bidder is charged the full $12.00 amount.
2. **Given** a bidder is in the checkout panel, **When** reviewing the payment total, **Then** the total amount to be charged equals 100% of the target bid amount.

---

### User Story 4 - Real-Time Outbid Alerts & Activity Feed (Priority: P2)

Connected visitors see a live stream of recent bidding activity and receive instant toast notifications whenever the #1 spot changes hands. The notification displays the new leader handle and the new top bid amount.

**Why this priority**: Real-time alerts foster competitive urgency and keep visitors engaged with the live leaderboard dynamics.

**Independent Test**: Trigger a new winning bid from a separate session and confirm a toast alert pops up immediately with the new leader handle and bid amount.

**Acceptance Scenarios**:

1. **Given** visitors are viewing the platform, **When** a new bid takes the #1 spot, **Then** a toast notification appears for all connected visitors showing the new leader's handle and bid.
2. **Given** bids are being placed, **When** viewing the activity section, **Then** recent bids appear in a live feed.

---

### User Story 5 - Live Active Viewer Count (Priority: P3)

Visitors can see the current number of active viewers connected to the platform, updated in real time as users join or leave the page.

**Why this priority**: Social proof indicator that adds vitality to the live observatory.

**Independent Test**: Connect multiple browser tabs and verify active viewer counter updates dynamically.

**Acceptance Scenarios**:

1. **Given** 10 visitors are on the page, **When** an 11th visitor opens the site, **Then** the active viewer count updates to 11 in real time across all tabs.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a real-time leaderboard ranked by total bid amount in descending order.
- **FR-002**: System MUST allow any visitor to place a bid anonymously without creating an account, logging in, or providing personal profile credentials.
- **FR-003**: System MUST require only a startup name or @handle, optional website link, and a valid bid amount to initiate a bid.
- **FR-004**: System MUST start the initial minimum bid at $1.00 when no bids exist on the platform.
- **FR-005**: System MUST require all new bids to exceed the current #1 leader's bid amount by at least $1.00 (e.g., if leader is $1, minimum new bid is $2; if leader is $1000, minimum new bid is $1001).
- **FR-006**: System MUST charge the bidder 100% of the target bid amount for every bid transaction — NO incremental balance calculations, credits, or prior payment offsets.
- **FR-007**: System MUST process all payments securely through tokenized payment gateway inline checkout without storing raw payment credentials on application servers.
- **FR-008**: System MUST update the leaderboard in real time for all connected visitors immediately upon confirmed payment webhook execution.
- **FR-009**: System MUST broadcast a real-time outbid alert to all connected visitors whenever the #1 position is taken.
- **FR-010**: System MUST track and display live connected viewer counts in real time.
- **FR-011**: System MUST resolve concurrent bids atomically on the server side — the first confirmed payment wins, and subsequent bidders submitting against stale leader amounts are notified and refunded/cancelled appropriately.
- **FR-012**: System MUST NOT store user password hashes, authentication tokens, user sessions, or personal user profiles.

---

### Key Entities

- **Startup / Leaderboard Entry**: Represents a bidding startup on the leaderboard. Attributes: unique ID, name / @handle, website URL (optional), current total bid amount, rank position, last updated timestamp.
- **Bid Transaction**: Represents an individual full-price bid attempt. Attributes: transaction ID, startup handle, target bid amount (full price charged), payment status (pending/confirmed/failed), idempotency key, timestamp.
- **Leaderboard**: Derived live ranking of all startups ordered by total confirmed bid amount descending.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Page loads complete startup leaderboard within 2 seconds.
- **SC-002**: Leaderboard rank changes are reflected for all connected visitors within 1 second of payment confirmation.
- **SC-003**: Visitors can complete an anonymous bid (from handle entry to payment completion) in under 20 seconds with zero signup screens.
- **SC-004**: Outbid notifications deliver within 1 second of a new #1 bid confirmation.
- **SC-005**: 100% of bid transactions charge the exact full target amount with zero incremental balance carryover.
- **SC-006**: Zero user authentication routes, session tokens, or account creation steps exist in the user journey.
- **SC-007**: Concurrent bids are resolved atomically with 0 duplicate rank assignments.

---

## Assumptions

- Monetary amounts are in USD ($).
- Payment processing relies on Paddle Billing v2 inline checkout sandbox/production integration.
- Anonymous bidders identify their startups via unique name or @handle (e.g. `@myproject` or `https://myproject.com`).
- No user accounts or dashboards exist — all interactions happen on the single main page observatory.
- Non-winning bids or surpassed startups remain on the leaderboard at their bid amount until out-bid down the ranking table.
