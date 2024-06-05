import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { UserMapper } from "./user.mapper";
import { UserService } from "./user.service";

export class UserController {
  constructor(
    protected readonly userService: UserService
  ) { }

  public fetchAll = async (_req: Request, res: Response): Promise<void> => {
    const users = await this.userService.fetchAll();

    res.status(StatusCodes.OK).json({
      message: "Tasks fetched successfully",
      users  : UserMapper.toResponseDtoCollection(users),
    });
  };
}
