# External Integrations

**Analysis Date:** 2026-03-04

## APIs & External Services

**Supabase (Primary Backend):**
- PostgreSQL database via Supabase
  - SDK/Client: `@supabase/supabase-js` v2.49.1
  - Auth: `NEXT_PUBLIC_SUPABASE_ANON_KEY` (browser client), `SUPABASE_SERVICE_ROLE_KEY` (server-only)
  - Provides REST API for database operations

## Data Storage

**Databases:**
- PostgreSQL via Supabase
  - Connection: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (browser) or `SUPABASE_SERVICE_ROLE_KEY` (server)
  - Client: Supabase JS SDK (`createClient()` from `@supabase/supabase-js`)
  - Tables: `ships` (main data table)
  - Database operations: `lib/supabase.ts` exports `getSupabase()` and `createServerClient()`

**File Storage:**
- Supabase Storage
  - Bucket: `screenshots` (public bucket)
  - Used for: Ship screenshot images
  - Access: Via Supabase JS SDK's `.storage` API
  - Upload endpoint: `app/api/upload/route.ts` (POST)
  - File naming: `[timestamp]-[random].ext` (prevents collisions)
  - Public URL retrieval: Via `getPublicUrl()` after upload
  - Image optimization: Next.js Image component configured to accept `*.supabase.co` remote images

**Caching:**
- None explicit (relies on Next.js caching and browser cache headers)

## Authentication & Identity

**Auth Provider:**
- Supabase Auth (implicit, no explicit auth implementation)
  - Implementation: Row-level security (RLS) likely configured in Supabase
  - Browser client uses anon key with RLS policies
  - Server client uses service role key for elevated permissions (admin operations)
  - Session persistence: Disabled on server client (`persistSession: false`)

## Monitoring & Observability

**Error Tracking:**
- Not detected (errors logged to response only)

**Logs:**
- Basic error handling: Caught exceptions returned as JSON error responses
- No centralized logging service integrated

## CI/CD & Deployment

**Hosting:**
- Designed for Vercel or similar Node.js platform
- Next.js native support for serverless deployment

**CI Pipeline:**
- Not detected (no GitHub Actions, GitLab CI, or similar)

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public, safe for browser)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public, safe for browser)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (secret, server-only)

**Secrets location:**
- `.env.local` file (development)
- Deployment platform environment variables (production)
- Note: `.env.local` listed in `.gitignore` to prevent credential leakage

## Database Operations

**Ships Table Structure** (inferred from API and types):
- `id` - UUID primary key
- `title` - Ship name/title (required)
- `details` - Ship description (nullable)
- `ship_date` - Date of ship (YYYY-MM-DD format)
- `screenshot_url` - URL to screenshot image (nullable)
- `link_url` - URL to ship details/project (nullable)
- `created_at` - Timestamp of creation (auto-generated)

**API Endpoints:**

1. **GET `/api/ships`** - Fetch all ships
   - File: `app/api/ships/route.ts`
   - Returns: Array of Ship objects, ordered by `ship_date` descending
   - Authentication: Service role key (server-only)
   - Error: Returns 500 with error message

2. **POST `/api/ships`** - Create new ship
   - File: `app/api/ships/route.ts`
   - Request body: `{ title, details?, ship_date?, screenshot_url?, link_url? }`
   - Returns: Created Ship object with 201 status
   - Validation: `title` required
   - Authentication: Service role key (server-only)
   - Error: Returns 400 (missing title) or 500 (database error)

3. **POST `/api/upload`** - Upload screenshot image
   - File: `app/api/upload/route.ts`
   - Request: FormData with `file` field
   - Returns: `{ url: publicUrl }` where publicUrl is public Supabase URL
   - Bucket: `screenshots` in Supabase Storage
   - File naming: `[timestamp]-[randomString].[extension]`
   - Error: Returns 400 (no file) or 500 (storage error)

## Webhooks & Callbacks

**Incoming:**
- Not detected

**Outgoing:**
- Not detected

## Cross-Origin & Image Handling

**Next.js Image Remote Patterns:**
- Configured in `next.config.ts` to allow images from `*.supabase.co/storage/v1/object/public/**`
- Used by Next.js Image component for optimization

---

*Integration audit: 2026-03-04*
