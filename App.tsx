import React, { useState, useEffect } from 'react';

function App() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [promptInput, setPromptInput] = useState("");
  
  // Trạng thái cho API Key riêng
  const [isCustomKey, setIsCustomKey] = useState(localStorage.getItem('USE_CUSTOM_KEY') === 'true');
  const [showKeyPopup, setShowKeyPopup] = useState(false);
  const [tempKey, setTempKey] = useState(localStorage.getItem('MY_GEMINI_KEY') || "");

  // Hàm lưu Key riêng
  const saveCustomKey = () => {
    localStorage.setItem('MY_GEMINI_KEY', tempKey);
    localStorage.setItem('USE_CUSTOM_KEY', 'true');
    setIsCustomKey(true);
    setShowKeyPopup(false);
    alert("Đã lưu Key riêng thành công!");
  };

  // HÀM CHÍNH: TẠO VIDEO (Xử lý vị trí 1)
  const handleGenerateVideo = async () => {
    setLoading(true);
    setVideoUrl(null); // Reset video cũ

    const userKey = isCustomKey ? localStorage.getItem('MY_GEMINI_KEY') : null;

    try {
      // Gọi đến API trung gian trên Vercel
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: promptInput, 
          userKey: userKey, // Sẽ gửi null nếu dùng key hệ thống
        })
      });

      const result = await response.json();

      // FIX LỖI HIỂN THỊ: Ép trình duyệt load lại video mới bằng timestamp
      if (result.videoUri) {
        const finalUrl = `${result.videoUri}?t=${Date.now()}`;
        setVideoUrl(finalUrl);
      } else {
        alert("Lỗi: Không nhận được đường dẫn video!");
      }
    } catch (error) {
      console.error("Lỗi tạo video:", error);
      alert("Có lỗi xảy ra trong quá trình tạo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Gemini Video Studio</h1>

      {/* PHẦN ĐIỀU KHIỂN API */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <label>
          <input 
            type="checkbox" 
            checked={isCustomKey} 
            onChange={(e) => {
              setIsCustomKey(e.target.checked);
              localStorage.setItem('USE_CUSTOM_KEY', e.target.checked);
              if(e.target.checked) setShowKeyPopup(true);
            }} 
          />
          DÙNG KEY RIÊNG (Chế độ A)
        </label>
        {isCustomKey && <button onClick={() => setShowKeyPopup(true)} style={{ marginLeft: '10px' }}>Sửa Key</button>}
      </div>

      {/* INPUT PROMPT */}
      <textarea 
        value={promptInput}
        onChange={(e) => setPromptInput(e.target.value)}
        placeholder="Nhập mô tả video tại đây..."
        style={{ width: '100%', height: '100px', marginBottom: '10px' }}
      />

      <button 
        onClick={handleGenerateVideo} 
        disabled={loading}
        style={{ padding: '10px 20px', cursor: 'pointer', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}
      >
        {loading ? "Đang tạo video (Vui lòng đợi)..." : "TẠO VIDEO"}
      </button>

      <hr style={{ margin: '30px 0' }} />

      {/* PHẦN HIỂN THỊ VIDEO (Vị trí 2) */}
      <div style={{ width: '100%', minHeight: '300px', background: '#000', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {videoUrl ? (
          <video 
            key={videoUrl} // Buộc React render lại thẻ video mới
            controls 
            autoPlay 
            style={{ width: '100%', borderRadius: '10px' }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <p style={{ color: '#fff' }}>{loading ? "Đang xử lý 100%..." : "Video sẽ hiển thị ở đây"}</p>
        )}
      </div>

      {/* POPUP NHẬP KEY (Chế độ A) */}
      {showKeyPopup && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', width: '300px' }}>
            <h3>Nhập Gemini API Key</h3>
            <input 
              type="password" 
              value={tempKey} 
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="Dán API Key của bạn"
              style={{ width: '100%', marginBottom: '10px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={saveCustomKey} style={{ background: 'green', color: '#white' }}>Lưu</button>
              <button onClick={() => setShowKeyPopup(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
