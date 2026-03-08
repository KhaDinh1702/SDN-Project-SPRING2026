import { useState } from 'react';
import { Button, message } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import './Register.css';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import { API_URL } from '../../../config';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isPasswordValid = form.password.length >= 6;
  const isConfirmValid = form.password === form.confirmPassword;

  const isFormValid =
    form.firstName &&
    form.lastName &&
    isEmailValid &&
    isPasswordValid &&
    isConfirmValid &&
    form.agree;

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    if (!isFormValid) {
      message.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    const username = form.email.split('@')[0];

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone || undefined,
          password: form.password,
          username,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Đăng ký thất bại');
      }

      message.success('Tạo tài khoản thành công!');
      navigate('/login');
    } catch (err) {
      message.error(err.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='register-page'>
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
        <div className='register-card'>
          <h1>Tạo Tài khoản</h1>
          <p className='subtitle'>Tham gia Fresh Market và bắt đầu mua sắm nông sản sạch</p>

          {/* NAME */}
          <div className='row'>
            <div>
              <label>Tên</label>
              <div className='input-box'>
                <UserOutlined />
                <input
                  placeholder='John'
                  value={form.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label>Họ</label>
              <div className='input-box'>
                <UserOutlined />
                <input
                  placeholder='Doe'
                  value={form.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* EMAIL */}
          <label>Địa chỉ Email</label>
          <div
            className={`input-box ${form.email && !isEmailValid ? 'error' : ''
              }`}
          >
            <MailOutlined />
            <input
              placeholder='you@example.com'
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          {/* PHONE */}
          <label>
            Số điện thoại{' '}
            <span style={{ color: '#999', fontWeight: 400 }}>(tùy chọn)</span>
          </label>
          <div className='input-box'>
            <PhoneOutlined />
            <input
              placeholder='0123 456 789'
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <label>Mật khẩu</label>
          <div className='input-box'>
            <LockOutlined />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Tạo mật khẩu mạnh'
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
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

          {/* CONFIRM PASSWORD */}
          <label>Xác nhận Mật khẩu</label>
          <div
            className={`input-box ${form.confirmPassword && !isConfirmValid ? 'error' : ''
              }`}
          >
            <LockOutlined />
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder='Xác nhận lại mật khẩu'
              value={form.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
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

          {/* TERMS */}
          <div className='terms'>
            <input
              type='checkbox'
              checked={form.agree}
              onChange={(e) => handleChange('agree', e.target.checked)}
            />
            <span>
              Tôi đồng ý với <strong>Điều khoản Dịch vụ</strong> và{' '}
              <strong>Chính sách Bảo mật</strong>
            </span>
          </div>

          {/* SUBMIT */}
          <Button
            type='primary'
            block
            className='register-btn'
            disabled={!isFormValid || loading}
            loading={loading}
            onClick={handleRegister}
          >
            {loading ? 'Đang tạo...' : 'Đăng ký'}
          </Button>

          <div className='divider'>
            <span>hoặc</span>
          </div>

          <Button
            block
            className='google-btn'
          >
            Tiếp tục với Google
          </Button>

          <p className='signin-text'>
            Đã có tài khoản?{' '}
            <strong
              className='signin-link'
              onClick={() => navigate('/login')}
            >
              Đăng nhập tại đây
            </strong>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
