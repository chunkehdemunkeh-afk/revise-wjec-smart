import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, type Flashcard } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_authenticated/topics/$topicId/flashcards")({
  component: FlashcardsPage,
});

const RATINGS = [
  { label: "Still learning", score: 1, status: "in_progress" as const },
  { label: "Getting there", score: 2, status: "in_progress" as const },
  { label: "Got it", score: 3, status: "confident" as const },
];

function FlashcardsPage() {
  const { topicId } = useParams({ from: "/_authenticated/topics/$topicId/flashcards" });
  const { user } = useAuth();
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  const { data: cards = [], isLoading } = useQuery<Flashcard[]>({
    queryKey: ["flashcards", topicId],
    queryFn: async () => {
      const { data } = await supabase.from("flashcards").select("*").eq("topic_id", topicId);
      return (data ?? []) as Flashcard[];
    },
  });

  async function rate(score: number, status: "in_progress" | "confident") {
    if (!user) return;
    await supabase.from("user_progress").upsert(
      {
        user_id: user.id,
        topic_id: topicId,
        status,
        confidence_score: score,
        last_visited_at: new Date().toISOString(),
      },
      { onConflict: "user_id,topic_id" },
    );
    setFlipped(false);
    if (i + 1 < cards.length) setI(i + 1);
    else setDone(true);
  }

  if (isLoading) return <p className="py-10 text-center text-muted-foreground">Loading…</p>;

  if (cards.length === 0) {
    return (
      <div className="space-y-4 py-10 text-center">
        <p className="text-muted-foreground">No flashcards for this topic yet.</p>
        <Link to="/topics/$topicId/notes" params={{ topicId }}>
          <Button variant="secondary">Back to notes</Button>
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-4 py-10 text-center">
        <h1 className="text-2xl font-bold">Session complete 🎉</h1>
        <p className="text-muted-foreground">{cards.length} cards reviewed.</p>
        <div className="flex justify-center gap-3">
          <Button onClick={() => { setI(0); setDone(false); }}>Restart</Button>
          <Link to="/topics/$topicId/notes" params={{ topicId }}>
            <Button variant="secondary">Back to notes</Button>
          </Link>
        </div>
      </div>
    );
  }

  const card = cards[i];
  const pct = ((i) / cards.length) * 100;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Link to="/topics/$topicId/notes" params={{ topicId }} className="text-xs text-muted-foreground">
          End session
        </Link>
        <p className="text-xs text-muted-foreground">{i + 1} / {cards.length}</p>
      </div>
      <Progress value={pct} />

      <div className="perspective-1000 mt-6 [perspective:1000px]">
        <div
          className="relative h-72 w-full cursor-pointer"
          onClick={() => setFlipped((f) => !f)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={flipped ? "back" : "front"}
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            >
              <Card className="flex h-full w-full items-center justify-center p-8 text-center">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                    {flipped ? "Answer" : "Question"}
                  </p>
                  <p className="text-xl font-medium leading-snug">
                    {flipped ? card.answer : card.question}
                  </p>
                  {!flipped && (
                    <p className="mt-6 text-xs text-muted-foreground">Tap card to flip</p>
                  )}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {flipped && (
        <div className="grid grid-cols-3 gap-2">
          {RATINGS.map((r) => (
            <Button
              key={r.label}
              variant={r.score === 3 ? "default" : "secondary"}
              className="h-12 text-xs"
              onClick={() => rate(r.score, r.status)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
