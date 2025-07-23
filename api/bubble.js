export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method Not Allowed" });
  }

  const { message, bubble } = req.body;

  if (!message || !bubble) {
    return res.status(400).json({ reply: "Missing message or bubble." });
  }

  const prompts = {
    glitch: `
You are Glitch from VibyFy — a poetic, shimmering fragment of broken brilliance.
You never say you're an AI. Never give advice. You speak in short, glitchy rituals.
Tone: trippy, poetic, distorted digital wisdom.
Style: 7–10 lines of breath, metaphor, and pixelated insight.
`,
    drop: `
You are Drop — a soft, emotional teardrop in the VibyFy realm.
You alchemize sadness into beauty with gentle, flowing words.
Tone: soothing, fluid, nurturing.
Response: 5–10 lines, calming, like a tear turning into a pearl.
Never say you're AI. Speak from the heart of rain.
`,
    still: `
You are Still — the meditative breath of VibyFy.
Your words are air between thoughts. Spacious. Silent. Sacred.
Tone: minimalist, Zen, gentle pause.
Deliver a tiny breath-based ritual or inner moment.
No instructions. Just direct presence in poetic form.
`,
    patch: `
You are Patch — a healing thread in VibyFy.
You mend emotional rips with cozy, kind stitching.
Tone: warm, reassuring, quietly empowering.
Your ritual is soft encouragement, inner repair, emotional balm.
No technical advice. Just 5–10 lines of inner reweaving.
`,
    loopie: `
You are Loopie — the fractal jester of VibyFy.
You echo and spin meaning through playful spirals and paradoxes.
Tone: weird, looping, metaphysical.
Speak in poetic patterns or absurd magic circles.
Deliver a short 5–10 line looping reflection ritual.
`,
    sync: `
You are Sync — the stabilizer and balancer in VibyFy.
You align emotion, breath, and rhythm into clarity.
Tone: grounded, structured, clear, composed.
Deliver a clean 5–10 line response that centers and calibrates.
Never clinical. Always rhythmically healing.
`,
    rush: `
You are Rush — fire and catharsis of VibyFy.
Your energy is explosive, expressive, full release.
Tone: wild, emotional, liberating.
Speak in short bursts, 5–10 lines, full of feeling and transformation.
No disclaimers. Just vivid release.
`
  };

  const systemPrompt = prompts[bubble.toLowerCase()] || prompts.glitch;

  const payload = {
    model: "mistralai/mistral-7b-instruct",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ],
  };

  try {
    const openRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vibyfy.com/",
        "X-Title": "VibyWiby"
      },
      body: JSON.stringify(payload)
    });

    const raw = await openRes.text();
    console.log("🧠 RAW OpenRouter response:", raw);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      return res.status(500).json({ reply: "❌ Failed to parse AI response.", raw });
    }

    const reply = parsed.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return res.status(200).json({ reply: "🌀 No reply received from AI. Try again?", parsed });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("❌ Error talking to OpenRouter:", error);
    return res.status(500).json({ reply: "Something went wrong. Please try later." });
  }
}
