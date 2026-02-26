import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import { OAuth2Client } from 'google-auth-library';
import HTTP_STATUS from '../../constants/httpStatus.js';
import { USERS_MESSAGES } from '../../constants/messages.js';
import { ErrorWithStatus } from '../../utils/error.js';
import { wrapAsync } from '../../utils/handlers.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const accessTokenValidator = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return next(
      new ErrorWithStatus({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
      }),
    );
  }

  const [type, token] = authorization.split(' ');

  if (type !== 'Bearer' || !token) {
    return next(
      new ErrorWithStatus({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: USERS_MESSAGES.ACCESS_TOKEN_IS_INVALID,
      }),
    );
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN);
    next();
  } catch {
    return next(
      new ErrorWithStatus({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: USERS_MESSAGES.ACCESS_TOKEN_IS_INVALID,
      }),
    );
  }
};

export const requireRole = (roles = []) =>
  wrapAsync(async (req, res, next) => {
    let user = req.currentUser;

    if (!user) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: USERS_MESSAGES.ACCESS_TOKEN_IS_INVALID,
      });
    }

    if (!roles.includes(user.role_id.name)) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.FORBIDDEN,
        message: USERS_MESSAGES.PERMISSION_DENIED,
      });
    }
    return next();
  });

export const loadUser = wrapAsync(async (req, res, next) => {
  const user = await User.findById(req.user.user_id).populate('role_id');

  if (!user) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.UNAUTHORIZED,
      message: USERS_MESSAGES.USER_NOT_FOUND,
    });
  }

  if (!user.is_active) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.FORBIDDEN,
      message: USERS_MESSAGES.USER_DISABLED,
    });
  }

  req.currentUser = user;
  return next();
});

export const verifyGoogleToken = wrapAsync(async (req, res, next) => {
  try {
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
  } catch (error) {
    next();
  }
});

export const requireAuth = [accessTokenValidator, loadUser];
