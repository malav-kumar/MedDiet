/**
 * Google Gemini API client for meal-plan generation.
 *
 * SECURITY NOTE: Direct browser→Gemini calls expose your API key in the
 * shipped JS bundle. For production, proxy through a backend.
 *
 * Set VITE_GEMINI_API_KEY in your environment to enable AI generation.
 */
const MODEL = "gemini-3-flash";
const ENDPOINT = (key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;

const SYSTEM_PROMPT = `You are a medical diet assistant. Generate a safe, healthy
full-day meal plan tailored to the user's medicines, conditions and allergies.
Always respond in valid JSON only — no prose, no markdown fences.`;

const buildUserPrompt = ({ medicines, conditions, allergies }) => `
Active medicines: ${medicines.length ? medicines.map((m) => m.medicine).join(", ") : "none"}
Active conditions: ${conditions.length ? conditions.map((c) => c.condition).join(", ") : "none"}
User allergies: ${allergies?.length ? allergies.join(", ") : "none"}

Foods to avoid (from medicines/conditions): ${[
  ...medicines.flatMap((m) => m.avoid || []),
  ...conditions.flatMap((c) => c.avoid || []),
].join(", ") || "none"}

Foods recommended: ${[
  ...medicines.flatMap((m) => m.safe || []),
  ...conditions.flatMap((c) => c.recommended || []),
].join(", ") || "none"}

Return ONLY this JSON shape:
{
  "breakfast": { "meal": "string", "foods": ["string"], "notes": "string" },
  "lunch":     { "meal": "string", "foods": ["string"], "notes": "string" },
  "dinner":    { "meal": "string", "foods": ["string"], "notes": "string" },
  "snacks":    { "meal": "string", "foods": ["string"], "notes": "string" },
  "warnings":  ["string"],
  "hydration": "string"
}`;

/** Strip markdown fences if Gemini wraps JSON in ```json ... ```. */
const extractJson = (text) => {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = (fenced ? fenced[1] : text).trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in response.");
  return JSON.parse(raw.slice(start, end + 1));
};

/**
 * Generate a meal plan via Gemini.
 * @returns {Promise<object>} Parsed meal-plan JSON.
 */
export const generateMealPlan = async ({ medicines, conditions, allergies }) => {
  // NOTE: Hardcoded for development testing. Move to a backend proxy for production.
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
  
    if (!apiKey) {
      throw new Error("API Key not found. Please add VITE_GEMINI_API_KEY to your .env file.");
    }

  const res = await fetch(ENDPOINT(apiKey), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: buildUserPrompt({ medicines, conditions, allergies }) }] }],
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Gemini request failed (${res.status}): ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty response.");
  return extractJson(text);
};
