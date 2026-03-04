---
phase: 02-modal-and-navigation
plan: 02
subsystem: ui
tags: [next.js, navigation, hash-routing, ship-cards, link]

# Dependency graph
requires:
  - phase: 01-layout-and-cleanup
    provides: ShipCard, RecentShips, and feed/page.tsx components this plan modifies
provides:
  - ShipCard with optional href prop that wraps card in Next.js Link
  - Hash-based navigation from homepage recent cards to feed scroll targets
  - id attributes on feed card wrappers for browser native scroll-to-anchor
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified:
    - components/ShipCard.tsx
    - components/RecentShips.tsx
    - app/feed/page.tsx

key-decisions:
  - "Optional href prop pattern on ShipCard preserves existing feed behavior — feed cards pass no href so they remain plain divs with no hover affordance"
  - "Hash URL navigation (/feed#ship-{id}) with matching id attributes uses zero JavaScript — native browser scroll handles the anchor"
  - "stopPropagation on external link badge prevents double-navigate when card is wrapped in Link"

patterns-established:
  - "Conditional wrapper pattern: extract JSX to variable, render in Link or div based on prop presence"

requirements-completed: [NAV-01, NAV-02]

# Metrics
duration: 2min
completed: 2026-03-04
---

# Phase 2 Plan 02: Modal and Navigation — Ship Card Click-Through Summary

**Homepage ship cards now navigate to /feed and scroll to the exact entry via Next.js Link + native browser hash anchors, with zero JavaScript**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-04T08:24:58Z
- **Completed:** 2026-03-04T08:26:21Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- ShipCard gains an optional `href` prop — when provided, wraps the card in a Next.js `<Link>` for client-side navigation; when absent the card renders as a plain non-navigating `<div>` (preserving feed behavior)
- RecentShips passes `href="/feed#ship-{id}"` to each ShipCard so homepage recent entries are clickable
- feed/page.tsx wraps each ShipCard in `<div id="ship-{id}">` so the hash URL has a DOM anchor to scroll to

## Task Commits

Each task was committed atomically:

1. **Task 1: Add optional href prop to ShipCard with Next.js Link wrapper** - `08a4504` (feat)
2. **Task 2: Wire hash navigation from RecentShips and add feed scroll targets** - `f6c91f7` (feat)

## Files Created/Modified
- `components/ShipCard.tsx` - Added `href?: string` prop, extracted `cardBody` JSX, conditionally wraps in `<Link>` or `<div>`
- `components/RecentShips.tsx` - Passes `href="/feed#ship-{ship.id}"` to each ShipCard
- `app/feed/page.tsx` - Wraps each ShipCard in `<div id="ship-{id}">` for hash anchor targets

## Decisions Made
- Conditional wrapper pattern (extract to variable, render in Link or div) chosen over duplicating JSX — keeps card body DRY and both variants visually identical except for outer element and hover border
- Added `onClick={(e) => e.stopPropagation()}` to the external link badge so clicking it opens the external URL without also triggering card navigation
- `hover:border-ship-accent/50` affordance added only to the Link variant to subtly signal clickability on homepage cards

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Second build attempt hit a `.next/lock` file conflict from a concurrent build process. Waited 3 seconds and retried — passed cleanly.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 2 complete. Both NAV-01 and NAV-02 requirements satisfied.
- No blockers. All success criteria met: build passes, cards navigate, feed scrolls to anchor, feed-page cards are non-navigating.

## Self-Check: PASSED

- components/ShipCard.tsx: FOUND
- components/RecentShips.tsx: FOUND
- app/feed/page.tsx: FOUND
- 02-02-SUMMARY.md: FOUND
- Commit 08a4504: FOUND
- Commit f6c91f7: FOUND

---
*Phase: 02-modal-and-navigation*
*Completed: 2026-03-04*
