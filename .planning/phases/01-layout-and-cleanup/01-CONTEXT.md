# Phase 1: Layout & Cleanup - Context

**Gathered:** 2026-03-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Visual refinements to home and feed pages: resize the heatmap to 3-4 months, scale the overall interface up, remove clutter elements (logo, subtitle, nav banner, feed filter, emoji swap), and lighten card/heatmap backgrounds. No modal or navigation changes (those are Phase 2).

</domain>

<decisions>
## Implementation Decisions

### Scale approach
- Scale up both container width AND element sizes
- Target: ~125% of current size (not 150% as originally noted)
- Container: `max-w-lg` (512px) → approximately `max-w-2xl` (~672px) or equivalent
- Element sizes: increase text, spacing, padding, and cell sizes proportionally

### Header composition
- After removing user logo and subtitle, leave the header layout as-is
- The title alone, left-aligned — minimal is the intent
- No centering or structural adjustment needed

### Heatmap labels
- Remove the "past year" descriptor text entirely — no replacement
- The "2025 Shipping" label in the heatmap card header may also be removed or left as-is — Claude's discretion
- Grid shows last 3-4 months (change `WEEKS = 52` to ~14-16 weeks)

### Element removals (unambiguous)
- CLEAN-01: Remove the `w-9 h-9` avatar div (the "A" circle in the top-right header)
- CLEAN-02: Remove the `text-[10px] tracking-widest` "TRACK YOUR BUILDS" subtitle
- CLEAN-03: Remove the `<nav className="fixed bottom-0...">` from both `app/page.tsx` and `app/feed/page.tsx`
- CLEAN-04: Remove filter button state and UI from `app/feed/page.tsx`; always show all ships
- CLEAN-05: Change `🚀 Submit a Ship` button to `🚢 Submit a Ship`

### Title size
- LAYOUT-03: App title currently `text-2xl` — scale to 250% of current → approximately `text-6xl`

### Background lightening
- CLEAN-06: Lighten heatmap empty cell color `#E8E8E0` and ship card background `#F0F0E8` by ~10%
- Claude's discretion on exact hex values

### Claude's Discretion
- Exact container max-width value to achieve ~125% scale feel
- Proportional spacing/padding adjustments throughout
- Exact hex values for lightened backgrounds (CLEAN-06)
- Whether to keep or remove "2025 Shipping" label in heatmap card header

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/Heatmap.tsx`: `WEEKS = 52` constant at top — change to 14 or 16 for 3-4 months. Cells are `w-3 h-3` — scale up with overall sizing pass.
- `components/ShipCard.tsx`: Background is `bg-ship-card` (Tailwind custom color `#F0F0E8`) — lighten in `tailwind.config`
- `components/StatsBar.tsx`: Will need spacing/size review during scale pass

### Established Patterns
- Custom Tailwind colors defined in config (`ship-bg`, `ship-card`, `ship-border`, `ship-text`, `ship-accent`, `ship-accent-dark`)
- Lightening backgrounds means updating the hex values in Tailwind config, not scattered inline styles
- Container lives in `app/layout.tsx` — single source of truth for max-width

### Integration Points
- `app/layout.tsx` line 17: `max-w-lg mx-auto px-4 pb-20` — change `max-w-lg` for container scale
- `app/page.tsx` lines 37-48: Header with title + avatar — remove avatar div (lines 45-47), remove subtitle (lines 41-43)
- `app/page.tsx` lines 91-99: Bottom nav — remove entire `<nav>` block
- `app/feed/page.tsx` lines 11, 29-32, 49-70: Filter state + filter UI — remove all; render all ships unconditionally
- `app/feed/page.tsx` lines 100-108: Bottom nav — remove entire `<nav>` block

</code_context>

<specifics>
## Specific Ideas

- "125% scale-up" — both container and elements, not just one or the other
- Header should feel minimal with just the title — no need to fill the space left by removing the avatar
- No label replacement for the heatmap time range — let the grid speak for itself

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-layout-and-cleanup*
*Context gathered: 2026-03-04*
