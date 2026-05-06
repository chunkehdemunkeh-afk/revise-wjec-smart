import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/progress-ring";
import { Flame, BookOpen, FlaskConical, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReviseWJEC — Home" },
      { name: "description", content: "Pick a subject, track progress, keep a streak." },
    ],
  }),
  component: Home,
});

interface SubjectStats {
  total: number;
  visited: number;
  lastTopicId: string | null;
}

function useSubjectStats(subjectId: string, userId: string | undefined) {
  return useQuery({
    queryKey: ["subject-stats", subjectId, userId ?? "anon"],
    queryFn: async (): Promise<SubjectStats> => {
      const { count: total } = await supabase
        .from("topics")
        .select("id", { count: "exact", head: true })
        .eq("subject_id", subjectId);

      if (!userId) return { total: total ?? 0, visited: 0, lastTopicId: null };

      const { data: progress } = await supabase
        .from("user_progress")
        .select("topic_id, status, last_visited_at, topics!inner(subject_id)")
        .eq("user_id", userId)
        .eq("topics.subject_id", subjectId);

      const visited = (progress ?? []).filter((p) => p.status !== "not_started").length;
      const sorted = [...(progress ?? [])].sort((a, b) =>
        (b.last_visited_at ?? "").localeCompare(a.last_visited_at ?? ""),
      );
      return {
        total: total ?? 0,
        visited,
        lastTopicId: sorted[0]?.topic_id ?? null,
      };
    },
  });
}

function useStreak(userId: string | undefined) {
  return useQuery({
    queryKey: ["streak", userId ?? "anon"],
    queryFn: async () => {
      if (!userId) return 0;
      const { data } = await supabase
        .from("user_progress")
        .select("last_visited_at")
        .eq("user_id", userId)
        .not("last_visited_at", "is", null)
        .order("last_visited_at", { ascending: false })
        .limit(60);

      const days = new Set(
        (data ?? []).map((r) => (r.last_visited_at ?? "").slice(0, 10)).filter(Boolean),
      );
      let streak = 0;
      const d = new Date();
      while (true) {
        const key = d.toISOString().slice(0, 10);
        if (days.has(key)) {
          streak += 1;
          d.setDate(d.getDate() - 1);
        } else {
          if (streak === 0) {
            // also check yesterday in case today wasn't touched
            d.setDate(d.getDate() - 1);
            const k2 = d.toISOString().slice(0, 10);
            if (!days.has(k2)) break;
            continue;
          }
          break;
        }
      }
      return streak;
    },
  });
}

function SubjectCard({
  subjectId,
  slug,
  name,
  blurb,
  Icon,
}: {
  subjectId: string;
  slug: string;
  name: string;
  blurb: string;
  Icon: typeof BookOpen;
}) {
  const { user } = useAuth();
  const { data } = useSubjectStats(subjectId, user?.id);
  const pct = data && data.total > 0 ? (data.visited / data.total) * 100 : 0;

  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold leading-tight">{name}</h2>
            <p className="text-xs text-muted-foreground">{blurb}</p>
            <Link
              to="/subjects/$slug"
              params={{ slug }}
              className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary"
            >
              Browse topics <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
        <ProgressRing value={pct} />
      </CardContent>
      {data?.lastTopicId && (
        <div className="border-t border-white/5 px-5 py-3">
          <Link to="/topics/$topicId/notes" params={{ topicId: data.lastTopicId }}>
            <Button size="sm" variant="secondary" className="w-full">
              Continue last session
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}

function Home() {
  const { user, loading } = useAuth();
  const { data: streak = 0 } = useStreak(user?.id);

  if (!loading && !user) {
    return (
      <div className="space-y-6 pt-8 text-center">
        <h1 className="text-4xl font-bold">
          Revise WJEC GCSE — <span className="text-primary">smarter</span>.
        </h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          Focused notes, flashcards and past-paper questions for Maths 3300 and Biology. AI feedback on
          every answer.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/signup">
            <Button size="lg">Create account</Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="ghost">Sign in</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between rounded-2xl border border-white/5 bg-card/50 p-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Study streak</p>
          <p className="text-2xl font-bold">{streak} day{streak === 1 ? "" : "s"}</p>
        </div>
        <Flame className="h-8 w-8 text-primary" />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Subjects
        </h2>
        <SubjectCard
          subjectId="maths-wjec-3300-u1"
          slug="maths"
          name="WJEC GCSE Maths 3300"
          blurb="Intermediate · Unit 1 · 139 topics"
          Icon={BookOpen}
        />
        <SubjectCard
          subjectId="biology-wjec-gcse"
          slug="biology"
          name="WJEC GCSE Biology"
          blurb="5 units"
          Icon={FlaskConical}
        />
      </section>
    </div>
  );
}
