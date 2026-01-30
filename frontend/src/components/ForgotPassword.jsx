import React, { useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from '../config';
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus(data.message || "Nếu email tồn tại, bạn sẽ nhận được hướng dẫn qua email.");
      } else {
        setStatus(data.message || "Có lỗi, thử lại.");
      }
    } catch (err) {
      setStatus("Lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 20 }}>
      <h2>Quên mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <input 
            type="email"
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi yêu cầu"}
        </button>
      </form>
      
      {status && <p style={{ marginTop: 12, color: "#666" }}>{status}</p>}
      
      <p style={{ marginTop: 12 }}>
        <Link to="/login">Quay lại đăng nhập</Link>
      </p>
    </div>
  );
}