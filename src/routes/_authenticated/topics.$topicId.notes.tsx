import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileQuestion, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/topics/$topicId/notes")({
  component: NotesPage,
});

function NotesPage() {
  const { topicId } = useParams({ from: "/_authenticated/topics/$topicId/notes" });
  const { user } = useAuth();

  const { data: topic } = useQuery({
    queryKey: ["topic", topicId],
    queryFn: async () => {
      const { data } = await supabase.from("topics").select("*").eq("id", topicId).single();
      return data;
    },
  });

  const { data: note, isLoading } = useQuery({
    queryKey: ["note", topicId],
    queryFn: async () => {
      const { data } = await supabase
        .from("revision_notes")
        .select("*")
        .eq("topic_id", topicId)
        .maybeSingle();
      return data;
    },
  });

  // Mark in_progress + last_visited_at
  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_progress")
      .upsert(
        {
          user_id: user.id,
          topic_id: topicId,
          status: "in_progress",
          last_visited_at: new Date().toISOString(),
        },
        { onConflict: "user_id,topic_id", ignoreDuplicates: false },
      )
      .then(({ error }) => {
        if (error) console.warn("progress upsert failed", error);
      });
  }, [topicId, user]);

  if (!topic) return <p className="py-10 text-center text-muted-foreground">Loading…</p>;

  return (
    <article className="space-y-5">
      <header>
        <Link to="/subjects/$slug" params={{ slug: topic.subject_id.startsWith("biology") ? "biology" : "maths" }} className="text-xs text-muted-foreground">
          ← Back to topics
        </Link>
        {note?.spec_reference && (
          <p className="mt-1 text-xs uppercase tracking-wider text-primary">{note.spec_reference}</p>
        )}
        <h1 className="mt-1 text-2xl font-bold">{topic.name}</h1>
      </header>

      <Card>
        <CardContent className="p-5">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading notes…</p>
          ) : note ? (
            <div className="prose prose-invert prose-sm max-w-none prose-headings:font-display prose-strong:text-primary">
              <ReactMarkdown>{note.content_markdown}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Notes coming soon for this topic.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/topics/$topicId/flashcards" params={{ topicId }}>
          <Button className="w-full" size="lg">
            <Sparkles className="h-4 w-4" /> Flashcards
          </Button>
        </Link>
        <Link to="/topics/$topicId/questions" params={{ topicId }}>
          <Button className="w-full" size="lg" variant="secondary">
            <FileQuestion className="h-4 w-4" /> Questions
          </Button>
        </Link>
      </div>
    </article>
  );
}
