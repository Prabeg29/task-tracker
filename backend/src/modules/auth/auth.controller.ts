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
    const user: User & { accessToken: string; }  = await this.userService.create(req.body as CreateUserDto);

    res.status(StatusCodes.CREATED)
      .json({ message: "Registration successful.", user: UserMapper.toResponseDto(user) });
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    const user: User & { accessToken: string; } = await this.userService.signin(req.body as Partial<CreateUserDto>);

    res.status(StatusCodes.OK)
      .json({ message: "Login successful.", user: UserMapper.toResponseDto(user) });
  };
}
