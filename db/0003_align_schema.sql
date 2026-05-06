-- Migration: align schema with edge function spec
-- Run in the Supabase SQL Editor after 0002_seed.sql.

-- ── flashcards ───────────────────────────────────────────────
-- Rename front → question, back → answer
alter table public.flashcards rename column front to question;
alter table public.flashcards rename column back  to answer;

-- Add created_at (edge function inserts it explicitly)
alter table public.flashcards
  add column if not exists created_at timestamptz not null default now();

-- ── user_progress ────────────────────────────────────────────
-- Rename confidence_score → confidence_level (1-5 scale)
alter table public.user_progress rename column confidence_score to confidence_level;

-- Add missing columns referenced in the spec
alter table public.user_progress
  add column if not exists score       int          not null default 0,
  add column if not exists visit_count int          not null default 0;
