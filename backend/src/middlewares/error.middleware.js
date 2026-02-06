import HTTP_STATUS from '../constants/httpStatus.js';
import { ErrorWithStatus } from '../utils/error.js';

export const errorHandler = (err, req, res, next) => {
  // lỗi chủ động throw
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json({
      message: err.message,
      errors: err.errors,
    });
  }

  // lỗi không kiểm soát
  console.error(err);

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: 'Internal Server Error',
  });
};
