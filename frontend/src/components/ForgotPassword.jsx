import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import { API_URL } from '../config';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        const msg =
          data.message ||
          'If the email exists, you will receive instructions by email.';
        message.success(msg);
      } else {
        const msg = data.message || 'Something went wrong. Please try again.';
        message.error(msg);
      }
    } catch (err) {
      message.error(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div className='login-page'>
        <div className='login-card'>
          <h1>Forgot Password</h1>
          <p className='subtitle'>
            Enter your email and we'll send instructions to reset your password.
          </p>

          <label>Email Address</label>
          <div
            className={`input-box ${email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'error' : ''}`}
          >
            <MailOutlined />
            <input
              type='email'
              placeholder='you@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginTop: 18 }}>
            <Button
              type='primary'
              block
              className='login-btn'
              onClick={handleSubmit}
              loading={loading}
              disabled={!email}
            >
              Send Reset Link
            </Button>
          </div>

          {status && <p style={{ marginTop: 12, color: '#666' }}>{status}</p>}

          <p className='signup-text'>
            <Link to='/login'>Back to login</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
