import { useState } from "react";
import { Button, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import "./Login.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleLogin = () => {
    if (!isFormValid) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Login successful 🎉");
    }, 1000);
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
            className={`input-box ${
              password && !isPasswordValid ? "error" : ""
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
          <Button block className="google-btn">
            Continue with Google
          </Button>

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
