import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { NextFunction, Request, Response } from 'express';

import { ValidationException } from '../exceptions/validation.exception';

const ajv = new Ajv({allErrors: true});
addFormats(ajv);

export const validate = (schema: any) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const validateFunction = ajv.compile(schema);
    const valid = validateFunction(req.body);

    if (!valid) {
      next(new ValidationException(validateFunction.errors));
    }

    next();
  };
};
