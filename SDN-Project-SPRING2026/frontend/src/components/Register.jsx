import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from '../config';
export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const username = email.split('@')[0];
    
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          first_name: firstName,
          last_name: lastName,
          email, 
          password,
          username
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Đăng ký thất bại");
      }
      
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Lỗi đăng ký");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 20 }}>
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <input 
            placeholder="First Name" 
            value={firstName} 
            onChange={e => setFirstName(e.target.value)} 
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input 
            placeholder="Last Name" 
            value={lastName} 
            onChange={e => setLastName(e.target.value)} 
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
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
        <div style={{ marginBottom: 12 }}>
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>
      
      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
      
      <p style={{ marginTop: 12 }}>
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </div>
  );
}