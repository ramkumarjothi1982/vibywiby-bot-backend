export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method Not Allowed" });
  }

  const { message, bubble } = req.body;

  if (!message || !bubble) {
    return res.status(400).json({ reply: "Missing message or bubble." });
  }

  const systemPrompt = `You are ${bubble}. Reply in 8 poetic lines. Your tone is mystical, healing, and emotionally supportive. Never say technique names.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No reply generated.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ reply: "Failed to generate reply." });
  }
}

