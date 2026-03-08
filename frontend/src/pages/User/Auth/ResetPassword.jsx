import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import {
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import { API_URL } from '../../../config';
import './Login.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      message.warning('Token không hợp lệ');
    }
  }, [token]);

  const isValid = password.length >= 6 && password === confirm;

  async function handleSubmit(e) {
    e && e.preventDefault();
    if (!isValid) return message.error('Vui lòng kiểm tra lại mật khẩu');
    setLoading(true);
    try {
      const url = `${API_URL}/api/auth/reset-password?token=${encodeURIComponent(
        token,
      )}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Đặt lại mật khẩu thất bại');

      message.success(
        data.message || 'Mật khẩu đã được đặt lại. Vui lòng đăng nhập.',
      );
      navigate('/login');
    } catch (err) {
      message.error(err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div className='login-page'>
        <div className='login-card'>
          <h1>Đặt lại mật khẩu</h1>
          <p className='subtitle'>Nhập mật khẩu mới cho tài khoản của bạn.</p>

          <label>Mật khẩu mới</label>
          <div
            className={`input-box ${password && password.length < 6 ? 'error' : ''}`}
          >
            <LockOutlined />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Mật khẩu mới'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPassword ? (
              <EyeOutlined
                className='eye-icon'
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <EyeInvisibleOutlined
                className='eye-icon'
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          {password && password.length < 6 && (
            <span className='error-text'>
              Mật khẩu phải có ít nhất 6 ký tự
            </span>
          )}

          <label>Xác nhận mật khẩu</label>
          <div
            className={`input-box ${confirm && confirm !== password ? 'error' : ''}`}
          >
            <LockOutlined />
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder='Xác nhận mật khẩu'
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            {showConfirm ? (
              <EyeOutlined
                className='eye-icon'
                onClick={() => setShowConfirm(false)}
              />
            ) : (
              <EyeInvisibleOutlined
                className='eye-icon'
                onClick={() => setShowConfirm(true)}
              />
            )}
          </div>
          {confirm && confirm !== password && (
            <span className='error-text'>Mật khẩu không khớp</span>
          )}

          <div style={{ marginTop: 18 }}>
            <Button
              type='primary'
              block
              className='login-btn'
              onClick={handleSubmit}
              loading={loading}
              disabled={!isValid || !token}
            >
              Đặt lại mật khẩu
            </Button>
          </div>

          <p
            className='signup-text'
            style={{ marginTop: 12 }}
          >
            <a onClick={() => navigate('/login')}>Quay lại đăng nhập</a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
