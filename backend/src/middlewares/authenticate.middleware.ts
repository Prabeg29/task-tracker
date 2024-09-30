import jwt from "jsonwebtoken";
import { NextFunction, Request, Response} from "express";

import config from "../config";
import { StatusCodes } from "../enums/status-codes.enum";
import { HttpException } from "../exceptions/http.exception";

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  let token: string = "";

  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  } else {
    throw new HttpException("No token provided", StatusCodes.UNAUTHORIZED); 
  }

  const decoded: unknown = jwt.verify(token, config.secrets.jwt);
  req.currentUser = decoded as { id: number; email: string; role: string };

  next();
};
