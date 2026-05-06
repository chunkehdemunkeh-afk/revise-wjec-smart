const MODEL = "claude-sonnet-4-20250514";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Payload {
  questionText: string;
  markScheme: string;
  markAllocation: number;
  userAnswer: string;
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

    const { questionText, markScheme, markAllocation, userAnswer } = body as Payload;
    if (!questionText) return badRequest("questionText is required");
    if (!markScheme) return badRequest("markScheme is required");
    if (markAllocation == null) return badRequest("markAllocation is required");
    if (!userAnswer) return badRequest("userAnswer is required");

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

    const systemPrompt = `You are a strict but encouraging WJEC GCSE examiner. \
Mark the student's answer against the mark scheme provided. \
Award marks fairly but do not give credit for vague or incomplete points. \
Reply ONLY with valid JSON matching this exact shape:
{
  "marks_awarded": number,
  "what_was_good": string,
  "what_was_missing": string,
  "model_answer_hint": string
}
marks_awarded must be an integer between 0 and the maximum marks. \
what_was_good: 1-2 sentences praising correct points. \
what_was_missing: 1-2 sentences on key points that were absent or incomplete. \
model_answer_hint: a brief hint at the ideal answer without giving it away entirely. \
Return JSON only — no markdown, no prose outside the JSON object.`;

    const userPrompt = `Question: ${questionText}
Maximum marks: ${markAllocation}
Mark scheme: ${markScheme}

Student answer: ${userAnswer}

Return JSON only.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Anthropic ${res.status}: ${text}`);
    }

    const data = await res.json();
    const rawText: string = data.content?.[0]?.text ?? "{}";
    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) throw new Error("Model returned no JSON object");

    const parsed = JSON.parse(rawText.slice(jsonStart, jsonEnd + 1));

    // Clamp marks_awarded to valid range
    parsed.marks_awarded = Math.max(0, Math.min(markAllocation, Math.round(parsed.marks_awarded ?? 0)));

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
