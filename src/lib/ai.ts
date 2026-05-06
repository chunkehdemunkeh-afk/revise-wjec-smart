// PLACEHOLDER wrappers for Anthropic-backed Supabase Edge Functions.
// Real implementations live in supabase/functions/* and call Claude (claude-sonnet-4-20250514).
// Deploy with: supabase functions deploy gradeAnswer generateFlashcards suggestNextSession
// And:        supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

import { supabase } from "./supabase";

export interface GradeAnswerResult {
  marksAwarded: number;
  good: string;
  missing: string;
  modelAnswerHint: string;
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
): Promise<Array<{ front: string; back: string }>> {
  const { data, error } = await supabase.functions.invoke("generateFlashcards", {
    body: { topicId, notesContent },
  });
  if (error) throw error;
  return data as Array<{ front: string; back: string }>;
}

export async function suggestNextSession(
  userId: string,
): Promise<{ topicId: string; reason: string }> {
  const { data, error } = await supabase.functions.invoke("suggestNextSession", {
    body: { userId },
  });
  if (error) throw error;
  return data as { topicId: string; reason: string };
}
