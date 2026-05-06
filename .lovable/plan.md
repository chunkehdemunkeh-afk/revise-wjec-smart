
# ReviseWJEC — Final Build Plan

Dark-themed mobile-first GCSE revision app. TanStack Start + user-supplied Supabase + scaffolded Anthropic Edge Functions.

## 1. Design tokens (`src/styles.css`)

- `--background`: #0F172A
- `--card`: #1E293B
- `--foreground`: white
- `--primary`: #14B8A6 (teal)
- `--muted-foreground`: slate-400
- Priority badge tokens: `--priority-core` green (#10B981), `--priority-common` amber (#F59E0B), `--priority-moderate` slate-500
- Default to dark mode (`<html class="dark">`)
- Body font: Inter; display: Sora

## 2. Routes

```
src/routes/
  __root.tsx
  index.tsx                                  Home
  login.tsx
  signup.tsx
  _authenticated.tsx
  _authenticated/
    subjects.$slug.tsx                       Topic list
    topics.$topicId.notes.tsx
    topics.$topicId.flashcards.tsx
    topics.$topicId.questions.tsx
    progress.tsx
```

`_authenticated.tsx` gates with `beforeLoad` → redirect `/login` if no session.

## 3. Supabase client

`src/lib/supabase.ts` reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. `.env.example` committed; user fills in `.env`.

## 4. SQL migration (`supabase/migrations/0001_init.sql`)

Tables:

- `subjects(id text pk, name text, slug text unique, description text)`
- `topics(id text pk, subject_id text fk, topic_number int, name text, domain text, topic_group text, priority text check in (CORE,COMMON,MODERATE), typical_marks int null, spec_number text null)`
- `revision_notes(id uuid pk, topic_id text fk, content_markdown text, spec_reference text)`
- `questions(id uuid pk, topic_id text fk, question_text text, mark_allocation int, question_type text check in (short,extended,mcq), correct_answer text, mark_scheme text)`
- `flashcards(id uuid pk, topic_id text fk, front text, back text)` — **front/back** column names
- `user_progress(id uuid pk, user_id uuid fk auth.users, topic_id text fk, status text check in (not_started,in_progress,confident), confidence_score int default 0, last_visited_at timestamptz, unique(user_id, topic_id))` — **last_visited_at** everywhere

RLS:
- subjects/topics/revision_notes/questions/flashcards: `select` for `authenticated`
- user_progress: full CRUD limited to `auth.uid() = user_id`

## 5. Seed (`supabase/seed.sql`)

Use the **exact SQL provided by the user verbatim** for subjects + 139 Maths + 5 Biology topics. Then append:

- For each of the 7 Maths CORE topics (m-001, m-002, m-049, m-050, m-051, m-052, m-122) and 5 Biology topics (b-001…b-005):
  - 1 `revision_notes` row with markdown content + spec_reference
  - 2 `questions` rows (1 short + 1 extended) with mark_scheme
  - 3 `flashcards` rows using `front`/`back`

Other 132 Maths topics exist as rows only; UI shows "Notes coming soon".

## 6. Edge Functions (`supabase/functions/`)

All three call `claude-sonnet-4-20250514` via `https://api.anthropic.com/v1/messages` with `Deno.env.get("ANTHROPIC_API_KEY")`. CORS headers included.

- `gradeAnswer/index.ts` — input `{questionText, markScheme, markAllocation, userAnswer}` → `{marksAwarded, good, missing, modelAnswerHint}`
- `generateFlashcards/index.ts` — input `{topicId, notesContent}` → `[{front, back}]` (front/back field names)
- `suggestNextSession/index.ts` — input `{userId}` → reads `user_progress` (using `last_visited_at`), returns `{topicId, reason}`

Frontend calls via `supabase.functions.invoke(...)`. Wrappers in `src/lib/ai.ts` clearly labelled placeholders.

## 7. Screens

- **Home**: 2 subject cards (Maths/Biology) → progress ring (% topics with status != not_started, queried via `user_progress`), streak counter (consecutive days with any `last_visited_at`), Continue button (most recent `last_visited_at`)
- **Topic list (`/subjects/$slug`)**: groups by `topic_group` (Maths) or `domain` (Biology). CORE pinned to top of each group. Each row: name + priority badge (green/amber/grey) + status badge + Revise button → notes
- **Notes**: spec_reference header, `react-markdown` content, "Start Flashcards" CTA → on visit, upsert `user_progress` with status=in_progress + last_visited_at=now()
- **Flashcards**: framer-motion flip card, top progress bar, 3 buttons ("Still learning"/"Getting there"/"Got it") → updates confidence_score (1/2/3) and status (in_progress/in_progress/confident)
- **Questions**: question text + `[N marks]` chip, textarea, Submit → `gradeAnswer()` invocation → feedback card (marks/good/missing/model hint)
- **Progress**: recharts donut of confidence levels, weak areas list (topics with confidence_score ≤ 1), "Suggested next session" card calling `suggestNextSession()`

## 8. Auth

Email/password Supabase Auth. `onAuthStateChange` listener in root sets context. `_authenticated` layout `beforeLoad` redirects unauthenticated users to `/login`.

## 9. Dependencies to install

`@supabase/supabase-js`, `framer-motion`, `react-markdown`, `recharts`.

## 10. Out of scope

- Real Anthropic calls (functions scaffolded only — user runs `supabase functions deploy` and sets `ANTHROPIC_API_KEY` secret)
- Notes/questions/flashcards for the 132 non-seeded Maths topics
- Spaced repetition beyond confidence_score updates

## What you do after I'm done

1. Create Supabase project
2. Copy URL + anon key into `.env`
3. Run `0001_init.sql` then `seed.sql` in SQL editor
4. `supabase functions deploy gradeAnswer generateFlashcards suggestNextSession`
5. `supabase secrets set ANTHROPIC_API_KEY=sk-ant-...`
