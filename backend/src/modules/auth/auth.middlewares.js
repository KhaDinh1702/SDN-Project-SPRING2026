import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import { OAuth2Client } from 'google-auth-library';
import HTTP_STATUS from '../../constants/httpStatus.js';
import { USERS_MESSAGES } from '../../constants/messages.js';
import { ErrorWithStatus } from '../../utils/error.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const accessTokenValidator = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.UNAUTHORIZED,
      message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
    });
  }

  const [type, token] = authorization.split(' ');

  if (type !== 'Bearer' || !token) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.UNAUTHORIZED,
      message: USERS_MESSAGES.ACCESS_TOKEN_IS_INVALID,
    });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN);
    next();
  } catch {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.UNAUTHORIZED,
      message: USERS_MESSAGES.ACCESS_TOKEN_IS_INVALID,
    });
  }
};

export const requireRole =
  (roles = []) =>
  async (req, res, next) => {
    const user = await User.findById(req.user.user_id).populate('role_id');

    if (!roles.includes(user.role_id.name)) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.FORBIDDEN,
        message: USERS_MESSAGES.PERMISSION_DENIED,
      });
    }

    next();
  };

export const verifyGoogleToken = async (req, res, next) => {
  const { credential } = req.body;

  if (!credential) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.BAD_REQUEST,
      message: USERS_MESSAGES.GOOGLE_TOKEN_REQUIRED,
    });
  }

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  req.payload = ticket.getPayload();
  next();
};
