// supabase/functions/gradeAnswer/index.ts
// Anthropic-backed grader. Deploy:
//   supabase functions deploy gradeAnswer
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { questionText, markScheme, markAllocation, userAnswer } =
      (await req.json()) as Payload;

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

    const systemPrompt =
      "You are a strict but fair WJEC GCSE examiner. Mark the student's answer against the mark scheme. Reply ONLY with valid JSON of shape {\"marksAwarded\": number, \"good\": string, \"missing\": string, \"modelAnswerHint\": string}. marksAwarded must be an integer between 0 and the maximum marks.";

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
