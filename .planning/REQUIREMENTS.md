# Requirements: Shiplog

**Defined:** 2026-03-04
**Core Value:** Every ship you've built is one click away — easy to log, easy to browse, satisfying to look at.

## v1 Requirements

Requirements for this UX refinement milestone.

### Layout & Scale

- [x] **LAYOUT-01**: Heatmap displays 3–4 months of data instead of 52 weeks
- [x] **LAYOUT-02**: Heatmap fits within its container without horizontal overflow
- [x] **LAYOUT-03**: App title is displayed at ~250% of current size
- [x] **LAYOUT-04**: Desktop layout is scaled up ~150% (overall interface feels larger)

### Cleanup

- [x] **CLEAN-01**: User logo removed from top-right header area
- [x] **CLEAN-02**: "Track your builds" subtitle removed
- [x] **CLEAN-03**: Bottom navigation banner (Home / Feed tabs) removed
- [x] **CLEAN-04**: Feed page filter button (All / With Screenshot) removed
- [x] **CLEAN-05**: Submit Ship button uses ship emoji (🚢) instead of rocket emoji
- [x] **CLEAN-06**: Heatmap background and ship post card backgrounds lightened by ~10%

### Modal UX

- [ ] **MODAL-01**: Submit Ship form appears as a centered floating modal (not bottom sheet)
- [ ] **MODAL-02**: Modal open/close animation is preserved

### Navigation

- [ ] **NAV-01**: Clicking a ship entry on the homepage navigates to /feed
- [ ] **NAV-02**: Navigating via homepage entry scrolls to that specific post in the feed

## v2 Requirements

### Future Enhancements

- Authentication / user accounts
- Edit or delete existing ship entries
- Mobile-optimised layout

## Out of Scope

| Feature | Reason |
|---------|--------|
| New data fields / schema changes | No backend changes in this pass |
| New page routes | Click-through goes to existing /feed, not a new page |
| Mobile redesign | Desktop scaling is the focus for this milestone |
| Authentication | Not in scope for this refinement pass |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| LAYOUT-01 | Phase 1 | Complete |
| LAYOUT-02 | Phase 1 | Complete |
| LAYOUT-03 | Phase 1 | Complete |
| LAYOUT-04 | Phase 1 | Complete |
| CLEAN-01 | Phase 1 | Complete |
| CLEAN-02 | Phase 1 | Complete |
| CLEAN-03 | Phase 1 | Complete |
| CLEAN-04 | Phase 1 | Complete |
| CLEAN-05 | Phase 1 | Complete |
| CLEAN-06 | Phase 1 | Complete |
| MODAL-01 | Phase 2 | Pending |
| MODAL-02 | Phase 2 | Pending |
| NAV-01 | Phase 2 | Pending |
| NAV-02 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 14 total
- Mapped to phases: 14
- Unmapped: 0 ✓

---

*Requirements defined: 2026-03-04*
*Roadmap created: 2026-03-04*
