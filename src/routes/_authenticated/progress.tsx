import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { suggestNextSession } from "@/lib/ai";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/progress")({
  head: () => ({ meta: [{ title: "Progress — ReviseWJEC" }] }),
  component: ProgressPage,
});

function ProgressPage() {
  const { user } = useAuth();
  const [suggesting, setSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState<{ topic_id: string; reason: string } | null>(null);
  const [suggErr, setSuggErr] = useState<string | null>(null);

  const { data = [] } = useQuery({
    queryKey: ["all-progress", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_progress")
        .select("topic_id, status, confidence_level, last_visited_at, topics(name, priority, domain)")
        .eq("user_id", user!.id);
      return data ?? [];
    },
  });

  const counts = {
    not_started: 0,
    in_progress: 0,
    confident: 0,
  };
  data.forEach((r: any) => {
    counts[r.status as keyof typeof counts] += 1;
  });

  const weak = (data as any[]).filter((r) => r.confidence_level <= 1 && r.status !== "not_started");

  async function getSuggestion() {
    if (!user) return;
    setSuggesting(true);
    setSuggErr(null);
    try {
      const res = await suggestNextSession(user.id);
      setSuggestion(res);
    } catch (e) {
      setSuggErr(e instanceof Error ? e.message : "Suggestion unavailable");
    } finally {
      setSuggesting(false);
    }
  }

  return (
    <div className="space-y-5">
      <header>
        <Link to="/" className="text-xs text-muted-foreground">← Home</Link>
        <h1 className="mt-1 text-2xl font-bold">Your progress</h1>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Not started" value={counts.not_started} />
        <Stat label="In progress" value={counts.in_progress} />
        <Stat label="Confident" value={counts.confident} accent />
      </div>

      <Card>
        <CardContent className="space-y-3 p-5">
          <h2 className="font-semibold">Weak areas</h2>
          {weak.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing flagged yet — keep going.</p>
          ) : (
            <ul className="space-y-2">
              {weak.slice(0, 8).map((w: any) => (
                <li key={w.topic_id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{w.topics?.name}</p>
                    <p className="text-xs text-muted-foreground">{w.topics?.domain}</p>
                  </div>
                  <Link to="/topics/$topicId/notes" params={{ topicId: w.topic_id }}>
                    <Button size="sm" variant="secondary">Revise</Button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-5">
          <h2 className="font-semibold">Suggested next session</h2>
          {suggestion ? (
            <>
              <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
              <Link to="/topics/$topicId/notes" params={{ topicId: suggestion.topic_id }}>
                <Button size="sm">Open topic</Button>
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                AI picks the most useful topic for you next.
              </p>
              <Button size="sm" onClick={getSuggestion} disabled={suggesting}>
                {suggesting ? "Thinking…" : "Suggest"}
              </Button>
              {suggErr && <p className="text-xs text-destructive">{suggErr}</p>}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`mt-1 text-2xl font-bold ${accent ? "text-primary" : ""}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
