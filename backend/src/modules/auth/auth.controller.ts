import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { CreateUserDto } from "../users/user.type";
import { UserService } from "../users/user.service";

export class AuthController {
  constructor(
    protected readonly userService: UserService,
  ) { }

  public register = async (req: Request, res: Response): Promise<void> => {
    await this.userService.create(req.body as CreateUserDto);

    res.status(StatusCodes.CREATED)
      .json({ message: 'Signup successfully.' });
  };
}
