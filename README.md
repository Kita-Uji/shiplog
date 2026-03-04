# shiplog

A personal shipping tracker. Log what you build, visualise your output over time.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-v2-green?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square)

## Features

- **52-week heatmap** — GitHub-style activity grid showing shipping frequency
- **Stats bar** — total ships, active days, and current streak at a glance
- **Full feed** — scrollable log of every ship with screenshots, dates, and links
- **Submit modal** — log a new ship with title, details, optional screenshot, and optional link
- **Delete** — remove a ship from the log with a confirmation dialog
- **Hash navigation** — clicking a ship on the home screen scrolls directly to it in the feed

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |

## Getting started

### 1. Clone the repo

```bash
git clone https://github.com/Kita-Uji/shiplog.git
cd shiplog
npm install
```

### 2. Create a Supabase project

Go to [supabase.com](https://supabase.com), create a new project, then run the following SQL in the **SQL Editor**:

```sql
create table ships (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  details text,
  ship_date date not null,
  screenshot_url text,
  link_url text,
  created_at timestamptz default now()
);
```

Then create a **Storage bucket** named `screenshots` and set it to **public**.

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

All three values are found in your Supabase project under **Settings → API**.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  page.tsx              # Home — heatmap, stats, recent ships
  feed/page.tsx         # Full ship feed
  api/
    ships/route.ts      # GET all ships, POST new ship
    ships/[id]/route.ts # DELETE ship by id
    upload/route.ts     # POST screenshot to Supabase Storage
components/
  Heatmap.tsx           # 52-week activity grid
  StatsBar.tsx          # Total / active days / streak
  ShipCard.tsx          # Individual ship card
  RecentShips.tsx       # Last N ships on home screen
  SubmitShipModal.tsx   # New ship form
  DeleteShipDialog.tsx  # Delete confirmation dialog
lib/
  supabase.ts           # Browser + server Supabase clients
types/
  ship.ts               # Ship interface
```
