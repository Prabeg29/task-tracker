import { Request, Response } from "express";

import { UserMapper } from "./user.mapper";
import { UserService } from "./user.service";
import { StatusCodes } from "../../enums/status-codes.enum";

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
