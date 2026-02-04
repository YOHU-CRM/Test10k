// --- DÁN VÀO ĐẦU HÀM XỬ LÝ NÚT BẤM TẠO VIDEO ---
const handleGenerateVideo = async () => {
  setLoading(true);
  
  // Lấy key từ bộ nhớ máy người dùng nếu công tắc đang bật
  const isCustomKey = localStorage.getItem('USE_CUSTOM_KEY') === 'true';
  const userKey = isCustomKey ? localStorage.getItem('MY_GEMINI_KEY') : null;

  try {
    const response = await fetch('/api/generate-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: promptInput, // Tên biến chứa câu lệnh của bạn
        userKey: userKey,    // Gửi key khách (nếu có)
        config: videoConfig  // Các cài đặt khác
      })
    });

    const result = await response.json();

    // SỬA LỖI VIDEO 100% KHÔNG XEM ĐƯỢC:
    // Thêm tham số thời gian để trình duyệt không lấy bản cache lỗi
    if (result.videoUri) {
      const freshVideoUrl = `${result.videoUri}?t=${Date.now()}`;
      setVideoUrl(freshVideoUrl); 
    }
  } catch (error) {
    console.error("Lỗi:", error);
  } finally {
    setLoading(false);
  }
};
