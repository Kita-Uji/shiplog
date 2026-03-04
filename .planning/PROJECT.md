# Shiplog

## What This Is

Shiplog is a personal build log app that lets you publicise and track the products you've shipped. You log each ship with a title, details, optional screenshot, and link — displayed on a home dashboard with a heatmap and stats, and a full feed page for browsing entries.

## Core Value

Every ship you've built is one click away — easy to log, easy to browse, satisfying to look at.

## Requirements

### Validated

- ✓ Log a ship with title, details, date, optional screenshot, and link — existing
- ✓ Home page with heatmap activity grid, stats bar, and recent ships list — existing
- ✓ Feed page with full chronological list of all ships — existing
- ✓ Submit Ship modal for creating new entries — existing
- ✓ Image upload to Supabase Storage — existing
- ✓ Supabase PostgreSQL backend with ships CRUD API — existing

### Active

- [ ] Heatmap resized to show 3–4 months of data and fits within its container (no overflow)
- [ ] App title displayed at 250% of current size
- [ ] User logo removed from top-right header
- [ ] "Track your builds" subtitle removed
- [ ] Desktop layout scaled up ~150% (interface feels too small at current size)
- [ ] Bottom navigation banner (Home / Feed tabs) removed
- [ ] Feed page filter button (All / With Screenshot) removed
- [ ] Submit Ship button uses ship emoji (🚢) instead of rocket
- [ ] Submit Ship form appears as a centered floating modal, not a bottom sheet — animation kept
- [ ] Clicking a ship entry on the homepage navigates to /feed and scrolls to that specific post

### Out of Scope

- Authentication / login — not in scope for this refinement pass
- New data fields on ships — no schema changes planned
- Mobile-specific redesign — desktop scaling is the focus

## Context

The app was initially built with Claude Code without GSD, producing a functional but visually rough draft. This milestone is a UX refinement pass — fixing layout issues, removing clutter, and adding click-through navigation. No backend changes required.

**Tech stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS 3, Supabase JS v2, date-fns 4

**Key files:**
- `components/Heatmap.tsx` — 52-week grid (resize to 3–4 months)
- `components/SubmitShipModal.tsx` — bottom sheet form (convert to centered modal)
- `app/page.tsx` — home page (remove logo, subtitle, nav banner; add click-through)
- `app/feed/page.tsx` — feed page (remove filter button; add scroll anchor targets)
- `components/RecentShips.tsx` — homepage ship list (add click handler)

## Constraints

- **Tech stack**: Next.js + Tailwind — all changes are CSS/component level, no new dependencies needed
- **No auth**: App remains fully public for this milestone
- **Animation**: Modal transition animation must be preserved when converting from bottom sheet to center

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Centered modal instead of bottom sheet | User finds bottom sheet UX awkward on desktop | — Pending |
| 3–4 months heatmap instead of 52 weeks | 52 weeks overflows on desktop; recent activity is most relevant | — Pending |
| Click → scroll to post in Feed (not new page) | Avoids creating a new route; Feed already has full post content | — Pending |

---
*Last updated: 2026-03-04 after initialization*
