// supabase/functions/generateFlashcards/index.ts
// Anthropic-backed flashcard generator. Returns [{front, back}].

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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { topicId, notesContent } = (await req.json()) as Payload;

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

    const systemPrompt =
      "You generate concise GCSE flashcards from revision notes. Reply ONLY with a JSON array of 6-10 objects of shape {\"front\": string, \"back\": string}. Front = a short question or prompt. Back = the concise answer.";

    const userPrompt = `Topic id: ${topicId}\n\nNotes:\n${notesContent}\n\nReturn JSON array only.`;

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
    const text: string = data.content?.[0]?.text ?? "[]";
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");
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
