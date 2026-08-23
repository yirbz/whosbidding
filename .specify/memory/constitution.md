<!--
Sync Impact Report:
- Version change: 2.0.0 → 3.0.0
- MAJOR bump rationale: Complete elimination of authentication, user accounts, signup/login flows,
  profile management, and incremental bidding balances. Redefinition of core bidding mechanics to full-price
  surpassing payments (bidders must pay the full new target amount > #1 leader, no cumulative credit carryover).
  Transition to anonymous, stateless bidding (link/handle + payment only).
- Modified principles:
  - I. Anonymous Payment & Transaction Integrity (renamed & updated to remove user/account credentials)
  - II. Clean Architecture & Domain Separation of Concerns (updated to eliminate user/profile domain logic)
  - III. Low-Latency Event-Driven Synchronization & Resource Efficiency — unchanged
  - IV. Server-Side Authority & Stateless Bid Security (updated to enforce full-price surpassing rules & atomic resolution without auth)
  - V. Observability, Real-Time State Tracking & Testability — unchanged
  - XI. Account-Free & Anonymous Architecture (new principle: strictly forbids auth, user sessions, signup/login, or profile management)
  - XII. Full-Price Surpassing Model (new principle: strictly forbids incremental billing/balance credit; every bid pays full target > #1)
- Added sections:
  - XI. Account-Free & Anonymous Architecture
  - XII. Full-Price Surpassing Model
- Removed sections: None
- Follow-up TODOs: None
-->

# WhosBidding Constitution

## Core Principles

### I. Anonymous Payment & Transaction Integrity (NON-NEGOTIABLE)
All financial transactions and bid payments MUST be executed anonymously without requiring user signup,
login, or persistent user accounts. Payment flows MUST be processed exclusively through secure server-side
handlers leveraging verified payment gateways (e.g., Paddle Billing v2). Payment credentials and tokens
MUST NEVER pass through or reside on application servers unencrypted. Every payment action MUST enforce
cryptographically verified webhook signatures, strict idempotency keys, and zero-trust transactional boundaries
without associating transactions with persistent user profiles.

### II. Clean Architecture & Domain Separation of Concerns
The application MUST strictly isolate domain logic (bidding rules, surpassing validation, ranking state)
from infrastructure, transport layers (HTTP/WebSocket), and payment vendor implementations. Domain entities
MUST NOT contain concepts of user accounts, authentication sessions, profile ownership, or cumulative credit
balances. Use cases MUST remain pure, side-effect-free, and 100% testable in complete isolation.

### III. Low-Latency Event-Driven Synchronization & Resource Efficiency
Real-time UI updates — including active viewer counts, live activity feed events, and leaderboard rank updates —
MUST be delivered using efficient, push-based transport mechanisms (Supabase Realtime WebSockets). Continuous
client polling or high-frequency polling loops are STRICTLY FORBIDDEN to eliminate redundant server compute
charges and prevent latency degradation. Event broadcast infrastructures MUST utilize lightweight pub/sub channels
and connection multiplexing to maintain sub-second updates.

### IV. Server-Side Authority & Stateless Bid Security
All bidding state changes, bid eligibility validations, and rank determinations MUST be processed and finalized
authoritatively on the server side via atomic database stored procedures with row-level locking (`SELECT ... FOR UPDATE`).
Client-side state is treated as untrusted projection-only data. Concurrent bids MUST be synchronized atomically
using server-side concurrency controls to ensure race-free bid resolution without relying on user session tokens.

### V. Observability, Real-Time State Tracking & Testability
The platform MUST continuously track and emit telemetry for key operational metrics — active concurrent viewers
per page, bidding velocity, top bidding items, and top leader transitions. Telemetry and state changes MUST be
transparently auditable and logged with structured context while guaranteeing 100% user anonymity.

### VI. Ventriloc Design System Integrity (NON-NEGOTIABLE)
All UI components, pages, layouts, and visual elements MUST strictly conform to the Ventriloc Design System as
documented in `DESIGN.md`. This is the single source of truth for every visual decision on this project. No component
library, third-party UI kit, animation framework, or external design system is permitted to override, supplement,
or conflict with Ventriloc tokens, component patterns, or visual rules.

**Rationale**: The Ventriloc system creates a coherent editorial identity — the "quiet, warm-paper data observatory"
voice. Every deviation fractures the visual contract and degrades the serious, precise character of the product.

### VII. Typographic Authority (NON-NEGOTIABLE)
Typography is the primary visual medium of WhosBidding. The following rules are absolute:

- PolySans MUST be used exclusively at **weight 400** for all headings, nav items, display text, and button labels.
  Weights 500, 600, 700, or bold are FORBIDDEN on PolySans elements.
- Inter MUST be used at 400 for body/paragraph copy and at 500 for UI labels and captions.
- Letter-spacing of `-0.02em` MUST be applied to every PolySans text element.
- Display size (66px) MUST use `line-height: 0.91` — the tight poster-like leading is the signature.
- Heading sizes (32px, 40px) MUST apply `line-height: 1.19–1.2` with corresponding tracking tokens.
- Inter Tight or Space Grotesk at weight 400 are the only acceptable PolySans substitutes.

### VIII. Color Discipline & Achromatic Restraint (NON-NEGOTIABLE)
Color usage is strictly rationed. Every page MUST read as 95% achromatic.

- **Graphite** (`#202020`): Primary text, headings, nav links, icon strokes.
- **Canvas White** (`#ffffff`): Page background, card elevation surfaces.
- **Ash** (`#efefef`): Card and section panel background — the dominant warm-gray surface.
- **Fog** (`#f5f5f5`): Nested containers and secondary backgrounds.
- **Ivory** (`#ebe6dd`): Warm accent wash for editorial/featured blocks only.
- **Steel** (`#4d4d4d`): Secondary body copy and long-form paragraphs.
- **Slate** (`#828282`): Muted helper text, tertiary nav items, inactive controls.
- **Mist** (`#e8e8e8`): Hairline dividers, nav background fills.
- **Ember Orange** (`#ff682c`): Accent ONLY — link underlines, chart highlights, and small icon accents.
- **Brass** (`#816729`): Secondary accent for chart strokes, decorative SVG lines, and tag text only.

Blue, green, purple, red, or any other chromatic color are FORBIDDEN. The two-warm-accent system (Ember Orange + Brass)
is the absolute chromatic limit of this design system.

### IX. Structural Geometry & Surface Hierarchy (NON-NEGOTIABLE)
The three-radius system creates deliberate visual rhythm and MUST NOT be homogenized:

- **Buttons**: `border-radius: 0px` — absolute sharp corners, always.
- **Featured/asymmetric cards**: `border-radius: 6px 0px 0px` — soft top-left only.
- **Nav pill containers**: `border-radius: 200px` — fully pill-shaped capsule.
- **Data dashboard cards**: `border-radius: 20px`.
- **Tag elements**: `border-radius: 20px`.

Box-shadows on cards, buttons, or any surface element are FORBIDDEN. Section breaks MUST use alternating surface
color bands (white ↔ Ash) separated by 80px vertical whitespace.

### X. Layout Rhythm & Whitespace Governance
Layout MUST follow the Ventriloc spatial system:

- **Page max-width**: 1200px, centered.
- **Section gap**: 80px vertical.
- **Card padding**: 40px (70px top / 60px left for asymmetric featured cards).
- **Element gap**: 20px.
- **Base unit**: 4px. All spacing values MUST be multiples of 4px.

### XI. Account-Free & Anonymous Architecture (NON-NEGOTIABLE)
WhosBidding is an anonymous, zero-friction bidding platform. The implementation of user accounts, authentication
middleware, login forms, signup forms, user profiles, dashboard user states, or password management is STRICTLY FORBIDDEN.

- Anyone can place a bid by entering their startup name / @handle, website URL (optional), and desired bid amount.
- Bids are placed anonymously and confirmed via payment gateway inline checkout.
- No user session tokens, JWTs, or account cookies shall be required or maintained.

**Rationale**: Requiring registration introduces friction that undermines spontaneous competitive bidding. The user experience is reduced to pure action: enter startup link/name, pay, claim #1.

### XII. Full-Price Surpassing Model (NON-NEGOTIABLE)
To claim or reclaim the #1 spot on the leaderboard, a bidder MUST pay the FULL target bid amount (which must be greater
than the current #1 bid). Cumulative credit balances, incremental discount calculations, and prior balance offsets are
STRICTLY FORBIDDEN.

- **Example**: If the current #1 bid is $1,000, any bidder (new or returning) MUST pay a minimum of $1,001 (full amount)
  to take the #1 spot.
- Every bid transaction represents a full, standalone payment for the specified amount.
- Prior payments made by a startup do NOT reduce the price required to reclaim #1 in future bids.

**Rationale**: This arcade-style economic model ensures maximum competitive escalation. Returning bidders pay full price
for top placement every single time, matching the fast-paced, high-stakes nature of the product genre.

## Security & Payment Gateway Constraints

### Payment & Gateway Security
- **No Raw Cardholder Data**: Application servers MUST NOT touch, store, or log raw card numbers, CVVs, or sensitive
  authentication data. All payment methods MUST be tokenized via Paddle's client-side SDK.
- **Idempotency & Webhooks**: Every bid transaction MUST carry an explicit idempotency key. All incoming Paddle webhooks
  MUST verify signature authenticity before confirming bids.
- **No User Account Storage**: No password hashes, auth tokens, or personal profile records shall exist in the database.

## Architectural & Real-Time Data Standards

### Test-Driven & Decoupled Domain Design
- **100% Unit Testable Domain Core**: All bidding rules (full-price validation against current #1, leaderboard ranking)
  MUST be implemented in framework-agnostic domain modules with Vitest test coverage.
- **Adapter & Interface Isolation**: Payment gateways, real-time push engines, and database persistence MUST implement
  explicit interfaces.

### Low-Latency Real-Time Pipeline
- **Push over Poll**: Viewer tracking and live bid updates MUST use Supabase Realtime WebSocket push connections.

## Design System & Visual Standards

The Ventriloc Design System (`DESIGN.md`) is the canonical authority for all visual decisions.

### Banned Libraries & Anti-Patterns
- **MagicUI** is PROHIBITED.
- **Auth UI / Account Components** (login forms, signup cards, user avatars, profile settings) are PROHIBITED.

## Governance

This constitution supersedes all implicit engineering habits, codebase conventions, and third-party library documentation
for WhosBidding. `DESIGN.md` is the visual law.

### Amendment Procedure
1. Any principle revision MUST be proposed as a formal pull request modifying `.specify/memory/constitution.md`.
2. Upon approval, `CONSTITUTION_VERSION` MUST be incremented per semantic versioning:
   - **MAJOR**: Removal or fundamental redefinition of core security, architectural, economic, or design system principles.
   - **MINOR**: Addition of new principles or significant expansion of constraints.
   - **PATCH**: Non-semantic clarifications, wording improvements, or typo fixes.

**Version**: 3.0.0 | **Ratified**: 2026-08-21 | **Last Amended**: 2026-08-23
