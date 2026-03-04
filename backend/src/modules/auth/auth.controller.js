import AuthService from './auth.service.js';
import HTTP_STATUS from '../../constants/httpStatus.js';

const authService = new AuthService();

export const registerController = async (req, res) => {
  const result = await authService.register(req.body);
  const { refreshToken, ...rest } = result;

  // Set refreshToken in httpOnly cookie (7 days)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(HTTP_STATUS.CREATED).json({
    message: 'Register success',
    ...rest,
  });
};

export const loginController = async (req, res) => {
  const result = await authService.login(req.body);
  const { refreshToken, ...rest } = result;

  // Set refreshToken in httpOnly cookie (7 days)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(HTTP_STATUS.OK).json({
    message: 'Login success',
    ...rest,
  });
};

export const forgotPasswordController = async (req, res) => {
  const result = await authService.forgotPassword(req.body);

  // Không tiết lộ email tồn tại hay không
  res.status(HTTP_STATUS.OK).json({
    message: 'If email exists, reset instructions were sent',
    data: result, // controller sẽ dùng token này để gửi mail
  });
};

export const resetPasswordController = async (req, res) => {
  await authService.resetPassword(req.body, req.query);

  return res.status(200).json({
    message: 'Password has been reset successfully',
    data: null,
  });
};

export const googleAuthController = async (req, res) => {
  const { payload } = req; // payload đã verify từ middleware
  const result = await authService.googleAuth(payload);
  const { refreshToken, ...rest } = result;

  // Set refreshToken in httpOnly cookie (7 days)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(HTTP_STATUS.OK).json({
    message: 'Google login success',
    ...rest,
  });
};

export const refreshTokenController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: 'Refresh token not found',
    });
  }

  const result = await authService.refreshAccessToken(refreshToken);
  const { refreshToken: newRefreshToken, ...rest } = result;

  // Set new refreshToken in httpOnly cookie (7 days)
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(HTTP_STATUS.OK).json({
    message: 'Refresh token success',
    ...rest,
  });
};

export const logoutController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(204);
  }

  await authService.logout(refreshToken);

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return res.status(200).json({
    message: 'Logout is successful',
  });
};
