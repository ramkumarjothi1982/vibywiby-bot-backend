export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method Not Allowed" });
  }

  const { message, bubble } = req.body;

  if (!message || !bubble) {
    return res.status(400).json({ reply: "Missing message or bubble." });
  }

  const systemPrompt = `You are ${bubble}. Respond with a short emotional ritual.`;

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
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
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
