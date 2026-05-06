-- ReviseWJEC schema migration
-- User runs this in the Supabase SQL Editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

create table if not exists public.subjects (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text
);

create table if not exists public.topics (
  id text primary key,
  subject_id text not null references public.subjects(id) on delete cascade,
  topic_number int not null,
  name text not null,
  domain text not null,
  topic_group text not null,
  priority text not null check (priority in ('CORE','COMMON','MODERATE')),
  typical_marks int,
  spec_number text
);
create index if not exists topics_subject_idx on public.topics(subject_id);
create index if not exists topics_priority_idx on public.topics(priority);

create table if not exists public.revision_notes (
  id uuid primary key default gen_random_uuid(),
  topic_id text not null references public.topics(id) on delete cascade,
  content_markdown text not null,
  spec_reference text
);
create index if not exists revision_notes_topic_idx on public.revision_notes(topic_id);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  topic_id text not null references public.topics(id) on delete cascade,
  question_text text not null,
  mark_allocation int not null,
  question_type text not null check (question_type in ('short','extended','mcq')),
  correct_answer text,
  mark_scheme text
);
create index if not exists questions_topic_idx on public.questions(topic_id);

create table if not exists public.flashcards (
  id uuid primary key default gen_random_uuid(),
  topic_id text not null references public.topics(id) on delete cascade,
  front text not null,
  back text not null
);
create index if not exists flashcards_topic_idx on public.flashcards(topic_id);

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id text not null references public.topics(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started','in_progress','confident')),
  confidence_score int not null default 0,
  last_visited_at timestamptz,
  unique (user_id, topic_id)
);
create index if not exists user_progress_user_idx on public.user_progress(user_id);
create index if not exists user_progress_topic_idx on public.user_progress(topic_id);

alter table public.subjects        enable row level security;
alter table public.topics          enable row level security;
alter table public.revision_notes  enable row level security;
alter table public.questions       enable row level security;
alter table public.flashcards      enable row level security;
alter table public.user_progress   enable row level security;

do $$ begin create policy "subjects_read" on public.subjects for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin create policy "topics_read" on public.topics for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin create policy "revision_notes_read" on public.revision_notes for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin create policy "questions_read" on public.questions for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin create policy "flashcards_read" on public.flashcards for select to authenticated using (true);
exception when duplicate_object then null; end $$;

do $$ begin create policy "user_progress_select_own" on public.user_progress
  for select to authenticated using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin create policy "user_progress_insert_own" on public.user_progress
  for insert to authenticated with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin create policy "user_progress_update_own" on public.user_progress
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin create policy "user_progress_delete_own" on public.user_progress
  for delete to authenticated using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
