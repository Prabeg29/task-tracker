import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { UserMapper } from "../users/user.mapper";
import { UserService } from "../users/user.service";
import { CreateUserDto, User } from "../users/user.type";

export class AuthController {
  constructor(
    protected readonly userService: UserService,
  ) { }

  public register = async (req: Request, res: Response): Promise<void> => {
    const user: User = await this.userService.create(req.body as CreateUserDto);

    res.status(StatusCodes.CREATED)
      .json({ message: "Registration successfully.", user: UserMapper.toResponseDto(user) });
  };
}
