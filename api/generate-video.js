export default async function handler(req, res) {
  const { prompt, userKey } = req.body;
  // Dòng này tự động lấy Key từ Vercel nếu khách không nhập Key riêng
  const finalApiKey = userKey || process.env.SYSTEM_GEMINI_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/veo-3:generateVideo?key=${finalApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Lỗi kết nối API" });
  }
}
