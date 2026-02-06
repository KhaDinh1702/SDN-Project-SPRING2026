import AuthService from './auth.service.js';
import HTTP_STATUS from '../../constants/httpStatus.js';

const authService = new AuthService();

export const registerController = async (req, res) => {
  const result = await authService.register(req.body);
  res.status(HTTP_STATUS.CREATED).json({
    message: 'Register success',
    ...result,
  });
};

export const loginController = async (req, res) => {
  const result = await authService.login(req.body);
  res.status(HTTP_STATUS.OK).json({
    message: 'Login success',
    ...result,
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
  const result = await authService.resetPassword(req.body);

  return res.status(200).json({
    message: 'Password has been reset successfully',
    data: null,
  });
};

export const googleAuthController = async (req, res) => {
  const { payload } = req; // payload đã verify từ middleware
  const result = await authService.googleAuth(payload);

  res.status(HTTP_STATUS.OK).json({
    message: 'Google login success',
    ...result,
  });
};

export const refreshTokenController = async (req, res) => {
  const { refresh_token: refreshToken } = req.body;

  const result = await authService.refreshAccessToken(refreshToken);

  res.status(HTTP_STATUS.OK).json({
    message: 'Refresh token success',
    ...result,
  });
};

export const logoutController = async (req, res) => {
  const { user_id } = req.user;
  const result = await authService.logout(user_id);
  res.status(HTTP_STATUS.OK).json(result);
};
