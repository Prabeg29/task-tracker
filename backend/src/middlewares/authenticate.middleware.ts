import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response} from "express";

import config from "../config";
import { HttpException } from "../exceptions/http.exception";

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    throw new HttpException("No token provided", StatusCodes.UNAUTHORIZED);
  }

  const token: string = req.headers.authorization.split(' ')[1];

  const decoded: any = jwt.verify(token, config.secrets.jwt);
  req.currentUser = decoded;

  next();
};
