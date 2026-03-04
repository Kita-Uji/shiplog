# Codebase Concerns

**Analysis Date:** 2026-03-04

## Security Considerations

**File upload validation:**
- Risk: No file type validation on uploaded images; relies only on `accept="image/*"` (client-side, easily bypassed)
- Files: `app/api/upload/route.ts`, `components/SubmitShipModal.tsx`
- Current mitigation: MIME type is passed to Supabase but not validated server-side; extension is extracted from filename without sanitization
- Recommendations:
  - Validate file type server-side using magic bytes or dedicated library before accepting
  - Sanitize/regenerate filenames to prevent path traversal
  - Add file size limits to prevent storage abuse
  - Consider implementing rate limiting per user/IP

**XSS vulnerabilities:**
- Risk: URL links from database are rendered in `<a href>` tags without sanitization in `components/ShipCard.tsx`
- Files: `components/ShipCard.tsx` (line 46)
- Current mitigation: Uses `target="_blank"` and `rel="noopener noreferrer"` but no URL validation
- Recommendations:
  - Validate URL format server-side (ensure `http://` or `https://`)
  - Use URL constructor to validate before rendering
  - Consider whitelist-based URL validation if needed

**Error messages expose internals:**
- Risk: API error responses include raw error strings which may leak database structure or internal details
- Files: `app/api/ships/route.ts` (lines 15, 38), `app/api/upload/route.ts` (line 35)
- Current mitigation: None
- Recommendations:
  - Catch specific errors and return generic messages to client
  - Log detailed errors server-side for debugging
  - Implement proper error classification (validation vs. internal vs. auth)

## Error Handling Gaps

**Silent failures on data fetch:**
- Problem: `app/page.tsx` and `app/feed/page.tsx` silently set empty arrays on fetch error, providing no feedback to user
- Files: `app/page.tsx` (lines 21-22), `app/feed/page.tsx` (lines 18-19)
- Impact: User doesn't know if data failed to load or just doesn't exist
- Recommendation: Show error UI with "Failed to load ships. Try refreshing." message; log errors for debugging

**Upload error handling:**
- Problem: Upload errors in `components/SubmitShipModal.tsx` are caught but error messages are generic
- Files: `components/SubmitShipModal.tsx` (lines 69-70)
- Impact: User can't distinguish between network error, file too large, invalid image, etc.
- Recommendation: Parse error responses and provide specific feedback

**JSON parsing not defensive:**
- Problem: `await req.json()` in `app/api/ships/route.ts` (line 21) will throw unhandled SyntaxError if malformed
- Files: `app/api/ships/route.ts` (line 21)
- Impact: Returns 500 instead of 400 for malformed requests
- Recommendation: Wrap in try/catch with specific error handling

## Data Validation Issues

**Minimal input validation:**
- Problem: Only title is required; date, URLs, and text fields are not validated for format/length
- Files: `app/api/ships/route.ts` (lines 24-26)
- Impact: Invalid dates or extremely long strings could cause unexpected behavior
- Recommendation:
  - Validate `ship_date` is valid ISO format and not future-dated
  - Add length limits to title, details (e.g., max 1000 chars)
  - Validate `link_url` is proper HTTP(S) URL format

**No timezone handling:**
- Problem: Ship dates are stored as `YYYY-MM-dd` but user's timezone is never captured or considered
- Files: `components/SubmitShipModal.tsx` (line 12), `app/api/ships/route.ts`, `components/Heatmap.tsx`
- Impact: User in timezone UTC+8 sees "today" but it's stored as previous day's date
- Recommendation: Store timezone info with each ship or explicitly handle UTC conversion

## Performance Bottlenecks

**Full data load every page load:**
- Problem: All ships fetched on every page navigation (no pagination, filtering, or caching)
- Files: `app/page.tsx` (lines 16-26), `app/feed/page.tsx` (lines 13-23)
- Impact: Scales poorly once ship count > 100; all filtering happens in memory
- Recommendation:
  - Add server-side pagination to API endpoint
  - Implement cursor-based pagination or limit with offset
  - Cache recent ships for 30-60 seconds in client
  - Consider infinite scroll instead of showing all at once

**Heatmap recomputes unnecessarily:**
- Problem: `Heatmap.tsx` uses `useMemo` with `[ships]` dependency, but `ships` array recreated on every data fetch
- Files: `components/Heatmap.tsx` (line 70)
- Impact: Heatmap grid rebuilds even if data hasn't changed
- Recommendation: Implement custom equality check or memoize ships array at parent level

**No image optimization:**
- Problem: `Image` component in `ShipCard.tsx` loads full resolution images without size constraints
- Files: `components/ShipCard.tsx` (lines 24-29)
- Impact: Slow page load, high bandwidth use, especially on mobile
- Recommendation: Set `width` and `height` on Image component, use `priority={false}` for below-fold images

## Fragile Areas

**Date parsing without error boundaries:**
- Problem: `ShipCard.tsx` tries to parse ISO date but falls back to raw string on error
- Files: `components/ShipCard.tsx` (lines 11-17)
- Impact: If database has invalid `ship_date` format, silently shows raw string instead of consistent formatting
- Safe modification:
  - Add schema validation at database level
  - Use strict date validation on insert in API
  - Add test for malformed date handling
