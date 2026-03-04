import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Homepage</h1>
      
      {user ? (
        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 18, marginBottom: 20 }}>
            Xin chào, <strong>{user.first_name} {user.last_name}</strong>!
          </p>
          <p style={{ color: "#666", marginBottom: 20 }}>
            Email: {user.email}
          </p>
          <button onClick={handleLogout} style={{ padding: "10px 20px" }}>
            Đăng xuất
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
          <button onClick={() => navigate("/login")}>Đăng nhập</button>
          <button onClick={() => navigate("/register")}>Đăng ký</button>
        </div>
      )}
    </div>
  );
}