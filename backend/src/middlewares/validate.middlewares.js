import z, { ZodError } from 'zod';
import { EntityError } from '../utils/error.js';

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = {};

      for (const issue of error.issues) {
        const path = issue.path.filter((p) => typeof p !== 'number');
        const key = path.join('.') || 'form';

        errors[key] = issue.message;
      }

      return next(
        new EntityError({
          errors,
        }),
      );
    }

    next(error);
  }
};
