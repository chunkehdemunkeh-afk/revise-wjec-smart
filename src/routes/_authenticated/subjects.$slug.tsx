import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { supabase, type Topic, type Status } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { PriorityBadge, StatusBadge } from "@/components/badges";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/subjects/$slug")({
  component: SubjectPage,
});

const PRIORITY_RANK: Record<string, number> = { CORE: 0, COMMON: 1, MODERATE: 2 };

function SubjectPage() {
  const { slug } = useParams({ from: "/_authenticated/subjects/$slug" });
  const { user } = useAuth();

  const { data: subject } = useQuery({
    queryKey: ["subject", slug],
    queryFn: async () => {
      const { data } = await supabase.from("subjects").select("*").eq("slug", slug).single();
      return data;
    },
  });

  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ["topics", slug],
    enabled: !!subject,
    queryFn: async () => {
      const { data } = await supabase
        .from("topics")
        .select("*")
        .eq("subject_id", subject!.id)
        .order("topic_number");
      return (data ?? []) as Topic[];
    },
  });

  const { data: progressMap = {} } = useQuery<Record<string, Status>>({
    queryKey: ["progress-map", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_progress")
        .select("topic_id, status")
        .eq("user_id", user!.id);
      const map: Record<string, Status> = {};
      (data ?? []).forEach((r) => (map[r.topic_id] = r.status as Status));
      return map;
    },
  });

  const groups = useMemo(() => {
    const groupKey = slug === "biology" ? "domain" : "topic_group";
    const map = new Map<string, Topic[]>();
    topics.forEach((t) => {
      const key = (t as any)[groupKey] as string;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });
    for (const arr of map.values()) {
      arr.sort((a, b) => {
        const p = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
        return p !== 0 ? p : a.topic_number - b.topic_number;
      });
    }
    return Array.from(map.entries());
  }, [topics, slug]);

  if (!subject) return <p className="py-10 text-center text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-4">
      <header>
        <Link to="/" className="text-xs text-muted-foreground">← Home</Link>
        <h1 className="mt-1 text-2xl font-bold">{subject.name}</h1>
        <p className="text-sm text-muted-foreground">{subject.description}</p>
      </header>

      <div className="space-y-3">
        {groups.map(([groupName, items]) => (
          <TopicGroup
            key={groupName}
            title={groupName}
            items={items}
            progressMap={progressMap}
          />
        ))}
      </div>
    </div>
  );
}

function TopicGroup({
  title,
  items,
  progressMap,
}: {
  title: string;
  items: Topic[];
  progressMap: Record<string, Status>;
}) {
  const [open, setOpen] = useState(true);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card>
        <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left">
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-xs text-muted-foreground">{items.length} topics</p>
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="divide-y divide-white/5 border-t border-white/5">
            {items.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.name}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <PriorityBadge priority={t.priority} />
                    <StatusBadge status={progressMap[t.id] ?? "not_started"} />
                  </div>
                </div>
                <Link to="/topics/$topicId/notes" params={{ topicId: t.id }}>
                  <Button size="sm">Revise</Button>
                </Link>
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
