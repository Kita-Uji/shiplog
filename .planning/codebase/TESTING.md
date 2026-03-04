# Testing Patterns

**Analysis Date:** 2026-03-04

## Test Framework

**Runner:**
- Not detected - no test framework configured
- No test files found in codebase (searched for `*.test.ts*`, `*.spec.ts*`)
- `package.json` contains no test-related dependencies

**Assertion Library:**
- Not applicable

**Run Commands:**
```bash
npm run dev              # Development server
npm run build            # TypeScript and Next.js build
npm start                # Production server
```

Note: No test commands available. Build command validates TypeScript with `"noEmit": true`.

## Test File Organization

**Location:**
- No test files detected
- Testing infrastructure not implemented

**Naming:**
- Not applicable

**Structure:**
- Not applicable

## Test Types

**Unit Tests:**
- Not implemented

**Integration Tests:**
- Not implemented

**E2E Tests:**
- Not implemented

## Test Coverage

**Requirements:** Not enforced

**View Coverage:**
- Not available

## Code Quality Assurance

**Build-Time Validation:**
```bash
npm run build
```
This validates:
- TypeScript compilation with strict mode (`"strict": true`)
- Next.js build with Turbopack
- No runtime errors before deployment

**Manual Testing Approach:**

The codebase follows these patterns for reliability without automated tests:

**Type Safety:**
- Strict TypeScript enabled (`tsconfig.json`)
- Interfaces for all data types (`Ship`, `Props`)
- Type imports for all custom types
- Reduces runtime errors at compile time

**Error Handling:**
- Try-catch in all async operations (`api/ships/route.ts`, `app/page.tsx`)
- Error state management in components (`SubmitShipModal.tsx` line 20)
- Validation before database operations (`api/ships/route.ts` lines 24-26)

**Data Validation:**
- Input validation before processing:
  - Required field check: `if (!title) return error` (`api/ships/route.ts` line 24)
  - Trim and null-coalesce: `details.trim() || null` (`SubmitShipModal.tsx` line 60)
  - Type checking on arrays: `Array.isArray(data)` (`app/page.tsx` line 20)

**Component Design:**
- Props interfaces enforce type safety (`ShipCard.tsx` lines 5-8)
- Default props prevent undefined values: `truncate = true` (`ShipCard.tsx` line 10)
- Safe optional chaining: `e.target?.result`, `e.dataTransfer.files[0] ?? null`

**State Management:**
- Clear state initialization with typed defaults (`useState<Ship[]>([])`)
- Callback dependencies in useEffect (`useCallback` with explicit dependencies)
- Proper cleanup in finally blocks for loading states

**Example: SubmitShipModal.tsx error handling (lines 31-74)**
```typescript
async function handleSubmit(e: FormEvent) {
  e.preventDefault();
  if (!title.trim()) {
    setError("Title is required");
    return;
  }
  setSubmitting(true);
  setError(null);

  try {
    // Validation and processing
    if (imageFile) {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("Image upload failed");
    }

    const shipRes = await fetch("/api/ships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({...}),
    });
    if (!shipRes.ok) throw new Error("Failed to save ship");

    onSuccess();
  } catch (err) {
    setError(String(err));
  } finally {
    setSubmitting(false);
  }
}
```

## Recommended Testing Approach

If testing framework is added:

**Suggested Framework:** vitest (lightweight, works with TypeScript, fast)

**Configuration:**
- Config file: `vitest.config.ts`
- Test files co-located with source: `Component.test.tsx` next to `Component.tsx`

**Test File Pattern:**
```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ShipCard from "@/components/ShipCard";

describe("ShipCard", () => {
  it("renders ship title", () => {
    const ship = { id: "1", title: "Test", ship_date: "2026-03-04", /* ... */ };
    render(<ShipCard ship={ship} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
```

**Priority Tests:**
1. Data fetching logic (`app/page.tsx`, `app/feed/page.tsx`)
2. Form submission (`SubmitShipModal.tsx`)
3. API routes (`app/api/ships/route.ts`, `app/api/upload/route.ts`)
4. Complex calculations (`components/Heatmap.tsx` grid generation, `components/StatsBar.tsx` streak logic)

---

*Testing analysis: 2026-03-04*
