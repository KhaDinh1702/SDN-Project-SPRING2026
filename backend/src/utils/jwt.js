import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ override: false });

export const signToken = ({
  payload,
  privateKey,
  options = { algorithm: 'HS256' },
}) => {
  if (
    !privateKey ||
    typeof privateKey !== 'string' ||
    privateKey.trim() === ''
  ) {
    const err = new Error('JWT_PRIVATE_KEY is not configured');
    console.error('signToken error: privateKey is invalid');
    return Promise.reject(err);
  }

  return new Promise((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });
};

export const verifyToken = ({ token, privateKey }) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, privateKey, (error, decoded) => {
      if (error) return reject(error);
      resolve(decoded);
    });
  });
};
