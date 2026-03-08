import { useState } from 'react';
import { Button, message } from 'antd';
import {
  MailOutlined,
  LockOutlined,
  ArrowLeftOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import './Login.css';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import { API_URL } from '../../../config';
import { GoogleLogin } from '@react-oauth/google';
import { useContext } from 'react';
import { CartContext } from '../../../context/CartContext';

export default function Login() {
  const navigate = useNavigate();
  const { reloadCart } = useContext(CartContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleLogin = async () => {
    if (!isFormValid) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      // Save token & user info
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      reloadCart();

      message.success('Đăng nhập thành công!');

      // Redirect based on role
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (data.user.role === 'manager') {
        navigate('/manager/dashboard');
      } else if (data.user.role === 'staff') {
        navigate('/staff/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      message.error(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='login-page'>
        <Button
          type='link'
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            fontSize: '16px',
            color: '#333',
          }}
        >
          Về trang chủ
        </Button>
        <div className='login-card'>
          <h1>Chào mừng trở lại</h1>
          <p className='subtitle'>Đăng nhập vào tài khoản Fresh Market của bạn</p>

          {/* EMAIL */}
          <label>Địa chỉ Email</label>
          <div className={`input-box ${email && !isEmailValid ? 'error' : ''}`}>
            <MailOutlined />
            <input
              type='email'
              placeholder='you@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {email && !isEmailValid && (
            <span className='error-text'>Địa chỉ email không hợp lệ</span>
          )}

          {/* PASSWORD */}
          <label>Mật khẩu</label>
          <div
            className={`input-box ${password && !isPasswordValid ? 'error' : ''
              }`}
          >
            <LockOutlined />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Nhập mật khẩu của bạn'
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
          {password && !isPasswordValid && (
            <span className='error-text'>
              Mật khẩu phải có ít nhất 6 ký tự
            </span>
          )}

          {/* OPTIONS */}
          <div className='login-options'>
            <label className='remember'>
              <input type='checkbox' />
              Ghi nhớ đăng nhập
            </label>
            <span
              className='forgot'
              onClick={() => navigate('/forgot-password')}
              style={{ cursor: 'pointer', color: '#1890ff' }}
            >
              Quên mật khẩu?
            </span>
          </div>

          {/* SIGN IN */}
          <Button
            type='primary'
            block
            loading={loading}
            disabled={!isFormValid}
            onClick={handleLogin}
            className='login-btn'
          >
            Đăng nhập
          </Button>

          {/* DIVIDER */}
          <div className='divider'>
            <span>hoặc</span>
          </div>

          {/* GOOGLE */}
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await fetch(`${API_URL}/api/auth/google`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({
                    credential: credentialResponse.credential,
                  }),
                });

                const data = await res.json();

                if (!res.ok) {
                  throw new Error(data.message || 'Đăng nhập Google thất bại');
                }

                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                message.success('Đăng nhập thành công!');

                if (data.user.role === 'admin') {
                  navigate('/admin/dashboard');
                } else if (data.user.role === 'manager') {
                  navigate('/manager/dashboard');
                } else if (data.user.role === 'staff') {
                  navigate('/staff/dashboard');
                } else {
                  navigate('/');
                }
              } catch (err) {
                message.error(err.message || 'Đăng nhập Google thất bại');
              }
            }}
            onError={() => message.error('Đăng nhập Google thất bại')}
          />

          <p className='signup-text'>
            Chưa có tài khoản?{' '}
            <span onClick={() => navigate('/register')}>Đăng ký tại đây</span>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
