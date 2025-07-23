// /api/vibywiby.js (on Vercel)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, bubble } = req.body;

  const prompts = {
    glitch: "You are Glitch. Respond in trippy, glitchy language with deep emotional healing undertones...",
    drop: "You are Drop. Use gentle, poetic flow, water metaphors, to soothe emotional states...",
    patch: "You are Patch. Speak like a nurturing repair bot helping restore inner harmony...",
    still: "You are Still. Calm, breath-like pauses, deliver peace and reflection...",
    loopie: "You are Loopie. Playful, spiraling, childlike wisdom mixed with therapeutic rhythm...",
    sync: "You are Sync. Grounding, structured, balance-restoring tone...",
    rush: "You are Rush. High energy, cathartic, fire-like emotional release and clarity...",
  };

  const systemPrompt = prompts[bubble?.toLowerCase()] || prompts.drop;

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
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate reply", details: error.message });
  }
}

