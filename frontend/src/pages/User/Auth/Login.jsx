import { useState } from "react";
import { Button, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import "./Login.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { API_URL } from "../../../config";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleLogin = async () => {
    if (!isFormValid) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save token & user info
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      message.success("Login successful!");

      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      message.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="login-page">
        <div className="login-card">
          <h1>Welcome Back</h1>
          <p className="subtitle">
            Sign in to your Fresh Market account
          </p>

          {/* EMAIL */}
          <label>Email Address</label>
          <div className={`input-box ${email && !isEmailValid ? "error" : ""}`}>
            <MailOutlined />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {email && !isEmailValid && (
            <span className="error-text">Invalid email address</span>
          )}

          {/* PASSWORD */}
          <label>Password</label>
          <div
            className={`input-box ${password && !isPasswordValid ? "error" : ""
              }`}
          >
            <LockOutlined />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {password && !isPasswordValid && (
            <span className="error-text">
              Password must be at least 6 characters
            </span>
          )}

          {/* OPTIONS */}
          <div className="login-options">
            <label className="remember">
              <input type="checkbox" />
              Remember me
            </label>
            <span className="forgot">Forgot Password?</span>
          </div>

          {/* SIGN IN */}
          <Button
            type="primary"
            block
            loading={loading}
            disabled={!isFormValid}
            onClick={handleLogin}
            className="login-btn"
          >
            Sign In
          </Button>

          {/* DIVIDER */}
          <div className="divider">
            <span>or</span>
          </div>

          {/* GOOGLE */}
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await fetch(`${API_URL}/api/auth/google`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({
                    credential: credentialResponse.credential,
                  }),
                });

                const data = await res.json();

                if (!res.ok) {
                  throw new Error(data.message || "Google login failed");
                }

                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("user", JSON.stringify(data.user));
                message.success("Login successful!");

                if (data.user.role === "admin") {
                  navigate("/admin/dashboard");
                } else {
                  navigate("/");
                }
              } catch (err) {
                message.error(err.message || "Google login failed");
              }
            }}
            onError={() => message.error("Google sign-in failed")}
          />

          {/* 👉 FIX CHỖ NÀY */}
          <p className="signup-text">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>
              Sign up here
            </span>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
