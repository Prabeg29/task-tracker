import addFormats from "ajv-formats";
import Ajv, { ErrorObject } from "ajv";
import { NextFunction, Request, Response } from "express";

import { ValidationException } from "../exceptions/validation.exception";

const ajv = new Ajv({allErrors: true});
addFormats(ajv);

export const validate = (schema: any) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const validateFunction = ajv.compile(schema);
    const valid = validateFunction(req.body);

    if (!valid) {
      next(new ValidationException(formatValidationErrors(validateFunction.errors)));
    }

    next();
  };
};

const formatValidationErrors = (errors: ErrorObject[]): Array<{ field: string; errors: string[] }> => {
  const errorMap: Map<string, string[]> = new Map();

  errors.forEach(({ instancePath, keyword, message, params }) => {
    let field = instancePath.replace("/", "");
    let errorMsg = message;

    if (keyword === "enum") {
      errorMsg += ` [${params.allowedValues}]`;
    }
    
    if (!instancePath.length) {
      if (keyword === "required") {
        field = params.missingProperty ?? "";
        errorMsg = keyword;
      } else if (keyword === "additionalProperties") {
        field = params.additionalProperty ?? "";
        errorMsg = "invalid attribute";
      }
    }

    if (!errorMap.has(field)) {
      errorMap.set(field, []);
    }

    errorMap.get(field)!.push(errorMsg);
  });

  return Array.from(errorMap, ([field, errors]) => ({ field, errors }));
};
