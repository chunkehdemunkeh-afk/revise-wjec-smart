import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing. Copy .env.example to .env and fill in.",
  );
}

export const supabase = createClient(url ?? "http://localhost", anonKey ?? "anon", {
  auth: { persistSession: true, autoRefreshToken: true },
});

export type Priority = "CORE" | "COMMON" | "MODERATE";
export type Status = "not_started" | "in_progress" | "confident";

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface Topic {
  id: string;
  subject_id: string;
  topic_number: number;
  name: string;
  domain: string;
  topic_group: string;
  priority: Priority;
  typical_marks: number | null;
  spec_number: string | null;
}

export interface RevisionNote {
  id: string;
  topic_id: string;
  content_markdown: string;
  spec_reference: string | null;
}

export interface Question {
  id: string;
  topic_id: string;
  question_text: string;
  mark_allocation: number;
  question_type: "short" | "extended" | "mcq";
  correct_answer: string | null;
  mark_scheme: string | null;
}

export interface Flashcard {
  id: string;
  topic_id: string;
  question: string;
  answer: string;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  topic_id: string;
  status: Status;
  confidence_level: number;
  score: number;
  visit_count: number;
  last_visited_at: string | null;
}
