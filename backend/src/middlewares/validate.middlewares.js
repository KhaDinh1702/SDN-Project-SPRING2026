import { ZodError } from 'zod';
import { EntityError } from '../utils/error.js';

export const validate =
  (schema, source = 'body') =>
  (req, res, next) => {
    try {
      const parsedData = schema.parse(req[source] || {});

      if (req[source] && typeof req[source] === 'object') {
        Object.assign(req[source], parsedData);
      }

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
