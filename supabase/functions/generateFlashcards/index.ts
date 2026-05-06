import { createClient } from "jsr:@supabase/supabase-js@2";

const MODEL = "claude-sonnet-4-20250514";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Payload {
  topicId: string;
  notesContent: string;
}

interface FlashcardPair {
  question: string;
  answer: string;
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

    const { topicId, notesContent } = body as Payload;
    if (!topicId) return badRequest("topicId is required");
    if (!notesContent) return badRequest("notesContent is required");

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const systemPrompt = `You generate concise WJEC GCSE-level flashcards from revision notes. \
Reply ONLY with a JSON array of 8-10 objects with this exact shape:
[{"question": string, "answer": string}]
question: a short, clear exam-style prompt or keyword question. \
answer: a concise, accurate answer (1-3 sentences max). \
Cover the most important concepts from the notes. Return the JSON array only — no markdown, no prose.`;

    const userPrompt = `Topic ID: ${topicId}\n\nRevision notes:\n${notesContent}\n\nReturn JSON array only.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Anthropic ${res.status}: ${text}`);
    }

    const data = await res.json();
    const rawText: string = data.content?.[0]?.text ?? "[]";
    const jsonStart = rawText.indexOf("[");
    const jsonEnd = rawText.lastIndexOf("]");
    if (jsonStart === -1 || jsonEnd === -1) throw new Error("Model returned no JSON array");

    const pairs: FlashcardPair[] = JSON.parse(rawText.slice(jsonStart, jsonEnd + 1));

    if (!Array.isArray(pairs) || pairs.length === 0) {
      throw new Error("Model returned an empty or invalid flashcard list");
    }

    const rows = pairs.map((p) => ({
      id: crypto.randomUUID(),
      topic_id: topicId,
      question: p.question,
      answer: p.answer,
      created_at: new Date().toISOString(),
    }));

    const { data: saved, error: dbError } = await supabase
      .from("flashcards")
      .insert(rows)
      .select();

    if (dbError) throw new Error(`Database error: ${dbError.message}`);

    return new Response(JSON.stringify(saved), {
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "content-type": "application/json" } },
    );
  }
});
