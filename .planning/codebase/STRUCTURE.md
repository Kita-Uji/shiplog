# Codebase Structure

**Analysis Date:** 2026-03-04

## Directory Layout

```
shiplog/
├── app/
│   ├── api/
│   │   ├── ships/
│   │   │   └── route.ts          # GET all ships, POST new ship
│   │   └── upload/
│   │       └── route.ts          # POST image file to Supabase Storage
│   ├── feed/
│   │   └── page.tsx              # Full feed with filtering
│   ├── layout.tsx                # Root layout (metadata, container)
│   ├── page.tsx                  # Home page (heatmap, stats, recent)
│   └── globals.css               # Global styles, tailwind directives, animations
├── components/
│   ├── Heatmap.tsx               # 52-week activity grid with tooltip
│   ├── RecentShips.tsx           # Display last N ships using ShipCard
│   ├── ShipCard.tsx              # Card with screenshot, metadata, link
│   ├── StatsBar.tsx              # Total/active/streak stats display
│   └── SubmitShipModal.tsx       # Bottom-sheet form for new ship
├── lib/
│   └── supabase.ts               # Lazy browser client, server client factory
├── types/
│   └── ship.ts                   # Ship interface definition
├── next.config.ts                # Next.js config (Turbopack, image remotes)
├── tailwind.config.ts            # Tailwind config with ship-* colors
├── tsconfig.json                 # TypeScript compiler config, @ path alias
├── package.json                  # Dependencies (Next.js, React, Supabase, date-fns)
├── .env.local                    # Environment variables (Supabase URL, keys)
└── .next/                        # Build output (not committed)
```

## Directory Purposes

**`app/`:**
- Purpose: Next.js 16 App Router structure (pages and API routes)
- Contains: Page components, API route handlers, root layout
- Key files: `page.tsx` (home), `layout.tsx` (root), `api/` (endpoints)

**`app/api/`:**
- Purpose: Server-side API endpoints (Route Handlers)
- Contains: GET/POST handlers for ships and file uploads
- Key files: `ships/route.ts` (ships CRUD), `upload/route.ts` (image upload)

**`components/`:**
- Purpose: Reusable React components
- Contains: UI components, modals, charts
- Key files: Page-level composition in `Heatmap.tsx`, `StatsBar.tsx`, `RecentShips.tsx`, form in `SubmitShipModal.tsx`

**`lib/`:**
- Purpose: Shared utilities and clients
- Contains: Supabase client initialization
- Key files: `supabase.ts` (browser + server clients)

**`types/`:**
- Purpose: TypeScript type definitions
- Contains: Domain model interfaces
- Key files: `ship.ts` (Ship interface)

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root layout, metadata, responsive container wrapper
- `app/page.tsx`: Home page entry point, orchestrates data fetch and UI
- `app/feed/page.tsx`: Feed page entry point, full ship list with filter

**Configuration:**
- `tsconfig.json`: TypeScript settings, @ path alias to root
- `tailwind.config.ts`: Tailwind theme with ship-* custom colors
- `next.config.ts`: Image remotes (Supabase), Turbopack root
- `package.json`: Dependencies and scripts (dev, build, start)
- `app/globals.css`: Global styles, Tailwind directives, slide-up animation

**Core Logic:**
- `app/api/ships/route.ts`: Ships database queries (GET all, POST new)
- `app/api/upload/route.ts`: File upload to Supabase Storage
- `lib/supabase.ts`: Supabase client initialization (browser + server)
- `types/ship.ts`: Ship data structure

**UI Components:**
- `components/Heatmap.tsx`: 52-week grid visualization
- `components/StatsBar.tsx`: Statistics display (total, active days, streak)
- `components/ShipCard.tsx`: Ship card with screenshot, date, title, link
- `components/RecentShips.tsx`: Wrapper around ShipCard for recent ships list
- `components/SubmitShipModal.tsx`: Bottom-sheet form modal for new ship submission

## Naming Conventions

