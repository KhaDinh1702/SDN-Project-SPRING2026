import crypto from 'crypto';
import bcrypt from 'bcrypt';
import User from '../../models/User.js';
import Role from '../../models/Role.js';
import RefreshToken from '../../models/RefreshToken.js';
import HTTP_STATUS from '../../constants/httpStatus.js';
import { USERS_MESSAGES } from '../../constants/messages.js';
import { signToken } from '../../utils/jwt.js';
import { ErrorWithStatus } from '../../utils/error.js';
import { sendEmail } from '../../utils/sendEmail.js';

class AuthService {
  async checkEmailExist(email) {
    return User.findOne({ email })
      .select(
        '_id email google_id password_hash is_active role_id first_name last_name',
      )
      .populate('role_id');
  }

  async signAccessToken(user_id) {
    const secret = process.env.JWT_SECRET_ACCESS_TOKEN;
    if (
      !secret ||
      secret.trim() === '' ||
      secret.includes('your-super-secret') ||
      secret.includes('change-this')
    ) {
      console.error('JWT_SECRET_ACCESS_TOKEN error in signAccessToken:', {
        exists: !!secret,
        isUndefined: secret === undefined,
        isEmpty: !secret || secret.trim() === '',
        length: secret?.length,
        value: secret ? `${secret.substring(0, 20)}...` : 'undefined',
      });
      throw new ErrorWithStatus({
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message:
          'JWT_SECRET_ACCESS_TOKEN is not configured properly. Please check your environment variables and restart the server.',
      });
    }

    return signToken({
      privateKey: secret.trim(),
      payload: { user_id },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN },
    });
  }

  async signRefreshToken(user_id) {
    const secret = process.env.JWT_SECRET_REFRESH_TOKEN;
    if (
      !secret ||
      secret.trim() === '' ||
      secret.includes('your-super-secret') ||
      secret.includes('change-this')
    ) {
      console.error('JWT_SECRET_REFRESH_TOKEN error in signRefreshToken:', {
        exists: !!secret,
        isUndefined: secret === undefined,
        isEmpty: !secret || secret.trim() === '',
        length: secret?.length,
        value: secret ? `${secret.substring(0, 20)}...` : 'undefined',
      });
      throw new ErrorWithStatus({
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message:
          'JWT_SECRET_REFRESH_TOKEN is not configured properly. Please check your environment variables and restart the server.',
      });
    }

    return signToken({
      privateKey: secret.trim(),
      payload: { user_id },
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN },
    });
  }

  async register(payload) {
    const { email, password, ...rest } = payload;

    const normalizedEmail = email.toLowerCase();

    const user = await this.checkEmailExist(normalizedEmail);

    if (user) {
      if (user.google_id) {
        throw new ErrorWithStatus({
          status: HTTP_STATUS.BAD_REQUEST,
          message: USERS_MESSAGES.EMAIL_REGISTERED_WITH_GOOGLE,
        });
      }
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: USERS_MESSAGES.EMAIL_ALREADY_EXISTS,
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const customerRole = await Role.findOne({ name: 'customer' });

    if (!customerRole) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: 'Customer role not found. Please seed roles collection.',
      });
    }

    const newUser = await User.create({
      ...rest,
      email: normalizedEmail,
      password_hash,
      role_id: customerRole._id,
    });

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(newUser._id.toString()),
      this.signRefreshToken(newUser._id.toString()),
    ]);

    await RefreshToken.create({
      user_id: newUser._id,
      token: refreshToken,
      expires_at: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      ),
    });

    return {
      user: {
        id: newUser._id,
        email: newUser.email,
        role: customerRole.name,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(payload) {
    const { email, password } = payload;
    const user = await this.checkEmailExist(email);

    if (!user) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT,
      });
    }

    if (user.google_id && !user.password_hash) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: USERS_MESSAGES.ACCOUNT_REGISTERED_WITH_GOOGLE,
      });
    }

    if (!user.is_active) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.FORBIDDEN,
        message: USERS_MESSAGES.ACCOUNT_DISABLED,
      });
    }

    const isMatched = await bcrypt.compare(password, user.password_hash);

    if (!isMatched) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT,
      });
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user._id.toString()),
      this.signRefreshToken(user._id.toString()),
    ]);

    await RefreshToken.create({
      user_id: user._id,
      token: refreshToken,
      expires_at: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      ),
    });

    return {
      user: {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role_id: user.role_id.name,
      },
      accessToken,
      refreshToken,
    };
  }

  async forgotPassword(payload) {
    const { email } = payload;

    if (!email) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: USERS_MESSAGES.EMAIL_IS_INVALID,
      });
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // SECURITY: không tiết lộ email có tồn tại hay không
      return null;
    }

    // raw token gửi qua email
    const resetToken = crypto.randomBytes(32).toString('hex');

    // hash token lưu DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Reset Your Password',
      html: `
      <h3>Password Reset Request</h3>
      <p>You requested to reset your password.</p>
      <p>Click the link below (valid for 1 hour):</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
    });

    // DEV ONLY (để test Postman)
    if (process.env.NODE_ENV === 'development') {
      return { email: user.email, token: resetToken };
    }
    return null;
  }

  async resetPassword(payload) {
    const { token, password } = payload;

    if (!token || !password) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: 'Token and password are required',
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: 'Token is invalid or expired',
      });
    }

    // update password
    user.password_hash = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return true;
  }

  async googleAuth(payload) {
    const { email, given_name, family_name, sub: google_id, picture } = payload;

    const normalizedEmail = email.toLowerCase();

    let user = await this.checkEmailExist(normalizedEmail);

    if (user && !user.google_id) {
      user.google_id = google_id;
      await user.save();
    }

    if (!user) {
      const customerRole = await Role.findOne({ name: 'customer' });
      const username = email.split('@')[0];
      user = await User.create({
        email: normalizedEmail,
        username,
        first_name: given_name || '',
        last_name: family_name || '',
        password_hash: null,
        role_id: customerRole?._id,
        google_id,
        avatar_url: picture || null,
      });
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user._id.toString()),
      this.signRefreshToken(user._id.toString()),
    ]);

    await RefreshToken.create({
      user_id: user._id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      user: {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role_id: user.role_id,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken) {
    const tokenRecord = await RefreshToken.findOne({ token: refreshToken });

    if (!tokenRecord) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID,
      });
    }

    if (tokenRecord.expires_at < new Date()) {
      await RefreshToken.deleteOne({ _id: tokenRecord._id });

      throw new ErrorWithStatus({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: USERS_MESSAGES.REFRESH_TOKEN_IS_EXPIRED,
      });
    }

    const userId = tokenRecord.user_id.toString();

    const [accessToken, newRefreshToken] = await Promise.all([
      this.signAccessToken(userId),
      this.signRefreshToken(userId),
    ]);

    await RefreshToken.deleteOne({ token: refreshToken });

    await RefreshToken.create({
      user_id: userId,
      token: newRefreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(user_id) {
    await RefreshToken.deleteMany({ user_id });
    return { message: USERS_MESSAGES.LOGOUT_SUCCESS };
  }
}

const authService = new AuthService();
export default AuthService;
