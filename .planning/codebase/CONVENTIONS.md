# Coding Conventions

**Analysis Date:** 2026-03-04

## Naming Patterns

**Files:**
- React components: PascalCase (`ShipCard.tsx`, `SubmitShipModal.tsx`)
- Utilities and modules: camelCase (`supabase.ts`)
- API routes: folder-based naming convention (`api/ships/route.ts`, `api/upload/route.ts`)
- Page files: lowercase (`page.tsx` for route segments, `layout.tsx` for layouts)

**Functions:**
- camelCase for all functions: `getSupabase()`, `handleFileChange()`, `fetchShips()`, `createServerClient()`
- Event handlers: `handle[EventName]` pattern (`handleSubmit()`, `handleFileChange()`)

**Variables:**
- camelCase for all variables: `ships`, `loading`, `modalOpen`, `imagePreview`, `lastMonth`
- State variables: descriptive names like `submitting`, `error`, `imageFile`, `fileInputRef`
- Constants: UPPERCASE_SNAKE_CASE for module-level constants (e.g., `WEEKS = 52`)

**Types:**
- PascalCase for interfaces: `Ship`
- Props interfaces: `Props` (standardized name, see `ShipCard.tsx` line 5)
- Type imports: `import type { Ship } from "@/types/ship"`

## Code Style

**Formatting:**
- No explicit linting/formatting config detected (no `.eslintrc`, `.prettierrc`, or `biome.json`)
- TypeScript strict mode enabled (`"strict": true` in `tsconfig.json`)
- Code follows consistent 2-space indentation
- Components use default exports: `export default function ComponentName()`

**Linting:**
- TypeScript strict mode enforced
- `skipLibCheck: true` to speed up type checking
- `isolatedModules: true` prevents cross-file type-only issues
- JSX set to `react-jsx` (Next.js 13+ automatic JSX transformation)

## Import Organization

**Order:**
1. React/Next.js imports (e.g., `import { useState } from "react"`)
2. Next.js components and utilities (e.g., `import Link from "next/link"`)
3. Local utilities and lib (e.g., `import { createServerClient } from "@/lib/supabase"`)
4. Local components (e.g., `import ShipCard from "@/components/ShipCard"`)
5. Type imports (e.g., `import type { Ship } from "@/types/ship"`)

See examples in:
- `app/page.tsx` (lines 1-9)
- `components/ShipCard.tsx` (lines 1-3)
- `app/api/ships/route.ts` (lines 1-2)

**Path Aliases:**
- `@/*` alias configured in `tsconfig.json` for absolute imports from project root
- Used consistently throughout: `@/lib/supabase`, `@/components/ShipCard`, `@/types/ship`

## Error Handling

**Patterns:**
- Try-catch blocks with error string coercion: `String(err)` (see `app/page.tsx` line 21-22, `app/api/ships/route.ts` line 14-15)
- API routes return error responses: `NextResponse.json({ error: String(err) }, { status: 500 })`
- Component-level error state: `error` state variable with display to user (see `SubmitShipModal.tsx` lines 20, 70, 180)
- Silent catch blocks in some client-side data fetches: `catch { setShips([]) }` (see `app/feed/page.tsx` lines 18-19)
- Validation before operations: Check required fields before processing (e.g., `app/api/ships/route.ts` lines 24-26)

**Error Messages:**
- User-facing messages stored in component state
- Descriptive error strings for validation: `"title is required"`
- Server responses wrap errors as JSON

## Logging

**Framework:** No explicit logging framework detected. Uses `console` implicitly via error handling.

**Patterns:**
- Errors are caught and converted to strings via `String(err)`
- No debug logging observed
- Focus on error reporting rather than verbose logging

## Comments

**When to Comment:**
- Minimal comments in production code
- Strategic comments for non-obvious logic:
  - Date calculation logic: `// Start of the grid: go back 52 weeks from the Sunday of current week` (`components/Heatmap.tsx` line 32)
  - Configuration purposes: `// Browser client (uses anon key) — lazy singleton` (`lib/supabase.ts` line 5)
  - Business logic: `// Current streak: consecutive days ending today (or yesterday) with ≥1 ship` (`components/StatsBar.tsx` line 15)

**JSDoc/TSDoc:**
- Not used in this codebase
- Type annotations provide sufficient documentation

## Function Design

**Size:**
- Functions are kept small and focused
- Components typically 50-200 lines including JSX
- Utility functions 10-50 lines

**Parameters:**
- Use destructuring for props: `export default function ShipCard({ ship, truncate = true }: Props)` (see `ShipCard.tsx` line 10)
- Default parameters for optional values: `limit = 3` in `RecentShips.tsx`
- Props always typed via interface

**Return Values:**
- Functions return typed values (React components, NextResponse objects, etc.)
- API route handlers always return `NextResponse` objects
- Component functions return JSX.Element implicitly
- Utility functions return `void` for callbacks or specific types for data functions

## Module Design

**Exports:**
- Default exports for components and page routes
- Named exports for utilities: `export function getSupabase()`, `export function createServerClient()` (see `lib/supabase.ts`)
- Type exports: `export interface Ship` (see `types/ship.ts`)
- Convenience re-export: `export const supabase = { get client() { ... } }` for lazy-loaded browser client

**Barrel Files:**
- Not used in this codebase
- Direct imports from specific files preferred

## Styling Conventions

**Tailwind CSS:**
- All styling uses Tailwind utility classes
- Custom color palette defined in `tailwind.config.ts`: `ship-bg`, `ship-card`, `ship-border`, `ship-text`, `ship-accent`, `ship-accent-dark`
- Inline class strings used directly in components (no className helpers)
- Responsive classes used minimally (focus is on mobile-first design)
- Custom keyframe animations in `globals.css` referenced as class (e.g., `.animate-slide-up`)

See example in `app/page.tsx` (lines 35-48) for consistent className usage pattern.

## Async/Await Patterns

**Async Functions:**
- Used for all async operations: `async function handleSubmit()`, `async function fetchShips()`
- Error handling in try-catch blocks
- Finally blocks used to update loading states

**API Calls:**
- Fetch API used directly, no abstraction layer
- Standard JSON serialization with headers when needed
- Form data for file uploads: `new FormData()` with append

---

*Convention analysis: 2026-03-04*
