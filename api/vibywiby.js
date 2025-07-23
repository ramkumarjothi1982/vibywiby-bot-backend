export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  const { openrouter, system_prompt, user_message } = req.body;

  if (!openrouter || !system_prompt || !user_message) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  try {
    const openRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openrouter}`,
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: system_prompt },
          { role: "user", content: user_message },
        ],
        temperature: 0.8,
      }),
    });

    const openData = await openRes.json();

    if (!openData.choices || !openData.choices[0]?.message?.content) {
      console.error("Invalid OpenRouter response:", openData);
      return res.status(200).json({ success: true, reply: "✨ Unable to generate a reply." });
    }

    const reply = openData.choices[0].message.content.trim();
    return res.status(200).json({ success: true, reply });
  } catch (err) {
    console.error("Fetch failed:", err);
    return res.status(500).json({ success: false, error: "Something went wrong with OpenRouter" });
  }
}
