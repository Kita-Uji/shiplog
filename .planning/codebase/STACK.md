# Technology Stack

**Analysis Date:** 2026-03-04

## Languages

**Primary:**
- TypeScript 5 - All application code (`.ts` and `.tsx` files)
- JSX/TSX - React components and pages

**Secondary:**
- JavaScript - Configuration files (PostCSS)

## Runtime

**Environment:**
- Node.js (version specified implicitly via Next.js 16 requirements)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- Next.js 16.1.6 - Full-stack React framework with App Router and Turbopack
  - App Router enabled (no pages directory)
  - Turbopack enabled for builds
- React 19.0.0 - UI library
- React DOM 19.0.0 - React rendering to DOM

**Styling:**
- Tailwind CSS 3.4.1 - Utility-first CSS framework with custom color palette
- PostCSS 8 - CSS transformation tool
- Autoprefixer 10.4.27 - Vendor prefixing for CSS

**Date Handling:**
- date-fns 4.1.0 - Modular date utility library (used for date formatting)

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` 2.49.1 - PostgreSQL database and file storage client
  - Used for database queries and authentication
  - File storage for screenshots in Supabase Storage

**Build/Development:**
- TypeScript 5 - Type checking
- @types/react 19 - React type definitions
- @types/react-dom 19 - React DOM type definitions
- @types/node 20 - Node.js type definitions
- Tailwind CSS 3.4.1 - CSS framework
- PostCSS 8 - CSS processing
- Autoprefixer 10.4.27 - CSS vendor prefixing

## Configuration

**Environment:**
- `.env.local` file required with:
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public, safe for browser)
  - `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (secret, server-only)

**Build:**
- `next.config.ts` - Next.js configuration with Turbopack settings and image remote patterns
  - Turbopack root explicitly set to project root
  - Remote image patterns configured for Supabase Storage (`*.supabase.co`)
- `tsconfig.json` - TypeScript compiler options
  - Strict mode enabled
  - Path alias: `@/*` points to project root
  - Target: ES2017
- `tailwind.config.ts` - Tailwind CSS theme customization
  - Custom colors: ship-bg, ship-card, ship-border, ship-text, ship-accent, ship-accent-dark
- `postcss.config.mjs` - PostCSS plugin configuration
  - Tailwind CSS and Autoprefixer plugins enabled

## Platform Requirements

**Development:**
- Node.js (modern version)
- npm (included with Node.js)
- .env.local file with Supabase credentials
- Supabase project setup with database and Storage bucket

**Production:**
- Deployment target: Vercel (Next.js native) or any Node.js-capable platform
- Environment variables required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Supabase project (cloud-hosted PostgreSQL and Storage)

---

*Stack analysis: 2026-03-04*