**Files:**
- Page routes: `page.tsx` (Next.js convention)
- API routes: `route.ts` (Next.js convention)
- Components: PascalCase (e.g., `ShipCard.tsx`, `SubmitShipModal.tsx`)
- Utilities: camelCase (e.g., `supabase.ts`)
- Types: kebab-case filename, export named type (e.g., `ship.ts` exports `Ship`)

**Directories:**
- App Router: `app/` (Next.js convention, lowercase)
- Components: `components/` (lowercase, plural)
- Utilities: `lib/` (lowercase, conventional)
- Types: `types/` (lowercase, plural)
- API routes: `app/api/[resource]/route.ts` (kebab-case resource names)

**Variables & Functions:**
- React components: PascalCase (e.g., `Home`, `Heatmap`, `ShipCard`)
- Hooks: camelCase starting with `use` (e.g., `useCallback`, `useState`)
- Regular functions: camelCase (e.g., `getCellColor`, `handleFileChange`)
- Constants: UPPER_SNAKE_CASE (e.g., `WEEKS = 52`)
- Props interfaces: named Props or generic name (e.g., `interface Props { ships: Ship[] }`)

**Types:**
- Domain models: PascalCase (e.g., `Ship`)
- Type suffixes: None (not "ShipType"), just `Ship`

## Where to Add New Code

**New Feature (e.g., user authentication):**
- Primary code: `lib/auth.ts` (client factory)
- API changes: Add middleware in API routes
- UI: Add login component in `components/`
- Types: Extend `types/` if new domain models

**New Page:**
- Implementation: `app/[name]/page.tsx` (create folder, add page.tsx)
- Layout overrides: `app/[name]/layout.tsx` if unique structure
- Add navigation link in existing pages (e.g., bottom nav in `page.tsx`, `feed/page.tsx`)

**New Component:**
- Implementation: `components/[ComponentName].tsx` (PascalCase)
- Props interface: Define `interface Props { ... }` at top of file
- Usage: Import and use in pages or other components

**New API Endpoint:**
- Implementation: `app/api/[resource]/route.ts`
- HTTP methods: Export `GET`, `POST`, etc. as named exports
- Error handling: Wrap in try-catch, return NextResponse.json({ error: String(err) }, { status: 500 })
- Supabase access: Use `createServerClient()` from `lib/supabase.ts`

**Utilities (helpers, clients, services):**
- Shared utilities: `lib/[name].ts`
- Convention: Export named functions/constants, not default export
- Example: `getSupabase()`, `createServerClient()` in `lib/supabase.ts`

**Types:**
- New domain models: `types/[entity].ts` (e.g., `types/ship.ts`)
- Export as named type: `export interface Ship { ... }`
- Keep types pure (no logic, no imports from non-type modules)

## Special Directories

**`.next/`:**
- Purpose: Build output and cache
- Generated: Yes (created by `npm run build` and `npm run dev`)
- Committed: No (in .gitignore)
- Contains: Compiled pages, API routes, .env.d.ts types

**`node_modules/`:**
- Purpose: Installed dependencies
- Generated: Yes (created by npm install)
- Committed: No (in .gitignore)

**`.planning/codebase/`:**
- Purpose: GSD mapping documents (architecture, testing, conventions, concerns)
- Generated: No (hand-written analysis)
- Committed: Yes
- Contains: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, STACK.md, INTEGRATIONS.md, CONCERNS.md

## Key Import Patterns

**Path Alias:**
- `@/` resolves to project root (configured in tsconfig.json)
- Usage: `import Component from "@/components/Heatmap"`
- Never use relative imports (e.g., `../../../components`)

**Type Imports:**
- `import type { Ship } from "@/types/ship"` (type-only import)
- Used when only types are needed, no runtime value

**React Imports:**
- `import { useState, useEffect, useMemo, useCallback } from "react"`
- `import { useClient }` is Next.js 16 directive (if needed for client-only)

**Third-party:**
- `import { format, subDays, parseISO } from "date-fns"` (date utilities)
- `import Image from "next/image"` (optimized image component)
- `import Link from "next/link"` (client-side navigation)

---

*Structure analysis: 2026-03-04*
