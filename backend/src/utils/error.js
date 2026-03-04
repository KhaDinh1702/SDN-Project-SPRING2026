import HTTP_STATUS from '../constants/httpStatus.js';

export class ErrorWithStatus extends Error {
  constructor({ status, message }) {
    super(message);

    this.status = status;
    this.message = message;
    this.name = 'ErrorWithStatus';

    Error.captureStackTrace(this, this.constructor);
  }
}

export class EntityError extends ErrorWithStatus {
  constructor({ errors, message = 'Validation Error' }) {
    super({
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      message,
    });

    this.errors = errors;
    this.name = 'EntityError';
  }
}
