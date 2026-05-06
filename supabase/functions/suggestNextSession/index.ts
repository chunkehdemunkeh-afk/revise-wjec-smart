import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Payload {
  userId: string;
}

function badRequest(message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => null);
    if (!body) return badRequest("Request body must be valid JSON");

    const { userId } = body as Payload;
    if (!userId) return badRequest("userId is required");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch user progress joined with topic name, sorted by weakest first
    const { data: progress, error: progressError } = await supabase
      .from("user_progress")
      .select("topic_id, confidence_level, last_visited_at, topics(name, priority)")
      .eq("user_id", userId)
      .order("confidence_level", { ascending: true })   // lowest confidence first
      .order("last_visited_at", { ascending: true });   // then least recently visited

    if (progressError) throw new Error(`Database error: ${progressError.message}`);

    if (progress && progress.length > 0) {
      const best = progress[0];
      const topicName = (best.topics as { name: string; priority: string } | null)?.name ?? "Unknown topic";
      const confidence = best.confidence_level ?? 0;
      const lastVisited = best.last_visited_at
        ? new Date(best.last_visited_at).toLocaleDateString("en-GB")
        : "never";

      const reason =
        confidence <= 2
          ? `Your confidence on this topic is low (${confidence}/5) — it needs the most attention.`
          : `You haven't visited this topic since ${lastVisited} and it's one of your weaker areas.`;

      return new Response(
        JSON.stringify({
          topic_id: best.topic_id,
          topic_name: topicName,
          reason,
        }),
        { headers: { ...corsHeaders, "content-type": "application/json" } },
      );
    }

    // No progress records — return the first CORE priority topic
    const { data: coreTopic, error: coreError } = await supabase
      .from("topics")
      .select("id, name")
      .eq("priority", "CORE")
      .order("topic_number", { ascending: true })
      .limit(1)
      .single();

    if (coreError || !coreTopic) {
      throw new Error("No CORE topics found to suggest");
    }

    return new Response(
      JSON.stringify({
        topic_id: coreTopic.id,
        topic_name: coreTopic.name,
        reason: "You haven't started revising yet — this is the first core topic to tackle.",
      }),
      { headers: { ...corsHeaders, "content-type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "content-type": "application/json" } },
    );
  }
});
