# ReviseWJEC — Setup

Dark, mobile-first GCSE revision app for WJEC Maths (Intermediate Unit 1) and Biology.

## 1. Connect Supabase

1. Create a new project at https://supabase.com.
2. Copy `.env.example` → `.env` and fill in your project URL + anon key.
3. In the Supabase SQL Editor, run **`db/0001_init.sql`** then **`db/0002_seed.sql`**.
4. In **Authentication → Providers**, ensure **Email** is enabled (turn off "Confirm email" for local testing if you want).

## 2. Deploy Edge Functions (Anthropic)

Install the Supabase CLI, then:

```bash
supabase link --project-ref YOUR_REF
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase functions deploy gradeAnswer
supabase functions deploy generateFlashcards
supabase functions deploy suggestNextSession
```

All three call `claude-sonnet-4-20250514`.

## 3. Run

```bash
bun install
bun run dev
```

## What's seeded

- 2 subjects, 139 Maths topics, 5 Biology units (146 rows total).
- Notes + 2 questions + 3 flashcards for the 7 Maths CORE topics + all 5 Biology units.
- Other Maths topics show "Notes coming soon" — add via SQL when ready.
