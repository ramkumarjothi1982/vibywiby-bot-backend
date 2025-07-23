export default async function handler(req, res) {
  const { openrouter, system_prompt, user_message } = req.body || {};

  if (!openrouter || !user_message || !system_prompt) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields",
    });
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

    console.log("🔍 OpenRouter response:", JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({
        success: false,
        error: "Invalid response format from OpenRouter",
      });
    }

    const reply = data.choices[0].message.content || "✨ Unable to generate a reply.";

    res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error("❌ OpenRouter error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
}
