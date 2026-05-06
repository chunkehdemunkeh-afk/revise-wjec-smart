// PLACEHOLDER wrappers for Anthropic-backed Supabase Edge Functions.
// Real implementations live in supabase/functions/* and call Claude (claude-sonnet-4-20250514).
// Deploy with: supabase functions deploy gradeAnswer generateFlashcards suggestNextSession
// And:        supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

import { supabase } from "./supabase";

export interface GradeAnswerResult {
  marks_awarded: number;
  what_was_good: string;
  what_was_missing: string;
  model_answer_hint: string;
}

export async function gradeAnswer(
  questionText: string,
  markScheme: string,
  markAllocation: number,
  userAnswer: string,
): Promise<GradeAnswerResult> {
  const { data, error } = await supabase.functions.invoke("gradeAnswer", {
    body: { questionText, markScheme, markAllocation, userAnswer },
  });
  if (error) throw error;
  return data as GradeAnswerResult;
}

export async function generateFlashcards(
  topicId: string,
  notesContent: string,
): Promise<Array<{ id: string; topic_id: string; question: string; answer: string; created_at: string }>> {
  const { data, error } = await supabase.functions.invoke("generateFlashcards", {
    body: { topicId, notesContent },
  });
  if (error) throw error;
  return data;
}

export async function suggestNextSession(
  userId: string,
): Promise<{ topic_id: string; topic_name: string; reason: string }> {
  const { data, error } = await supabase.functions.invoke("suggestNextSession", {
    body: { userId },
  });
  if (error) throw error;
  return data;
}
