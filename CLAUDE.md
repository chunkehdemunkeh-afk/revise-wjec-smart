# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install          # install dependencies
bun run dev          # start dev server
bun run build        # production build (Cloudflare Workers target)
bun run lint         # eslint
bun run format       # prettier
```

There are no tests. Deploy edge functions with the Supabase CLI:

```bash
supabase link --project-ref YOUR_REF
supabase functions deploy gradeAnswer
supabase functions deploy generateFlashcards
supabase functions deploy suggestNextSession
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

## Architecture

**Frontend**: TanStack Start (SSR React) + Vite, deployed to Cloudflare Workers via `@cloudflare/vite-plugin`. `wrangler.jsonc` points at `src/server.ts` as the worker entry.

**Backend**: Supabase (auth + Postgres). Three Deno-based Edge Functions in `supabase/functions/` call `claude-sonnet-4-20250514` via the Anthropic API.

### Critical: vite.config.ts

`@lovable.dev/vite-tanstack-config` already bundles TanStack Start, React, Tailwind, tsconfig paths, Cloudflare, and other plugins. **Do not add any of these manually** — duplicates will break the build. Only pass extra config through `defineConfig({ vite: { ... } })`.

Lovable's config handles `VITE_*` env injection from `.env`. **Do not set `envDefine: false`** — it disables this and causes the Supabase client to fall back to `http://localhost`.

### Routing

TanStack Router with file-based routes. **`src/routeTree.gen.ts` is auto-generated — never edit the route tree section.** The SSR type registration block at the bottom of the file is intentional and should be preserved. Routes live in `src/routes/`:

- `__root.tsx` — root layout; wraps everything in `AuthProvider` and renders `AppHeader`
- `_authenticated.tsx` — layout that redirects unauthenticated users to `/login`
- `_authenticated/` — all protected routes (subjects, topics, progress)
- `index.tsx`, `login.tsx`, `signup.tsx` — public routes

### Data & Auth

- `src/lib/supabase.ts` — Supabase client (reads `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) + shared TypeScript types for all DB tables
- `src/lib/auth.tsx` — `AuthProvider` + `useAuth()` hook; provides `user`, `session`, `loading`, `signIn`, `signUp`, `signOut`
- `src/lib/ai.ts` — thin wrappers around `supabase.functions.invoke()` for the three edge functions

### Database schema

Migrations in `db/` must be run in order in the Supabase SQL Editor:

1. `0001_init.sql` — creates all tables + RLS policies
2. `0002_seed.sql` — 2 subjects, 139 Maths topics, 5 Biology topics, seeded notes/questions/flashcards for CORE topics
3. `0003_align_schema.sql` — renames `flashcards.front→question`, `flashcards.back→answer`, adds `flashcards.created_at`; renames `user_progress.confidence_score→confidence_level`, adds `user_progress.score` and `visit_count`

Key column names post-migration: `flashcards(question, answer)`, `user_progress(confidence_level, score, visit_count)`.

**Note**: The TypeScript interfaces in `src/lib/supabase.ts` (`Flashcard`, `UserProgress`) still use the pre-migration names (`front`/`back`, `confidence_score`). Update them if you touch those types.

### Edge Functions

All three live in `supabase/functions/` and run as Deno. Import Supabase JS from `jsr:@supabase/supabase-js@2`. They use `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (auto-injected by Supabase — not needed in secrets) and `ANTHROPIC_API_KEY` (must be set via `supabase secrets set`).

- `gradeAnswer` — grades a student answer against a mark scheme; returns `{marks_awarded, what_was_good, what_was_missing, model_answer_hint}`
- `generateFlashcards` — generates 8-10 flashcards from notes content and saves them to the `flashcards` table
- `suggestNextSession` — deterministic query on `user_progress` (lowest `confidence_level`, oldest `last_visited_at`); falls back to first CORE topic for new users

### Styling

Dark-mode only (`<html class="dark">`). Design tokens in `src/styles.css`: background `#0F172A`, card `#1E293B`, primary teal `#14B8A6`. Priority badges: CORE = green (`#10B981`), COMMON = amber (`#F59E0B`), MODERATE = slate. shadcn/ui components are in `src/components/ui/`.

## Environment

Copy `.env.example` → `.env` and fill in:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```
