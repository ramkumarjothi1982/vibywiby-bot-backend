export default async function handler(req, res) {
  const { email, password, openrouter, feed_url, system_prompt } = req.body;

  const reply = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openrouter}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistral/mixtral-8x7b-instruct",
      messages: [
        { role: "system", content: system_prompt },
        { role: "user", content: "Sample post: Feeling heavy today. 🌧" },
      ],
    }),
  });

  const replyJson = await reply.json();
  const message = replyJson.choices?.[0]?.message?.content || "🌈 You are safe.";
  res.status(200).json({ reply: message });
}
