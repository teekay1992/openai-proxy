export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text } = req.body;

  if (!text) return res.status(400).json({ error: 'No text provided' });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Summarize this into key points:\n\n${text}` }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || "No summary generated.";
    res.status(200).json({ summary });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch summary." });
  }
}