- Test coverage: No tests for date parsing edge cases

**Streak calculation edge case:**
- Problem: `StatsBar.tsx` streak logic assumes consistent date format; if `ship_date` is null or invalid, `Set.has()` silently returns false
- Files: `components/StatsBar.tsx` (lines 16-27)
- Impact: If one ship has malformed date, streak breaks silently
- Safe modification:
  - Validate dates before calculating stats
  - Add guard for null/undefined
  - Log invalid dates for debugging
- Test coverage: No tests for malformed data scenarios

**Modal state not cleared properly:**
- Problem: Form state in `SubmitShipModal.tsx` is not reset on close, only on success
- Files: `components/SubmitShipModal.tsx` (lines 102-109 in parent)
- Impact: If user opens modal, fills form, closes it, then reopens, form still has old data
- Safe modification:
  - Reset form state in `onClose` callback
  - Clear image preview on close
  - Use form `reset()` method

## Scaling Limits

**Image storage unbounded:**
- Current capacity: Supabase Storage quota (depends on plan)
- Limit: No size limit on individual uploads, no cleanup of orphaned images
- Problem: Users could upload gigabytes of images; deleted ships leave orphaned storage
- Scaling path:
  - Implement file size limits (e.g., max 5MB per image)
  - Add image cleanup when ship is deleted
  - Consider implementing image resizing/compression

**Database row growth:**
- Current capacity: Unlimited PostgreSQL rows
- Limit: No archiving or cleanup strategy
- Problem: Old ships accumulate indefinitely; queries get slower
- Scaling path:
  - Implement data archiving after 2+ years
  - Add soft-delete (is_archived flag) instead of hard delete
  - Partition table by year if > 100k rows

## Missing Critical Features

**No authentication/authorization:**
- Problem: No user login; all data is public and any endpoint can modify any ship
- Files: `app/api/ships/route.ts`, `app/api/upload/route.ts`
- Blocks: Multi-user support, private logs, data ownership
- Recommendation: Implement Supabase Auth + RLS policies to isolate user data

**No rate limiting:**
- Problem: Can submit unlimited ships or upload unlimited images
- Files: `app/api/ships/route.ts`, `app/api/upload/route.ts`
- Impact: Spam, DoS attacks, storage exhaustion
- Recommendation: Add server-side rate limiting (e.g., 10 ships/hour per IP)

**No image deletion:**
- Problem: Ships can't be edited or deleted; orphaned images accumulate
- Files: No DELETE endpoint, no edit UI
- Impact: Can't fix mistakes, storage waste
- Recommendation:
  - Add PATCH `/api/ships/:id` for updates
  - Add DELETE `/api/ships/:id` for deletion
  - Cascade delete to storage when ship deleted

**No offline support:**
- Problem: Page requires constant network; failed submission loses form data
- Files: `components/SubmitShipModal.tsx`
- Impact: Poor UX on poor connectivity
- Recommendation: Add localStorage draft saving on form change

## Testing Gaps

**No automated tests:**
- What's not tested: API validation, date parsing, heatmap calculations, streak logic, upload error handling
- Files: Entire project lacks test files
- Risk:
  - Invalid dates silently break streak calculation
  - API accepts malformed data
  - Heatmap grid renders incorrectly on edge cases
  - Modal state corruption on repeated open/close
- Priority: High - critical business logic has no coverage

## Dependencies at Risk

**Supabase JS v2.49.1:**
- Risk: Near end-of-life; v3 available with breaking changes
- Migration plan: Upgrade carefully; check Auth, PostgREST, Storage client changes

**Next.js 16.1.6 with Turbopack:**
- Risk: Turbopack is experimental; build issues possible
- Current: Works but `next.config.ts` requires manual `turbopack.root` workaround
- Migration: Monitor for Turbopack stability improvements

## Hardcoded Values

**Avatar initial hardcoded:**
- Problem: `app/page.tsx` line 46 shows hardcoded "A" instead of user initial
- Files: `app/page.tsx` (line 46)
- Impact: Not personalized; blocks multi-user support
- Recommendation: Replace with dynamic user name from auth context

**Heatmap hardcoded to 52 weeks:**
- Problem: `components/Heatmap.tsx` line 11 hardcodes WEEKS=52, but code says "2025 Shipping" in `app/page.tsx` line 53
- Files: `components/Heatmap.tsx`, `app/page.tsx`
- Impact: Year label is outdated; heatmap grid won't adjust dynamically
- Recommendation: Make year/duration configurable; update year label to current year

**Color palette in multiple places:**
- Problem: Heatmap colors hardcoded in component instead of using Tailwind tokens
- Files: `components/Heatmap.tsx` (lines 14-18, 116-118)
- Impact: Colors not consistent if palette changes; difficult to maintain
- Recommendation: Define color stops in `tailwind.config.ts` and reference via token

---

*Concerns audit: 2026-03-04*
