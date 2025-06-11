export default async function handler(req, res) {
  // Allow only your Chrome extension origin
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
    
    // Check if text is too long (OpenAI has token limits)
    if (text.length > 12000) {
      return res.status(400).json({ error: 'Text too long for summarization' });
    }
    
    try {
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that creates concise summaries of text. Provide a clear, informative summary in 2-3 sentences.'
            },
            {
              role: 'user',
              content: `Please summarize the following text: ${text}`
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API Error:', errorData);
        return res.status(500).json({ 
          error: 'Failed to generate summary',
          details: errorData.error?.message || 'Unknown error'
        });
      }
      
      const data = await response.json();
      const summary = data.choices[0].message.content.trim();
      
      return res.status(200).json({ summary });
      
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
  }
  
  return res.status(405).json({ error: 'Method Not Allowed' });
}
