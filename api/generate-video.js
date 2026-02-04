export default async function handler(req, res) {
  const finalApiKey = req.body.userKey || process.env.SYSTEM_GEMINI_API_KEY;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/veo-3:generateVideo?key=${finalApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.status(200).json(data);
}
