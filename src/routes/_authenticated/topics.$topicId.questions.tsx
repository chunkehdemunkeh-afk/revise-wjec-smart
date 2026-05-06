import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase, type Question } from "@/lib/supabase";
import { gradeAnswer, type GradeAnswerResult } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/topics/$topicId/questions")({
  component: QuestionsPage,
});

function QuestionsPage() {
  const { topicId } = useParams({ from: "/_authenticated/topics/$topicId/questions" });
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<GradeAnswerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const { data: questions = [], isLoading } = useQuery<Question[]>({
    queryKey: ["questions", topicId],
    queryFn: async () => {
      const { data } = await supabase.from("questions").select("*").eq("topic_id", topicId);
      return (data ?? []) as Question[];
    },
  });

  if (isLoading) return <p className="py-10 text-center text-muted-foreground">Loading…</p>;

  if (questions.length === 0) {
    return (
      <div className="space-y-4 py-10 text-center">
        <p className="text-muted-foreground">No questions for this topic yet.</p>
        <Link to="/topics/$topicId/notes" params={{ topicId }}>
          <Button variant="secondary">Back to notes</Button>
        </Link>
      </div>
    );
  }

  const q = questions[i];

  async function submit() {
    if (!q) return;
    setLoading(true);
    setErr(null);
    setFeedback(null);
    try {
      const res = await gradeAnswer(
        q.question_text,
        q.mark_scheme ?? "",
        q.mark_allocation,
        answer,
      );
      setFeedback(res);
    } catch (e) {
      setErr(
        e instanceof Error
          ? e.message
          : "Grading failed. Deploy the gradeAnswer Edge Function and set ANTHROPIC_API_KEY.",
      );
    } finally {
      setLoading(false);
    }
  }

  function next() {
    setI((n) => Math.min(n + 1, questions.length - 1));
    setAnswer("");
    setFeedback(null);
    setErr(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Link to="/topics/$topicId/notes" params={{ topicId }} className="text-xs text-muted-foreground">
          ← Back to notes
        </Link>
        <p className="text-xs text-muted-foreground">{i + 1} / {questions.length}</p>
      </div>

      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="flex-1 text-base leading-relaxed">{q.question_text}</p>
            <Badge className="border-transparent bg-primary/15 text-primary whitespace-nowrap">
              [{q.mark_allocation} marks]
            </Badge>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer…"
            rows={6}
            className="w-full rounded-md border border-input bg-transparent p-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />

          <Button onClick={submit} disabled={loading || !answer.trim()} className="w-full">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Grading…</> : "Submit"}
          </Button>
        </CardContent>
      </Card>

      {err && (
        <Card>
          <CardContent className="p-4 text-sm text-destructive">{err}</CardContent>
        </Card>
      )}

      {feedback && (
        <Card>
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Feedback</h3>
              <Badge className="border-transparent bg-primary text-primary-foreground">
                {feedback.marksAwarded} / {q.mark_allocation}
              </Badge>
            </div>
            <Section title="What was good" body={feedback.good} />
            <Section title="What was missing" body={feedback.missing} />
            <Section title="Model answer hint" body={feedback.modelAnswerHint} />
            <Button variant="secondary" className="w-full" onClick={next} disabled={i + 1 >= questions.length}>
              Next question
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <p className="mt-1 text-sm leading-relaxed">{body}</p>
    </div>
  );
}
