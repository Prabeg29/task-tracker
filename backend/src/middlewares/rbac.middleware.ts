import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";

import config from "../config";
import { HttpException } from "../exceptions/http.exception";

export const checkPermission = (permission: string) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    console.log('role: ', req.currentUser.role);
    const userPermissions = getPermissionsByRole(req.currentUser.role);

    if (!userPermissions.includes(permission)) {
      throw new HttpException("Unauthorized to access the resource", StatusCodes.FORBIDDEN);
    }

    next();
  };
};

function getPermissionsByRole(roleName: string): string[] {
  const role = config.permissions.find(permission => permission.role === roleName.toLowerCase());

  return role ? role.permissions : [];
}
