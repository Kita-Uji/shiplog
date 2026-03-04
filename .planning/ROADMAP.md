# Shiplog — Roadmap

**Milestone:** UX Refinement Pass
**Phases:** 2
**Granularity:** Coarse
**Total v1 Requirements:** 14
**Coverage:** 14/14 ✓

---

## Phases

- [ ] **Phase 1: Layout & Cleanup** — Home and feed visual refinements, size scaling, element removal
- [ ] **Phase 2: Modal & Navigation** — Centered modal redesign and click-through navigation

---

## Phase Details

### Phase 1: Layout & Cleanup

**Goal**: Users see a cleaner, larger interface with visual focus on ship entries

**Depends on**: Nothing (first phase)

**Requirements**: LAYOUT-01, LAYOUT-02, LAYOUT-03, LAYOUT-04, CLEAN-01, CLEAN-02, CLEAN-03, CLEAN-04, CLEAN-05, CLEAN-06 (10 total)

**Success Criteria** (what must be TRUE):
1. Heatmap displays 3-4 months of activity and fits within its container without horizontal scrolling
2. App title is visibly larger (250% of original) and dominates the header
3. Homepage displays only ship entries and stats (user logo, subtitle, nav banner removed)
4. Feed page displays full ship list without filter buttons (All/With Screenshot removed)
5. Heatmap backgrounds and post card backgrounds are lightened (~10%), creating visual hierarchy

**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Cleanup: remove avatar, subtitle, bottom nav, filter buttons; swap submit emoji
- [ ] 01-02-PLAN.md — Layout & Scale: widen container, enlarge title, resize heatmap, lighten backgrounds

---

### Phase 2: Modal & Navigation

**Goal**: Users can submit new ships via an improved modal and navigate between homepage and feed seamlessly

**Depends on**: Phase 1

**Requirements**: MODAL-01, MODAL-02, NAV-01, NAV-02 (4 total)

**Success Criteria** (what must be TRUE):
1. Clicking the ship emoji button opens a centered floating modal instead of a bottom sheet
2. Modal opens/closes with smooth animation preserved from original bottom sheet behavior
3. Clicking any ship entry on homepage navigates to /feed and scrolls to that specific post
4. All navigation and submission flows work without page reloads

**Plans**: TBD

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Layout & Cleanup | 0/2 | Planned | - |
| 2. Modal & Navigation | 0/N | Not started | - |

---

## Notes

- This is a UX refinement pass with no backend changes
- All changes are CSS/component-level using existing tech stack (Next.js + Tailwind)
- No new dependencies required
- Public app (no authentication in scope)
