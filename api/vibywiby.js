export default async function handler(req, res) {
  const { openrouter, system_prompt, user_message } = req.body || {};

  if (!openrouter || !user_message || !system_prompt) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openrouter}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral/mixtral-8x7b-instruct",
        messages: [
          { role: "system", content: system_prompt },
          { role: "user", content: user_message },
        ],
      }),
    });

    const data = await response.json();

    // 🛠 Fix: safely access nested content
    const reply = data?.choices?.[0]?.message?.content?.trim() || "✨ Unable to generate a reply.";

    res.status(200).json({ success: true, reply });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Internal error" });
  }
}
