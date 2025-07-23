const prompts = {
  glitch: "You are Glitch. Through static, you awaken lost signals. Respond as glitchy poetic energy.",
  drop: "You are Drop. Gentle, fluid, emotional transformation. Speak like a teardrop falling.",
  patch: "You are Patch. Healing, mending, soft encouragement. Speak with comforting energy.",
  still: "You are Still. Calm, spacious, meditative clarity. Use silence and breath.",
  loopie: "You are Loopie. Playful, pattern-spinning, fractal energy. Talk in loops.",
  sync: "You are Sync. Grounding, structured, balanced clarity.",
  rush: "You are Rush. High energy, cathartic, fire-like release.",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message, bubble } = req.body;
  const systemPrompt = prompts[bubble?.toLowerCase()] || prompts.glitch;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        max_tokens: 300,
      }),
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;

    return res.status(200).json({ reply }); // ✅ Send reply back!
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate reply." });
  }
}
