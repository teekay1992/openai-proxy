export default function handler(req, res) {
  // Allow only your Chrome extension origin or '*'
  const allowedOrigin = 'chrome-extension://aehmonnkafkobhjoopfgdcgbjnpobdol';

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Handle CORS preflight request
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    // Dummy summarization response - replace with real logic if needed
    return res.status(200).json({ summary: `Summary of: ${text}` });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
