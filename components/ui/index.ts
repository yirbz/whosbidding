/**
 * Ventriloc Design System Primitives
 * Source of truth: DESIGN.md & Constitution v2.0.0
 * 
 * Rules:
 * - PolySans 400 weight for all headings and button labels.
 * - 0px radius for buttons.
 * - 6px 0px 0px radius for asymmetric cards.
 * - 8px radius for leaderboard cards.
 * - 20px radius for data cards & tags.
 * - 200px radius for nav pills.
 * - No box-shadows on any surface element.
 * - SectionDivider: Sections MUST use 80px (`py-20`) vertical spacing
 *   and alternating surface bands (`bg-canvas-white` / `bg-ash`) — no <hr> lines.
 */

export * from "./button";
export * from "./leaderboard-card";
export * from "./asymmetric-card";
export * from "./data-card";
export * from "./tag";
export * from "./nav-pill";
