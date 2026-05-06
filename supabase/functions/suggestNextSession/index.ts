// supabase/functions/suggestNextSession/index.ts
// Reads user_progress (last_visited_at) and asks Claude to suggest the next topic.

import { createClient } from "jsr:@supabase/supabase-js@2";

const MODEL = "claude-sonnet-4-20250514";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Payload {
  userId: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { userId } = (await req.json()) as Payload;
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: progress } = await supabase
      .from("user_progress")
      .select("topic_id, status, confidence_score, last_visited_at, topics(name, priority, domain)")
      .eq("user_id", userId)
      .order("last_visited_at", { ascending: true })
      .limit(50);

    const { data: untouched } = await supabase
      .from("topics")
      .select("id, name, priority, domain")
      .eq("priority", "CORE")
      .limit(20);

    const systemPrompt =
      "You recommend the next GCSE revision topic. Reply ONLY with JSON {\"topicId\": string, \"reason\": string}. Prefer CORE topics with low confidence_score or that have not been visited recently.";

    const userPrompt = `User progress (oldest last_visited_at first):\n${JSON.stringify(progress ?? [])}\n\nUntouched CORE topics:\n${JSON.stringify(untouched ?? [])}\n\nReturn JSON only.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 512,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Anthropic ${res.status}: ${text}`);
    }

    const data = await res.json();
    const text: string = data.content?.[0]?.text ?? "{}";
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "content-type": "application/json" } },
    );
  }
});
