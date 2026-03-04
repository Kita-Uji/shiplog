# Architecture

**Analysis Date:** 2026-03-04

## Pattern Overview

**Overall:** Next.js 16 App Router with client-side state management and API route layer

**Key Characteristics:**
- Full-stack JavaScript with TypeScript strict mode
- Server-side data fetching via API routes (Next.js server functions)
- Client-side components using React 19 with hooks
- Supabase as backend (PostgreSQL database + object storage)
- Stateless API design with no auth currently required (public access)
- Responsive mobile-first UI with Tailwind CSS 3

## Layers

**Presentation Layer (Client):**
- Purpose: Render UI, manage user interactions, local state
- Location: `components/` and pages (`app/page.tsx`, `app/feed/page.tsx`)
- Contains: React components, client-side hooks, modals, forms
- Depends on: API routes (`/api/ships`, `/api/upload`)
- Used by: End users through browser

**API Layer (Server):**
- Purpose: Handle HTTP requests, delegate to Supabase, return JSON
- Location: `app/api/` (Next.js API routes)
- Contains: GET/POST handlers for ships and file uploads
- Depends on: Supabase client library, database/storage
- Used by: Client components via fetch calls

**Data Access Layer:**
- Purpose: Initialize and provide Supabase clients
- Location: `lib/supabase.ts`
- Contains: Lazy browser client, server client factory
- Depends on: @supabase/supabase-js
- Used by: API routes and (optionally) client components

**Domain Models:**
- Purpose: Type definitions for core entities
- Location: `types/ship.ts`
- Contains: Ship interface
- Depends on: Nothing (pure TypeScript)
- Used by: All layers that reference ships

## Data Flow

**Reading Ships (Home/Feed):**

1. User loads `app/page.tsx` or `/feed/page.tsx` (client component)
2. useEffect triggers `fetch("/api/ships")`
3. GET handler in `app/api/ships/route.ts` creates server client
4. Supabase retrieves all ships from `ships` table ordered by `ship_date DESC`
5. Ships array returned as JSON
6. Client stores in useState, renders via Heatmap, StatsBar, RecentShips, or ShipCard
7. Tooltip/filtering happens client-side with useMemo

**Creating a Ship (SubmitShipModal):**

1. User fills form in `components/SubmitShipModal.tsx`
2. On submit: if image exists, POST to `/api/upload`
3. Upload handler in `app/api/upload/route.ts`:
   - Receives FormData with file
   - Creates unique filename with timestamp + random string
   - Uploads to Supabase Storage `screenshots` bucket
   - Returns public URL
4. Then POST ship metadata to `/api/ships` with optional screenshot_url
5. Ships POST handler inserts into `ships` table
6. onSuccess callback refetches ships list via GET

**State Management:**
- **Home/Feed pages:** useState for ships[], loading, filter/modal
- **Components:** Props-based (ships array passed down), no shared state store
- **Modal interaction:** Callback functions (onClose, onSuccess) for state lifting
- **Heatmap/Stats:** useMemo for expensive aggregations

## Key Abstractions

**Ship Entity:**
- Purpose: Represents a logged build/deployment
- Examples: `types/ship.ts`
- Pattern: TypeScript interface, not a class
- Fields: id, title, details, ship_date, screenshot_url, link_url, created_at

**Supabase Client Factory:**
- Purpose: Abstract initialization of authenticated clients
- Examples: `lib/supabase.ts`
- Pattern: Lazy singleton for browser, factory function for server
- Why lazy: Avoid build-time environment variable resolution

**Heatmap Grid:**
- Purpose: Calculate and render 52-week activity visualization
- Examples: `components/Heatmap.tsx`
- Pattern: useMemo to compute grid structure once, tooltip state for interaction
- Input: ships array
- Output: week columns with day-level counts

**Stats Bar:**
- Purpose: Compute summary metrics (total, active days, streak)
- Examples: `components/StatsBar.tsx`
- Pattern: useMemo for pure calculation, display components extract
- Calculations: total ships, unique dates, consecutive day streak

## Entry Points

**Web Application Root:**
- Location: `app/layout.tsx`
- Triggers: Server startup, all page requests
- Responsibilities: Set metadata, wrap children in root div with max-width and padding

**Home Page:**
- Location: `app/page.tsx`
- Triggers: GET /
- Responsibilities: Orchestrate fetching ships, display heatmap/stats/recent/modal

**Feed Page:**
- Location: `app/feed/page.tsx`
- Triggers: GET /feed
- Responsibilities: Fetch ships, display full list with all/screenshot filter

**Ships API Endpoint:**
- Location: `app/api/ships/route.ts`
- Triggers: GET /api/ships (fetch list), POST /api/ships (create)
- Responsibilities: Database CRUD for ships table

**Upload API Endpoint:**
- Location: `app/api/upload/route.ts`
- Triggers: POST /api/upload
- Responsibilities: Handle image file upload to Supabase Storage

## Error Handling

**Strategy:** Try-catch blocks at API routes, error state in components

**Patterns:**
- API routes: catch all errors, return NextResponse.json({ error: String(err) }, { status: 500 })
- Client components: catch fetch errors, setError state or default to empty arrays
- Modal form: catch and display error message in UI, prevent submit while submitting
- Fallback rendering: "No ships yet" message if ships array empty or load fails

**Validation:**
- POST /api/ships requires title field (400 Bad Request if missing)
- Client validates title before submit
- No client-side URL validation (link_url is optional, user paste responsibility)

## Cross-Cutting Concerns

**Logging:** Not detected. Errors are caught but not logged to external service.

**Validation:**
- Input validation at API layer (title required for ships)
- Client-side form validation (title required)
- No schema validation library (raw next.request.json())

**Authentication:** Not present. All endpoints public (read and write). Relies on Supabase API key security.

**Styling:** Tailwind CSS utility classes throughout. Custom ship-* color tokens defined in tailwind.config.ts and globals.css.

**Date handling:** date-fns library for formatting and calculations. ISO date strings (YYYY-MM-DD) for storage/transport.

---

*Architecture analysis: 2026-03-04*
