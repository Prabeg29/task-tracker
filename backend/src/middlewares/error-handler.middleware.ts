import { JsonWebTokenError } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import logger from "../utils/logger.util";
import { StatusCodes } from "../enums/status-codes.enum";
import { HttpException } from "../exceptions/http.exception";
import { ValidationException } from "../exceptions/validation.exception";

const buildError = (error: Error) => {
  if (error instanceof JsonWebTokenError) {
    return {
      statusCode: StatusCodes.UNAUTHORIZED,
      message   : error.message,
    };
  }

  if (error instanceof ValidationException) {
    return {
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      message   : error.validationErrors,
    };

  }

  if (error instanceof HttpException) {
    return {
      statusCode: error.statusCode,
      message   : error.message,
    };
  }

  return {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message   : "Something went wrong",
  };
};

export const routeNotFound = (_req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: "Resource not found" });

  next();
};

export const genericErrorHandler = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  const err = buildError(error);

  if (process.env.NODE_ENV !== "test") {
    logger.error(`${req.method}:${req.path} >> ${error.stack} || ${error.message}`);
  }

  res.status(err.statusCode).json({ message: err.message });
};
